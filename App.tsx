import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Text GPT</Text>

      <Text style={styles.instructions}>
        Press hold this button to record voice, Release the button to send the
        recording, and you'll hear a response
      </Text>

      <Text style={styles.label}>Your Message:</Text>

      <Text style={styles.holdButton}>Hold to Speak</Text>

      <Button title="Reply last message" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  instructions: {
    textAlign: 'center',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  holdButton: {
    width: '90%',
    padding: 30,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: 'lightgray',
    textAlign: 'center',
    marginVertical: 15,
  },
});
