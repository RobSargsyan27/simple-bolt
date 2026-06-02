import { useStore } from '@nanostores/react';
import { motion, type Variants } from 'framer-motion';
import { memo, useEffect } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { Preview } from './Preview';
import type { ITerminal } from '~/types/terminal';

const logger = createScopedLogger('Workbench');

const workbenchVariants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: 'var(--workbench-width)',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

let boltTerminalAttached = false;

function createHeadlessTerminal(): ITerminal {
  let onDataCb: ((data: string) => void) | undefined;

  return {
    cols: 80,
    rows: 24,
    reset: () => {},
    write: (data) => {
      logger.trace(data);
    },
    onData: (cb) => {
      onDataCb = cb;
    },
    input: (data) => {
      onDataCb?.(data);
    },
  };
}

interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

export const Workbench = memo(({ chatStarted }: WorkspaceProps) => {
  renderLogger.trace('Workbench');

  const showWorkbench = useStore(workbenchStore.showWorkbench);

  useEffect(() => {
    if (boltTerminalAttached) {
      return;
    }

    boltTerminalAttached = true;
    workbenchStore.attachBoltTerminal(createHeadlessTerminal());
  }, []);

  return (
    chatStarted && (
      <motion.div
        initial="closed"
        animate={showWorkbench ? 'open' : 'closed'}
        variants={workbenchVariants}
        className="z-workbench"
      >
        <div
          className={classNames(
            'fixed top-[calc(var(--header-height)+1.2rem)] bottom-6 w-[var(--workbench-inner-width)] z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier',
            {
              'left-[var(--workbench-left)]': showWorkbench,
              'left-[100%]': !showWorkbench,
            },
          )}
        >
          <div className="absolute inset-0 px-2 lg:px-4">
            <div className="h-full flex flex-col bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-sm rounded-lg overflow-hidden">
              <div className="relative flex-1 overflow-hidden">
                <Preview />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  );
});
