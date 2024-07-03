import { StyleSheet, Text, View, Button, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Video } from 'expo-av';
import React, { useRef } from 'react';

export default function Home() {
  const navigation = useRouter();
  const {videoSource = "", imgSource = ""} = useLocalSearchParams<{videoSource: string, imgSource: string}>();
  const videoRef = useRef(null);
  return (
    <View>
        {/* The layout of the modal */}
        <View >
          {(
            <View>
              <>
                {/*console.log(selectedCCTV.cctv.index)*/}
              </>
              
              {videoSource !== "" ? (
                  /* Display live video if available */
                  <View>
                   <Video
                      ref={videoRef}
                      source={{ uri: videoSource }}
                      style={styles.video}
                      // TODO: change later to custom controls?
                      useNativeControls={true}
                      shouldPlay={true}
                      isLooping={true}
                    />

                    <Text>Displaying Video</Text>
                  </View>
                ) : (
                  /* Display the selected cctv's image if video is not available */
                  <View>
                    <Image
                      source={{ uri: imgSource}}
                      style={styles.video}
                    />
                    <Text>No live video is available for this camera, displaying most recent image instead.</Text>
                  </View>
                )
              
              }
              <Button title="Close" onPress={() => navigation.push("/")} />
            
            </View>
          )}
        </View>
      </View>

  );
}

const styles = StyleSheet.create({
    video: {
        width: 350,
        height: 275,
    },
    controlsContainer: {
        padding: 10,
    },
});