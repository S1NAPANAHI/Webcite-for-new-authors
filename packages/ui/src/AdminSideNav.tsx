import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@zoroaster/shared/utils';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { supabase } from '@zoroaster/shared/supabaseClient';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Settings,
  Users,
  Upload,
  Menu,
  X,
  LogOut,
  Calendar,
  ShoppingCart,
  Package,
  BarChart3,
  Webhook,
  Boxes,
  type LucideIcon
} from 'lucide-react';

// Context for managing sidebar state
const AdminSideNavContext = createContext<{
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
} | undefined>(undefined);

export const useAdminSideNav = () => {
  const context = useContext(AdminSideNavContext);
  if (!context) {
    throw new Error('useAdminSideNav must be used within AdminSideNavProvider');
  }
  return context;
};

// Provider component
export const AdminSideNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    console.log('AdminSideNav: toggle called, current state:', isOpen);
    setIsOpen(!isOpen);
  };
  const close = () => {
    console.log('AdminSideNav: close called, current state:', isOpen);
    setIsOpen(false);
  };

  return (
    <AdminSideNavContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </AdminSideNavContext.Provider>
  );
};

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/account/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/account/admin/products', icon: Package },
  { name: 'Orders', href: '/account/admin/orders', icon: ShoppingCart },
  { name: 'Inventory', href: '/account/admin/inventory', icon: Boxes },
  { name: 'Analytics', href: '/account/admin/analytics', icon: BarChart3 },
  { name: 'Posts', href: '/account/admin/posts', icon: FileText },
  { name: 'Works', href: '/account/admin/works', icon: BookOpen },
  { name: 'Timeline', href: '/account/admin/timeline/events', icon: Calendar },
  { name: 'Users', href: '/account/admin/users', icon: Users },
  { name: 'Beta Applications', href: '/account/admin/beta-applications', icon: Users },
  { name: 'Webhooks', href: '/account/admin/webhooks', icon: Webhook },
  { name: 'Media', href: '/account/admin/media', icon: Upload },
  { name: 'Settings', href: '/account/admin/settings', icon: Settings },
];

// Toggle Button Component (always visible when sidebar is closed)
export const AdminSideNavToggle: React.FC = () => {
  const { isOpen, toggle } = useAdminSideNav();

  // Only show when sidebar is closed
  if (isOpen) return null;

  return (
    <button
      onClick={toggle}
      className="fixed top-4 left-4 z-[10000] p-3 rounded-lg bg-slate-800 border border-amber-500/50 shadow-xl hover:bg-slate-700 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all duration-300 group"
      aria-label="Toggle navigation menu"
    >
      <Menu size={20} className="transition-transform duration-200 group-hover:scale-110" />
    </button>
  );
};

// Side Navigation Component
export const AdminSideNav: React.FC = () => {
  const { isOpen, close } = useAdminSideNav();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleLinkClick = () => {
    console.log('AdminSideNav: handleLinkClick called');
    close(); // Close sidebar when navigating
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('AdminSideNav: handleCloseClick called');
    close();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('AdminSideNav: handleBackdropClick called');
    close();
  };

  // Add keyboard escape handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        console.log('AdminSideNav: Escape key pressed');
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  // Only render when open
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={close}
      />

      {/* Sidebar */}
      <aside 
        className="fixed top-0 left-0 z-[9999] h-screen w-80 border-r border-amber-500 shadow-2xl animate-in slide-in-from-left duration-300" 
        style={{ backgroundColor: '#0f172a', backdropFilter: 'none' }}
      >
        <div className="h-full flex flex-col relative" style={{ backgroundColor: '#0f172a', backdropFilter: 'none' }}>
          {/* Persian-inspired decorative border */}
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600"></div>
          
          {/* Header */}
          <div className="p-6 border-b border-amber-500" style={{ backgroundColor: '#1e293b', backdropFilter: 'none' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-slate-900 font-bold text-lg">Z</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-amber-300">Zoroaster</h2>
                  <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
                </div>
              </div>
              
              {/* Toggle Button inside sidebar */}
              <button
                onClick={close}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-amber-300 transition-colors duration-200"
                aria-label="Close menu"
              >
                <X size={20} className="transition-transform duration-200 hover:rotate-90" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3" style={{ backgroundColor: '#0f172a', backdropFilter: 'none' }}>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/account/admin'}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden space-x-3',
                        isActive
                          ? 'bg-amber-600 text-amber-100 border border-amber-500 shadow-md'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-amber-200 border border-transparent hover:border-amber-500'
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
                          'font-medium transition-all duration-200',
                          isActive ? 'text-amber-200' : 'group-hover:text-amber-200'
                        )}>
                          {item.name}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-amber-500" style={{ backgroundColor: '#1e293b', backdropFilter: 'none' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 font-bold shadow-lg ring-2 ring-amber-400/30">
                  {userProfile?.display_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-200 truncate max-w-[160px]">{userProfile?.display_name || 'Admin User'}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[160px]">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 text-slate-400 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/30"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSideNav;
