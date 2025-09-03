import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/account/admin', icon: LayoutDashboard },
  
  // E-commerce Section
  { name: 'Products', href: '/account/admin/products', icon: Package },
  { name: 'Orders', href: '/account/admin/orders', icon: ShoppingCart },
  { name: 'Inventory', href: '/account/admin/inventory', icon: Boxes },
  { name: 'Analytics', href: '/account/admin/analytics', icon: BarChart3 },
  
  // Content Management
  { name: 'Posts', href: '/account/admin/posts', icon: FileText },
  { name: 'Works', href: '/account/admin/works', icon: BookOpen },
  { name: 'Timeline', href: '/account/admin/timeline/events', icon: Calendar },
  
  // User & System Management
  { name: 'Users', href: '/account/admin/users', icon: Users },
  { name: 'Beta Applications', href: '/account/admin/beta-applications', icon: Users },
  
  // System & Configuration
  { name: 'Webhooks', href: '/account/admin/webhooks', icon: Webhook },
  { name: 'Media', href: '/account/admin/media', icon: Upload },
  { name: 'Settings', href: '/account/admin/settings', icon: Settings },
];

interface AdminNavigationOverlayProps {
  className?: string;
}

export const AdminNavigationOverlay: React.FC<AdminNavigationOverlayProps> = ({ className }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleBackdropClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={cn("fixed inset-0 z-[10000] pointer-events-none", className)}>
      {/* Always visible menu toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[10001] p-3 rounded-lg bg-slate-800/90 backdrop-blur-sm border border-amber-500/30 shadow-xl hover:bg-slate-700/90 hover:border-amber-400/50 text-amber-300 hover:text-amber-200 transition-all duration-300 group pointer-events-auto"
        aria-label="Toggle navigation menu"
      >
        {isSidebarOpen ? (
          <X size={20} className="transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <Menu size={20} className="transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>

      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] transition-opacity duration-300 pointer-events-auto"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar Overlay */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-[10002] h-screen w-80 bg-gradient-to-b from-slate-800 via-slate-900 to-gray-900 border-r border-amber-500/20 backdrop-blur-sm shadow-2xl transition-transform duration-300 ease-out pointer-events-auto',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col relative">
          {/* Persian-inspired decorative border */}
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 opacity-60"></div>
          
          {/* Header with Logo and Close Button */}
          <div className="p-6 border-b border-amber-500/30 bg-gradient-to-r from-slate-800/50 to-transparent relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-slate-900 font-bold text-lg">Z</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">Zoroaster</h2>
                <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
              </div>
            </div>
            
            {/* Close button in header */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-amber-300 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/account/admin'}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden space-x-3',
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
                          'font-medium transition-all duration-200',
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
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-amber-500/20 bg-gradient-to-r from-slate-800/30 to-transparent">
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
    </div>
  );
};

export default AdminNavigationOverlay;
