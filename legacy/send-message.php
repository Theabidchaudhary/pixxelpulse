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

function respond($code, $payload, $fallbackRedirect = 'index.html') {
  if (is_ajax()) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
  }
  // Fallback (if AJAX is not used)
  $msg = isset($payload['message']) ? $payload['message'] : (($code===200)?'Success':'Failed');
  $err = isset($payload['error']) ? $payload['error'] : '';
  $qs  = 'message=' . urlencode($msg) . ($err ? '&error=' . urlencode($err) : '');

  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(405, ['ok'=>false,'message'=>'Method not allowed']);
}

$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

if ($message === '') {
  respond(422, ['ok'=>false, 'message'=>'Please enter a message before sending.']);
}

try {
  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = 'smtp.gmail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'Theabidchaudhary@gmail.com';   // your Gmail
  $mail->Password   = 'xsfo tkur xuwf msmv';          // your Gmail App Password (no spaces)
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = 587;

  // From / To
  $mail->setFrom('Theabidchaudhary@gmail.com', 'Pixxelpulse Website');
  $mail->addAddress('Theabidchaudhary@gmail.com', 'Abid Fareed');

  // Content
  $mail->isHTML(false);
  $mail->Subject = 'New Footer Message';
  $mail->Body    = "You received a new quick message from the footer:\n\n" . $message;

  $mail->send();
  respond(200, ['ok'=>true, 'message'=>'Message sent successfully!']);
} catch (Exception $e) {
  respond(500, ['ok'=>false, 'message'=>'Something went wrong!.', 'error'=>$e->getMessage()]);
}