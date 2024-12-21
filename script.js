// Smooth scrolling pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation des barres de progression au scroll
const animateProgressBars = () => {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = (rect.top >= 0 && rect.bottom <= window.innerHeight);
        if (isVisible) {
            bar.style.width = bar.parentElement.getAttribute('data-progress') + '%';
        }
    });
};

window.addEventListener('scroll', animateProgressBars);

// Animation de l'apparition des éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    observer.observe(el);
});

// Effet de parallaxe sur les étoiles
document.addEventListener('mousemove', (e) => {
    const stars = document.querySelector('.stars');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    stars.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
});

// Traitement du PDF téléchargé et affichage d'un résumé
document.getElementById('pdf-upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('pdf-file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const typedarray = new Uint8Array(e.target.result);
            pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                let textContent = '';
                const numPages = pdf.numPages;

                const pagePromises = [];
                for (let i = 1; i <= numPages; i++) {
                    pagePromises.push(pdf.getPage(i).then(page => {
                        return page.getTextContent().then(text => {
                            text.items.forEach(item => {
                                textContent += item.str + ' ';
                            });
                        });
                    }));
                }

                Promise.all(pagePromises).then(() => {
                    // Résumé simple : prendre les 500 premiers caractères
                    const summary = textContent.substring(0, 500);
                    document.getElementById('summary').innerText = summary;
                });
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

// Gestion du formulaire de contact
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Afficher un indicateur de chargement
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    submitBtn.disabled = true;

    // Préparer les paramètres
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Envoyer l'email
    emailjs.send('default_service', 'template_id', templateParams)
        .then(function() {
            // Succès
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Envoyé!';
            submitBtn.style.backgroundColor = '#4CAF50';
            
            // Réinitialiser le formulaire
            document.getElementById('contact-form').reset();
            
            // Restaurer le bouton après 3 secondes
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, function(error) {
            // Erreur
            console.error('Erreur:', error);
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur';
            submitBtn.style.backgroundColor = '#f44336';
            
            // Restaurer le bouton après 3 secondes
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        });
});
