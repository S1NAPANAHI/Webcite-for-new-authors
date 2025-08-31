import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchWikiPage } from '@zoroaster/shared';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft, Tag, Clock, Eye, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
from '@zoroaster/ui'
import { LoadingSkeleton as Skeleton } from '@zoroaster/ui';

const WikiViewerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPage = async () => {
      try {
        if (!slug) {
          navigate('/wiki');
          return;
        }
        
        setLoading(true);
        const pageData = await fetchWikiPage(slug);
        setPage(pageData);
      } catch (err) {
        console.error('Error loading wiki page:', err);
        setError('Failed to load wiki page. It may not exist or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="pt-4 space-y-2">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/wiki')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wiki Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-1 text-gray-600">The requested wiki page could not be found.</p>
          <div className="mt-6">
            <Button onClick={() => navigate('/wiki')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wiki Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {isAdmin && (
          <Button 
            variant="outline" 
            onClick={() => navigate(`/account/admin/wiki/edit/${page.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Page
          </Button>
        )}
      </div>

      <article className="prose prose-slate dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            {page.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
            {page.category && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <Link 
                  to={`/wiki/category/${page.category.slug}`}
                  className="hover:underline hover:text-primary"
                >
                  {page.category.name}
                </Link>
              </div>
            )}
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last updated {format(new Date(page.updated_at), 'MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{page.view_count} views</span>
            </div>
          </div>
          
          {page.excerpt && (
            <p className="text-lg text-muted-foreground">
              {page.excerpt}
            </p>
          )}
        </header>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              // Custom components for markdown rendering
              h1: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-8 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-6 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h4 className="text-xl font-bold mt-5 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="my-4 leading-relaxed" {...props} />,
              a: ({ node, ...props }) => (
                <a 
                  className="text-primary hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  {...props} 
                />
              ),
              img: ({ node, ...props }) => (
                <div className="my-6 rounded-lg overflow-hidden">
                  <img 
                    className="mx-auto max-h-[500px] w-auto rounded-lg" 
                    alt={props.alt || ''} 
                    {...props} 
                  />
                  {props.title && (
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      {props.title}
                    </p>
                  )}
                </div>
              ),
              table: ({ node, ...props }) => (
                <div className="my-6 border rounded-lg overflow-x-auto">
                  <table className="w-full" {...props} />
                </div>
              ),
              code: ({ node, inline, className, children, ...props }) => {
                if (inline) {
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                    <code className="font-mono text-sm" {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
            }}
          >
            {page.content}
          </ReactMarkdown>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Last updated</h3>
              <p className="text-sm">
                {format(new Date(page.updated_at), 'MMMM d, yyyy')}
              </p>
            </div>
            
            {isAdmin && (
              <Button 
                variant="outline"
                onClick={() => navigate(`/account/admin/wiki/edit/${page.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit this page
              </Button>
            )}
          </div>
          
          {/* Add related pages or categories here */}
          {page.category && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {page.category.name}
                </Badge>
              </div>
            </div>
          )}
        </footer>
      </article>
    </div>
  );
};

export default WikiViewerPage;
