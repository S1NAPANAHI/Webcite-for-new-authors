import React from 'react';
import { Card, CardContent, CardHeader } from '@zoroaster/ui';
import { Badge } from '@zoroaster/ui';
import { Calendar, Eye, Heart, MessageCircle, BookOpen, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Issue } from '@zoroaster/shared';
import { Link } from 'react-router-dom';

interface LibraryCardProps {
  issue: Issue;
  onClick?: () => void;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({ issue, onClick }) => {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link to={`/library/issue/${issue.slug}`}>
      <Card className="group relative overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 cursor-pointer h-full" onClick={onClick}>
        {/* Cover Image */}
        {issue.cover_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={issue.cover_image_url}
              alt={issue.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* Status Badge */}
            <Badge 
              variant={issue.status === 'published' ? 'default' : 'secondary'}
              className="absolute top-3 right-3"
            >
              {issue.status}
            </Badge>
          </div>
        )}

        <CardHeader className="space-y-3">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {issue.title}
            </h3>
            
            {issue.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {issue.subtitle}
              </p>
            )}
          </div>

          {issue.description && (
            <p className="text-muted-foreground text-sm line-clamp-3">
              {truncateText(issue.description, 150)}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                {issue.chapter_count && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{issue.chapter_count} chapters</span>
                  </div>
                )}
                
                {issue.total_word_count && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.ceil(issue.total_word_count / 200)} min</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(issue.created_at)}</span>
              </div>
            </div>

            {/* Tags */}
            {issue.tags && issue.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {issue.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {issue.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{issue.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{issue.views || 0}</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{issue.likes || 0}</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{issue.comments || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};