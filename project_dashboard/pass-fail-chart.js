let passFailChartInstance;

function displayPassFailChart(data, name = "all") {
  const subjects = ["Networks", "Operating System", "Java", "Data Structures", "Database"];
  const passFailData = calculatePassFail(data, name);
  const ctx = document.getElementById("pass-fail-chart").getContext("2d");

  if (passFailChartInstance) passFailChartInstance.destroy();

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
          labels: { color: "#333" }
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
  const result = {
    pass: [0, 0, 0, 0, 0],
    fail: [0, 0, 0, 0, 0],
    notAttended: [0, 0, 0, 0, 0]
  };

  data.forEach(student => {
    if (name === "all" || student.name === name) {
      student.passFail.forEach((status, index) => {
        if (status === "Pass") result.pass[index]++;
        else if (status === "Fail") result.fail[index]++;
        else result.notAttended[index]++;
      });
    }
  });

  return result;
}

// Fetch data from PHP backend
fetch("pass_fail_data.php")
  .then(res => res.json())
  .then(data => {
    if (!data || data.message) {
      console.error("No data returned");
      return;
    }
    displayPassFailChart(data);
  })
  .catch(err => console.error("Fetch error:", err));
