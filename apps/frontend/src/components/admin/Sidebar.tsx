import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const menu = [
  { label: 'Dashboard', to: '/admin', roles: ['admin','manager', 'super_admin'] },
  { label: 'Users', to: '/admin/users', roles: ['admin', 'super_admin'], priv: ['manage_users'] },
  // add more entries...
];

export default function Sidebar() {
  const { user } = useAdminAuth();
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-6 font-bold text-lg">Admin Panel</div>
      <nav className="space-y-2">
        {menu.map(item => {
          const hasRole = user && item.roles.includes(user.role?.toLowerCase() || '');
          const hasPrivileges = !item.priv || (user?.privileges && item.priv.every(p => user.privileges.includes(p)));

          const show = hasRole && hasPrivileges;

          return (
            show && (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded transition-colors ${
                    isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          );
        })}
      </nav>
    </aside>
  );
}
