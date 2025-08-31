import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchWikiPages } from '@zoroaster/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Search, ArrowLeft, BookOpen, Clock, Eye, BookMarked } from 'lucide-react';
from '@zoroaster/ui'
import { Badge } from '@/components/ui/badge';

const WikiSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Get search query from URL
  const query = searchParams.get('q') || '';

  useEffect(() => {
    // Update local state when URL changes
    setSearchQuery(query);
    
    if (query) {
      performSearch(query, 1);
    } else {
      setLoading(false);
      setSearchResults([]);
    }
  }, [query]);

  const performSearch = async (query: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchWikiPages({
        search: query,
        isPublished: true,
        page,
        pageSize: pagination.pageSize,
        sortBy: 'relevance',
      });
      
      setSearchResults(result.data);
      setPagination(prev => ({
        ...prev,
        page,
        total: result.count,
      }));
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/wiki/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.pageSize)) {
      performSearch(query, newPage);
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!query) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Search the Wiki</h2>
          <p className="text-muted-foreground mb-8">
            Enter a search term to find pages in the wiki.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search the wiki..."
                className="w-full pl-10 pr-4 py-6 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button 
                type="submit" 
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search the wiki..."
            className="w-full pl-10 pr-4 py-6 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2"
            size="sm"
          >
            Search
          </Button>
        </div>
      </form>
      
      {/* Search Results */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">
          Search Results for "{query}"
          {pagination.total > 0 && (
            <span className="text-muted-foreground font-normal ml-2">
              ({pagination.total} {pagination.total === 1 ? 'result' : 'results'})
            </span>
          )}
        </h1>
        
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any pages matching "{query}". Try different keywords or check the spelling.
            </p>
            <Button variant="outline" onClick={() => navigate('/wiki')}>
              Browse all wiki pages
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {searchResults.map((page) => (
                <Card key={page.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/wiki/${page.slug}`} className="block">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-primary hover:underline">
                            {page.title}
                          </h3>
                          
                          {page.excerpt && (
                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {page.excerpt}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {page.category && (
                              <div className="flex items-center">
                                <BookMarked className="h-4 w-4 mr-1" />
                                {page.category.name}
                              </div>
                            )}
                            
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Updated {new Date(page.updated_at).toLocaleDateString()}
                            </div>
                            
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {page.view_count} views
                            </div>
                          </div>
                        </div>
                        
                        {page.cover_image && (
                          <div className="sm:w-32 flex-shrink-0 h-32 overflow-hidden rounded-md">
                            <img 
                              src={page.cover_image} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.total > pagination.pageSize && (
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page * pagination.pageSize >= pagination.total}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Search Tips */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Search Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Use quotes to search for an exact phrase: "character creation"</li>
            <li>Use OR to combine multiple search terms: magic OR spells</li>
            <li>Use a minus sign to exclude terms: magic -spells</li>
            <li>Search in title only: title:"character"</li>
            <li>Search by category: category:lore</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WikiSearchPage;
