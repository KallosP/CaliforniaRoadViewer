import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Video, ResizeMode } from 'expo-av';
import React from 'react';

// NOTE: rough template of cctv details page, will change in future

export default function Home() {
  const { 
    videoSource = "", imgSource = "", county = "", 
    locationName = "", nearbyPlace = "",
    latlng = "", elevation = "", direction = "",
    route = "", routeSuffix = "", postmilePrefix = "",
    postmile = "", alignment = "", milepost = "" 
  } = 
    useLocalSearchParams<{ 
      videoSource: string, imgSource: string, county: string,
      locationName: string, nearbyPlace: string, 
      latlng: string, elevation: string, direction: string,
      route: string, routeSuffix: string, postmilePrefix: string,
      postmile: string, alignment: string, milepost: string
     }>();

  //const videoRef = useRef(null);

  const renderDetailText = (label: string, value: string) => (
    <Text style={styles.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  function handleOnPress() {
    requestAnimationFrame(() => {
      router.push('/')
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>CCTV Feed</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleOnPress()}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mediaContainer}>
          {videoSource !== "" ? (
            <Video
              ref={null}
              source={{ uri: videoSource }}
              style={styles.media}
              useNativeControls={true}
              shouldPlay={true}
              isLooping={true}
              resizeMode={ResizeMode.STRETCH}
            >
              <ActivityIndicator size="small" />
            </Video>
          ) : (
            <Image
              source={{ uri: imgSource }}
              style={styles.media}
              resizeMode="stretch"
            />
          )}
          <Text style={styles.caption}>
            {videoSource !== "" ? "Live Video" : "Most Recent Image"}
          </Text>
        </View>

        {!videoSource && (
          <Text style={styles.noVideoText}>
            No live video available for this camera.
          </Text>
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>CCTV Details</Text>
          {renderDetailText("Location", locationName)}
          {renderDetailText("County", county)}
          {renderDetailText("Nearby Place", nearbyPlace)}
          {renderDetailText("Latitude/Longitude", latlng)}
          {renderDetailText("Elevation", elevation)}
          {renderDetailText("Direction", direction)}
          {renderDetailText("Route", route)}
          {renderDetailText("Route Suffix", routeSuffix)}
          {renderDetailText("Postmile Prefix", postmilePrefix)}
          {renderDetailText("Postmile", postmile)}
          {renderDetailText("Alignment", alignment)}
          {renderDetailText("Milepost", milepost)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  caption: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  noVideoText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 16,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});