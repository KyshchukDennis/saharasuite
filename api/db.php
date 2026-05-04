<?php
// Налаштування підключення до бази даних
$host = "localhost";    // Твій локальний сервер
$user = "root";         // Стандартний логін у XAMPP
$pass = "";             // У XAMPP пароль зазвичай порожній
$dbname = "sahara_db";  // Назва бази, яку ти створив у phpMyAdmin

// Створюємо з'єднання
$conn = mysqli_connect($host, $user, $pass, $dbname);

// Перевірка з'єднання
if (!$conn) {
    // Якщо підключитися не вдалося, повертаємо JSON з помилкою (для JS)
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "error",
        "message" => "Не вдалося підключитися до бази даних: " . mysqli_connect_error()
    ]);
    exit();
}

// Встановлюємо кодування UTF-8, щоб українські імена (Денис, Сергій тощо) відображалися коректно
mysqli_set_charset($conn, "utf8mb4");
if ($conn) {
    // echo "З'єднання встановлено!"; 
} else {
    die("З'єднання не вдалося: " . mysqli_connect_error());
}