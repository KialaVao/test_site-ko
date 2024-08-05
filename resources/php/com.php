<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    $to = "ktomalagasyrennes@gmail.com"; // Remplacez par l'adresse email de votre église
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    $email_subject = "Nouveau message de contact: $subject";
    $email_body = "Vous avez reçu un nouveau message de la part de $name.\n\n".
                  "Voici les détails:\n\nNom: $name\n\n".
                  "Email: $email\n\n".
                  "Sujet: $subject\n\n".
                  "Message:\n$message";

    if (mail($to, $email_subject, $email_body, $headers)) {
        echo "Merci, votre message a été envoyé.";
    } else {
        echo "Erreur, votre message n'a pas pu être envoyé.";
    }
}
?>
