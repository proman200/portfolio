document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initSkillBars();
    initStatCounters();
    initProjectCards();
    initFormValidation();
    initSectionReveal();
    initMagnetEffect();
    initGlitchEffect();
    initMobileMenu();
    initImageRefresh();
});

function initImageRefresh() {
    const avatar = document.getElementById('random-avatar');
    const projectImages = document.querySelectorAll('.project-image img');
    
    if (avatar) {
        avatar.addEventListener('click', () => {
            const timestamp = new Date().getTime();
            avatar.src = `https://picsum.photos/seed/proman${timestamp}/400/400`;
        });
        
        avatar.style.cursor = 'pointer';
        avatar.title = 'Click to change image';
    }
    
    projectImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            const timestamp = new Date().getTime();
            img.src = `https://picsum.photos/seed/proj${index + 1}${timestamp}/400/250`;
        });
        
        img.style.cursor = 'pointer';
        img.title = 'Click to change image';
    });
}

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scroll');
        } else {
            navbar.classList.remove('scroll');
        }
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
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
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

function initSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = `${progress}%`;
            }
        });
    }, { threshold: 0.5 });
    
    skillProgressBars.forEach(bar => {
        observer.observe(bar);
    });
}

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.querySelector('.project-inner').style.transform = 
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.project-inner').style.transform = 'rotateY(0)';
        });
    });
}

function initFormValidation() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btnSubmit = form.querySelector('.btn-submit');
        const originalContent = btnSubmit.innerHTML;
        
        btnSubmit.innerHTML = '<span>Sending...</span>';
        btnSubmit.style.background = 'linear-gradient(90deg, #00ff88, #00ff00)';
        
        setTimeout(() => {
            btnSubmit.innerHTML = '<span>Message Sent!</span> <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            btnSubmit.style.background = 'linear-gradient(90deg, #00ff88, #00ff00)';
            
            form.reset();
            
            setTimeout(() => {
                btnSubmit.innerHTML = originalContent;
                btnSubmit.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
            }, 3000);
        }, 1500);
    });
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

function initSectionReveal() {
    const sections = document.querySelectorAll('.about, .skills, .projects, .contact');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
}

function initMagnetEffect() {
    const letters = document.querySelectorAll('.name .letter');
    
    letters.forEach(letter => {
        letter.addEventListener('mousemove', (e) => {
            const rect = letter.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            letter.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        letter.addEventListener('mouseleave', () => {
            letter.style.transform = 'translate(0, 0)';
        });
    });
}

function initGlitchEffect() {
    const name = document.querySelector('.name');
    
    name.addEventListener('mouseenter', () => {
        letters = name.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.textShadow = '2px 0 #ff00aa, -2px 0 #00f0ff';
                setTimeout(() => {
                    letter.style.textShadow = 'none';
                }, 100);
            }, index * 50);
        });
    });
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

const style = document.createElement('style');
style.textContent = `
    .section-hidden {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    .section-hidden.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    .focused {
        transform: scale(1.02);
    }
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            background: rgba(10, 10, 15, 0.98);
            flex-direction: column;
            padding: 20px;
            gap: 20px;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
        }
        .nav-links.active {
            transform: translateY(0);
            opacity: 1;
        }
        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    }
`;
document.head.appendChild(style);