import type { Message } from 'ai';
import { forwardRef, type ForwardedRef } from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = forwardRef<HTMLDivElement, MessagesProps>(
  ({ id, isStreaming = false, messages = [], className }: MessagesProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div id={id} ref={ref} className={className}>
        {messages.length > 0
          ? messages.map((message, index) => {
              const { role, content } = message;
              const isUserMessage = role === 'user';
              const isLast = index === messages.length - 1;

              return (
                <div
                  key={index}
                  className={classNames('flex gap-4 p-6 w-full rounded-[calc(0.75rem-1px)]', {
                    'bg-bolt-elements-messages-background': isUserMessage || !isStreaming || !isLast,
                    'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                      isStreaming && isLast && !isUserMessage,
                    'mt-4': index > 0,
                  })}
                >
                  <div className="grid grid-col-1 w-full">
                    {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
                  </div>
                </div>
              );
            })
          : null}
        {isStreaming && (
          <div className="text-center w-full text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-4xl mt-4" />
        )}
      </div>
    );
  },
);
