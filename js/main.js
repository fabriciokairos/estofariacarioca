document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.testimonial-slider');
    const slides = slider.querySelectorAll('.testimonial');
    let current = 0;

    // Cria navegação
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '❮';
    prevBtn.className = 'testimonial-prev';
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '❯';
    nextBtn.className = 'testimonial-next';

    slider.parentElement.appendChild(prevBtn);
    slider.parentElement.appendChild(nextBtn);

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? 'block' : 'none';
        });
    }

    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    function prevSlide() {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Inicializa
    showSlide(current);

    // Auto-slide a cada 5 segundos
    setInterval(nextSlide, 5000);
});

window.addEventListener('scroll', function() {
    const nav = document.querySelector('.main-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
