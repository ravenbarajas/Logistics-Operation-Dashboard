import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface DataTableProps<TData> {
  columns: {
    id: string;
    header: string | React.ReactNode;
    cell: (item: TData) => React.ReactNode;
    accessorKey?: string;
  }[];
  data: TData[];
  searchColumn?: string;
  title?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData>({
  columns,
  data,
  searchColumn,
  title,
  searchPlaceholder = "Search...",
}: DataTableProps<TData>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  // Basic filtering function
  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchColumn) return data;
    
    return data.filter((item: any) => {
      const value = item[searchColumn];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (typeof value === 'number') {
        return value.toString().includes(searchQuery);
      }
      return false;
    });
  }, [data, searchQuery, searchColumn]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  // Page count
  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize));

  // Navigation handlers
  const nextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="w-full space-y-2">
      {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
      
      <div className="flex items-center justify-between gap-2">
        {searchColumn && (
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0); // Reset to first page on search
                }}
                className="w-full pl-8 h-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(0);
                  }}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="h-9 px-2">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row: any, rowIndex) => (
                <TableRow key={rowIndex} className="h-10">
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.id}`} className="py-2 px-2">
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-10 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredData.length > pageSize && (
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              Showing 
              <span className="px-1">
                {filteredData.length > 0 ? currentPage * pageSize + 1 : 0}
              </span>
              to
              <span className="px-1">
                {Math.min((currentPage + 1) * pageSize, filteredData.length)}
              </span>
              of
              <span className="px-1">{filteredData.length}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-7 w-7 p-0"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">Page</span>
                <span className="text-xs font-medium">
                  {currentPage + 1} of {pageCount}
                </span>
              </div>
              <Button
                variant="outline"
                className="h-7 w-7 p-0"
                onClick={nextPage}
                disabled={currentPage >= pageCount - 1}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 