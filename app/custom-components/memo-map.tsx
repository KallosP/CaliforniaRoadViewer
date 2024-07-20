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
  lcsFull: LCS[]
  lcsOther: LCS[]
  cc: CC[]
}

type MarkerType = { type: 'cctv'; marker: CCTV; } | { type: 'lcs'; marker: LCS; } 
                | { type: 'cc'; marker: CC; }

// Memoizing map view for performance improvement (otherwise map along with all markers re-renders every time; slows down app)
export const MemoizeMapView: React.FC<MemoizedMapViewProps> = React.memo(({cams, cc, lcsFull, lcsOther}) => {

  const sheetRef = useRef<BottomSheetModal>(null);
  const [currMarkerType, setCurrMarkerType] = useState<MarkerType>();
  // Percentage of screen bottom sheet takes up/snaps to
  const snapPoints = useMemo(() => ["7%", "40%", "90%"], []);

  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleMarkerPress = (marker: MarkerType) => {
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
          { // "" Full LCS closures
          lcsFull.flatMap((currFullLcsBegin: LCS, index: number) => (
              <Marker
                key={index}
                coordinate={{latitude: parseFloat(currFullLcsBegin.lcs.location.begin.beginLatitude), longitude: parseFloat(currFullLcsBegin.lcs.location.begin.beginLongitude)}}
                onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcs', marker: currFullLcsBegin}; handleMarkerPress(lcsAsMarkerType)}}
                pinColor="#ff0000"
              />
          ))}
          { // "" Full LCS closures
          lcsFull.flatMap((currFullLcsEnd: LCS, index: number) => (
              <Marker
                key={index}
                coordinate={{latitude: parseFloat(currFullLcsEnd.lcs.location.end.endLatitude), longitude: parseFloat(currFullLcsEnd.lcs.location.end.endLongitude)}}
                onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcs', marker: currFullLcsEnd}; handleMarkerPress(lcsAsMarkerType)}}
                pinColor="#ff0000"
              />
          ))}
          {
          lcsOther.flatMap((currOtherLcs: LCS, index: number) => (
          <Marker
            key={index}
            coordinate={{latitude: parseFloat(currOtherLcs.lcs.location.begin.beginLatitude), longitude: parseFloat(currOtherLcs.lcs.location.begin.beginLongitude)}}
            onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcs', marker: currOtherLcs}; handleMarkerPress(lcsAsMarkerType)}}
            pinColor="#ff9d00"
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