<?php
$servername = "localhost"; 
$username = "root";        
$password = "";            
$dbname = "register"; 

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Fetch student data (required fields)
$sql = "SELECT enrollment, total_marks, gpa FROM users";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode(["message" => "No records found."]);
}

$conn->close();
?>
