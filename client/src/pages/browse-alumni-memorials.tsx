import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { GraduationCap, Search, Filter, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { AlumniMemorial } from "@shared/schema";

interface AlumniMemorialsResponse {
  memorials: AlumniMemorial[];
  count: number;
  limit: number;
  offset: number;
}

export default function BrowseAlumniMemorials() {
  const [filters, setFilters] = useState({
    schoolName: "",
    graduationYear: "",
    major: "",
  });
  const [searchQuery, setSearchQuery] = useState({
    schoolName: "",
    graduationYear: "",
    major: "",
  });
  const [page, setPage] = useState(0);
  const [schoolAutocompleteQuery, setSchoolAutocompleteQuery] = useState("");
  const limit = 12;

  const { data, isLoading } = useQuery<AlumniMemorialsResponse>({
    queryKey: ['/api/alumni-memorials', searchQuery, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery.schoolName) params.append('schoolName', searchQuery.schoolName);
      if (searchQuery.graduationYear) params.append('graduationYear', searchQuery.graduationYear);
      if (searchQuery.major) params.append('major', searchQuery.major);
      params.append('limit', limit.toString());
      params.append('offset', (page * limit).toString());
      
      const response = await fetch(`/api/alumni-memorials?${params.toString()}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
  });

  const { data: schools = [] } = useQuery<string[]>({
    queryKey: ['/api/alumni-memorials/schools/autocomplete', schoolAutocompleteQuery],
    queryFn: async () => {
      const params = new URLSearchParams({ q: schoolAutocompleteQuery });
      const response = await fetch(`/api/alumni-memorials/schools/autocomplete?${params.toString()}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
    enabled: schoolAutocompleteQuery.length > 2,
  });

  const handleSearch = () => {
    setSearchQuery(filters);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({ schoolName: "", graduationYear: "", major: "" });
    setSearchQuery({ schoolName: "", graduationYear: "", major: "" });
    setPage(0);
  };

  const totalPages = data ? Math.ceil(data.count / limit) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-yellow-400">
            <GraduationCap className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold text-white" data-testid="text-page-title">
                Alumni Memorials
              </h1>
              <p className="text-gray-300">Honoring the lives and legacies of our alumni</p>
            </div>
          </div>
          <Link href="/alumni-memorials/create">
            <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-500" data-testid="button-create-memorial">
              <GraduationCap className="w-4 h-4 mr-2" />
              Create Memorial
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="md:col-span-1">
            <Card className="bg-white/95 backdrop-blur sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="filter-school">School Name</Label>
                  <Input
                    id="filter-school"
                    placeholder="Search schools..."
                    value={filters.schoolName}
                    onChange={(e) => {
                      setFilters({ ...filters, schoolName: e.target.value });
                      setSchoolAutocompleteQuery(e.target.value);
                    }}
                    data-testid="input-filter-school"
                  />
                  {schools.length > 0 && (
                    <div className="mt-2 border rounded-md bg-white shadow-lg max-h-48 overflow-y-auto">
                      {schools.map((school) => (
                        <button
                          key={school}
                          type="button"
                          className="w-full text-left px-3 py-2 hover-elevate text-sm"
                          onClick={() => {
                            setFilters({ ...filters, schoolName: school });
                            setSchoolAutocompleteQuery("");
                          }}
                          data-testid={`school-filter-option-${school}`}
                        >
                          {school}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="filter-year">Graduation Year</Label>
                  <Input
                    id="filter-year"
                    placeholder="e.g., 2015"
                    value={filters.graduationYear}
                    onChange={(e) => setFilters({ ...filters, graduationYear: e.target.value })}
                    data-testid="input-filter-year"
                  />
                </div>

                <div>
                  <Label htmlFor="filter-major">Major</Label>
                  <Input
                    id="filter-major"
                    placeholder="e.g., Computer Science"
                    value={filters.major}
                    onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                    data-testid="input-filter-major"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSearch}
                    className="flex-1 bg-blue-900 hover:bg-blue-800"
                    data-testid="button-apply-filters"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    data-testid="button-clear-filters"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Memorials Grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : data && data.memorials.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-300 text-sm" data-testid="text-results-count">
                    Showing {data.memorials.length} of {data.count} memorials
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.memorials.map((memorial) => (
                    <Link key={memorial.id} href={`/alumni-memorials/${memorial.id}`}>
                      <Card 
                        className="hover-elevate cursor-pointer h-full bg-white/95 backdrop-blur transition-all"
                        data-testid={`memorial-card-${memorial.id}`}
                      >
                        <CardHeader>
                          {/* College Logo Placeholder */}
                          <div className="w-full h-32 border-2 border-dashed border-blue-300 rounded-md flex items-center justify-center bg-blue-50 mb-4">
                            <div className="text-center">
                              <GraduationCap className="w-12 h-12 text-blue-900 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">College Logo</p>
                            </div>
                          </div>

                          <CardTitle className="text-blue-900 text-lg line-clamp-2" data-testid={`memorial-name-${memorial.id}`}>
                            {memorial.preferredName || memorial.fullName}
                          </CardTitle>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="w-3 h-3" />
                              <span className="line-clamp-1">{memorial.schoolName}</span>
                            </div>
                            {memorial.graduationYear && (
                              <div className="text-sm text-gray-600">
                                {memorial.graduationYear}
                              </div>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {memorial.degreeType && (
                              <Badge variant="secondary" className="text-xs">
                                {memorial.degreeType}
                              </Badge>
                            )}
                            {memorial.major && (
                              <Badge variant="outline" className="text-xs">
                                {memorial.major}
                              </Badge>
                            )}
                          </div>
                          {memorial.biography && (
                            <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                              {memorial.biography}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="bg-white"
                      data-testid="button-prev-page"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i;
                        if (totalPages > 5) {
                          if (page < 3) {
                            pageNum = i;
                          } else if (page > totalPages - 4) {
                            pageNum = totalPages - 5 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            onClick={() => setPage(pageNum)}
                            className={page === pageNum ? "bg-yellow-400 text-blue-900" : "bg-white"}
                            data-testid={`button-page-${pageNum}`}
                          >
                            {pageNum + 1}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page >= totalPages - 1}
                      className="bg-white"
                      data-testid="button-next-page"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="bg-white/95 backdrop-blur">
                <CardContent className="pt-12 pb-12 text-center">
                  <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No memorials found</h3>
                  <p className="text-gray-500 mb-6">
                    {filters.schoolName || filters.graduationYear || filters.major
                      ? "Try adjusting your filters to see more results"
                      : "Be the first to create an alumni memorial"}
                  </p>
                  {(filters.schoolName || filters.graduationYear || filters.major) ? (
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      data-testid="button-clear-filters-empty"
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Link href="/alumni-memorials/create">
                      <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-500">
                        Create Memorial
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
