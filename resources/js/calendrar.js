const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const today = new Date();

const catholicEvents = {
    "2024-8-15": "Assomption de Marie",
    "2024-9-15": "Messe du mois",
    "2024-10-20": "Messe du mois",
    "2024-11-1": "Toussaint",
    "2024-11-17": "Messe du mois",
    "2024-11-24": "Christ Roi",
    "2024-12-22": "Messe du mois:4ème dimanche de l'Avent",
    "2024-12-25": "Noël",
    "2024-12-29": "Sainte Famille",
    "2025-1-1": "Sainte Marie, Mère de Dieu",
    "2025-1-5": "Epiphanie",
    "2025-1-12": "Baptême du Seigneur",
    "2025-1-19": "Messe du mois",
    "2025-2-2": "Présentation du Seigneur au Temple",
    "2025-2-16": "Messe du mois",
    "2025-3-5": "Mercredi des cendres",
    "2025-3-16": "Messe du mois",
    "2025-4-13": "Dimanche des Rameaux",
    "2025-4-17": "Jeudi Saint",
    "2025-4-18": "Vendredi Saint",
    "2025-4-19": "Samedi Saint",
    "2025-4-20": "Pâques",
    "2025-4-27": "Dimanche de la Miséricorde",
    "2025-5-18": "Messe du mois",
    "2025-5-29": "Ascension",
    "2025-6-8": "Pentecôte",
    "2025-6-15": "Messe du mois: La Sainte Trinité",
    "2025-6-22": "Saint Sacrement",
    "2025-6-27": "Sacré-Coeur de Jésus",
    "2025-6-28": "Coeur Immaculée de Marie",
    "2025-6-29": "Saint Pierre et Saint Paul",
    "2025-7-20": "Messe du mois",
    "2025-8-15": "Assomption de Marie"
};

const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function renderCalendar(month, year) {
    calendar.innerHTML = '';
    monthYear.textContent = new Date(year, month).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    // Ajouter les noms des jours de la semaine
    daysOfWeek.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'weekday';
        dayCell.textContent = day;
        calendar.appendChild(dayCell);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day';
        const eventDateKey = `${year}-${month + 1}-${day}`;

        dayCell.innerHTML = `<span>${day}</span>`;
        if (catholicEvents[eventDateKey]) {
            dayCell.classList.add('event');
            dayCell.innerHTML += `<div class="event-name">${catholicEvents[eventDateKey]}</div>`;
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
