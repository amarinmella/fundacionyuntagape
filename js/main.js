document.addEventListener('DOMContentLoaded', () => {
    // ─── 1. GESTIÓN DEL MODO OSCURO (DARK MODE) ───
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Función para aplicar el tema correcto
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<span class="material-symbols-outlined text-yellow-400">light_mode</span>';
            }
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<span class="material-symbols-outlined text-slate-700">dark_mode</span>';
            }
        }
    };

    // Inicializar el tema basado en localStorage o en la preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // Escuchador de clic para alternar el tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // ─── 2. MENÚ MÓVIL CENTRALIZADO ───
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        // Remover el atributo onclick inline si existiera para evitar doble ejecución
        mobileMenuBtn.removeAttribute('onclick');
        
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Cerrar el menú si se hace clic fuera de él
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // ─── 3. ANIMACIONES DE SCROLL (REVEAL) ───
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Dejar de observar el elemento una vez que se ha mostrado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px' // Se activa un poco antes de llegar al borde inferior
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ─── 4. ACTUALIZACIÓN AUTOMÁTICA DEL AÑO DE COPYRIGHT ───
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ─── 5. ENVÍO DE FORMULARIO DE CONTACTO (FORMSUBMIT VIA AJAX) ───
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-msg');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Estado de carga
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Enviando...</span>
            `;
            
            const formData = new FormData(contactForm);
            
            fetch('https://formsubmit.co/ajax/contacto@yuntagape.cl', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    if (successMsg) {
                        successMsg.classList.remove('hidden');
                        setTimeout(() => successMsg.classList.add('hidden'), 6000);
                    }
                    contactForm.reset();
                } else {
                    alert('Hubo un problema al enviar tu mensaje. Por favor, vuelve a intentarlo.');
                }
            })
            .catch(error => {
                console.error('Error al enviar formulario:', error);
                alert('Hubo un problema de conexión. Por favor, verifica tu red e inténtalo de nuevo.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
});
