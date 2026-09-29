/**
 * IAFácil - Archivo principal de JavaScript
 * Inteligencia Artificial explicada de forma sencilla
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 2. Reading Progress Bar
    const progressBar = document.getElementById('reading-progress');
    const article = document.querySelector('.article-content');

    if (progressBar && article) {
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const maxScroll = documentHeight - windowHeight;
            const progress = (scrollTop / maxScroll) * 100;
            
            progressBar.style.width = `${progress}%`;
        });
    }

    // 3. Smooth Scroll for Anchor Links
    const header = document.querySelector('.site-header');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Cerrar menú móvil si está abierto al hacer clic en un enlace
                if (navMenu && navMenu.classList.contains('active')) {
                    menuToggle.click();
                }

                const headerHeight = header ? header.offsetHeight : 0;
                const offset = headerHeight + 20;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Cookie Consent
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'block'; // Asumimos que inicialmente puede estar oculto por CSS o lo mostramos
        } else {
            cookieBanner.style.display = 'none';
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // 5. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 6. Sticky Header
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 7. Active Nav Link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        // Solo marcar si coincide exactamente o si es la raíz y estamos en la raíz (ajustar según ruteo real)
        if (currentPath === linkPath || (currentPath === '/' && linkPath.endsWith('index.html'))) {
            link.classList.add('active');
        }
    });

    // 8. TOC Auto-generation
    const tocContainer = document.getElementById('toc');
    
    if (tocContainer && article) {
        const headings = article.querySelectorAll('h2, h3');
        if (headings.length > 0) {
            const tocList = document.createElement('ul');
            
            headings.forEach((heading, index) => {
                // Generar ID si no tiene
                if (!heading.id) {
                    const idText = heading.textContent.trim().toLowerCase().replace(/[\s\W-]+/g, '-');
                    heading.id = `${idText}-${index}`;
                }

                const li = document.createElement('li');
                li.className = `toc-${heading.tagName.toLowerCase()}`;
                
                const a = document.createElement('a');
                a.href = `#${heading.id}`;
                a.textContent = heading.textContent;
                
                li.appendChild(a);
                tocList.appendChild(li);
            });
            
            tocContainer.appendChild(tocList);
        } else {
            // Ocultar TOC si no hay encabezados
            tocContainer.style.display = 'none';
        }
    }

    // 9. Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback si no hay IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // 10. Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simular envío
            const successMsg = document.createElement('div');
            successMsg.className = 'newsletter-success';
            successMsg.innerHTML = '<p>¡Gracias por suscribirte a IAFácil! Revisa tu bandeja de entrada.</p>';
            
            newsletterForm.parentNode.replaceChild(successMsg, newsletterForm);
        });
    }

    // 11. Copy Code Buttons
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(pre => {
        const code = pre.querySelector('code');
        if (code) {
            // Contenedor relativo para el botón si no lo hay
            pre.style.position = 'relative';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.textContent = 'Copiar';
            
            pre.appendChild(copyBtn);
            
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(code.innerText);
                    copyBtn.textContent = '¡Copiado!';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.textContent = 'Copiar';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Error al copiar el código: ', err);
                    copyBtn.textContent = 'Error';
                }
            });
        }
    });

    // 12. Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Comprobar preferencia guardada
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDarkMode = body.classList.contains('dark-mode');
            
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Si el botón tiene un icono que cambiar, se podría hacer aquí
            // Ejemplo asumiendo que el interior cambia:
            // themeToggle.innerHTML = isDarkMode ? 'Icono Sol' : 'Icono Luna';
        });
    }

    // 13. Scroll-triggered Animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Opcional: dejar de observar una vez animado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Disparar cuando el 10% del elemento sea visible
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    } else {
        animatedElements.forEach(el => {
            el.classList.add('animate-in');
        });
    }
});
