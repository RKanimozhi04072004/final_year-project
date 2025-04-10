<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "register";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to count students in each club
$sql = "SELECT 
    COUNT(CASE WHEN chess_club = 'yes' THEN 1 END) AS chess,
    COUNT(CASE WHEN science_club = 'yes' THEN 1 END) AS science,
    COUNT(CASE WHEN student_club = 'yes' THEN 1 END) AS student,
    COUNT(CASE WHEN ncc_club = 'yes' THEN 1 END) AS ncc
    FROM users";

$result = $conn->query($sql);
$data = $result->fetch_assoc();

echo json_encode($data);

$conn->close();
?>
