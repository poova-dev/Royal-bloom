/* ==========================================================================
   ROYAL BLOOMS DECOR - INTERACTION SCRIPT
   Styled under the creative direction of Kalpana Amar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. SCROLL-SENSITIVE NAVBAR GLASS EFFECT
       ---------------------------------------------------------------------- */
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init on load in case page is refreshed while scrolled

    /* ----------------------------------------------------------------------
       2. RESPONSIVE MOBILE DRAWER MENU
       ---------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu drawer when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ----------------------------------------------------------------------
       3. BACKGROUND VIDEO TESTIMONIAL CAROUSEL
       ---------------------------------------------------------------------- */
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentTestimonial = 0;
    const totalTestimonials = testimonialCards.length;
    let testimonialInterval;
    
    const showTestimonial = (index) => {
        // Remove active state from current
        testimonialCards.forEach(card => {
            card.classList.remove('active');
            card.style.display = 'none';
        });
        
        // Update index boundary
        currentTestimonial = (index + totalTestimonials) % totalTestimonials;
        
        // Render target card with fade transition
        const activeCard = testimonialCards[currentTestimonial];
        activeCard.style.display = 'block';
        
        // Trigger reflow to restart css animation
        void activeCard.offsetWidth; 
        activeCard.classList.add('active');
    };
    
    const nextTestimonial = () => {
        showTestimonial(currentTestimonial + 1);
    };
    
    const prevTestimonial = () => {
        showTestimonial(currentTestimonial - 1);
    };
    
    // Auto-scroll testimonials every 7 seconds
    const startAutoScroll = () => {
        testimonialInterval = setInterval(nextTestimonial, 7000);
    };
    
    const resetAutoScroll = () => {
        clearInterval(testimonialInterval);
        startAutoScroll();
    };
    
    if (prevBtn && nextBtn && totalTestimonials > 0) {
        prevBtn.addEventListener('click', () => {
            prevTestimonial();
            resetAutoScroll();
        });
        
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            resetAutoScroll();
        });
        
        // Start auto cycle
        startAutoScroll();
    }

    /* ----------------------------------------------------------------------
       4. INTERACTIVE BEFORE/AFTER STAGE TRANSFORMATION SLIDER
       ---------------------------------------------------------------------- */
    const afterImg = document.getElementById('after-img');
    const sliderHandle = document.getElementById('slider-handle');
    const sliderControl = document.getElementById('slider-control');
    
    if (afterImg && sliderHandle && sliderControl) {
        const updateSlider = (value) => {
            // Apply clip-path to show proportional width of the decorated after image
            afterImg.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
            // Slide the center divider handle
            sliderHandle.style.left = `${value}%`;
        };
        
        sliderControl.addEventListener('input', (e) => {
            updateSlider(e.target.value);
        });
        
        // Initialize position at 50%
        updateSlider(50);
    }

    /* ----------------------------------------------------------------------
       5. INTERSECTION OBSERVER FOR METRIC COUNT-UPS
       ---------------------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // Animation duration in milliseconds
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        
        // Handle standard small step increments vs large values
        const increment = target > 100 ? Math.ceil(target / 100) : 1;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 100 ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = current + '+';
            }
        }, Math.max(stepTime, 20));
    };
    
    // Observers trigger when statistics enter viewport
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Stop observing once triggered
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(num => {
        counterObserver.observe(num);
    });

    /* ----------------------------------------------------------------------
       6. LUXURY FORM INTERACTION & LEADS SUBMISSION (FIRESTORE SYNC)
       ---------------------------------------------------------------------- */
    const leadForm = document.getElementById('wedding-lead-form');
    
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract inputs
            const name = document.getElementById('client-name').value;
            const phone = document.getElementById('client-phone').value;
            const date = document.getElementById('event-date').value;
            const theme = document.getElementById('theme-pref').value;
            const details = document.getElementById('event-details') ? document.getElementById('event-details').value : '';

            // Firestore Sync (Save lead to Cloud database)
            if (window.firebaseDb && window.firebaseFirestore) {
                try {
                    const { collection, addDoc, serverTimestamp } = window.firebaseFirestore;
                    addDoc(collection(window.firebaseDb, 'leads'), {
                        clientName: name,
                        phone: phone,
                        eventDate: date,
                        preferredTheme: theme,
                        visionDetails: details,
                        createdTime: serverTimestamp()
                    }).then(() => {
                        console.log("🔥 Lead successfully recorded in Firestore!");
                    }).catch(err => console.warn("Firestore lead save notice:", err));
                } catch (e) {
                    console.warn("Firestore async save notice:", e);
                }
            }
            
            // Format WhatsApp prefilled message
            const waText = `Hi Royal Blooms! I just submitted an inquiry on your website.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Event Date:* ${encodeURIComponent(date)}%0A*Preferred Theme:* ${encodeURIComponent(theme)}`;
            const waUrl = `https://wa.me/918939601257?text=${waText}`;
            
            // Create elegant overlay glass notification
            const notification = document.createElement('div');
            notification.className = 'glass-card';
            notification.style.position = 'fixed';
            notification.style.top = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
            notification.style.zIndex = '1000';
            notification.style.textAlign = 'center';
            notification.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
            notification.style.maxWidth = '450px';
            notification.style.width = '90%';
            notification.style.animation = 'fadeInUp 0.6s ease forwards';
            
            notification.innerHTML = `
                <span style="font-size: 3rem; color: #D4AF37; display: block; margin-bottom: 1rem;">❦</span>
                <h3 style="font-size: 1.75rem; margin-bottom: 1rem; color: #FAF7F2;">Thank You, ${name}</h3>
                <p style="color: #D1C9BE; margin-bottom: 2rem; font-size: 0.95rem;">Your dream wedding decor consultation is registered in our database. Let's immediately connect on WhatsApp to refine details!</p>
                <a href="${waUrl}" target="_blank" class="btn btn-secondary" style="width: 100%; display: block; text-align: center;">Open WhatsApp Chat</a>
                <button id="close-notif-btn" style="background: none; border: none; color: #FAF7F2; margin-top: 1.25rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; opacity: 0.7;">Close Window</button>
            `;
            
            // Dark Backdrop
            const backdrop = document.createElement('div');
            backdrop.style.position = 'fixed';
            backdrop.style.top = '0';
            backdrop.style.left = '0';
            backdrop.style.width = '100%';
            backdrop.style.height = '100%';
            backdrop.style.backgroundColor = 'rgba(18, 18, 18, 0.85)';
            backdrop.style.zIndex = '999';
            backdrop.style.backdropFilter = 'blur(5px)';
            
            document.body.appendChild(backdrop);
            document.body.appendChild(notification);
            
            const closeBtn = document.getElementById('close-notif-btn');
            const closeNotification = () => {
                document.body.removeChild(notification);
                document.body.removeChild(backdrop);
                leadForm.reset();
            };
            
            closeBtn.addEventListener('click', closeNotification);
            backdrop.addEventListener('click', closeNotification);
        });
    }

    /* ----------------------------------------------------------------------
       7. SAFE HERO VIDEO FALLBACK ENGINE
       ---------------------------------------------------------------------- */
    const heroVideo = document.getElementById('hero-video');
    const driveSource = document.getElementById('drive-source');
    
    if (heroVideo && driveSource) {
        driveSource.addEventListener('error', () => {
            console.warn("Primary Google Drive video failed to stream. Activating premium fallback...");
            driveSource.remove(); // Remove the failed Google Drive source
            heroVideo.load();     // Trigger browser to load the fallback source
            heroVideo.play().catch(err => console.log("Autoplay blocked:", err));
        });
    }

    /* ==========================================================================
       8. DIGITAL CATALOGUE, BUDGET FILTERING & EXPIRED PROPOSAL ENGINE
       ========================================================================== */

    // Default Decor Catalogue Dataset
    const defaultCatalogItems = [
        {
            id: "cat-101",
            title: "Royal Velvet Palace Stage",
            category: "stage",
            budget: 500000,
            budgetLabel: "From ₹5,00,000",
            image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
            desc: "Majestic velvet royal stage backdrops with carved gold pillars and rich botanical flower arches.",
            width: "30 ft Stage Width × 16 ft Peak Height",
            props: "4 Custom Carved Royal Gold Pillars, Velvet Drapes, 6 Urli Floral Bowls, Antique Chairs",
            lights: "Warm Amber LED strip lights & 3 Hanging Crystal Chandeliers",
            palette: "Royal Red, Champagne Gold, Deep Burgundy"
        },
        {
            id: "cat-102",
            title: "Blush Pastel Floral Arc & Stage",
            category: "pastel",
            budget: 200000,
            budgetLabel: "From ₹2,50,000",
            image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=800",
            desc: "Fairytale peach, cream, and dusty pink premium roses with delicate pampas grass and velvet sofa.",
            width: "20 ft Stage Width × 12 ft Height",
            props: "3 Pastel Floral Arches, Pampas Grass installation, 2 Side Floral Urns, Velvet Sofa",
            lights: "Soft Rose Gold Warm Ambient Spotlights",
            palette: "Peach, Blush Pink, Cream, Sage Green"
        },
        {
            id: "cat-103",
            title: "Traditional Marigold & Brass Urli Backdrop",
            category: "stage",
            budget: 100000,
            budgetLabel: "From ₹1,00,000",
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
            desc: "Traditional golden marigold garlands, vintage brass urli bowls with floating petals & silk draping.",
            width: "20 ft Stage Width × 10 ft Height",
            props: "Fresh Yellow & Orange Marigold Strings, 4 Vintage Brass Urlis with Floating Diyas & Petals",
            lights: "Hanging Brass Diyas & Warm Rice Lights",
            palette: "Golden Yellow, Marigold Orange, Brass"
        },
        {
            id: "cat-104",
            title: "Whimsical Fairy Light Forest Canopy",
            category: "lighting",
            budget: 50000,
            budgetLabel: "From ₹95,000",
            image: "https://images.unsplash.com/photo-1546198632-9ef6368bef12?auto=format&fit=crop&q=80&w=1200",
            desc: "Lush eucalyptus foliage mesh, cascading white carnations, and glowing warm fairy light canopies.",
            width: "25 ft Pathway Canopy × 14 ft Height",
            props: "Eucalyptus & Carnation Foliage Mesh, Wooden Truss Structure, Hanging Edison Bulbs",
            lights: "1,000+ Warm Fairy Lights & Filament Bulbs",
            palette: "Emerald Green, Warm White, Rustic Wood"
        },
        {
            id: "cat-105",
            title: "Pastel Floral Corner & Dessert Tablescape",
            category: "tables",
            budget: 50000,
            budgetLabel: "From ₹50,000",
            image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800",
            desc: "Custom pastel linen, 3-tiered floral centerpieces, gold candlesticks, and crystal glassware.",
            width: "15 ft Table Array × 8 ft Height",
            props: "Custom Pastel Table Linen, 3 Tiered Floral Centerpieces, Gold Candlesticks, Crystal Glassware",
            lights: "Taper Candlelight & Dim Ambient Accents",
            palette: "Pastel Rose, Soft Lavender, Ivory"
        },
        {
            id: "cat-106",
            title: "Lotus Dome Mandap & Royal Entrance",
            category: "mandap",
            budget: 500000,
            budgetLabel: "From ₹4,50,000",
            image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
            desc: "Hand-carved Lotus pillar dome structure, fresh rose & jasmine canopy, with Havana seating chairs.",
            width: "24 ft Dome Diameter × 18 ft Peak Height",
            props: "Carved Lotus Pillar Structure, Fresh Rose & Jasmine Canopy, Royal Havana Seating Chairs",
            lights: "Focus Profile Spotlights & Perimeter Amber Washer Lights",
            palette: "Lotus Pink, Golden Ochre, Pure Jasmine White"
        },
        {
            id: "cat-107",
            title: "Vintage Geometric Light Arch Walkway",
            category: "lighting",
            budget: 100000,
            budgetLabel: "From ₹1,20,000",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
            desc: "Geometric metal arches, hanging neon monogram, and mirror acrylic walkway entrance layout.",
            width: "18 ft Arch Walkway × 12 ft Height",
            props: "Geometric Metal Frames, Hanging Neon Monogram, Mirror Acrylic Walkway",
            lights: "Programmable RGB LED strips & Warm Moving Lights",
            palette: "Champagne Gold, Crystal Clear, Warm White"
        },
        {
            id: "cat-108",
            title: "Minimalist Chic Pastel Panel Backdrop",
            category: "pastel",
            budget: 50000,
            budgetLabel: "From ₹50,000",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
            desc: "Curved pastel arch screens, dried palm leaves, and minimal flower pedestals for intimate events.",
            width: "16 ft Backdrop × 10 ft Height",
            props: "2 Curved Pastel Panel Screens, Dry Palm Leaves, 2 Minimalist Flower Pedestals",
            lights: "Backlit LED halo ring lighting",
            palette: "Sand Beige, Dusty Rose, Off-white"
        }
    ];

    // Load or initialize Catalog Data
    let catalogItems = JSON.parse(localStorage.getItem('royal_blooms_catalog')) || defaultCatalogItems;
    
    // Save to LocalStorage helper
    const saveCatalog = () => {
        localStorage.setItem('royal_blooms_catalog', JSON.stringify(catalogItems));
    };

    // Real-time Cloud Firestore Catalog Sync Listener
    const listenToFirestoreCatalog = () => {
        if (window.firebaseDb && window.firebaseFirestore) {
            try {
                const { collection, onSnapshot } = window.firebaseFirestore;
                onSnapshot(collection(window.firebaseDb, 'catalog'), (snapshot) => {
                    if (snapshot && snapshot.docs.length > 0) {
                        const cloudItems = [];
                        snapshot.forEach(docSnap => {
                            cloudItems.push(docSnap.data());
                        });
                        if (cloudItems.length > 0) {
                            catalogItems = cloudItems;
                            saveCatalog();
                            renderCatalogue();
                        }
                    }
                });
            } catch (e) {
                console.warn("Firestore catalog listener notice:", e);
            }
        }
    };
    setTimeout(listenToFirestoreCatalog, 1500);

    // State Variables & Filter States
    let selectedBudget = 'all';
    let selectedCategory = 'all';
    let searchQuery = '';
    let proposalSelectedIds = null; // List of IDs if limited proposal
    let isProposalModeActive = false;
    let activeProposalClientName = 'Valued Client';
    let activeProposalId = '';

    // Elements
    const catalogGrid = document.getElementById('catalogue-grid');
    const emptyState = document.getElementById('cat-empty-state');
    const searchInput = document.getElementById('cat-search-input');
    const budgetButtons = document.querySelectorAll('.budget-btn');
    const categoryTabs = document.querySelectorAll('.cat-tab');
    const resetFiltersBtn = document.getElementById('reset-cat-filters-btn');

    // Filter Logic
    const renderCatalogue = () => {
        if (!catalogGrid) return;

        catalogGrid.innerHTML = '';
        
        const filtered = catalogItems.filter(item => {
            // Proposal ID filter (if active proposal link has picked items)
            if (proposalSelectedIds && proposalSelectedIds.length > 0) {
                if (!proposalSelectedIds.includes(item.id)) return false;
            }

            // Budget filter
            if (selectedBudget !== 'all') {
                const targetBudget = parseInt(selectedBudget, 10);
                if (targetBudget === 50000 && item.budget > 99000) return false;
                if (targetBudget === 100000 && (item.budget < 100000 || item.budget > 199000)) return false;
                if (targetBudget === 200000 && (item.budget < 200000 || item.budget > 499000)) return false;
                if (targetBudget === 500000 && item.budget < 500000) return false;
            }

            // Category filter
            if (selectedCategory !== 'all' && item.category !== selectedCategory) {
                return false;
            }

            // Search Query filter
            if (searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase();
                const matchTitle = item.title.toLowerCase().includes(q);
                const matchDesc = item.desc.toLowerCase().includes(q);
                const matchProps = item.props.toLowerCase().includes(q);
                const matchWidth = item.width.toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchProps && !matchWidth) return false;
            }

            return true;
        });

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');

            if (isProposalModeActive) {
                // Proposal Client Mode Empty State (Redirects to Consultation / WhatsApp, preserving scope)
                const waMsg = `Hi Royal Blooms! I am viewing my proposal (${activeProposalId}) for ${activeProposalClientName} and would like to request additional custom decor options.`;
                const waUrl = `https://wa.me/918939601257?text=${encodeURIComponent(waMsg)}`;

                emptyState.innerHTML = `
                    <div style="padding: 1rem; text-align: center;">
                        <span class="empty-icon">
                            <svg class="svg-icon-lg" viewBox="0 0 24 24" style="color: var(--accent-gold);"><path fill="currentColor" d="M12 2C9.24 2 7 4.24 7 7c0 1.34.53 2.56 1.39 3.46C7.54 11.23 7 12.55 7 14c0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.45-.54-2.77-1.39-3.54C16.47 9.56 17 8.34 17 7c0-2.76-2.24-5-5-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                        </span>
                        <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-dark);">No Matching Designs in Your Proposal</h3>
                        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 550px; margin: 0 auto 1.5rem;">No catalog items in your curated proposal match this filter. Would you like to request additional custom designs or a revised quote from lead designer Kalpana Amar?</p>
                        <div class="empty-proposal-actions">
                            <button class="btn btn-primary" id="proposal-inquire-form-trigger">
                                <svg class="svg-icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                                Inquire / Request Custom Quote
                            </button>
                            <a href="${waUrl}" target="_blank" class="btn btn-secondary">
                                <svg class="svg-icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24z"/></svg>
                                Ask Decorator on WhatsApp
                            </a>
                        </div>
                    </div>
                `;

                // Handle Inquiry Form Trigger
                const leadTriggerBtn = document.getElementById('proposal-inquire-form-trigger');
                if (leadTriggerBtn) {
                    leadTriggerBtn.addEventListener('click', () => {
                        const contactElem = document.getElementById('contact');
                        const nameInput = document.getElementById('client-name');
                        const detailsInput = document.getElementById('event-details');

                        if (nameInput && !nameInput.value) {
                            nameInput.value = activeProposalClientName !== 'Valued Client' ? activeProposalClientName : '';
                        }
                        if (detailsInput && !detailsInput.value.includes('Proposal Reference')) {
                            detailsInput.value = `[Proposal Reference: ${activeProposalId}] Requesting custom decor options / budget quote.`;
                        }

                        if (contactElem) {
                            contactElem.scrollIntoView({ behavior: 'smooth' });
                            if (detailsInput) setTimeout(() => detailsInput.focus(), 800);
                        }
                    });
                }
            } else {
                // Public Visitor Mode Empty State
                emptyState.innerHTML = `
                    <span class="empty-icon">
                        <svg class="svg-icon-lg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    </span>
                    <h3>No Decor Designs Found</h3>
                    <p>No catalog items match your selected budget tier or search criteria. Try selecting "All Budgets" or contact our design team for custom bespoke creations.</p>
                    <button class="btn btn-secondary" id="reset-cat-filters-btn">Reset All Filters</button>
                `;

                const publicResetBtn = document.getElementById('reset-cat-filters-btn');
                if (publicResetBtn) {
                    publicResetBtn.addEventListener('click', () => {
                        searchQuery = '';
                        selectedCategory = 'all';
                        selectedBudget = 'all';
                        if (searchInput) searchInput.value = '';
                        budgetButtons.forEach(b => b.classList.remove('active'));
                        if (budgetButtons[0]) budgetButtons[0].classList.add('active');
                        categoryTabs.forEach(t => t.classList.remove('active'));
                        if (categoryTabs[0]) categoryTabs[0].classList.add('active');
                        renderCatalogue();
                    });
                }
            }
        } else {
            emptyState.classList.add('hidden');

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'cat-card';
                
                // WhatsApp prefilled message per design
                const waMsg = `Hi Royal Blooms! I am interested in your design: *${encodeURIComponent(item.title)}* (${item.budgetLabel}). Dimensions: ${encodeURIComponent(item.width)}. Could you please share slot availability and details?`;
                const waUrl = `https://wa.me/918939601257?text=${waMsg}`;

                // SVG Icons for Spec Grid
                const rIcon = `<svg class="svg-icon-xs" viewBox="0 0 24 24"><path fill="currentColor" d="M2 4v16h20V4H2zm18 14H4V6h2v4h2V6h2v2h2V6h2v4h2V6h2v12z"/></svg>`;
                const fIcon = `<svg class="svg-icon-xs" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C9.24 2 7 4.24 7 7c0 1.34.53 2.56 1.39 3.46C7.54 11.23 7 12.55 7 14c0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.45-.54-2.77-1.39-3.54C16.47 9.56 17 8.34 17 7c0-2.76-2.24-5-5-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`;
                const lIcon = `<svg class="svg-icon-xs" viewBox="0 0 24 24"><path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>`;

                card.innerHTML = `
                    <div class="cat-card-img-wrapper">
                        <div class="cat-badge-box">
                            <span class="cat-badge">${item.category.toUpperCase()}</span>
                            <span class="cat-budget-tag">${item.budgetLabel}</span>
                        </div>
                        <img src="${item.image}" alt="${item.title}" class="cat-card-img" loading="lazy">
                    </div>
                    <div class="cat-card-body">
                        <h3 class="cat-card-title">${item.title}</h3>
                        <p class="cat-card-desc">${item.desc}</p>
                        
                        <div class="cat-spec-grid">
                            <div class="spec-row">
                                <span class="spec-icon">${rIcon}</span>
                                <span class="spec-text"><strong>Dimensions:</strong> ${item.width}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-icon">${fIcon}</span>
                                <span class="spec-text"><strong>Props Included:</strong> ${item.props}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-icon">${lIcon}</span>
                                <span class="spec-text"><strong>Lighting Spec:</strong> ${item.lights}</span>
                            </div>
                        </div>

                        <div class="cat-card-actions">
                            <button class="btn btn-secondary btn-sm quick-spec-btn" data-id="${item.id}">Quick Specs</button>
                            <a href="${waUrl}" target="_blank" class="btn btn-primary btn-sm" style="text-align: center;">Inquire WhatsApp</a>
                        </div>
                    </div>
                `;
                catalogGrid.appendChild(card);
            });

            // Attach event listeners for Quick Spec buttons
            document.querySelectorAll('.quick-spec-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = e.target.getAttribute('data-id');
                    openSpecModal(itemId);
                });
            });
        }
    };

    // Filter Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderCatalogue();
        });
    }

    budgetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            budgetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedBudget = btn.getAttribute('data-budget');
            renderCatalogue();
        });
    });

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            selectedCategory = tab.getAttribute('data-category');
            renderCatalogue();
        });
    });

    // Initialize Catalogue Render
    renderCatalogue();

    /* ----------------------------------------------------------------------
       9. CLIENT EXPIRED PROPOSAL LINK SECURITY ENGINE
       ---------------------------------------------------------------------- */
    const proposalBanner = document.getElementById('proposal-banner-container');
    const bannerClientName = document.getElementById('banner-client-name');
    const bannerTimer = document.getElementById('banner-countdown-timer');
    const bannerViews = document.getElementById('banner-view-counter');
    const expiredOverlay = document.getElementById('proposal-expired-overlay');
    const expiredReasonText = document.getElementById('expired-reason-text');
    const expiredBadgePill = document.getElementById('expired-badge-pill');
    const expiredViewCatBtn = document.getElementById('expired-view-catalogue-btn');

    let countdownInterval = null;

    const checkProposalUrlParams = () => {
        const hash = window.location.hash;
        if (!hash.includes('proposal?')) return;

        // Parse query string inside hash
        const queryString = hash.split('proposal?')[1];
        const params = new URLSearchParams(queryString);

        const propId = params.get('id');
        const clientName = params.get('client') ? decodeURIComponent(params.get('client')) : 'Valued Client';
        const expTime = parseInt(params.get('exp'), 10);
        const maxViews = parseInt(params.get('views'), 10) || 3;
        const budgetTier = params.get('budget');
        const itemsParam = params.get('items');

        if (!propId || !expTime) return;

        // Set proposal active mode
        isProposalModeActive = true;
        activeProposalClientName = clientName;
        activeProposalId = propId;

        // Track proposal views in LocalStorage
        const storageKey = `decor_proposal_views_${propId}`;
        let viewsUsed = parseInt(localStorage.getItem(storageKey), 10) || 0;

        // Increment view count on fresh load session
        if (!sessionStorage.getItem(`viewed_session_${propId}`)) {
            viewsUsed += 1;
            localStorage.setItem(storageKey, viewsUsed);
            sessionStorage.setItem(`viewed_session_${propId}`, 'true');
        }

        const now = Date.now();
        const isTimeExpired = now > expTime;
        const isViewsExpired = maxViews !== 999 && viewsUsed > maxViews;

        // Check if Link is Expired
        if (isTimeExpired || isViewsExpired) {
            // Show Expired Lock Overlay
            if (expiredOverlay) {
                expiredOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Lock scrolling

                if (isTimeExpired) {
                    expiredReasonText.innerHTML = `This bespoke wedding proposal link for <strong>${clientName}</strong> was active for a <strong>2-Day (48-Hour) window</strong> to ensure seasonal material pricing. The 48-hour access limit has now ended.`;
                    expiredBadgePill.textContent = `⏰ 48-Hour Time Limit Exceeded`;
                } else if (isViewsExpired) {
                    expiredReasonText.innerHTML = `This bespoke wedding proposal link for <strong>${clientName}</strong> was allocated a maximum of <strong>${maxViews} Views</strong>. You have reached your ${viewsUsed}th view attempt.`;
                    expiredBadgePill.textContent = `👁 ${maxViews}-View Security Limit Reached (${viewsUsed}/${maxViews})`;
                }
            }
            return; // Lock interface
        }

        // Proposal is VALID! Show Banner
        if (proposalBanner) {
            proposalBanner.classList.remove('hidden');
            if (bannerClientName) bannerClientName.textContent = `Prepared for ${clientName}`;
            if (bannerViews) bannerViews.textContent = `View ${viewsUsed} of ${maxViews === 999 ? '∞' : maxViews}`;

            // Live Countdown Timer
            const updateTimer = () => {
                const remainingMs = expTime - Date.now();
                if (remainingMs <= 0) {
                    clearInterval(countdownInterval);
                    checkProposalUrlParams(); // Re-trigger expiry check
                    return;
                }
                const hours = Math.floor(remainingMs / (1000 * 60 * 60));
                const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
                if (bannerTimer) bannerTimer.textContent = `Link Expiry: ${hours}h ${mins}m ${secs}s remaining`;
            };

            updateTimer();
            countdownInterval = setInterval(updateTimer, 1000);
        }

        // Apply Budget Filter if specified
        if (budgetTier && budgetTier !== 'all') {
            selectedBudget = budgetTier;
            budgetButtons.forEach(b => {
                b.classList.remove('active');
                if (b.getAttribute('data-budget') === budgetTier) b.classList.add('active');
            });
        }

        // Apply Specific Items Filter if picked by Admin
        if (itemsParam) {
            proposalSelectedIds = itemsParam.split(',');
        }

        renderCatalogue();

        // Scroll to Catalogue smoothly
        const catElem = document.getElementById('catalogue');
        if (catElem) {
            setTimeout(() => {
                catElem.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    };

    // Close Expired Overlay to view public catalogue
    if (expiredViewCatBtn) {
        expiredViewCatBtn.addEventListener('click', () => {
            if (expiredOverlay) expiredOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
            window.location.hash = '#catalogue';
        });
    }

    // Dismiss Proposal Banner
    const closeBannerBtn = document.getElementById('close-proposal-banner');
    if (closeBannerBtn && proposalBanner) {
        closeBannerBtn.addEventListener('click', () => {
            proposalBanner.classList.add('hidden');
        });
    }

    const viewPropItemsBtn = document.getElementById('view-proposal-items-btn');
    if (viewPropItemsBtn) {
        viewPropItemsBtn.addEventListener('click', () => {
            const catElem = document.getElementById('catalogue');
            if (catElem) catElem.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Check URL Hash on Load & HashChange
    checkProposalUrlParams();
    window.addEventListener('hashchange', checkProposalUrlParams);

    /* ----------------------------------------------------------------------
       10. ADMIN PROPOSAL GENERATOR & CATALOG MANAGER MODAL
       ---------------------------------------------------------------------- */
    const adminModal = document.getElementById('admin-modal');
    const openAdminBtn = document.getElementById('open-admin-btn');
    const closeAdminBtn = document.getElementById('close-admin-modal-btn');
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');

    const adminItemPicker = document.getElementById('admin-item-picker-list');
    const adminGenForm = document.getElementById('admin-gen-link-form');
    const adminLinkOutput = document.getElementById('admin-link-output');
    const generatedUrlInput = document.getElementById('generated-url-input');
    const copyUrlBtn = document.getElementById('copy-proposal-url-btn');
    const shareWaBtn = document.getElementById('share-wa-proposal-btn');

    const adminAddItemForm = document.getElementById('admin-add-item-form');
    const adminCatalogList = document.getElementById('admin-catalog-list');
    const adminCatCount = document.getElementById('admin-cat-count');

    // Populate Item Picker Checkboxes in Admin Modal
    const renderAdminItemPicker = () => {
        if (!adminItemPicker) return;
        adminItemPicker.innerHTML = '';
        catalogItems.forEach(item => {
            const row = document.createElement('label');
            row.className = 'picker-item-row';
            row.innerHTML = `
                <input type="checkbox" value="${item.id}">
                <span><strong>${item.title}</strong> (${item.budgetLabel} • ${item.width})</span>
            `;
            adminItemPicker.appendChild(row);
        });
    };

    // Render Admin Catalogue List
    const renderAdminCatalogList = () => {
        if (!adminCatalogList) return;
        adminCatalogList.innerHTML = '';
        if (adminCatCount) adminCatCount.textContent = catalogItems.length;

        catalogItems.forEach(item => {
            const row = document.createElement('div');
            row.className = 'admin-cat-item-row';
            row.innerHTML = `
                <div class="admin-cat-item-info">
                    <strong>${item.title}</strong>
                    <span>${item.budgetLabel} • ${item.category.toUpperCase()} • ${item.width}</span>
                </div>
                <button class="admin-cat-del-btn" data-id="${item.id}" title="Delete Item">&times;</button>
            `;
            adminCatalogList.appendChild(row);
        });

        // Delete Handler
        document.querySelectorAll('.admin-cat-del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                catalogItems = catalogItems.filter(i => i.id !== id);
                saveCatalog();
                renderCatalogue();
                renderAdminCatalogList();
                renderAdminItemPicker();
            });
        });
    };

    // ----------------------------------------------------------------------
    // ADMIN AUTHENTICATION & SECURITY SYSTEM (PIN PASSCODE: 1234)
    // ----------------------------------------------------------------------
    const adminAuthModal = document.getElementById('admin-auth-modal');
    const adminAuthForm = document.getElementById('admin-auth-form');
    const adminPinInput = document.getElementById('admin-pin-input');
    const adminPinError = document.getElementById('admin-pin-error');
    const closeAdminAuthBtn = document.getElementById('close-admin-auth-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');

    const DEFAULT_ADMIN_PIN = "1234";

    const isAdminAuthenticated = () => {
        return sessionStorage.getItem('admin_authenticated') === 'true';
    };

    // Open Admin Flow with Security PIN Check
    if (openAdminBtn) {
        openAdminBtn.addEventListener('click', () => {
            if (isAdminAuthenticated()) {
                if (adminModal) {
                    adminModal.classList.remove('hidden');
                    renderAdminItemPicker();
                    renderAdminCatalogList();
                }
            } else {
                if (adminAuthModal) {
                    adminAuthModal.classList.remove('hidden');
                    if (adminPinInput) {
                        adminPinInput.value = '';
                        adminPinInput.focus();
                    }
                    if (adminPinError) adminPinError.classList.add('hidden');
                }
            }
        });
    }

    if (closeAdminAuthBtn && adminAuthModal) {
        closeAdminAuthBtn.addEventListener('click', () => {
            adminAuthModal.classList.add('hidden');
        });
    }

    if (closeAdminBtn && adminModal) {
        closeAdminBtn.addEventListener('click', () => {
            adminModal.classList.add('hidden');
        });
    }

    // Admin Passcode Form Handler
    if (adminAuthForm) {
        adminAuthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredPin = adminPinInput.value.trim();

            if (enteredPin === DEFAULT_ADMIN_PIN) {
                sessionStorage.setItem('admin_authenticated', 'true');
                if (adminAuthModal) adminAuthModal.classList.add('hidden');
                if (adminModal) {
                    adminModal.classList.remove('hidden');
                    renderAdminItemPicker();
                    renderAdminCatalogList();
                }
            } else {
                if (adminPinError) adminPinError.classList.remove('hidden');
            }
        });
    }

    // Lock Admin Session
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('admin_authenticated');
            if (adminModal) adminModal.classList.add('hidden');
            alert("🔒 Admin session locked.");
        });
    }

    // Admin Tabs Switch
    adminTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            adminTabBtns.forEach(b => b.classList.remove('active'));
            adminTabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const content = document.getElementById(targetTab);
            if (content) content.classList.add('active');
        });
    });

    // Generate Proposal Link Form Handler
    if (adminGenForm) {
        adminGenForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const clientName = document.getElementById('admin-client-name').value.trim();
            const budgetTier = document.getElementById('admin-budget-tier').value;
            const expiryHours = parseInt(document.getElementById('admin-expiry-hours').value, 10);
            const maxViews = parseInt(document.getElementById('admin-max-views').value, 10);

            // Collect picked item IDs
            const pickedCheckboxes = adminItemPicker.querySelectorAll('input[type="checkbox"]:checked');
            const pickedIds = Array.from(pickedCheckboxes).map(cb => cb.value);

            // Calculate Expiry Timestamp
            const expTime = Date.now() + (expiryHours * 60 * 60 * 1000);
            const propId = 'prop-' + Math.floor(1000 + Math.random() * 9000);

            // Construct URL
            const baseUrl = window.location.origin + window.location.pathname;
            let hashQuery = `#proposal?id=${propId}&client=${encodeURIComponent(clientName)}&exp=${expTime}&views=${maxViews}`;
            if (budgetTier !== 'all') hashQuery += `&budget=${budgetTier}`;
            if (pickedIds.length > 0) hashQuery += `&items=${pickedIds.join(',')}`;

            const finalUrl = baseUrl + hashQuery;

            // Firestore Sync (Save proposal security record to Cloud database)
            if (window.firebaseDb && window.firebaseFirestore) {
                try {
                    const { doc, setDoc, serverTimestamp } = window.firebaseFirestore;
                    setDoc(doc(window.firebaseDb, 'proposals', propId), {
                        proposalId: propId,
                        clientName: clientName,
                        targetBudget: budgetTier,
                        expTime: expTime,
                        maxViews: maxViews,
                        viewsUsed: 0,
                        pickedItemIds: pickedIds,
                        shareableUrl: finalUrl,
                        createdTime: serverTimestamp()
                    }).then(() => {
                        console.log("🔥 Proposal record saved to Firestore proposals database!");
                    }).catch(err => console.warn("Firestore proposal save notice:", err));
                } catch (e) {
                    console.warn("Firestore async proposal save notice:", e);
                }
            }

            if (generatedUrlInput) generatedUrlInput.value = finalUrl;
            if (adminLinkOutput) adminLinkOutput.classList.remove('hidden');

            // Format WhatsApp Share Link
            const waShareText = `Hi ${clientName}! ✨ Here is your bespoke wedding decor digital proposal styled by Kalpana Amar (Royal Blooms Decor):%0A%0A${encodeURIComponent(finalUrl)}%0A%0A*Note:* This proposal link is active for 2 Days (48 Hours) / 3 Views to keep seasonal pricing active.`;
            if (shareWaBtn) shareWaBtn.href = `https://wa.me/?text=${waShareText}`;
        });
    }

    // Copy URL to Clipboard
    if (copyUrlBtn && generatedUrlInput) {
        copyUrlBtn.addEventListener('click', () => {
            generatedUrlInput.select();
            navigator.clipboard.writeText(generatedUrlInput.value);
            const origText = copyUrlBtn.textContent;
            copyUrlBtn.textContent = '✓ Copied!';
            setTimeout(() => copyUrlBtn.textContent = origText, 2000);
        });
    }

    // Add New Catalogue Item Form Handler
    if (adminAddItemForm) {
        adminAddItemForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('add-item-title').value.trim();
            const category = document.getElementById('add-item-category').value;
            const budget = parseInt(document.getElementById('add-item-budget').value, 10);
            const width = document.getElementById('add-item-width').value.trim();
            const image = document.getElementById('add-item-image').value.trim();
            const props = document.getElementById('add-item-props').value.trim();
            const lights = document.getElementById('add-item-lights').value.trim();

            const newItem = {
                id: 'cat-' + Date.now(),
                title: title,
                category: category,
                budget: budget,
                budgetLabel: `From ₹${budget.toLocaleString('en-IN')}`,
                image: image,
                desc: `${props}. Designed by Kalpana Amar for bespoke venues.`,
                width: width,
                props: props,
                lights: lights,
                palette: "Pastel & Gold Accents"
            };

            catalogItems.unshift(newItem);
            saveCatalog();
            renderCatalogue();
            renderAdminCatalogList();
            renderAdminItemPicker();
            adminAddItemForm.reset();
            alert("✨ New item successfully added to Digital Catalogue!");
        });
    }

    /* ----------------------------------------------------------------------
       11. QUICK SPECIFICATION MODAL HANDLER (SVG ICONS)
       ---------------------------------------------------------------------- */
    const specModal = document.getElementById('item-spec-modal');
    const specModalContent = document.getElementById('spec-modal-content');
    const closeSpecBtn = document.getElementById('close-spec-modal-btn');

    const openSpecModal = (itemId) => {
        const item = catalogItems.find(i => i.id === itemId);
        if (!item || !specModalContent || !specModal) return;

        const waMsg = `Hi Royal Blooms! I would like to book/inquire about the *${encodeURIComponent(item.title)}* (${item.budgetLabel}). Dimensions: ${encodeURIComponent(item.width)}.`;
        const waUrl = `https://wa.me/918939601257?text=${waMsg}`;

        const rIcon = `<svg class="svg-icon-xs" viewBox="0 0 24 24"><path fill="currentColor" d="M2 4v16h20V4H2zm18 14H4V6h2v4h2V6h2v2h2V6h2v4h2V6h2v12z"/></svg>`;
        const fIcon = `<svg class="svg-icon-xs" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C9.24 2 7 4.24 7 7c0 1.34.53 2.56 1.39 3.46C7.54 11.23 7 12.55 7 14c0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.45-.54-2.77-1.39-3.54C16.47 9.56 17 8.34 17 7c0-2.76-2.24-5-5-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`;
        const lIcon = `<svg class="svg-icon-xs" viewBox="0 0 24 24"><path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>`;
        const pIcon = `<svg class="svg-icon-xs" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61.43.54 1.07.89 1.76.89h1.77c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.24-.27-.39-.63-.39-1.02 0-.83.67-1.5 1.5-1.5H15c3.87 0 7-3.13 7-7 0-4.42-4.03-8-10-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5S7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;

        specModalContent.innerHTML = `
            <div>
                <img src="${item.image}" alt="${item.title}" class="spec-modal-img">
            </div>
            <div>
                <span class="modal-subtitle">${item.category.toUpperCase()} • ${item.budgetLabel}</span>
                <h3 class="modal-title">${item.title}</h3>
                <p class="modal-desc">${item.desc}</p>
                
                <div class="cat-spec-grid" style="margin-bottom: 2rem;">
                    <div class="spec-row">
                        <span class="spec-icon">${rIcon}</span>
                        <span class="spec-text"><strong>Stage Dimensions:</strong> ${item.width}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-icon">${fIcon}</span>
                        <span class="spec-text"><strong>Included Props:</strong> ${item.props}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-icon">${lIcon}</span>
                        <span class="spec-text"><strong>Lighting Setup:</strong> ${item.lights}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-icon">${pIcon}</span>
                        <span class="spec-text"><strong>Color Palette:</strong> ${item.palette}</span>
                    </div>
                </div>

                <a href="${waUrl}" target="_blank" class="btn btn-primary btn-block" style="text-align: center;">Inquire on WhatsApp Direct</a>
            </div>
        `;

        specModal.classList.remove('hidden');
    };

    if (closeSpecBtn && specModal) {
        closeSpecBtn.addEventListener('click', () => {
            specModal.classList.add('hidden');
        });
    }

    // Close modals when clicking overlay backdrop
    window.addEventListener('click', (e) => {
        if (e.target === adminAuthModal) adminAuthModal.classList.add('hidden');
        if (e.target === adminModal) adminModal.classList.add('hidden');
        if (e.target === specModal) specModal.classList.add('hidden');
    });
});

