
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


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


document.addEventListener('mousemove', (e) => {
    const stars = document.querySelector('.stars');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    stars.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
});


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
                   
                    const summary = textContent.substring(0, 500);
                    document.getElementById('summary').innerText = summary;
                });
            });
        };
        reader.readAsArrayBuffer(file);
    }
});


document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

  
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    submitBtn.disabled = true;

   
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    
    emailjs.send('default_service', 'template_id', templateParams)
        .then(function() {
         
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Envoyé!';
            submitBtn.style.backgroundColor = '#4CAF50';
            
           
            document.getElementById('contact-form').reset();
            
        
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, function(error) {
  
            console.error('Erreur:', error);
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur';
            submitBtn.style.backgroundColor = '#f44336';
            
      
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        });
});
