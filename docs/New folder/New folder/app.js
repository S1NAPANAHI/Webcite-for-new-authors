// Application Data
const appData = {
  userProfile: {
    tier: "initiate",
    sacredFirePoints: 150,
    tierBadge: "🔰",
    nextTierPoints: 350
  },
  categories: [
    {
      id: "literature",
      name: "Digital Literature",
      icon: "📚",
      description: "Epic tales of ancient wisdom",
      gradient: "from-blue-500 to-cyan-600",
      productCount: 18,
      featured: "Fire Temple Chronicles"
    },
    {
      id: "learning", 
      name: "Learning Academy",
      icon: "🎓",
      description: "Master the art of storytelling",
      gradient: "from-emerald-500 to-teal-600", 
      productCount: 12,
      featured: "Persian Writing Masterclass"
    },
    {
      id: "merchandise",
      name: "Sacred Merchandise", 
      icon: "👕",
      description: "Wear the symbols of light",
      gradient: "from-purple-500 to-pink-600",
      productCount: 8,
      featured: "Ahura Mazda T-Shirt"
    },
    {
      id: "services",
      name: "Professional Services",
      icon: "💼", 
      description: "Expert guidance for authors",
      gradient: "from-indigo-500 to-purple-600",
      productCount: 5,
      featured: "Mythology Consultation"
    },
    {
      id: "digital-art",
      name: "Digital Assets",
      icon: "🎨",
      description: "Artistic visions of mythology", 
      gradient: "from-rose-500 to-red-600",
      productCount: 15,
      featured: "Zarathustra Portrait Set"
    },
    {
      id: "audio",
      name: "Audio Experience",
      icon: "🎵",
      description: "Immersive Persian soundscapes",
      gradient: "from-yellow-500 to-amber-600",
      productCount: 9, 
      featured: "Epic Persian Soundscape"
    }
  ],
  featuredProducts: [
    {
      id: 1,
      title: "Fire Temple Chronicles: The Sacred Flame",
      price: 12.99,
      originalPrice: 15.99,
      rating: 4.8,
      reviewCount: 127,
      category: "Digital Literature",
      categoryId: "literature",
      badges: ["Bestseller", "Award Winner"],
      description: "An epic tale of ancient Persian mythology brought to life through modern storytelling.",
      characters: ["Ahura Mazda", "Zarathustra", "Angra Mainyu"],
      image: "📖"
    },
    {
      id: 2,
      title: "Persian Writing Masterclass",
      price: 49.99,
      rating: 4.9,
      reviewCount: 89,
      category: "Learning Academy", 
      categoryId: "learning",
      badges: ["New", "Staff Pick"],
      description: "Learn to craft epic fantasy stories inspired by Persian mythology.",
      difficulty: "Intermediate",
      duration: "6 hours",
      image: "🎓"
    },
    {
      id: 3,
      title: "Ahura Mazda Sacred Symbol T-Shirt",
      price: 24.99,
      rating: 4.6,
      reviewCount: 34,
      category: "Sacred Merchandise",
      categoryId: "merchandise",
      badges: ["Limited Edition"],
      description: "Premium cotton t-shirt featuring the sacred Faravahar symbol.",
      characters: ["Ahura Mazda"],
      sizes: ["S", "M", "L", "XL"],
      image: "👕"
    },
    {
      id: 4,
      title: "Zarathustra Character Art Collection",
      price: 19.99,
      rating: 4.7,
      reviewCount: 56,
      category: "Digital Assets",
      categoryId: "digital-art",
      badges: ["Digital"],
      description: "High-resolution digital artwork of the prophet Zarathustra.",
      characters: ["Zarathustra"],
      format: "PNG, JPG",
      resolution: "4K",
      image: "🎨"
    },
    {
      id: 5,
      title: "Sacred Fire Meditation Tracks",
      price: 9.99,
      rating: 4.5,
      reviewCount: 78,
      category: "Audio Experience",
      categoryId: "audio",
      badges: ["Relaxing"],
      description: "Ambient Persian-inspired music for meditation and focus.",
      duration: "60 minutes",
      format: "MP3, FLAC",
      image: "🎵"
    },
    {
      id: 6,
      title: "Mythology Research Consultation",
      price: 75.00,
      rating: 5.0,
      reviewCount: 12,
      category: "Professional Services",
      categoryId: "services",
      badges: ["Professional"],
      description: "One-on-one consultation for accurate Persian mythology representation.",
      duration: "90 minutes",
      delivery: "Video call",
      image: "💼"
    }
  ]
};

// State management
let currentFilter = 'all';
let wishlistItems = [];
let cartItems = [];

// DOM Elements
const categoriesGrid = document.getElementById('categoriesGrid');
const productsGrid = document.getElementById('productsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const wishlistBtn = document.querySelector('.wishlist-btn .badge');
const cartBtn = document.querySelector('.cart-btn .badge');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  renderCategories();
  renderProducts();
  initializeEventListeners();
  animateFireOrbs();
  updateCartBadges();
});

// Render category cards
function renderCategories() {
  const categoriesHTML = appData.categories.map(category => `
    <div class="category-card ${category.id}" data-category="${category.id}">
      <div class="category-content">
        <div class="category-header">
          <span class="category-icon">${category.icon}</span>
          <div class="category-info">
            <h3>${category.name}</h3>
            <p>${category.description}</p>
          </div>
        </div>
        <div class="category-footer">
          <span class="product-count">${category.productCount} items</span>
          <span class="featured-product">Featured: ${category.featured}</span>
        </div>
      </div>
    </div>
  `).join('');
  
  categoriesGrid.innerHTML = categoriesHTML;
}

// Render product cards
function renderProducts(filter = 'all') {
  let filteredProducts = appData.featuredProducts;
  
  if (filter !== 'all') {
    filteredProducts = appData.featuredProducts.filter(product => 
      product.categoryId === filter
    );
  }
  
  const productsHTML = filteredProducts.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        ${product.image}
        <div class="product-badges">
          ${product.badges.map(badge => `
            <span class="badge-persian ${badge.toLowerCase().replace(' ', '-')}">${badge}</span>
          `).join('')}
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        
        <div class="product-rating">
          <span class="stars">${generateStars(product.rating)}</span>
          <span class="rating-text">${product.rating} (${product.reviewCount} reviews)</span>
        </div>
        
        ${product.characters ? `
          <div class="product-characters">
            ${product.characters.map(char => `
              <span class="character-tag">${char}</span>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="product-footer">
          <div class="product-price">
            <span class="current-price">$${product.price}</span>
            ${product.originalPrice ? `
              <span class="original-price">$${product.originalPrice}</span>
            ` : ''}
          </div>
          <div class="product-actions">
            <button class="action-btn wishlist-action" onclick="toggleWishlist(${product.id})">
              ${wishlistItems.includes(product.id) ? '💖' : '🤍'}
            </button>
            <button class="action-btn cart-action" onclick="addToCart(${product.id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  productsGrid.innerHTML = productsHTML;
}

// Generate star rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '⭐';
  }
  
  if (hasHalfStar) {
    stars += '✨';
  }
  
  return stars;
}

// Initialize event listeners
function initializeEventListeners() {
  // Filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.dataset.filter;
      setActiveFilter(filter);
      renderProducts(filter);
    });
  });
  
  // Category cards - filter products when clicked
  document.addEventListener('click', function(e) {
    const categoryCard = e.target.closest('.category-card');
    if (categoryCard) {
      const categoryId = categoryCard.dataset.category;
      setActiveFilter(categoryId);
      renderProducts(categoryId);
      
      // Scroll to products section
      document.querySelector('.products').scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  });
  
  // Product cards - open modal when clicked
  document.addEventListener('click', function(e) {
    const productCard = e.target.closest('.product-card');
    if (productCard && !e.target.closest('.product-actions')) {
      const productId = parseInt(productCard.dataset.productId);
      openProductModal(productId);
    }
  });
  
  // Modal close
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Search functionality
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');
  
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch(this.value);
    }
  });
  
  searchBtn.addEventListener('click', function() {
    performSearch(searchInput.value);
  });
  
  // Escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// Set active filter button
