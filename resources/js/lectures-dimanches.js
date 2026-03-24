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

    async function fetchLecturesTitles(date) {
        const apiUrl = `https://api.aelf.org/v1/messes/${date}/${zone}`;
        console.log("Fetching data from API:", apiUrl);

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            console.log(`Data received for ${date}:`, data);

            if (data.messes && data.messes.length > 0) {
                const messe = data.messes[0];
                const lectures = messe.lectures || [];

                const titres = lectures.map(lecture => {
                    return `<li><strong>${lecture.type}</strong> : ${lecture.titre}</li>`;
                }).join("");

                return `
                    <div class="jour-lecture">
                        <h3>${date}</h3>
                        <ul>
                            ${titres}
                        </ul>
                    </div>
                `;
            } else {
                return `
                    <div class="jour-lecture">
                        <h3>${date}</h3>
                        <p>Aucune messe trouvée pour cette date.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error(`Erreur pour la date ${date}:`, error);
            return `
                <div class="jour-lecture">
                    <h3>${date}</h3>
                    <p>Erreur de chargement.</p>
                </div>
            `;
        }
    }

    async function loadAllLectures() {
        container.innerHTML = "<p>Chargement des lectures...</p>";

        const results = await Promise.all(dates.map(date => fetchLecturesTitles(date)));
        container.innerHTML = results.join("");
    }

    loadAllLectures();
});