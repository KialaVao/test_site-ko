const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Exemple d'événements catholiques
const catholicEvents = {
    "2024-1-1": "Sainte Marie, Mère de Dieu",
    "2024-4-21": "Pâques",
    "2024-5-30": "Ascension",
    "2024-6-9": "Pentecôte",
    "2024-8-15": "Assomption de Marie",
    "2024-9-15": "Messe du mois",
    "2024-10-20": "Messe du mois",
    "2024-11-1": "Toussaint",
    "2024-11-17": "Messe du mois",
    "2024-12-25": "Noël"
};

function renderCalendar(month, year) {
    calendar.innerHTML = '';
    monthYear.textContent = new Date(year, month).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.className = 'day';
        const eventDateKey = `${year}-${month + 1}-${day}`;

        if (catholicEvents[eventDateKey]) {
            dayCell.classList.add('event');
            dayCell.title = catholicEvents[eventDateKey];
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
