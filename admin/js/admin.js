/* ==========================================================================
   ROYAL BLOOMS DECOR - ADMIN SUITE INTERACTION & ANALYTICS SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DEFAULT CATALOG DATA (Fallback)
    // ----------------------------------------------------------------------
    const defaultCatalogItems = [
        {
            id: "cat-1",
            title: "Grand Royal Palace Stage",
            category: "stage",
            budget: 350000,
            budgetLabel: "From ₹3,50,000",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
            desc: "30ft Wide Backdrop with 12ft Golden Carved Pillars, Velvet Drapes, and Crystal Chandeliers.",
            width: "30 ft Width × 14 ft Height",
            props: "Golden Urli Bowls, Royal Sofa, 6 Floral Arches",
            lights: "Warm LED Strips & Hanging Crystal Bulbs",
            palette: "Royal Red, Cream & Gold"
        },
        {
            id: "cat-2",
            title: "Blush Rose & Pastel Canopy",
            category: "pastel",
            budget: 180000,
            budgetLabel: "From ₹1,80,000",
            image: "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&q=80&w=800",
            desc: "Elegantly arranged imported Dutch hydrangeas, blush pink roses, and suspended wisteria.",
            width: "24 ft Width × 12 ft Height",
            props: "Pastel Bench, 4 Urli Vessels, Brass Lamps",
            lights: "Soft Golden Ambient Wash",
            palette: "Blush Pink, Peach & Warm Gold"
        },
        {
            id: "cat-3",
            title: "Traditional Temple Mandap",
            category: "mandap",
            budget: 250000,
            budgetLabel: "From ₹2,50,000",
            image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=800",
            desc: "Intricately carved South Indian mandap pillars adorned with fresh marigold strings and brass diyas.",
            width: "20 ft × 20 ft Mandap",
            props: "4 Brass Kuthu Vilakku, Brass Urlis, Banana Plants",
            lights: "Traditional Warm Brass Lantern Glow",
            palette: "Marigold Yellow, Kanjeevaram Red & Gold"
        },
        {
            id: "cat-4",
            title: "Minimalist Pastel Haldi Backdrop",
            category: "stage",
            budget: 65000,
            budgetLabel: "From ₹65,000",
            image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
            desc: "Vibrant yellow marigold backdrop wall with hanging cane baskets and brass seating urli.",
            width: "15 ft Width × 10 ft Height",
            props: "Big Brass Tub for Haldi, Cane Baskets, Cushions",
            lights: "Festive Ambient Warm Light",
            palette: "Sunflower Yellow, Orange & Natural Green"
        },
        {
            id: "cat-5",
            title: "Enchanted Fairy Light Tunnel Entrance",
            category: "lighting",
            budget: 120000,
            budgetLabel: "From ₹1,20,000",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
            desc: "50-foot walk-through tunnel canopy wrapped with thousands of warm fairy lights.",
            width: "50 ft Walkway Length",
            props: "Welcome Arch Signage Board, Carpet Pathway",
            lights: "10,000 Micro Warm White Fairy Lights",
            palette: "Golden Warm White & Champagne"
        },
        {
            id: "cat-6",
            title: "Glass Floral Centerpiece Tables",
            category: "tables",
            budget: 85000,
            budgetLabel: "From ₹85,000",
            image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
            desc: "VIP Guest table setup with tall crystal vase centerpieces, floating candles, and linen runners.",
            width: "10 VIP Banquet Tables",
            props: "Tall Crystal Candelabras, Custom Menu Cards",
            lights: "Tea Light Votives & Warm Candlelight",
            palette: "Ivory, Gold & Rose Gold"
        }
    ];

    let catalogItems = JSON.parse(localStorage.getItem('royal_blooms_catalog')) || defaultCatalogItems;

    const saveCatalogLocal = () => {
        localStorage.setItem('royal_blooms_catalog', JSON.stringify(catalogItems));
    };

    // ----------------------------------------------------------------------
    // 2. PASSCODE PIN AUTHENTICATION
    // ----------------------------------------------------------------------
    const authOverlay = document.getElementById('admin-auth-overlay');
    const authForm = document.getElementById('admin-auth-form');
    const pinInput = document.getElementById('admin-pin-input');
    const pinError = document.getElementById('admin-pin-error');
    const lockSessionBtn = document.getElementById('admin-lock-session-btn');
    const DEFAULT_PIN = "1234";

    const checkAuthStatus = () => {
        if (sessionStorage.getItem('admin_authenticated') === 'true') {
            if (authOverlay) authOverlay.classList.add('d-none');
        } else {
            if (authOverlay) {
                authOverlay.classList.remove('d-none');
                if (pinInput) {
                    pinInput.value = '';
                    pinInput.focus();
                }
            }
        }
    };

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const entered = pinInput.value.trim();
            if (entered === DEFAULT_PIN) {
                sessionStorage.setItem('admin_authenticated', 'true');
                authOverlay.classList.add('d-none');
                pinError.classList.add('d-none');
            } else {
                pinError.classList.remove('d-none');
            }
        });
    }

    if (lockSessionBtn) {
        lockSessionBtn.addEventListener('click', () => {
            sessionStorage.removeItem('admin_authenticated');
            checkAuthStatus();
        });
    }

    checkAuthStatus();

    // ----------------------------------------------------------------------
    // 3. NAVIGATION TAB SWITCHER
    // ----------------------------------------------------------------------
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const tabContents = document.querySelectorAll('.dashboard-tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('d-none'));

            link.classList.add('active');
            const targetId = link.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.remove('d-none');
        });
    });

    // ----------------------------------------------------------------------
    // 4. CATALOG CRUD OPERATIONS & CLOUD SYNC
    // ----------------------------------------------------------------------
    const catalogTbody = document.getElementById('admin-catalog-tbody');
    const catalogCountElem = document.getElementById('admin-catalog-count');
    const catalogSearchInput = document.getElementById('admin-catalog-search');
    const addItemForm = document.getElementById('add-catalog-item-form');
    const syncCloudBtn = document.getElementById('sync-cloud-catalog-btn');

    // Render Catalog Table (R in CRUD)
    const renderCatalogTable = (filter = '') => {
        if (!catalogTbody) return;
        catalogTbody.innerHTML = '';

        const filtered = catalogItems.filter(item => {
            if (!filter) return true;
            const q = filter.toLowerCase();
            return item.title.toLowerCase().includes(q) ||
                   item.category.toLowerCase().includes(q) ||
                   item.props.toLowerCase().includes(q);
        });

        if (catalogCountElem) catalogCountElem.textContent = filtered.length;

        filtered.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${item.image}" alt="${item.title}" class="cat-thumb-sm"></td>
                <td>
                    <strong class="text-white">${item.title}</strong><br>
                    <small class="text-muted">${item.props}</small>
                </td>
                <td><span class="badge bg-outline-gold text-gold uppercase">${item.category}</span></td>
                <td><strong class="text-gold">${item.budgetLabel}</strong></td>
                <td><small class="text-light">${item.width}</small></td>
                <td>
                    <button class="btn btn-sm btn-outline-warning me-1 edit-item-btn" data-id="${item.id}" title="Edit Item">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-item-btn" data-id="${item.id}" title="Delete Item">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            catalogTbody.appendChild(tr);
        });

        // Attach Event Listeners for Edit & Delete
        document.querySelectorAll('.edit-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                openEditModal(id);
            });
        });

        document.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                deleteCatalogItem(id);
            });
        });

        // Also update Item Picker in Proposal Generator
        renderAdminItemPicker();
    };

    // Add New Catalog Item (C in CRUD)
    if (addItemForm) {
        addItemForm.addEventListener('submit', (e) => {
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
            saveCatalogLocal();
            saveItemToFirestore(newItem);
            renderCatalogTable();
            addItemForm.reset();
            alert("✨ New Item added to Catalog and synced to Cloud!");
        });
    }

    // Edit Item Modal Handler (U in CRUD)
    const editModal = new bootstrap.Modal(document.getElementById('editItemModal'));
    const editForm = document.getElementById('edit-catalog-item-form');

    const openEditModal = (id) => {
        const item = catalogItems.find(i => i.id === id);
        if (!item) return;

        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-title').value = item.title;
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-budget').value = item.budget;
        document.getElementById('edit-item-width').value = item.width;
        document.getElementById('edit-item-image').value = item.image;
        document.getElementById('edit-item-props').value = item.props;
        document.getElementById('edit-item-lights').value = item.lights;

        editModal.show();
    };

    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-item-id').value;
            const index = catalogItems.findIndex(i => i.id === id);
            if (index === -1) return;

            const budget = parseInt(document.getElementById('edit-item-budget').value, 10);

            catalogItems[index].title = document.getElementById('edit-item-title').value.trim();
            catalogItems[index].category = document.getElementById('edit-item-category').value;
            catalogItems[index].budget = budget;
            catalogItems[index].budgetLabel = `From ₹${budget.toLocaleString('en-IN')}`;
            catalogItems[index].width = document.getElementById('edit-item-width').value.trim();
            catalogItems[index].image = document.getElementById('edit-item-image').value.trim();
            catalogItems[index].props = document.getElementById('edit-item-props').value.trim();
            catalogItems[index].lights = document.getElementById('edit-item-lights').value.trim();

            saveCatalogLocal();
            saveItemToFirestore(catalogItems[index]);
            renderCatalogTable();
            editModal.hide();
            alert("✓ Catalog item successfully updated & synced to Cloud!");
        });
    }

    // Delete Item Handler (D in CRUD)
    const deleteCatalogItem = (id) => {
        if (!confirm("Are you sure you want to delete this catalog design?")) return;

        catalogItems = catalogItems.filter(i => i.id !== id);
        saveCatalogLocal();
        deleteItemFromFirestore(id);
        renderCatalogTable();
    };

    // Save Item to Cloud Firestore
    const saveItemToFirestore = (item) => {
        if (window.firebaseDb && window.firebaseFirestore) {
            try {
                const { doc, setDoc } = window.firebaseFirestore;
                setDoc(doc(window.firebaseDb, 'catalog', item.id), item)
                    .then(() => console.log("🔥 Catalog item synced to Firestore:", item.id))
                    .catch(err => console.warn("Firestore sync notice:", err));
            } catch (e) {
                console.warn("Firestore async notice:", e);
            }
        }
    };

    // Delete Item from Cloud Firestore
    const deleteItemFromFirestore = (id) => {
        if (window.firebaseDb && window.firebaseFirestore) {
            try {
                const { doc, deleteDoc } = window.firebaseFirestore;
                deleteDoc(doc(window.firebaseDb, 'catalog', id))
                    .then(() => console.log("🔥 Catalog item deleted from Firestore:", id))
                    .catch(err => console.warn("Firestore delete notice:", err));
            } catch (e) {
                console.warn("Firestore async notice:", e);
            }
        }
    };

    // Sync All Catalog Items to Cloud Firestore Button
    if (syncCloudBtn) {
        syncCloudBtn.addEventListener('click', () => {
            if (window.firebaseDb && window.firebaseFirestore) {
                const { doc, setDoc } = window.firebaseFirestore;
                let count = 0;
                catalogItems.forEach(item => {
                    setDoc(doc(window.firebaseDb, 'catalog', item.id), item)
                        .then(() => {
                            count++;
                            if (count === catalogItems.length) {
                                alert(`☁️ All ${count} catalog designs successfully synced to Cloud Firestore database!`);
                            }
                        });
                });
            } else {
                alert("Cloud Database connecting... Try again in 2 seconds.");
            }
        });
    }

    if (catalogSearchInput) {
        catalogSearchInput.addEventListener('input', (e) => {
            renderCatalogTable(e.target.value);
        });
    }

    renderCatalogTable();

    // ----------------------------------------------------------------------
    // 5. EXPIRABLE PROPOSAL LINK GENERATOR ENGINE
    // ----------------------------------------------------------------------
    const itemPickerContainer = document.getElementById('admin-item-picker-container');
    const genProposalForm = document.getElementById('admin-gen-proposal-form');
    const outputBox = document.getElementById('proposal-output-box');
    const generatedUrlField = document.getElementById('generated-url-field');
    const copyUrlBtn = document.getElementById('copy-url-btn');
    const sendWaBtn = document.getElementById('send-wa-link-btn');

    function renderAdminItemPicker() {
        if (!itemPickerContainer) return;
        itemPickerContainer.innerHTML = '';
        catalogItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'form-check mb-2';
            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${item.id}" id="picker-${item.id}">
                <label class="form-check-label text-light" for="picker-${item.id}">
                    <strong>${item.title}</strong> (${item.budgetLabel} • ${item.width})
                </label>
            `;
            itemPickerContainer.appendChild(div);
        });
    }

    if (genProposalForm) {
        genProposalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const clientName = document.getElementById('admin-client-name').value.trim();
            const budgetTier = document.getElementById('admin-budget-tier').value;
            const expiryHours = parseInt(document.getElementById('admin-expiry-hours').value, 10);
            const maxViews = parseInt(document.getElementById('admin-max-views').value, 10);

            const pickedCheckboxes = itemPickerContainer.querySelectorAll('input[type="checkbox"]:checked');
            const pickedIds = Array.from(pickedCheckboxes).map(cb => cb.value);

            const expTime = Date.now() + (expiryHours * 60 * 60 * 1000);
            const propId = 'prop-' + Math.floor(1000 + Math.random() * 9000);

            const baseUrl = window.location.origin + window.location.pathname.replace('admin/index.html', '').replace('admin/', '') + 'index.html';
            let hashQuery = `#proposal?id=${propId}&client=${encodeURIComponent(clientName)}&exp=${expTime}&views=${maxViews}`;
            if (budgetTier !== 'all') hashQuery += `&budget=${budgetTier}`;
            if (pickedIds.length > 0) hashQuery += `&items=${pickedIds.join(',')}`;

            const finalUrl = baseUrl + hashQuery;

            // Save Proposal Record to Local & Firestore
            const newProposalRecord = {
                proposalId: propId,
                clientName: clientName,
                targetBudget: budgetTier,
                expTime: expTime,
                maxViews: maxViews,
                viewsUsed: 0,
                pickedItemIds: pickedIds,
                shareableUrl: finalUrl,
                createdTimestamp: Date.now()
            };

            let proposalsList = JSON.parse(localStorage.getItem('royal_blooms_proposals')) || [];
            proposalsList.unshift(newProposalRecord);
            localStorage.setItem('royal_blooms_proposals', JSON.stringify(proposalsList));

            if (window.firebaseDb && window.firebaseFirestore) {
                try {
                    const { doc, setDoc, serverTimestamp } = window.firebaseFirestore;
                    setDoc(doc(window.firebaseDb, 'proposals', propId), {
                        ...newProposalRecord,
                        createdTime: serverTimestamp()
                    });
                } catch (e) {
                    console.warn(e);
                }
            }

            if (generatedUrlField) generatedUrlField.value = finalUrl;
            if (outputBox) outputBox.classList.remove('d-none');

            const waText = `Hi ${clientName}! ✨ Here is your bespoke wedding decor digital proposal styled by Kalpana Amar (Royal Blooms Decor):%0A%0A${encodeURIComponent(finalUrl)}%0A%0A*Note:* This proposal link is active for 2 Days (48 Hours) / 3 Views to keep seasonal pricing active.`;
            if (sendWaBtn) sendWaBtn.href = `https://wa.me/?text=${waText}`;

            // Refresh Analytics
            updateAnalyticsDashboard();
        });
    }

    if (copyUrlBtn && generatedUrlField) {
        copyUrlBtn.addEventListener('click', () => {
            generatedUrlField.select();
            navigator.clipboard.writeText(generatedUrlField.value);
            const orig = copyUrlBtn.innerHTML;
            copyUrlBtn.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
            setTimeout(() => copyUrlBtn.innerHTML = orig, 2000);
        });
    }

    // ----------------------------------------------------------------------
    // 6. DATE RANGE FILTERING & CHART.JS ANALYTICS ENGINE
    // ----------------------------------------------------------------------
    let currentPresetDays = 30; // Default: 1 Month
    let proposalsChart = null;
    let budgetPieChart = null;

    const presetBtns = document.querySelectorAll('.preset-btn');
    const customDateInputs = document.getElementById('custom-date-inputs');
    const startDateInput = document.getElementById('analytics-start-date');
    const endDateInput = document.getElementById('analytics-end-date');
    const applyCustomBtn = document.getElementById('apply-custom-date-btn');
    const periodBadge = document.getElementById('chart-period-badge');

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const preset = btn.getAttribute('data-preset');
            if (preset === 'custom') {
                if (customDateInputs) customDateInputs.classList.remove('d-none');
                if (customDateInputs) customDateInputs.classList.add('d-flex');
            } else {
                if (customDateInputs) customDateInputs.classList.add('d-none');
                if (customDateInputs) customDateInputs.classList.remove('d-flex');
                currentPresetDays = parseInt(preset, 10);
                updateAnalyticsDashboard();
            }
        });
    });

    if (applyCustomBtn) {
        applyCustomBtn.addEventListener('click', () => {
            updateAnalyticsDashboard();
        });
    }

    const updateAnalyticsDashboard = () => {
        let proposalsList = JSON.parse(localStorage.getItem('royal_blooms_proposals')) || [];
        
        // Seed mock proposal analytics data if empty so analytics display rich charts immediately
        if (proposalsList.length === 0) {
            const now = Date.now();
            const day = 24 * 60 * 60 * 1000;
            proposalsList = [
                { proposalId: 'p-1', clientName: 'Sneha & Rohan', targetBudget: '100000', expTime: now + 24*day, maxViews: 3, viewsUsed: 1, createdTimestamp: now - 2*day },
                { proposalId: 'p-2', clientName: 'Karthik & Priya', targetBudget: '200000', expTime: now - day, maxViews: 3, viewsUsed: 3, createdTimestamp: now - 5*day },
                { proposalId: 'p-3', clientName: 'Ananya & Vikram', targetBudget: '500000', expTime: now + day, maxViews: 3, viewsUsed: 2, createdTimestamp: now - 8*day },
                { proposalId: 'p-4', clientName: 'Rahul & Meera', targetBudget: '50000', expTime: now + 3*day, maxViews: 3, viewsUsed: 1, createdTimestamp: now - 12*day },
                { proposalId: 'p-5', clientName: 'Divya & Suresh', targetBudget: '200000', expTime: now - 2*day, maxViews: 3, viewsUsed: 4, createdTimestamp: now - 18*day },
                { proposalId: 'p-6', clientName: 'Arjun & Pooja', targetBudget: '100000', expTime: now - 10*day, maxViews: 3, viewsUsed: 3, createdTimestamp: now - 25*day }
            ];
            localStorage.setItem('royal_blooms_proposals', JSON.stringify(proposalsList));
        }

        // Calculate Date Cutoff
        let minTimestamp = Date.now() - (currentPresetDays * 24 * 60 * 60 * 1000);
        let maxTimestamp = Date.now();

        if (startDateInput && startDateInput.value && endDateInput && endDateInput.value) {
            minTimestamp = new Date(startDateInput.value).getTime();
            maxTimestamp = new Date(endDateInput.value).getTime() + (24 * 60 * 60 * 1000);
        }

        // Filter Proposals within Date Range
        const filteredProposals = proposalsList.filter(p => {
            const t = p.createdTimestamp || Date.now();
            return t >= minTimestamp && t <= maxTimestamp;
        });

        // Compute KPIs
        const now = Date.now();
        const activeProposals = filteredProposals.filter(p => now < p.expTime && (p.maxViews === 999 || p.viewsUsed <= p.maxViews));
        const expiredProposals = filteredProposals.filter(p => now >= p.expTime || (p.maxViews !== 999 && p.viewsUsed > p.maxViews));

        document.getElementById('kpi-total-proposals').textContent = filteredProposals.length;
        document.getElementById('kpi-active-proposals').textContent = activeProposals.length;
        document.getElementById('kpi-expired-proposals').textContent = expiredProposals.length;

        const dateLabel = document.getElementById('kpi-date-label');
        if (dateLabel) {
            dateLabel.textContent = currentPresetDays === 30 ? "Last 30 Days (Default)" : `Filtered (${filteredProposals.length} links)`;
        }

        if (periodBadge) {
            periodBadge.textContent = currentPresetDays === 30 ? "1 Month View" : `${currentPresetDays} Days View`;
        }

        // Render Chart 1: Timeline
        renderTimelineChart(filteredProposals);

        // Render Chart 2: Budget Pie
        renderBudgetPieChart(filteredProposals);
    };

    const renderTimelineChart = (proposals) => {
        const ctx = document.getElementById('proposals-chart');
        if (!ctx) return;

        if (proposalsChart) proposalsChart.destroy();

        // Group by weeks/dates
        const dateCounts = {};
        proposals.forEach(p => {
            const dateStr = new Date(p.createdTimestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        });

        const labels = Object.keys(dateCounts).length > 0 ? Object.keys(dateCounts) : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const data = Object.keys(dateCounts).length > 0 ? Object.values(dateCounts) : [3, 7, 12, 18];

        proposalsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Client Proposal Links Shared',
                    data: data,
                    borderColor: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#FAF7F2' } }
                },
                scales: {
                    x: { ticks: { color: '#B3AAA0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#B3AAA0' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    };

    const renderBudgetPieChart = (proposals) => {
        const ctx = document.getElementById('budget-pie-chart');
        if (!ctx) return;

        if (budgetPieChart) budgetPieChart.destroy();

        let b50k = 0, b1L = 0, b2L = 0, b5L = 0;
        proposals.forEach(p => {
            if (p.targetBudget === '50000') b50k++;
            else if (p.targetBudget === '100000') b1L++;
            else if (p.targetBudget === '200000') b2L++;
            else if (p.targetBudget === '500000') b5L++;
            else b1L++;
        });

        budgetPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['₹50k Haldi/Sangeet', '₹1L - ₹2L Classic', '₹2L - ₹5L Royal', '₹5L+ Grand Luxury'],
                datasets: [{
                    data: [b50k || 2, b1L || 5, b2L || 8, b5L || 3],
                    backgroundColor: ['#E6C200', '#D4AF37', '#AA820A', '#C5A059'],
                    borderWidth: 2,
                    borderColor: '#121212'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#FAF7F2', font: { size: 11 } } }
                }
            }
        });
    };

    updateAnalyticsDashboard();

    // ----------------------------------------------------------------------
    // 7. REAL-TIME FIRESTORE CLIENT LEADS LISTENER
    // ----------------------------------------------------------------------
    const leadsTbody = document.getElementById('admin-leads-tbody');
    const kpiLeadsElem = document.getElementById('kpi-total-leads');

    const listenToFirestoreLeads = () => {
        if (window.firebaseDb && window.firebaseFirestore) {
            try {
                const { collection, onSnapshot } = window.firebaseFirestore;
                onSnapshot(collection(window.firebaseDb, 'leads'), (snapshot) => {
                    if (!leadsTbody) return;
                    leadsTbody.innerHTML = '';
                    let count = 0;

                    snapshot.forEach(docSnap => {
                        count++;
                        const lead = docSnap.data();
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong class="text-white">${lead.name || 'Anonymous Client'}</strong></td>
                            <td><a href="tel:${lead.phone}" class="text-gold text-decoration-none">${lead.phone || 'N/A'}</a></td>
                            <td><span class="badge bg-secondary border border-gold text-light">${lead.eventDate || 'TBD'}</span></td>
                            <td><span class="badge bg-gold text-dark">${lead.theme || 'Custom'}</span></td>
                            <td><small class="text-muted">${lead.details || 'No additional details'}</small></td>
                            <td>
                                <a href="https://wa.me/${(lead.phone || '').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(lead.name || 'there')},%20this%20is%20Kalpana%20Amar%20from%20Royal%20Blooms%20Decor!%20Thank%20you%20for%20your%20inquiry." target="_blank" class="btn btn-sm btn-success">
                                    <i class="fab fa-whatsapp me-1"></i> Chat
                                </a>
                            </td>
                        `;
                        leadsTbody.appendChild(tr);
                    });

                    if (kpiLeadsElem) kpiLeadsElem.textContent = count;
                });
            } catch (e) {
                console.warn("Firestore leads listener notice:", e);
            }
        }
    };

    setTimeout(listenToFirestoreLeads, 2000);
});
