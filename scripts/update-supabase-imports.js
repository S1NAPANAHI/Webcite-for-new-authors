const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const frontendSrc = path.join(projectRoot, 'src', 'frontend', 'src');

// Files to update
const filesToUpdate = [
  'pages/WorkReaderPage.tsx',
  'pages/ProfilePage.tsx',
  'pages/LoginPage.tsx',
  'pages/LibraryPage.tsx',
  'pages/HomePage.tsx',
  'pages/GenericPage.tsx',
  'pages/CharactersPage.tsx',
  'pages/BlogPostPage.tsx',
  'pages/BlogPage.tsx',
  'pages/AdminUploadPage.jsx',
  'pages/AccountPage.tsx',
  'lib/wiki.ts',
  'hooks/useAuth.ts',
  'context/AuthContext.tsx',
  'components/ProtectedRoute.tsx',
  'components/profile/ReadingTab.tsx',
  'components/profile/ProfileTab.tsx',
  'components/LoginPage.tsx',
  'components/layout/Navbar.tsx',
  'components/admin/ContentList.tsx',
  'components/admin/ContentForm.tsx',
  'admin/WorksManager.tsx',
  'admin/WikiManager.tsx',
  'admin/UsersManagement.tsx',
  'admin/PostsManager.tsx',
  'admin/PagesManager.tsx',
  'admin/HomepageContentManager.tsx',
  'admin/DashboardPage.tsx',
  'admin/components/WikiEditor.tsx',
  'admin/CharactersManager.tsx',
].map(file => path.join(frontendSrc, file));

// Update imports in each file
filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace relative imports with @/lib/supabaseClient
    content = content.replace(
      /from ['"](?:\.\.\/)*supabaseClient['"]/g,
      'from "@/lib/supabaseClient"'
    );
    
    // Replace relative imports with @/lib/supabaseClient
    content = content.replace(
      /from ['"](?:\.\.\/){2}supabaseClient['"]/g,
      'from "@/lib/supabaseClient"'
    );
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${path.relative(projectRoot, file)}`);
  } else {
    console.warn(`File not found: ${path.relative(projectRoot, file)}`);
  }
});

console.log('Supabase imports updated successfully!');
