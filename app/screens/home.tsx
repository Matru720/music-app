// Import necessary modules from React and React Native
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";

// Get screen width for layout calculations
const { width } = Dimensions.get("window");

// --- Constants ---
const BOTTOM_NAV_HEIGHT = 65 + (Platform.OS === 'ios' ? 15 : 0);
const MINI_PLAYER_HEIGHT = 60;

// --- Define possible Tab Names Type ---
type TabName = 'home' | 'library' | 'profile';

// Define type for list identifiers - ADDED EXPORT
export type ListType = 'topPlaylists' | 'recentlyPlayed' | 'madeForYou' | 'newReleases' | 'carousel' | 'unknown';

// --- Define a type for our music items (Added duration) - ADDED EXPORT ---
export interface MusicItem {
  id: string;
  title: string;
  artist?: string;
  image: string;
  duration: number; // Duration in seconds
}

// --- Define type for currently playing info ---
interface CurrentSongInfo {
    song: MusicItem;
    listType: ListType; // Identifier for the source list
}


// --- Sample Data (Keep as is) ---
const carouselData: MusicItem[] = [ // Ensure it conforms to MusicItem
    { id: "c1", image: "https://rukminim2.flixcart.com/image/850/1000/l01blow0/poster/2/w/z/medium-music-wallpaper-on-fine-art-paper-theme-images-hd-original-imagbx2phbqcnzym.jpeg?q=90&crop=false", title: "Featured 1", duration: 180, artist: "Various Artists" }, // Example duration/artist
    { id: "c2", image: "https://moises.ai/_next/image/?url=https%3A%2F%2Fstorage.googleapis.com%2Fmoises-cms%2Fhow_to_reading_sheet_music_image_338d99b137%2Fhow_to_reading_sheet_music_image_338d99b137.jpg&w=1920&q=75", title: "Featured 2", duration: 210, artist: "Various Artists" },
    { id: "c3", image: "https://t3.ftcdn.net/jpg/03/35/35/44/360_F_335354449_fkBBxEzbetEFg2D9uqkmH3cHRAW6gqpC.jpg", title: "Featured 3", duration: 240, artist: "Various Artists" }
];
const topPlaylists: MusicItem[] = [
    { id: "pl1", title: "Chill Vibes", image: "https://www.thomann.de/blog/wp-content/uploads/2024/10/singerheader-770x425.jpg", duration: 180, artist: "Various Artists" },
    { id: "pl2", title: "Workout Hits", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkl8oQtw-QW0iWKaboP1I6UFBYdrCRTtOtIA&s", duration: 210, artist: "Various Artists" },
    { id: "pl3", title: "Focus Flow", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHL8tg92jniUX2FeyGnBdP6V42FcyoPFRCTw&s", duration: 240, artist: "Various Artists" },
    { id: "pl4", title: "Party Starters", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_quJgAAXi8Bb9fFxr6QiGPOosdNtFFXdDjQ&s", duration: 195, artist: "Various Artists" },
    { id: "pl5", title: "Indie Anthems", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnKI34WgmwBlVj2JsuObHj8a6aULYjM2e_ZA&s", duration: 225, artist: "Various Artists" },
];
const recentlyPlayed: MusicItem[] = [
  { id: "rp1", title: "Good Days", artist: "SZA", image: "https://cdn.britannica.com/83/211883-050-46933F1A/Rihanna-Barbadian-singer-Robyn-Fenty.jpg?w=400&h=300&c=crop", duration: 279 },
  { id: "rp2", title: "Levitating", artist: "Dua Lipa", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIABtrqQy06cSJJs9ea08af2biqmWgMramGA&s", duration: 203 },
  { id: "rp3", title: "Stay", artist: "The Kid LAROI", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1kKWDCWRCNvaEzi222wwvPce0wtebiVajQ&s", duration: 141 },
  { id: "rp4", title: "Peaches", artist: "Justin Bieber", image: "https://i.insider.com/6410967b9aa2e6001956d715?width=700", duration: 198 },
  { id: "rp5", title: "Blinding Lights", artist: "The Weeknd", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ20BkuhJna-9agLQvXX4asjB0E1-QtLHoCqQ&s", duration: 200 },
];
const madeForYou: MusicItem[] = [
  { id: "mfy1", title: "Discover Weekly", image: "https://i.pinimg.com/236x/e1/28/83/e12883c826d0dc1b4e94cfebbcfce91e.jpg", duration: 3600, artist: "Playlist" },
  { id: "mfy2", title: "Daily Mix 1", image: "https://imgix.ranker.com/list_img_v2/18353/338353/original/top-25-indian-singers-of-all-time-u1?w=1200&h=720&fm=pjpg&q=80&fit=crop&dpr=1", duration: 3600, artist: "Playlist" },
  { id: "mfy3", title: "Release Radar", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX8icNoMwipJNxlt7NkJ3eDu3X8fsklDddyA&s", duration: 3600, artist: "Playlist" },
  { id: "mfy4", title: "Chill Hits", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNmjkdULf4Dy6MXJKmOvfwVy3kgN4t2bzdRg&s", duration: 3600, artist: "Playlist" },
  { id: "mfy5", title: "Summer Rewind", image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84bc866c36b8a0f6bdd6f8f0b6", duration: 3600, artist: "Playlist" },
];
const newReleases: MusicItem[] = [
  { id: "nr1", title: "Midnights", artist: "Taylor Swift", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkl8oQtw-QW0iWKaboP1I6UFBYdrCRTtOtIA&s", duration: 2400 },
  { id: "nr2", title: "Dawn FM", artist: "The Weeknd", image: "https://images.moneycontrol.com/static-mcnews/2025/03/20250305025110_kalpana.png?impolicy=website&width=770&height=431", duration: 2800 },
  { id: "nr3", title: "SOS", artist: "SZA", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1kKWDCWRCNvaEzi222wwvPce0wtebiVajQ&s", duration: 2900 },
  { id: "nr4", title: "Un Verano Sin Ti", artist: "Bad Bunny", image: "https://cdn.britannica.com/09/250309-050-64AD0E96/Ofra-Haza-singing-1989.jpg", duration: 3100 },
  { id: "nr5", title: "Harry's House", artist: "Harry Styles", image: "https://5.imimg.com/data5/SELLER/Default/2022/3/BX/EW/DA/102856831/1648197197458-500x500.jpg", duration: 2500 },
];

// Central map for easy access in PlayerScreen - ADDED EXPORT
export const allLists: Record<ListType, MusicItem[]> = {
    topPlaylists,
    recentlyPlayed,
    madeForYou,
    newReleases,
    carousel: carouselData, // Use the MusicItem-conforming carouselData
    unknown: [], // Keep unknown for fallback
};


// --- MiniPlayer Component ---
interface MiniPlayerProps {
  songInfo: CurrentSongInfo;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onPress: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ songInfo, isPlaying, progress, onPlayPause, onPress }) => {
    const { song } = songInfo;
    return (
        <TouchableOpacity style={styles.miniPlayerTouchable} onPress={onPress} activeOpacity={0.9}>
             <View style={styles.miniPlayerContainer}>
                {/* Progress Bar */}
                <View style={[styles.miniPlayerProgress, { width: `${progress * 100}%` }]} />
                {/* Content */}
                <View style={styles.miniPlayerContent}>
                <Image source={{ uri: song.image }} style={styles.miniPlayerImage} />
                <View style={styles.miniPlayerTextWrapper}>
                    <Text style={styles.miniPlayerTitle} numberOfLines={1}>{song.title}</Text>
                    <Text style={styles.miniPlayerArtist} numberOfLines={1}>{song.artist ?? 'Unknown Artist'}</Text>
                </View>
                <TouchableOpacity onPress={onPlayPause} style={styles.miniPlayerControls}>
                    <MaterialCommunityIcons
                    name={isPlaying ? "pause-circle" : "play-circle"}
                    size={36}
                    color="#fff"
                    />
                </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};


// --- HomeScreen Component ---
const HomeScreen = () => {
  const router = useRouter();

  // --- State ---
  const [currentSongInfo, setCurrentSongInfo] = useState<CurrentSongInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<TabName>('home');

  const currentSong = currentSongInfo?.song;
  const totalDuration = currentSong?.duration ?? 0;
  const playerTranslateY = useRef(new Animated.Value(MINI_PLAYER_HEIGHT)).current;

  // --- Effects ---
  useEffect(() => { // Animate MiniPlayer
      Animated.timing(playerTranslateY, {
          toValue: currentSongInfo ? 0 : MINI_PLAYER_HEIGHT,
          duration: 300,
          useNativeDriver: true,
      }).start();
  }, [currentSongInfo]); // Removed playerTranslateY from deps

  useEffect(() => { // Simulate Progress
    let intervalId: NodeJS.Timeout | null = null;
    if (isPlaying && currentSongInfo && totalDuration > 0) { // Check totalDuration
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime < totalDuration) {
            return prevTime + 1;
          } else {
            // Basic song end handling in MiniPlayer context (just pause)
            setIsPlaying(false);
            return totalDuration; // Stay at the end time
          }
        });
      }, 1000);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [isPlaying, currentSongInfo, totalDuration]);


  // --- Handlers ---
  const handleItemPress = (item: MusicItem, listType: ListType) => {
    console.log(`Playing item '${item.title}' from list '${listType}'`);
    setCurrentSongInfo({ song: item, listType });
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
      if (currentSongInfo) {
         // If song is finished and paused, pressing play should restart it
         if (!isPlaying && currentTime >= totalDuration && totalDuration > 0) {
             setCurrentTime(0);
             setIsPlaying(true);
         } else {
             setIsPlaying(!isPlaying);
         }
      }
  };

  const handleMiniPlayerPress = () => {
      if (currentSongInfo) {
          console.log("MiniPlayer pressed - Navigate to full player for ID:", currentSongInfo.song.id);
          router.push({
              pathname: "/screens/player", // Ensure this path is correct in your Expo Router setup
              params: {
                  id: currentSongInfo.song.id,
                  listType: currentSongInfo.listType,
                  initialTime: currentTime.toString(),
                  initiallyPlaying: isPlaying.toString()
              }
          });
      }
  }

  // --- Render Functions ---
  const renderMusicItem = (item: MusicItem, listType: ListType) => (
    <TouchableOpacity style={styles.musicCard} onPress={() => handleItemPress(item, listType)}>
      <Image source={{ uri: item.image }} style={styles.musicImage} />
      <Text style={styles.musicTitle} numberOfLines={1}>{item.title}</Text>
      {item.artist && (
         <Text style={styles.musicArtist} numberOfLines={1}>{item.artist}</Text>
      )}
    </TouchableOpacity>
  );

  const renderCarouselItem = ({ item }: { item: MusicItem }) => ( // Use item directly
     <TouchableOpacity onPress={() => handleItemPress(item, 'carousel')}>
       <Image source={{ uri: item.image }} style={styles.carouselImage} />
       {/* Optional: Add title overlay on carousel if needed */}
       {/* <Text style={styles.carouselTitleOverlay}>{item.title}</Text> */}
     </TouchableOpacity>
   );


  const scrollPaddingBottom = currentSongInfo ? BOTTOM_NAV_HEIGHT + MINI_PLAYER_HEIGHT : BOTTOM_NAV_HEIGHT;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: scrollPaddingBottom }]}
      >
        {/* Featured Section */}
         <Text style={styles.featuredTitle}>Featured</Text>
         <Carousel
           loop width={width} height={width * 0.5} autoPlay={true} autoPlayInterval={5000}
           data={carouselData} scrollAnimationDuration={1000}
           renderItem={renderCarouselItem} // Use specific render function
           style={styles.carousel}
         />

         {/* Sections */}
         <Text style={styles.sectionTitle}>Top Playlists</Text>
         <FlatList horizontal data={topPlaylists} renderItem={({item}) => renderMusicItem(item, 'topPlaylists')} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listPadding}/>

         <Text style={styles.sectionTitle}>Recently Played</Text>
         <FlatList horizontal data={recentlyPlayed} renderItem={({item}) => renderMusicItem(item, 'recentlyPlayed')} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listPadding}/>

         <Text style={styles.sectionTitle}>Made For You</Text>
         <FlatList horizontal data={madeForYou} renderItem={({item}) => renderMusicItem(item, 'madeForYou')} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listPadding}/>

         <Text style={styles.sectionTitle}>New Releases</Text>
         <FlatList horizontal data={newReleases} renderItem={({item}) => renderMusicItem(item, 'newReleases')} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listPadding}/>

      </ScrollView>

       {/* Mini Player */}
       <Animated.View style={[ styles.miniPlayerWrapper, { transform: [{ translateY: playerTranslateY }] } ]}>
            {currentSongInfo && (
                <MiniPlayer
                    songInfo={currentSongInfo}
                    isPlaying={isPlaying}
                    progress={totalDuration > 0 ? currentTime / totalDuration : 0}
                    onPlayPause={handlePlayPause}
                    onPress={handleMiniPlayerPress}
                />
            )}
       </Animated.View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {/* Should ideally set activeTab if managing locally */ setActiveTab('home'); console.log("Home tab pressed")}}>
          <MaterialCommunityIcons name={activeTab === 'home' ? "home" : "home-outline"} size={28} color={activeTab === 'home' ? styles.activeIcon.color : styles.inactiveIcon.color}/>
          <Text style={activeTab === 'home' ? styles.activeText : styles.inactiveText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/screens/library")}>
          <MaterialCommunityIcons name={"music-box-multiple-outline"} size={28} color={styles.inactiveIcon.color}/>
          <Text style={styles.inactiveText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/screens/profile")}>
          <MaterialCommunityIcons name={"account-circle-outline"} size={28} color={styles.inactiveIcon.color}/>
          <Text style={styles.inactiveText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: "#121212",
      },
      scrollContainer: {
        paddingTop: 10,
      },
      featuredTitle: {
        fontSize: 24, fontWeight: "bold", color: "#fff", marginLeft: 15, marginTop: 10, marginBottom: 15,
      },
      carousel: {
        marginBottom: 25,
      },
      carouselImage: {
        width: width - 30, height: width * 0.5, borderRadius: 10, alignSelf: "center", backgroundColor: '#333',
      },
      // Optional: Style for title overlay on carousel image
      // carouselTitleOverlay: {
      //   position: 'absolute', bottom: 10, left: 10, color: '#fff', fontSize: 16, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 5, borderRadius: 4
      // },
      sectionTitle: {
        fontSize: 20, fontWeight: "bold", color: "#fff", marginLeft: 15, marginBottom: 15, marginTop: 10,
      },
      listPadding: {
        paddingHorizontal: 15,
      },
      musicCard: {
        marginRight: 15, borderRadius: 8, width: 100,height:100, overflow: 'hidden',
      },
      musicImage: {
        width: 100, height: 100, borderRadius: 6, backgroundColor: '#333',
      },
      musicTitle: {
        fontSize: 13, fontWeight: '600', color: "#fff", marginTop: 6, paddingHorizontal: 4,
      },
      musicArtist: {
        fontSize: 11, color: "#aaa", marginTop: 3, marginBottom: 8, paddingHorizontal: 4,
      },
      bottomNav: {
        flexDirection: "row", justifyContent: "space-around", alignItems: "center",
        backgroundColor: "#181818",
        height: BOTTOM_NAV_HEIGHT,
        paddingBottom: Platform.OS === 'ios' ? 15 : 0,
        borderTopWidth: 1, borderTopColor: "#282828",
        position: 'absolute', bottom: 0, left: 0, right: 0,
      },
      navItem: {
        alignItems: "center", justifyContent: 'center', flex: 1, paddingVertical: 5,
      },
      activeIcon: { color: "#1DB954", },
      inactiveIcon: { color: "#b3b3b3", },
      activeText: { fontSize: 11, color: "#1DB954", marginTop: 3, fontWeight: '600', },
      inactiveText: { fontSize: 11, color: "#b3b3b3", marginTop: 3, fontWeight: '500', },
      miniPlayerWrapper: {
          position: 'absolute', bottom: BOTTOM_NAV_HEIGHT, left: 0, right: 0, height: MINI_PLAYER_HEIGHT,
      },
      miniPlayerTouchable: { flex: 1 },
      miniPlayerContainer: { height: '100%', backgroundColor: "#282828", overflow: 'hidden' },
      miniPlayerProgress: { height: 2, backgroundColor: "#1DB954", position: 'absolute', top: 0, left: 0 },
      miniPlayerContent: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
      miniPlayerImage: { width: 40, height: 40, borderRadius: 4, marginRight: 10, backgroundColor: '#555' },
      miniPlayerTextWrapper: { flex: 1, justifyContent: 'center', marginRight: 10 },
      miniPlayerTitle: { color: "#fff", fontSize: 14, fontWeight: '600' },
      miniPlayerArtist: { color: "#b3b3b3", fontSize: 12 },
      miniPlayerControls: { paddingLeft: 10 },
});

export default HomeScreen;