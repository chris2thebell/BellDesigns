// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (mobileMenuToggle && navLinks) {
        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            
            // Update aria-expanded attribute
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle active class on nav links
            navLinks.classList.toggle('active');
            
            // Toggle body scroll lock
            body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                // Close menu
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            const isMenuOpen = navLinks.classList.contains('active');
            
            if (isMenuOpen && !isClickInsideNav && !isClickOnToggle) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
        
        // Close menu on window resize if it's larger than mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
});

