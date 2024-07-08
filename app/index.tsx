import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { StyleSheet, View, StatusBar } from 'react-native';

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 2,
  longitudeDelta: 2,
}

// Sets status bar style
function setStatusBar (){
  // TODO: Check if this works on IOS
  StatusBar.setBackgroundColor('black');
  StatusBar.setBarStyle('light-content');
}

// NOTE: don't rely on default component styles, will look different for every platform,
//       ALWAYS make custom styles for otherwise default components (e.g. buttons)
export default function HomeScreen() {

  //const navigation = useRouter();
  // State fore storing all cctvs
  const [cams, setCams] = useState<CCTV[]>([]);
  const [lcs, setLcs] = useState<LCS[]>([]);

  /*
    TODO: 
          - (DONE) MAINTAIN state of map when navigating to cctv page and navigating back, don't re-render the whole home/map page
          - IMPROVE PERFORMANCE OF LOADING PAGES, ADD LOADING ICONS INSTEAD OF JUST WAITING on empty screen
          - Add other caltrans data (lane closures, chain control, etc)
          - For live feeds that are in service but don't play, detect it somehow and show current image instead
            (go to fresno (districty 6), a lot of them are there; look into making the thumbnail of videos 
            default to current image? possible?)
          - Decide on info to put under cam video/image
          - Implement highway search for highway conditions
          - Resize camera feeds/images if too small (maybe make a button that the user presses which tries to resize the cctv)
          - Add custom loading icon for app startup/app logo
          - Clean up UI
          - ...*/
  
  setStatusBar();

  // Storing data from all districts in CA
  useEffect(() => {

    console.log('testing')
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

    // Lane closures TODO
    const lcsUrls = [
      'https://cwwp2.dot.ca.gov/data/d1/lcs/lcsStatusD01.json'
    ]

    // TODO: rest of caltrans data

    // TODO: Make data fetching dynamic for any type of data (not just cctv)
    const fetchAllData = async () => {
      try {
        // Run through each url in current array and fetch data; make a promise it will return
        const responses = await Promise.all(camUrls.map(url => fetch(url)));
        // Parse responses into a json object
        const dataPromises = responses.map(response => response.json());
        // Await all json promises to resolve and store in jsonData object
        const jsonData = await Promise.all(dataPromises);
        // Combine all json data into one array of the url's type (i.e. CCTV, LCS, etc)
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
    // Pass current cctv info to cctv-details page
    router.push({
      pathname: "cctv-details",
      params: {
        videoSource: currCam,
        imgSource: currImg,
        county: cctv.cctv.location.county,
        locationName: cctv.cctv.location.locationName,
        nearbyPlace: cctv.cctv.location.nearbyPlace,
        latlng: cctv.cctv.location.latitude + ", " + cctv.cctv.location.longitude,
        elevation: cctv.cctv.location.elevation,
        direction: cctv.cctv.location.direction,
        route: cctv.cctv.location.route,
        routeSuffix: cctv.cctv.location.routeSuffix,
        postmilePrefix: cctv.cctv.location.postmilePrefix,
        postmile: cctv.cctv.location.postmile,
        alignment: cctv.cctv.location.alignment,
        milepost: cctv.cctv.location.milepost,
      }
    })
  }

  return (
    <View style={styles.container}>
      {/* Sets Google Maps as the map provider and initial region */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        radius={140}
        minPoints={4}
        extent={812}
        moveOnMarkerPress={false}
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
            pinColor="#00fbff"
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