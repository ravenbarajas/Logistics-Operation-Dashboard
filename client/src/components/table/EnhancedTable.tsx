import { useState, useEffect } from "react";
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
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: (item: any) => void;
  variant?: "default" | "destructive";
}

interface ColumnDef {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: string;
  cell?: (item: any) => React.ReactNode;
  enableSorting?: boolean;
  meta?: {
    align?: "left" | "center" | "right";
    className?: string;
    icon?: React.ReactNode;
  };
}

interface StatusConfig {
  color: string;
  label: string;
}

interface EnhancedTableProps {
  data: any[];
  columns: ColumnDef[];
  actions?: ActionItem[];
  searchPlaceholder?: string;
  searchKey?: string;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  statusMap?: Record<string, StatusConfig>;
  statusKey?: string;
  emptyMessage?: string;
  onRowClick?: (item: any) => void;
  rowClassName?: string;
}

export function EnhancedTable({
  data,
  columns,
  actions = [],
  searchPlaceholder = "Search...",
  searchKey,
  pageSize = 5,
  onPageSizeChange,
  statusMap,
  statusKey,
  emptyMessage = "No results found",
  onRowClick,
  rowClassName
}: EnhancedTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Filter data based on search term
  const filteredData = searchKey 
    ? data.filter(item => {
        const value = String(item[searchKey] || "").toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      })
    : data;

  // Sort data if needed
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
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

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      // Adjust current page to maintain position if possible
      const currentTopItemIndex = (currentPage - 1) * pageSize;
      const newPageCount = Math.ceil(sortedData.length / size);
      const newCurrentPage = Math.min(Math.floor(currentTopItemIndex / size) + 1, newPageCount);
      
      setCurrentPage(newCurrentPage || 1);
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
      <div className="flex flex-wrap justify-between items-center px-4 gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {searchKey && (
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
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(size) => handlePageSizeChange(Number(size))}
            >
              <SelectTrigger className="h-9 w-[70px]">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px]">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length}
                  onChange={() => {
                    const newSelectedRows = new Set<number>();
                    if (selectedRows.size !== data.length) {
                      data.forEach((item) => newSelectedRows.add(item.id));
                    }
                    setSelectedRows(newSelectedRows);
                  }}
                />
              </TableHead>
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
              currentItems.map((item) => (
                <TableRow 
                  key={item.id} 
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  className={onRowClick ? rowClassName : ""}
                >
                  <TableCell className="w-[40px]">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(item.id)}
                      onChange={() => handleRowSelect(item.id)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell 
                      key={`${item.id}-${column.id}`}
                      className={`px-4 py-3 ${column.meta?.className || ""} ${column.meta?.align === "center" ? "text-center" : ""}`}
                    >
                      {column.cell 
                        ? column.cell(item) 
                        : statusKey && column.accessorKey === statusKey 
                          ? getStatusBadge(item[column.accessorKey])
                          : item[column.accessorKey || column.id]}
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

      <div className="flex items-center justify-between py-0 px-6">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'}
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePrevPage()}
              disabled={currentPage === 1}
              className="h-8 w-8"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {totalPages <= 5 ? (
              [...Array(totalPages)].map((_, i) => (
                <Button
                  key={`page-${i + 1}`}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(i + 1)}
                  className="h-8 w-8"
                  aria-label={`Page ${i + 1}`}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                >
                  {i + 1}
                </Button>
              ))
            ) : (
              <>
                <Button
                  variant={currentPage === 1 ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  className="h-8 w-8"
                  aria-label="Page 1"
                >
                  1
                </Button>

                {currentPage > 3 && <span className="mx-1">...</span>}

                {currentPage > 2 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="h-8 w-8"
                    aria-label={`Page ${currentPage - 1}`}
                  >
                    {currentPage - 1}
                  </Button>
                )}

                {currentPage !== 1 && currentPage !== totalPages && (
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage)}
                    className="h-8 w-8"
                    aria-label={`Page ${currentPage}`}
                    aria-current="page"
                  >
                    {currentPage}
                  </Button>
                )}

                {currentPage < totalPages - 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="h-8 w-8"
                    aria-label={`Page ${currentPage + 1}`}
                  >
                    {currentPage + 1}
                  </Button>
                )}

                {currentPage < totalPages - 2 && <span className="mx-1">...</span>}

                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  className="h-8 w-8"
                  aria-label={`Page ${totalPages}`}
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNextPage()}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex justify-end">
        {/* Space for potential additional controls */}
        </div>
      </div>
    </div>
  );
} 