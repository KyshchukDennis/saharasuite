<?php
header("Content-Type: application/json");

// 1. ПЕРЕВІРКА ПІДКЛЮЧЕННЯ
if (!file_exists('db.php')) {
    echo json_encode(["status" => "error", "message" => "Файл db.php не знайдено в папці api!"]);
    exit;
}
require_once 'db.php';

// 2. ОТРИМАННЯ ДАНИХ
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "JSON порожній. Перевір main.js"]);
    exit;
}

// 3. ПІДГОТОВКА ЗМІННИХ
$first_name = $data['first_name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$phone = $data['phone'] ?? '000';

if (empty($first_name) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Одне з полів порожнє в JSON"]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// 4. ЗАПИТ ДО БАЗИ
try {
    $stmt = $conn->prepare("INSERT INTO users (first_name, phone, email, password) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Помилка SQL (перевір назви колонок): " . $conn->error]);
        exit;
    }

    $stmt->bind_param("ssss", $first_name, $phone, $email, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Реєстрація успішна для " . $first_name]);
    } else {
        echo json_encode(["status" => "error", "message" => "Помилка бази (можливо, email вже є): " . $stmt->error]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Критична помилка: " . $e->getMessage()]);
}

$conn->close();
?>