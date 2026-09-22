/**
 * Reverse Service Marketplace
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initNotificationDropdown();
});

/**
 * Theme Management
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    
    // Check system preference if no saved theme
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Apply initial theme
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    } else {
        // Dark is default
        document.documentElement.removeAttribute('data-theme');
        updateThemeIcon('dark');
    }

    // Handle toggle click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon('dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateThemeIcon('light');
        }
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (!icon) return;

    if (theme === 'light') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

/**
 * Sidebar Management (Desktop Collapsible & Modal Drawer)
 */
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.querySelector('.app-sidebar');
    const appContainer = document.querySelector('.app-container');
    
    if (!sidebar) return;

    // Create or find overlay element
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    const isModalLayout = appContainer && appContainer.classList.contains('sidebar-modal-layout');

    function openSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    function toggleSidebar() {
        if (window.innerWidth <= 991 || isModalLayout) {
            if (sidebar.classList.contains('show')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        } else {
            // Desktop toggle on regular pages: collapse or expand
            if (appContainer) {
                appContainer.classList.toggle('sidebar-collapsed');
            }
        }
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSidebar();
        });
    }

    overlay.addEventListener('click', closeSidebar);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            closeSidebar();
        }
    });

    // Close modal drawer on link click in modal layout
    if (isModalLayout) {
        sidebar.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                closeSidebar();
            });
        });
    }
}

/**
 * ==========================================================================
 * Header Notification Dropdown Modal Component
 * ==========================================================================
 */
const NOTIFICATIONS_DATA = [
    {
        id: 1,
        title: "New Quotation Received",
        message: "Farhan Ansari quoted ₹3,200 for Bathroom Plumbing Repair & Pipe Leak Fix.",
        time: "15m ago",
        icon: "fas fa-file-invoice-dollar",
        iconColor: "text-warning",
        iconBg: "background-color: rgba(245, 158, 11, 0.15)",
        target: "quotations",
        unread: true
    },
    {
        id: 2,
        title: "New Message from Rajesh",
        message: "I have picked up the RO filter spares. See you tomorrow at 10:30 AM.",
        time: "45m ago",
        icon: "fas fa-comment-dots",
        iconColor: "text-primary",
        iconBg: "background-color: rgba(99, 102, 241, 0.15)",
        target: "chat",
        unread: true
    },
    {
        id: 3,
        title: "Booking Confirmed",
        message: "Split AC Master Cleaning with CoolAir Pro scheduled for Oct 18.",
        time: "2h ago",
        icon: "fas fa-calendar-check",
        iconColor: "text-success",
        iconBg: "background-color: rgba(16, 185, 129, 0.15)",
        target: "bookings",
        unread: false
    },
    {
        id: 4,
        title: "Quotation Received",
        message: "Apex Electricals submitted a bid of ₹1,800 for Switchboard Wiring.",
        time: "4h ago",
        icon: "fas fa-file-invoice-dollar",
        iconColor: "text-warning",
        iconBg: "background-color: rgba(245, 158, 11, 0.15)",
        target: "quotations",
        unread: true
    },
    {
        id: 5,
        title: "Rate Your Service",
        message: "How was your deep cleaning service with CleanPro? Share verified feedback.",
        time: "1d ago",
        icon: "fas fa-star",
        iconColor: "text-warning",
        iconBg: "background-color: rgba(245, 158, 11, 0.15)",
        target: "reviews",
        unread: false
    },
    {
        id: 6,
        title: "Security Login Alert",
        message: "Your account was logged in from Chrome on Windows 11 (Mumbai IP).",
        time: "2d ago",
        icon: "fas fa-shield-alt",
        iconColor: "text-info",
        iconBg: "background-color: rgba(59, 130, 246, 0.15)",
        target: "settings",
        unread: false
    }
];

