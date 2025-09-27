import * as FileSystem from "expo-file-system"



export const writeAudioFile = async(audioData:string) =>{
   const path=FileSystem.documentDirectory + "temp.mp3"
   await FileSystem.writeAsStringAsync(path, audioData,{
        encoding:FileSystem.EncodingType.Base64,

   })
   return path;

}