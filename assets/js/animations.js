document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    });

    document.querySelectorAll('.feature-card').forEach((card) => {
        observer.observe(card);
    });
});
