document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour obtenir la date actuelle au format YYYY-MM-DD
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11, donc ajouter 1
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const date = getCurrentDate(); // Obtenir la date actuelle
    const zone = 'france'; // La zone peut être 'romain' ou une autre selon votre besoin
    const apiUrl = `https://api.aelf.org/get/v1/lectures/${date}/${zone}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const paroleDuJour = document.getElementById("parole-du-jour");
            if (data.lectures) {
                let content = `<h4>${date}</h4>`;
                data.lectures.forEach(lecture => {
                    content += `<h5>${lecture.titre}</h5>`;
                    content += `<p>${lecture.texte}</p>`;
                });
                paroleDuJour.innerHTML = content;
            } else {
                paroleDuJour.innerHTML = "Aucune lecture trouvée pour cette date.";
            }
        })
        .catch(error => {
            const paroleDuJour = document.getElementById("parole-du-jour");
            paroleDuJour.innerHTML = "Erreur de chargement de la Parole de Dieu.";
            console.error("Erreur:", error);
        });
});
