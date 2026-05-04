<?php
// ТИМЧАСОВО вмикаємо всі помилки на повну
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// Перевіряємо, чи є файл бази
if (!file_exists('db.php')) {
    echo json_encode(["status" => "error", "message" => "Файл db.php не знайдено"]);
    exit;
}

require_once 'db.php';

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "JSON порожній"]);
    exit;
}

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Шукаємо юзера (перевір, щоб назви колонок id, first_name, password були як у базі!)
$sql = "SELECT id, first_name, password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Помилка бази: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Користувача не знайдено"]);
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => "success",
        "message" => "Вхід успішний",
        "user_name" => $user['first_name']
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Неправильний пароль"]);
}

$stmt->close();
$conn->close();
?>