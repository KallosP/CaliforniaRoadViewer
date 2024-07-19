import { router } from "expo-router";
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { StyleSheet, View, Text, Image } from 'react-native';
import  BottomSheetModal, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CCTV, LCS, CC } from "../custom-types/url-types";
import CctvDetail from "../marker-details/cctv-details"
import LcsDetail from "../marker-details/lcs-details"
import CcDetail from "../marker-details/cc-details"

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 2,
  longitudeDelta: 2,
}

interface MemoizedMapViewProps {
  cams: CCTV[]
  lcs: LCS[]
  cc: CC[]
}

type MarkerType = { type: 'cctv'; marker: CCTV; } | { type: 'lcs'; marker: LCS; } 
                | { type: 'cc'; marker: CC; }

// Memoizing map view for performance improvement (otherwise map along with all markers re-renders every time; slows down app)
export const MemoizeMapView: React.FC<MemoizedMapViewProps> = React.memo(({cams, lcs, cc}) => {

  const sheetRef = useRef<BottomSheetModal>(null);
  const [currMarkerType, setCurrMarkerType] = useState<MarkerType>();
  // Percentage of screen bottom sheet takes up/snaps to
  const snapPoints = useMemo(() => ["7%", "40%", "90%"], []);

  const [showLCSEnd, setLCSEnd] = useState(false);
  const [currLCSMarker, setCurrLCSMarker] = useState<LCS>();
  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleMarkerPress = (marker: MarkerType) => {
    if(marker.type === 'lcs') {
      setLCSEnd(true);
      setCurrLCSMarker(marker.marker);
    }
    else{
      setLCSEnd(false);
    }
    setCurrMarkerType(marker);
    setIsOpening(true);
    sheetRef.current?.snapToIndex(1);
  }

  useEffect(() => {
    // Manage bottom sheet opening/closing (in useEffect to prevent asynch side-effect)
    if (isOpening) {
      setBottomSheetIsOpen(true);
      setIsOpening(false);
    }
  }, [isOpening]);

  const handleMapPress = () => {
    if(bottomSheetIsOpen) {
      sheetRef.current?.collapse();
      setBottomSheetIsOpen(false);
    }
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
        showsTraffic={true}
        onTouchStart={() => {handleMapPress()}}
        // TODO: figure out why not displaying user location
        // Need to enable location permissions, otherwise fails silently
        //showsUserLocation
        //showsMyLocationButton
        >
          { // Run through all cameras and render a marker for each one's location
          cams.flatMap((currCam: CCTV, index: number) => (
            <Marker
              key={index}
              coordinate={{latitude: parseFloat(currCam.cctv.location.latitude), longitude: parseFloat(currCam.cctv.location.longitude)}}
              onPress={() => {let camAsMarkerType: MarkerType = {type: 'cctv', marker: currCam}; handleMarkerPress(camAsMarkerType)}}
              pinColor="#00fbff"
            />
          ))}
          { // "" LCS
          lcs.flatMap((currLcs: LCS, index: number) => (
            <Marker
              key={index}
              coordinate={{latitude: parseFloat(currLcs.lcs.location.begin.beginLatitude), longitude: parseFloat(currLcs.lcs.location.begin.beginLongitude)}}
              onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcs', marker: currLcs}; handleMarkerPress(lcsAsMarkerType)}}
              pinColor="#ff0000"
            />
          ))}
          { // "" CC
          cc.flatMap((currCC: CC, index: number) => (
            <Marker
              key={index}
              coordinate={{latitude: parseFloat(currCC.cc.location.latitude), longitude: parseFloat(currCC.cc.location.longitude)}}
              onPress={() => {let ccAsMarkerType: MarkerType = {type: 'cc', marker: currCC}; handleMarkerPress(ccAsMarkerType)}}
              pinColor="#42f59e"
            />
          ))}


          {
          showLCSEnd && (
            <Marker
              // @ts-ignore
              coordinate={{latitude: parseFloat(currLCSMarker?.lcs.location.end.endLatitude), longitude: parseFloat(currLCSMarker?.lcs.location.end.endLongitude)}} pinColor="#eb34d3"
              // Always elevate index in case end location is same as another marker's start location
              zIndex={1}
              title="Lane Closure End"
              description="End Location"
            >
              <Text >Test</Text>
              <Image source={require('../../assets/icon.png')} style={{width: 50, height: 50}}/>
            </Marker> 
          )}

      </MapView> 

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        // Initiate bottom sheet in closed state
        index={-1}
        onClose={() => setBottomSheetIsOpen(false)}
      >
          {currMarkerType?.type === 'cctv' ? <CctvDetail cctv={currMarkerType?.marker.cctv}/>
          : currMarkerType?.type === 'lcs' ? <LcsDetail lcs={currMarkerType?.marker.lcs}/>
          : currMarkerType?.type === 'cc' ? <CcDetail cc={currMarkerType?.marker.cc}/>
          : <Text>No cctv rendered</Text>
          }
          
      </BottomSheetModal>

    </>
  );
});

const styles = StyleSheet.create({
  map: {flex: 1 },
});