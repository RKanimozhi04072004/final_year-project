<?php
$servername = "localhost"; 
$username = "root";        
$password = "";            
$dbname = "register"; 

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $type = isset($_GET['type']) ? $_GET['type'] : '';

    switch ($type) {
        case 'marks':
            $sql = "SELECT name, network_mark, os_mark, java_mark, dsa_mark, db_mark FROM users";
            break;

        case 'passfail':
            $sql = "SELECT name, network_p_f, os_p_f, java_p_f, dsa_p_f, db_p_f FROM users";
            break;

        case 'grades':
            $sql = "SELECT name, network_grade, os_grade, java_grade, dsa_grade, db_grade FROM users";
            break;

        case 'clubs':
            $sql = "SELECT name, chess_club, science_club, student_club, ncc_club FROM users";
            break;

        case 'attendance':
            $sql = "SELECT name, attendance FROM users";
            break;

        case 'all':
            $sql = "SELECT * FROM users";
            break;

        case 'topper':
            $sql = "SELECT name, total_marks FROM users ORDER BY total_marks DESC LIMIT 10";
            break;

        case 'groupby_club':
            $sql = "
                SELECT 'Chess Club' AS club, COUNT(*) AS count FROM users WHERE chess_club = 'Yes'
                UNION
                SELECT 'Science Club', COUNT(*) FROM users WHERE science_club = 'Yes'
                UNION
                SELECT 'Student Club', COUNT(*) FROM users WHERE student_club = 'Yes'
                UNION
                SELECT 'NCC Club', COUNT(*) FROM users WHERE ncc_club = 'Yes'
            ";
            break;

        case 'average_marks':
            $sql = "
                SELECT 
                    AVG(network_mark) AS avg_network,
                    AVG(os_mark) AS avg_os,
                    AVG(java_mark) AS avg_java,
                    AVG(dsa_mark) AS avg_dsa,
                    AVG(db_mark) AS avg_db
                FROM users
            ";
            break;

        case 'failed_students':
            $sql = "
                SELECT name, studentid, network_p_f, os_p_f, java_p_f, dsa_p_f, db_p_f 
                FROM users 
                WHERE network_p_f = 'Fail' OR os_p_f = 'Fail' OR java_p_f = 'Fail' OR dsa_p_f = 'Fail' OR db_p_f = 'Fail'
            ";
            break;

        default:
            echo json_encode(["error" => "Invalid query type."]);
            exit;
    }

    $result = $conn->query($sql);
    $data = [];

    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode(["message" => "No records found."]);
    }

    $conn->close();
}
?>
