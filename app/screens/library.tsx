import React, { useState } from "react"; // Import useState
import {
  View,
  Text,
  SectionList,
  // Removed FlatList import as it's no longer used in the footer
  Image,
  TouchableOpacity,
  StyleSheet,
  SectionListRenderItemInfo,
  SafeAreaView, // Import SafeAreaView
  Platform,     // Import Platform
  // ListRenderItemInfo is not strictly needed if we combine render logic
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// --- Define possible Tab Names Type ---
type TabName = 'home' | 'library' | 'profile';

// Define types for songs and playlists
type Song = {
  id: string;
  title: string;
  artist: string;
  image: string;
};

type Playlist = {
  id: string;
  name: string; // Use 'name' for playlists
  owner?: string; // Add owner/description (optional)
  image: string;
};

// Combined type for SectionList items
type LibraryItem = Song | Playlist;

// --- Sample Data (Reduced for brevity in example) ---
const savedSongs: Song[] = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", image: "https://rukminim2.flixcart.com/image/850/1000/l01blow0/poster/2/w/z/medium-music-wallpaper-on-fine-art-paper-theme-images-hd-original-imagbx2phbqcnzym.jpeg?q=90&crop=false" },
  { id: "2", title: "Someone Like You", artist: "Adele", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1kKWDCWRCNvaEzi222wwvPce0wtebiVajQ&s" },
  { id: "3", title: "Save Your Tears", artist: "The Weeknd", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1kKWDCWRCNvaEzi222wwvPce0wtebiVajQ&s" },
  { id: "4", title: "Shape of You", artist: "Ed Sheeran", image: "https://source.unsplash.com/100x100/?guitar,pop" },
  { id: "5", title: "Levitating", artist: "Dua Lipa", image: "https://source.unsplash.com/100x100/?dj,disco" },
  // ... more songs
];

const playlists: Playlist[] = [
  { id: "101", name: "Chill Vibes", owner: "Spotify", image: "https://source.unsplash.com/100x100/?playlist,chill" },
  { id: "102", name: "Workout Hits", owner: "You", image: "https://source.unsplash.com/100x100/?gym,running" },
  { id: "103", name: "Party Mix", owner: "You", image: "https://source.unsplash.com/100x100/?party,dj" },
  { id: "104", name: "Top Charts", owner: "Spotify", image: "https://source.unsplash.com/100x100/?top,charts" },
  { id: "105", name: "Indie Favorites", owner: "You", image: "https://source.unsplash.com/100x100/?indie,guitar" },
  // ... more playlists
];


const LibraryScreen = () => {
  const router = useRouter();

  // --- USE STATE FOR activeTab ---
  const [activeTab, setActiveTab] = useState<TabName>('library'); // Set active tab to 'library'

  // --- Unified Render Function for List Items ---
  const renderLibraryItem = ({
    item,
    section,
  }: SectionListRenderItemInfo<LibraryItem, { title: string; data: LibraryItem[] }>) => {
    // Type guard to check if the item is a Song or Playlist
    const isSong = 'artist' in item;

    return (
      <TouchableOpacity
        style={styles.listItem}
        // Navigate to player, potentially passing type if needed later
        onPress={() => router.push({ pathname: '/screens/player', params: { id: item.id, type: isSong ? 'song' : 'playlist' } })}
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {isSong ? item.title : item.name} {/* Use title for song, name for playlist */}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {isSong ? item.artist : `Playlist • ${item.owner || 'Unknown'}`} {/* Use artist or playlist owner */}
          </Text>
        </View>
        {/* Optional: Add a 'more options' icon */}
        <TouchableOpacity style={styles.moreOptions}>
             <MaterialCommunityIcons name="dots-vertical" size={24} color={styles.inactiveIcon.color} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };


  // Define sections for the SectionList. Now both have data.
  const sections = [
    {
      title: "📂 Your Playlists", // Changed order to show Playlists first (common pattern)
      data: playlists,
    },
    {
      title: "🎶 Saved Songs",
      data: savedSongs,
    },
    // Add more sections later (e.g., Artists, Albums)
  ];

  return (
    // Use SafeAreaView
    <SafeAreaView style={styles.safeArea}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        // Use the unified render function
        renderItem={renderLibraryItem}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        // Removed renderSectionFooter
        contentContainerStyle={styles.listContentContainer} // Use specific style for padding
        stickySectionHeadersEnabled={false} // Optional: decide if headers should stick
      />

      {/* --- Bottom Navigation Bar (Copied & Adapted from HomeScreen) --- */}
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/screens/home")}
        >
          <MaterialCommunityIcons
            name={activeTab === 'home' ? "home" : "home-outline"}
            size={28}
            color={activeTab === 'home' ? styles.activeIcon.color : styles.inactiveIcon.color}
          />
          <Text style={activeTab === 'home' ? styles.activeText : styles.inactiveText}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Library Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/screens/library")} // No action needed if already here
        >
          <MaterialCommunityIcons
            name={activeTab === 'library' ? "music-box-multiple" : "music-box-multiple-outline"}
            size={28}
            color={activeTab === 'library' ? styles.activeIcon.color : styles.inactiveIcon.color}
          />
          <Text style={activeTab === 'library' ? styles.activeText : styles.inactiveText}>
            Library
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/screens/profile")}
        >
          <MaterialCommunityIcons
            name={activeTab === 'profile' ? "account-circle" : "account-circle-outline"}
            size={28}
            color={activeTab === 'profile' ? styles.activeIcon.color : styles.inactiveIcon.color}
          />
          <Text style={activeTab === 'profile' ? styles.activeText : styles.inactiveText}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212", // Main background
  },
  listContentContainer: {
    paddingHorizontal: 15, // Horizontal padding for list items
    paddingTop: 10,       // Padding at the top of the list
    paddingBottom: 90,    // Increased padding to ensure content clears the taller nav bar
    backgroundColor: "#121212",
  },
  sectionTitle: {
    fontSize: 18, // Slightly smaller section titles
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    marginTop: 10, // Space above title
    paddingLeft: 5, // Align with item text slightly
  },
  // Unified style for both song and playlist items
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    // backgroundColor: "#1E1E1E", // Can add background if desired, or keep transparent
    paddingVertical: 5, // Add vertical padding for better touch area
  },
  itemImage: {
    width: 55, // Consistent image size
    height: 55,
    borderRadius: 6, // Slightly softer corners, or 0 for square
    marginRight: 12,
    backgroundColor: '#333', // Placeholder background
  },
  itemInfo: {
    flex: 1, // Take remaining space
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16, // Item title size
    color: "#fff",
    fontWeight: "600", // Medium weight
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 13, // Subtitle size
    color: "#aaa", // Lighter color for subtitle
  },
  moreOptions: {
     paddingLeft: 10, // Space before the icon
     paddingVertical: 5, // Vertical touch area
  },
  // --- Bottom Navigation Bar Styles (Copied from HomeScreen) ---
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#181818",
    height: 65 + (Platform.OS === 'ios' ? 15 : 0),
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    borderTopWidth: 1,
    borderTopColor: "#282828",
    position: 'absolute', // Keep it absolute
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
    paddingTop: 5,
    flex: 1,
    paddingVertical: 5,
  },
  activeIcon: {
    color: "#1DB954", // Spotify green
  },
  inactiveIcon: {
    color: "#b3b3b3", // Standard inactive grey
  },
  activeText: {
    fontSize: 11,
    color: "#1DB954",
    marginTop: 3,
    fontWeight: '600',
  },
  inactiveText: {
    fontSize: 11,
    color: "#b3b3b3",
    marginTop: 3,
    fontWeight: '500',
  },
  // Removed old styles like container, songCard, playlistCard, etc.
});

export default LibraryScreen;