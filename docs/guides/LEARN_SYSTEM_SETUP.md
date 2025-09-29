# Learn Management System Setup Guide

This guide will help you set up and configure the Learn Management System for your Zoroasterverse project.

## Overview

The Learn Management System provides:
- ✅ **Content Management**: Full CRUD operations for learning resources
- ✅ **Progress Tracking**: User completion status and time spent
- ✅ **Categories & Filtering**: Organized content structure
- ✅ **Admin Interface**: Complete management dashboard
- ✅ **Public Interface**: User-friendly learning experience
- ✅ **Responsive Design**: Works on all devices

## Database Setup

### Step 1: Create the learn_content table

1. Open your Supabase SQL Editor
2. Run the contents of `database/learn-content-schema.sql`

This creates:
- `learn_content` table for storing learning resources
- Sample data with Zoroastrianism content
- Row Level Security policies
- Performance indexes

### Step 2: Create the learn_progress table (Optional - for progress tracking)

1. In Supabase SQL Editor
2. Run the contents of `database/learn-progress-table.sql`

This creates:
- `learn_progress` table for user progress tracking
- RLS policies for user privacy
- Performance indexes

## File Structure

The Learn system is organized as follows:

```
apps/frontend/src/
├── components/admin/AdminLayout.tsx          # Updated with Learn sidebar
├── admin/components/
│   └── EnhancedLearnAdmin.tsx               # Main admin interface
├── pages/
│   ├── LearnPageEnhanced.tsx                # Public learn page
│   └── admin/learn/
│       └── LearnCategoriesManager.tsx       # Categories management
└── App.tsx                                  # Updated with Learn routes

database/
├── learn-content-schema.sql                 # Main content table
└── learn-progress-table.sql                 # Progress tracking table
```

## Features

### Admin Interface (`/admin/learn`)

**Resource Management:**
- Create, edit, delete learning resources
- Set difficulty levels (beginner/intermediate/advanced)
- Organize by categories
- Add tags for better searchability
- Toggle publish/draft status
- View usage statistics

**Categories Management (`/admin/learn/categories`):**
- Create and manage content categories
- Set display order
- Toggle active/inactive status
- View resource counts

### Public Interface (`/learn`)

**For Visitors:**
- Browse all published resources
- Filter by category, difficulty, tags
- Search functionality
- Responsive grid layout
- Modal reading experience

**For Authenticated Users (Additional Features):**
- Progress tracking dashboard
- Mark resources as completed
- Track time spent reading
- Personal statistics
- Progress indicators on resources

## Content Types Supported

The system supports various types of learning content:

- **Articles**: Long-form educational content
- **Guides**: Step-by-step instructions
- **References**: Quick lookup information
- **Historical Content**: Background and context
- **Practices**: Ritual and ceremonial guidance

## Usage Examples

### Creating New Content (Admin)

1. Navigate to `/admin/learn`
2. Click "Add Resource"
3. Fill in the form:
   - **Title**: "The Sacred Fire in Zoroastrian Temples"
   - **Category**: "Practices"
   - **Difficulty**: "beginner"
   - **Content**: Full article text
   - **Tags**: "fire, temples, worship, sacred"
   - **Status**: "published"
4. Save the resource

### User Learning Experience

1. User visits `/learn`
2. Sees personalized dashboard (if logged in)
3. Browses resources by category or search
4. Clicks on a resource to read
5. Can mark as completed when finished
6. Progress is tracked and displayed

## Integration Points

### With Authentication System
- Uses existing `@zoroaster/shared` auth
- Progress tracking tied to user accounts
- Admin access controlled by user roles

### With UI Components
- Uses NextUI component library
- Consistent with existing design system
- Responsive and accessible

### With Navigation
- Added to main site navigation
- Admin sidebar integration
- Breadcrumb support

## Customization

### Adding New Categories

Currently uses hardcoded categories:
- Basics
- Sacred Texts 
- Practices
- History
- Philosophy
- Rituals
- Modern Practice

To add new categories:
1. Update the `CATEGORY_OPTIONS` in `EnhancedLearnAdmin.tsx`
2. Update the categories array in `LearnPageEnhanced.tsx`

### Styling

The system uses:
- NextUI components for consistent styling
- Tailwind CSS for custom styling
- Responsive design patterns
- Dark/light mode support (inherits from app)

### Content Format

Content supports:
- Plain text
- Line breaks (converted to paragraphs)
- Future: Markdown or HTML support can be added

## Security

### Row Level Security (RLS)

**learn_content table:**
- Public read access to published content only
- Admin full access for management

**learn_progress table:**
- Users can only access their own progress
- Admins can view all progress for analytics

### Input Validation
- XSS prevention on content input
- SQL injection prevention via Supabase
- Form validation on client and server

## Performance Considerations

### Database
- Indexes on commonly queried fields
- Efficient pagination for large datasets
- RLS policies optimized for performance

### Frontend
- Lazy loading of resources
- Efficient filtering and search
- Optimistic updates for better UX

## Troubleshooting

### Common Issues

**"Failed to load resources"**
- Check Supabase connection
- Verify table exists and has data
- Check RLS policies

**"Progress tracking not working"**
- Ensure `learn_progress` table exists
- Check user authentication
- Verify RLS policies for progress table

**"Admin interface not accessible"**
- Check user has admin role
- Verify admin route protection
- Check authentication status

### Database Queries for Debugging

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('learn_content', 'learn_progress');

-- Check content count
SELECT status, COUNT(*) FROM learn_content GROUP BY status;

-- Check progress data
SELECT completed, COUNT(*) FROM learn_progress GROUP BY completed;
```

## Future Enhancements

Potential improvements:
- **Rich Text Editor**: WYSIWYG content editing
- **Media Support**: Images, videos, attachments
- **Learning Paths**: Sequential course structures
- **Certificates**: Completion certificates
- **Social Features**: Comments, ratings, discussions
- **Analytics Dashboard**: Detailed usage analytics
- **Export Features**: PDF export of resources
- **Offline Support**: PWA with offline reading

## Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Check Supabase logs for errors
4. Verify all database migrations are applied

---

**Setup Complete!** Your Learn Management System is ready to help your community grow and learn about Zoroastrianism.
