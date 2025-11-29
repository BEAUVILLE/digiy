// DIGIYLYFE - JavaScript Interactif

// Smooth scroll pour liens internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar transparence au scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
    }
});

// Animation au scroll (fade in)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Appliquer animation aux sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Mobile menu toggle
const createMobileMenu = () => {
    const nav = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar .container');
    
    // Créer bouton burger si pas déjà créé
    if (!document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: var(--gold-primary);
            font-size: 2rem;
            cursor: pointer;
            padding: 0.5rem;
        `;
        
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        navbar.appendChild(menuToggle);
        
        // Style mobile menu
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .menu-toggle {
                    display: block !important;
                }
                .nav-menu {
                    position: fixed;
                    top: 70px;
                    right: -100%;
                    width: 80%;
                    max-width: 300px;
                    background: var(--black-card);
                    flex-direction: column;
                    padding: 2rem;
                    transition: right 0.3s ease;
                    box-shadow: -5px 0 15px rgba(0,0,0,0.5);
                    z-index: 999;
                }
                .nav-menu.active {
                    right: 0;
                }
                .nav-menu li {
                    margin: 1rem 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialiser mobile menu
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Réinitialiser au resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
});

// Compteur animé (pour stats)
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Observer pour démarrer compteurs quand visibles
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            entry.target.dataset.counted = 'true';
        }
    });
}, { threshold: 0.5 });

// Appliquer aux éléments avec class 'counter'
document.querySelectorAll('[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});

// Formulaire de contact simple
const handleContactForm = (form) => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Ici tu peux ajouter l'envoi vers ton backend
        console.log('Form data:', data);
        
        // Feedback utilisateur
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = '✅ Envoyé !';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            form.reset();
        }, 3000);
    });
};

// Appliquer aux formulaires
document.querySelectorAll('form').forEach(handleContactForm);

// Track liens externes (analytics)
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = e.currentTarget.href;
        console.log('External link clicked:', href);
        // Ici tu peux ajouter Google Analytics ou autre
    });
});

// UTM parameters handling
const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        source: params.get('utm_source'),
        medium: params.get('utm_medium'),
        campaign: params.get('utm_campaign')
    };
};

// Ajouter UTM params aux liens de signup
const utmParams = getUTMParams();
if (utmParams.source) {
    document.querySelectorAll('a[href*="signup"]').forEach(link => {
        const url = new URL(link.href);
        Object.entries(utmParams).forEach(([key, value]) => {
            if (value) url.searchParams.set(`utm_${key}`, value);
        });
        link.href = url.toString();
    });
}

// Lazy loading images (si tu en ajoutes)
if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img').forEach(img => {
        img.loading = 'lazy';
    });
}

// Tooltip simple
const createTooltip = () => {
    const style = document.createElement('style');
    style.textContent = `
        [data-tooltip] {
            position: relative;
            cursor: help;
        }
        [data-tooltip]:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.5rem 1rem;
            background: var(--black-card);
            color: var(--gold-primary);
            border: 1px solid var(--gold-primary);
            border-radius: 8px;
            white-space: nowrap;
            z-index: 1000;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
};

createTooltip();

// Copy to clipboard
const copyToClipboard = (text, button) => {
    navigator.clipboard.writeText(text).then(() => {
        const original = button.textContent;
        button.textContent = '✅ Copié !';
        setTimeout(() => {
            button.textContent = original;
        }, 2000);
    });
};

// Appliquer aux boutons copy
document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', () => {
        const text = button.dataset.copy;
        copyToClipboard(text, button);
    });
});

// Console branding
console.log('%c∞ DIGIYLYFE', 'font-size: 3rem; color: #D4AF37; font-weight: bold;');
console.log('%c0% commission • ∞ possibilités', 'font-size: 1rem; color: #999;');

// Log page view (pour analytics)
console.log('Page:', window.location.pathname);
console.log('UTM:', getUTMParams());
