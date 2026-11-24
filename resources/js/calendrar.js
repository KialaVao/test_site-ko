// =====================================================================
//  CALCUL AUTOMATIQUE DES FÊTES CATHOLIQUES (calendrier liturgique de France)
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

    eventsCache[year] = events;
    return events;
}

// Renvoie le texte de l'événement d'un jour donné, ou null s'il n'y en a pas
function getEvent(year, month, day) {
    const list = getEventsForYear(year)[`${year}-${month + 1}-${day}`];
    return list ? list.join(" / ") : null;
}

// =====================================================================
//  AFFICHAGE DU CALENDRIER
// =====================================================================

document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('eventPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupDescription = document.getElementById('popupDescription');
    const closeButton = document.querySelector('.close');

    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const today = new Date();

    const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    // Ouvrir le pop-up avec les détails de l'événement
    function openPopup(eventTitle) {
        popupTitle.textContent = eventTitle;
        popupDescription.textContent = `Détails de l'événement : ${eventTitle}`; // Vous pouvez personnaliser ce texte
        popup.style.display = 'flex';
    }

    // Fermer le pop-up
    closeButton.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    // Fermer le pop-up en cliquant en dehors du contenu
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    function renderCalendar(month, year) {
        calendar.innerHTML = '';
        monthYear.textContent = new Date(year, month).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

        // Noms des jours de la semaine
        daysOfWeek.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'weekday';
            dayCell.textContent = day;
            calendar.appendChild(dayCell);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            calendar.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day';
            dayCell.innerHTML = `<span>${day}</span>`;

            const eventName = getEvent(year, month, day);
            if (eventName) {
                dayCell.classList.add('event');

                const eventDiv = document.createElement('div');
                eventDiv.className = 'event-name';
                eventDiv.textContent = eventName;
                dayCell.appendChild(eventDiv);

                dayCell.addEventListener('click', function () {
                    openPopup(eventName);
                });
            }

            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            calendar.appendChild(dayCell);
        }
    }

    function changeMonth(direction) {
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    }

    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    renderCalendar(currentMonth, currentYear);
});