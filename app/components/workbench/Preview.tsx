import { memo, useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { IconButton } from '~/components/ui/IconButton';
import { workbenchStore } from '~/lib/stores/workbench';

export const Preview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[0];
  const [iframeUrl, setIframeUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!activePreview) {
      setIframeUrl(undefined);
      return;
    }

    setIframeUrl(activePreview.baseUrl);
  }, [activePreview]);

  const reloadPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-bolt-elements-background-depth-2 p-2 flex items-center gap-1.5">
        <IconButton icon="i-ph:arrow-clockwise" onClick={reloadPreview} />
        <div className="flex-grow flex items-center gap-1 bg-bolt-elements-preview-addressBar-background border border-bolt-elements-borderColor text-bolt-elements-preview-addressBar-text rounded-full px-3 py-1 text-sm">
          <input
            className="w-full bg-transparent outline-none"
            value={iframeUrl ?? ''}
            readOnly
            placeholder="No preview running"
          />
        </div>
      </div>
      <div className="flex-1 border-t border-bolt-elements-borderColor flex justify-center items-center overflow-auto">
        {activePreview ? (
          <iframe
            ref={iframeRef}
            title="preview"
            className="border-none w-full h-full bg-white"
            src={iframeUrl}
            sandbox="allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation allow-same-origin"
            allow="cross-origin-isolated"
          />
        ) : (
          <div className="flex w-full h-full justify-center items-center bg-bolt-elements-background-depth-1 text-bolt-elements-textTertiary">
            No preview available
          </div>
        )}
      </div>
    </div>
  );
});
