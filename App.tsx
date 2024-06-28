import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, Button } from 'react-native';

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

  // Specifying that cctvLocations is an array of tuples (of type number)
  const [cctvLocations, setCctvLocations] = useState<[number, number][]>([]);

  // Data from district 1
  useEffect(() => {
    // Fetch cctv data
    fetch('https://cwwp2.dot.ca.gov/data/d1/cctv/cctvStatusD01.json')
      // Convert response into json
      .then((response) => response.json())
      // Convert json object to a string and prettyprint
      .then((json) => {
        //setCctvLocations()
        // Run through all cctv's and store their lat and lng in d1CamLocations
        const d1CamLocations = json.data.map((cam: CCTV) => [
          // Convert lat lng to floats (in that order)
          parseFloat(cam.cctv.location.latitude),
          parseFloat(cam.cctv.location.longitude)
          //console.log("{", lat, ", ", lng, "}")
        ]);
        // Set these locations/update cctvLocations
        setCctvLocations(d1CamLocations)
      })
      // Catch any fetching error
      .catch((error) => {
        alert("Something went wrong...")
        console.error(error)
      })
  }, []) // Only fetch data once on app load

  return (
    <View style={styles.container}>
      {
        // Sets Google Maps as the map provider and initial region
      }
      {
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_REGION}
        // TODO: figure out why not displaying user location
        //showsUserLocation
        //showsMyLocationButton
        >
          {
          // Run through cctvLocations and render a marker for each camera
          cctvLocations.map((currCam, index) => (
            <Marker
              key={index}
              coordinate={{latitude: currCam[0], longitude: currCam[1]}}
              onPress={() => console.log("Marker pressed")}
            />
          ))}
        </MapView>
      }
    </View>
  );
}