import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@zoroaster/ui';
import { Calendar, Clock, Eye, Heart, MessageCircle, Star, BookOpen, User, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Chapter, ChapterWithDetails } from '@zoroaster/shared';
import { supabase } from '@zoroaster/shared';
import { Link } from 'react-router-dom';

interface ChapterCardProps {
  chapter: ChapterWithDetails;
  showIssue?: boolean;
  onClick?: () => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, showIssue = true, onClick }) => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBannerUrl = async () => {
      if (!chapter.banner_file_id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('files')
          .select('url, storage_path')
          .eq('id', chapter.banner_file_id)
          .single();

        if (error) {
          console.error('Error fetching banner:', error);
          return;
        }

        if (data.url) {
          setBannerUrl(data.url);
        } else if (data.storage_path) {
          const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(data.storage_path);
          setBannerUrl(urlData.publicUrl);
        }
      } catch (error) {
        console.error('Error fetching banner URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerUrl();
  }, [chapter.banner_file_id]);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const chapterUrl = chapter.issue
    ? `/read/${chapter.issue.slug}/${chapter.slug}`
    : `/read/chapter/${chapter.slug}`;

  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={onClick}>
      {/* Banner Image */}
      {(bannerUrl || isLoading) && (
        <div className="relative h-48 overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full bg-muted animate-pulse" />
          ) : bannerUrl ? (
            <img
              src={bannerUrl}
              alt={chapter.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setBannerUrl(null)}
            />
          ) : null}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {/* Reading Status Badge */}
          {chapter.status && (
            <Badge 
              variant={chapter.status === 'published' ? 'default' : 'secondary'}
              className="absolute top-3 right-3"
            >
              {chapter.status}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {truncateText(chapter.title, 60)}
            </CardTitle>
            
            {showIssue && chapter.issue && (
              <div className="flex items-center gap-2 mt-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">
                  {chapter.issue.title}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{chapter.views || 0}</span>
          </div>
        </div>

        {chapter.description && (
          <CardDescription className="text-muted-foreground line-clamp-2">
            {truncateText(chapter.description, 120)}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Chapter Metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {chapter.word_count && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.ceil(chapter.word_count / 200)} min read</span>
                </div>
              )}
              
              {chapter.chapter_number && (
                <div className="flex items-center gap-1">
                  <span>Chapter {chapter.chapter_number}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(chapter.created_at)}</span>
            </div>
          </div>

          {/* Tags */}
          {chapter.tags && chapter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chapter.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {chapter.tags.length > 3 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{chapter.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Heart className="h-4 w-4 mr-1" />
                <span>{chapter.likes || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{chapter.comments || 0}</span>
              </Button>
            </div>
            
            <Link to={chapterUrl}>
              <Button variant="outline" size="sm" className="group">
                Read
                <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChapterCard;