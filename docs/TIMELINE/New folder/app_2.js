// Zoroasterverse Mythic Timeline Application
class ZoroasterverseApp {
    constructor() {
        this.data = {
            "ages": [
                {
                    "id": 1,
                    "title": "FIRST AGE",
                    "glyph": "☀",
                    "color": "#D4AF37",
                    "tagline": "Dawn of Creation",
                    "description": "The dawn of existence, creation of the universe",
                    "events": [
                        {
                            "id": "age1_event1",
                            "title": "Creation of the Universe",
                            "description": "Zurvan manifests the cosmic order from primordial void",
                            "lore": "In the beginning was Zurvan, the god of infinite time and space. From the endless void, he spoke the first word of creation, and light burst forth to illuminate the darkness.",
                            "relatedBooks": ["Book I: Foundation"],
                            "relatedArcs": ["Dawn of Creation"],
                            "glyph": "✨"
                        },
                        {
                            "id": "age1_event2", 
                            "title": "The First Human",
                            "description": "Emergence of the first mortal beings",
                            "lore": "As the cosmic fires settled into their eternal dance, Zurvan shaped the first humans from the sacred clay of creation. These beings were granted both consciousness and choice.",
                            "relatedBooks": ["Book I: Foundation"],
                            "relatedArcs": ["First Covenant"],
                            "glyph": "🧍"
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "SECOND AGE",
                    "glyph": "🪽",
                    "color": "#D4AF37",
                    "tagline": "Divine Authority",
                    "description": "The age of infinite time and cosmic authority",
                    "events": [
                        {
                            "id": "age2_event1",
                            "title": "Zurvan's Covenant",
                            "description": "The winged deity establishes cosmic law",
                            "lore": "Zurvan, with wings spanning eternity, descended to establish the eternal covenant. His divine decree set boundaries between order and chaos.",
                            "relatedBooks": ["Book I: Foundation", "Book II: Chronicles"],
                            "relatedArcs": ["Eternal Covenant"],
                            "glyph": "🪽"
                        }
                    ]
                },
                {
                    "id": 3,
                    "title": "THIRD AGE",
                    "glyph": "🧍",
                    "color": "#D4AF37", 
                    "tagline": "Mortal Awakening",
                    "description": "The emergence of mortals and civilization",
                    "events": [
                        {
                            "id": "age3_event1",
                            "title": "The Great Migration",
                            "description": "Humanity spreads across the cosmic realms",
                            "lore": "The descendants of the first humans began their great migration across the seven cosmic realms, establishing the first settlements.",
                            "relatedBooks": ["Book II: Chronicles"],
                            "relatedArcs": ["Seven Realms"],
                            "glyph": "🏛"
                        }
                    ]
                },
                {
                    "id": 4,
                    "title": "FOURTH AGE",
                    "glyph": "🔥",
                    "color": "#D4AF37",
                    "tagline": "Sacred Flames", 
                    "description": "Age of civilization, ritual, and continuity",
                    "events": [
                        {
                            "id": "age4_event1",
                            "title": "The Sacred Fires",
                            "description": "Establishment of the eternal flame temples",
                            "lore": "Sacred fires were kindled in great temples across all realms. These eternal flames became guardians of cosmic memory.",
                            "relatedBooks": ["Book II: Chronicles", "Book III: Transformation"],
                            "relatedArcs": ["Temple Foundations"],
                            "glyph": "🔥"
                        }
                    ]
                },
                {
                    "id": 5,
                    "title": "FIFTH AGE",
                    "glyph": "🐍",
                    "color": "#D4AF37",
                    "tagline": "Hidden Paths",
                    "description": "Age of divergence, chaos, and hidden knowledge",
                    "events": [
                        {
                            "id": "age5_event1",
                            "title": "The Serpent's Whisper",
                            "description": "Ancient chaos stirs and hidden truths emerge",
                            "lore": "The great serpent stirred from cosmic slumber, whispering forgotten truths to those who would listen.",
                            "relatedBooks": ["Book III: Transformation"],
                            "relatedArcs": ["Serpent Rising"],
                            "glyph": "🐍"
                        }
                    ]
                },
                {
                    "id": 6,
                    "title": "SIXTH AGE",
                    "glyph": "🌅",
                    "color": "#D4AF37",
                    "tagline": "Cosmic Dawn",
                    "description": "Age of renewal and cosmic cycles",
                    "events": [
                        {
                            "id": "age6_event1",
                            "title": "The Dawn Renewal",
                            "description": "Cosmic cycles begin anew with hope restored",
                            "lore": "As darkness overshadowed the realms, cosmic dawn brought renewal. Ancient cycles turned once more.",
                            "relatedBooks": ["Book III: Transformation", "Book IV: Shadow"],
                            "relatedArcs": ["Renewal Cycle"],
                            "glyph": "🌅"
                        }
                    ]
                },
                {
                    "id": 7,
                    "title": "SEVENTH AGE",
                    "glyph": "🔥",
                    "color": "#D4AF37",
                    "tagline": "Twin Flame",
                    "description": "Age of prophecy, saviour, and sacrifice",
                    "events": [
                        {
                            "id": "age7_event1",
                            "title": "The Twin Flame Prophecy",
                            "description": "The foretold saviour emerges",
                            "lore": "In the darkest hour, the ancient prophecy of the Twin Flame was fulfilled. The chosen saviour emerged.",
                            "relatedBooks": ["Book IV: Shadow"],
                            "relatedArcs": ["Prophecy Fulfilled"],
                            "glyph": "🔥"
                        }
                    ]
                },
                {
                    "id": 8,
                    "title": "EIGHTH AGE",
                    "glyph": "✨",
                    "color": "#D4AF37",
                    "tagline": "Stellar Alignment",
                    "description": "Age of fate and cosmic alignment",
                    "events": [
                        {
                            "id": "age8_event1",
                            "title": "The Great Convergence",
                            "description": "All cosmic forces align",
                            "lore": "The stars aligned in the pattern foretold since the First Age. All cosmic forces converged toward destiny.",
                            "relatedBooks": ["Book IV: Shadow", "Book V: Legacy"],
                            "relatedArcs": ["Final Convergence"],
                            "glyph": "✨"
                        }
                    ]
                },
                {
                    "id": 9,
                    "title": "NINTH AGE",
                    "glyph": "⛩",
                    "color": "#D4AF37", 
                    "tagline": "Eternal Return",
                    "description": "Age of threshold, endings, and rebirth",
                    "events": [
                        {
                            "id": "age9_event1",
                            "title": "The Final Threshold",
                            "description": "The end becomes beginning",
                            "lore": "At the threshold between ending and beginning, the final gateway opens. This is transformation.",
                            "relatedBooks": ["Book V: Legacy"],
                            "relatedArcs": ["Cosmic Threshold"],
                            "glyph": "⛩"
                        }
                    ]
                }
            ]
        };

        this.currentAge = null;
        this.selectedNode = null;
        this.theme = 'dark';
        this.tooltipTimeout = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateCosmicDial();
        console.log('ZoroasterverseApp initialized');
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Back button
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.returnToOverview();
            });
        }

