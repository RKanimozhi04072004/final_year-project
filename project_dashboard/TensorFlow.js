
  // Assuming you have a CSV file that includes student data with marks and pass/fail labels
  let allData = []; // This will store the processed data

  // Load and process CSV data
  document.getElementById("file-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = function(e) {
        const csvData = e.target.result;
        allData = parseCSVData(csvData);
        // Process the data for training
        trainModel(allData);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  });

  // Function to parse the CSV file and extract features (marks) and labels (grade)
  function parseCSVData(csvData) {
    const rows = csvData.split("\n").map(row => row.split(","));
    const header = rows[0];

    const marksColumns = ["Networks Marks", "Operating System Marks", "Java Marks", "Data Structures Marks", "Database Marks"];
    const marksIndex = marksColumns.map(column => header.indexOf(column));
    const gradeIndex = header.indexOf("Grade");

    return rows.slice(1).map(row => {
      return {
        marks: marksIndex.map(index => parseFloat(row[index])), // Get marks
        grade: row[gradeIndex] === "Pass" ? 1 : 0 // Convert "Pass" to 1, "Fail" to 0
      };
    });
  }

  // Function to train the model using TensorFlow.js
  async function trainModel(data) {
    // Prepare the features (marks) and labels (grade)
    const features = data.map(d => d.marks);
    const labels = data.map(d => d.grade);

    // Convert the data into tensors
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels, [labels.length, 1]);

    // Build a simple model
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 5, inputShape: [5], activation: 'relu'})); // 5 subjects as input
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'})); // Output layer for classification (0 or 1)

    // Compile the model
    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    // Train the model
    await model.fit(xs, ys, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      shuffle: true
    });

    // Test the model
    testModel(model, data);
  }

  // Function to test the trained model
  async function testModel(model, data) {
    const testFeatures = data.map(d => d.marks);
    const testLabels = data.map(d => d.grade);

    const testXs = tf.tensor2d(testFeatures);
    const testYs = tf.tensor2d(testLabels, [testLabels.length, 1]);

    const evaluation = model.evaluate(testXs, testYs);
    console.log(`Test loss: ${evaluation[0].dataSync()}`);
    console.log(`Test accuracy: ${evaluation[1].dataSync()}`);
    
    // Use the model to make predictions
    const predictions = model.predict(testXs);
    predictions.print();
  }

  // Optional: Function to use the trained model for predicting new student data
  async function predictGrade(model, newStudentMarks) {
    const prediction = model.predict(tf.tensor2d([newStudentMarks]));
    prediction.print(); // This will output the predicted grade (0 or 1)
  }

