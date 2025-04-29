# pulse-image-alert-main


# CardioDetect AI: ML-Based Cardiovascular Disease Detection

A web application for detecting cardiovascular diseases from ECG images using machine learning.

## About this Project

This application demonstrates how machine learning can be used to analyze electrocardiogram (ECG) images and detect potential cardiovascular conditions. It includes:

- ECG image upload and preview functionality
- ML-based analysis of ECG patterns
- Results visualization with confidence scores and risk assessment
- Analysis history tracking

## Project Structure

- **Frontend**: Built with React, TypeScript, and Tailwind CSS
- **Backend**: Python Flask server for ECG image analysis
- **ML Model**: Simulated machine learning predictions (can be replaced with real models)
- **UI Components**: Uses shadcn/ui component library
- **State Management**: React Query for data fetching

## How to Use

### Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```
   The server will run on http://localhost:5000

### Setup Frontend

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

### Using the Application

1. Upload an ECG image using the file uploader or drag-and-drop
2. The system will automatically analyze the image using the Python backend
3. View the detailed analysis results with confidence scores
4. Check previous analyses in the History tab

## Technical Notes

The Flask backend includes:
- API endpoints for image analysis
- ECG condition prediction with simulated ML model
- History tracking functionality

In a production environment, this would be enhanced with:
- Real trained ML models for ECG analysis
- User authentication and authorization
- Database integration for patient data
- HTTPS and proper security measures

## Development with Docker

You can also run the backend using Docker:

```bash
cd backend
docker build -t cardiodetect-backend .
docker run -p 5000:5000 cardiodetect-backend
