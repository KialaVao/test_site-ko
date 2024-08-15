document.addEventListener("DOMContentLoaded", function () {
    // Sélectionnez tous les éléments qui ont la classe "event"
    const eventDays = document.querySelectorAll(".day.event");

    // Le modal et les éléments associés
    const modal = document.getElementById("modal");
    const closeBtn = document.querySelector(".close");
    const eventDetails = document.getElementById("eventDetails");

    // Ajoutez un événement de clic à chaque jour avec un événement
    eventDays.forEach(day => {
        day.addEventListener("click", function () {
            // Affichez les détails de l'événement (vous pouvez personnaliser ici)
            const eventName = day.querySelector(".event-name").textContent;
            eventDetails.innerHTML = `<h2>Détails de l'événement</h2><p>${eventName}</p>`;
            
            // Affichez le modal
            modal.style.display = "block";
        });
    });

    // Quand l'utilisateur clique sur (x), fermez la fenêtre modale
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    // Quand l'utilisateur clique en dehors de la modale, fermez-la
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
