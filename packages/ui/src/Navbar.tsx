import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CartIcon } from './CartIcon';
import ThemeToggle from './components/ui/ThemeToggle';
import { Search, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setExpandedDropdown(null);
        setIsSearchExpanded(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.navbar}`) && !target.closest(`.${styles.mobileMenuToggle}`)) {
        setIsMobileMenuOpen(false);
        setExpandedDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // New structured navigation links
  const navLinks: NavLinkItem[] = [
    { name: 'Home', path: '/' },
    {
      name: 'Explore', // New parent link
      path: '#', // Placeholder path for parent dropdown
      children: [
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

  const toggleDropdown = (linkName: string) => {
    setExpandedDropdown(expandedDropdown === linkName ? null : linkName);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setExpandedDropdown(null);
  };

  return (
    <header className={styles.zoroHeader}>
      {/* Logo */}
      <div className={styles.logo}>
        <NavLink to="/" onClick={handleLinkClick}>
          <h1>Zoroastervers</h1>
        </NavLink>
      </div>

      {/* Desktop Header Controls */}
      <div className={styles.headerControls}>
        {/* Search Bar - Desktop */}
        <form className={`${styles.searchForm} ${styles.desktopSearch}`}>
          <input type="text" placeholder="Search..." />
          <button type="submit">
            <Search size={16} />
          </button>
        </form>

        {/* Mobile Search Toggle */}
        <button 
          className={styles.mobileSearchToggle}
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          aria-label="Toggle search"
        >
          <Search size={20} />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Search Bar */}
      <div className={`${styles.mobileSearchContainer} ${isSearchExpanded ? styles.expanded : ''}`}>
        <form className={styles.searchForm}>
          <input type="text" placeholder="Search..." />
          <button type="submit">
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Navigation Menu */}
      <nav className={`${styles.navbar} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className={styles.mobileMenuOverlay}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Navigation Menu */}
        <ul className={styles.navMenu}>
          {navLinks.map(link => (
            <li key={link.name} className={link.children ? styles.dropdown : ''}>
              {link.onClick ? (
                <button onClick={link.onClick} className={styles.navLink}>
                  {link.name}
                </button>
              ) : link.children ? (
                <>
                  <button 
                    className={`${styles.navLink} ${styles.dropdownToggle}`}
                    onClick={() => toggleDropdown(link.name)}
                    aria-expanded={expandedDropdown === link.name}
                    aria-haspopup="true"
                  >
                    {link.name} 
                    <span className={`${styles.dropdownArrow} ${expandedDropdown === link.name ? styles.expanded : ''}`}>
                      ▾
                    </span>
                  </button>
                  <ul className={`${styles.dropdownMenu} ${expandedDropdown === link.name ? styles.expanded : ''}`}>
                    {link.children.map(childLink => (
                      <li key={childLink.name}>
                        <NavLink 
                          to={childLink.path} 
                          className={styles.dropdownMenuItem}
                          onClick={handleLinkClick}
                        >
                          {childLink.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NavLink 
                  to={link.path} 
                  className={styles.navLink}
                  onClick={handleLinkClick}
                >
                  {link.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};