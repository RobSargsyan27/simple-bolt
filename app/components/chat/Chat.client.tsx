import { useChat } from '@ai-sdk/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useMessageParser } from '~/lib/hooks';
import { chatStore } from '~/lib/stores/chat';
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from '~/utils/constants';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { BaseChat } from './BaseChat';
import { streamingState } from '~/lib/stores/streaming';

const logger = createScopedLogger('Chat');

export function Chat() {
  renderLogger.trace('Chat');
  return <ChatImpl />;
}

const ChatImpl = memo(() => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatStarted, setChatStarted] = useState(false);
  const { parseMessages, parsedMessages } = useMessageParser();

  const { messages, isLoading, input, handleInputChange, setInput, stop, append } = useChat({
    api: '/api/chat',
    body: {
      model: DEFAULT_MODEL,
      provider: { name: DEFAULT_PROVIDER.name, staticModels: [] },
      apiKeys: {},
      files: {},
      promptId: 'default',
      contextOptimization: false,
      chatMode: 'build',
      designScheme: undefined,
      supabase: undefined,
      maxLLMSteps: 16,
    },
    sendExtraMessageFields: true,
    onError: (e) => {
      logger.error('Request failed', e);
      toast.error(`Request failed: ${e?.message ?? 'Unknown error'}`);
    },
    onFinish: () => {
      logger.debug('Finished streaming');
    },
  });

  useEffect(() => {
    streamingState.set(isLoading);
  }, [isLoading]);

  useEffect(() => {
    parseMessages(messages, isLoading);
  }, [messages, isLoading, parseMessages]);

  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
      textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
    }
  }, [input, TEXTAREA_MAX_HEIGHT]);

  const sendMessage = useCallback(
    async (_event: React.UIEvent, messageInput?: string) => {
      const messageContent = messageInput || input;
      if (!messageContent?.trim() || isLoading) {
        return;
      }

      if (!chatStarted) {
        chatStore.setKey('started', true);
        setChatStarted(true);
      }

      append({ role: 'user', content: messageContent });
      setInput('');

      textareaRef.current?.blur();
    },
    [append, chatStarted, input, isLoading, setInput],
  );

  const displayMessages = messages.map((message, i) =>
    message.role === 'assistant' ? { ...message, content: parsedMessages[i] ?? '' } : message,
  );

  return (
    <BaseChat
      textareaRef={textareaRef}
      input={input}
      showChat
      chatStarted={chatStarted}
      isStreaming={isLoading}
      messages={displayMessages}
      sendMessage={sendMessage}
      handleStop={stop}
      handleInputChange={handleInputChange}
    />
  );
});

ChatImpl.displayName = 'ChatImpl';
