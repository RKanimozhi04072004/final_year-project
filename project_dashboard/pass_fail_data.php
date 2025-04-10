<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$password = "";
$dbname = "register";

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit();
}

// Each subject has a pass/fail/not attended field like "NetworksPassFail", etc.
$sql = "
SELECT 
    NetworksGrade, 
    OperatingSystemGrade, 
    JavaGrade, 
    DataStructuresGrade, 
    DatabaseGrade,
    Name
FROM users
";

$result = $conn->query($sql);
$data = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "name" => $row["Name"],
            "passFail" => [
                $row["NetworksGrade"],
                $row["OperatingSystemGrade"],
                $row["JavaGrade"],
                $row["DataStructuresGrade"],
                $row["DatabaseGrade"]
            ]
        ];
    }
    echo json_encode($data);
} else {
    echo json_encode(["message" => "No student records found."]);
}

$conn->close();
?>
