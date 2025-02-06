// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// all sections except hero
document.querySelectorAll('section:not(#hero)').forEach(section => {
    observer.observe(section);
});

// skill categories and project cards
document.querySelectorAll('.skill-category, .project-card').forEach(card => {
    observer.observe(card);
});

const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formFeedback = document.getElementById('form-feedback');

function showFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = type;
    formFeedback.style.display = 'block';
}

function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
    } else {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
}

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
        showFeedback('Please fill in all fields.', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    formFeedback.style.display = 'none';
    
    try {
        const response = await fetch('https://formspree.io/f/mkgbrkve', { //Using fetch stops redirection to formspree
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showFeedback(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        showFeedback('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
    } finally {
        setLoadingState(false);
    }
});