import { useState, useEffect, useCallback } from "react";
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";

interface IState {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  partialResults: string[];
  isRecording: boolean;
}

export const useVoiceRecognition = () => {
  const [state, setState] = useState<IState>({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isRecording: false,
  });

  const resetState = useCallback(() => {
    setState({
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: "",
      isRecording: false,
    });
  }, [setState]);

  const startRecognizing = useCallback(async () => {
    resetState();
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  }, [resetState]);

  const stopRecognizing = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const cancelRecognizing = useCallback(async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const destroyRecognizer = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    resetState();
  }, [resetState]);

  useEffect(() => {
    Voice.onSpeechStart = (e: any) => {
      setState((prevState) => ({
        ...prevState,
        started: "✅",
        isRecording: true,
      }));
    };
    Voice.onSpeechRecognized = () => {
      setState((prevState) => ({ ...prevState, recognized: "✅" }));
    };
    Voice.onSpeechEnd = (e: any) => {
      setState((prevState) => ({ ...prevState, end: "✅", isRecording: false }));
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setState((prevState) => ({
        ...prevState,
        error: JSON.stringify(e.error),
        isRecording: false,
      }));
    };
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, results: e.value! }));
      }
    };
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, partialResults: e.value! }));
      }
    };
    Voice.onSpeechVolumeChanged = (e: any) => {
      setState((prevState) => ({ ...prevState, pitch: e.value }));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    state,
    setState,
    resetState,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizer,
  };
};



// import { useState, useEffect, useCallback } from "react";
// import Voice, {
//   SpeechErrorEvent,
//   SpeechResultsEvent,
// } from "@react-native-voice/voice";
// import { PermissionsAndroid, Platform } from "react-native";


// async function requestMicrophonePermission() {
//   if (Platform.OS === "android") {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//       {
//         title: "Microphone Permission",
//         message: "This app needs access to your microphone for speech recognition",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK",
//       }
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   }
//   return true;
// }


// interface IState {
//   recognized: string;
//   pitch: string;
//   error: string;
//   end: string;
//   started: string;
//   results: string[];
//   partialResults: string[];
//   isRecording: boolean;
// }

// export const useVoiceRecognition = () => {
//   const [state, setState] = useState<IState>({
//     recognized: "",
//     pitch: "",
//     error: "",
//     end: "",
//     started: "",
//     results: [],
//     partialResults: [],
//     isRecording: false,
//   });

//   const resetState = useCallback(() => {
//     setState({
//       recognized: "",
//       pitch: "",
//       error: "",
//       started: "",
//       results: [],
//       partialResults: [],
//       end: "",
//       isRecording: false,
//     });
//   }, [setState]);

//   const startRecognizing = useCallback(async () => {
//     resetState();
//     try {
//       await Voice.start("en-US");
//     } catch (e) {
//       console.error(e);
//     }
//   }, [resetState]);

//   const stopRecognizing = useCallback(async () => {
//   if (!state.isRecording) {
//     console.warn("Tried to stop, but not recording");
//     return;
//   }
//   try {
//     await Voice.stop();
//   } catch (e) {
//     console.error("Voice.stop error:", e);
//   }
// }, [state.isRecording]);

// const cancelRecognizing = useCallback(async () => {
//   if (!state.isRecording) return;
//   try {
//     await Voice.cancel();
//   } catch (e) {
//     console.error("Voice.cancel error:", e);
//   }
// }, [state.isRecording]);

// const destroyRecognizer = useCallback(async () => {
//   try {
//     await Voice.destroy();
//   } catch (e) {
//     console.error("Voice.destroy error:", e);
//   }
//   resetState();
// }, [resetState]);


//   useEffect(() => {
//     Voice.onSpeechStart = (e: any) => {
//       setState((prevState) => ({
//         ...prevState,
//         started: "√",
//         isRecording: true,
//       }));
//     };
//     Voice.onSpeechRecognized = () => {
//       setState((prevState) => ({ ...prevState, recognized: "√" }));
//     };
//     Voice.onSpeechEnd = (e: any) => {
//       setState((prevState) => ({ ...prevState, end: "√", isRecording: false }));
//     };
//     Voice.onSpeechError = (e: SpeechErrorEvent) => {
//       setState((prevState) => ({
//         ...prevState,
//         error: JSON.stringify(e.error),
//         isRecording: false,
//       }));
//     };
//     Voice.onSpeechResults = (e: SpeechResultsEvent) => {
//       if (e.value) {
//         setState((prevState) => ({ ...prevState, results: e.value! }));
//       }
//     };
//     Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
//       if (e.value) {
//         setState((prevState) => ({ ...prevState, partialResults: e.value! }));
//       }
//     };
//     Voice.onSpeechVolumeChanged = (e: any) => {
//       setState((prevState) => ({ ...prevState, pitch: e.value }));
//     };

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   return {
//     state,
//     setState,
//     resetState,
//     startRecognizing,
//     stopRecognizing,
//     cancelRecognizing,
//     destroyRecognizer,
//   };
// };