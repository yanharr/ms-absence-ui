import * as React from "react";
import { cn } from "../../lib/utils";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeaderCell = ({ children, className }: TableProps) => {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider",
        className
      )}
    >
      {children}
    </th>
  );
};

const TableData = ({ children, className}: TableProps) => {
    return (
        <td
            className={cn(
                "px-4 py-2 whitespace-nowrap text-gray-700",
                className
            )}
        >
            {children}
        </td>
    )
}

export { TableHeaderCell, TableData};