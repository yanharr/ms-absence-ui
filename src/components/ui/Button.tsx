import * as React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline" | "danger";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    let baseClass = "inline-flex items-center justify-center px-3 py-2 rounded-md font-medium transition-colors";

    if (variant === "ghost") {
      baseClass += " bg-transparent hover:bg-gray-200 text-gray-800";
    } else if (variant === "outline") {
      baseClass += " border border-border bg-transparent hover:bg-gray-100 text-foreground";
    } else if (variant === "danger") {
      baseClass += " border border-border bg-red-500 hover:bg-gray-100 text-white";
    } else {
      baseClass += " bg-blue-500 text-white hover:bg-blue-600";
    }

    return <button ref={ref} className={cn(baseClass, className)} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };
