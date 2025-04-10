<?php

$servername = "localhost"; 
$username = "root";        
$password = "";            
$dbname = "register"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $id = isset($_POST['id']) ? $_POST['id'] : '';

  
    if (!empty($name) && !empty($id)) {
       
        $sql = "SELECT * FROM users WHERE (name = ? OR parent=?) AND studentid = ?";

        // Prepare and bind parameters
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("ssi", $name,$name, $id); // "si" means string, integer
            $stmt->execute();

            // Get the result
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $data = $result->fetch_assoc(); 
                echo json_encode($data); 
            } else {
                echo json_encode(array("message" => "No records found."));
            }

           
            $stmt->close();
        }
    } else {
        echo json_encode(array("message" => "Invalid input parameters."));
    }

 
    $conn->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // SELECT query to fetch data from a table
    $sql = "SELECT * from users"; 
    $result = $conn->query($sql);

    
    if ($result->num_rows > 0) {
        // Create an array to store data
        $data = array();

        // Fetch data row by row
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        echo json_encode(array("message" => "No records found."));
    }

  
    $conn->close();
}
?> 
