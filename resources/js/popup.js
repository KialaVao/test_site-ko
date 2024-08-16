document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('eventPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupDescription = document.getElementById('popupDescription');
    const closeButton = document.querySelector('.close');

    // Fonction pour ouvrir le pop-up avec les détails de l'événement
    function openPopup(eventTitle) {
        popupTitle.textContent = eventTitle;
        popupDescription.textContent = `Détails de l'événement : ${eventTitle}`; // Vous pouvez personnaliser ce texte
        popup.style.display = 'flex'; // Afficher le pop-up
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

    // Modification de la fonction renderCalendar pour gérer les clics sur les dates avec événements
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

                // Ajout d'un événement de clic pour ouvrir le pop-up
                dayCell.addEventListener('click', function () {
                    openPopup(catholicEvents[eventDateKey]);
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

    // Gestion des boutons de changement de mois
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    renderCalendar(currentMonth, currentYear);
});
