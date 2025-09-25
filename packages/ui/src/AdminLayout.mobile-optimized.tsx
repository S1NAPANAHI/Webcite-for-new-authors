import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@zoroaster/shared/utils';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { supabase } from '@zoroaster/shared/supabaseClient';
import {
  LayoutDashboard,
  FileText,
  Home,
  Store,
  BookOpen,
  Settings,
  Users,
  Upload,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Bell,
  User,
  Calendar,
  ShoppingCart,
  Package,
  TrendingUp,
  Webhook,
  BarChart3,
  CreditCard,
  Boxes,
  AlertTriangle,
  type LucideIcon
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  {
    name: 'Content',
    href: '#',
    icon: FileText,
    children: [
      { name: 'Pages', href: '/admin/content/pages', icon: FileText },
      { name: 'Blog', href: '/admin/content/blog', icon: FileText },
      { name: 'Files', href: '/admin/content/files', icon: Upload },
      { name: 'Chapters', href: '/admin/content/chapters', icon: BookOpen },
      { name: 'Homepage', href: '/admin/content/homepage', icon: Home },
      { name: 'About', href: '/admin/content/about', icon: FileText },
    ],
  },
  {
    name: 'World',
    href: '#',
    icon: BookOpen,
    children: [
      { name: 'Wiki', href: '/admin/world/wiki', icon: BookOpen },
      { name: 'Timelines', href: '/admin/world/timelines', icon: Calendar },
      { name: 'Characters', href: '/admin/world/characters', icon: Users },
      { name: 'Artist Collab', href: '/admin/world/artists', icon: Users },
    ],
  },
  {
    name: 'Commerce',
    href: '#',
    icon: ShoppingCart,
    children: [
      { name: 'Shop', href: '/admin/commerce/shop', icon: Store },
      { name: 'Orders', href: '/admin/commerce/orders', icon: Package },
      { name: 'Customers', href: '/admin/commerce/customers', icon: Users },
    ],
  },
  {
    name: 'Beta',
    href: '#',
    icon: Users,
    children: [
      { name: 'Applications', href: '/admin/beta/applications', icon: FileText },
      { name: 'Managers', href: '/admin/beta/managers', icon: Users },
      { name: 'Activity', href: '/admin/beta/activity', icon: TrendingUp },
    ],
  },
  {
    name: 'Settings',
    href: '#',
    icon: Settings,
    children: [
      { name: 'Users', href: '/admin/settings/users', icon: Users },
      { name: 'Roles', href: '/admin/settings/roles', icon: Settings },
      { name: 'Integrations', href: '/admin/settings/integrations', icon: Webhook },
    ],
  },
];

const MobileAdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, userProfile, isLoading } = useAuth();

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    const resizeListener = () => checkIsMobile();
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setExpandedSection(null);
    }
  }, [location, isMobile]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMobile, sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
      setExpandedSection(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-gray-100">
        <div className="text-center mobile-safe-area">
          <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-gray-100 relative">
      {/* MOBILE-OPTIMIZED HEADER BAR */}
      <header className="lg:hidden sticky top-0 z-[1000] bg-slate-800/95 backdrop-blur-md border-b border-amber-500/30 px-4 py-3 flex items-center justify-between shadow-lg mobile-safe-area">
        <div className="flex items-center space-x-3">
          {/* Mobile menu toggle - larger touch target */}
          <button
            onClick={toggleSidebar}
            className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 transition-all duration-200 border border-amber-500/30 min-w-[48px] min-h-[48px] flex items-center justify-center touch-manipulation"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Mobile logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-slate-900 font-bold text-sm">Z</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Admin
            </h1>
          </div>
        </div>

        {/* Mobile user info - compact */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 font-bold text-sm shadow-md">
            {userProfile?.display_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* DESKTOP MENU TOGGLE */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex fixed top-4 left-4 z-[1001] p-3 rounded-lg bg-slate-800/90 backdrop-blur-sm border border-amber-500/30 shadow-xl hover:bg-slate-700/90 hover:border-amber-400/50 text-amber-300 hover:text-amber-200 transition-all duration-300 group min-w-[48px] min-h-[48px] items-center justify-center touch-manipulation"
        aria-label="Toggle navigation menu"
      >
        {sidebarOpen ? (
          <X size={20} className="transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <Menu size={20} className="transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>

      {/* BACKDROP OVERLAY - Mobile optimized */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-opacity duration-300"
          onClick={toggleSidebar}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* MOBILE-OPTIMIZED SIDEBAR */}
      <aside
        className={cn(
          // Mobile-first responsive sidebar
          'fixed top-0 left-0 z-[1000] h-screen transition-transform duration-300 ease-out',
          // Mobile: Full height, wider for better touch targets
          'w-[85vw] max-w-[320px] sm:w-80',
          // Desktop: Standard width
          'lg:w-80',
          // Background and styling
          'bg-gradient-to-b from-slate-800 via-slate-900 to-gray-900 border-r border-amber-500/20 backdrop-blur-sm shadow-2xl',
          // Transform state
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col relative overflow-hidden mobile-safe-area">
          {/* Persian-inspired decorative border */}
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 opacity-60"></div>
          
          {/* MOBILE-OPTIMIZED HEADER */}
          <div className="p-4 lg:p-6 border-b border-amber-500/30 bg-gradient-to-r from-slate-800/50 to-transparent relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-slate-900 font-bold text-lg">Z</span>
              </div>
              <div className="hidden sm:block">
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">Zoroaster</h2>
                <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
              </div>
              {/* Mobile: Show only icon and shorter text */}
              <div className="sm:hidden">
                <h2 className="text-lg font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">Admin</h2>
              </div>
            </div>
            
            {/* Close button - larger touch target on mobile */}
            <button
              onClick={toggleSidebar}
              className="p-2 lg:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-amber-300 transition-colors duration-200 touch-manipulation"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* MOBILE-OPTIMIZED NAVIGATION */}
          <nav className="flex-1 overflow-y-auto py-2 px-2 lg:py-4 lg:px-3">
            <ul className="space-y-1 lg:space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.children ? (
                    <div>
                      {/* MOBILE-FRIENDLY SECTION HEADER */}
                      <button
                        onClick={() => toggleSection(item.name)}
                        className="w-full group flex items-center justify-between p-3 lg:p-3 rounded-xl text-slate-300 hover:bg-slate-700/30 transition-all duration-200 min-h-[52px] touch-manipulation"
                        aria-expanded={expandedSection === item.name}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon size={20} className="flex-shrink-0 text-slate-400" />
                          <span className="font-medium text-left">{item.name}</span>
                        </div>
                        <ChevronRight 
                          size={16} 
                          className={cn(
                            "transform transition-transform duration-200",
                            expandedSection === item.name ? "rotate-90" : ""
                          )} 
                        />
                      </button>
                      
                      {/* MOBILE-FRIENDLY SUBMENU */}
                      <div className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        expandedSection === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}>
                        <ul className="space-y-1 ml-4 lg:ml-4 pb-2">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <NavLink
                                to={child.href}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  cn(
                                    'group flex items-center p-3 lg:p-2 rounded-xl transition-all duration-200 relative overflow-hidden space-x-3 min-h-[48px] touch-manipulation',
                                    isActive
                                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/30'
                                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-amber-300 border border-transparent'
                                  )
                                }
                              >
                                <child.icon size={16} className="flex-shrink-0" />
                                <span className="text-sm lg:text-base font-medium">{child.name}</span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* MOBILE-FRIENDLY TOP-LEVEL LINKS */
                    <NavLink
                      to={item.href}
                      end={item.href === '/admin'}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center p-3 lg:p-3 rounded-xl transition-all duration-200 relative overflow-hidden space-x-3 min-h-[52px] touch-manipulation',
                          isActive
                            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/30 shadow-md backdrop-blur-sm'
                            : 'text-slate-300 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/30 hover:text-amber-200 border border-transparent hover:border-amber-500/20'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-r"></div>
                          )}
                          <item.icon 
                            size={20} 
                            className={cn(
                              'flex-shrink-0 transition-all duration-200',
                              isActive ? 'text-amber-400 drop-shadow-sm' : 'group-hover:text-amber-300'
                            )} 
                          />
                          <span className={cn(
                            'font-medium transition-all duration-200 text-sm lg:text-base',
                            isActive ? 'text-amber-200' : 'group-hover:text-amber-200'
                          )}>
                            {item.name}
                          </span>
                          {/* Subtle glow effect on hover */}
                          <div className={cn(
                            'absolute inset-0 rounded-xl transition-all duration-300 opacity-0',
                            isActive 
                              ? 'opacity-20 bg-gradient-to-r from-amber-400/10 to-yellow-400/5' 
                              : 'group-hover:opacity-10 group-hover:bg-gradient-to-r group-hover:from-amber-400/5 group-hover:to-yellow-400/5'
                          )}></div>
                        </>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* MOBILE-OPTIMIZED USER PROFILE */}
          <div className="p-3 lg:p-4 border-t border-amber-500/20 bg-gradient-to-r from-slate-800/30 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 font-bold shadow-lg ring-2 ring-amber-400/30 flex-shrink-0">
                  {userProfile?.display_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-amber-200 truncate">
                    {userProfile?.display_name || 'Admin User'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 lg:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 text-slate-400 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/30 touch-manipulation"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE-OPTIMIZED CONTENT WRAPPER */}
      <div className={cn(
        "min-h-screen w-full relative transition-all duration-300",
        // On mobile, full width always
        "lg:ml-0"
      )}>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/2 to-transparent pointer-events-none"></div>
        
        {/* MOBILE-RESPONSIVE CONTENT CONTAINER */}
        <div className={cn(
          "w-full mx-auto relative z-10 transition-all duration-300",
          // Mobile padding with safe area
          "px-2 py-2 sm:px-4 sm:py-4 mobile-safe-area",
          // Desktop padding
          "lg:px-6 lg:py-6",
          // Max width constraints
          "max-w-full lg:max-w-[2000px]"
        )}>
          <div className={cn(
            "relative overflow-hidden transition-all duration-300",
            // Mobile: Simplified card styling
            "bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border border-amber-500/10 dark:border-amber-400/10",
            // Mobile: Tighter border radius and padding
            "rounded-lg p-3 sm:p-4",
            // Desktop: Enhanced styling and padding
            "lg:rounded-xl lg:p-6 lg:shadow-xl"
          )}>
            {/* Persian-inspired corner decoration - hidden on small mobile */}
            <div className="hidden sm:block absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-bl-3xl"></div>
            <div className="hidden sm:block absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-400/10 to-transparent rounded-tr-3xl"></div>
            
            {/* CONTENT AREA WITH MOBILE SAFETY */}
            <div className="relative z-10 w-full overflow-x-hidden">
              {user && <Outlet />}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SAFE AREA BOTTOM PADDING */}
      <div className="lg:hidden h-[env(safe-area-inset-bottom)] bg-slate-900"></div>
    </div>
  );
};

export default MobileAdminLayout;