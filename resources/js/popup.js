// popup.js
document.addEventListener("DOMContentLoaded", function() {
    // Obtenez la modale et le bouton de fermeture
    var modal = document.getElementById("modal");
    var span = document.getElementsByClassName("close")[0];

    // Ajoutez des gestionnaires d'événements à toutes les dates d'événements
    document.querySelectorAll(".event-date2").forEach(function(dateElement) {
        dateElement.addEventListener("click", function() {
            // Récupérer les détails de l'événement
            var eventTitle = this.nextElementSibling.textContent;
            var eventDescription = this.nextElementSibling.nextElementSibling.textContent;
            var eventLocation = this.nextElementSibling.nextElementSibling.nextElementSibling.textContent;

            // Mettez à jour la modale avec les détails de l'événement
            document.getElementById("eventDetails").innerHTML = 
                "<h2>" + eventTitle + "</h2>" +
                "<p>" + eventDescription + "</p>" +
                "<p><strong>Lieu:</strong> " + eventLocation + "</p>";

            // Affichez la modale
            modal.style.display = "block";
        });
    });

    // Lorsque l'utilisateur clique sur <span> (x), fermez la modale
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Lorsque l'utilisateur clique n'importe où en dehors de la modale, fermez-la
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});