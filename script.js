// ========================================
// PORTFOLIO DATA ANALYST - JAVASCRIPT
// Assia Kamoune | Interactions & Animations
// ========================================

// ========== VARIABLES GLOBALES ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// ========== MENU HAMBURGER MOBILE ==========
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Fermer menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ========== SMOOTH SCROLL OFFSET ==========
// Compense la hauteur de la navbar fixe
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== ACTIVE NAV LINK SUR SCROLL ==========
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// ========== FORMULAIRE CONTACT ==========
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validation simple
    if (!data.name || !data.email || !data.subject || !data.message) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }

    // Simuler l'envoi du formulaire
    // En production, vous enverriez les données à un serveur
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    // Simuler délai serveur (2 secondes)
    setTimeout(() => {
        // Créer un lien mailto comme fallback
        const mailtoLink = `mailto:assia.kamoune@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Nom: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)}`;
        
        window.location.href = mailtoLink;
        
        // Réinitialiser le formulaire
        contactForm.reset();
        submitBtn.textContent = '✓ Message envoyé !';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }, 500);
});

// ========== ANIMATIONS AU SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.querySelectorAll('.project-card, .skill-category, .doc-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ========== COMPTEUR DE COMPÉTENCES ==========
const skillBars = document.querySelectorAll('.skill-fill');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
            bar.style.width = targetWidth;
        }, 100);
    });
};

// Déclencher l'animation au scroll vers la section compétences
const skillsSection = document.getElementById('competences');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            animateSkillBars();
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.3 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ========== COPIE EMAIL AU CLIC ==========
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Permettre le comportement par défaut (ouvre client email)
        // Mais on pourrait aussi implémenter une copie au presse-papiers
    });
});

// ========== ANIMATION LOADER PAGE ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Ajouter une petite animation au chargement
window.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.animation = 'fadeIn 0.8s ease-in-out';
    }
});

// ========== GESTION DES CLICS EXTERNES ==========
document.addEventListener('click', (e) => {
    const isClickInsideNav = navMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ========== PRÉFÉRENCE RÉDUCTION MOUVEMENT ==========
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    document.documentElement.style.setProperty('--transition-fast', '0ms');
}

// ========== DÉTECTION THÈME SOMBRE ==========
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

function updateTheme(darkMode) {
    if (darkMode.matches) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
}

darkModeQuery.addEventListener('change', updateTheme);
updateTheme(darkModeQuery);

// ========== CONSOLE MESSAGE ==========
console.log('%cBienvenue sur le Portfolio d\'Assia Kamoune', 'font-size: 16px; color: #0066FF; font-weight: bold;');
console.log('%cData Analyst | Business Intelligence Specialist', 'font-size: 14px; color: #666;');
console.log('%nPour plus d\'infos : assia.kamoune@gmail.com', 'color: #0066FF;');

// ========== LAZY LOADING IMAGES ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== EXPORT EN PDF ==========
function exporterEnPDF() {
    // Note: Nécessite une librairie comme html2pdf ou jsPDF
    // Exemple simplifié :
    alert('Fonctionnalité d\'export PDF disponible en utilisant une librairie tierce');
}

// ========== PARTAGE RÉSEAUX SOCIAUX ==========
function partagerSurLinkedIn() {
    const url = window.location.href;
    const title = 'Portfolio Data Analyst - Assia Kamoune';
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');
}

function partagerSurGitHub() {
    window.open('https://github.com/assiakamoune-coder/portfolio', '_blank');
}

// ========== GESTION DES ERREURS GLOBALES ==========
window.addEventListener('error', (event) => {
    console.error('Erreur détectée:', event.message);
});

// ========== PERFORMANCE MONITORING ==========
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Temps de chargement page: ${pageLoadTime}ms`);
});

// ========== FONCTION UTILITAIRE: DEBOUNCE ==========
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ========== FONCTION UTILITAIRE: THROTTLE ==========
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Exemple d'utilisation du throttle sur scroll
window.addEventListener('scroll', throttle(() => {
    // Code optimisé pour scroll
}, 100));

// ========== CLASSE POUR ANIMATIONS AVANCÉES ==========
class AnimationController {
    constructor() {
        this.animations = new Map();
    }

    register(elementSelector, animationName) {
        const element = document.querySelector(elementSelector);
        if (element) {
            this.animations.set(elementSelector, {
                element,
                name: animationName,
                playing: false
            });
        }
    }

    play(elementSelector) {
        const anim = this.animations.get(elementSelector);
        if (anim && !anim.playing) {
            anim.element.style.animation = `${anim.name} 0.6s ease-in-out`;
            anim.playing = true;
        }
    }

    reset(elementSelector) {
        const anim = this.animations.get(elementSelector);
        if (anim) {
            anim.element.style.animation = 'none';
            anim.playing = false;
        }
    }
}

const animController = new AnimationController();

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio chargé avec succès!');
    
    // Ajouter les animations initiales
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transition = 'opacity 0.6s ease-in-out';
        }, 100);
    });
});

// ========== ÉTAT LOCAL UTILISATEUR ==========
// Sauvegarde les préférences utilisateur
const userPreferences = {
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'fr',
    
    save() {
        localStorage.setItem('theme', this.theme);
        localStorage.setItem('language', this.language);
    },
    
    load() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.language = localStorage.getItem('language') || 'fr';
    }
};

userPreferences.load();

// ========== SERVICE WORKER (OPTIONAL) ==========
// Pour mode offline / PWA
if ('serviceWorker' in navigator) {
    // Uncomment si vous avez un service worker
    // navigator.serviceWorker.register('sw.js')
    //     .then(reg => console.log('Service Worker enregistré'))
    //     .catch(err => console.log('Erreur Service Worker:', err));
}

console.log('✓ Tous les scripts chargés avec succès!');
