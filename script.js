document.addEventListener('DOMContentLoaded', () => {
    
    // --- MENU RESPONSIVE ACCORDION ---
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-links');

    menu.addEventListener('click', () => {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });

    // Fermer le menu mobile en cliquant sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('is-active');
            menuLinks.classList.remove('active');
        });
    });

    // --- INTERACTION: EFFET AU SCROLL SUR LES LIENS DE NAV ---
    const sections = document.querySelectorAll('section, header');
    const navLi = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- ANIMATION DYNAMIQUE DES SKILLS BARS AU SCROLL ---
    const skillsSection = document.querySelector('#profil');
    const progressLines = document.querySelectorAll('.progress-line span');

    // On initialise la largeur à 0 en attendant le scroll
    progressLines.forEach(line => {
        line.style.width = '0';
    });

    const animateSkills = () => {
        progressLines.forEach(line => {
            const parent = line.parentElement;
            const targetWidth = parent.getAttribute('data-percent');
            line.style.width = targetWidth;
        });
    };

    // Observer pour déclencher l'animation dès que la section Profil apparaît
    const observerOptions = {
        root: null,
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target); // Lance l'animation une seule fois
            }
        });
    }, observerOptions);

    if(skillsSection) {
        observer.observe(skillsSection);
    }
});