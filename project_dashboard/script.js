console.log("project");
let allData = [];
let chartInstance, passFailChartInstance,clubChartInstance;
document.getElementById("student-dropdown").addEventListener("change", function(event) {
  const selectedName = event.target.value;
  console.log("hii");
  if (selectedName === "all") {
    displayOverallPerformance(allData);
    displayAverageScores(allData);

  } else {
    displayIndividualPerformance(allData, selectedName);
    displayAverageScores([allData.find(student => student.name === selectedName)]);
  }
});

function parseCSVData() {
 
let result=JSON.parse(localStorage.getItem("collegeData"));
console.log("res",result);
  

allData = result.map(row => ({
    name: row.name,
    marks:[parseInt(row.metwork_mark),parseInt(row.os_mark),parseInt(row.java_mark),parseInt(row.dsa_mark),parseInt(row.db_mark)],
    passFail:[row.network_p_f,row.os_p_f,row.java_p_f,row.dsa_p_f,row.db_p_f],
    attendance: [row.network_grade,row.os_grade,row.java_grade,row.dsa_grade,row.db_grade],
    clubs:[row.chess_club=="Yes"?1:0,row.science_club=="Yes"?1:0,row.student_club=="Yes"?1:0,row.ncc_club=="Yes"?1:0]
  }));
 
  console.log("allData",allData);
    populateStudentDropdown(allData);
    displayOverallPerformance(allData);
    displayAverageScores(allData);
    displayPassFailChart(allData);
    displayClubPerformance(allData);
}
function displayClubPerformance(data) {
  console.log("club");
  const clubs = ["Chess Club", "Science Club", "Student Club", "NCC Club"];
  const totalCounts = Array(clubs.length).fill(0);

  data.forEach(student => {
    student.clubs.forEach((value, index) => {
      totalCounts[index] += value; 
    });
  });

  updateClubChart(clubs, totalCounts);
}


function updateClubChart(labels, data) {
  console.log("updateclub");
  const ctx = document.getElementById("club-performance-chart").getContext("2d");

  if (clubChartInstance) {
    clubChartInstance.destroy();
  }

  clubChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Club Performance",
        data: data,
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A8"],
        borderColor: "#000",
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y', 
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}



function populateStudentDropdown(data) {
  console.log("studentdropdown");
  const dropdown = document.getElementById("student-dropdown");
  dropdown.innerHTML = '<option value="all">All Students</option>';

  data.forEach(student => {
    const option = document.createElement("option");
    option.value = student.name;
    option.textContent = student.name;
    dropdown.appendChild(option);
  });
}

function displayOverallPerformance(data) {
  console.log("display");
  const subjects = ["Networks", "Operating System", "Java", "Data Structures", "Database"];
  const totalMarks = Array(subjects.length).fill(0);

  data.forEach(student => {
    student.marks.forEach((mark, index) => {
      totalMarks[index] += mark;
    });
  });

  const averageMarks = totalMarks.map(total => Math.round(total / data.length));
  updateChart(subjects, averageMarks, "Average Marks of All Students");
}

function displayIndividualPerformance(data, name) {
  console.log("displayindividual");
  const student = data.find(student => student.name === name);

  if (student) {
    const subjects = ["Networks", "Operating System", "Java", "Data Structures", "Database"];
    updateChart(subjects, student.marks, `Marks of ${name}`);
  }
}

function updateChart(labels, data, title) {
  console.log("updatechart");
  const ctx = document.getElementById("marks-chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: data,
          backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0"],
          borderColor: ["#388E3C", "#1976D2", "#FFA000", "#D84315", "#7B1FA2"],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "#333"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Marks"
          }
        }
      }
    }
  });
}
function displayGradeDistribution(data, name = "all") {
  const gradeLabels = ["A", "B", "C", "D", "F"];
  const gradeCounts = [0, 0, 0, 0, 0];  


  const gradeThresholds = {
    "A": 90,
    "B": 80,
    "C": 70,
    "D": 60,
    "F": 0
  };


  function getGrade(mark) {
    console.log("grade");
    if (mark >= gradeThresholds["A"]) return "A";
    if (mark >= gradeThresholds["B"]) return "B";
    if (mark >= gradeThresholds["C"]) return "C";
    if (mark >= gradeThresholds["D"]) return "D";
    return "F";
  }


  data.forEach(student => {
    if (name === "all" || student.name === name) {
      student.marks.forEach(mark => {
        const grade = getGrade(mark);
        gradeCounts[gradeLabels.indexOf(grade)]++;
      });
    }
  });

  const ctx = document.getElementById("grade-distribution-chart").getContext("2d");

  const gradeChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: gradeLabels,
      datasets: [{
        label: "Grade Distribution",
        data: gradeCounts,
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#333"
          }
        }
      }
    }
  });
}

