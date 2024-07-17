import { router } from "expo-router";
import React, { useRef, useState, useMemo } from 'react';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { StyleSheet, View, Text } from 'react-native';
import  BottomSheetModal, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CCTV, LCS } from "../custom-types/url-types";
import CctvDetail from "../marker-details/cctv-details"
import LcsDetail from "../marker-details/lcs-details"

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

type MarkerType = { type: 'cctv'; marker: CCTV; } | { type: 'lcs'; marker: LCS; } 

// Memoizing map view for performance improvement (otherwise map along with all markers re-renders every time; slows down app)
export const MemoizeMapView: React.FC<MemoizedMapViewProps> = React.memo(({cams, lcs}) => {

  const sheetRef = useRef<BottomSheetModal>(null);
  const [currMarkerType, setCurrMarkerType] = useState<MarkerType>();
  // Percentage of screen bottom sheet takes up/snaps to
  const snapPoints = useMemo(() => ["40%", "90%"], []);

  const handleMarkerPress = (marker: MarkerType) => {
    sheetRef.current?.snapToIndex(0);
    setCurrMarkerType(marker);
  }

  return (
    <>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        radius={140}
        minPoints={4}
        extent={512}
        maxZoom={10}
        moveOnMarkerPress={false}
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
              onPress={() => {let camAsMarkerType: MarkerType = {type: 'cctv', marker: currCam}; handleMarkerPress(camAsMarkerType)}}
              pinColor="#00fbff"
            />
          ))}
          {
          // "" LCS
          lcs.flatMap((currLcs: LCS, index: number) => (
            <Marker
              key={index}
              coordinate={{latitude: parseFloat(currLcs.lcs.location.begin.beginLatitude), longitude: parseFloat(currLcs.lcs.location.begin.beginLongitude)}}
              onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcs', marker: currLcs}; handleMarkerPress(lcsAsMarkerType)}}
              pinColor="#ff0000"
            />
          ))}
      </MapView> 

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        // Initiate bottom sheet in closed state
        index={-1}
      >
          {currMarkerType?.type === 'cctv' ? <CctvDetail cctv={currMarkerType?.marker.cctv}/>
          : currMarkerType?.type === 'lcs' ? <LcsDetail lcs={currMarkerType?.marker.lcs}/>
          : <Text>No cctv rendered</Text>
          }
          
      </BottomSheetModal>

    </>
  );
});

const styles = StyleSheet.create({
  map: {flex: 1 },
});