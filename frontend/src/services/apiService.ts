import { HistoryItemData } from '@/components/HistoryItem';

const API_BASE_URL = 'http://localhost:5000/api';

const MOCK_ECG_CONDITIONS = [
  {
    name: 'Normal Sinus Rhythm',
    confidence: 92,
    risk: 'low',
    details: [
      'Normal P waves preceding each QRS complex',
      'Regular RR intervals',
      'Normal QRS duration (0.08-0.10 seconds)',
      'No significant ST segment abnormalities'
    ]
  },
  {
    name: 'Atrial Fibrillation',
    confidence: 88,
    risk: 'medium',
    details: [
      'Irregular RR intervals',
      'Absence of distinct P waves',
      'Presence of fibrillatory waves',
      'Moderate risk of blood clots and stroke'
    ]
  },
  {
    name: 'Myocardial Infarction',
    confidence: 78,
    risk: 'high',
    details: [
      'ST segment elevation > 1mm in multiple leads',
      'Pathological Q waves observed',
      'T wave inversions in affected leads',
      'Reciprocal ST depression in opposite leads'
    ]
  }
];

const MOCK_HISTORY: HistoryItemData[] = [
  {
    id: '1',
    date: new Date('2025-04-05T10:30:00'),
    prediction: 'Normal Sinus Rhythm',
    confidence: 95,
    risk: 'low',
    thumbnailUrl: 'https://cdn.pixabay.com/photo/2021/03/16/10/12/heart-6099296_1280.png'
  },
  {
    id: '2',
    date: new Date('2025-03-22T14:15:00'),
    prediction: 'Atrial Fibrillation',
    confidence: 87,
    risk: 'medium',
    thumbnailUrl: 'https://cdn.pixabay.com/photo/2021/03/16/10/12/heart-6099296_1280.png'
  }
];

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    console.log("Backend not available, using mock data");
    return false;
  }
};

export const apiService = {
  analyzeEcg: async (imageFile: File) => {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await fetch(`${API_BASE_URL}/analyze`, { method: 'POST', body: formData });
        return handleResponse(response);
      } catch (error) {
        console.error("Error connecting to backend, falling back to mock data:", error);
      }
    }
    console.log("Using mock analysis data");
    await new Promise(resolve => setTimeout(resolve, 1500));
    const condition = MOCK_ECG_CONDITIONS[Math.floor(Math.random() * MOCK_ECG_CONDITIONS.length)];
    const randomizedConfidence = getRandomInt(condition.confidence - 5, condition.confidence + 5);
    return {
      prediction: condition.name,
      confidence: randomizedConfidence,
      risk: condition.risk,
      details: condition.details
    };
  },

  analyzeEcgBase64: async (imageFile: File) => {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async () => {
        try {
          const backendAvailable = await isBackendAvailable();
          if (backendAvailable) {
            const response = await fetch(`${API_BASE_URL}/analyze`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_data: reader.result })
            });
            const result = await handleResponse(response);
            resolve(result);
          } else {
            console.log("Using mock analysis data");
            await new Promise(r => setTimeout(r, 1500));
            const condition = MOCK_ECG_CONDITIONS[Math.floor(Math.random() * MOCK_ECG_CONDITIONS.length)];
            const randomizedConfidence = getRandomInt(condition.confidence - 5, condition.confidence + 5);
            resolve({
              prediction: condition.name,
              confidence: randomizedConfidence,
              risk: condition.risk,
              details: condition.details
            });
          }
        } catch (error) {
          console.error("Error in analyzeEcgBase64:", error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  },

  getHistoryItems: async (): Promise<HistoryItemData[]> => {
    try {
      const backendAvailable = await isBackendAvailable();
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/history`);
        const data = await handleResponse(response);
        return data.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
      } else {
        console.log("Using mock history data");
        return MOCK_HISTORY;
      }
    } catch (error) {
      console.error("Error fetching history, using mock data:", error);
      return MOCK_HISTORY;
    }
  },

  saveAnalysisResult: async (result: any, imageUrl: string): Promise<HistoryItemData> => {
    try {
      const backendAvailable = await isBackendAvailable();
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prediction: result.prediction,
            confidence: result.confidence,
            risk: result.risk,
            thumbnailUrl: imageUrl
          })
        });
        const data = await handleResponse(response);
        return {
          ...data,
          date: new Date(data.date)
        };
      } else {
        console.log("Using mock save functionality");
        return {
          id: Math.random().toString(36).substring(2, 11),
          date: new Date(),
          prediction: result.prediction,
          confidence: result.confidence,
          risk: result.risk,
          thumbnailUrl: imageUrl
        };
      }
    } catch (error) {
      console.error("Error saving analysis result:", error);
      return {
        id: Math.random().toString(36).substring(2, 11),
        date: new Date(),
        prediction: result.prediction,
        confidence: result.confidence,
        risk: result.risk,
        thumbnailUrl: imageUrl
      };
    }
  }
};