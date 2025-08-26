import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Button } from '../button';
import { Label } from '../label';
import { Checkbox } from '@radix-ui/react-checkbox';
import { toast } from 'sonner';
import { Star, Eye, EyeOff, Send, BookOpen, Heart, Zap, Users, Globe, Lock } from 'lucide-react';

// --- Zod Schema for Validation ---
const feedbackSchema = z.object({
  // Public Review Fields
  overallRating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  publicHeadline: z.string().min(1, 'Headline is required').max(80, 'Headline must be 80 characters or less'),
  quickTake: z.string().min(1, 'Quick Take is required').max(200, 'Quick Take must be 1-2 sentences'),
  highlights: z.array(z.string()).min(0, 'Select at least 0 highlights'), // Optional, but can have min/max if needed
  publicReview: z.string().min(1, 'Public review text is required'),
  allowSpoilers: z.boolean().default(false),
  spoilerContent: z.string().optional(),

  // Private Feedback Fields
  privateFeedback: z.string().min(1, 'Detailed private feedback is required'),
  typoFixes: z.string().optional(),
  specificFeedback: z.object({
    pacing: z.string().optional(),
    characters: z.string().optional(),
    worldbuilding: z.string().optional(),
    dialogue: z.string().optional(),
    plot: z.string().optional(),
  }).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

// --- Star Rating Component ---
interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="flex items-center gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-colors ${
            star <= (hoverRating || value) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onChange(star)}
        >
          <Star fill="currentColor" />
        </button>
      ))}
      <span className="ml-2 text-gray-600">
        {value > 0 ? `${value}/5 stars` : 'Click to rate'}
      </span>
    </div>
  );
};

