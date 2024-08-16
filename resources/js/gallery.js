// script.js
document.addEventListener("DOMContentLoaded", function() {
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeButton = document.querySelector(".close");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

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

    // Afficher l'image précédente
    function showPrevImage() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
        showImage(currentIndex);
    }

    // Afficher l'image suivante
    function showNextImage() {
        currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
        showImage(currentIndex);
    }

    // Événements pour les clics sur les images de la galerie
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", function() {
            showImage(index);
        });
    });

    // Événements pour les boutons de navigation
    closeButton.addEventListener("click", closeLightbox);
    prevButton.addEventListener("click", showPrevImage);
    nextButton.addEventListener("click", showNextImage);

    // Fermer le lightbox en cliquant en dehors de l'image
    lightbox.addEventListener("click", function(event) {
        if (event.target !== lightboxImage && event.target !== prevButton && event.target !== nextButton) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (lightbox.style.display === "block") {
            if (event.key === "ArrowRight") {
                showNextImage();
            } else if (event.key === "ArrowLeft") {
                showPrevImage();
            } else if (event.key === "Escape") {
                closeLightbox();
            }
        }
    });
});
