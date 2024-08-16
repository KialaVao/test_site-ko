function openGallery(evt, galleryName) {
    var i, tabcontent, tablinks;
  
    // Cachez toutes les galeries
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Enlevez la classe "active" de tous les onglets
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Affichez la galerie sélectionnée et ajoutez la classe "active" à l'onglet sélectionné
    document.getElementById(galleryName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  
  // Afficher la première galerie par défaut
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tablinks").click();
  });
  