import React, { useState, useRef } from 'react'; // Import useRef
import {
  View,
  Text,
  TextInput, // Import TextInput for type annotation
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  // --- State: Use username instead of email ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // --- Ref for focusing password input ---
  const passwordInputRef = useRef<TextInput>(null); // Specify TextInput type

  const handleLogin = () => {
    const trimmedUsername = username.trim();

    // --- Validation: Check username and password ---
    if (!trimmedUsername) {
      Alert.alert('Missing Information', 'Please enter your username.');
      return;
    }
    if (!password) {
      Alert.alert('Missing Information', 'Please enter your password.');
      return;
    }

    console.log('Attempting Login with:', { username: trimmedUsername, password });

    // --- Implement actual authentication logic here ---
    // Example: Make an API call to verify credentials
    // If successful:
    Alert.alert('Login Success (Placeholder)', `Welcome back, ${trimmedUsername}!`); // Placeholder success message
    router.push('/screens/home'); // Navigate to home screen
    // If failed:
    // Alert.alert('Login Failed', 'Invalid username or password.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screenContainer}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* --- Titles --- */}
          <Text style={styles.title}>Log in</Text>
          <Text style={styles.subtitle}>Enter your username and password</Text>

          {/* --- Username Input --- */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#A0A0A0"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()} // Focus password on submit
            blurOnSubmit={false}
            textContentType="username" // Autofill hint
          />

          {/* --- Password Input --- */}
          <TextInput
            ref={passwordInputRef} // Assign ref
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry // Hide password
            value={password}
            onChangeText={setPassword}
            returnKeyType="done" // 'Done' on keyboard
            onSubmitEditing={handleLogin} // Submit form on 'Done'
            textContentType="password" // Autofill hint
          />

           {/* --- Forgot Password Link (Optional Placement) --- */}
           <TouchableOpacity
             style={styles.forgotPasswordContainer}
             onPress={() => Alert.alert('Forgot Password', 'Forgot Password functionality needs implementation.')}
             activeOpacity={0.7}
           >
             <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
           </TouchableOpacity>

          {/* --- Login Button --- */}
          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          {/* --- Separator --- */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* --- Navigate to Sign Up --- */}
          <TouchableOpacity onPress={() => router.push('/')} // Ensure '/' is your correct signup route
             style={styles.navLinkContainer}>
            <Text style={styles.navLinkText}>Don't have an account? </Text>
            <Text style={[styles.navLinkText, styles.navLinkHighlight]}>Sign up</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --- Styles (Adapted from Signup Screen for consistency) ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', // White title
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3', // Light grey subtitle
    marginBottom: 35,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#282828', // Darker input background
    color: '#FFFFFF', // White input text
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#404040', // Subtle border
  },
  forgotPasswordContainer: {
     width: '100%', // Take full width to align text easily
     alignItems: 'flex-end', // Align text to the right
     marginTop: 10, // Space above
     marginBottom: 15, // Space below before button
     paddingHorizontal: 5, // Small horizontal padding if needed
   },
   forgotPasswordText: {
     color: '#B3B3B3', // Light grey
     fontSize: 14,
     textDecorationLine: 'underline', // Underline to indicate link
   },
  button: {
    backgroundColor: '#1DB954', // Spotify green
    paddingVertical: 16,
    borderRadius: 50, // Fully rounded
    marginTop: 15, // Adjusted margin
    marginBottom: 25,
    width: '80%', // Consistent button width
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#404040', // Dark grey line
  },
  separatorText: {
    color: '#B3B3B3',
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  navLinkContainer: { // Renamed from loginLinkContainer for clarity
    flexDirection: 'row',
    marginTop: 15, // Adjusted margin
  },
  navLinkText: { // Renamed from loginLinkText
    color: '#B3B3B3',
    fontSize: 15,
  },
  navLinkHighlight: { // Renamed from loginLinkHighlight
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;