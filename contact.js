// Same POST the deployed Apps Script already reads: multipart form fields, not JSON.
// Extra text fields are included. The script ignores any it does not write to the sheet.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyO7gDrsAwO265p3rIMneCglMc-9O7GbAPFjneSVvDWvPMVOuoiQJptZTKVzjQRqZlF/exec";

const projectParam = new URLSearchParams(window.location.search).get("project");
if (projectParam === "3d-scan") {
    const projectType = document.getElementById("projectType");
    if (projectType) {
        projectType.value = "3D scan";
    }
}

function showFormError(lead) {
    document.getElementById("error-lead").textContent = lead;
    document.getElementById("error-message").classList.remove("hidden");
    document.getElementById("success-message").classList.add("hidden");
}

document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    document.getElementById("error-message").classList.add("hidden");
    document.getElementById("success-message").classList.add("hidden");

    const formData = new FormData(form);
    // A file part is not one of the original fields. Leave it off so a chosen
    // file cannot change the body the current script accepts.
    formData.delete("files");

    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Sending…";

    fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error("Network response was not ok");
        })
        .then(data => {
            if (data.includes("success")) {
                document.getElementById("success-message").classList.remove("hidden");
                form.reset();
            } else {
                showFormError("We couldn't send your message from the form.");
            }
        })
        .catch(() => {
            showFormError("We couldn't send your message from the form.");
        })
        .finally(() => {
            button.disabled = false;
            button.textContent = originalLabel;
        });
});
