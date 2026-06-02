export interface EditorDocument {
  value: string;
  isBinary: boolean;
  filePath: string;
  scroll?: ScrollPosition;
}

export interface ScrollPosition {
  top?: number;
  left?: number;
  line?: number;
  column?: number;
}