function displayPassFailChart(data, name = "all") {
  console.log("passfail");
  const subjects = ["Networks", "Operating System", "Java", "Data Structures", "Database"];
 
  const passFailData = calculatePassFail(data, name);
  
  const ctx = document.getElementById("pass-fail-chart").getContext("2d");

  if (passFailChartInstance) {
    passFailChartInstance.destroy();
  }

  passFailChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: subjects,
      datasets: [
        {
          label: "Pass",
          data: passFailData.pass,
          backgroundColor: "#4CAF50"
        },
        {
          label: "Fail",
          data: passFailData.fail,
          backgroundColor: "#FF5722"
        },
        {
          label: "Not Attended",
          data: passFailData.notAttended,
          backgroundColor: "#FF0000"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#333"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Students"
          }
        }
      }
    }
  });
}

function calculatePassFail(data, name) {
  console.log("calculatepassFail");
  const result = {
    pass: [0, 0, 0, 0, 0],
    fail: [0, 0, 0, 0, 0],
    notAttended: [0, 0, 0, 0, 0]
  };

  const subjectsCount = result.pass.length;

  data.forEach(student => {
    if (name === "all" || student.name === name) {
      student.passFail.forEach((status, index) => {
      
        if (status === "Pass") {
          result.pass[index]++;
        } else if (status === "Fail") {
          result.fail[index]++;
        } else if (status=== "Not Attended") {
          result.notAttended[index]++;
        }
      });
    }
  });

  return result;
}


function displayAverageScores(data) {

  const subjects = ["Networks", "Operating System", "Java", "Data Structures", "Database"];
  const totalMarks = Array(subjects.length).fill(0);

  data.forEach(student => {
    student.marks.forEach((mark, index) => {
      totalMarks[index] += mark;
    });
  });


  const averageMarks = totalMarks.map(total => Math.round(total / data.length));

  const averageScoresElement = document.getElementById("average-scores");
  averageScoresElement.innerHTML = "";

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");

  const header = subjects.map(subject => {
    const th = document.createElement("th");
    th.textContent = subject;
    return th;
  });

  headerRow.append(...header);
  table.appendChild(headerRow);

  const avgRow = document.createElement("tr");
  averageMarks.forEach(mark => {
    const td = document.createElement("td");
    td.textContent = mark;
    avgRow.appendChild(td);
  });

  table.appendChild(avgRow);
  averageScoresElement.appendChild(table);
}
document.getElementById("student-dropdown").addEventListener("change", function(event) {
  const selectedName = event.target.value;

  if (selectedName === "all") {
    displayOverallPerformance(allData); 
    displayAverageScores(allData);
    displayGradeDistribution(allData); 
  } else {
    displayIndividualPerformance(allData, selectedName);
    displayAverageScores([allData.find(student => student.name === selectedName)]);
    displayGradeDistribution(allData, selectedName); 
  }
});
console.log("updated..............");

// Fetch and store data from PHP by type
// function fetchDataByType(type, callback) {
//   fetch(`db_index.php?type=${type}`)
//       .then(res => res.json())
//       .then(data => {
//           console.log(`${type} data:`, data);
//           localStorage.setItem(`${type}Data`, JSON.stringify(data));
//           if (callback) callback(data);
//       })
//       .catch(err => console.error(`Error fetching ${type} data:`, err));
// }

// // Example: Fetch marks data and draw chart
// fetchDataByType('marks', drawMarksChart);

// // You can repeat this for 'grades', 'passfail', 'clubs', etc.

// // Chart example (just console.log for now)
// function drawMarksChart(data) {
//   data.forEach(student => {
//       console.log(`${student.name}'s marks - Networks: ${student.network_mark}, OS: ${student.os_mark}`);
//       // Use this to build charts later
//   });

//   // Here you can integrate with Chart.js, Recharts, or plain DOM elements
// }

// // // To fetch other types:
// // fetchDataByType('grades', processGrades);
// // fetchDataByType('clubs', processClubs);
// // fetchDataByType('passfail', processPassFail);
// // fetchDataByType('attendance', processAttendance);

// // // Example handler function for grades
// // function processGrades(data) {
// //   console.log("Grades:", data);
// //   // Build grade chart here
// // }

// // console.log("this is updated");