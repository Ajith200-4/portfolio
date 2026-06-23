/* ==========================================================================
   PORTFOLIO SCRIPTS - AJITH B
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initMobileNav();
    initCanvasParticles();
    initScrollAnimations();
    initContactForm();
    initResumePrint();
});

/* ==========================================================================
   1. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const words = [
        "AI & Machine Learning Engineer",
        "Python Developer",
        "Android & VR Enthusiast"
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 150;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            delay = 50; // Faster deleting speed
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            delay = 120; // Normal typing speed
        }

        // If completed writing a word
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            delay = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500; // Pause before typing next word
        }

        setTimeout(type, delay);
    }

    // Start typewriter
    setTimeout(type, 1000);
}

/* ==========================================================================
   2. MOBILE NAVIGATION HAMBURGER DRAWER
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    if (!toggleBtn || !navbar) return;

    // Toggle menu visibility
    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    // Add scroll class to header for blur/shadow adjustment on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.padding = '0';
            header.style.boxShadow = 'none';
        }
    });
}

/* ==========================================================================
   3. DYNAMIC CANVAS NEURON CONNECTIONS ANIMATION
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 65;
    const connectionDistance = 110;
    
    // Set colors from stylesheet variable values
    const cyanColor = '0, 242, 254';
    const purpleColor = '178, 36, 239';

    // Handle screen resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle blueprint
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            // Half particle cyan, half purple
            this.color = Math.random() > 0.5 ? cyanColor : purpleColor;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, 0.6)`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connect particles
    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    // Fade connection lines as they grow further apart
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    // Line color based on first particle color
                    ctx.strokeStyle = `rgba(${particles[i].color}, ${opacity * 0.12})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connect();
        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   4. SCROLL INTERSECTION OBSERVER (FADE-IN EFFECT & ACTIVE LINKS)
   ========================================================================== */
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    // Intersection observer for section activations (Highlight active link in header)
    const options = {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px"
    };

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });

    // Intersection observer for triggering skill bars animation
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 100);
                    });
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, { threshold: 0.15 });

        skillsObserver.observe(skillsSection);
    }

    // Back to Top button listener
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        });

        // Initialize display state
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease, background 0.3s ease';
    }
}

/* ==========================================================================
   5. CONTACT FORM INTERCEPTOR & FEEDBACK TOASTS
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('form-toast');

    if (!form || !toast) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const messageInput = document.getElementById('form-message');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Simple Validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showToast("Please fill out all fields before sending.", "error");
            return;
        }

        // Show mock loading state
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`, "success");
            
            // Reset fields
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }, 1500);
    });

    function showToast(message, type) {
        toast.textContent = message;
        toast.className = `form-toast ${type}`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.style.display = 'none';
            toast.className = 'form-toast';
        }, 5000);
    }
}

/* ==========================================================================
   6. RESUME PRINT TRIGGERS (PDF EXPORT CONTROLLER)
   ========================================================================== */
function initResumePrint() {
    const printBtn = document.getElementById('print-resume-btn');
    if (!printBtn) return;

    printBtn.addEventListener('click', () => {
        window.print();
    });
}
