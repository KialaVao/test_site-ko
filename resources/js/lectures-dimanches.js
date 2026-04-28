document.addEventListener("DOMContentLoaded", function () {
    const zone = "romain";
    const container = document.getElementById("lectures-dimanches");

    if (!container) {
        console.error("L'élément avec l'id 'lectures-dimanches' est introuvable.");
        return;
    }

    const catholicEvents = {
        "2025-08-15": "Assomption de Marie",
        "2025-09-28": "Rentrée Pastorale",
        "2025-10-19": "Messe du mois",
        "2025-11-01": "Toussaint / Conseil National ANCMF-J1",
        "2025-11-02": "Toussaint / Conseil National ANCMF-J2",
        "2025-11-16": "Messe du mois",
        "2025-11-25": "Christ Roi",
        "2025-12-21": "Messe du mois",
        "2025-12-25": "Noël",
        "2026-01-04": "Épiphanie",
        "2026-01-18": "Messe du mois / Bonne Année",
        "2026-02-15": "Messe du mois",
        "2026-02-18": "Mercredi des cendres",
        "2026-03-15": "Messe du mois",
        "2026-03-29": "Dimanche des Rameaux",
        "2026-04-05": "Pâques",
        "2026-04-12": "Fête de la Miséricorde",
        "2026-04-19": "Messe du mois",
        "2026-05-14": "Ascension",
        "2026-05-17": "Messe du mois",
        "2026-05-29": "Pentecôte",
        "2026-06-21": "Messe du mois",
        "2026-08-15": "Assomption de Marie"
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
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    const texte = date.toLocaleDateString("fr-FR", options);
    return texte
        .split(" ")
        .map((mot, index) => index === 0 ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot)
        .join(" ");
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

    function getProchaineDate() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const datesNormalisees = Object.keys(catholicEvents)
            .map(normalizeDate)
            .sort((a, b) => new Date(a) - new Date(b));

        for (const date of datesNormalisees) {
            const eventDate = new Date(date);
            eventDate.setHours(0, 0, 0, 0);

            if (eventDate >= today) {
                return date;
            }
        }

        return null;
    }

    async function loadLectures() {
        const date = getProchaineDate();

        if (!date) {
            container.innerHTML = "<p>Aucune prochaine date disponible dans le calendrier.</p>";
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
                    <h3>${formatDateFr(date)} : ${eventName}</h3>
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