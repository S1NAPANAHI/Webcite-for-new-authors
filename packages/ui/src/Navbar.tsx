import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { CartIcon } from './CartIcon';
import ThemeToggle from './components/ui/ThemeToggle';
import { Search, Menu, X, ChevronDown, Smartphone } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMobileMenuOpen(false); // Close mobile menu after logout
    setExpandedDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setExpandedDropdown(null);
  };

  const toggleDropdown = (linkName: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isMobile) {
      setExpandedDropdown(expandedDropdown === linkName ? null : linkName);
    } else {
      setExpandedDropdown(expandedDropdown === linkName ? null : linkName);
    }
  };

  // Handle clicks outside to close dropdowns and mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setExpandedDropdown(null);
        if (isMobile) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile]);

  // Close mobile menu when route changes or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setExpandedDropdown(null);
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setExpandedDropdown(null);
  };

  const NavLinkComponent: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ 
    to, 
    children, 
    onClick 
  }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={`${styles.navLink} ${styles.touchFriendly}`}
    >
      {children}
    </NavLink>
  );

  const DropdownButton: React.FC<{ 
    label: string; 
    isOpen: boolean; 
    onClick: (e: React.MouseEvent | React.TouchEvent) => void;
  }> = ({ label, isOpen, onClick }) => (
    <button
      onClick={onClick}
      className={`${styles.navLink} ${styles.dropdownToggle} ${styles.touchFriendly}`}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <span>{label}</span>
      <ChevronDown 
        className={`${styles.dropdownArrow} ${isOpen ? styles.expanded : ''}`}
        size={16}
      />
    </button>
  );

  return (
    <header ref={headerRef} className={styles.zoroHeader}>
            {/* Left Section: Search and Theme Toggle */}
            <div className={styles.leftControls}>
              {/* Android App Download Link */}
              <NavLink
                to="/download-app"
                onClick={handleLinkClick}
                className={`${styles.navLink} ${styles.touchFriendly}`}
                aria-label="Download Android App"
              >
                <Smartphone size={20} />
              </NavLink>

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
            </div>
      
            {/* Center Section: Logo */}
            <div className={styles.logo}>
              <NavLink to="/" onClick={handleLinkClick}>
                <h1>Zoroastervers</h1>
              </NavLink>
            </div>
      
            {/* Right Section: Mobile Menu Toggle and Navigation */}
            <div className={styles.rightControls}>
              {/* Mobile Menu Toggle - ENHANCED */}
              <button
                className={`${styles.mobileMenuToggle} ${styles.touchFriendlyButton}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
      
              {/* Navigation Menu (Desktop) */}
              <nav className={styles.desktopNav}>
                <ul className={styles.navMenu}>
                  {navLinks.map(link => (
                    <li key={link.name} className={link.children ? styles.dropdown : ''}>
                      {link.onClick ? (
                        <button
                          onClick={link.onClick}
                          className={`${styles.navLink} ${styles.touchFriendly}`}
                        >
                          {link.name}
                        </button>
                      ) : link.children ? (
                        <>
                          <DropdownButton
                            label={link.name}
                            isOpen={expandedDropdown === link.name}
                            onClick={(e) => toggleDropdown(link.name, e)}
                          />
                          <ul className={`${styles.dropdownMenu} ${expandedDropdown === link.name ? styles.expanded : ''}`}>
                            {link.children.map(childLink => (
                              <li key={childLink.name}>
                                <NavLink
                                  to={childLink.path}
                                  className={`${styles.dropdownMenuItem} ${styles.touchFriendly}`}
                                  onClick={handleLinkClick}
                                >
                                  {childLink.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <NavLinkComponent
                          to={link.path}
                          onClick={handleLinkClick}
                        >
                          {link.name}
                        </NavLinkComponent>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
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
                <button 
                  onClick={link.onClick} 
                  className={`${styles.navLink} ${styles.touchFriendly}`}
                >
                  {link.name}
                </button>
              ) : link.children ? (
                <>
                  <DropdownButton
                    label={link.name}
                    isOpen={expandedDropdown === link.name}
                    onClick={(e) => toggleDropdown(link.name, e)}
                  />
                  <ul className={`${styles.dropdownMenu} ${expandedDropdown === link.name ? styles.expanded : ''}`}>
                    {link.children.map(childLink => (
                      <li key={childLink.name}>
                        <NavLink 
                          to={childLink.path} 
                          className={`${styles.dropdownMenuItem} ${styles.touchFriendly}`}
                          onClick={handleLinkClick}
                        >
                          {childLink.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NavLinkComponent 
                  to={link.path} 
                  onClick={handleLinkClick}
                >
                  {link.name}
                </NavLinkComponent>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};