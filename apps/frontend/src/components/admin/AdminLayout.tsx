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
  ChevronUp
} from 'lucide-react'
import { Link, useLocation, Outlet } from 'react-router-dom'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900">
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <h1 className="text-white font-semibold">Creative Admin</h1>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => setOpenItems(prev => ({ ...prev, [item.label]: !prev[item.label] }))}
                    className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </div>
                    {openItems[item.label] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openItems[item.label] && (
                    <div className="ml-8 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`block px-2 py-1 text-sm rounded-md ${
                            pathname === child.href
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64 w-[calc(100%-256px)]">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            

            <div className="flex items-center space-x-4">
              <input
                type="search"
                placeholder="Quick search..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {userProfile?.email} ({userProfile?.role})
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      
    </div>
  )
}
