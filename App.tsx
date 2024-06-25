import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, Button} from 'react-native';
import { readCSV } from './src/readCSV.ts';

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 2,
  longitudeDelta: 2,
}

// Manages the style of the various components in app
const styles = StyleSheet.create({
  container: { flex: 1},
  map: { width: '100%', height: '100%' },
});

// NOTE: don't rely on default component styles, will look different for every platform,
//       ALWAYS make custom styles for otherwise default components (e.g. buttons)
export default function App() {

  /* TODO: 
    - figure out best way to store all district data in 2D array
    - Maybe don't store data at all and always just fetch from url when neede? how would that affect performance?
  
  */
  // Read data from CSV files. All district data objects are 2D arrays
  // Data from district 1
  useEffect(() => {
    // Capture data from async fcn
    var d1Data = readCSV('https://cwwp2.dot.ca.gov/data/d1/cctv/cctvStatusD01.json')
    // Act on the promise from the async fcn (in this case, d1Data)/use the resulting data
    d1Data.then((data) => {
      console.log(data)
    })
    // If the promise is rejected/fails, log an error
    .catch((error) => {
      alert("Could not load CCTV data.")
      console.log(error)
    });
  }, [])

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
        </MapView> 
      }
    </View>
  );
}