import flask
from flask import request, jsonify
import joblib
import numpy as np

# Initialize the Flask application
app = flask.Flask(__name__)

# Load the trained model (assume the model is already trained and saved as 'student_performance_model.pkl')
model = joblib.load('student_data_800_rows.pkl')

@app.route('/')
def home():
    return "Welcome to the Student Performance Prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the request
    data = request.get_json()

    attendance = float(data['attendance'])
    study_hours = float(data['studyHours'])
    previous_grade = float(data['previousGrade'])

    # Prepare the input data as a numpy array (match the model's expected input format)
    input_data = np.array([[attendance, study_hours, previous_grade]])

    # Make the prediction using the loaded model
    prediction = model.predict(input_data)

    # Return the prediction as a response
    return jsonify({
        'prediction': 'Pass' if prediction[0] == 1 else 'Fail'  # Assuming the model predicts 1 for pass, 0 for fail
    })

if __name__ == '__main__':
    app.run(debug=True)
