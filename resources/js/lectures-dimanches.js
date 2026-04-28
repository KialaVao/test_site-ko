document.addEventListener("DOMContentLoaded", function () {
    const zone = "romain";
    const container = document.getElementById("lectures-dimanches");

    if (!container) {
        console.error("L'élément avec l'id 'lectures-dimanches' est introuvable.");
        return;
    }

    const catholicEvents = {
        "2025-8-15": "Assomption de Marie",
        "2025-9-28": "Rentrée Pastorale",
        "2025-10-19": "Messe du mois",
        "2025-11-1": "Toussaint / Conseil National ANCMF-J1",
        "2025-11-2": "Toussaint / Conseil National ANCMF-J2",
        "2025-11-16": "Messe du mois",
        "2025-11-25": "Christ Roi",
        "2025-12-21": "Messe du mois",
        "2025-12-25": "Noël",
        "2026-1-4": "Épiphanie",
        "2026-1-18": "Messe du mois / Bonne Année",
        "2026-2-15": "Messe du mois",
        "2026-2-18": "Mercredi des cendres",
        "2026-3-15": "Messe du mois",
        "2026-3-29": "Dimanche des Rameaux",
        "2026-4-5": "Pâques",
        "2026-4-12": "Fête de la Miséricorde",
        "2026-4-19": "Messe du mois",
        "2026-5-14": "Ascension",
        "2026-5-17": "Messe du mois",
        "2026-5-29": "Pentecôte",
        "2026-6-21": "Messe du mois",
        "2026-8-15": "Assomption de Marie"
    };

    function pad(num) {
        return String(num).padStart(2, "0");
    }

    function normalizeDate(dateString) {
        const [year, month, day] = dateString.split("-");
        return `${year}-${pad(month)}-${pad(day)}`;
    }

    function denormalizeDate(dateString) {
        const [year, month, day] = dateString.split("-");
        return `${year}-${parseInt(month, 10)}-${parseInt(day, 10)}`;
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

    function construireLigneLecture(lecture) {
        const type = traduireType(lecture.type);
        const titre = lecture.titre || "Sans titre";
        const reference = lecture.ref ? ` — ${lecture.ref}` : "";

        return `<li><strong>${type}</strong> : ${titre}${reference}</li>`;
    }

    function getDateLaPlusProche() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const datesNormalisees = Object.keys(catholicEvents).map(normalizeDate);

        let dateLaPlusProche = null;
        let ecartMinimum = Infinity;

        for (const date of datesNormalisees) {
            const eventDate = new Date(date);
            eventDate.setHours(0, 0, 0, 0);

            const ecart = Math.abs(eventDate.getTime() - today.getTime());

            if (ecart < ecartMinimum) {
                ecartMinimum = ecart;
                dateLaPlusProche = date;
            }
        }

        return dateLaPlusProche;
    }

    async function loadLectures() {
        const date = getDateLaPlusProche();

        if (!date) {
            container.innerHTML = "<p>Aucune date disponible dans le calendrier.</p>";
            return;
        }

        const originalKey = denormalizeDate(date);
        const eventName = catholicEvents[originalKey] || "Événement liturgique";
        const apiUrl = `https://api.aelf.org/v1/messes/${date}/${zone}`;

        container.innerHTML = "<p>Chargement des lectures...</p>";

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            if (!data.messes || data.messes.length === 0) {
                container.innerHTML = "<p>Aucune messe trouvée pour cette date.</p>";
                return;
            }

            const messe = data.messes[0];
            const lectures = selectionnerLecturesPrincipales(messe.lectures || []);

            if (lectures.length === 0) {
                container.innerHTML = `
                    <div class="jour-lecture">
                        <h3>${formatDateFr(date)}</h3>
                        <p><strong>${eventName}</strong></p>
                        <p>Aucune lecture disponible.</p>
                    </div>
                `;
                return;
            }

            const titres = lectures.map(construireLigneLecture).join("");

            container.innerHTML = `
                <div class="jour-lecture">
                    <h3>${formatDateFr(date)}</h3>
                    <p><strong>${eventName}</strong></p>
                    <ul>
                        ${titres}
                    </ul>
                </div>
            `;
        } catch (error) {
            console.error("Erreur :", error);
            container.innerHTML = "<p>Erreur de chargement des lectures.</p>";
        }
    }

    loadLectures();
});