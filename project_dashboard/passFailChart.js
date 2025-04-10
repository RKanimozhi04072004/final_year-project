
const examData = [
    { branch: "Phys. Ed", pass: 258, fail: 22, notAttended: 20 },
    { branch: "Arts", pass: 207, fail: 76, notAttended: 17 },
    { branch: "English", pass: 201, fail: 82, notAttended: 17 },
    { branch: "Science", pass: 195, fail: 82, notAttended: 23 },
    { branch: "Maths", pass: 186, fail: 95, notAttended: 19 },
  ];
  

  const labels = examData.map((data) => data.branch);
  const passData = examData.map((data) => data.pass);
  const failData = examData.map((data) => data.fail);
  const notAttendedData = examData.map((data) => data.notAttended);
  

  const ctx = document.getElementById("pass-fail-chart").getContext("2d");
  
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Pass",
          data: passData,
          backgroundColor: "#FBC02D",
          borderWidth: 1,
        },
        {
          label: "Fail",
          data: failData,
          backgroundColor: "#D32F2F",
          borderWidth: 1,
        },
        {
          label: "Not Attended",
          data: notAttendedData,
          backgroundColor: "#8D6E63",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw} students`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Branches",
            color: "#4CAF50",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Students",
            color: "#4CAF50",
          },
        },
      },
    },
  });
  