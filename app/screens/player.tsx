import React, { useState, useEffect, useCallback } from "react"; // Removed useMemo as direct state is simpler now
import {
  View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Platform, ActivityIndicator
} from "react-native";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// --- IMPORTANT ---
// Ensure ListType, MusicItem, and allLists are EXPORTED from HomeScreen.tsx
// Example in HomeScreen.tsx:
// export type ListType = 'topPlaylists' | ... | 'unknown';
// export interface MusicItem { ... }
// export const allLists: Record<ListType, MusicItem[]> = { ... };
import { allLists, ListType, MusicItem } from "./home"; // Adjust path if needed

const { width } = Dimensions.get("window");

// --- Helper Function to Format Time ---
const formatTime = (secs: number): string => {
  const validSecs = typeof secs === 'number' && !isNaN(secs) ? Math.max(0, secs) : 0;
  const minutes = Math.floor(validSecs / 60);
  const seconds = Math.floor(validSecs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Define possible repeat modes
type RepeatMode = 'off' | 'context' | 'track';

const PlayerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
      id?: string;
      listType?: string; // Receive as string initially from params
      initialTime?: string;
      initiallyPlaying?: string;
   }>();

  // --- State ---
  const [currentSong, setCurrentSong] = useState<MusicItem | null>(null);
  const [currentList, setCurrentList] = useState<MusicItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentListType, setCurrentListType] = useState<ListType>('unknown');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  // --- Initialization Logic ---
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setError(null);
      setCurrentSong(null); // Reset song while loading new params

      const initialIdParam = params.id;
      // Safely cast params.listType to ListType, defaulting to 'unknown'
      const initialListTypeParam = (params.listType ?? 'unknown') as ListType;
      const initialTimeParam = params.initialTime ? parseFloat(params.initialTime) : 0;
      const initiallyPlayingParam = params.initiallyPlaying === 'true';

      if (!initialIdParam) {
        setError("No song ID provided.");
        setIsLoading(false);
        return;
      }

      // --- FIX: Ensure listType is valid before indexing ---
      // Check if the provided listType actually exists in allLists keys
      const isValidListType = Object.keys(allLists).includes(initialListTypeParam);
      const listTypeToUse: ListType = isValidListType ? initialListTypeParam : 'unknown';

      const list = allLists[listTypeToUse] ?? []; // Use the validated listType

      // --- FIX: Explicitly type 'song' in findIndex ---
      const foundIndex = list.findIndex((song: MusicItem) => song.id === initialIdParam);

      if (foundIndex !== -1) {
        const foundSong = list[foundIndex];
        setCurrentSong(foundSong);
        setCurrentList(list);
        setCurrentIndex(foundIndex);
        setCurrentListType(listTypeToUse); // Store the list type used
        setTotalDuration(foundSong.duration ?? 0);
        setCurrentTime(!isNaN(initialTimeParam) ? Math.max(0, initialTimeParam) : 0);
        setIsPlaying(initiallyPlayingParam);
      } else {
        setError(`Song ID "${initialIdParam}" not found${listTypeToUse !== 'unknown' ? ` in list "${listTypeToUse}"` : ''}.`);
        setCurrentSong(null);
        setCurrentList([]);
        setCurrentIndex(-1);
        setCurrentListType('unknown');
        setTotalDuration(0);
        setIsPlaying(false);
        setCurrentTime(0);
      }

      setIsLoading(false);

    }, [params.id, params.listType, params.initialTime, params.initiallyPlaying])
  );


  // --- Simulate Progress ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isPlaying && currentSong) {
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => {
          const numericPrevTime = typeof prevTime === 'number' ? prevTime : 0;
          if (numericPrevTime < totalDuration) {
            return numericPrevTime + 1;
          } else {
            handleSongEnd();
            return 0;
          }
        });
      }, 1000);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [isPlaying, currentSong, totalDuration, repeatMode]); // Keep repeatMode dependency


  // --- Handlers ---
  const handlePlayPause = () => {
    if (currentSong && !error) setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    if (currentSong && !error) {
        const newTime = Math.max(0, Math.min(value, totalDuration));
        setCurrentTime(newTime);
    }
  };

  const handleLike = () => setIsLiked(!isLiked);
  const toggleShuffle = () => setShuffleMode(!shuffleMode);
  const cycleRepeatMode = () => {
      setRepeatMode(prev => prev === 'off' ? 'context' : prev === 'context' ? 'track' : 'off');
  }
  const getRepeatIconName = (): "repeat-off" | "repeat" | "repeat-once" => {
    return repeatMode === 'track' ? 'repeat-once' : repeatMode === 'context' ? 'repeat' : 'repeat-off';
  }

  // --- Next / Previous / Song End Logic ---
  const playSongAtIndex = useCallback((index: number) => {
      if (index >= 0 && index < currentList.length) {
          const newSong = currentList[index];
          setCurrentSong(newSong);
          setCurrentIndex(index);
          setTotalDuration(newSong.duration ?? 0);
          setCurrentTime(0);
          setIsPlaying(true);
          setError(null);
      } else {
          if (repeatMode !== 'context') {
              setIsPlaying(false);
              setCurrentTime(0);
              const boundaryIndex = index < 0 ? 0 : currentList.length - 1;
              if (currentIndex !== boundaryIndex && currentList[boundaryIndex]) {
                 setCurrentSong(currentList[boundaryIndex]);
                 setCurrentIndex(boundaryIndex);
                 setTotalDuration(currentList[boundaryIndex]?.duration ?? 0);
              } else if (!currentList[boundaryIndex]) { // Handle empty list case
                  setCurrentSong(null);
                  setCurrentIndex(-1);
                  setTotalDuration(0);
              }
          } else {
              // Context repeat handled in handleNext/Prev
              setIsPlaying(false);
              setCurrentTime(0);
          }
      }
  }, [currentList, repeatMode, currentIndex]); // Added currentIndex dependency

  const handleNext = () => {
    if (isLoading || currentList.length === 0) return;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= currentList.length) {
      if (repeatMode === 'context') nextIndex = 0;
      else {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }
    }
    playSongAtIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (isLoading || currentList.length === 0) return;
    if (currentTime > 3) {
        setCurrentTime(0);
        setIsPlaying(true);
    } else {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            if (repeatMode === 'context') prevIndex = currentList.length - 1;
            else {
                setCurrentTime(0);
                setIsPlaying(true);
                return;
            }
        }
        playSongAtIndex(prevIndex);
    }
  };

  const handleSongEnd = () => {
      if (repeatMode === 'track') {
          setCurrentTime(0);
          setIsPlaying(true);
      } else if (repeatMode === 'context') {
          handleNext();
      } else {
          setIsPlaying(false);
          // Optional: Go to next song visually but keep paused
          const nextIndex = currentIndex + 1;
          if(nextIndex < currentList.length) {
              playSongAtIndex(nextIndex);
              // Need a slight delay or useEffect to pause after state update
              setTimeout(() => setIsPlaying(false), 0);
          } else {
              // Already at the end, just stay paused
               setCurrentTime(totalDuration); // Show end time
          }
      }
  };


  // --- Render Logic ---
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <ActivityIndicator size="large" color={styles.activeIcon.color} />
      </SafeAreaView>
    );
  }

  if (error || !currentSong) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#E53935" />
        <Text style={styles.errorText}>{error || "Could not load song."}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.topBarButton}>
            <MaterialCommunityIcons name="chevron-down" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>
             {currentListType !== 'unknown'
                 // --- FIX: Explicitly type 'str' in replace ---
                 ? `Playing from ${currentListType.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}`
                 : 'Now Playing'}
          </Text>
          <TouchableOpacity style={styles.topBarButton}>
            <MaterialCommunityIcons name="dots-horizontal" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <View style={styles.artworkWrapper}>
          <Image source={{ uri: currentSong.image }} style={styles.albumArt} />
        </View>

        {/* Song Info & Like */}
         <View style={styles.infoWrapper}>
          <View style={styles.titleArtistWrapper}>
            <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
            <Text style={styles.songArtist} numberOfLines={1}>{currentSong.artist ?? 'Unknown Artist'}</Text>
          </View>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <MaterialCommunityIcons name={isLiked ? "heart" : "heart-outline"} size={26} color={isLiked ? styles.activeIcon.color : styles.iconColor.color}/>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrapper}>
          <Slider
            style={styles.progressBar} minimumValue={0} maximumValue={totalDuration} value={currentTime}
            onSlidingComplete={handleSeek} minimumTrackTintColor={styles.activeIcon.color}
            maximumTrackTintColor="#535353" thumbTintColor="#fff"
          />
          <View style={styles.timeWrapper}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
          </View>
        </View>

        {/* Main Controls */}
        <View style={styles.controlsWrapper}>
           <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
             <MaterialCommunityIcons name="shuffle-variant" size={26} color={shuffleMode ? styles.activeIcon.color : styles.iconColor.color}/>
             {shuffleMode && <View style={styles.activeDot} />}
           </TouchableOpacity>
           <TouchableOpacity onPress={handlePrevious} style={styles.controlButton} disabled={isLoading}>
             <MaterialCommunityIcons name="skip-previous" size={38} color={styles.iconColor.color} />
           </TouchableOpacity>
           <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton} disabled={isLoading || error !== null}>
             <MaterialCommunityIcons name={isPlaying ? "pause" : "play"} size={45} color="#000" />
           </TouchableOpacity>
           <TouchableOpacity onPress={handleNext} style={styles.controlButton} disabled={isLoading}>
             <MaterialCommunityIcons name="skip-next" size={38} color={styles.iconColor.color} />
           </TouchableOpacity>
           <TouchableOpacity onPress={cycleRepeatMode} style={styles.controlButton}>
             <MaterialCommunityIcons name={getRepeatIconName()} size={26} color={repeatMode !== 'off' ? styles.activeIcon.color : styles.iconColor.color}/>
             {repeatMode !== 'off' && <View style={styles.activeDot} />}
           </TouchableOpacity>
        </View>

        {/* Secondary Controls */}
        <View style={styles.secondaryControlsWrapper}>
            <TouchableOpacity style={styles.secondaryButton}><MaterialCommunityIcons name="volume-high" size={22} color={styles.iconColor.color} /></TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.secondaryButton}><MaterialCommunityIcons name="share-variant-outline" size={22} color={styles.iconColor.color} /></TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}><MaterialCommunityIcons name="playlist-music-outline" size={24} color={styles.iconColor.color} /></TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

