<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

function is_ajax() {
  return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
      || (isset($_SERVER['HTTP_ACCEPT']) && stripos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
}
function respond($code, $payload, $fallbackRedirect = 'contact.html') {
  if (is_ajax()) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
  }
  // Fallback for non-AJAX submits
  $msg = isset($payload['message']) ? $payload['message'] : (($code===200)?'Success':'Failed');
  $err = isset($payload['errors']) ? implode(' ', array_values($payload['errors'])) : (isset($payload['error']) ? $payload['error'] : '');
  $qs  = 'message=' . (($code===200)?'Success':'Failed') . ($err ? '&error=' . urlencode($err) : '');
  header('Location: ' . $fallbackRedirect . '?' . $qs);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(405, ['ok'=>false,'message'=>'Method not allowed']);
}

$name    = isset($_POST['name'])    ? trim(strip_tags($_POST['name']))    : '';
$email   = isset($_POST['email'])   ? trim(strip_tags($_POST['email']))   : '';
$phone   = isset($_POST['phone'])   ? trim(strip_tags($_POST['phone']))   : '';
$service = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

$errors = [];
if ($name === '')                                   $errors['name']    = 'Name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))     $errors['email']   = 'Invalid email address.';
if (!preg_match('/^\+[0-9]{7,15}$/', $phone))       $errors['phone']   = 'Phone must include country code, e.g. +923001234567.';
$allowed_services = ['Video Editing','Motion Graphics','Graphics Designing'];
if (!in_array($service, $allowed_services, true))   $errors['service'] = 'Please select a valid service.';
if ($message === '')                                $errors['message'] = 'Message cannot be empty.';

if ($errors) {
  respond(422, ['ok'=>false, 'message'=>'Please correct the highlighted fields.', 'errors'=>$errors]);
}

try {
  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = 'smtp.gmail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'Theabidchaudhary@gmail.com';      // your Gmail
  $mail->Password   = 'xsfo tkur xuwf msmv';             // your Gmail App Password (tip: remove spaces)
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = 587;

  // From / To
  $mail->setFrom('Theabidchaudhary@gmail.com', 'Pixxelpulse Website');
  $mail->addAddress('Theabidchaudhary@gmail.com', 'Abid Fareed');
  $mail->addReplyTo($email, $name);

  // Content
  $mail->isHTML(false);
  $mail->Subject = $service ?: 'New Contact Form Submission';
  $mail->Body    = "Name: $name\nEmail: $email\nPhone: $phone\nService: $service\n\nMessage:\n$message";

  $mail->send();
  respond(200, ['ok'=>true, 'message'=>'Thanks! Your message was sent. We will be in touch very soon.']);
} catch (Exception $e) {
  respond(500, ['ok'=>false, 'message'=>'Sorry, we could not send your message.', 'error'=>$e->getMessage()]);
}