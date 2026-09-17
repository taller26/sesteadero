<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Acceso no permitido."]);
    exit;
}

// Reemplazar por la dirección de correo que recibirá los mensajes
$destino = "tu-correo@midominio.com"; 

// Captura y saneamiento de datos
$nombre   = trim($_POST['nombre'] ?? '');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefono = trim($_POST['telefono'] ?? '');
$asunto   = trim($_POST['asunto'] ?? '');
$mensaje  = trim($_POST['mensaje'] ?? '');

// Validación del lado del servidor
if (empty($nombre) || empty($email) || empty($telefono) || empty($asunto) || empty($mensaje)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Formato de correo no válido."]);
    exit;
}

if (!preg_match("/^[0-9]+$/", $telefono)) {
    echo json_encode(["status" => "error", "message" => "El número de teléfono solo debe contener dígitos."]);
    exit;
}

// Estructura del mensaje
$mailSubject = "Contacto Web: " . htmlspecialchars($asunto);
$mailBody    = "Has recibido un nuevo mensaje desde el formulario:\n\n";
$mailBody   .= "Nombre: $nombre\n";
$mailBody   .= "Correo: $email\n";
$mailBody   .= "Teléfono: $telefono\n";
$mailBody   .= "Asunto: $asunto\n\n";
$mailBody   .= "Mensaje:\n$mensaje\n";

// Cabeceras del correo
$headers  = "From: no-reply@" . $_SERVER['HTTP_HOST'] . "\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Envío final mediante función mail native
if (mail($destino, $mailSubject, $mailBody, $headers)) {
    echo json_encode(["status" => "success", "message" => "¡Mensaje enviado con éxito!"]);
} else {
    echo json_encode(["status" => "error", "message" => "No se pudo enviar el correo desde el servidor."]);
}
?>