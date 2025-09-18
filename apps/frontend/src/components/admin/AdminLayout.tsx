'use client'
import { useState } from 'react'
import { useAuth, supabase } from '@zoroaster/shared'
import { 
  BarChart3, 
  FileText, 
  Globe, 
  ShoppingCart, 
  Users, 
  Settings,
  BookOpen,
  Clock,
  UserCircle,
  Palette,
  TestTube,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  LogOut,
  Home,
  Menu,
  X
} from 'lucide-react'
import { Link, useLocation, Outlet } from 'react-router-dom'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  {
    label: 'Content',
    icon: FileText,
    children: [
      { label: 'Pages', href: '/admin/content/pages' },
      { label: 'Blog', href: '/admin/content/blog' },
      { label: 'Files', href: '/admin/content/files' },
      { label: 'Chapters', href: '/admin/content/chapters' },
      { label: 'Works', href: '/admin/content/works' },
      { label: 'Homepage', href: '/admin/content/homepage' },
      { label: 'About', href: '/admin/content/about' }
    ]
  },
  {
    label: 'World',
    icon: Globe,
    children: [
      { label: 'Wiki', href: '/admin/world/wiki' },
      { label: 'Timelines', href: '/admin/world/timelines' },
      { label: 'Characters', href: '/admin/world/characters' },
      { label: 'Artist Collab', href: '/admin/world/artists' }
    ]
  },
  {
    label: 'Commerce',
    icon: ShoppingCart,
    children: [
      { label: 'Shop', href: '/admin/commerce/shop' },
      { label: 'Orders', href: '/admin/commerce/orders' },
      { label: 'Customers', href: '/admin/commerce/customers' }
    ]
  },
  {
    label: 'Beta',
    icon: TestTube,
    children: [
      { label: 'Applications', href: '/admin/beta/applications' },
      { label: 'Managers', href: '/admin/beta/managers' },
      { label: 'Activity', href: '/admin/beta/activity' }
    ]
  },
  {
    label: 'Settings',
    icon: Settings,
    children: [
      { label: 'Users', href: '/admin/settings/users' },
      { label: 'Roles', href: '/admin/settings/roles' },
      { label: 'Integrations', href: '/admin/settings/integrations' }
    ]
  }
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(
    sidebarItems.reduce((acc, item) => {
      if (item.children) acc[item.label] = true; // All items expanded by default
      return acc;
    }, {})
  );
  const { userProfile } = useAuth()
  const { pathname } = useLocation()

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Zoroasterverse</h1>
              <p className="text-xs opacity-75">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 pb-4 space-y-2 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => setOpenItems(prev => ({ ...prev, [item.label]: !prev[item.label] }))}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <div className={`transition-transform duration-200 ${
                      openItems[item.label] ? 'rotate-180' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  <div className={`transition-all duration-200 overflow-hidden ${
                    openItems[item.label] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="ml-9 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                            pathname === child.href
                              ? 'bg-indigo-50 text-indigo-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    pathname === item.href
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User profile section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 p-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userProfile?.role || 'Administrator'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Breadcrumb or page title could go here */}
              <div className="hidden lg:block">
                <h2 className="text-xl font-semibold text-gray-900">
                  {pathname === '/admin' ? 'Dashboard' : 
                   pathname.split('/').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || 'Admin'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Quick search..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-5 h-5" />
              </button>
              
              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userProfile?.role}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}