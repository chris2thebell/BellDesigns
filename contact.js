document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting traditionally

    // Get form data
    const formData = new FormData(this);
    
    // Use Fetch API to send the form data
    fetch('https://script.google.com/macros/s/AKfycbyO7gDrsAwO265p3rIMneCglMc-9O7GbAPFjneSVvDWvPMVOuoiQJptZTKVzjQRqZlF/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Handle success response
            return response.text();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        // If form submission is successful, show success message
        if (data.includes('success')) {
            document.getElementById("success-message").classList.remove("hidden");
            document.getElementById("contact-form").reset();  // Clear the form
        } else {
            // Handle failure
            alert("There was an issue submitting the form. Please try again.");
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch request
        alert("Error: " + error.message);
    });
});

