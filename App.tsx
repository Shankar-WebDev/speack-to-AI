import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, Button, Pressable } from "react-native";
import { useVoiceRecognition } from "./hooks/useVoiceRecongnition";
import { Audio } from "expo-av";
import { writeAudioFile } from "./utils/writeAudioTofile";
import { playFormPath } from "./utils/playFromPath";
import * as FileSystem from "expo-file-system"
import { fetchAudio } from "./utils/fetchAudio";

Audio.setAudioModeAsync(
  {
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid:false
  }
)


export default function App() {
  const [borderColor, setBorderColor] = useState<"lightgray" | "lightgreen">(
    "lightgray"
  );
const [urlPath, setUrlPath] = useState("")
  const {state,startRecognizing,stopRecognizing,destroyRecognizer} = useVoiceRecognition()

  const listFile = async () =>{
      try{
        const result = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory!
        )
        if(result.length >0){
          const filename = result[0];
          const path =  FileSystem.documentDirectory + filename;
          setUrlPath(path)
        }
      }catch(e){
        console.log(e)
      }
  }


  const handleSubmit = async () =>{
    if(!state.results[0]) return
    try{
      //fetch the audio blob
      const audioBlob = await fetchAudio(state.results[0])

      const reader = new FileReader();
      reader.onload= async(e) =>{
        if(e.target && typeof e.target.result === "string"){

          //data:audio/mpeg;base64....(actual base64 data).....
          const audioData = e.target.result.split(",")[1];

          //save data 
        const path=  await writeAudioFile(audioData);


        //play audio 
        setUrlPath(path)
        playFormPath(path)
        destroyRecognizer();
        }
      }
        reader.readAsDataURL(audioBlob)
    }catch(e){
      console.log(e)
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Talk To AI</Text>

      <Text style={styles.instructions}>
        Press hold this button to record voice, Release the button to send the
        recording, and you'll hear a response
      </Text>

      <Text style={styles.label}>{JSON.stringify(state,null,2)}</Text>
      <Text style={styles.label}>Your Message:</Text>

<Pressable
  onPressIn={() => {
    if (!state.isRecording) {
      setBorderColor("lightgreen");
      startRecognizing();
    }
  }}
  onPressOut={() => {
    setBorderColor("lightgray");
    if (state.isRecording) {
      stopRecognizing();
    }
    handleSubmit()
  }}
  style={{
    width: "90%",
    padding: 30,
    gap: 10,
    borderRadius: 10,
    borderWidth: 3,
    alignItems: "center",
    borderColor: borderColor, // ✅ fixed
    margin: 2,
  }}
>
  <Text>Hold to Speak</Text>
</Pressable>


      <Button title="Reply last message" onPress={async () => {
        await playFormPath( urlPath)
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  instructions: {
    textAlign: "center",
    marginVertical: 5,
    fontWeight: "bold",
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },

});
