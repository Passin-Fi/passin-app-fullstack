import * as React from "react";
import { cn } from "src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  startAdornmentClassName?: string;
  endAdornment?: React.ReactNode; // currency code, icon, button, etc.
  endAdornmentClassName?: string;
  variant?: "default" | "gradient";
  fullHeight?: boolean; // force h-full wrapper
  warpperClassName?: string;
}

/**
 * Input component with optional start/end adornments.
 * - gradient variant mimics the screenshot: subtle diagonal gradient + translucent glass effect
 * - uses currentColor for caret + selection mapping
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      startAdornment,
      startAdornmentClassName,
      endAdornment,
      endAdornmentClassName,
      type = "text",
      variant = "default",
      fullHeight,
      warpperClassName,
      ...props
    },
    ref
  ) => {
    const surfaceClasses = variant === "gradient"
      ? "bg-[linear-gradient(110deg,oklch(0.72_0.08_280/.55),oklch(0.55_0.06_260/.55))] dark:bg-[linear-gradient(110deg,oklch(0.35_0.04_270/.55),oklch(0.22_0.03_290/.55))]"
      : "bg-input";

    return (
      <div
        className={cn(
          "group/input h-[38px] relative w-full inline-flex items-center rounded-input transition-colors ring-0 focus-within:outline-none mobile:px-2 tablet:px-3 desktop:px-4 gap-1.5",
          surfaceClasses,
          fullHeight && "h-full",
          warpperClassName,
        )}
        data-slot="input-wrapper"
      >
        {startAdornment && (
          <div className={cn("text-sm text-muted-foreground", startAdornmentClassName)} data-slot="input-start">
            {startAdornment}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            "px-0 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground grow min-w-0 bg-transparent mobile:text-xs text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-normal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 tablet:text-sm",
            "focus-visible:outline-none",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
        {endAdornment && (
          <div className={cn("text-sm font-medium text-foreground", endAdornmentClassName)} data-slot="input-end">
            {endAdornment}
          </div>
        )}
  {/* Focus glow outline (not a border) */}
  <span className="pointer-events-none absolute inset-0 rounded-[4px] ring-0 opacity-0 group-focus-within/input:opacity-100 group-focus-within/input:ring-2 group-focus-within/input:ring-primary/50 transition" />
      </div>
    );
  }
);

Input.displayName = "Input";


