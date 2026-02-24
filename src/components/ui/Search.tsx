import * as React from "react";

import { cn } from "../../lib/utils";

const Search = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                "w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 shadow-sm transition-all duration-200",
                className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);

export { Search };
