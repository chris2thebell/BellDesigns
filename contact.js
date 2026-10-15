// Posts JSON (text/plain, so Google Apps Script skips a CORS preflight).
// Files are base64. Redeploy steps: CONTACT_FORM_SETUP.md
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyO7gDrsAwO265p3rIMneCglMc-9O7GbAPFjneSVvDWvPMVOuoiQJptZTKVzjQRqZlF/exec";
const MAX_FILES = 4;
const MAX_TOTAL_BYTES = 8 * 1024 * 1024;

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || "");
            const base64 = result.includes(",") ? result.split(",").pop() : result;
            resolve({
                filename: file.name,
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                base64: base64
            });
        };
        reader.onerror = () => reject(reader.error || new Error("Could not read file"));
        reader.readAsDataURL(file);
    });
}

function showFormError(lead) {
    document.getElementById("error-lead").textContent = lead;
    document.getElementById("error-message").classList.remove("hidden");
    document.getElementById("success-message").classList.add("hidden");
}

document.getElementById("contact-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    document.getElementById("error-message").classList.add("hidden");
    document.getElementById("success-message").classList.add("hidden");

    const fileInput = form.querySelector('input[type="file"]');
    const files = Array.from(fileInput.files || []);
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

    if (files.length > MAX_FILES || totalBytes > MAX_TOTAL_BYTES) {
        showFormError("Those files are too large to attach here (up to 4 files and 8 MB total).");
        return;
    }

    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Sending…";

    try {
        const encodedFiles = [];
        for (const file of files) {
            encodedFiles.push(await readFileAsBase64(file));
        }

        const data = new FormData(form);
        const payload = {
            name: String(data.get("name") || "").trim(),
            email: String(data.get("email") || "").trim(),
            phone: String(data.get("phone") || "").trim(),
            role: String(data.get("role") || "").trim(),
            projectType: String(data.get("projectType") || "").trim(),
            city: String(data.get("city") || "").trim(),
            message: String(data.get("message") || "").trim(),
            files: encodedFiles
        };

        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });
        const text = await response.text();

        if (!response.ok || !/success/i.test(text)) {
            throw new Error("Form was not accepted");
        }

        document.getElementById("success-message").classList.remove("hidden");
        form.reset();
    } catch (error) {
        showFormError("We couldn't send your message from the form.");
    } finally {
        button.disabled = false;
        button.textContent = originalLabel;
    }
});
