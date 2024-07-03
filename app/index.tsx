import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { StyleSheet, View } from 'react-native';

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 2,
  longitudeDelta: 2,
}

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
export default function HomeScreen() {

  const navigation = useRouter();
  // State fore storing all cctvs
  const [cams, setCams] = useState<CCTV[]>([]);

  /*
    TODO: 
          - IMPROVE PERFORMANCE OF LOADING PAGES, ADD LOADING ICONS INSTEAD OF JUST WAITING on empty screen
          - For live feeds that are in service but don't play, detect it somehow and show current image instead
            (go to fresno (districty 6), a lot of them are there; look into making the thumbnail of videos 
            default to current image? possible?)
          - Decide on info to put under cam video/image
          - Implement highway search for highway conditions
          - Add custom loading icon for app startup/app logo
          - Clean up UI
          - ...
  */

  // Storing camera data from all districts in CA
  useEffect(() => {

    const camUrls = [
      'https://cwwp2.dot.ca.gov/data/d1/cctv/cctvStatusD01.json',
      'https://cwwp2.dot.ca.gov/data/d2/cctv/cctvStatusD02.json',
      'https://cwwp2.dot.ca.gov/data/d3/cctv/cctvStatusD03.json',
      'https://cwwp2.dot.ca.gov/data/d4/cctv/cctvStatusD04.json',
      'https://cwwp2.dot.ca.gov/data/d5/cctv/cctvStatusD05.json',
      'https://cwwp2.dot.ca.gov/data/d6/cctv/cctvStatusD06.json',
      'https://cwwp2.dot.ca.gov/data/d7/cctv/cctvStatusD07.json',
      'https://cwwp2.dot.ca.gov/data/d8/cctv/cctvStatusD08.json',
      'https://cwwp2.dot.ca.gov/data/d9/cctv/cctvStatusD09.json',
      'https://cwwp2.dot.ca.gov/data/d10/cctv/cctvStatusD10.json',
      'https://cwwp2.dot.ca.gov/data/d11/cctv/cctvStatusD11.json',
      'https://cwwp2.dot.ca.gov/data/d12/cctv/cctvStatusD12.json',
    ];

    const fetchAllData = async () => {
      try {
        const responses = await Promise.all(camUrls.map(url => fetch(url)));
        const dataPromises = responses.map(response => response.json());
        const jsonData = await Promise.all(dataPromises);
        const allCams = jsonData.flatMap(json => json.data.map((cam: CCTV) => cam));
        setCams(allCams);
        //console.log(allCams.length);
      } catch (error) {
        alert("Something went wrong fetching camera data...");
        console.error(error);
      }
    };

    fetchAllData();
  }, []) // Only fetch data once on app load

  // Custom handler for pressing a marker
  const handleMarkerPress = (cctv: CCTV) => {
    // Set video source to current cctv
    var currCam = cctv.cctv.imageData.streamingVideoURL
    // Set img source to current cctv
    var currImg = cctv.cctv.imageData.static.currentImageURL
    // Pass current cctv info to cctv_details page
    router.push({
      pathname: "cctv_details",
      params: {
        videoSource: currCam,
        imgSource: currImg
      }
    })
  }

  return (
    <View style={styles.container}>
      { /* Sets Google Maps as the map provider and initial region */ }
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        radius={140}
        minPoints={4}
        extent={812}
      // TODO: figure out why not displaying user location
      //showsUserLocation
      //showsMyLocationButton
      >
        {
        // Run through all cameras and render a marker for each one's location
        cams.flatMap((currCam, index) => (
          <Marker
            key={index}
            coordinate={{latitude: parseFloat(currCam.cctv.location.latitude), longitude: parseFloat(currCam.cctv.location.longitude)}}
            onPress={() => handleMarkerPress(currCam)}
            tracksViewChanges={false}
          />
        ))}
      </MapView>
    </View>
  );
}

// Manages the style of the various components in app
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  modal: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});