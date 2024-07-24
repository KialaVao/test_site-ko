document.addEventListener("DOMContentLoaded", function() {
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const date = getCurrentDate();
    const zone = 'romain';
    const apiUrl = `https://api.aelf.org/v1/messes/${date}/${zone}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Inspecter la structure de la réponse
            const paroleDuJour = document.getElementById("parole-du-jour");
            if (data.messes && data.messes.length > 0) {
                const messe = data.messes[0]; // Supposons qu'il y a au moins une messe
                const evangile = messe.lectures.find(lecture => lecture.type === 'evangile');
                if (evangile) {
                    const content = `
                        <h4>${date}</h4>
                        <h5>${evangile.titre}</h5>
                        <p>${evangile.texte}</p>
                    `;
                    paroleDuJour.innerHTML = content;
                } else {
                    paroleDuJour.innerHTML = "Aucune lecture de l'évangile trouvée pour cette date.";
                }
            } else {
                paroleDuJour.innerHTML = "Aucune messe trouvée pour cette date.";
            }
        })
        .catch(error => {
            const paroleDuJour = document.getElementById("parole-du-jour");
            paroleDuJour.innerHTML = "Erreur de chargement de la Parole de Dieu.";
            console.error("Erreur:", error);
        });
});
