import { router } from "expo-router";
import React from 'react';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { StyleSheet } from 'react-native';

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 2,
  longitudeDelta: 2,
}

interface MemoizedMapViewProps {
  cams: CCTV[]
  lcs: LCS[]
}

// Custom handler for pressing a marker
const handleCamMarkerPress = (cctv: CCTV) => {
  // Set video source to current cctv
  var currCam = cctv.cctv.imageData.streamingVideoURL
  // Set img source to current cctv
  var currImg = cctv.cctv.imageData.static.currentImageURL
  // Pass current cctv info to cctv-details page
  router.push({
    pathname: "marker-details/cctv-details",
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

// TODO: add more info
const handleLcsMarkerPress = (lcs: LCS) => {
  router.push({
    pathname: "marker-details/lcs-details",
    params: {
      typeOfClosure: lcs.lcs.closure.typeOfClosure
    }
  })
}

// Memoizing map view for performance improvement (otherwise map along with all markers re-renders every time; slows down app)
export const MemoizeMapView: React.FC<MemoizedMapViewProps> = React.memo(({cams, lcs}) => (
 <MapView
    style={styles.map}
    provider={PROVIDER_GOOGLE}
    initialRegion={INITIAL_REGION}
    radius={140}
    minPoints={4}
    extent={512}
    moveOnMarkerPress={false}
    maxZoom={10}
    // TODO: figure out why not displaying user location
    // Need to enable location permissions, otherwise fails silently
    //showsUserLocation
    //showsMyLocationButton
    >
      {
      // Run through all cameras and render a marker for each one's location
      cams.flatMap((currCam: CCTV, index: number) => (
        <Marker
          key={index}
          coordinate={{latitude: parseFloat(currCam.cctv.location.latitude), longitude: parseFloat(currCam.cctv.location.longitude)}}
          onPress={() => handleCamMarkerPress(currCam)}
          //tracksViewChanges={false}
          pinColor="#00fbff"
        />
      ))}
      {
      // "" LCS
      lcs.flatMap((currLcs: LCS, index: number) => (
        <Marker
          key={index}
          coordinate={{latitude: parseFloat(currLcs.lcs.location.begin.beginLatitude), longitude: parseFloat(currLcs.lcs.location.begin.beginLongitude)}}
          onPress={() => handleLcsMarkerPress(currLcs)}
          //tracksViewChanges={false}
          pinColor="#ff0000"
        />
      ))}
    </MapView> 
));

const styles = StyleSheet.create({
  map: { width: '100%', height: '100%' },
});