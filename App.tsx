import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Modal, Image, Text, Button } from 'react-native';

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 2,
  longitudeDelta: 2,
}

// Manages the style of the various components in app
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});

// Specifying the layout of the cctv data for type checking
type CCTV = {
  cctv: {
    index: string;
    recordTimestamp: {
      recordDate: string;
      recordTime: string;
      recordEpoch: string;
    };
    location: {
      district: string;
      locationName: string;
      nearbyPlace: string;
      longitude: string;
      latitude: string;
      elevation: string;
      direction: string;
      county: string;
      route: string;
      routeSuffix: string;
      postmilePrefix: string;
      postmile: string;
      alignment: string;
      milepost: string;
    };
    inService: string;
    imageData: {
      imageDescription: string;
      streamingVideoURL: string;
      static: {
        currentImageUpdateFrequency: string;
        currentImageURL: string;
        referenceImageUpdateFrequency: string;
        referenceImage1UpdateAgoURL: string;
        referenceImage2UpdatesAgoURL: string;
        referenceImage3UpdatesAgoURL: string;
        referenceImage4UpdatesAgoURL: string;
        referenceImage5UpdatesAgoURL: string;
        referenceImage6UpdatesAgoURL: string;
        referenceImage7UpdatesAgoURL: string;
        referenceImage8UpdatesAgoURL: string;
        referenceImage9UpdatesAgoURL: string;
        referenceImage10UpdatesAgoURL: string;
        referenceImage11UpdatesAgoURL: string;
        referenceImage12UpdatesAgoURL: string;
      };
    };
  }
}
// NOTE: don't rely on default component styles, will look different for every platform,
//       ALWAYS make custom styles for otherwise default components (e.g. buttons)
export default function App() {

  // Manages modal state (for when user clicks marker)
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State fore storing all cctvs
  const [cams, setCams] = useState<CCTV[]>([]);
  // State for tracking currently selected cctv (for displaying corresponding cctv image in modal)
  const [selectedCCTV, setSelectedCCTV] = useState<CCTV>(); 

  /*
    TODO: 
          - Focus on district 1, get the markers, modal, etc looking/working well/as finished product,
          then once done, add rest of districts

          - Add current cam of location
          - Add rest of districts
          - Prioritize clean UI
          - Decide what the modal should look like/include 
          - Look into dynamic marker display for performance if needed??
  */

  // Data from district 1
  useEffect(() => {
    // Fetch cctv data
    fetch('https://cwwp2.dot.ca.gov/data/d1/cctv/cctvStatusD01.json')
      // Convert response into json
      .then((response) => response.json())
      // Can access all properties of json object at this point aka all data related to cctv's
      .then((json) => {
        // Print data to console
        //console.log(JSON.stringify(json.data, null, 2))

        // Store all cameras from json object into CCTV array d1Cams
        const d1Cams: CCTV[] = json.data.map((cam: CCTV) => cam);
        // Set/update cams to hold all camera data
        setCams(d1Cams)
      })
      // Catch any fetching error
      .catch((error) => {
        alert("Something went wrong...")
        console.error(error)
      })
  }, []) // Only fetch data once on app load

  // Custom handler for pressing a marker
  const handleMarkerPress = (cctv: CCTV) => {
    setSelectedCCTV(cctv)
    setIsModalVisible(true)
  }

  return (
    <View style={styles.container}>
      { /* Sets Google Maps as the map provider and initial region */ }
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
      // TODO: figure out why not displaying user location
      //showsUserLocation
      //showsMyLocationButton
      >
        {
        // Run through all cameras and render a marker for each one's location
        cams.map((currCam, index) => (
          <Marker
            key={index}
            coordinate={{latitude: parseFloat(currCam.cctv.location.latitude), longitude: parseFloat(currCam.cctv.location.longitude)}}
            onPress={() => handleMarkerPress(currCam)}
          />
        ))}
      </MapView>

      <Modal 
        // Manage modal visibility with state
        visible={isModalVisible}
        // Dismisses modal when user presses back on Android or gestures on iOS
        onRequestClose={() => setIsModalVisible(false)}
        // Animation of modal
        animationType='fade'
      >
        {/* The layout of the modal */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          { // Only render the modal if there's a selected cctv/selcetedCCTV is not null (using boolean logic)
          selectedCCTV && (
            <View>
              {/* Display the selected cctv's image */}
              <Image
                source={{ uri: selectedCCTV.cctv.imageData.static.currentImageURL }}
                style={{ width: 400, height: 400 }}
              />
              <Button title="Close" onPress={() => setIsModalVisible(false)} />
            </View>
          )}
        </View>
      </Modal>
      
    </View>
  );
}