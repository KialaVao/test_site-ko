// =====================================================================
//  CALCUL AUTOMATIQUE DES FÊTES CATHOLIQUES (calendrier liturgique de France)
//  C'est ici (dans les RÉGLAGES) que tu modifies tes événements et tes changements ponctuels.
// =====================================================================

// Ajoute n jours à une date (renvoie une nouvelle date)
function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

// Clé utilisée par le calendrier : "AAAA-M-J" (sans zéro devant)
function dateKey(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// Premier dimanche à partir d'une date (incluse)
function sundayOnOrAfter(year, month, day) {
    const d = new Date(year, month, day);
    return addDays(d, (7 - d.getDay()) % 7);
}

// N-ième dimanche d'un mois (month : 0 = janvier ... 11 = décembre)
function nthSundayOfMonth(year, month, n) {
    return addDays(sundayOnOrAfter(year, month, 1), 7 * (n - 1));
}

// Date de Pâques (calendrier grégorien) – algorithme de Meeus/Jones/Butcher
function easterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = mars, 4 = avril
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

// ---------------------------------------------------------------------
//  RÉGLAGES
// ---------------------------------------------------------------------

// "Messe du mois" : le 3e dimanche de chaque mois, sauf juillet, août et septembre
const MESSE_DU_MOIS = {
    actif: true,
    nemeDimanche: 3,
    moisExclus: [6, 7, 8] // 0 = janvier ... 6 = juillet, 7 = août, 8 = septembre
};

// Événements de ta communauté. Ils s'ajoutent aux fêtes calculées automatiquement.
// Deux façons d'écrire un événement :
//   - Chaque année, le N-ième dimanche d'un mois :
//       { nom: "...", mois: 0, nemeDimanche: 3 }
//     (mois : 0 = janvier, 1 = février ... 8 = septembre ... 11 = décembre)
//   - Une seule fois, à une date précise :
//       { nom: "Kermesse", date: "2027-6-13" }   (format "AAAA-M-J")
const localEvents = [
    { nom: "Bonne Année", mois: 0, nemeDimanche: 3 },      // 3e dimanche de janvier (avec la Messe du mois)
    { nom: "Rentrée Pastorale", mois: 8, nemeDimanche: 3 } // 3e dimanche de septembre
];

// Changements ponctuels : déplacer ou annuler un événement pour UNE date précise.
//   - Déplacer :  { nom: "Rentrée Pastorale", date: "2027-9-19", nouvelleDate: "2027-9-26" }
//   - Annuler :   { nom: "Messe du mois", date: "2027-4-18" }   (sans nouvelleDate)
// "nom" doit être écrit exactement comme il s'affiche sur le calendrier,
// et "date" est la date où il apparaît actuellement (format "AAAA-M-J").
// Les autres années ne sont pas touchées.
const changements = [
];

// ---------------------------------------------------------------------
//  GÉNÉRATION DES FÊTES D'UNE ANNÉE
// ---------------------------------------------------------------------

const eventsCache = {};

function getEventsForYear(year) {
    if (eventsCache[year]) return eventsCache[year];

    const events = {};
    const add = (date, name) => {
        const key = dateKey(date);
        (events[key] = events[key] || []).push(name);
    };

    // --- Fêtes mobiles (dépendent de Pâques) ---
    const easter = easterSunday(year);
    add(addDays(easter, -46), "Mercredi des Cendres");
    add(addDays(easter, -7), "Dimanche des Rameaux");
    add(addDays(easter, -3), "Jeudi Saint");
    add(addDays(easter, -2), "Vendredi Saint");
    add(easter, "Pâques");
    add(addDays(easter, 1), "Lundi de Pâques");
    add(addDays(easter, 7), "Fête de la Miséricorde");
    add(addDays(easter, 39), "Ascension");
    add(addDays(easter, 49), "Pentecôte");
    add(addDays(easter, 50), "Lundi de Pentecôte");
    add(addDays(easter, 56), "Sainte Trinité");
    add(addDays(easter, 63), "Fête-Dieu (Saint-Sacrement)");
    add(addDays(easter, 68), "Sacré-Cœur de Jésus");

    // --- Fêtes fixes ---
    add(new Date(year, 0, 1), "Sainte Marie, Mère de Dieu");
    add(new Date(year, 1, 2), "Présentation du Seigneur");
    add(new Date(year, 7, 15), "Assomption de Marie");
    add(new Date(year, 10, 1), "Toussaint");
    add(new Date(year, 10, 2), "Commémoration des fidèles défunts");
    add(new Date(year, 11, 25), "Noël");

    // Annonciation (25 mars) : déplacée si elle tombe pendant la Semaine sainte,
    // l'octave de Pâques ou un dimanche de Carême
    let annonciation = new Date(year, 2, 25);
    const rameaux = addDays(easter, -7);
    const misericorde = addDays(easter, 7);
    if (annonciation >= rameaux && annonciation <= misericorde) {
        annonciation = addDays(misericorde, 1);
    } else if (annonciation.getDay() === 0) {
        annonciation = addDays(annonciation, 1);
    }
    add(annonciation, "Annonciation");

    // Immaculée Conception (8 décembre) : reportée au lundi si c'est un dimanche
    let immaculee = new Date(year, 11, 8);
    if (immaculee.getDay() === 0) immaculee = addDays(immaculee, 1);
    add(immaculee, "Immaculée Conception");

    // --- Fêtes fixées sur un dimanche (règles de la France) ---
    const epiphanie = sundayOnOrAfter(year, 0, 2); // dimanche entre le 2 et le 8 janvier
    add(epiphanie, "Épiphanie");
    // Baptême du Seigneur : dimanche suivant, ou lundi si l'Épiphanie tombe le 7 ou le 8
    add(addDays(epiphanie, epiphanie.getDate() >= 7 ? 1 : 7), "Baptême du Seigneur");

    add(sundayOnOrAfter(year, 10, 20), "Christ Roi");               // entre le 20 et le 26 nov.
    add(sundayOnOrAfter(year, 10, 27), "1er dimanche de l'Avent");  // entre le 27 nov. et le 3 déc.

    // Sainte Famille : dimanche après Noël, ou le 30 décembre si Noël est un dimanche
    const noel = new Date(year, 11, 25);
    add(noel.getDay() === 0 ? new Date(year, 11, 30) : sundayOnOrAfter(year, 11, 26), "Sainte Famille");

    // --- Messe du mois ---
    if (MESSE_DU_MOIS.actif) {
        for (let month = 0; month < 12; month++) {
            if (!MESSE_DU_MOIS.moisExclus.includes(month)) {
                add(nthSundayOfMonth(year, month, MESSE_DU_MOIS.nemeDimanche), "Messe du mois");
            }
        }
    }

    // --- Événements locaux ---
    for (const ev of localEvents) {
        if (ev.date) {
            // Événement ponctuel : seulement l'année indiquée
            if (ev.date.startsWith(`${year}-`)) {
                (events[ev.date] = events[ev.date] || []).push(ev.nom);
            }
        } else {
            // Événement récurrent : le N-ième dimanche du mois, chaque année
            add(nthSundayOfMonth(year, ev.mois, ev.nemeDimanche), ev.nom);
        }
    }

    // --- Changements ponctuels (déplacements / annulations) ---
    for (const ch of changements) {
        if (ch.date.startsWith(`${year}-`)) {
            const list = events[ch.date] || [];
            const index = list.indexOf(ch.nom);
            if (index === -1) {
                console.warn(`Changement ignoré : "${ch.nom}" n'est pas le ${ch.date}`);
                continue;
            }
            list.splice(index, 1);
            if (list.length === 0) delete events[ch.date];
        }
        if (ch.nouvelleDate && ch.nouvelleDate.startsWith(`${year}-`)) {
            (events[ch.nouvelleDate] = events[ch.nouvelleDate] || []).push(ch.nom);
        }
    }

    eventsCache[year] = events;
    return events;
}

// Renvoie le texte de l'événement d'un jour donné, ou null s'il n'y en a pas
function getEvent(year, month, day) {
    const list = getEventsForYear(year)[`${year}-${month + 1}-${day}`];
    return list ? list.join(" / ") : null;
}


// =====================================================================
//  LECTURES DU PROCHAIN DIMANCHE OU DE LA PROCHAINE FÊTE
//  Les lectures viennent de l'API de l'AELF : https://api.aelf.org
// =====================================================================

document.addEventListener("DOMContentLoaded", function () {
    const zone = "romain";
    const container = document.getElementById("lectures-dimanches");

    if (!container) return; // pas de lectures sur cette page

    function pad(num) {
        return String(num).padStart(2, "0");
    }

    // Date au format attendu par l'API AELF : "AAAA-MM-JJ"
    function toApiDate(date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    // "Dimanche 29 novembre 2026"
    function formatDateFr(date) {
        const texte = date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        return texte.charAt(0).toUpperCase() + texte.slice(1);
    }

    // Nettoie le nom donné par l'AELF : enlève "(semaine I du Psautier)", les guillemets…
    function nettoyerNomLiturgique(nom) {
        return (nom || "")
            .replace(/\s*[\(\[][^\)\]]*psautier[^\)\]]*[\)\]]/gi, "")
            .replace(/[«»]/g, "")
            .trim();
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

    function hasContent(lecture) {
        return lecture && (
            (lecture.titre && lecture.titre.trim() !== "") ||
            (lecture.ref && lecture.ref.trim() !== "")
        );
    }

    function selectionnerLecturesPrincipales(lectures) {
        const resultat = [];
        const trouver = type => lectures.find(l => l.type === type && hasContent(l));

        const lecture1 = trouver("lecture_1");
        const psaume = trouver("psaume");
        const lecture2 = trouver("lecture_2");
        const epitre = trouver("epitre");
        const evangile = trouver("evangile");

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

    // Certains jours ont plusieurs messes (Noël, Pâques, Rameaux…) :
    // on prend la "Messe du jour", sinon la dernière (ex. Messe de la Passion aux Rameaux)
    function choisirMesse(messes) {
        return messes.find(m => /jour/i.test(m.nom || "")) || messes[messes.length - 1];
    }

    // L'AELF met des guillemets seulement sur certains titres : on les ajoute partout
    // (  = espace insécable, pour que « et » ne se retrouvent pas seuls en bout de ligne)
    function ajouterGuillemets(titre) {
        if (titre.startsWith("«")) return titre;
        return `« ${titre} »`;
    }

    function construireLigneLecture(lecture) {
        const type = traduireType(lecture.type);
        const titre = lecture.titre && lecture.titre.trim() !== "" ? ajouterGuillemets(lecture.titre.trim()) : "";
        const reference = lecture.ref && lecture.ref.trim() !== "" ? lecture.ref : "";

        if (titre && reference) return `<li><strong>${type}</strong> : ${titre} - ${reference}</li>`;
        if (titre) return `<li><strong>${type}</strong> : ${titre}</li>`;
        if (reference) return `<li><strong>${type}</strong> : ${reference}</li>`;
        return "";
    }

    // Prochain dimanche ou prochaine fête du calendrier (aujourd'hui compris)
    function getProchaineDate() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const nomEvenement = getEvent(date.getFullYear(), date.getMonth(), date.getDate());
            if (date.getDay() === 0 || nomEvenement) {
                return { date, nomEvenement };
            }
            date.setDate(date.getDate() + 1);
        }
        return null; // n'arrive jamais : il y a toujours un dimanche dans les 7 jours
    }

    async function loadLectures() {
        const { date, nomEvenement } = getProchaineDate();
        const apiUrl = `https://api.aelf.org/v1/messes/${toApiDate(date)}/${zone}`;

        container.innerHTML = "<p>Chargement des lectures...</p>";

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            const nomLiturgique = nettoyerNomLiturgique(data.informations && data.informations.jour_liturgique_nom);

            // Titre : le nom de ton calendrier s'il y en a un, sinon le nom liturgique de l'AELF
            const titre = nomEvenement || nomLiturgique || "Lectures du jour";
            // Sous-titre : le nom liturgique, s'il apporte une info en plus
            const sousTitre = nomEvenement && nomLiturgique &&
                nomLiturgique.toLowerCase() !== nomEvenement.toLowerCase()
                ? `<p class="jour-liturgique">${nomLiturgique}</p>`
                : "";

            if (!data.messes || data.messes.length === 0) {
                container.innerHTML = `
                    <div class="jour-lecture">
                        <h3>${formatDateFr(date)} : ${titre}</h3>
                        ${sousTitre}
                        <p>Aucune messe trouvée pour cette date.</p>
                    </div>
                `;
                return;
            }

            const messe = choisirMesse(data.messes);
            const lectures = selectionnerLecturesPrincipales(messe.lectures || []);
            const contenu = lectures.length > 0
                ? `<ul>${lectures.map(construireLigneLecture).join("")}</ul>`
                : "<p>Aucune lecture disponible.</p>";

            container.innerHTML = `
                <div class="jour-lecture">
                    <h3>${formatDateFr(date)} : ${titre}</h3>
                    ${sousTitre}
                    ${contenu}
                </div>
            `;
        } catch (error) {
            console.error("Erreur :", error);
            container.innerHTML = "<p>Erreur de chargement des lectures.</p>";
        }
    }

    loadLectures();
});