import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
}

export interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions?: FilterOption[];
  onFilterChange?: (id: string, value: string) => void;
  activeFilters?: Record<string, string>;
  onClearFilters?: () => void;
  onClearSearch?: () => void;
  className?: string;
}

export function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filterOptions = [],
  onFilterChange,
  activeFilters = {},
  onClearFilters,
  onClearSearch,
  className = '',
}: FilterBarProps) {
  const hasActiveFilters = Object.keys(activeFilters).some(key => activeFilters[key] !== '');

  return (
    <div className={`flex flex-col sm:flex-row gap-2 mb-4 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-8"
        />
        {searchValue && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {filterOptions.length > 0 && (
        <div className="flex gap-2 items-center flex-wrap">
          {filterOptions.map((filter) => (
            <div key={filter.id} className="relative min-w-[140px]">
              <Select
                value={activeFilters[filter.id] || filter.defaultValue || ''}
                onValueChange={(value) => onFilterChange?.(filter.id, value)}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-1">
                    <span className="text-sm hidden sm:inline">{filter.label}:</span>
                    <SelectValue placeholder={filter.label} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
          {hasActiveFilters && onClearFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 