// --- BetaFeedbackForm Component ---
const BetaFeedbackForm: React.FC = () => {
  const { handleSubmit, control, register, formState: { errors }, setValue, watch } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      overallRating: 0,
      publicHeadline: '',
      quickTake: '',
      highlights: [],
      publicReview: '',
      allowSpoilers: false,
      spoilerContent: '',
      privateFeedback: '',
      typoFixes: '',
      specificFeedback: {
        pacing: '',
        characters: '',
        worldbuilding: '',
        dialogue: '',
        plot: '',
      },
    },
  });

  const [previewMode, setPreviewMode] = useState('pre-publication'); // 'pre-publication' | 'post-publication'
  const [spoilerRevealed, setSpoilerRevealed] = useState<{ [key: string]: boolean }>({});

  const allowSpoilers = watch('allowSpoilers');
  const currentRating = watch('overallRating');
  const selectedHighlights = watch('highlights');
  const publicHeadline = watch('publicHeadline');
  const quickTake = watch('quickTake');
  const publicReview = watch('publicReview');
  const spoilerContent = watch('spoilerContent');

  const highlightOptions = [
    { id: 'worldbuilding', label: '🌌 Worldbuilding', icon: Globe },
    { id: 'emotional', label: '💔 Emotional Impact', icon: Heart },
    { id: 'pacing', label: '⚡ Pacing', icon: Zap },
    { id: 'characters', label: '👥 Characters', icon: Users },
    { id: 'writing', label: '✨ Writing Style', icon: BookOpen }
  ];

  const toggleSpoiler = (spoilerId: string) => {
    setSpoilerRevealed(prev => ({
      ...prev,
      [spoilerId]: !prev[spoilerId]
    }));
  };

  const onSubmit = (data: FeedbackFormValues) => {
    console.log('Beta Reader Feedback Submitted:', data);
    toast.success('Thank you for your feedback! Your response has been submitted.');
    // In a real application, you would send this data to your backend
  };

  const renderSpoilerContent = (content: string, spoilerId: string) => {
    if (previewMode === 'pre-publication') return null;
    
    const isRevealed = spoilerRevealed[spoilerId];
    
    return (
      <div className="mt-4 border border-red-200 rounded-lg p-4 bg-red-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-red-600 flex items-center gap-1">
            <Eye className="w-4 h-4" />
            Spoiler Content
          </span>
          <button
            type="button"
            onClick={() => toggleSpoiler(spoilerId)}
            className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md flex items-center gap-1 transition-colors"
          >
            {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isRevealed ? 'Hide' : 'Reveal'}
          </button>
        </div>
        <div className={`transition-all duration-300 ${isRevealed ? 'opacity-100' : 'opacity-100 blur-sm select-none pointer-events-none bg-black text-black'}`}>
          {content || 'No spoiler content provided'}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Beta Reader Feedback Form</h1>
        <p className="text-gray-600">Your feedback helps make this story the best it can be!</p>
        
        {/* Preview Mode Toggle */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode('pre-publication')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode === 'pre-publication' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Pre-Publication Preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('post-publication')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode === 'post-publication' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Post-Publication Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Private Feedback Section */}
        <div className="p-6 rounded-lg border border-yellow-200" style={{ backgroundColor: '#fffbeb' }}>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">Private Feedback (Author Only)</h2>
          </div>
          <p className="text-sm text-yellow-700 mb-4">
            This section is completely private and will only be seen by the author. Be as detailed and honest as possible!
          </p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="privateFeedback" className="block text-sm font-medium text-gray-700 mb-2">Overall Detailed Feedback</Label>
              <Textarea
                id="privateFeedback"
                {...register('privateFeedback')}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Share your complete thoughts: plot holes, character development, pacing issues, suggestions for improvement, favorite moments, areas that confused you, etc. Include spoilers freely!"
              />
              {errors.privateFeedback && <p className="text-red-500 text-sm mt-1">{errors.privateFeedback.message}</p>}
            </div>

            {/* Specific Feedback Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                pacing: 'Pacing & Flow',
                characters: 'Character Development',
                worldbuilding: 'Worldbuilding & Setting',
                dialogue: 'Dialogue & Voice',
                plot: 'Plot & Structure'
              }).map(([key, label]) => (
                <div key={key}>
                  <Label htmlFor={`specificFeedback.${key}`} className="block text-sm font-medium text-gray-700 mb-1">{label}</Label>
                  <Textarea
                    id={`specificFeedback.${key}`}
                    {...register(`specificFeedback.${key}`)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    placeholder={`Specific feedback about ${label.toLowerCase()}...`}
                  />
                  {errors.specificFeedback?.[key] && <p className="text-red-500 text-sm mt-1">{errors.specificFeedback[key]?.message}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Public Review Section */}
        <div className="p-6 rounded-lg border border-blue-200" style={{ backgroundColor: '#eff6ff' }}>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Public Review</h2>
          </div>
          <p className="text-sm text-blue-700 mb-6">
            This section will be visible to the public. Use the preview mode above to see how it will appear!
          </p>

          {/* Rating */}
          <div className="mb-6">
            <Label htmlFor="overallRating" className="block text-sm font-medium text-gray-700 mb-2">Overall Rating *</Label>
            <Controller
              name="overallRating"
              control={control}
              render={({ field }) => (
                <StarRating value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.overallRating && <p className="text-red-500 text-sm mt-1">{errors.overallRating.message}</p>}
          </div>

          {/* Highlights */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Story Highlights</Label>
            <p className="text-sm text-gray-600 mb-3">Select what stood out most (optional)</p>
            <div className="flex flex-wrap gap-2">
              {highlightOptions.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <button
                    key={highlight.id}
                    type="button"
                    onClick={() => {
                      const currentHighlights = watch('highlights') || [];
                      const newHighlights = currentHighlights.includes(highlight.id)
                        ? currentHighlights.filter((id) => id !== highlight.id)
                        : [...currentHighlights, highlight.id];
                      setValue('highlights', newHighlights, { shouldValidate: true });
                    }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      watch('highlights')?.includes(highlight.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {highlight.label}
                  </button>
                );
              })}
            </div>
            {errors.highlights && <p className="text-red-500 text-sm mt-1">{errors.highlights.message}</p>}
          </div>

          {/* Public Review Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="publicHeadline" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Review Headline *</Label>
              <Input
                id="publicHeadline"
                type="text"
                {...register('publicHeadline')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 'A captivating journey through...' (keep spoiler-free)"
              />
              {errors.publicHeadline && <p className="text-red-500 text-sm mt-1">{errors.publicHeadline.message}</p>}
            </div>

            <div>
              <Label htmlFor="quickTake" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Quick Take (1-2 sentences) *</Label>
              <Textarea
                id="quickTake"
                {...register('quickTake')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief spoiler-free summary of your thoughts..."
              />
              {errors.quickTake && <p className="text-red-500 text-sm mt-1">{errors.quickTake.message}</p>}
            </div>

            <div>
              <Label htmlFor="publicReview" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Public Review Text *</Label>
              <Textarea
                id="publicReview"
                {...register('publicReview')}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your detailed review without spoilers. Focus on writing quality, emotional impact, and general impressions..."
              />
              {errors.publicReview && <p className="text-red-500 text-sm mt-1">{errors.publicReview.message}</p>}
            </div>

            {/* Spoiler Content Toggle */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Controller
                  name="allowSpoilers"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="allowSpoilers"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                  )}
                />
                <Label htmlFor="allowSpoilers" className="text-sm font-medium text-gray-700 dark:text-gray-200">Include spoiler content for post-publication review</Label>
              </div>

              {allowSpoilers && (
                <div>
                  <Label htmlFor="spoilerContent" className="block text-sm font-medium text-red-700 dark:text-red-200 mb-1">Spoiler Content (Post-Publication Only)</Label>
                  <Textarea
                    id="spoilerContent"
                    {...register('spoilerContent')}
                    rows={4}
                    className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Content that includes spoilers - plot details, twists, character fates, etc. This will only be visible after publication with spoiler warnings."
                  />
                  {errors.spoilerContent && <p className="text-red-500 text-sm mt-1">{errors.spoilerContent.message}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="p-6 rounded-lg border border-green-200 col-span-2" style={{ backgroundColor: '#f0fff4' }}> {/* Make preview span 2 columns */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Review Preview - {previewMode === 'pre-publication' ? 'Pre-Publication' : 'Post-Publication'} Mode
          </h3>
          
          {(currentRating > 0 || publicHeadline || quickTake || publicReview) ? (
            <div className="bg-white p-4 rounded-lg border">
              {currentRating > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= currentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{currentRating}/5</span>
                </div>
              )}
              
              {publicHeadline && (
                <h4 className="font-semibold text-lg text-gray-800 mb-2">{publicHeadline}</h4>
              )}
              
              {selectedHighlights.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedHighlights.map(highlightId => {
                    const highlight = highlightOptions.find(h => h.id === highlightId);
                    return (
                      <span key={highlightId} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {highlight?.label}
                      </span>
                    );
                  })}
                </div>
              )}
              
              {quickTake && (
                <p className="text-gray-700 mb-3 italic">"{quickTake}"</p>
              )}
              
              {publicReview && (
                <p className="text-gray-700 mb-3">{publicReview}</p>
              )}
              
              {allowSpoilers && spoilerContent && renderSpoilerContent(spoilerContent, 'main')}
            </div>
          ) : (
            <p className="text-gray-500 italic">Fill out the form above to see your review preview...</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center col-span-2"> {/* Make submit button span 2 columns */}
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <Send className="w-5 h-5" />
            Submit Beta Reader Feedback
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BetaFeedbackForm;