// --- Styles --- (Keep your existing styles)
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#121212", // Dark background
    },
    centerContent: { // Used for loading/error states
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#E57373', // Light red for error text
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
     backButton: {
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around", // Try space-around or space-evenly
        paddingHorizontal: 12,
        paddingBottom: Platform.OS === 'ios' ? 20 : 15, // Bottom padding
        paddingTop: Platform.OS === 'ios' ? 10 : 20, // Top padding
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topBarButton: {
        padding: 0, // Increase touch area
    },
    topBarTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        flex: 1, // Allow title to take space
        textAlign: 'center',
        marginHorizontal: 10, // Space around title
    },
    artworkWrapper: {
        width: width * 0.7,
        height: width * 0.7,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 15,
        borderRadius: 12,
    },
    albumArt: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: '#333',
    },
    infoWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    titleArtistWrapper: {
        flex: 1,
        marginRight: 15,
    },
    songTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 6,
    },
    songArtist: {
        fontSize: 16,
        color: "#b3b3b3",
    },
    likeButton: {
        padding: 8,
    },
    progressWrapper: {
        width: '100%',
    },
    progressBar: {
        width: '100%',
        height: 8,
    },
    timeWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
        marginTop: 4,
    },
    timeText: {
        color: '#b3b3b3',
        fontSize: 12,
    },
    controlsWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "95%",
    },
    controlButton: {
        padding: 12,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPauseButton: {
        backgroundColor: '#fff',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    activeDot: {
        position: 'absolute',
        bottom: 5,
        alignSelf: 'center',
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#1DB954',
    },
    secondaryControlsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 25,
    },
    secondaryButton: {
        padding: 10,
    },
    iconColor: {
        color: '#b3b3b3',
    },
    activeIcon: {
        color: '#1DB954',
    },
});

export default PlayerScreen;