/* ============================================
   VALENTINE'S WEBSITE - INTERACTIVE JAVASCRIPT
   For Najmah Auliya from Dennis
   ============================================ */

// ---- Wait for DOM ----
document.addEventListener('DOMContentLoaded', () => {
    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                initAll();
            }, 800);
        }, 1500);
    });

    // Fallback if load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                initAll();
            }, 800);
        }, 1500);
    }
});

function initAll() {
    initHeartsCanvas();
    initScrollProgress();
    initNavDots();
    initMusicPlayer();
    initEnvelope();
    init3DCarousel();
    initPhotoGrid();
    initTiltCards();
    initScrollAnimations();
    initPhotoViewer();
    initFloatingPhotosParallax();
    initSparkleTrail();
}

/* ============================================
   HEARTS CANVAS - Floating Hearts Particles
   ============================================ */
function initHeartsCanvas() {
    const canvas = document.getElementById('heartsCanvas');
    const ctx = canvas.getContext('2d');
    let hearts = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Heart {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 14 + 6;
            this.speedY = Math.random() * 1.2 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.color = `hsla(${340 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%, ${this.opacity})`;
        }
        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.rotation += this.rotationSpeed;
            if (this.y < -30) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.size / 20, this.size / 20);
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.bezierCurveTo(-10, -15, -20, -5, 0, 10);
            ctx.moveTo(0, -5);
            ctx.bezierCurveTo(10, -15, 20, -5, 0, 10);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
        }
    }

    // Create hearts
    const heartCount = Math.min(35, Math.floor(window.innerWidth / 40));
    for (let i = 0; i < heartCount; i++) {
        const h = new Heart();
        h.y = Math.random() * canvas.height;
        hearts.push(h);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(h => {
            h.update();
            h.draw();
        });
        animationId = requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + '%';
    });
}

/* ============================================
   NAVIGATION DOTS
   ============================================ */
function initNavDots() {
    const dots = document.querySelectorAll('.dot');
    const sections = ['hero', 'letter', 'gallery', 'promise'];

    function updateDots() {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        sections.forEach((id, index) => {
            const section = document.getElementById(id);
            if (!section) return;
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                dots.forEach(d => d.classList.remove('active'));
                dots[index]?.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateDots);
    updateDots();
}

/* ============================================
   MUSIC PLAYER
   ============================================ */
function initMusicPlayer() {
    const toggle = document.getElementById('musicToggle');
    const audio = document.getElementById('bgMusic');
    let isPlaying = false;

    toggle.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            toggle.classList.remove('playing');
        } else {
            audio.volume = 0.4;
            audio.play().catch(() => {});
            toggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // Try autoplay on first user interaction
    const autoPlayOnce = () => {
        if (!isPlaying) {
            audio.volume = 0.4;
            audio.play().then(() => {
                isPlaying = true;
                toggle.classList.add('playing');
            }).catch(() => {});
        }
        document.removeEventListener('click', autoPlayOnce);
        document.removeEventListener('touchstart', autoPlayOnce);
        document.removeEventListener('scroll', autoPlayOnce);
    };
    document.addEventListener('click', autoPlayOnce);
    document.addEventListener('touchstart', autoPlayOnce);
    document.addEventListener('scroll', autoPlayOnce);
}

/* ============================================
   ENVELOPE INTERACTION
   ============================================ */
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    if (!envelope) return;

    envelope.addEventListener('click', () => {
        envelope.classList.toggle('opened');
    });
}

/* ============================================
   3D CAROUSEL
   ============================================ */
function init3DCarousel() {
    const carousel = document.getElementById('carousel3D');
    const cards = carousel.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = document.querySelectorAll('.indicator');
    const totalCards = cards.length;
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let autoRotateInterval;

    function updateCarousel(animate = true) {
        const angleStep = 360 / totalCards;
        const radius = 380;

        cards.forEach((card, i) => {
            const angle = ((i - currentIndex) * angleStep) * (Math.PI / 180);
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius - radius;
            const rotateY = (i - currentIndex) * angleStep;
            const scale = z > -radius ? 0.7 + (0.3 * (z + radius) / radius) : 0.7;
            const opacity = z > -radius * 1.2 ? 0.4 + (0.6 * (z + radius) / radius) : 0.3;

            card.style.transition = animate ? 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${Math.max(scale, 0.6)})`;
            card.style.opacity = Math.max(opacity, 0.3);
            card.style.zIndex = Math.round((z + radius) * 10);
            card.style.pointerEvents = i === currentIndex ? 'auto' : 'none';
        });

        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    }

    function goTo(index) {
        currentIndex = ((index % totalCards) + totalCards) % totalCards;
        updateCarousel();
    }

    function next() {
        goTo(currentIndex + 1);
    }

    function prev() {
        goTo(currentIndex - 1);
    }

    prevBtn.addEventListener('click', () => { prev(); resetAutoRotate(); });
    nextBtn.addEventListener('click', () => { next(); resetAutoRotate(); });

    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => { goTo(i); resetAutoRotate(); });
    });

    // Touch / Drag support
    const container = document.querySelector('.carousel-container');
    
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        container.style.cursor = 'grabbing';
    });
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
    });
    container.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
        if (Math.abs(currentX) > 50) {
            currentX > 0 ? prev() : next();
        }
        currentX = 0;
        resetAutoRotate();
    });

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    container.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX - startX;
    });
    container.addEventListener('touchend', () => {
        if (Math.abs(currentX) > 50) {
            currentX > 0 ? prev() : next();
        }
        currentX = 0;
        resetAutoRotate();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prev(); resetAutoRotate(); }
        if (e.key === 'ArrowRight') { next(); resetAutoRotate(); }
    });

    // Auto rotate
    function startAutoRotate() {
        autoRotateInterval = setInterval(next, 4000);
    }
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    updateCarousel(false);
    startAutoRotate();
}

/* ============================================
   PHOTO GRID - Click to open viewer
   ============================================ */
function initPhotoGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) openViewer(img.src);
        });
    });
}

/* ============================================
   3D TILT EFFECT ON CARDS
   ============================================ */
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Move shine
            const shine = card.querySelector('.grid-shine');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`;
                shine.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
            const shine = card.querySelector('.grid-shine');
            if (shine) shine.style.opacity = '0';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Stagger children animation for promise text
                if (entry.target.classList.contains('promise-content')) {
                    const promiseTexts = entry.target.querySelectorAll('.promise-text p');
                    promiseTexts.forEach((p, i) => {
                        setTimeout(() => p.classList.add('visible'), i * 200);
                    });
                    const signature = entry.target.querySelector('.promise-signature');
                    if (signature) {
                        setTimeout(() => signature.classList.add('visible'), promiseTexts.length * 200 + 300);
                    }
                    const frame = entry.target.querySelector('.final-photo-frame');
                    if (frame) {
                        setTimeout(() => frame.classList.add('visible'), promiseTexts.length * 200 + 600);
                    }
                    const title = entry.target.querySelector('.promise-title');
                    if (title) title.classList.add('visible');
                }
            }
        });
    }, observerOptions);

    // Observe all elements that need animation
    document.querySelectorAll('.section-tag, .section-title').forEach(el => observer.observe(el));
    document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
    document.querySelectorAll('.photo-grid').forEach(el => observer.observe(el));
    document.querySelectorAll('.promise-content').forEach(el => observer.observe(el));
}

