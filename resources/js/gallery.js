function openAlbum(albumId) {
    // Sélectionnez tous les albums et cachez-les
    var albums = document.getElementsByClassName('album-content');
    for (var i = 0; i < albums.length; i++) {
        albums[i].style.display = 'none';
    }

    // Affichez le contenu de l'album cliqué
    document.getElementById(albumId).style.display = 'block';
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Ferme la modale si l'utilisateur clique en dehors de celle-ci
window.onclick = function(event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}