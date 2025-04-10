<?php
// Return JSON response
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "register"; // Update with your database name

// Check if student_id is passed
if (!isset($_GET['student_id'])) {
    echo json_encode(["error" => "Student ID is required"]);
    exit;
}

$student_id = intval($_GET['student_id']); 

// Connect to MySQL database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check database connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Prepare and execute SQL query
$sql = "SELECT * FROM students WHERE StudentID = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "SQL Error: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Career prediction logic
    $career = ($row['JavaMarks'] > 80) ? "Software Engineer" : "Data Analyst";
    $certifications = ($career == "Software Engineer") ? "Java Certification, Full Stack Course" : "Data Science, SQL Certification";
    $internships = ($career == "Software Engineer") ? "Google Internship, Microsoft Internship" : "IBM Data Science Internship";

    // Subject scores
    $subjects = ["Networks", "Operating System", "Java", "Database"];
    $scores = [$row['NetworksMarks'], $row['OperatingSystemMarks'], $row['JavaMarks'], $row['DatabaseMarks']];

    echo json_encode([
        "career" => $career,
        "certifications" => $certifications,
        "internships" => $internships,
        "subjects" => $subjects,
        "scores" => $scores
    ]);
} else {
    echo json_encode(["error" => "Student not found"]);
}

$stmt->close();
$conn->close();
?>
