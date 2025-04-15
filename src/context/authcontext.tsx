// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, getAuthHeaders, handleApiResponse } from '../config/api'; // Adjust path if needed
//import {UserRead, UserCreate, Token } from '../types/schemas'; // We'll define these types

// --- Define Schema Types (Mirroring backend/schemas.py) ---
// You can place these in a separate types/schemas.ts file for better organization

export interface UserRead {
  id: number;
  username: string;
  email: string;
  created_at: string; // Dates are usually strings in JSON
}

export interface UserCreate {
  username: string;
  email: string;
  password?: string; // Password only needed for creation
}

export interface Token {
    access_token: string;
    token_type: string;
}
// --- End Schema Types ---


interface AuthContextType {
  authToken: string | null;
  userInfo: UserRead | null;
  isLoading: boolean; // For initial auth check
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: UserCreate) => Promise<UserRead>; // Returns UserRead on success
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<void>; // Add function to refresh user info
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  // Check for stored token on mount
  useEffect(() => {
    const loadAuthData = async () => {
      setIsLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          console.log("Auth token found in storage, attempting to fetch user info...");
          setAuthToken(storedToken);
          // Fetch user info using the stored token
          await fetchUserInfoInternal(storedToken);
        } else {
           console.log("No auth token found in storage.");
           setAuthToken(null);
           setUserInfo(null);
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
        setAuthToken(null);
        setUserInfo(null);
        await AsyncStorage.removeItem('authToken'); // Clear potentially invalid token
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []); // Run only once on mount

  // Internal function to fetch user info (avoids context dependency loop)
   const fetchUserInfoInternal = async (token: string) => {
     try {
       const response = await fetch(`${API_BASE_URL}/users/me`, {
         method: 'GET',
         headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
         },
       });
       const data: UserRead = await handleApiResponse(response);
       setUserInfo(data);
       console.log("User info fetched successfully:", data);
     } catch (error) {
       console.error('Failed to fetch user info:', error);
       // If fetching user info fails (e.g., invalid token), log out
       await logout();
       throw error; // Re-throw error for login/signup functions
     }
   };

  // Function exposed via context to allow manual refresh if needed
  const fetchUserInfo = async () => {
      if (!authToken) {
         console.log("Cannot fetch user info, no auth token.");
         return;
      }
      setIsLoading(true); // Indicate loading during refresh
      try {
         await fetchUserInfoInternal(authToken);
      } catch (error) {
         console.error("Error refreshing user info:", error);
      } finally {
         setIsLoading(false);
      }
  };


  const login = async (username: string, password: string) => {
    setIsLoading(true); // Indicate loading during login attempt
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // FastAPI OAuth2 expects form data
        },
        body: formData.toString(),
      });

      const data: Token = await handleApiResponse(response);
      const token = data.access_token;

      await AsyncStorage.setItem('authToken', token);
      setAuthToken(token);
      console.log("Login successful, token stored.");

      // Fetch user info immediately after successful login
      await fetchUserInfoInternal(token); // Fetch user info using the new token
      setIsLoading(false);

    } catch (error) {
      console.error('Login failed:', error);
      await AsyncStorage.removeItem('authToken');
      setAuthToken(null);
      setUserInfo(null);
      setIsLoading(false);
      throw error; // Re-throw the error to be caught in the component
    }
  };

  const signup = async (userData: UserCreate): Promise<UserRead> => {
     setIsLoading(true);
     try {
       const response = await fetch(`${API_BASE_URL}/auth/signup`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(userData),
       });
       const createdUser: UserRead = await handleApiResponse(response);
       console.log("Signup successful:", createdUser);
       // Optional: Automatically log in the user after signup?
       // If so, call login(userData.username, userData.password);
       // If not, the user will be redirected to the login screen.
       setIsLoading(false);
       return createdUser; // Return user data for potential use in component
     } catch (error) {
       console.error('Signup failed:', error);
       setIsLoading(false);
       throw error; // Re-throw
     }
   };

  const logout = async () => {
    setIsLoading(true); // Indicate loading during logout
    try {
      await AsyncStorage.removeItem('authToken');
      setAuthToken(null);
      setUserInfo(null);
      console.log("Logout successful, token removed.");
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, userInfo, isLoading, login, signup, logout, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};