function setActiveFilter(filter) {
  filterButtons.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  currentFilter = filter;
}

// Search functionality
function performSearch(query) {
  if (!query.trim()) {
    renderProducts(currentFilter);
    return;
  }
  
  const searchResults = appData.featuredProducts.filter(product => 
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    (product.characters && product.characters.some(char => 
      char.toLowerCase().includes(query.toLowerCase())
    ))
  );
  
  const searchHTML = searchResults.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        ${product.image}
        <div class="product-badges">
          ${product.badges.map(badge => `
            <span class="badge-persian ${badge.toLowerCase().replace(' ', '-')}">${badge}</span>
          `).join('')}
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        
        <div class="product-rating">
          <span class="stars">${generateStars(product.rating)}</span>
          <span class="rating-text">${product.rating} (${product.reviewCount} reviews)</span>
        </div>
        
        ${product.characters ? `
          <div class="product-characters">
            ${product.characters.map(char => `
              <span class="character-tag">${char}</span>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="product-footer">
          <div class="product-price">
            <span class="current-price">$${product.price}</span>
            ${product.originalPrice ? `
              <span class="original-price">$${product.originalPrice}</span>
            ` : ''}
          </div>
          <div class="product-actions">
            <button class="action-btn wishlist-action" onclick="toggleWishlist(${product.id})">
              ${wishlistItems.includes(product.id) ? '💖' : '🤍'}
            </button>
            <button class="action-btn cart-action" onclick="addToCart(${product.id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  productsGrid.innerHTML = searchHTML;
  
  // Update section title to show search results
  const sectionTitle = document.querySelector('.products .section-title');
  sectionTitle.textContent = `Search Results for "${query}" (${searchResults.length} found)`;
}

// Product modal
function openProductModal(productId) {
  const product = appData.featuredProducts.find(p => p.id === productId);
  if (!product) return;
  
  const modalContent = `
    <div class="product-modal-content">
      <div class="modal-product-image">
        ${product.image}
        <div class="product-badges">
          ${product.badges.map(badge => `
            <span class="badge-persian ${badge.toLowerCase().replace(' ', '-')}">${badge}</span>
          `).join('')}
        </div>
      </div>
      
      <div class="modal-product-info">
        <h2 class="modal-product-title">${product.title}</h2>
        <div class="modal-product-category">${product.category}</div>
        
        <div class="product-rating">
          <span class="stars">${generateStars(product.rating)}</span>
          <span class="rating-text">${product.rating} (${product.reviewCount} reviews)</span>
        </div>
        
        <p class="modal-product-description">${product.description}</p>
        
        ${product.characters ? `
          <div class="product-characters">
            <strong>Characters:</strong>
            ${product.characters.map(char => `
              <span class="character-tag">${char}</span>
            `).join('')}
          </div>
        ` : ''}
        
        ${product.duration ? `
          <div class="product-detail">
            <strong>Duration:</strong> ${product.duration}
          </div>
        ` : ''}
        
        ${product.format ? `
          <div class="product-detail">
            <strong>Format:</strong> ${product.format}
          </div>
        ` : ''}
        
        ${product.sizes ? `
          <div class="product-detail">
            <strong>Sizes:</strong> ${product.sizes.join(', ')}
          </div>
        ` : ''}
        
        <div class="modal-product-footer">
          <div class="product-price">
            <span class="current-price">$${product.price}</span>
            ${product.originalPrice ? `
              <span class="original-price">$${product.originalPrice}</span>
            ` : ''}
          </div>
          <div class="product-actions">
            <button class="action-btn wishlist-action" onclick="toggleWishlist(${product.id})">
              ${wishlistItems.includes(product.id) ? '💖 Remove from Wishlist' : '🤍 Add to Wishlist'}
            </button>
            <button class="action-btn cart-action" onclick="addToCart(${product.id})">
              🛍️ Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  modalBody.innerHTML = modalContent;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Wishlist functionality
function toggleWishlist(productId) {
  const index = wishlistItems.indexOf(productId);
  
  if (index > -1) {
    wishlistItems.splice(index, 1);
    showNotification('💔 Removed from wishlist', 'info');
  } else {
    wishlistItems.push(productId);
    showNotification('💖 Added to wishlist!', 'success');
  }
  
  updateCartBadges();
  // Re-render current view to update heart icons
  if (currentFilter === 'all') {
    renderProducts();
  } else {
    renderProducts(currentFilter);
  }
}

// Cart functionality
function addToCart(productId) {
  cartItems.push(productId);
  updateCartBadges();
  showNotification('🛍️ Added to cart!', 'success');
  
  // Add some Sacred Fire Points
  updateSacredFirePoints(10);
}

function updateCartBadges() {
  wishlistBtn.textContent = wishlistItems.length;
  cartBtn.textContent = cartItems.length;
}

// Sacred Fire Points
function updateSacredFirePoints(points) {
  const currentPoints = parseInt(document.querySelector('.points-count').textContent);
  const newPoints = currentPoints + points;
  
  document.querySelector('.points-count').textContent = newPoints;
  
  if (points > 0) {
    showNotification(`🔥 +${points} Sacred Fire Points earned!`, 'success');
  }
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(15, 23, 42, 0.95);
    color: var(--color-text);
    padding: 16px 24px;
    border-radius: 8px;
    border: 1px solid var(--persian-gold);
    box-shadow: var(--glow-gold);
    z-index: 3000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Slide in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Fire orbs animation
function animateFireOrbs() {
  const orbs = document.querySelectorAll('.fire-orb');
  
  orbs.forEach((orb, index) => {
    // Random movement animation
    setInterval(() => {
      const newX = Math.random() * window.innerWidth;
      const newY = Math.random() * window.innerHeight;
      
      orb.style.transition = `all ${4 + Math.random() * 4}s ease-in-out`;
      orb.style.left = `${newX}px`;
      orb.style.top = `${newY}px`;
    }, (index + 1) * 5000);
  });
}

// Smooth scrolling for internal links
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Add some Persian cultural touches
function addPersianTouches() {
  // Add subtle Persian patterns to category cards on hover
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // Add a subtle Persian pattern overlay effect
      this.style.backgroundImage = `
        radial-gradient(circle at 25% 25%, rgba(217, 119, 6, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(217, 119, 6, 0.05) 0%, transparent 50%)
      `;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.backgroundImage = '';
    });
  });
}

// Initialize Persian touches after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(addPersianTouches, 1000);
});

// Add magical particle effects on certain interactions
function createMagicalParticles(x, y) {
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 4px;
      height: 4px;
      background: var(--gradient-fire);
      border-radius: 50%;
      pointer-events: none;
      z-index: 2000;
      animation: sparkle 1s ease-out forwards;
    `;
    
    // Random direction for each particle
    const angle = (i * 60) * Math.PI / 180;
    const distance = 30 + Math.random() * 20;
    particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      document.body.removeChild(particle);
    }, 1000);
  }
}

// Add sparkle animation keyframes
const sparkleCSS = `
  @keyframes sparkle {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--dx), var(--dy)) scale(0);
      opacity: 0;
    }
  }
`;

const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);

// Add particle effects to certain clicks
document.addEventListener('click', function(e) {
  const button = e.target.closest('.cart-action, .wishlist-action');
  if (button) {
    createMagicalParticles(e.clientX, e.clientY);
  }
});