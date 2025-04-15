import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput, // We need TextInput for the type as well
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { useState, useRef } from 'react'; // Import useRef

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- Refs for focusing with explicit TextInput type ---
  const emailInputRef = useRef<TextInput>(null); // Specify the type here
  const passwordInputRef = useRef<TextInput>(null); // Specify the type here

  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    // --- Validation ---
    if (!trimmedUsername) {
      Alert.alert('Missing Information', 'Please enter a username.');
      return;
    }
    if (!trimmedEmail) {
      Alert.alert('Missing Information', 'Please enter an email address.');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Invalid Format', 'Please enter a valid email address (e.g., user@example.com).');
      return;
    }
    if (!password) {
      Alert.alert('Missing Information', 'Please enter a password.');
      return;
    }

    // --- If all validations pass ---
    console.log('Attempting Signup with:', { username: trimmedUsername, email: trimmedEmail, password });

    // !! Placeholder for actual signup logic (e.g., API call) !!
    Alert.alert('Signup Initiated (Placeholder)', `Welcome, ${trimmedUsername}!`);
    // On success, you might navigate:
    // router.push('/home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screenContainer}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Enter your details below</Text>

          {/* --- Username Input --- */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#A0A0A0"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            returnKeyType="next"
             // Use optional chaining just in case ref isn't attached yet
            onSubmitEditing={() => emailInputRef.current?.focus()}
            blurOnSubmit={false}
            textContentType="username" // Helps with password managers/autofill
          />

          {/* --- Email Input --- */}
          <TextInput
            ref={emailInputRef} // Assign the ref
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            returnKeyType="next"
            // Use optional chaining
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={false}
            textContentType="emailAddress" // Helps with password managers/autofill
          />

          {/* --- Password Input --- */}
          <TextInput
            ref={passwordInputRef} // Assign the ref
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignup} // Trigger signup on final submit
            textContentType="newPassword" // Helps with password managers
          />

          {/* --- Signup Button --- */}
          <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* --- Separator --- */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* --- Link to Login --- */}
          <TouchableOpacity onPress={() => router.push('/screens/login')} style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <Text style={[styles.loginLinkText, styles.loginLinkHighlight]}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Styles (same as previous good version) ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#121212', // Spotify-like dark background
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
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 35,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#282828',
    color: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#404040',
  },
  button: {
    backgroundColor: '#1DB954',
    paddingVertical: 16,
    borderRadius: 50,
    marginTop: 25,
    marginBottom: 25,
    width: '80%',
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
    backgroundColor: '#404040',
  },
  separatorText: {
    color: '#B3B3B3',
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  loginLinkText: {
    color: '#B3B3B3',
    fontSize: 15,
  },
  loginLinkHighlight: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});