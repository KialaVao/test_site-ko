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

    console.log("Fetching data from API:", apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received from API:", data);
            const paroleDuJour = document.getElementById("parole-du-jour");
            if (data.messes && data.messes.length > 0) {
                const messe = data.messes[0]; // Supposons qu'il y a au moins une messe
                console.log("Messe data:", messe);
                const evangile = messe.lectures.find(lecture => lecture.type === 'evangile');
                console.log("Evangile data:", evangile); // Inspecter la structure de l'objet évangile
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
