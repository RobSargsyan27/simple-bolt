import { atom } from 'nanostores';

export const URL_CONFIGURABLE_PROVIDERS = ['Ollama', 'LMStudio', 'OpenAILike'];
export const LOCAL_PROVIDERS = ['OpenAILike', 'LMStudio', 'Ollama'];

export const promptStore = atom<string>('default');
export const enableContextOptimizationStore = atom<boolean>(true);
export const autoSelectStarterTemplate = atom<boolean>(false);
export const latestBranchStore = atom<boolean>(false);
export const isEventLogsEnabled = atom<boolean>(false);
export const isDebugMode = atom(false);
