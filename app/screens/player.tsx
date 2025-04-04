import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Use a consistent icon set

const { width, height } = Dimensions.get("window");

// --- Helper Function to Format Time (seconds -> MM:SS) ---
const formatTime = (secs: number) => {
  if (isNaN(secs) || secs < 0) {
    return "00:00";
  }
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};


// --- Sample Data --- (Keep existing or replace with context/API data)
const sampleSongs: { [key: string]: { title: string; artist: string; image: string; duration: number } } = {
  "1": { title: "Blinding Lights", artist: "The Weeknd", image: "https://source.unsplash.com/600x600/?music,neon", duration: 200 },
  "2": { title: "Someone Like You", artist: "Adele", image: "https://source.unsplash.com/600x600/?piano,sad", duration: 285 },
  "3": { title: "Save Your Tears", artist: "The Weeknd", image: "https://source.unsplash.com/600x600/?headphones,retro", duration: 215 },
  // Add more songs or fetch dynamically
};


const PlayerScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };

  // --- State ---
  const song = sampleSongs[id] || sampleSongs["1"];
  const totalDuration = song.duration;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'context' | 'track'>('off');

  // --- Simulate Progress --- (Replace with actual audio logic)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime < totalDuration) {
            return prevTime + 1;
          } else {
            setIsPlaying(false);
            if (repeatMode === 'track') {
                 setIsPlaying(true);
                 return 0;
            } else if (repeatMode === 'context') {
                 console.log("Go to next song (repeat context)");
                 return 0;
            } else {
                 return 0;
            }
          }
        });
      }, 1000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, totalDuration, repeatMode]);

  // --- Handlers ---
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleShuffle = () => {
      setShuffleMode(!shuffleMode);
  }

  const cycleRepeatMode = () => {
      setRepeatMode(prev => {
          if (prev === 'off') return 'context';
          if (prev === 'context') return 'track';
          return 'off';
      })
  }

  const getRepeatIconName = (): "repeat-off" | "repeat" | "repeat-once" => { // Added return type for clarity
    switch (repeatMode) {
      case 'track': return 'repeat-once';
      case 'context': return 'repeat';
      default: return 'repeat-off';
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* --- Top Bar --- */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.topBarButton}>
            <MaterialCommunityIcons name="chevron-down" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>Playing from Album/Playlist</Text>
          <TouchableOpacity style={styles.topBarButton}>
            <MaterialCommunityIcons name="dots-horizontal" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* --- Album Art --- */}
        <View style={styles.artworkWrapper}>
          <Image source={{ uri: song.image }} style={styles.albumArt} />
        </View>

        {/* --- Song Info & Like --- */}
        <View style={styles.infoWrapper}>
          <View style={styles.titleArtistWrapper}>
            <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
          </View>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <MaterialCommunityIcons
              name={isLiked ? "heart" : "heart-outline"}
              size={26}
              color={isLiked ? styles.activeIcon.color : styles.iconColor.color}
            />
          </TouchableOpacity>
        </View>

        {/* --- Progress Bar --- */}
        <View style={styles.progressWrapper}>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={totalDuration}
            value={currentTime}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={styles.activeIcon.color}
            maximumTrackTintColor="#535353"
            thumbTintColor="#fff"
          />
          <View style={styles.timeWrapper}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
          </View>
        </View>

        {/* --- Main Controls --- */}
        <View style={styles.controlsWrapper}>
          <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
             <MaterialCommunityIcons
                name="shuffle-variant"
                size={26}
                color={shuffleMode ? styles.activeIcon.color : styles.iconColor.color}
              />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <MaterialCommunityIcons name="skip-previous" size={38} color={styles.iconColor.color} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
            <MaterialCommunityIcons
                name={isPlaying ? "pause" : "play"}
                size={45}
                color="#000"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <MaterialCommunityIcons name="skip-next" size={38} color={styles.iconColor.color} />
          </TouchableOpacity>
          <TouchableOpacity onPress={cycleRepeatMode} style={styles.controlButton}>
             <MaterialCommunityIcons
                name={getRepeatIconName()}
                size={26}
                color={repeatMode !== 'off' ? styles.activeIcon.color : styles.iconColor.color}
              />
               {repeatMode !== 'off' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>

        {/* --- Secondary Controls (Optional) --- */}
        <View style={styles.secondaryControlsWrapper}>
          <TouchableOpacity style={styles.secondaryButton}>
              {/* CORRECTED ICON NAME HERE */}
              <MaterialCommunityIcons name="volume-high" size={22} color={styles.iconColor.color} />
          </TouchableOpacity>
           <View style={{ flex: 1 }} />
           <TouchableOpacity style={styles.secondaryButton}>
              <MaterialCommunityIcons name="share-variant-outline" size={22} color={styles.iconColor.color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
              <MaterialCommunityIcons name="playlist-music-outline" size={24} color={styles.iconColor.color} />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

// --- Styles --- (Styles remain the same as the previous version)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  topBarButton: {
     padding: 5,
  },
  topBarTitle: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 10,
  },
  artworkWrapper: {
    width: width * 0.75,
    height: width * 0.75,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#333',
  },
  infoWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  titleArtistWrapper: {
    flex: 1,
    marginRight: 15,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  songArtist: {
    fontSize: 16,
    color: "#b3b3b3",
  },
  likeButton: {
     padding: 5,
  },
  progressWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  controlsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  controlButton: {
     padding: 10,
     position: 'relative',
  },
  playPauseButton: {
     backgroundColor: '#fff',
     width: 70,
     height: 70,
     borderRadius: 35,
     justifyContent: 'center',
     alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 6,
  },
   activeDot: {
    position: 'absolute',
    bottom: 2,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1DB954',
  },
  secondaryControlsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  secondaryButton: {
     padding: 8,
  },
  iconColor: {
     color: '#b3b3b3',
  },
  activeIcon: {
     color: '#1DB954',
  },
});

export default PlayerScreen;