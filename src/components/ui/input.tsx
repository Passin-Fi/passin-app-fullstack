import * as React from "react";
import { cn } from "src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode; // currency code, icon, button, etc.
  variant?: "default" | "gradient";
  fullHeight?: boolean; // force h-full wrapper
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
      endAdornment,
      type = "text",
      variant = "default",
      fullHeight,
      ...props
    },
    ref
  ) => {
    const surfaceClasses = variant === "gradient"
      ? "bg-[linear-gradient(110deg,oklch(0.72_0.08_280/.55),oklch(0.55_0.06_260/.55))] dark:bg-[linear-gradient(110deg,oklch(0.35_0.04_270/.55),oklch(0.22_0.03_290/.55))]"
      : "bg-[#ece5ff4d] dark:bg-[#ece5ff4d]";

    return (
      <div
        className={cn(
          "group/input relative w-full inline-flex items-center rounded-[4px] transition-colors ring-0 focus-within:outline-none",
          surfaceClasses,
          fullHeight && "h-full",
          startAdornment && "pl-2",
          endAdornment && "pr-3"
        )}
        data-slot="input-wrapper"
      >
        {startAdornment && (
          <span className="mr-1 flex items-center text-sm text-muted-foreground" data-slot="input-start">
            {startAdornment}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            // replace px-3 with explicit pl/pr so we can override pr when endAdornment exists
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 bg-transparent pl-3 pr-3 py-1 mobile:text-xs text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-normal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            endAdornment && "pr-0", // remove internal right padding; wrapper provides pr-3 spacing before adornment
            "focus-visible:outline-none",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
        {endAdornment && (
          <span className="ml-1 flex items-center gap-1 text-sm font-medium text-foreground" data-slot="input-end">
            {endAdornment}
          </span>
        )}
  {/* Focus glow outline (not a border) */}
  <span className="pointer-events-none absolute inset-0 rounded-[4px] ring-0 opacity-0 group-focus-within/input:opacity-100 group-focus-within/input:ring-2 group-focus-within/input:ring-primary/50 transition" />
      </div>
    );
  }
);

Input.displayName = "Input";


