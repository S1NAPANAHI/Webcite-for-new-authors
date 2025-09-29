# 🐛 **DEBUG MODE ACTIVATED - Find Your Image Problem!**

## 🎯 **What I've Added**

I've updated your repository with **comprehensive debug logging** that will show exactly where the chapter image problem is occurring.

### **📝 Updated Files:**
1. **`ContentLibrary.tsx`** - Added detailed logging for issue cards and chapter loading
2. **`ChapterCard.tsx`** - Enhanced with visual debug indicators and console logging
3. **`fileUrls.ts`** - Improved URL resolution with logging
4. **`FileUploadDialog.tsx`** - Folder-aware uploader
5. **`DATABASE_MIGRATION.sql`** - Database schema fixes

## 🧪 **Now Test This - Step by Step**

### **Step 1: Pull Changes & Restart**
```bash
git pull origin main
npm run dev
```

### **Step 2: Run Database Migration (CRITICAL)**
Go to **Supabase Dashboard → SQL Editor** and run the entire `DATABASE_MIGRATION.sql` file.

### **Step 3: Test on Your Library Page**
1. **Go to**: `https://www.zoroastervers.com/library`
2. **Open console** (F12)
3. **Look for these logs**:

```
🔍 CONTENT LIBRARY - Loading content...
✅ CONTENT LIBRARY - Loaded content items: 2

🔍 PROCESSING ISSUE: empty sockets (empty-sockets)
📚 Loading chapters for issue: abc-123-def
✅ Loaded 2 chapters for empty sockets
🎯 FIRST CHAPTER: "sheer dumb luck" (Ch. 1)
   Banner file ID: xyz-456-789
🖼️ Loading banner file for "sheer dumb luck": xyz-456-789
✅ Banner file loaded for "sheer dumb luck": banner-image.jpg
   Banner path: banners/uuid-banner.jpg
   Generated URL: https://...supabase.co/storage/...

🎯 RENDERING CHAPTER CARD: "sheer dumb luck"
   Issue: empty sockets (empty-sockets)
   Banner file ID: xyz-456-789
   Has banner file object: true

=== CHAPTER CARD DEBUG ===
Chapter: sheer dumb luck
Banner file ID: xyz-456-789
Banner URL from file: https://...supabase.co/storage/...
Final banner URL: https://...supabase.co/storage/...
========================
```

### **Step 4: Look for Visual Debug Indicators**

**On the page, you should see:**
- **🎨 Issue cards** with either 📸 IMG or ❌ NO IMG badges
- **🎯 Chapter cards section** at bottom labeled "All Chapters (Debug Mode)"
- **Chapter cards with colored borders**:
  - **Green border** = Banner image URL exists ✅
  - **Red border** = No banner image URL ❌
- **"📷 BANNER" badge** in top-right of chapters with images

## 🎯 **What The Logs Will Tell Us**

### **Scenario A: No Chapters Found**
```
📚 Loading chapters for issue: abc-123
❌ Failed to load chapters: [error]
```
**→ Problem: Chapters not linked to issue properly**

### **Scenario B: Chapters Found But No Banner File IDs** 
```
ℹ️ No banner file ID for "chapter name"
```
**→ Problem: You haven't set banner_file_id in chapter editor**

### **Scenario C: Banner File IDs But Files Don't Load**
```
🖼️ Loading banner file: xyz-456
⚠️ Failed to load banner file xyz-456: [error]
```
**→ Problem: File IDs don't match actual files in database**

### **Scenario D: Files Load But URLs Don't Generate**
```
✅ Banner file loaded: banner.jpg
   Banner path: null
   Generated URL: null
```
**→ Problem: Files missing `path` or `storage_path`**

### **Scenario E: Everything Works!**
```
✅ Banner file loaded: banner.jpg
   Generated URL: https://...supabase.co/storage/banners/uuid-banner.jpg
✅ ISSUE COVER loaded: empty sockets
=== CHAPTER CARD DEBUG ===
Final banner URL: https://...supabase.co/storage/...
```
**→ Success: Images should be visible!**

## 📋 **Debug Checklist**

1. **Do you see the logs?** If no → code not updated
2. **Are chapters loading?** If no → database relationship issue
3. **Do chapters have banner_file_id?** If no → need to set in admin
4. **Do banner files load?** If no → file IDs don't match database
5. **Do URLs generate?** If no → files missing paths
6. **Do images display?** If no → URL accessibility issue

## 🛠️ **Quick Manual Test**

If you want to test a specific file URL manually:

1. **Find a file ID** in your Supabase `files` table
2. **Copy this URL format**: `https://opukvvmumyegtkukqint.supabase.co/storage/v1/object/public/media/[FILE_PATH]`
3. **Replace `[FILE_PATH]`** with the `path` or `storage_path` from your file record
4. **Open URL in browser** - should show the image

**Example**: If file has `path: "banners/123-banner.jpg"`, test:
`https://opukvvmumyegtkukqint.supabase.co/storage/v1/object/public/media/banners/123-banner.jpg`

The debug mode will show exactly where the process breaks down! 🔍