// Basic hover effect enhancement
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 4px 15px rgba(136, 192, 208, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = 'none';
        });
    });
});