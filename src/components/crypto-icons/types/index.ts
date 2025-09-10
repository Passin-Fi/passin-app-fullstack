export type ComponentProps = {
  className?: string;
  size?: number;        // For square icons, applies to both width and height
  width?: number;       // Specific width (overrides size)
  height?: number;      // Specific height (overrides size)
  alt?: string;
};

export type IconUrls = {
  lightMode: string;
  darkMode: string;
};

// Import enums from separate files
export { TokenSymbol } from './TokenSymbol';
export { WalletName } from './WalletName';
export { SystemName } from './SystemName';
