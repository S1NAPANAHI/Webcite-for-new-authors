import React, { useState } from 'react';
import { Flame, Star, ShoppingCart, Heart } from 'lucide-react';

interface TierBenefits {
  discount: number;
  multiplier: number;
  badge: string;
  name: string;
}

interface StoreSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userTier: string;
  sacredFirePoints: number;
  tierBenefits: { [key: string]: TierBenefits };
}

const StoreSidebar: React.FC<StoreSidebarProps> = ({
  searchQuery,
  setSearchQuery,
  userTier,
  sacredFirePoints,
  tierBenefits,
}) => {
  return (
    <aside className="store-sidebar">
      <div className="sidebar-section">
        <div className="logo">
          <span className="fire-symbol">🔥</span>
          <span className="logo-text">Sacred Treasury</span>
        </div>
      </div>

      <div className="sidebar-section search-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search the sacred treasury..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <nav className="sidebar-navigation">
        <div className="nav-actions">
          <button className="nav-btn wishlist-btn">
            💖 <span className="badge">0</span>
          </button>
          <button className="nav-btn cart-btn">
            🛍️ <span className="badge">0</span>
          </button>
          <div className="user-profile">
            <span className="tier-badge">
              {tierBenefits[userTier as keyof typeof tierBenefits].badge}
            </span>
            <span className="username">Seeker</span>
          </div>
        </div>
      </nav>

      {/* Additional sidebar content can go here */}
    </aside>
  );
};

export default StoreSidebar;
