// script.js
document.addEventListener("DOMContentLoaded", function() {
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeButton = document.querySelector(".close");

    let currentIndex = 0;

    // Afficher l'image dans le lightbox
    function showImage(index) {
        currentIndex = index;
        lightbox.style.display = "block";
        lightboxImage.src = galleryItems[currentIndex].src;
    }

    // Fermer le lightbox
    function closeLightbox() {
        lightbox.style.display = "none";
    }

    // Événements pour les clics sur les images de la galerie
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", function() {
            showImage(index);
        });
    });

    // Fermer le lightbox en cliquant en dehors de l'image
    lightbox.addEventListener("click", function(event) {
        if (event.target !== lightboxImage && event.target !== prevButton && event.target !== nextButton) {
            closeLightbox();
        }
    });
});
