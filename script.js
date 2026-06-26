document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Custom Cursor Mouse Tracking
    // ==========================================
    const cursorRing = document.getElementById('cursorRing');
    const cursorDot = document.getElementById('cursorDot');
    
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for center dot
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        
        // Add class to body once mouse moves (to prevent sudden cursor appearing at 0,0)
        if (!document.body.classList.contains('cursor-ready')) {
            document.body.classList.add('cursor-ready');
        }
    });

    // Custom animate ring with a slight delay (interpolation)
    function animateCursorRing() {
        const easing = 0.15; // smooth factor
        ringX += (mouseX - ringX) * easing;
        ringY += (mouseY - ringY) * easing;
        
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Toggle larger ring state when hovering interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .channel-row');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('is-link'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-link'));
    });

    // Hide cursor when mouse leaves the document window
    document.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-ready');
    });
    document.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-ready');
    });

    // ==========================================
    // 2. Mobile Drawer Navigation Toggle
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
            
            // Toggle icon inside button
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // ==========================================
    // 3. Scroll Reveal Intersection Observer
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // stop observing once revealed
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 4. Navbar active state & background changes
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Shrink & blur navbar on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust threshold trigger
            if (scrollY >= (sectionTop - 160)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 5. Smooth scroll with navbar offset
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight + 10,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 6. Initialize Lucide Icons
    // ==========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