        // Modal controls
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideModal();
            });
        }

        const modalBackdrop = document.getElementById('modalBackdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Footer actions
        const libraryButton = document.getElementById('libraryButton');
        if (libraryButton) {
            libraryButton.addEventListener('click', () => {
                this.handleLibraryAction();
            });
        }

        const shopButton = document.getElementById('shopButton');
        if (shopButton) {
            shopButton.addEventListener('click', () => {
                this.handleShopAction();
            });
        }

        // Modal actions
        const modalLibraryBtn = document.getElementById('modalLibraryBtn');
        if (modalLibraryBtn) {
            modalLibraryBtn.addEventListener('click', () => {
                this.handleLibraryAction();
            });
        }

        const modalShopBtn = document.getElementById('modalShopBtn');
        if (modalShopBtn) {
            modalShopBtn.addEventListener('click', () => {
                this.handleShopAction();
            });
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });

        // Hide tooltip on scroll and click outside
        document.addEventListener('scroll', () => {
            this.hideTooltip();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.age-node') && !e.target.closest('.tooltip')) {
                this.hideTooltip();
            }
        });

        console.log('Event listeners setup complete');
    }

    generateCosmicDial() {
        const dialContainer = document.getElementById('cosmicDial');
        if (!dialContainer) {
            console.error('Cosmic dial container not found');
            return;
        }

        dialContainer.innerHTML = '';
        
        const dialSize = 500;
        const centerSize = 80;
        const ringCount = this.data.ages.length;
        const ringSpacing = (dialSize - centerSize) / (ringCount * 2);

        console.log('Generating cosmic dial with', ringCount, 'ages');

        // Create rings and position age nodes
        this.data.ages.forEach((age, index) => {
            // Create ring
            const ring = document.createElement('div');
            ring.className = 'cosmic-ring';
            ring.dataset.ageId = age.id;
            
            const ringRadius = centerSize / 2 + (index + 1) * ringSpacing;
            const ringDiameter = ringRadius * 2;
            
            ring.style.width = `${ringDiameter}px`;
            ring.style.height = `${ringDiameter}px`;
            
            // Create age node
            const node = document.createElement('div');
            node.className = 'age-node';
            node.innerHTML = age.glyph;
            node.dataset.ageId = age.id;
            node.title = ''; // Remove default tooltip
            
            // Position node on ring circumference
            // Distribute nodes around a 270-degree arc (from -45° to 225°)
            const startAngle = -45;
            const endAngle = 225;
            const angleSpan = endAngle - startAngle;
            const nodeAngle = startAngle + (index / (ringCount - 1)) * angleSpan;
            
            const x = Math.cos((nodeAngle - 90) * Math.PI / 180) * ringRadius;
            const y = Math.sin((nodeAngle - 90) * Math.PI / 180) * ringRadius;
            
            node.style.left = `calc(50% + ${x}px - 28px)`;
            node.style.top = `calc(50% + ${y}px - 28px)`;
            
            // Add event listeners
            this.setupNodeEvents(node, age);
            
            ring.appendChild(node);
            dialContainer.appendChild(ring);
        });

        console.log('Cosmic dial generation complete');
    }

    setupNodeEvents(node, age) {
        // Hover for tooltip
        node.addEventListener('mouseenter', (e) => {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(() => {
                this.showTooltip(e.target, `
                    <strong>${age.title}</strong><br>
                    <em>${age.tagline}</em><br>
                    <small>${age.events.length} event${age.events.length !== 1 ? 's' : ''}</small>
                `);
            }, 200);
        });

        node.addEventListener('mouseleave', () => {
            clearTimeout(this.tooltipTimeout);
            setTimeout(() => this.hideTooltip(), 100);
        });

        // Click to select age
        node.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideTooltip();
            this.selectAge(age, node);
            console.log('Age selected:', age.title);
        });
    }

    selectAge(age, node) {
        this.currentAge = age;
        
        // Update visual selection
        if (this.selectedNode) {
            this.selectedNode.classList.remove('selected');
        }
        
        node.classList.add('selected');
        this.selectedNode = node;
        
        // Highlight the ring
        const ring = document.querySelector(`.cosmic-ring[data-age-id="${age.id}"]`);
        document.querySelectorAll('.cosmic-ring').forEach(r => r.classList.remove('active'));
        if (ring) {
            ring.classList.add('active');
        }
        
        this.showTimelinePanel(age);
    }

    showTimelinePanel(age) {
        console.log('Showing timeline panel for:', age.title);
        
        // Hide welcome screen
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
        }
        
        // Show and populate timeline panel
        const timelinePanel = document.getElementById('timelinePanel');
        if (!timelinePanel) {
            console.error('Timeline panel not found');
            return;
        }
        
        timelinePanel.classList.remove('hidden');
        
        // Update age header
        const ageTitle = document.getElementById('ageTitle');
        const ageTagline = document.getElementById('ageTagline');
        
        if (ageTitle) {
            ageTitle.textContent = `${age.glyph} ${age.title}`;
        }
        if (ageTagline) {
            ageTagline.textContent = age.tagline;
        }
        
        // Generate event cards
        this.generateEventCards(age);
        
        // Animate panel in with a delay
        setTimeout(() => {
            timelinePanel.classList.add('visible');
            console.log('Timeline panel animated in');
        }, 50);
    }

    generateEventCards(age) {
        const timelineTrack = document.getElementById('timelineTrack');
        if (!timelineTrack) {
            console.error('Timeline track not found');
            return;
        }
        
        timelineTrack.innerHTML = '';
        
        console.log('Generating', age.events.length, 'event cards for', age.title);
        
        age.events.forEach((event) => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.dataset.eventId = event.id;
            
            // Create book tags
            const bookTags = event.relatedBooks.map(book => 
                `<span class="book-tag">${book}</span>`
            ).join('');
            
            eventCard.innerHTML = `
                <div class="event-glyph">${event.glyph}</div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-lore">${event.lore}</div>
                <div class="event-books">
                    <h5>Related Books</h5>
                    <div class="book-tags">${bookTags}</div>
                    <div class="event-actions">
                        <button class="btn btn--primary read-more-btn">Read More</button>
                        <button class="btn btn--secondary library-btn">
                            <span class="btn-icon">📚</span>
                            <span>Library</span>
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const readMoreBtn = eventCard.querySelector('.read-more-btn');
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showEventModal(event);
                });
            }
            
            const libraryBtn = eventCard.querySelector('.library-btn');
            if (libraryBtn) {
                libraryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleLibraryAction();
                });
            }
            
            eventCard.addEventListener('click', () => {
                this.showEventModal(event);
            });
            
            timelineTrack.appendChild(eventCard);
        });
        
        console.log('Event cards generated successfully');
    }

    showEventModal(event) {
        console.log('Showing modal for event:', event.title);
        
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalTitle || !modalBody) {
            console.error('Modal elements not found');
            return;
        }
        
        modalTitle.innerHTML = `${event.glyph} ${event.title}`;
        
        const bookTags = event.relatedBooks.map(book => 
            `<span class="book-tag">${book}</span>`
        ).join('');
        
        const arcTags = event.relatedArcs ? event.relatedArcs.map(arc => 
            `<span class="book-tag">⚡ ${arc}</span>`
        ).join('') : '';
        
        modalBody.innerHTML = `
            <div class="event-description" style="font-size: 1.125rem; margin-bottom: 1.5rem; color: var(--color-text-primary);">
                ${event.description}
            </div>
            <div style="background: var(--color-surface); padding: 1.5rem; border-left: 4px solid var(--color-gold); border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <p style="font-style: italic; font-size: 1rem; line-height: 1.7; color: var(--color-text-secondary); margin: 0;">
                    "${event.lore}"
                </p>
            </div>
            <div class="event-books">
                <h4 style="color: var(--color-gold); margin-bottom: 0.75rem; font-family: var(--font-display);">Related Books</h4>
                <div class="book-tags" style="margin-bottom: 1rem;">
                    ${bookTags}
                </div>
                ${event.relatedArcs ? `
                    <h4 style="color: var(--color-gold); margin-bottom: 0.75rem; font-family: var(--font-display);">Related Arcs</h4>
                    <div class="book-tags">
                        ${arcTags}
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.remove('hidden');
        console.log('Modal displayed');
    }

    hideModal() {
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    returnToOverview() {
        console.log('Returning to overview');
        
        // Reset state
        this.currentAge = null;
        
        if (this.selectedNode) {
            this.selectedNode.classList.remove('selected');
            this.selectedNode = null;
        }
        
        // Reset ring highlights
        document.querySelectorAll('.cosmic-ring').forEach(r => r.classList.remove('active'));
        
        // Hide timeline panel
        const timelinePanel = document.getElementById('timelinePanel');
        if (timelinePanel) {
            timelinePanel.classList.remove('visible');
            setTimeout(() => {
                timelinePanel.classList.add('hidden');
            }, 500);
        }
        
        // Show welcome screen
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
        }
        
        this.hideModal();
    }

    toggleTheme() {
        if (this.theme === 'dark') {
            document.body.setAttribute('data-theme', 'light');
            this.theme = 'light';
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = '☀';
            }
        } else {
            document.body.removeAttribute('data-theme');
            this.theme = 'dark';
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = '☾';
            }
        }
        console.log('Theme switched to:', this.theme);
    }

    showTooltip(element, content) {
        const tooltip = document.getElementById('tooltip');
        const tooltipContent = document.getElementById('tooltipContent');
        
        if (!tooltip || !tooltipContent) {
            console.error('Tooltip elements not found');
            return;
        }
        
        tooltipContent.innerHTML = content;
        tooltip.classList.remove('hidden');
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Initial positioning
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';
        tooltip.classList.add('visible');
        
        // Get actual tooltip dimensions
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + scrollLeft + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top + scrollTop - tooltipRect.height - 15;
        
        // Keep tooltip on screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.top + scrollTop + rect.height + 15;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        
        console.log('Tooltip shown');
    }

    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
            setTimeout(() => {
                tooltip.classList.add('hidden');
            }, 200);
        }
    }

    handleLibraryAction() {
        alert('🔮 Opening the Cosmic Library...\n\nExplore detailed lore, character studies, and expanded universe content.');
    }

    handleShopAction() {
        alert('✨ Welcome to the Mythic Shop!\n\nDiscover books, artifacts, and treasures from the Zoroasterverse.');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ZoroasterverseApp...');
    new ZoroasterverseApp();
});