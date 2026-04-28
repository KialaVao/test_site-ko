document.addEventListener("DOMContentLoaded", function () {
    const dates = [
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

    function garderUneDateParMois(listeDates) {
        const moisDejaAjoutes = new Set();

        return listeDates.filter(date => {
            const mois = date.slice(0, 7);
            if (moisDejaAjoutes.has(mois)) {
                return false;
            }
            moisDejaAjoutes.add(mois);
            return true;
        });
    }

    function traduireType(type) {
        const correspondances = {
            lecture_1: "1re lecture",
            psaume: "Psaume",
            lecture_2: "2e lecture",
            epitre: "Épître",
            evangile: "Évangile"
        };

        return correspondances[type] || type;
    }

    function selectionnerLecturesPrincipales(lectures) {
        const resultat = [];

        const lecture1 = lectures.find(l => l.type === "lecture_1" && l.titre);
        const psaume = lectures.find(l => l.type === "psaume" && l.titre);
        const lecture2 = lectures.find(l => l.type === "lecture_2" && l.titre);
        const epitre = lectures.find(l => l.type === "epitre" && l.titre);
        const evangile = lectures.find(l => l.type === "evangile" && l.titre);

        if (lecture1) resultat.push(lecture1);
        if (psaume) resultat.push(psaume);
        if (lecture2) {
            resultat.push(lecture2);
        } else if (epitre) {
            resultat.push(epitre);
        }
        if (evangile) resultat.push(evangile);

        return resultat;
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
                const lectures = selectionnerLecturesPrincipales(messe.lectures || []);

                if (lectures.length === 0) {
                    return `
                        <div class="jour-lecture">
                            <h3>${formatDateFr(date)}</h3>
                            <p>Aucun titre de lecture disponible.</p>
                        </div>
                    `;
                }

                const titres = lectures.map(lecture => `
                    <li><strong>${traduireType(lecture.type)}</strong> : ${lecture.titre}</li>
                `).join("");

                return `
                    <div class="jour-lecture">
                        <h3>${formatDateFr(date)}</h3>
                        <ul>
                            ${titres}
                        </ul>
                    </div>
                `;
            } else {
                return `
                    <div class="jour-lecture">
                        <h3>${formatDateFr(date)}</h3>
                        <p>Aucune messe trouvée pour cette date.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error(`Erreur pour la date ${date}:`, error);
            return `
                <div class="jour-lecture">
                    <h3>${formatDateFr(date)}</h3>
                    <p>Erreur de chargement.</p>
                </div>
            `;
        }
    }

    async function loadLectures() {
        container.innerHTML = "<p>Chargement des lectures...</p>";

        const datesFiltrees = garderUneDateParMois(dates);
        const results = await Promise.all(datesFiltrees.map(date => fetchLecturesTitles(date)));

        container.innerHTML = results.join("");
    }

    loadLectures();
});