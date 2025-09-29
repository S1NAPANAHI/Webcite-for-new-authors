# Homepage Manager Fix - Complete Solution

## 🚨 **Critical Issue Identified**

Your homepage manager has a data serialization issue where checkbox states aren't properly sent to the backend API.

### **Root Cause**
From the backend logs analysis:
```
Section visibility in updates 
showlatestnews undefined, 
showlatestreleases undefined, 
showartistcollaboration undefined, 
showprogressmetrics undefined
```

The boolean checkbox values are coming through as `undefined` instead of `true`/`false`, causing the backend to skip updating these fields.

## 🔧 **Fix Implementation**

### **1. Frontend Fix (HomepageManager.tsx)**

**Problem**: Checkbox states aren't properly serialized when sending to API

**Solution**: Modify the `handleSaveContent` function to explicitly include all section visibility fields:

```typescript
const handleSaveContent = async () => {
  if (!localContent) return;
  
  // CRITICAL FIX: Explicitly construct the update payload
  const updatePayload = {
    id: localContent.id,
    hero_title: localContent.hero_title,
    hero_subtitle: localContent.hero_subtitle,
    hero_description: localContent.hero_description,
    hero_quote: localContent.hero_quote,
    cta_button_text: localContent.cta_button_text,
    cta_button_link: localContent.cta_button_link,
    words_written: localContent.words_written,
    beta_readers: localContent.beta_readers,
    average_rating: localContent.average_rating,
    books_published: localContent.books_published,
    // CRITICAL: Explicitly include boolean values
    show_latest_news: Boolean(localContent.show_latest_news),
    show_latest_releases: Boolean(localContent.show_latest_releases),
    show_artist_collaboration: Boolean(localContent.show_artist_collaboration),
    show_progress_metrics: Boolean(localContent.show_progress_metrics)
  };
  
  console.log('🔍 Sending explicit payload:', JSON.stringify(updatePayload, null, 2));
  
  try {
    await updateContent(updatePayload);
    setLastSaved(new Date());
  } catch (error) {
    console.error('Failed to save content:', error);
  }
};
```

### **2. Backend Enhancement (routes/homepage.js)**

**Problem**: The update logic doesn't handle boolean coercion properly

**Solution**: Add explicit boolean coercion in the PUT endpoint:

```javascript
// ENHANCED: Explicit boolean handling for section visibility
if (req.body.show_latest_news !== undefined) {
  updates.show_latest_news = req.body.show_latest_news === true || req.body.show_latest_news === 'true';
}
if (req.body.show_latest_releases !== undefined) {
  updates.show_latest_releases = req.body.show_latest_releases === true || req.body.show_latest_releases === 'true';
}
if (req.body.show_artist_collaboration !== undefined) {
  updates.show_artist_collaboration = req.body.show_artist_collaboration === true || req.body.show_artist_collaboration === 'true';
}
if (req.body.show_progress_metrics !== undefined) {
  updates.show_progress_metrics = req.body.show_progress_metrics === true || req.body.show_progress_metrics === 'true';
}
```

### **3. Database Verification**

Your database schema is correct. The issue is purely in the data flow between frontend and backend.

## 🧪 **Testing Procedure**

1. **Deploy the fixes**
2. **Open browser dev tools**
3. **Navigate to homepage manager**
4. **Toggle a section visibility checkbox**
5. **Click save and check the console logs**
6. **Verify the database update in backend logs**

## 🎯 **Expected Results After Fix**

**Frontend Console:**
```
🔍 Sending explicit payload: {
  "show_latest_news": true,
  "show_latest_releases": false,
  "show_artist_collaboration": true,
  "show_progress_metrics": true
}
```

**Backend Logs:**
```
Section visibility in updates 
showlatestnews true, 
showlatestreleases false, 
showartistcollaboration true, 
showprogressmetrics true
```

## 🚀 **Implementation Priority**

1. **HIGH**: Update HomepageManager.tsx with explicit payload construction
2. **MEDIUM**: Enhance backend boolean handling (optional but recommended)
3. **LOW**: Add validation and error handling improvements

## 📋 **Files to Update**

- `apps/frontend/src/admin/components/HomepageManager.tsx`
- `apps/backend/routes/homepage.js` (optional enhancement)

This fix will resolve the issue where your homepage section visibility toggles weren't being saved to the database.