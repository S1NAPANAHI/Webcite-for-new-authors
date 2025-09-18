import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CartIcon } from './CartIcon';
import ThemeToggle from './components/ui/ThemeToggle';
import { Search } from 'lucide-react';
import styles from './Navbar.module.css';

// Type for the auth state passed as props
interface NavbarProps {
  isAuthenticated?: boolean;
  betaApplicationStatus?: string;
  onLogout?: () => void;
}

// Define a type for navigation links, including nested children
interface NavLinkItem {
  name: string;
  path: string;
  onClick?: () => void; // Optional onClick for action links like Logout
  children?: NavLinkItem[]; // Optional children for dropdowns
}

export const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated = false, 
  betaApplicationStatus = 'none', 
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false); // Keep for mobile menu if needed

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
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
        { name: 'Learn', path: '/learn' },
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
    <header className={styles.zoroHeader}>
      <div className={styles.logo}>
        <NavLink to="/">
          <h1>Zoroastervers</h1>
        </NavLink>
      </div>

      <div className={styles.headerControls}>
        {/* Search Bar */}
        <form className={styles.searchForm}>
          <input type="text" placeholder="Search..." />
          <button type="submit">
            <Search />
          </button>
        </form>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      <nav className={styles.navbar}>
          <ul className={styles.navMenu}>
            {navLinks.map(link => (
              <li key={link.name} className={link.children ? styles.dropdown : ''}>
                {link.onClick ? (
                  <button onClick={link.onClick} className={styles.navLink}>
                    {link.name}
                  </button>
                ) : (
                  <NavLink to={link.path} className={styles.navLink}>
                    {link.name} {link.children ? '▾' : ''}
                  </NavLink>
                )}
                {link.children && (
                  <ul className={styles.dropdownMenu}>
                    {link.children.map(childLink => (
                      <li key={childLink.name}>
                        <NavLink to={childLink.path} className={styles.dropdownMenuItem}>
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
