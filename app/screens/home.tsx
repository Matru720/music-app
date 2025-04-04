// Import useState from react
import React, { useState } from "react";
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
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

// --- Define possible Tab Names Type ---
type TabName = 'home' | 'library' | 'profile';

// --- Define a type for our music items ---
interface MusicItem {
  id: string;
  title: string;
  artist?: string;
  image: string;
}

// --- Sample Data (omitted for brevity, same as before) ---
const carouselData = [
    { id: "c1", image: "https://rukminim2.flixcart.com/image/850/1000/l01blow0/poster/2/w/z/medium-music-wallpaper-on-fine-art-paper-theme-images-hd-original-imagbx2phbqcnzym.jpeg?q=90&crop=false" },
    { id: "c2", image: "https://moises.ai/_next/image/?url=https%3A%2F%2Fstorage.googleapis.com%2Fmoises-cms%2Fhow_to_reading_sheet_music_image_338d99b137%2Fhow_to_reading_sheet_music_image_338d99b137.jpg&w=1920&q=75" },
    { id: "c3", image: "https://t3.ftcdn.net/jpg/03/35/35/44/360_F_335354449_fkBBxEzbetEFg2D9uqkmH3cHRAW6gqpC.jpg" }
];
const topPlaylists: MusicItem[] = [
    { id: "pl1", title: "Chill Vibes", image: "https://www.thomann.de/blog/wp-content/uploads/2024/10/singerheader-770x425.jpg" },
    { id: "pl2", title: "Workout Hits", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkl8oQtw-QW0iWKaboP1I6UFBYdrCRTtOtIA&s" },
    { id: "pl3", title: "Focus Flow", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHL8tg92jniUX2FeyGnBdP6V42FcyoPFRCTw&s" },
    { id: "pl4", title: "Party Starters", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_quJgAAXi8Bb9fFxr6QiGPOosdNtFFXdDjQ&s" },
    { id: "pl5", title: "Indie Anthems", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnKI34WgmwBlVj2JsuObHj8a6aULYjM2e_ZA&s" },
];
const recentlyPlayed: MusicItem[] = [
  { id: "rp1", title: "Good Days", artist: "SZA", image: "https://cdn.britannica.com/83/211883-050-46933F1A/Rihanna-Barbadian-singer-Robyn-Fenty.jpg?w=400&h=300&c=crop" },
  { id: "rp2", title: "Levitating", artist: "Dua Lipa", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIABtrqQy06cSJJs9ea08af2biqmWgMramGA&s" },
  { id: "rp3", title: "Stay", artist: "The Kid LAROI", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1kKWDCWRCNvaEzi222wwvPce0wtebiVajQ&s" },
  { id: "rp4", title: "Peaches", artist: "Justin Bieber", image: "https://i.insider.com/6410967b9aa2e6001956d715?width=700" },
  { id: "rp5", title: "Blinding Lights", artist: "The Weeknd", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ20BkuhJna-9agLQvXX4asjB0E1-QtLHoCqQ&s" },
];
const madeForYou: MusicItem[] = [
  { id: "mfy1", title: "Discover Weekly", image: "https://i.pinimg.com/236x/e1/28/83/e12883c826d0dc1b4e94cfebbcfce91e.jpg" },
  { id: "mfy2", title: "Daily Mix 1", image: "https://imgix.ranker.com/list_img_v2/18353/338353/original/top-25-indian-singers-of-all-time-u1?w=1200&h=720&fm=pjpg&q=80&fit=crop&dpr=1" },
  { id: "mfy3", title: "Release Radar", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX8icNoMwipJNxlt7NkJ3eDu3X8fsklDddyA&s" },
  { id: "mfy4", title: "Chill Hits", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNmjkdULf4Dy6MXJKmOvfwVy3kgN4t2bzdRg&s" },
  { id: "mfy5", title: "Summer Rewind", image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84bc866c36b8a0f6bdd6f8f0b6" },
];
const newReleases: MusicItem[] = [
  { id: "nr1", title: "Midnights", artist: "Taylor Swift", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkl8oQtw-QW0iWKaboP1I6UFBYdrCRTtOtIA&s" },
  { id: "nr2", title: "Dawn FM", artist: "The Weeknd", image: "https://images.moneycontrol.com/static-mcnews/2025/03/20250305025110_kalpana.png?impolicy=website&width=770&height=431" },
  { id: "nr3", title: "SOS", artist: "SZA", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1kKWDCWRCNvaEzi222wwvPce0wtebiVajQ&s" },
  { id: "nr4", title: "Un Verano Sin Ti", artist: "Bad Bunny", image: "https://cdn.britannica.com/09/250309-050-64AD0E96/Ofra-Haza-singing-1989.jpg" },
  { id: "nr5", title: "Harry's House", artist: "Harry Styles", image: "https://5.imimg.com/data5/SELLER/Default/2022/3/BX/EW/DA/102856831/1648197197458-500x500.jpg" },
];


// --- HomeScreen Component ---
const HomeScreen = () => {
  const router = useRouter();

  // Navigate to player screen
  const handleItemPress = (id: string) => {
    console.log("Navigating to player with ID:", id);
    router.push({ pathname: "/screens/player", params: { id } });
  };

  // Reusable Render Function for Music Cards
  const renderMusicItem = ({ item }: { item: MusicItem }) => (
    <TouchableOpacity style={styles.musicCard} onPress={() => handleItemPress(item.id)}>
      <Image source={{ uri: item.image }} style={styles.musicImage} />
      <Text style={styles.musicTitle} numberOfLines={1}>{item.title}</Text>
      {item.artist && (
         <Text style={styles.musicArtist} numberOfLines={1}>{item.artist}</Text>
      )}
    </TouchableOpacity>
  );

  // --- USE STATE FOR activeTab ---
  // We use useState to manage the active tab state.
  // Even though it's initialized to 'home' here and doesn't change within *this*
  // screen's logic, TypeScript understands state variables can change,
  // resolving the strict comparison error in the editor.
  const [activeTab, setActiveTab] = useState<TabName>('home');
  // We don't actually need setActiveTab in *this* file, but it's part of the useState hook.

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- Scrollable Content Area --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Sections... (omitted for brevity, same as before) */}
         {/* Featured Section */}
         <Text style={styles.featuredTitle}>Featured</Text>
         <Carousel
           loop
           width={width}
           height={width * 0.5}
           autoPlay={true}
           autoPlayInterval={5000}
           data={carouselData}
           scrollAnimationDuration={1000}
           renderItem={({ item }) => (
             <TouchableOpacity onPress={() => console.log("Carousel Item Pressed:", item.id)}>
               <Image source={{ uri: item.image }} style={styles.carouselImage} />
             </TouchableOpacity>
           )}
           style={styles.carousel}
         />

         {/* Playlists Section */}
         <Text style={styles.sectionTitle}>Top Playlists</Text>
         <FlatList
           horizontal
           data={topPlaylists}
           renderItem={renderMusicItem}
           keyExtractor={(item) => item.id}
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={styles.listPadding}
         />

          {/* Recently Played Section */}
          <Text style={styles.sectionTitle}>Recently Played</Text>
          <FlatList
            horizontal
            data={recentlyPlayed}
            renderItem={renderMusicItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listPadding}
          />

          {/* Made For You Section */}
          <Text style={styles.sectionTitle}>Made For You</Text>
          <FlatList
            horizontal
            data={madeForYou}
            renderItem={renderMusicItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listPadding}
          />

          {/* New Releases Section */}
          <Text style={styles.sectionTitle}>New Releases</Text>
          <FlatList
            horizontal
            data={newReleases}
            renderItem={renderMusicItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listPadding}
          />
      </ScrollView>

      {/* --- Bottom Navigation Bar --- */}
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/screens/home")}
        >
          <MaterialCommunityIcons
            name={activeTab === 'home' ? "home" : "home-outline"}
            size={28}
            // Comparison should now be accepted by the editor
            color={activeTab === 'home' ? styles.activeIcon.color : styles.inactiveIcon.color}
          />
          <Text style={activeTab === 'home' ? styles.activeText : styles.inactiveText}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Library Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/screens/library")}
        >
          <MaterialCommunityIcons
            name={activeTab === 'library' ? "music-box-multiple" : "music-box-multiple-outline"}
            size={28}
            // Comparison should now be accepted by the editor
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
            // Comparison should now be accepted by the editor
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

// --- Styles --- (omitted for brevity, same as before) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
     paddingBottom: 80, // Keep padding to clear nav bar
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 15,
  },
  carousel: {
     marginBottom: 25,
  },
  carouselImage: {
    width: width - 30,
    height: width * 0.5,
    borderRadius: 10,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  listPadding: {
    paddingHorizontal: 15,
  },
  musicCard: {
    marginRight: 15,
    borderRadius: 10,
    width: 140,
    overflow: 'hidden',
  },
  musicImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  musicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: "#fff",
    marginTop: 8,
    paddingHorizontal: 5,
  },
  musicArtist: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  // --- Bottom Navigation Bar Styles ---
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#181818",
    height: 65 + (Platform.OS === 'ios' ? 15 : 0),
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    borderTopWidth: 1,
    borderTopColor: "#282828",
    position: 'absolute',
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
    color: "#1DB954",
  },
  inactiveIcon: {
    color: "#b3b3b3",
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
});


export default HomeScreen;