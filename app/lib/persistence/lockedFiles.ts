export type LockMode = 'edit' | 'read';

export interface LockedItem {
  path: string;
  chatId: string;
  isFolder: boolean;
  mode?: LockMode;
}

export function addLockedFile(_chatId: string, _path: string, _mode?: LockMode): void {}
export function removeLockedFile(_chatId: string, _path: string): void {}
export function addLockedFolder(_chatId: string, _path: string, _mode?: LockMode): void {}
export function removeLockedFolder(_chatId: string, _path: string): void {}
export function getLockedItemsForChat(_chatId: string): LockedItem[] {
  return [];
}
export function getLockedFilesForChat(_chatId: string): LockedItem[] {
  return [];
}
export function getLockedFoldersForChat(_chatId: string): LockedItem[] {
  return [];
}
export function isPathInLockedFolder(_chatId: string, _path: string): { locked: boolean; lockedBy?: string } {
  return { locked: false };
}
export function migrateLegacyLocks(_chatId: string): void {}
export function clearCache(): void {}
