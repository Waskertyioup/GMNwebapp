// === Contact Form Handler ===
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) {
    console.error('contact-form element NOT FOUND!');
    return;
  }
  
  console.log('contact-form element found');
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('FORM SUBMIT EVENT TRIGGERED!');
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.querySelector('.btn-text')?.textContent || 'Submit';
    
    // Get form data
    const formData = {
      nombre: form.nombre.value,
      empresa: form.empresa.value,
      correo: form.correo.value,
      telefono: form.telefono.value,
      pais: form.pais.value,
      requerimiento: form.requerimiento.value,
      reunion: form.reunion.checked
    };
    
    console.log('Form data collected');

    // Show loading state
    if (submitButton && submitButton.dataset.keySending) {
      const sendingText = document.querySelector(`[data-key="${submitButton.dataset.keySending}"]`);
      if (sendingText) {
        submitButton.querySelector('.btn-text').textContent = sendingText.textContent;
      }
    }
    if (submitButton) submitButton.disabled = true;

    try {
      console.log('Sending form data...');
      
      const response = await fetch('/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response received. Status:', response.status);
      
      const result = await response.json();
      console.log('Result:', result);
      
      if (result.ok) {
        console.log('Form sent successfully via backend');
        
        // Show confirmation modal
        const modal = document.getElementById('confirmation-modal');
        if (modal) {
          console.log('Showing confirmation modal');
          modal.style.display = 'block';
        }
        
        // Reset form
        form.reset();
      } else {
        console.error('Backend error:', result.message);
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('FETCH ERROR:', error);
      alert('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        const btnText = submitButton.querySelector('.btn-text');
        if (btnText) btnText.textContent = originalText;
      }
    }
  });
  
  console.log('Form event listener added successfully');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing contact form');
  initContactForm();
});


// Close modal handlers
document.getElementById('close-modal')?.addEventListener('click', function() {
  document.getElementById('confirmation-modal').style.display = 'none';
});


// Add escape key support
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('confirmation-modal');
    if (modal && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
    
    const joinModal = document.getElementById('join-confirmation-modal');
    if (joinModal && joinModal.style.display === 'block') {
      joinModal.style.display = 'none';
    }
  }
});

