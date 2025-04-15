// src/config/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Replace with your backend's actual IP address if testing on a device
// Use http://10.0.2.2:8000 for Android Emulator or http://localhost:8000 for iOS Simulator
export const API_BASE_URL = 'http://<YOUR_BACKEND_IP_ADDRESS>:8000'; // Or appropriate emulator/simulator URL

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await AsyncStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper for handling API responses
export const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json(); // Try to parse backend error detail
        } catch (e) {
            // If parsing fails, use status text
            errorData = { detail: response.statusText };
        }
        console.error("API Error Response:", { status: response.status, data: errorData });
        const errorMessage = typeof errorData?.detail === 'string'
                             ? errorData.detail
                             : `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }
    // Handle 204 No Content specifically
    if (response.status === 204) {
        return null; // Or return an empty object/true if needed
    }
    return response.json(); // Parse successful response body
};