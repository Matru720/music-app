import React, { useState } from "react";
import {
  View,
  Text,
  // Removed TextInput
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView, // Add SafeAreaView
  ScrollView,   // Add ScrollView
  Alert,        // Import Alert for confirmation
  Platform      // Import Platform
} from "react-native";
import { useRouter } from "expo-router";
// Use MaterialCommunityIcons for consistency
import { MaterialCommunityIcons } from "@expo/vector-icons";

// --- Define possible Tab Names Type ---
type TabName = 'home' | 'library' | 'profile';

const ProfileScreen = () => {
  const router = useRouter();

  // State for user data (can be fetched from context/API later)
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com"); // Keep email for display maybe?

  // --- USE STATE FOR activeTab ---
  const [activeTab, setActiveTab] = useState<TabName>('profile'); // Set active tab

  // Navigate to a dedicated Edit Profile screen (to be created)
  const handleEditProfile = () => {
    console.log("Navigate to Edit Profile Screen");
    // router.push('/screens/edit-profile'); // Example navigation
    Alert.alert("Edit Profile", "Navigation to edit screen not implemented yet.");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout", // Title
      "Are you sure you want to logout?", // Message
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            console.log("Logging out...");
            // Perform actual logout logic (clear tokens, context, etc.)
            router.replace("/screens/login"); // Use replace to prevent going back
          },
          style: "destructive", // Make the Logout text red on iOS
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* --- User Info Header --- */}
        <View style={styles.userInfoHeader}>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIABtrqQy06cSJJs9ea08af2biqmWgMramGA&s" }} // Use a more specific query
            style={styles.avatar}
          />
          <Text style={styles.username}>{name}</Text>
          {/* Optional: Edit Profile Button */}
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* --- Settings Options List --- */}
        <View style={styles.optionsList}>
          {/* Example Option: Account */}
          <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert("Navigation", "Account Settings screen not implemented.")}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="account-outline" size={24} color={styles.iconColor.color} />
              <Text style={styles.optionText}>Account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={styles.iconColor.color} />
          </TouchableOpacity>

          {/* Example Option: Data Saver (Common in music apps) */}
           <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert("Navigation", "Data Saver screen not implemented.")}>
             <View style={styles.optionLeft}>
               <MaterialCommunityIcons name="signal-cellular-outline" size={24} color={styles.iconColor.color} />
               <Text style={styles.optionText}>Data Saver</Text>
             </View>
             <MaterialCommunityIcons name="chevron-right" size={24} color={styles.iconColor.color} />
           </TouchableOpacity>

           {/* Example Option: Playback */}
            <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert("Navigation", "Playback screen not implemented.")}>
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons name="play-circle-outline" size={24} color={styles.iconColor.color} />
                <Text style={styles.optionText}>Playback</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={styles.iconColor.color} />
            </TouchableOpacity>

           {/* Example Option: Devices */}
            <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert("Navigation", "Devices screen not implemented.")}>
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons name="speaker-multiple" size={24} color={styles.iconColor.color} />
                <Text style={styles.optionText}>Devices</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={styles.iconColor.color} />
            </TouchableOpacity>

           {/* Example Option: Privacy & Security */}
           <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert("Navigation", "Privacy screen not implemented.")}>
             <View style={styles.optionLeft}>
               <MaterialCommunityIcons name="lock-outline" size={24} color={styles.iconColor.color} />
               <Text style={styles.optionText}>Privacy & Security</Text>
             </View>
             <MaterialCommunityIcons name="chevron-right" size={24} color={styles.iconColor.color} />
           </TouchableOpacity>

          {/* Spacer View */}
          <View style={{ height: 20 }} />

          {/* Logout Option */}
          <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
             <View style={styles.optionLeft}>
                 {/* Note: No icon needed usually, text color indicates action */}
                 <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
             </View>
             {/* No chevron needed for logout */}
           </TouchableOpacity>
        </View>

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
            color={activeTab === 'library' ? styles.activeIcon.color : styles.inactiveIcon.color}
          />
          <Text style={activeTab === 'library' ? styles.activeText : styles.inactiveText}>
            Library
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/screens/profile")} // No action needed
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
    backgroundColor: "#121212", // Dark background
  },
  scrollContainer: {
    flexGrow: 1, // Ensure container can grow to fit content
    alignItems: "center",
    paddingBottom: 90, // Padding to clear bottom nav bar
  },
  userInfoHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 110, // Slightly smaller avatar
    height: 110,
    borderRadius: 55, // Keep it circular
    marginBottom: 15,
    backgroundColor: '#535353', // Placeholder bg
  },
  username: {
    fontSize: 24, // Larger username
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  editButton: {
     borderColor: '#535353', // Subtle border
     borderWidth: 1,
     borderRadius: 20,
     paddingVertical: 8,
     paddingHorizontal: 20,
  },
  editButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
  },
  // --- Options List ---
  optionsList: {
    width: '100%',
    paddingHorizontal: 15, // Padding for the list container
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between', // Pushes icon/text left and chevron right
    // backgroundColor: "#181818", // Optional background for items
    paddingVertical: 15, // Vertical padding for touch area and spacing
    borderBottomWidth: 1,
    borderBottomColor: '#282828', // Subtle separator line
    width: "100%",
  },
  optionLeft: { // Group icon and text together
      flexDirection: 'row',
      alignItems: 'center',
  },
  optionText: {
    marginLeft: 15, // Space between icon and text
    fontSize: 16, // Slightly smaller option text
    color: "#fff",
  },
  logoutText: {
    color: "#f15e5e", // Red color for logout text
    fontWeight: '600',
    marginLeft: 0, // No margin needed if no icon
  },
  // --- Bottom Navigation Bar Styles --- (Copied)
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#181818",
    height: 65 + (Platform.OS === 'ios' ? 15 : 0),
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    borderTopWidth: 1,
    borderTopColor: "#282828",
    // Removed position: 'absolute' if ScrollView handles padding correctly
    // If content overlap occurs, add position: 'absolute', bottom: 0, left: 0, right: 0 back
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
   iconColor: { // Re-add iconColor style used in options
     color: '#b3b3b3',
   },
  // Removed old styles: container, inputContainer, input, option (old style)
});

export default ProfileScreen;