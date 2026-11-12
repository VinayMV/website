// Scroll reveal animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

function limitWordsAndChars(field, maxWords, maxChars) {
    const words = field.value.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const charCount = field.value.length;
    const counter = field.nextElementSibling;
    counter.textContent = wordCount + ' / ' + maxWords + ' words, ' + charCount + ' / ' + maxChars + ' characters';

    if (wordCount >= maxWords) {
        counter.style.color = '#ff4a4a';
        const trimmed = words.slice(0, maxWords).join(' ');
        field.value = trimmed;
    } else if (charCount >= maxChars - 50) {
        // Warning when approaching character limit
        counter.style.color = '#ffa500';
    } else {
        counter.style.color = 'var(--text-tertiary)';
    }
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// Auto-hide project detail sections whose media isn't ready yet.
// Each <img> in .screenshot has onerror that removes its wrapper.
// After all images have resolved, empty galleries or empty embed containers
// cause their whole enclosing <section class="project-section"> to be hidden.
window.addEventListener('load', function () {
    document.querySelectorAll('.screenshot-gallery').forEach(function (gallery) {
        if (gallery.children.length === 0) {
            var section = gallery.closest('.project-section');
            if (section) section.style.display = 'none';
        }
    });
    document.querySelectorAll('.embed-container').forEach(function (container) {
        if (!container.querySelector('iframe')) {
            var section = container.closest('.project-section');
            if (section) section.style.display = 'none';
        }
    });
});

// Mobile navigation toggle
(function () {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('nav-links');
    if (!toggle || !links) return;
    function setOpen(open) {
        links.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.addEventListener('click', function () {
        setOpen(!links.classList.contains('open'));
    });
    links.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });
})();

var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Typing effect in the hero label
(function () {
    var el = document.querySelector('.typed');
    if (!el || reducedMotion) {
        var c = document.querySelector('.typed-cursor');
        if (c) c.style.display = 'none';
        return;
    }
    var words = el.dataset.words.split('|');
    var w = 0, i = el.textContent.length, deleting = false;
    function tick() {
        var word = words[w];
        if (!deleting && i === word.length) {
            deleting = true;
            return setTimeout(tick, 1800);
        }
        if (deleting && i === 0) {
            deleting = false;
            w = (w + 1) % words.length;
        }
        i += deleting ? -1 : 1;
        el.textContent = words[w].slice(0, i);
        setTimeout(tick, deleting ? 40 : 80);
    }
    setTimeout(function () { deleting = true; tick(); }, 2000);
})();

// Page-wide particle network (fixed behind all content)
(function () {
    var canvas = document.querySelector('.bg-canvas');
    if (!canvas || reducedMotion) return;
    var ctx = canvas.getContext('2d');
    var pts = [], w = 0, h = 0, dpr = 1;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 130;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var n = Math.min(90, Math.round(w * h / 14000));
        pts = [];
        for (var k = 0; k < n; k++) {
            pts.push({ x: Math.random() * w, y: Math.random() * h,
                       vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 });
        }
    }

    function frame() {
        ctx.clearRect(0, 0, w, h);
        for (var a = 0; a < pts.length; a++) {
            var p = pts[a];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.fillStyle = 'rgba(74,158,255,0.55)';
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.2832); ctx.fill();
            for (var b = a + 1; b < pts.length; b++) {
                var q = pts[b], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
                if (d < LINK) {
                    ctx.strokeStyle = 'rgba(74,158,255,' + (0.18 * (1 - d / LINK)) + ')';
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                }
            }
            var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
            if (md < 160) {
                ctx.strokeStyle = 'rgba(74,158,255,' + (0.45 * (1 - md / 160)) + ')';
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            }
        }
        requestAnimationFrame(frame);
    }

    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
})();

// Count-up stats
(function () {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length || reducedMotion || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            io.unobserve(en.target);
            var el = en.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
            var t0 = performance.now(), dur = 1400;
            (function step(t) {
                var p = Math.min((t - t0) / dur, 1);
                el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
                if (p < 1) requestAnimationFrame(step);
            })(t0);
        });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { n.textContent = '0' + (n.dataset.suffix || ''); io.observe(n); });
})();
