// script.js
document.addEventListener("DOMContentLoaded", function() {
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeButton = document.querySelector(".close");

    galleryItems.forEach(item => {
        item.addEventListener("click", function() {
            lightbox.style.display = "block";
            lightboxImage.src = this.src;
        });
    });

    closeButton.addEventListener("click", function() {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", function(event) {
        if (event.target !== lightboxImage) {
            lightbox.style.display = "none";
        }
    });
});
