import numpy as np
import random
from PIL import Image
import cv2
def preprocess_image(image_path):
    """
    Preprocess an ECG image for model input.
    Simulates grayscale conversion and basic thresholding.
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            print(f"[ERROR] Could not read image at: {image_path}")
            return False
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
        return True
    except Exception as e:
        print(f"[ERROR] Preprocessing failed: {e}")
        return False
def detect_ecg_type(image_path):
    """
    Detect if an image is likely to be a formatted ECG report
    using basic heuristics based on dimensions.
    """
    try:
        img = Image.open(image_path)
        width, height = img.size
        is_ecg_report = (width > height) and (width / height > 1.5)
        return {
            "is_ecg_report": is_ecg_report,
            "image_width": width,
            "image_height": height
        }
    except Exception as e:
        print(f"[ERROR] ECG type detection failed: {e}")
        return {
            "is_ecg_report": False,
            "error": str(e)
        }
def predict_ecg_condition(image_path):
    """
    Simulates ECG condition classification.
    Replace with a trained ML model for real use.
    """
    if not preprocess_image(image_path):
        return {"error": "Image preprocessing failed or invalid image format"}
    ecg_type_info = detect_ecg_type(image_path)
    ecg_conditions = [
        {
            'name': 'Normal Sinus Rhythm',
            'confidence': random.randint(88, 96),
            'risk': 'low',
            'details': [
                'Normal P waves preceding each QRS complex',
                'Regular RR intervals',
                'Normal QRS duration (0.08–0.10 sec)',
                'No significant ST segment abnormalities'
            ]
        },
        {
            'name': 'Atrial Fibrillation',
            'confidence': random.randint(83, 92),
            'risk': 'medium',
            'details': [
                'Irregular RR intervals',
                'Absence of distinct P waves',
                'Presence of fibrillatory waves',
                'Moderate risk of stroke'
            ]
        },
        {
            'name': 'Myocardial Infarction',
            'confidence': random.randint(75, 88),
            'risk': 'high',
            'details': [
                'ST elevation in multiple leads',
                'Pathological Q waves',
                'T wave inversions',
                'Reciprocal ST depression'
            ]
        },
        {
            'name': 'Left Bundle Branch Block',
            'confidence': random.randint(82, 94),
            'risk': 'medium',
            'details': [
                'Wide QRS (>0.12 sec)',
                'Absence of Q waves in I, V5, V6',
                'Notched/slurred R waves',
                'ST-T changes in opposite direction'
            ]
        },
        {
            'name': 'Ventricular Tachycardia',
            'confidence': random.randint(79, 90),
            'risk': 'high',
            'details': [
                'Wide QRS complexes',
                'Heart rate >100 bpm',
                'AV dissociation',
                'Medical emergency – call for help'
            ]
        }
    ]
    try:
        img = Image.open(image_path)
        width, height = img.size
        if width > 1500 and height > 1000 and width / height > 1.5:
            return {
                'prediction': 'Normal Sinus Rhythm',
                'confidence': 95,
                'risk': 'low',
                'details': [
                    'Normal P waves preceding each QRS complex',
                    'Regular RR intervals (75–85 bpm)',
                    'Normal QRS duration (0.08–0.10 sec)',
                    'No significant ST segment abnormalities',
                    'Normal T wave morphology'
                ],
                'ecg_type': ecg_type_info
            }
        selected = random.choice(ecg_conditions)
        return {
            'prediction': selected['name'],
            'confidence': selected['confidence'],
            'risk': selected['risk'],
            'details': selected['details'],
            'ecg_type': ecg_type_info
        }
    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        return {"error": "Prediction process encountered an error"}