document.addEventListener("DOMContentLoaded", function () {
    const projects = document.querySelectorAll(".project");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    let currentImages = [];
    let currentIndex = 0;

    // Open Lightbox and Load Images
    projects.forEach(project => {
        project.addEventListener("click", function () {
            currentImages = this.getAttribute("data-images").split(",");
            currentIndex = 0; // Start with the first image
            updateLightboxImage();
            lightbox.classList.add("active");
        });
    });

    // Function to Update Lightbox Image
    function updateLightboxImage() {
        if (currentImages.length > 0) {
            lightboxImg.src = currentImages[currentIndex];
        }
    }

    // Navigation
    prevBtn.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightboxImage();
        }
    });

    nextBtn.addEventListener("click", function () {
        if (currentIndex < currentImages.length - 1) {
            currentIndex++;
            updateLightboxImage();
        }
    });

    // Close Lightbox
    closeBtn.addEventListener("click", function () {
        lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", function (event) {
        if (event.target !== lightboxImg && event.target !== prevBtn && event.target !== nextBtn) {
            lightbox.classList.remove("active");
        }
    });
});

