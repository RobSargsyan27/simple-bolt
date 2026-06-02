import { MODEL_REGEX, PROVIDER_REGEX } from '~/utils/constants';
import { Markdown } from './Markdown';

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  const sanitized = content.replace(MODEL_REGEX, '').replace(PROVIDER_REGEX, '').trim();

  return (
    <div className="overflow-hidden pt-[4px]">
      <Markdown limitedMarkdown>{sanitized}</Markdown>
    </div>
  );
}
