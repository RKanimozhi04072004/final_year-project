import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# Load data
df = pd.read_csv('data/student_data_800_rows.csv')

# Prepare features (marks) and labels (pass/fail)
X = df[['Networks Marks', 'Operating System Marks', 'Java Mark', 'Data Structures Mark', 'Database Mark']]
y = df['Pass/Fail'].apply(lambda x: 1 if x == 'Pass' else 0)


model = RandomForestClassifier()
model.fit(X, y)