function initNotificationDropdown() {
    const isUserFolder = window.location.pathname.includes('/user/');
    const notifUrlPrefix = isUserFolder ? '../' : 'user/';
    const allNotifUrl = window.location.pathname.includes('/notifications/') 
        ? 'notifications.html' 
        : `${notifUrlPrefix}notifications/notifications.html`;

    // Ensure every header has a notification dropdown wrapper
    const headers = document.querySelectorAll('.app-header, .navbar');
    headers.forEach(header => {
        let wrapper = header.querySelector('.notif-dropdown-wrapper');
        
        // If an old static notifications link exists in header, replace it
        const oldNotifLink = header.querySelector('a[href*="notifications.html"]');
        if (oldNotifLink && !wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'notif-dropdown-wrapper';
            wrapper.innerHTML = `
                <button id="notif-toggle" class="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notif-badge-count" id="notif-badge">3</span>
                </button>
            `;
            oldNotifLink.replaceWith(wrapper);
        } else if (!wrapper) {
            const themeToggle = header.querySelector('#theme-toggle');
            const targetParent = themeToggle ? themeToggle.parentElement : header.querySelector('.flex.items-center.gap-3');
            if (!targetParent) return;

            wrapper = document.createElement('div');
            wrapper.className = 'notif-dropdown-wrapper';
            wrapper.innerHTML = `
                <button id="notif-toggle" class="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notif-badge-count" id="notif-badge">3</span>
                </button>
            `;
            if (themeToggle) {
                targetParent.insertBefore(wrapper, themeToggle.nextSibling);
            } else {
                targetParent.appendChild(wrapper);
            }
        }

        // Create or get modal
        let modal = wrapper.querySelector('.notif-dropdown-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'notif-dropdown-modal';
            modal.id = 'notif-dropdown';
            wrapper.appendChild(modal);
        }

        const notifBtn = wrapper.querySelector('.notif-bell-btn');
        const badge = wrapper.querySelector('.notif-badge-count');

        function renderNotifications() {
            const unreadCount = NOTIFICATIONS_DATA.filter(n => n.unread).length;
            if (badge) {
                badge.textContent = unreadCount;
                if (unreadCount === 0) {
                    badge.classList.add('hidden');
                } else {
                    badge.classList.remove('hidden');
                }
            }

            modal.innerHTML = `
                <div class="notif-dropdown-header">
                    <div class="flex items-center gap-2">
                        <h3 class="notif-header-title">Notifications</h3>
                        <span class="badge badge-primary text-xs" id="notif-unread-count">${unreadCount} New</span>
                    </div>
                    ${unreadCount > 0 ? `
                        <button type="button" class="btn-mark-all-read" id="notif-mark-all-btn">
                            <i class="fas fa-check-double"></i> Mark all read
                        </button>
                    ` : `
                        <span class="text-xs text-muted"><i class="fas fa-check"></i> All caught up</span>
                    `}
                </div>
                <div class="notif-dropdown-body" id="notif-items-list">
                    ${NOTIFICATIONS_DATA.map(item => {
                        const targetUrl = isUserFolder 
                            ? `../${item.target}/${item.target}.html` 
                            : `user/${item.target}/${item.target}.html`;
                        return `
                            <div class="notif-dropdown-item ${item.unread ? 'unread' : ''}" data-id="${item.id}">
                                <div class="notif-item-icon-box" style="${item.iconBg}">
                                    <i class="${item.icon} ${item.iconColor}"></i>
                                </div>
                                <div class="notif-item-content">
                                    <div class="notif-item-title">
                                        <span>${item.title}</span>
                                        ${item.unread ? '<span class="unread-dot" style="display:inline-block;width:7px;height:7px;background-color:var(--primary);border-radius:50%;"></span>' : ''}
                                    </div>
                                    <p class="notif-item-text">${item.message}</p>
                                    <div class="notif-item-footer">
                                        <span class="notif-item-time">${item.time}</span>
                                        <div class="flex items-center gap-2">
                                            <button type="button" class="btn-read-toggle" data-id="${item.id}" title="${item.unread ? 'Mark as read' : 'Mark as unread'}">
                                                <i class="fas ${item.unread ? 'fa-check' : 'fa-envelope'}"></i> ${item.unread ? 'Read' : 'Unread'}
                                            </button>
                                            <a href="${targetUrl}" class="text-xs text-primary font-medium" style="text-decoration:none;">View &rarr;</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="notif-dropdown-footer">
                    <a href="${allNotifUrl}" class="notif-view-all-link">
                        View All Activity Alerts <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;

            // Attach Mark all read click
            const markAllBtn = modal.querySelector('#notif-mark-all-btn');
            if (markAllBtn) {
                markAllBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    NOTIFICATIONS_DATA.forEach(n => n.unread = false);
                    renderNotifications();
                });
            }

            // Attach toggle read clicks
            modal.querySelectorAll('.btn-read-toggle').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = parseInt(btn.getAttribute('data-id'));
                    const item = NOTIFICATIONS_DATA.find(n => n.id === id);
                    if (item) {
                        item.unread = !item.unread;
                        renderNotifications();
                    }
                });
            });

            // Mark read on clicking the whole item
            modal.querySelectorAll('.notif-dropdown-item').forEach(itemEl => {
                itemEl.addEventListener('click', (e) => {
                    if (e.target.closest('.btn-read-toggle') || e.target.closest('a')) return;
                    const id = parseInt(itemEl.getAttribute('data-id'));
                    const item = NOTIFICATIONS_DATA.find(n => n.id === id);
                    if (item && item.unread) {
                        item.unread = false;
                        renderNotifications();
                    }
                });
            });
        }

        renderNotifications();

        if (notifBtn) {
            notifBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = modal.classList.contains('show');

                // Close any other open dropdowns
                document.querySelectorAll('.notif-dropdown-modal.show').forEach(m => {
                    if (m !== modal) m.classList.remove('show');
                });
                document.querySelectorAll('.notif-bell-btn.active').forEach(b => {
                    if (b !== notifBtn) b.classList.remove('active');
                });

                if (isOpen) {
                    modal.classList.remove('show');
                    notifBtn.classList.remove('active');
                } else {
                    modal.classList.add('show');
                    notifBtn.classList.add('active');
                }
            });
        }
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notif-dropdown-wrapper')) {
            document.querySelectorAll('.notif-dropdown-modal.show').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.notif-bell-btn.active').forEach(b => b.classList.remove('active'));
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.notif-dropdown-modal.show').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.notif-bell-btn.active').forEach(b => b.classList.remove('active'));
        }
    });
}

