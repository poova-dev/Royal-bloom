/* ==========================================================================
   ROYAL BLOOMS DECOR — ADMIN SUITE SCRIPT (v3 — Full Fix)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════════════════════════
    // 1. DEFAULT CATALOG DATA
    // ══════════════════════════════════════════════════════════════
    const defaultCatalogItems = [
        {
            id: "cat-1",
            title: "Grand Royal Palace Stage",
            category: "stage",
            budget: 350000,
            budgetLabel: "From ₹3,50,000",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
            desc: "30ft Wide Backdrop with 12ft Golden Carved Pillars, Velvet Drapes, and Crystal Chandeliers.",
            width: "30 ft × 14 ft",
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
            width: "24 ft × 12 ft",
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
            width: "15 ft × 10 ft",
            props: "Big Brass Tub for Haldi, Cane Baskets, Cushions",
            lights: "Festive Ambient Warm Light",
            palette: "Sunflower Yellow, Orange & Natural Green"
        },
        {
            id: "cat-5",
            title: "Enchanted Fairy Light Tunnel",
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

    const saveCatalogLocal = () => localStorage.setItem('royal_blooms_catalog', JSON.stringify(catalogItems));

    // ══════════════════════════════════════════════════════════════
    // 2. PIN AUTHENTICATION
    // ══════════════════════════════════════════════════════════════
    const authOverlay   = document.getElementById('admin-auth-overlay');
    const authForm      = document.getElementById('admin-auth-form');
    const pinInput      = document.getElementById('admin-pin-input');
    const pinError      = document.getElementById('admin-pin-error');
    const lockBtn       = document.getElementById('admin-lock-session-btn');
    const DEFAULT_PIN   = "1234";

    const checkAuth = () => {
        if (sessionStorage.getItem('admin_authenticated') === 'true') {
            authOverlay && authOverlay.classList.add('d-none');
        } else {
            authOverlay && authOverlay.classList.remove('d-none');
            pinInput && (pinInput.value = '', pinInput.focus());
        }
    };

    authForm && authForm.addEventListener('submit', e => {
        e.preventDefault();
        if (pinInput.value.trim() === DEFAULT_PIN) {
            sessionStorage.setItem('admin_authenticated', 'true');
            authOverlay.classList.add('d-none');
            pinError.classList.add('d-none');
        } else {
            pinError.classList.remove('d-none');
            pinInput.value = '';
            pinInput.focus();
        }
    });

    lockBtn && lockBtn.addEventListener('click', e => {
        e.preventDefault();
        sessionStorage.removeItem('admin_authenticated');
        checkAuth();
    });

    checkAuth();

    // ══════════════════════════════════════════════════════════════
    // 3. TAB / SIDEBAR NAVIGATION
    // ══════════════════════════════════════════════════════════════
    const sidebarToggler = document.querySelector('.sidebar-toggler');
    const sidebar        = document.querySelector('.sidebar');
    const content        = document.querySelector('.content');

    sidebarToggler && sidebarToggler.addEventListener('click', e => {
        e.preventDefault();
        sidebar  && sidebar.classList.toggle('open');
        content  && content.classList.toggle('open');
    });

    /** Central tab switcher — works for both nav-links AND quick-action cards */
    const switchTab = (tabId) => {
        document.querySelectorAll('.dashboard-tab-content').forEach(s => s.classList.add('d-none'));
        document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));

        const target = document.getElementById(tabId);
        if (target) target.classList.remove('d-none');

        const matchingLink = document.querySelector(`.sidebar .nav-link[data-tab="${tabId}"]`);
        if (matchingLink) matchingLink.classList.add('active');

        // When switching to Proposal Generator, always refresh the picker
        if (tabId === 'proposal-generator-section') {
            renderAdminItemPicker();
            renderAllProposalsMini();
        }
    };

    // Sidebar nav links
    document.querySelectorAll('.sidebar .nav-link[data-tab]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            switchTab(link.getAttribute('data-tab'));
        });
    });

    // Quick action cards in Analytics dashboard
    ['qa-proposal', 'qa-catalog', 'qa-leads'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', () => switchTab(el.getAttribute('data-tab')));
        }
    });

    // "New Link +" link in recent proposals widget
    const gotoProposals = document.getElementById('goto-proposals');
    gotoProposals && gotoProposals.addEventListener('click', e => {
        e.preventDefault();
        switchTab('proposal-generator-section');
    });

    // Cloud sync quick action
    const qaSyncBtn = document.getElementById('qa-sync');
    qaSyncBtn && qaSyncBtn.addEventListener('click', () => {
        syncAllToCloud();
    });

    // Refresh analytics button
    document.getElementById('refresh-analytics-btn') && document.getElementById('refresh-analytics-btn').addEventListener('click', () => {
        updateAnalyticsDashboard();
        document.getElementById('last-refresh-label') && (document.getElementById('last-refresh-label').innerHTML = '<i class="fas fa-check-circle me-1" style="color:#34D399;"></i>Refreshed just now');
    });

    // ══════════════════════════════════════════════════════════════
    // 4. CATALOG CRUD
    // ══════════════════════════════════════════════════════════════
    const catalogTbody      = document.getElementById('admin-catalog-tbody');
    const catalogCountElem  = document.getElementById('admin-catalog-count');
    const catalogSearchInput = document.getElementById('admin-catalog-search');
    const addItemForm       = document.getElementById('add-catalog-item-form');
    const syncCloudBtn      = document.getElementById('sync-cloud-catalog-btn');

    const renderCatalogTable = (filter = '') => {
        if (!catalogTbody) return;
        const filtered = catalogItems.filter(item => {
            if (!filter) return true;
            const q = filter.toLowerCase();
            return item.title.toLowerCase().includes(q) ||
                   item.category.toLowerCase().includes(q) ||
                   (item.props && item.props.toLowerCase().includes(q));
        });

        if (catalogCountElem) catalogCountElem.textContent = filtered.length;

        // Update total catalog count widget on analytics tab
        const totalCatEl = document.getElementById('total-catalog-count');
        if (totalCatEl) totalCatEl.textContent = catalogItems.length;

        catalogTbody.innerHTML = '';
        filtered.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${item.image}" alt="${item.title}" class="cat-thumb-sm" onerror="this.src='https://images.unsplash.com/photo-1519741497674-611481863552?w=100&q=60'"></td>
                <td>
                    <strong>${item.title}</strong><br>
                    <small class="text-muted">${item.props || ''}</small>
                </td>
                <td><span class="badge bg-outline-gold">${item.category}</span></td>
                <td><strong class="text-gold">${item.budgetLabel}</strong></td>
                <td><small>${item.width}</small></td>
                <td>
                    <button class="btn btn-sm btn-outline-warning me-1 edit-item-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-item-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            catalogTbody.appendChild(tr);
        });

        // Attach CRUD listeners
        document.querySelectorAll('.edit-item-btn').forEach(btn =>
            btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')))
        );
        document.querySelectorAll('.delete-item-btn').forEach(btn =>
            btn.addEventListener('click', () => deleteCatalogItem(btn.getAttribute('data-id')))
        );

        // Always refresh picker too
        renderAdminItemPicker();
    };

    // ADD new item
    addItemForm && addItemForm.addEventListener('submit', e => {
        e.preventDefault();
        const budget = parseInt(document.getElementById('add-item-budget').value, 10);
        const newItem = {
            id: 'cat-' + Date.now(),
            title:      document.getElementById('add-item-title').value.trim(),
            category:   document.getElementById('add-item-category').value,
            budget,
            budgetLabel: `From ₹${budget.toLocaleString('en-IN')}`,
            image:  document.getElementById('add-item-image').value.trim(),
            desc:   document.getElementById('add-item-props').value.trim() + '. Designed by Kalpana Amar.',
            width:  document.getElementById('add-item-width').value.trim(),
            props:  document.getElementById('add-item-props').value.trim(),
            lights: document.getElementById('add-item-lights').value.trim(),
            palette: "Pastel & Gold Accents"
        };
        catalogItems.unshift(newItem);
        saveCatalogLocal();
        saveItemToFirestore(newItem);
        renderCatalogTable();
        addItemForm.reset();
        showToast('✨ Design added to Catalog & synced!', 'success');
    });

    // EDIT modal
    let editModal;
    const editModalEl = document.getElementById('editItemModal');
    if (editModalEl) {
        editModal = new bootstrap.Modal(editModalEl);
    }
    const editForm = document.getElementById('edit-catalog-item-form');

    const openEditModal = (id) => {
        const item = catalogItems.find(i => i.id === id);
        if (!item || !editModal) return;
        document.getElementById('edit-item-id').value        = item.id;
        document.getElementById('edit-item-title').value     = item.title;
        document.getElementById('edit-item-category').value  = item.category;
        document.getElementById('edit-item-budget').value    = item.budget;
        document.getElementById('edit-item-width').value     = item.width;
        document.getElementById('edit-item-image').value     = item.image;
        document.getElementById('edit-item-props').value     = item.props || '';
        document.getElementById('edit-item-lights').value    = item.lights || '';
        editModal.show();
    };

    editForm && editForm.addEventListener('submit', e => {
        e.preventDefault();
        const id    = document.getElementById('edit-item-id').value;
        const index = catalogItems.findIndex(i => i.id === id);
        if (index === -1) return;
        const budget = parseInt(document.getElementById('edit-item-budget').value, 10);
        catalogItems[index] = {
            ...catalogItems[index],
            title:      document.getElementById('edit-item-title').value.trim(),
            category:   document.getElementById('edit-item-category').value,
            budget,
            budgetLabel: `From ₹${budget.toLocaleString('en-IN')}`,
            width:  document.getElementById('edit-item-width').value.trim(),
            image:  document.getElementById('edit-item-image').value.trim(),
            props:  document.getElementById('edit-item-props').value.trim(),
            lights: document.getElementById('edit-item-lights').value.trim(),
        };
        saveCatalogLocal();
        saveItemToFirestore(catalogItems[index]);
        renderCatalogTable();
        editModal && editModal.hide();
        showToast('✓ Design updated & synced to Cloud!', 'success');
    });

    // DELETE item
    const deleteCatalogItem = (id) => {
        if (!confirm('Delete this catalog design?')) return;
        catalogItems = catalogItems.filter(i => i.id !== id);
        saveCatalogLocal();
        deleteItemFromFirestore(id);
        renderCatalogTable();
    };

    // SYNC all catalog button
    syncCloudBtn && syncCloudBtn.addEventListener('click', () => syncAllToCloud());
    catalogSearchInput && catalogSearchInput.addEventListener('input', e => renderCatalogTable(e.target.value));

    renderCatalogTable();

    // Firestore helpers
    const saveItemToFirestore = (item) => {
        if (!window.firebaseDb || !window.firebaseFirestore) return;
        const { doc, setDoc } = window.firebaseFirestore;
        setDoc(doc(window.firebaseDb, 'catalog', item.id), item).catch(err => console.warn('Firestore save:', err));
    };
    const deleteItemFromFirestore = (id) => {
        if (!window.firebaseDb || !window.firebaseFirestore) return;
        const { doc, deleteDoc } = window.firebaseFirestore;
        deleteDoc(doc(window.firebaseDb, 'catalog', id)).catch(err => console.warn('Firestore delete:', err));
    };
    const syncAllToCloud = () => {
        if (!window.firebaseDb || !window.firebaseFirestore) {
            showToast('Cloud database connecting… try again in 2s.', 'warning');
            return;
        }
        const { doc, setDoc } = window.firebaseFirestore;
        let done = 0;
        catalogItems.forEach(item => {
            setDoc(doc(window.firebaseDb, 'catalog', item.id), item)
                .then(() => { done++; if (done === catalogItems.length) showToast(`☁️ All ${done} designs synced to Cloud!`, 'success'); })
                .catch(err => console.warn(err));
        });
    };

    // ══════════════════════════════════════════════════════════════
    // 5. PROPOSAL LINK GENERATOR — FULLY FIXED
    // ══════════════════════════════════════════════════════════════

    /** Render checkboxes in the item picker container */
    function renderAdminItemPicker() {
        const container = document.getElementById('admin-item-picker-container');
        if (!container) return;
        container.innerHTML = '';
        if (catalogItems.length === 0) {
            container.innerHTML = '<p class="text-muted small mb-0">No catalog items yet.</p>';
            return;
        }
        catalogItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'form-check mb-2';
            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${item.id}" id="picker-${item.id}">
                <label class="form-check-label" for="picker-${item.id}">
                    <strong>${item.title}</strong>
                    <span style="color:var(--text-muted);font-size:.8rem;"> — ${item.budgetLabel} · ${item.width}</span>
                </label>
            `;
            container.appendChild(div);
        });
    }

    /** Build the all-proposals mini list in Proposal Generator sidebar */
    function renderAllProposalsMini() {
        const container = document.getElementById('all-proposals-mini-list');
        if (!container) return;
        const list = JSON.parse(localStorage.getItem('royal_blooms_proposals')) || [];
        if (list.length === 0) {
            container.innerHTML = '<p class="text-muted small mb-0">No proposals generated yet.</p>';
            return;
        }
        container.innerHTML = '';
        list.slice(0, 8).forEach(p => {
            const now = Date.now();
            const active = now < p.expTime && (p.maxViews === 999 || p.viewsUsed <= p.maxViews);
            const statusClass = active ? 'pill-active' : 'pill-expired';
            const statusText  = active ? 'Active' : 'Expired';
            const initials = (p.clientName || 'CL').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const row = document.createElement('div');
            row.className = 'proposal-row';
            row.innerHTML = `
                <div class="proposal-avatar">${initials}</div>
                <div class="proposal-info">
                    <div class="proposal-name">${p.clientName}</div>
                    <div class="proposal-sub">${new Date(p.createdTimestamp).toLocaleDateString('en-IN', {day:'numeric',month:'short'})}</div>
                </div>
                <div class="proposal-status">
                    <span class="pill ${statusClass}">${statusText}</span>
                </div>
            `;
            container.appendChild(row);
        });
    }

    // Attach submit handler
    const genProposalForm = document.getElementById('admin-gen-proposal-form');

    genProposalForm && genProposalForm.addEventListener('submit', e => {
        e.preventDefault();

        const clientName  = document.getElementById('admin-client-name').value.trim();
        const budgetTier  = document.getElementById('admin-budget-tier').value;
        const expiryHours = parseInt(document.getElementById('admin-expiry-hours').value, 10);
        const maxViews    = parseInt(document.getElementById('admin-max-views').value, 10);

        // Validate
        if (!clientName) {
            showToast('Please enter the client name.', 'warning');
            document.getElementById('admin-client-name').focus();
            return;
        }

        // Collect selected items (re-query the live DOM each time)
        const pickerContainer = document.getElementById('admin-item-picker-container');
        const pickedIds = pickerContainer
            ? Array.from(pickerContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
            : [];

        const expTime = Date.now() + (expiryHours * 60 * 60 * 1000);
        const propId  = 'prop-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900);

        // ── Build the public site base URL robustly ──
        // Handles: http://localhost:5501/admin/index.html
        //          https://mysite.com/admin/index.html
        //          file:///Users/.../admin/index.html  (shows warning)
        let baseUrl;
        const protocol = window.location.protocol;

        if (protocol === 'file:') {
            // File protocol — build a relative-like file URL
            const filePath = window.location.pathname; // e.g. /Users/.../admin/index.html
            const adminIdx = filePath.lastIndexOf('/admin/');
            if (adminIdx !== -1) {
                baseUrl = 'file://' + filePath.substring(0, adminIdx) + '/index.html';
            } else {
                baseUrl = window.location.href.replace(/admin\/[^/]*$/, '') + 'index.html';
            }
        } else {
            // HTTP / HTTPS — standard approach
            const pathParts = window.location.pathname; // e.g. /subdir/admin/index.html
            const adminIdx  = pathParts.indexOf('/admin/');
            const siteRoot  = adminIdx !== -1
                ? window.location.origin + pathParts.substring(0, adminIdx) + '/'
                : window.location.origin + '/';
            baseUrl = siteRoot + 'index.html';
        }

        // Build hash query
        let hashQuery = `#proposal?id=${propId}&client=${encodeURIComponent(clientName)}&exp=${expTime}&views=${maxViews}`;
        if (budgetTier !== 'all') hashQuery += `&budget=${budgetTier}`;
        if (pickedIds.length > 0) hashQuery += `&items=${pickedIds.join(',')}`;

        const finalUrl = baseUrl + hashQuery;

        // Save record
        const record = {
            proposalId:       propId,
            clientName,
            targetBudget:     budgetTier,
            expTime,
            maxViews,
            viewsUsed:        0,
            pickedItemIds:    pickedIds,
            shareableUrl:     finalUrl,
            createdTimestamp: Date.now()
        };

        const proposals = JSON.parse(localStorage.getItem('royal_blooms_proposals')) || [];
        proposals.unshift(record);
        localStorage.setItem('royal_blooms_proposals', JSON.stringify(proposals));

        // Push to Firestore
        if (window.firebaseDb && window.firebaseFirestore) {
            try {
                const { doc, setDoc, serverTimestamp } = window.firebaseFirestore;
                setDoc(doc(window.firebaseDb, 'proposals', propId), { ...record, createdTime: serverTimestamp() })
                    .catch(err => console.warn('Firestore proposal save:', err));
            } catch (err) { console.warn(err); }
        }

        // Show output box
        const outputBox         = document.getElementById('proposal-output-box');
        const generatedUrlField = document.getElementById('generated-url-field');
        const sendWaBtn         = document.getElementById('send-wa-link-btn');

        if (generatedUrlField) generatedUrlField.value = finalUrl;
        if (outputBox)         { outputBox.classList.remove('d-none'); outputBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }

        const waMsg = encodeURIComponent(
            `Hi ${clientName}! ✨\n\nHere is your exclusive bespoke wedding decor proposal curated by *Kalpana Amar — Royal Blooms Decor*:\n\n${finalUrl}\n\n⏳ *Note:* This link is active for ${expiryHours} hours / ${maxViews === 999 ? 'unlimited' : maxViews} views only — to protect our seasonal pricing.`
        );
        if (sendWaBtn) sendWaBtn.href = `https://wa.me/?text=${waMsg}`;

        // Refresh analytics & mini list
        updateAnalyticsDashboard();
        renderAllProposalsMini();

        showToast(`✅ Proposal link generated for ${clientName}!`, 'success');
    });

    // Copy button
    const copyUrlBtnEl = document.getElementById('copy-url-btn');
    copyUrlBtnEl && copyUrlBtnEl.addEventListener('click', () => {
        const field = document.getElementById('generated-url-field');
        if (!field || !field.value) return;
        navigator.clipboard.writeText(field.value).then(() => {
            const orig = copyUrlBtnEl.innerHTML;
            copyUrlBtnEl.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
            copyUrlBtnEl.style.background = '#34D399';
            setTimeout(() => { copyUrlBtnEl.innerHTML = orig; copyUrlBtnEl.style.background = ''; }, 2000);
        }).catch(() => {
            // Fallback for file:// protocol
            field.select();
            document.execCommand('copy');
            showToast('Link copied!', 'success');
        });
    });

    // Render picker immediately (in case proposal section was already visible)
    renderAdminItemPicker();

    // ══════════════════════════════════════════════════════════════
    // 6. ANALYTICS DASHBOARD — KPIs, CHARTS, RECENT PROPOSALS, ACTIVITY
    // ══════════════════════════════════════════════════════════════
    let currentPresetDays = 30;
    let proposalsChart    = null;
    let budgetPieChart    = null;

    // Date filter preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const preset = btn.getAttribute('data-preset');
            const customEl = document.getElementById('custom-date-inputs');
            if (preset === 'custom') {
                customEl && customEl.classList.replace('d-none', 'd-flex');
            } else {
                customEl && customEl.classList.replace('d-flex', 'd-none');
                currentPresetDays = parseInt(preset, 10);
                updateAnalyticsDashboard();
            }
        });
    });

    document.getElementById('apply-custom-date-btn') && document.getElementById('apply-custom-date-btn').addEventListener('click', () => updateAnalyticsDashboard());

    /** Main analytics update function */
    function updateAnalyticsDashboard() {
        // Get or seed proposals
        let proposals = JSON.parse(localStorage.getItem('royal_blooms_proposals')) || [];

        if (proposals.length === 0) {
            const now = Date.now(), DAY = 864e5;
            proposals = [
                { proposalId:'p-1', clientName:'Sneha & Rohan',   targetBudget:'100000', expTime: now+24*DAY, maxViews:3, viewsUsed:1, createdTimestamp: now - 2*DAY },
                { proposalId:'p-2', clientName:'Karthik & Priya', targetBudget:'200000', expTime: now-DAY,    maxViews:3, viewsUsed:3, createdTimestamp: now - 5*DAY },
                { proposalId:'p-3', clientName:'Ananya & Vikram', targetBudget:'500000', expTime: now+DAY,    maxViews:3, viewsUsed:2, createdTimestamp: now - 8*DAY },
                { proposalId:'p-4', clientName:'Rahul & Meera',   targetBudget:'50000',  expTime: now+3*DAY,  maxViews:3, viewsUsed:1, createdTimestamp: now - 12*DAY },
                { proposalId:'p-5', clientName:'Divya & Suresh',  targetBudget:'200000', expTime: now-2*DAY,  maxViews:3, viewsUsed:4, createdTimestamp: now - 18*DAY },
                { proposalId:'p-6', clientName:'Arjun & Pooja',   targetBudget:'100000', expTime: now-10*DAY, maxViews:3, viewsUsed:3, createdTimestamp: now - 25*DAY },
                { proposalId:'p-7', clientName:'Nisha & Dev',     targetBudget:'500000', expTime: now+5*DAY,  maxViews:5, viewsUsed:0, createdTimestamp: now - 1*DAY },
                { proposalId:'p-8', clientName:'Preethi & Raj',   targetBudget:'100000', expTime: now+2*DAY,  maxViews:3, viewsUsed:1, createdTimestamp: now - 3*DAY },
            ];
            localStorage.setItem('royal_blooms_proposals', JSON.stringify(proposals));
        }

        // Date range filter
        const startEl = document.getElementById('analytics-start-date');
        const endEl   = document.getElementById('analytics-end-date');
        let minTs = Date.now() - (currentPresetDays * 864e5);
        let maxTs = Date.now();
        if (startEl && startEl.value && endEl && endEl.value) {
            minTs = new Date(startEl.value).getTime();
            maxTs = new Date(endEl.value).getTime() + 864e5;
        }

        const filtered = proposals.filter(p => {
            const t = p.createdTimestamp || Date.now();
            return t >= minTs && t <= maxTs;
        });

        const now = Date.now();
        const active  = filtered.filter(p => now < p.expTime && (p.maxViews === 999 || p.viewsUsed <= p.maxViews));
        const expired = filtered.filter(p => now >= p.expTime || (p.maxViews !== 999 && p.viewsUsed > p.maxViews));

        // Update KPI cards
        setEl('kpi-total-proposals',  filtered.length);
        setEl('kpi-active-proposals', active.length);
        setEl('kpi-expired-proposals', expired.length);

        // Notification bar counts
        setEl('notif-active-count', active.length);
        setEl('notif-leads-count', '—');

        // Period label
        const periodLabel = currentPresetDays === 30 ? 'Last 30 Days' : `Last ${currentPresetDays} Days`;
        setEl('kpi-date-label', periodLabel);
        setEl('chart-period-badge', currentPresetDays + ' Days');

        // Revenue estimate
        const budgetMap = { '50000': 75000, '100000': 150000, '200000': 350000, '500000': 600000 };
        const totalRev = filtered.reduce((sum, p) => sum + (budgetMap[p.targetBudget] || 150000), 0);
        const avgRev   = filtered.length ? Math.round(totalRev / filtered.length) : 0;
        setEl('rev-est-total', '₹' + (totalRev / 1000).toFixed(0) + 'k');
        setEl('rev-est-avg',   '₹' + (avgRev  / 1000).toFixed(0) + 'k');

        // Conversion rate (active / total)
        const convRate = filtered.length ? Math.round((active.length / filtered.length) * 100) : 0;
        setEl('conversion-rate', convRate + '%');
        const bar = document.getElementById('conversion-bar');
        if (bar) bar.style.width = convRate + '%';

        // Charts
        renderTimelineChart(filtered);
        renderBudgetPieChart(filtered);

        // Recent proposals list
        renderRecentProposals(proposals);

        // Activity feed
        renderActivityFeed(proposals);
    }

    /** Set element text by id — safe */
    function setEl(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    /** Timeline line chart */
    function renderTimelineChart(proposals) {
        const ctx = document.getElementById('proposals-chart');
        if (!ctx) return;
        if (proposalsChart) { proposalsChart.destroy(); proposalsChart = null; }

        // Group proposals by date
        const dateCounts = {};
        proposals.forEach(p => {
            const d = new Date(p.createdTimestamp || Date.now());
            const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            dateCounts[label] = (dateCounts[label] || 0) + 1;
        });

        // Fill with placeholder if empty
        let labels, data;
        if (Object.keys(dateCounts).length > 0) {
            // Sort by date
            const sorted = Object.entries(dateCounts).sort((a, b) => {
                return new Date(a[0]) - new Date(b[0]);
            });
            labels = sorted.map(x => x[0]);
            data   = sorted.map(x => x[1]);
        } else {
            const now = Date.now(), DAY = 864e5;
            labels = [7,6,5,4,3,2,1].map(i => new Date(now - i*DAY).toLocaleDateString('en-IN', {day:'numeric',month:'short'}));
            data   = [1, 3, 2, 5, 4, 6, 3];
        }

        proposalsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Proposals Shared',
                    data,
                    borderColor:     '#C9A84C',
                    backgroundColor: 'rgba(201,168,76,0.08)',
                    borderWidth:     2.5,
                    fill:            true,
                    tension:         0.4,
                    pointBackgroundColor: '#C9A84C',
                    pointBorderColor:     '#0D1117',
                    pointBorderWidth:     2,
                    pointRadius:     5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#F0E6D3', font: { weight: '600' }, boxWidth: 12 } },
                    tooltip: {
                        backgroundColor: '#1C2537',
                        borderColor: '#C9A84C',
                        borderWidth: 1,
                        titleColor: '#C9A84C',
                        bodyColor: '#F0E6D3'
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8A9BB0', font: { size: 11 } },
                        grid:  { color: 'rgba(201,168,76,0.07)' }
                    },
                    y: {
                        ticks: { color: '#8A9BB0', font: { size: 11 }, stepSize: 1 },
                        grid:  { color: 'rgba(201,168,76,0.07)' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /** Doughnut chart for budget tiers */
    function renderBudgetPieChart(proposals) {
        const ctx = document.getElementById('budget-pie-chart');
        if (!ctx) return;
        if (budgetPieChart) { budgetPieChart.destroy(); budgetPieChart = null; }

        let b50k = 0, b1L = 0, b2L = 0, b5L = 0;
        proposals.forEach(p => {
            if (p.targetBudget === '50000')       b50k++;
            else if (p.targetBudget === '100000') b1L++;
            else if (p.targetBudget === '200000') b2L++;
            else if (p.targetBudget === '500000') b5L++;
            else                                   b1L++;
        });

        budgetPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['₹50k Haldi', '₹1L–₹2L Classic', '₹2L–₹5L Royal', '₹5L+ Luxury'],
                datasets: [{
                    data: [b50k || 2, b1L || 5, b2L || 8, b5L || 3],
                    backgroundColor: ['#C9A84C', '#4FC3F7', '#A78BFA', '#34D399'],
                    borderWidth: 3,
                    borderColor: '#161D2C',
                    hoverBorderColor: '#C9A84C'
                }]
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                cutout:              '68%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#F0E6D3', font: { size: 10 }, padding: 10, boxWidth: 10 }
                    },
                    tooltip: {
                        backgroundColor: '#1C2537',
                        borderColor: '#C9A84C',
                        borderWidth: 1,
                        titleColor: '#C9A84C',
                        bodyColor: '#F0E6D3'
                    }
                }
            }
        });
    }

    /** Render recent proposals list on analytics tab */
    function renderRecentProposals(proposals) {
        const container = document.getElementById('recent-proposals-list');
        if (!container) return;
        if (!proposals || proposals.length === 0) {
            container.innerHTML = '<div class="text-center py-3" style="color:var(--text-muted);font-size:.82rem;"><i class="fas fa-link fa-2x d-block mb-2" style="opacity:.3;"></i>No proposals yet. Generate your first one!</div>';
            return;
        }
        container.innerHTML = '';
        proposals.slice(0, 6).forEach(p => {
            const now    = Date.now();
            const active = now < p.expTime && (p.maxViews === 999 || p.viewsUsed <= p.maxViews);
            const initials = (p.clientName || 'CL').split(/\s*&\s*|\s+/).map(w => w[0] || '').join('').toUpperCase().slice(0, 2);
            const row = document.createElement('div');
            row.className = 'proposal-row';
            row.innerHTML = `
                <div class="proposal-avatar">${initials}</div>
                <div class="proposal-info">
                    <div class="proposal-name">${p.clientName}</div>
                    <div class="proposal-sub">${new Date(p.createdTimestamp).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'2-digit'})}</div>
                </div>
                <span class="pill ${active ? 'pill-active' : 'pill-expired'}">${active ? 'Active' : 'Expired'}</span>
            `;
            container.appendChild(row);
        });
    }

    /** Activity feed */
    function renderActivityFeed(proposals) {
        const feed = document.getElementById('activity-feed');
        if (!feed) return;
        feed.innerHTML = '';

        const activities = [];
        const now = Date.now(), DAY = 864e5;

        proposals.slice(0, 3).forEach(p => {
            const isActive = now < p.expTime && (p.maxViews === 999 || p.viewsUsed <= p.maxViews);
            activities.push({
                type:  isActive ? 'green' : 'red',
                icon:  isActive ? 'fas fa-link' : 'fas fa-lock',
                text:  `<strong>${p.clientName}</strong> proposal <strong>${isActive ? 'active' : 'expired'}</strong>`,
                time:  timeAgo(p.createdTimestamp)
            });
        });

        activities.push({ type: 'blue',   icon: 'fas fa-cloud-upload-alt', text: 'Catalog <strong>synced to Firestore</strong>', time: 'Just now' });
        activities.push({ type: 'gold',   icon: 'fas fa-crown',            text: '<strong>Royal Blooms</strong> admin session started', time: '10 min ago' });
        activities.push({ type: 'purple', icon: 'fas fa-palette',          text: 'Theme <strong>updated</strong> in Catalog Manager', time: '1h ago' });

        activities.slice(0, 6).forEach(a => {
            const li = document.createElement('li');
            li.className = 'activity-item';
            li.innerHTML = `
                <div class="activity-dot ${a.type}"><i class="${a.icon}"></i></div>
                <div>
                    <div class="activity-desc">${a.text}</div>
                    <div class="activity-meta">${a.time}</div>
                </div>
            `;
            feed.appendChild(li);
        });
    }

    function timeAgo(ts) {
        const diff = Date.now() - ts;
        const m = Math.floor(diff / 60000);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (m < 1)  return 'Just now';
        if (m < 60) return m + 'm ago';
        if (h < 24) return h + 'h ago';
        return d + 'd ago';
    }

    // Run analytics on load
    updateAnalyticsDashboard();

    // ══════════════════════════════════════════════════════════════
    // 7. FIRESTORE LEADS LISTENER
    // ══════════════════════════════════════════════════════════════
    const listenToLeads = () => {
        if (!window.firebaseDb || !window.firebaseFirestore) return;
        try {
            const { collection, onSnapshot, doc, updateDoc, deleteDoc } = window.firebaseFirestore;
            const leadsTbody = document.getElementById('admin-leads-tbody');
            const kpiLeadsEl = document.getElementById('kpi-total-leads');
            const leadsCountBadge = document.getElementById('leads-count-badge');

            onSnapshot(collection(window.firebaseDb, 'leads'), snapshot => {
                if (!leadsTbody) return;
                leadsTbody.innerHTML = '';
                let count = 0;

                if (snapshot.empty) {
                    leadsTbody.innerHTML = `<tr><td colspan="7" class="text-center py-5" style="color:var(--text-muted);">
                        <i class="fas fa-inbox fa-2x d-block mb-2" style="opacity:.3;"></i>No enquiries yet. They will appear here in real-time.
                    </td></tr>`;
                    return;
                }

                snapshot.forEach(docSnap => {
                    count++;
                    const lead   = docSnap.data();
                    const leadId = docSnap.id;
                    const status = lead.status || 'Pending';
                    const badgeCls = status === 'Booked' || status === 'Completed' ? 'pill-active'
                                   : status === 'Cancelled' ? 'pill-expired' : 'pill-pending';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${lead.name || 'Anonymous'}</strong></td>
                        <td><a href="tel:${lead.phone}" class="text-primary text-decoration-none fw-semibold">${lead.phone || '—'}</a></td>
                        <td><span class="badge bg-light">${lead.eventDate || 'TBD'}</span></td>
                        <td><span class="badge bg-primary">${lead.theme || 'Custom'}</span></td>
                        <td><small class="text-muted">${(lead.details || 'No details').slice(0, 60)}…</small></td>
                        <td>
                            <select class="form-select form-select-sm lead-status-select" data-id="${leadId}" style="width:115px;">
                                <option value="Pending"   ${status==='Pending'   ?'selected':''}>Pending</option>
                                <option value="Contacted" ${status==='Contacted' ?'selected':''}>Contacted</option>
                                <option value="Booked"    ${status==='Booked'    ?'selected':''}>Booked</option>
                                <option value="Completed" ${status==='Completed' ?'selected':''}>Completed</option>
                                <option value="Cancelled" ${status==='Cancelled' ?'selected':''}>Cancelled</option>
                            </select>
                        </td>
                        <td>
                            <div class="d-flex gap-1">
                                <a href="https://wa.me/${(lead.phone||'').replace(/\D/g,'')}?text=Hi%20${encodeURIComponent(lead.name||'there')}%2C%20this%20is%20Kalpana%20Amar%20from%20Royal%20Blooms%20Decor!%20Thank%20you%20for%20your%20enquiry."
                                   target="_blank" class="btn btn-sm btn-success" title="WhatsApp">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                                <button class="btn btn-sm btn-outline-danger delete-lead-btn" data-id="${leadId}" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    leadsTbody.appendChild(tr);
                });

                if (kpiLeadsEl)      kpiLeadsEl.textContent = count;
                if (leadsCountBadge) leadsCountBadge.textContent = count + ' Total';
                setEl('notif-leads-count', count);

                // Status change
                document.querySelectorAll('.lead-status-select').forEach(sel => {
                    sel.addEventListener('change', e => {
                        updateDoc(doc(window.firebaseDb, 'leads', e.target.getAttribute('data-id')), { status: e.target.value })
                            .catch(err => console.warn(err));
                    });
                });

                // Delete lead
                document.querySelectorAll('.delete-lead-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (confirm('Delete this enquiry?')) {
                            deleteDoc(doc(window.firebaseDb, 'leads', btn.getAttribute('data-id')))
                                .catch(err => console.warn(err));
                        }
                    });
                });
            });
        } catch (err) {
            console.warn('Firestore leads:', err);
        }
    };

    setTimeout(listenToLeads, 1200);

    // ══════════════════════════════════════════════════════════════
    // 8. TOAST NOTIFICATION UTILITY
    // ══════════════════════════════════════════════════════════════
    function showToast(message, type = 'success') {
        // Remove existing toast
        const existing = document.getElementById('admin-toast');
        if (existing) existing.remove();

        const colors = {
            success: { bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.4)',  color: '#34D399', icon: 'fas fa-check-circle' },
            warning: { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.4)',  color: '#FBBF24', icon: 'fas fa-exclamation-triangle' },
            error:   { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.4)', color: '#F87171', icon: 'fas fa-times-circle' },
        };
        const c = colors[type] || colors.success;

        const toast = document.createElement('div');
        toast.id = 'admin-toast';
        toast.style.cssText = `
            position:fixed; bottom:24px; right:24px; z-index:99999;
            background:${c.bg}; border:1px solid ${c.border};
            color:${c.color}; border-radius:12px;
            padding:12px 20px; font-size:.875rem; font-weight:600;
            display:flex; align-items:center; gap:10px;
            box-shadow:0 8px 32px rgba(0,0,0,.4);
            backdrop-filter:blur(8px);
            animation: toastIn .3s ease;
            max-width:340px;
        `;
        toast.innerHTML = `<i class="${c.icon}"></i><span>${message}</span>`;

        const style = document.createElement('style');
        style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}';
        document.head.appendChild(style);

        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(16px)'; toast.style.transition = '.3s'; setTimeout(() => toast.remove(), 350); }, 3500);
    }

}); // end DOMContentLoaded
