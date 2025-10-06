"use client";
import Image, { ImageProps } from "next/image";
import { ComponentProps } from "./types";
import { getIconPaths } from "./constants/imagePaths";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type CryptoIconProps = Omit<ComponentProps, 'alt'> & 
  Omit<ImageProps, 'src' | 'width' | 'height' | 'alt'> & {
  name: string;  // Tên icon (ví dụ: "BTC", "MetaMask", "Ethereum")
  mode?: "light" | "dark"; // Chế độ hiển thị (mặc định: "light")
  fallback?: React.ReactNode; // Component hiển thị khi không tìm thấy icon
  
  // Override Image props với types rõ ràng hơn
  width?: number;
  height?: number; 
  alt?: string;
  
  // Error handling
  onError?: (error: Error) => void;
  onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
  
  // Loading states
  placeholder?: "blur" | "empty" | undefined;
  blurDataURL?: string;
  
  // Custom loading component
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
};

export function CryptoIcon({
  name,
  mode,
  className = "",
  size = 24,
  width,
  height,
  alt,
  fallback,
  onError,
  onLoadingComplete,
  placeholder,
  blurDataURL,
  loadingComponent,
  errorComponent,
  ...imageProps
}: CryptoIconProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageError, setImageError] = useState<Error | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const iconPaths = getIconPaths(name);
  
  // Nếu không tìm thấy icon trong map, hiển thị fallback hoặc text
  if (!iconPaths) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Hiển thị text với style giống như icon
    const finalWidth = width ?? size;
    const finalHeight = height ?? size;
    
    return (
      <div
        className={`inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded ${className}`}
        style={{ width:finalWidth , height: finalHeight}}
        title={alt || name}
      >
        {name.length > 4 ? name.substring(0, 4) : name}
      </div>
    );
  }
  
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;

  // Tránh mismatch khi SSR: nếu không truyền mode, chờ tới khi client mounted mới dựa vào theme
  if (!mode && !mounted) {
    if (loadingComponent) {
      return <>{loadingComponent}</>; // giữ nguyên SSR/CSR lần đầu
    }
    // Placeholder ổn định giữa SSR và lần render đầu trên client để tránh mismatch
    return (
      <div
        className={`inline-block rounded bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ width: finalWidth, height: finalHeight }}
        aria-hidden="true"
      />
    );
  }

  const effectiveMode = mode ?? resolvedTheme;
  const imageSrc = effectiveMode === "dark" ? iconPaths.darkMode : iconPaths.lightMode;
  
  // Handle image error
  const handleError = () => {
    const error = new Error(`Failed to load image: ${imageSrc}`);
    setImageError(error);
    setImageState('error');
    if (onError) {
      onError(error);
    }
  };
  
  // Handle loading complete
  const handleLoadingComplete = (result: { naturalWidth: number; naturalHeight: number }) => {
    setImageState('loaded');
    if (onLoadingComplete) {
      onLoadingComplete(result);
    }
  };
  
  // Show loading component while image is loading
  if (imageState === 'loading' && loadingComponent) {
    return <>{loadingComponent}</>;
  }
  
  // Show error component or fallback when image fails to load
  if (imageState === 'error') {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Default error fallback
    return (
      <div
        className={`inline-flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs font-medium rounded border border-red-300 dark:border-red-700 ${className}`}
        style={{ width: finalWidth, height: finalHeight }}
        title={`Error loading ${alt || name}`}
      >
        ❌
      </div>
    );
  }
  
  return (
    <Image
      src={imageSrc}
      alt={alt || name}
      width={finalWidth}
      height={finalHeight}
      className={`transition-all duration-200 ${className}`}
      onError={handleError}
      onLoadingComplete={handleLoadingComplete}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      style={{width:finalWidth+'px!important', height:finalHeight+'px!important'}}
      {...imageProps}
    />
  );
}
