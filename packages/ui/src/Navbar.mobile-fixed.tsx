import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { CartIcon } from './CartIcon';
import ThemeToggle from './components/ui/ThemeToggle';
import { Search, Menu, X, ChevronDown, Home, BookOpen, Users, User, LogOut } from 'lucide-react';
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
  icon?: React.ComponentType<any>;
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

  // Detect mobile screen size with proper cleanup
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    const resizeListener = () => checkIsMobile();
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMobileMenuOpen(false);
    setExpandedDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setExpandedDropdown(null);
    setIsSearchExpanded(false); // Close search when opening menu
  };

  const toggleDropdown = (linkName: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setExpandedDropdown(expandedDropdown === linkName ? null : linkName);
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

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setExpandedDropdown(null);
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobile]);

  // MOBILE-OPTIMIZED NAVIGATION STRUCTURE
  const navLinks: NavLinkItem[] = [
    { name: 'Home', path: '/', icon: Home },
    {
      name: 'Explore',
      path: '#',
      icon: BookOpen,
      children: [
        { name: 'Library', path: '/library' },
        { name: 'Learn', path: '/learn' },
        { name: 'Wiki', path: '/wiki' },
        { name: 'Timelines', path: '/timelines' },
        { name: 'Characters', path: '/characters' },
        { name: 'Blog', path: '/blog' },
      ]
    },
  ];

  // Add authentication-specific links
  if (isAuthenticated) {
    navLinks.push({ name: 'Beta Program', path: '/beta/application', icon: Users });
    
    const accountChildren: NavLinkItem[] = [
      { name: 'Store', path: '/store' },
      { name: 'Subscriptions', path: '/subscriptions' },
      { name: 'My Account', path: '/account' },
    ];
    
    if (betaApplicationStatus === 'accepted') {
      accountChildren.splice(2, 0, { name: 'Beta Portal', path: '/beta/portal' });
    }
    
    navLinks.push({ name: 'Account', path: '#', icon: User, children: accountChildren });
  } else {
    navLinks.push({ name: 'Login', path: '/login', icon: User });
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setExpandedDropdown(null);
    setIsSearchExpanded(false);
  };

  const NavLinkComponent: React.FC<{ 
    to: string; 
    children: React.ReactNode; 
    onClick?: () => void;
    className?: string;
  }> = ({ to, children, onClick, className = '' }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={`${styles.navLink} ${styles.touchFriendly} ${className}`}
    >
      {children}
    </NavLink>
  );

  const DropdownButton: React.FC<{ 
    label: string;
    icon?: React.ComponentType<any>;
    isOpen: boolean; 
    onClick: (e: React.MouseEvent | React.TouchEvent) => void;
  }> = ({ label, icon: Icon, isOpen, onClick }) => (
    <button
      onClick={onClick}
      className={`${styles.navLink} ${styles.dropdownToggle} ${styles.touchFriendly} w-full justify-between`}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <div className="flex items-center space-x-2">
        {Icon && <Icon size={18} />}
        <span>{label}</span>
      </div>
      <ChevronDown 
        className={`${styles.dropdownArrow} ${isOpen ? styles.expanded : ''} transition-transform duration-200`}
        size={16}
      />
    </button>
  );

  return (
    <header ref={headerRef} className={`${styles.zoroHeader} mobile-safe`}>
      {/* MOBILE-OPTIMIZED LOGO */}
      <div className={styles.logo}>
        <NavLink to="/" onClick={handleLinkClick} className="flex items-center space-x-2">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-bold text-sm lg:text-base">Z</span>
          </div>
          <h1 className="text-lg lg:text-xl font-bold text-primary">Zoroasterverse</h1>
        </NavLink>
      </div>

      {/* MOBILE-FIRST HEADER CONTROLS */}
      <div className={styles.headerControls}>
        {/* Desktop Search Bar */}
        <form className={`${styles.searchForm} ${styles.desktopSearch} hidden lg:flex`}>
          <input 
            type="text" 
            placeholder="Search..." 
            className="min-w-[200px]" 
          />
          <button type="submit" className="px-3">
            <Search size={16} />
          </button>
        </form>

        {/* Mobile Search Toggle - Enhanced */}
        <button 
          className={`${styles.mobileSearchToggle} lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center`}
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          aria-label="Toggle search"
        >
          <Search size={20} />
        </button>

        {/* Theme Toggle - Mobile Optimized */}
        <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ThemeToggle />
        </div>

        {/* Cart Icon - Mobile Optimized */}
        {isAuthenticated && (
          <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
            <CartIcon />
          </div>
        )}

        {/* ENHANCED Mobile Menu Toggle */}
        <button 
          className={`${styles.mobileMenuToggle} ${styles.touchFriendlyButton} lg:hidden`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE SEARCH BAR - Enhanced */}
      <div className={`${styles.mobileSearchContainer} ${isSearchExpanded ? styles.expanded : ''} lg:hidden`}>
        <form className={styles.searchForm}>
          <input 
            type="text" 
            placeholder="Search stories, characters, wiki..."
            className="text-base" // Prevent iOS zoom
            autoFocus={isSearchExpanded}
          />
          <button type="submit" className="px-3 min-h-[44px] min-w-[44px]">
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* MOBILE-FIRST NAVIGATION MENU */}
      <nav className={`${styles.navbar} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className={`${styles.mobileMenuOverlay} fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]`}
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ touchAction: 'none' }}
          />
        )}

        {/* Navigation Menu with Mobile Optimization */}
        <ul className={`${styles.navMenu} ${
          isMobile ? 'mobile-menu-mobile' : ''
        }`}>
          {navLinks.map(link => (
            <li key={link.name} className={`${
              link.children ? styles.dropdown : ''
            } ${isMobile ? 'mobile-nav-item' : ''}`}>
              {link.onClick ? (
                // Action buttons (like logout)
                <button 
                  onClick={() => {
                    link.onClick!();
                    handleLinkClick();
                  }} 
                  className={`${styles.navLink} ${styles.touchFriendly} w-full text-left flex items-center space-x-2`}
                >
                  {link.icon && <link.icon size={18} />}
                  <span>{link.name}</span>
                </button>
              ) : link.children ? (
                // Dropdown menus
                <>
                  <DropdownButton
                    label={link.name}
                    icon={link.icon}
                    isOpen={expandedDropdown === link.name}
                    onClick={(e) => toggleDropdown(link.name, e)}
                  />
                  <ul className={`${
                    styles.dropdownMenu
                  } ${
                    expandedDropdown === link.name ? styles.expanded : ''
                  } ${
                    isMobile ? 'mobile-dropdown' : ''
                  }`}>
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
                // Regular navigation links
                <NavLinkComponent 
                  to={link.path} 
                  onClick={handleLinkClick}
                  className="flex items-center space-x-2"
                >
                  {link.icon && <link.icon size={18} />}
                  <span>{link.name}</span>
                </NavLinkComponent>
              )}
            </li>
          ))}
          
          {/* Mobile-specific logout button */}
          {isAuthenticated && isMobile && (
            <li className="border-t border-border/40 pt-4 mt-4">
              <button 
                onClick={handleLogout}
                className={`${styles.navLink} ${styles.touchFriendly} w-full text-left flex items-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-500/10`}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

// Add mobile-specific styles
const mobileStyles = `
  .mobile-menu-mobile {
    padding-top: env(safe-area-inset-top, 1rem);
    padding-bottom: env(safe-area-inset-bottom, 2rem);
  }
  
  .mobile-nav-item {
    border-bottom: 1px solid hsl(var(--border) / 0.3);
  }
  
  .mobile-nav-item:last-child {
    border-bottom: none;
  }
  
  .mobile-dropdown {
    background: hsl(var(--muted)) !important;
    margin-top: 0 !important;
    border-radius: 0 !important;
    border-left: 3px solid hsl(var(--primary)) !important;
  }
  
  @media (max-width: 768px) {
    .mobile-menu-mobile .navLink {
      font-size: 1.1rem !important;
      padding: 1rem 1.5rem !important;
      min-height: 56px !important;
    }
    
    .mobile-dropdown .dropdownMenuItem {
      padding: 0.875rem 2rem !important;
      min-height: 48px !important;
      font-size: 1rem !important;
    }
    
    .mobile-nav-item .navLink:hover {
      background: hsl(var(--primary)) !important;
      color: white !important;
      transform: translateX(4px) !important;
    }
    
    .mobile-dropdown .dropdownMenuItem:hover {
      background: hsl(var(--primary)) !important;
      color: white !important;
      padding-left: 2.5rem !important;
    }
  }
`;

// Inject mobile styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('navbar-mobile-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'navbar-mobile-styles';
  styleSheet.textContent = mobileStyles;
  document.head.appendChild(styleSheet);
}