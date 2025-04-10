let allData = [];
let chartInstance;

document.getElementById("file-input").addEventListener("change", function(event) {
  const file = event.target.files[0];
console.log("script2");
  if (file && file.type === "text/csv") {
    const reader = new FileReader();

    reader.onload = function(e) {
      const csvData = e.target.result;
      allData = parseCSVData(csvData);
      populateStudentDropdown(allData);
      displayStudentTable(allData);
      displayOverallPerformance(allData);
    };

    reader.readAsText(file);
  } else {
    alert("Please upload a valid CSV file.");
  }
});

document.getElementById("student-dropdown").addEventListener("change", function(event) {
  const selectedName = event.target.value;

  if (selectedName === "all") {
    displayStudentTable(allData);
    displayOverallPerformance(allData);
  } else {
    const filteredData = allData.filter(student => student.name === selectedName);
    displayStudentTable(filteredData);
    displayIndividualPerformance(allData, selectedName);
  }
});

function parseCSVData(csvData) {
  const rows = csvData.split("\n").map(row => row.split(","));
  const header = rows[0];

  const requiredIndexes = {
    id: header.indexOf("Student ID"),
    name: header.indexOf("Name"),
    gender: header.indexOf("Gender"),
    nationality: header.indexOf("Nationality"),
    email: header.indexOf("Email"),
    phone: header.indexOf("Phone Number"),
    attendance: header.indexOf("Attendance"),
    networks: header.indexOf("Networks Marks"),
    os: header.indexOf("Operating System Marks"),
    java: header.indexOf("Java Marks"),
    ds: header.indexOf("Data Structures Marks"),
    db: header.indexOf("Database Marks")
  };

  return rows.slice(1).map(row => ({
    id: row[requiredIndexes.id],
    name: row[requiredIndexes.name],
    gender: row[requiredIndexes.gender],
    nationality: row[requiredIndexes.nationality],
    email: row[requiredIndexes.email],
    phone: row[requiredIndexes.phone],
    attendance: row[requiredIndexes.attendance],
    marks: {
      networks: parseInt(row[requiredIndexes.networks] || 0),
      os: parseInt(row[requiredIndexes.os] || 0),
      java: parseInt(row[requiredIndexes.java] || 0),
      ds: parseInt(row[requiredIndexes.ds] || 0),
      db: parseInt(row[requiredIndexes.db] || 0)
    }
  }));
}


function populateStudentDropdown(data) {
  const dropdown = document.getElementById("student-dropdown");
  dropdown.innerHTML = '<option value="all">All Students</option>';

  data.forEach(student => {
    const option = document.createElement("option");
    option.value = student.name;
    option.textContent = student.name;
    dropdown.appendChild(option);
  });
}

function displayStudentTable(data) {
  const tableHead = document.querySelector("#student-table thead tr");
  const tbody = document.querySelector("#student-table tbody");

  // Clear the table
  tableHead.innerHTML = "";
  tbody.innerHTML = "";

 
  if (data.length > 0) {
    const headers = Object.keys(data[0]).concat(Object.keys(data[0].marks));
    headers.forEach(header => {
      const th = document.createElement("th");
      th.textContent = header === "marks" ? "" : header.replace(/_/g, " ").toUpperCase();
      tableHead.appendChild(th);
    });
  }

  data.forEach(student => {
    const row = document.createElement("tr");
    const values = { ...student, ...student.marks };

    Object.values(values).forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}

function displayOverallPerformance(data) {
  const subjects = ["Networks", "Operating System", "Java", "Data Structures", "Database"];
  const totalMarks = Array(subjects.length).fill(0);

  data.forEach(student => {
    totalMarks[0] += student.marks.networks;
    totalMarks[1] += student.marks.os;
    totalMarks[2] += student.marks.java;
    totalMarks[3] += student.marks.ds;
    totalMarks[4] += student.marks.db;
  });

  const averageMarks = totalMarks.map(total => Math.round(total / data.length));
  updateChart(subjects, averageMarks, "Average Marks of All Students");
}

function displayIndividualPerformance(data, name) {
  const student = data.find(student => student.name === name);

  if (student) {
    const subjects = ["Networks", "Operating System", "Java", "Data Structures", "Database"];
    const marks = [
      student.marks.networks,
      student.marks.os,
      student.marks.java,
      student.marks.ds,
      student.marks.db
    ];
    updateChart(subjects, marks, `Marks of ${name}`);
  }
}

function updateChart(labels, data, title) {
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
