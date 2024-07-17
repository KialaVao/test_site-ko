<script>
    document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: function(fetchInfo, successCallback, failureCallback) {
                fetch('https://api.liturgical.com/saints') // Remplacez par l'URL de votre API
                    .then(response => response.json())
                    .then(data => {
                        var events = data.map(event => {
                            return {
                                title: event.saint,
                                start: event.date
                            };
                        });
                        successCallback(events);
                    })
                    .catch(error => {
                        failureCallback(error);
                    });
            },
            eventClick: function(info) {
                alert(info.event.title + "\n" + info.event.start.toISOString());
            }
        });
        calendar.render();
    });
</script>