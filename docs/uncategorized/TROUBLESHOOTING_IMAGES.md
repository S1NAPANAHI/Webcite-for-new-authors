# 🔧 Image Rendering Troubleshooting Guide

## 🚨 **Current Issue Analysis**

Based on your screenshots, the images are not displaying in:
1. **Ebook Reader Page** - Hero images missing
2. **Chapter Cards** - Banner images not showing

## 🕵️ **Diagnostic Steps**

### **Step 1: Check Database Records**
Run these SQL queries in your Supabase dashboard to verify data:

```sql
-- Check if chapter has hero_file_id
SELECT id, title, hero_file_id, banner_file_id 
FROM chapters 
WHERE title = 'sheer dumb luck';

-- Check if file record exists
SELECT id, url, storage_path, filename 
FROM files 
WHERE id = 'YOUR_HERO_FILE_ID_HERE';
```

### **Step 2: Check Browser Developer Tools**
1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Look for errors** like:
   ```
   Failed to load resource: 404 (Not Found)
   Image failed to load: [URL]
   ```
4. **Go to Network tab**
5. **Reload page and check** if image requests are being made

### **Step 3: Test File URL Utility**
Add this debug code to your page component:

```tsx
// Add to your reader page component for testing
const debugFileUrl = async () => {
  const testId = 'your-file-id-here'; // Replace with actual file ID
  const url = await getFileUrlById(testId);
  console.log('File URL result:', url);
};

// Call this in useEffect
useEffect(() => {
  debugFileUrl();
}, []);
```

### **Step 4: Verify Component Import**
Check your page files to see which reader component is being used:

```tsx
// Look for these imports in your read page:
import { EbookReader } from '../components/EbookReader';
// OR
import { ImmersiveEbookReader } from '../components/ImmersiveEbookReader';
```

## 🔍 **Common Issues & Solutions**

### **Issue 1: File ID Not Set**
**Symptom**: Chapter exists but `hero_file_id` is null
**Solution**: Update chapter record with file ID

```sql
UPDATE chapters 
SET hero_file_id = 'your-file-id'
WHERE title = 'sheer dumb luck';
```

### **Issue 2: File Record Missing**
**Symptom**: File ID exists but no file record found
**Solution**: Check files table and verify file was uploaded correctly

### **Issue 3: Wrong Storage Path**
**Symptom**: File record exists but image fails to load
**Solution**: Verify storage_path in Supabase Storage

```sql
-- Check storage path
SELECT storage_path, url FROM files WHERE id = 'your-file-id';
```

### **Issue 4: CSS Not Loading**
**Symptom**: Images load but have no styling
**Solution**: Verify CSS import in components

```tsx
// Should be at top of component files:
import './ebook-reader.css';
```

### **Issue 5: Component Not Updated**
**Symptom**: Using old component version
**Solution**: Clear build cache and restart dev server

```bash
npm run build
# or
yarn build
```

## 🧪 **Quick Test Methods**

### **Method 1: Direct Image Test**
Replace the `useFileUrl` call with a direct image URL temporarily:

```tsx
// In your reader component, temporarily replace:
// const heroUrl = useFileUrl(chapter?.hero_file_id);

// With a direct test URL:
const heroUrl = 'https://via.placeholder.com/800x400/0066cc/ffffff?text=Test+Hero+Image';
```

**If test image shows**: Problem is with `useFileUrl` utility or data
**If test image doesn't show**: Problem is with component or CSS

### **Method 2: Console Logging**
Add debugging to components:

```tsx
// In EbookReader or ImmersiveEbookReader:
const heroUrl = useFileUrl(chapter?.hero_file_id);

// Add debug logging:
use Effect(() => {
  console.log('Chapter data:', chapter);
  console.log('Hero file ID:', chapter?.hero_file_id);
  console.log('Hero URL resolved:', heroUrl);
}, [chapter, heroUrl]);
```

### **Method 3: Network Tab Inspection**
1. Open DevTools → Network tab
2. Reload your reader page
3. Filter by "Img" to see image requests
4. Check if image URLs are being requested
5. Look at response status (200 = success, 404 = not found, etc.)

## 📋 **Checklist for Image Display**

**Database Level:**
- [ ] Chapter record has `hero_file_id` populated
- [ ] File record exists in `files` table
- [ ] File has either `url` or `storage_path` set
- [ ] If using Supabase Storage, file exists in `media` bucket

**Component Level:**
- [ ] CSS file imported in component
- [ ] `useFileUrl` hook properly called
- [ ] Hero image conditional rendering works
- [ ] Component receives chapter data correctly

**Frontend Level:**
- [ ] No JavaScript errors in console
- [ ] Network requests are being made for images
- [ ] Image URLs resolve correctly
- [ ] CSS classes are applied (`chapter-hero`, etc.)

## 🚀 **Immediate Fixes to Try**

### **Fix 1: Hard Refresh**
```bash
# Clear browser cache completely
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### **Fix 2: Restart Development Server**
```bash
npm run dev
# or
yarn dev
```

### **Fix 3: Check File Permissions**
Ensure your Supabase Storage bucket has public read access:

1. Go to Supabase Dashboard
2. Storage → media bucket
3. Check bucket is public
4. Verify file permissions

### **Fix 4: Update Component Usage**
If using the old component, switch to updated one:

```tsx
// Instead of old usage:
<OldEbookReader chapter={chapter} />

// Use updated version:
<EbookReader chapter={chapter} />
// or
<ImmersiveEbookReader chapter={chapter} />
```

## 📝 **Debug Information to Collect**

When reporting issues, please provide:

1. **Console Errors**: Any JavaScript errors in browser console
2. **Network Requests**: Screenshot of Network tab showing image requests
3. **Database Query Results**: Results of the SQL queries above
4. **Component Usage**: Which reader component you're using
5. **File Upload Method**: How images were uploaded (admin panel, direct upload, etc.)

## 🆘 **If Nothing Works**

Try this emergency test to isolate the issue:

```tsx
// Add this to your reader component temporarily:
const EmergencyImageTest = () => {
  return (
    <div style={{ border: '2px solid red', padding: '20px', margin: '20px' }}>
      <h3>Emergency Image Test</h3>
      <img 
        src="https://via.placeholder.com/600x300/ff6b6b/ffffff?text=Emergency+Test" 
        alt="Emergency test" 
        style={{ width: '100%', height: 'auto' }}
      />
      <p>Chapter ID: {chapter?.id}</p>
      <p>Hero File ID: {chapter?.hero_file_id || 'NOT SET'}</p>
      <p>Component: EbookReader/ImmersiveEbookReader</p>
    </div>
  );
};

// Add this before your hero image rendering:
{/* Emergency test */}
<EmergencyImageTest />
```

This will help identify if the issue is:
- **Component rendering** (test image shows)
- **Data flow** (chapter data displays)
- **File resolution** (file ID shows but image doesn't load)

## 📞 **Next Steps**

After running through this troubleshooting guide:

1. **Document your findings** from each diagnostic step
2. **Share specific error messages** from console/network tabs
3. **Provide database query results** for your test chapter
4. **Include screenshots** of DevTools showing network requests

This will help pinpoint the exact issue and provide a targeted solution!

---

**🔧 All fixes have been applied to your repository. The issue is likely one of the diagnostic points above.**