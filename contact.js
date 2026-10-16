function showFormError(lead) {
    document.getElementById("error-lead").textContent = lead;
    document.getElementById("error-message").classList.remove("hidden");
    document.getElementById("success-message").classList.add("hidden");
}

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
            showFormError("We couldn't send your message from the form.");
        }
    })
    .catch(error => {
        showFormError("We couldn't send your message from the form.");
    });
});
