import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  ArrowUpDown,
  Info,
} from "lucide-react";

interface ColumnDef<TData> {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: string;
  cell?: (item: TData) => React.ReactNode;
  enableSorting?: boolean;
  meta?: {
    align?: "left" | "center" | "right";
    className?: string;
    icon?: React.ReactNode;
  };
}

interface ActionItem<TData> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: TData) => void;
  variant?: "default" | "destructive";
}

interface StatusConfig {
  color: string;
  label: string;
}

interface EnhancedDataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  actions?: ActionItem<TData>[];
  searchPlaceholder?: string;
  searchColumn?: string;
  pageSize?: number;
  statusMap?: Record<string, StatusConfig>;
  statusKey?: string;
  emptyMessage?: string;
  title?: string;
}

export function EnhancedDataTable<TData>({
  columns,
  data,
  actions = [],
  searchPlaceholder = "Search...",
  searchColumn,
  pageSize = 5,
  statusMap,
  statusKey,
  emptyMessage = "No results found",
  title
}: EnhancedDataTableProps<TData>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Filter data based on search term
  const filteredData = searchColumn 
    ? data.filter((item: any) => {
        const value = String(item[searchColumn] || "").toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      })
    : data;

  // Sort data if needed
  const sortedData = sortColumn
    ? [...filteredData].sort((a: any, b: any) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle different types of values
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle numbers
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        // Fallback to string comparison
        return sortDirection === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      })
    : filteredData;

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (!statusMap || !status) return status;
    
    const statusConfig = statusMap[status] || { color: "gray", label: status };
    
    // Fixed badge styling that works in both light and dark mode
    const colorClasses: Record<string, string> = {
      green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };
    
    return (
      <Badge variant="outline" className={colorClasses[statusConfig.color] || colorClasses.gray}>
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center mb-2 px-4">
          <Info className="h-4 w-4 mr-2 text-muted-foreground" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      
      <div className="flex justify-between items-center px-4">
        {searchColumn && (
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 when searching
              }}
              className="pl-8 w-full"
            />
          </div>
        )}
        
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-sm text-muted-foreground">
            Showing {sortedData.length > 0 ? indexOfFirstItem + 1 : 0}-
            {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} items
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={`px-4 py-3 ${column.meta?.className || ""} ${column.meta?.align === "center" ? "text-center" : ""}`}
                  onClick={() => column.enableSorting && handleSort(column.accessorKey || column.id)}
                >
                  <div className={`flex items-center ${column.enableSorting ? "cursor-pointer hover:text-primary" : ""}`}>
                    {column.meta?.icon && <span className="mr-2">{column.meta.icon}</span>}
                    {column.header}
                    {column.enableSorting && sortColumn === (column.accessorKey || column.id) && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-[60px]"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell 
                      key={`${index}-${column.id}`}
                      className={`px-4 py-3 ${column.meta?.className || ""} ${column.meta?.align === "center" ? "text-center" : ""}`}
                    >
                      {column.cell 
                        ? column.cell(item) 
                        : statusKey && column.accessorKey === statusKey 
                          ? getStatusBadge((item as any)[column.accessorKey]) 
                          : (item as any)[column.accessorKey || column.id]}
                    </TableCell>
                  ))}
                  
                  {actions.length > 0 && (
                    <TableCell className="px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem 
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={action.variant === "destructive" ? "text-red-600 focus:text-red-600" : ""}
                            >
                              {action.icon && (
                                <span className="mr-2 h-4 w-4">{action.icon}</span>
                              )}
                              <span>{action.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)} 
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
            
            {/* Fill empty rows to maintain consistent height */}
            {currentItems.length > 0 && currentItems.length < pageSize && (
              Array.from({ length: pageSize - currentItems.length }).map((_, index) => (
                <TableRow key={`empty-${index}`} className="h-[53px]">
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)}></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 