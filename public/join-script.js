

// === Join Form (Frontend EmailJS) ===
// Join Form Submission
// Join Form Submission - USE FORM DATA
document.getElementById('join-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.querySelector('.btn-text').textContent;
  
  // Get form data
  const nombre = form.nombre.value;
  const correo = form.correo.value;
  const pais = form.pais.value;
  const linkedin = form.linkedin.value;
  const area = form.area.value;
  
  // Get file
  const resumeFile = form.resume.files[0];
  
  // Validate file
  if (!resumeFile) {
    alert('Por favor, adjunta tu CV.');
    return;
  }

  // Check file size (5MB max)
  if (resumeFile.size > 5 * 1024 * 1024) {
    alert('El archivo es demasiado grande. Máximo 5MB.');
    return;
  }

  // Show loading state
  if (submitButton.dataset.keySending) {
    const sendingText = document.querySelector(`[data-key="${submitButton.dataset.keySending}"]`);
    if (sendingText) {
      submitButton.querySelector('.btn-text').textContent = sendingText.textContent;
    }
  }
  submitButton.disabled = true;

  try {
    console.log('Sending join form via backend (FormData)...');
    
    // Create FormData (proper way for file uploads)
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('correo', correo);
    formData.append('pais', pais);
    formData.append('linkedin', linkedin);
    formData.append('area', area);
    formData.append('resume', resumeFile); // File is appended directly

    console.log('FormData created, file size:', resumeFile.size, 'bytes');

    // Send to backend using FormData
    const response = await fetch('/send-join-mail', {
      method: 'POST',
      body: formData
      // NO Content-Type header - let browser set it automatically for FormData
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('Join form sent successfully via backend');
      
      // Show confirmation modal
      const modal = document.getElementById('join-confirmation-modal');
      modal.style.display = 'block';
      
      // Reset form
      form.reset();
    } else {
      console.error('Backend error:', result.message);
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error sending form:', error);
    
    // Handle 413 error specifically
    if (error.message.includes('Unexpected token') || error.message.includes('Failed to fetch')) {
      alert('Error: El archivo es demasiado grande o hay un problema de conexión.');
    } else {
      alert('Error de conexión. Por favor, intenta nuevamente.');
    }
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.querySelector('.btn-text').textContent = originalText;
  }
});




// Helper function to convert file to base64
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:application/pdf;base64, part
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}


document.getElementById('join-close-modal')?.addEventListener('click', function() {
  document.getElementById('join-confirmation-modal').style.display = 'none';
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