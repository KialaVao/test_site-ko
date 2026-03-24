document.addEventListener("DOMContentLoaded", function () {
    const dates = [
        "2026-03-15"
        "2026-03-29",
        "2026-04-05",
        "2026-04-12",
        "2026-04-19",
        "2026-05-14",
        "2026-05-17",
        "2026-05-29",
        "2026-06-21",
        "2026-08-15"
    ];

    const zone = "romain";
    const container = document.getElementById("lectures-dimanches");

    if (!container) {
        console.error("L'élément avec l'id 'lectures-dimanches' est introuvable.");
        return;
    }

    function formatDateFr(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    function getDateDuMoisActuel(listeDates) {
        const today = new Date();
        const moisActuel = today.getMonth() + 1;
        const anneeActuelle = today.getFullYear();

        return listeDates.find(date => {
            const d = new Date(date);
            return d.getMonth() + 1 === moisActuel && d.getFullYear() === anneeActuelle;
        });
    }

    async function fetchLecturesTitles(date) {
        const apiUrl = `https://api.aelf.org/v1/messes/${date}/${zone}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            if (data.messes && data.messes.length > 0) {
                const messe = data.messes[0];
                const lectures = messe.lectures || [];

                const titres = lectures.map(lecture => `
                    <li><strong>${lecture.type}</strong> : ${lecture.titre}</li>
                `).join("");

                container.innerHTML = `
                    <div class="jour-lecture">
                        <h3>${formatDateFr(date)}</h3>
                        <ul>
                            ${titres}
                        </ul>
                    </div>
                `;
            } else {
                container.innerHTML = "<p>Aucune messe trouvée pour ce mois.</p>";
            }
        } catch (error) {
            console.error(error);
            container.innerHTML = "<p>Erreur de chargement.</p>";
        }
    }

    const dateDuMois = getDateDuMoisActuel(dates);

    if (dateDuMois) {
        fetchLecturesTitles(dateDuMois);
    } else {
        container.innerHTML = "<p>Aucune lecture prévue pour ce mois.</p>";
    }
});