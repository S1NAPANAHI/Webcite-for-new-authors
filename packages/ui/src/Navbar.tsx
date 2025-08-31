import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { CartIcon } from './CartIcon';
import ThemeToggle from './components/ui/ThemeToggle';
import { Search } from 'lucide-react'; // Import Search icon

// Define a type for navigation links, including nested children
interface NavLinkItem {
  name: string;
  path: string;
  onClick?: () => void; // Optional onClick for action links like Logout
  children?: NavLinkItem[]; // Optional children for dropdowns
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Keep for mobile menu if needed
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [betaApplicationStatus, setBetaApplicationStatus] = useState('none');
  // const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session?.user?.user_metadata?.betaApplicationStatus) {
        setBetaApplicationStatus(session.user.user_metadata.betaApplicationStatus);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user?.user_metadata?.betaApplicationStatus) {
        setBetaApplicationStatus(session.user.user_metadata.betaApplicationStatus);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // navigate('/');
  };

  // New structured navigation links
  const navLinks: NavLinkItem[] = [
    { name: 'Home', path: '/' },
    {
      name: 'Explore', // New parent link
      path: '#', // Placeholder path for parent dropdown
      children: [
        // Removed Store and Subscriptions
        { name: 'Library', path: '/library' },
        { name: 'Wiki', path: '/wiki' },
        { name: 'Timelines', path: '/timelines' },
        { name: 'Characters', path: '/characters' },
        { name: 'Blog', path: '/blog' },
      ]
    },
    { name: 'Beta Program', path: '/beta/application' }, // Top-level
  ];

  // Add account/login links as a dropdown if authenticated, or top-level if not
  if (isAuthenticated) {
    const accountChildren: NavLinkItem[] = [];
    // Add Store and Subscriptions here
    accountChildren.push({ name: 'Store', path: '/store' });
    accountChildren.push({ name: 'Subscriptions', path: '/subscriptions' });
    if (betaApplicationStatus === 'accepted') {
      accountChildren.push({ name: 'Beta Portal', path: '/beta/portal' });
    }
    accountChildren.push({ name: 'My Account', path: '/account' });
    navLinks.push({ name: 'Account', path: '#', children: accountChildren });
    navLinks.push({ name: 'Logout', path: '#', onClick: handleLogout }); // Logout as a top-level action
  } else {
    navLinks.push({ name: 'Login', path: '/login' });
  }

  return (
    <header className="zoro-header">
      <div className="logo">
        <NavLink to="/">
          <h1>Zoroasterverse</h1>
        </NavLink>
      </div>

      <div className="header-controls">
        {/* Search Bar */}
        <form className="search-form">
          <input type="text" placeholder="Search..." />
          <button type="submit">
            <Search />
          </button>
        </form>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      <nav className="navbar">
          <ul className="nav-menu">
            {navLinks.map(link => (
              <li key={link.name} className={link.children ? 'dropdown' : ''}>
                {link.onClick ? (
                  <button onClick={link.onClick} className="nav-link">
                    {link.name}
                  </button>
                ) : (
                  <NavLink to={link.path} className="nav-link">
                    {link.name} {link.children ? '▾' : ''}
                  </NavLink>
                )}
                {link.children && (
                  <ul className="dropdown-menu">
                    {link.children.map(childLink => (
                      <li key={childLink.name}>
                        <NavLink to={childLink.path} className="dropdown-menu-item">
                          {childLink.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
      </nav>
    </header>
  );
};
