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
