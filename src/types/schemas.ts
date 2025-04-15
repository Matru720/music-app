// src/types/schemas.ts

// From AuthContext / Backend User Schemas
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
  
  // From AuthContext / Backend Token Schema
  export interface Token {
      access_token: string;
      token_type: string;
  }
  
  // From PlayerScreen / Backend Track Schema (Adjust based on your actual backend schema)
  export interface TrackRead {
      id: number;
      title: string;
      artist: string; // Assuming non-optional from backend for simplicity here
      album?: string | null;
      duration_seconds?: number | null;
      file_url?: string | null;
      cover_art_url?: string | null;
  }
  
  // From PlayerScreen / Backend Library Schema
  export interface LibraryTrackRead {
      track: TrackRead;
      added_at: string; // Assuming ISO string format
  }
  
  // From HomeScreen (Frontend specific type, derived from TrackRead)
  export interface MusicItem {
    id: number;
    title: string;
    artist?: string; // Keep optional for frontend flexibility
    album?: string;
    image?: string; // Frontend name for cover_art_url
    duration?: number; // Frontend name for duration_seconds
    file_url?: string;
    // Add other frontend-specific things if needed, like isLiked
  }
  
  // Define other shared types here as needed...