document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            {
                title: 'Messe mensuelle',
                start: '2024-07-21T10:30:00',
                end: '2024-07-21T12:00:00',
                description: 'Messe tous les 3èmes dimanches du mois'
            },
            {
                title: 'Saint Antoine',
                start: '2024-07-01'
            },
            {
                title: 'Saint Pierre',
                start: '2024-07-02'
            },
            {
                title: 'Saint Paul',
                start: '2024-07-03'
            }
            // Ajoutez plus d'événements ici
        ],
        eventClick: function(info) {
            alert(info.event.title + "\n" + info.event.start.toISOString());
        }
    });
    calendar.render();
});