/* ============================================
   FULLSCREEN PHOTO VIEWER
   ============================================ */
const allPhotos = [
    'asset/foto/denis.jpeg',
    'asset/foto/denis1.jpeg',
    'asset/foto/denis2.jpeg',
    'asset/foto/denis3.jpeg',
    'asset/foto/denis4.jpeg',
    'asset/foto/denis5.jpeg',
    'asset/foto/denis6.jpeg',
    'asset/foto/denis7.jpeg'
];
let viewerIndex = 0;

function openViewer(src) {
    const viewer = document.getElementById('photoViewer');
    const img = document.getElementById('viewerImg');
    viewerIndex = allPhotos.findIndex(p => src.includes(p.split('/').pop()));
    if (viewerIndex === -1) viewerIndex = 0;
    img.src = allPhotos[viewerIndex];
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeViewer() {
    const viewer = document.getElementById('photoViewer');
    viewer.classList.remove('active');
    document.body.style.overflow = '';
}

function initPhotoViewer() {
    const viewer = document.getElementById('photoViewer');
    const closeBtn = document.getElementById('viewerClose');
    const prevBtn = document.getElementById('viewerPrev');
    const nextBtn = document.getElementById('viewerNext');
    const img = document.getElementById('viewerImg');

    closeBtn.addEventListener('click', closeViewer);
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) closeViewer();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewerIndex = (viewerIndex - 1 + allPhotos.length) % allPhotos.length;
        img.src = allPhotos[viewerIndex];
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewerIndex = (viewerIndex + 1) % allPhotos.length;
        img.src = allPhotos[viewerIndex];
    });

    document.addEventListener('keydown', (e) => {
        if (!viewer.classList.contains('active')) return;
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowLeft') {
            viewerIndex = (viewerIndex - 1 + allPhotos.length) % allPhotos.length;
            img.src = allPhotos[viewerIndex];
        }
        if (e.key === 'ArrowRight') {
            viewerIndex = (viewerIndex + 1) % allPhotos.length;
            img.src = allPhotos[viewerIndex];
        }
    });

    // Also allow carousel cards to open viewer
    document.querySelectorAll('.carousel-card').forEach(card => {
        card.addEventListener('click', () => {
            const cardImg = card.querySelector('img');
            if (cardImg) openViewer(cardImg.src);
        });
    });
}

/* ============================================
   FLOATING PHOTOS PARALLAX (Hero)
   ============================================ */
function initFloatingPhotosParallax() {
    const photos = document.querySelectorAll('.floating-photo');
    
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        photos.forEach(photo => {
            const speed = parseFloat(photo.dataset.speed) || 1;
            const moveX = x * speed * 15;
            const moveY = y * speed * 15;
            const rotate = photo.classList.contains('fp1') ? -12 :
                           photo.classList.contains('fp2') ? 8 :
                           photo.classList.contains('fp3') ? 6 : -8;
            photo.style.transform = `rotate(${rotate}deg) translate(${moveX}px, ${moveY}px)`;
        });
    });
}

/* ============================================
   SPARKLE CURSOR TRAIL
   ============================================ */
function initSparkleTrail() {
    let lastSparkle = 0;
    const throttle = 60; // ms between sparkles

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkle < throttle) return;
        lastSparkle = now;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.width = (Math.random() * 4 + 3) + 'px';
        sparkle.style.height = sparkle.style.width;

        const colors = ['#ff6b9d', '#f8a5c2', '#ffcccc', '#c44569', '#f0c27f'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.boxShadow = `0 0 6px ${sparkle.style.background}`;

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    });
}
