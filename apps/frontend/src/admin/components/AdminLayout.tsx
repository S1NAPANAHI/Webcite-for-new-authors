import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Home,
  Users,
  ShoppingCart,
  BookOpen,
  FileText,
  Globe,
  Settings,
  LayoutDashboard,
  BookMarked,
  File,
  UserCheck,
  Package,
  ClipboardList,
  Book,
  Clock,
  ScrollText,
  Smartphone
} from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    name: 'Content Management',
    children: [
      { name: 'Homepage', href: '/admin/content/homepage', icon: Home },
      { name: 'Blog Posts', href: '/admin/content/blog', icon: FileText },
      { name: 'Pages', href: '/admin/content/pages', icon: File },
      { name: 'Chapters', href: '/admin/content/chapters', icon: Book },
      { name: 'Files & Media', href: '/admin/content/files', icon: ScrollText },
      { name: 'Social Media', href: '/admin/social-media', icon: Smartphone },
    ],
  },
  {
    name: 'Commerce',
    children: [
      { name: 'Products', href: '/admin/commerce/products', icon: Package },
      { name: 'Orders', href: '/admin/commerce/orders', icon: ClipboardList },
      { name: 'Customers', href: '/admin/commerce/customers', icon: Users },
    ],
  },
  {
    name: 'World Management',
    children: [
      { name: 'Wiki', href: '/admin/world/wiki', icon: BookMarked },
      { name: 'Characters', href: '/admin/world/characters', icon: Users },
      { name: 'Timeline', href: '/admin/world/timeline', icon: Clock },
    ],
  },
  { name: 'Learn Page', href: '/admin/learn', icon: BookOpen },
  { name: 'Beta Applications', href: '/admin/beta-applications', icon: UserCheck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {adminNavigation.map((item) => (
            <div key={item.name}>
              {item.href ? (
                <NavLink
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                  {item.name}
                </NavLink>
              ) : (
                <>
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {item.name}
                  </h3>
                  <ul className="ml-4 mt-1 space-y-1">
                    {item.children?.map((child) => (
                      <li key={child.name}>
                        <NavLink
                          to={child.href}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`
                          }
                        >
                          {child.icon && <child.icon className="w-5 h-5 mr-3" />}
                          {child.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {/* The actual page title will be rendered by the Outlet content */}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;