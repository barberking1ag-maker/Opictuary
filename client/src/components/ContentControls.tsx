import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Grid3x3, List, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ContentControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode?: "grid" | "list" | "timeline";
  onViewModeChange?: (mode: "grid" | "list" | "timeline") => void;
  showApproved?: boolean;
  showPending?: boolean;
  onApprovedToggle?: () => void;
  onPendingToggle?: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function ContentControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showApproved = true,
  showPending = true,
  onApprovedToggle,
  onPendingToggle,
  totalCount,
  filteredCount
}: ContentControlsProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search memories, condolences..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            data-testid="input-search-content"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="author">By Author</SelectItem>
            </SelectContent>
          </Select>

          {(onApprovedToggle || onPendingToggle) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" data-testid="button-filter">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter Content</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onApprovedToggle && (
                  <DropdownMenuCheckboxItem
                    checked={showApproved}
                    onCheckedChange={onApprovedToggle}
                    data-testid="filter-approved"
                  >
                    Show Approved
                  </DropdownMenuCheckboxItem>
                )}
                {onPendingToggle && (
                  <DropdownMenuCheckboxItem
                    checked={showPending}
                    onCheckedChange={onPendingToggle}
                    data-testid="filter-pending"
                  >
                    Show Pending
                  </DropdownMenuCheckboxItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {viewMode && onViewModeChange && (
            <div className="flex border border-border rounded-md" data-testid="view-mode-toggle">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-r-none border-r"
                onClick={() => onViewModeChange("grid")}
                data-testid="button-view-grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none border-r"
                onClick={() => onViewModeChange("list")}
                data-testid="button-view-list"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => onViewModeChange("timeline")}
                data-testid="button-view-timeline"
              >
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p data-testid="text-content-count">
          Showing {filteredCount} of {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </p>
        {filteredCount < totalCount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("");
              if (onApprovedToggle && !showApproved) onApprovedToggle();
              if (onPendingToggle && !showPending) onPendingToggle();
            }}
            data-testid="button-clear-filters"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