/**
 * ==========================================================================
 * Action Restriction Middleware (Mobile Verification Check)
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', function(e) {
        // Only intercept if we are not already on the profile/settings page trying to verify
        const currentUrl = window.location.href;
        if (currentUrl.includes('profile.html') || currentUrl.includes('settings.html') || currentUrl.includes('register.html') || currentUrl.includes('login.html')) {
            return;
        }

        const target = e.target.closest('a, button');
        if (!target) return;

        const href = target.getAttribute('href') || '';
        const text = (target.textContent || '').toLowerCase();
        
        // Mobile Verification Logic for Customers
        const isCustomerAction = href.includes('booking-details.html') || text.includes('accept quotation') || text.includes('book now');
        if (isCustomerAction && currentUrl.includes('/user/')) {
            const phoneVerified = localStorage.getItem('phoneVerified') === 'true';
            if (!phoneVerified) {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Mobile verification required. To continue with booking, please verify your mobile number. Click OK to go to your profile.')) {
                    window.location.href = '../profile/profile.html?verifyMobile=true';
                }
            }
        }

        // Mobile + KYC Logic for Providers
        const isProviderAction = (href.includes('quotations.html') && currentUrl.includes('/provider/requests')) || text.includes('submit quotation') || text.includes('start service') || text.includes('start investigation') || href.includes('submit-quotation.html') || href.includes('investigation-details.html');
        if (isProviderAction && currentUrl.includes('/provider/')) {
            const phoneVerified = localStorage.getItem('phoneVerified') === 'true';
            const kycApproved = localStorage.getItem('kycApproved') === 'true';
            
            /*
            if (!phoneVerified || !kycApproved) {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Mobile Verification and KYC Approval are required to perform this action. Click OK to go to your settings/verification.')) {
                    window.location.href = '../settings/settings.html?verifyMobile=true';
                }
            }
            */
        }
    }, true);
});

