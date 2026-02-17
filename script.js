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

function limitWords(field, maxWords) {
    const words = field.value.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const counter = field.nextElementSibling;
    counter.textContent = wordCount + ' / ' + maxWords + ' words';

    if (wordCount >= maxWords) {
        counter.style.color = '#ff4a4a';
        const trimmed = words.slice(0, maxWords).join(' ');
        field.value = trimmed;
    } else {
        counter.style.color = 'var(--text-tertiary)';
    }
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check