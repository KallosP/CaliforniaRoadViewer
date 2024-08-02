import { router } from "expo-router";
import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { StyleSheet, View, Text, Image, Button, ScrollView, Pressable} from 'react-native';
import  BottomSheetModal, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CCTV, LCS, CC } from "../custom-types/url-types";
import CctvDetail from "../marker-details/cctv-details";
import LcsDetail from "../marker-details/lcs-details";
import CcDetail from "../marker-details/cc-details";
import XIcon from '../../assets/x_icon.svg';
import CctvIcon from '../../assets/cctv_icon.svg';
import FullLcsIcon from '../../assets/full_lcs_icon.svg';
import OtherLcsIcon from '../../assets/other_lcs_icon.svg';
import CCIcon from '../../assets/cc_icon.svg';
import Ripple from 'react-native-material-ripple';
import CctvMarkerIcon from '../../assets/cam_marker.svg';
import FullMarkerIcon from '../../assets/full_marker.svg';
import OtherMarkerIcon from '../../assets/other_marker.svg';
import CCMarkerIcon from '../../assets/cc_marker.svg';

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

type MarkerType = { type: 'cctv'; marker: CCTV; } | { type: 'lcsFull'; marker: LCS; } 
                | { type: 'lcsOther'; marker: LCS; } | { type: 'cc'; marker: CC; }

// Main color for all markers/filters
const MARKER_COLOR = '#50FFB3';

// Memoizing map view for performance improvement (otherwise map along with all markers re-renders every time; slows down app)
export const MemoizeMapView: React.FC<MemoizedMapViewProps> = React.memo(({cams, cc, lcsFull, lcsOther, }) => {

  const sheetRef = useRef<BottomSheetModal>(null);
  const [currMarkerType, setCurrMarkerType] = useState<MarkerType>();
  const [mTypeDisplay, setMTypeDisplay] = useState('All');
  // Percentage of screen bottom sheet takes up/snaps to
  const snapPoints = useMemo(() => ["7%", "40%", "90%"], []);

  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const [camPressed, setCamPressed] = useState(false);
  const [lcsFullPressed, setLcsFullPressed] = useState(false);
  const [lcsOtherPressed, setLcsOtherPressed] = useState(false);
  const [ccPressed, setCCPressed] = useState(false);

  const handleMarkerPress = (marker: MarkerType) => {
    setCurrMarkerType(marker);
    setIsOpening(true);
    sheetRef.current?.snapToIndex(1);
  }

  const handleFilterPress = (markerType: string) => {
    // Check/set pressed state for all filter buttons
    if (markerType === 'cctv') !camPressed ? setCamPressed(true) : setCamPressed(false);
    if (markerType === 'lcsFull') !lcsFullPressed ? setLcsFullPressed(true) : setLcsFullPressed(false);
    if (markerType === 'lcsOther') !lcsOtherPressed ? setLcsOtherPressed(true) : setLcsOtherPressed(false);
    if (markerType === 'cc') !ccPressed ? setCCPressed(true) : setCCPressed(false);
    // Clear all filters
    if (markerType === 'clear'){
      setCamPressed(false);
      setLcsFullPressed(false);
      setLcsOtherPressed(false);
      setCCPressed(false);
    }
    // Closes bottom sheet
    sheetRef.current?.close();
    // Set the current marker type (that was pressed for enabling/disabling filter)
    setMTypeDisplay(markerType);
  }

  useEffect(() => {
    // Manage bottom sheet opening/closing (in useEffect to prevent async side-effect)
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

  // CCTV Markers
  const displayCamMarkers = useMemo(() => {
    return cams.flatMap((currCam: CCTV, index: number) => (
      <Marker
        key={index}
        coordinate={{latitude: parseFloat(currCam.cctv.location.latitude), longitude: parseFloat(currCam.cctv.location.longitude)}}
        onPress={() => {let camAsMarkerType: MarkerType = {type: 'cctv', marker: currCam}; handleMarkerPress(camAsMarkerType)}}
        pinColor={MARKER_COLOR}
        identifier="cctv"
        tracksViewChanges={false}
      >
        <CctvMarkerIcon />
      </Marker>
  ))
  }, [cams]);

  // LCS (Full Closure) Markers
  const displayLcsFullMarkers = useMemo(() => {
    return lcsFull.flatMap((currFullLcsBegin: LCS, index: number) => (
    <Marker
      key={index}
      coordinate={{latitude: parseFloat(currFullLcsBegin.lcs.location.begin.beginLatitude), longitude: parseFloat(currFullLcsBegin.lcs.location.begin.beginLongitude)}}
      onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcsFull', marker: currFullLcsBegin}; handleMarkerPress(lcsAsMarkerType)}}
      pinColor={MARKER_COLOR}
      tracksViewChanges={false}
    >
      <FullMarkerIcon />
    </Marker>
  ))
  }, [lcsFull]);

  // LCS (Other Closure) Markers
  const displayLcsOtherMarkers = useMemo(() => {
    return lcsOther.flatMap((currOtherLcs: LCS, index: number) => (
    <Marker
      key={index}
      coordinate={{latitude: parseFloat(currOtherLcs.lcs.location.begin.beginLatitude), longitude: parseFloat(currOtherLcs.lcs.location.begin.beginLongitude)}}
      onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcsOther', marker: currOtherLcs}; handleMarkerPress(lcsAsMarkerType)}}
      pinColor={MARKER_COLOR}
      tracksViewChanges={false}
    >
      <OtherMarkerIcon />
    </Marker>
  ))
  }, [lcsOther]);

  // CC (Chain Control) Markers
  const displayCCMarkers = useMemo(() => {
    return cc.flatMap((currCC: CC, index: number) => (
    <Marker
      key={index}
      coordinate={{latitude: parseFloat(currCC.cc.location.latitude), longitude: parseFloat(currCC.cc.location.longitude)}}
      onPress={() => {let ccAsMarkerType: MarkerType = {type: 'cc', marker: currCC}; handleMarkerPress(ccAsMarkerType)}}
      pinColor={MARKER_COLOR}
      tracksViewChanges={false}
    >
      <CCMarkerIcon />
    </Marker>
  ))
  }, [cc]);

  // Called/re-rendered whenever a filter is pressed
  // Renders all markers that are being filtered
  const getMarkers = useCallback(() => {
    let markersArr: React.JSX.Element[] = [];
    if (camPressed) markersArr = markersArr.concat(displayCamMarkers);
    if (lcsFullPressed) markersArr = markersArr.concat(displayLcsFullMarkers);
    if (lcsOtherPressed) markersArr = markersArr.concat(displayLcsOtherMarkers);
    if (ccPressed) markersArr = markersArr.concat(displayCCMarkers);

    return markersArr;
  }, [camPressed, lcsFullPressed, lcsOtherPressed, ccPressed]);

  return (
    <>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        radius={100}
        minPoints={4}
        extent={512}
        maxZoom={10}
        moveOnMarkerPress={false}
        showsTraffic={true}
        onTouchStart={() => {handleMapPress()}}
        clusterColor={MARKER_COLOR}
        // TODO: figure out why not displaying user location
        // Need to enable location permissions, otherwise fails silently
        //showsUserLocation
        //showsMyLocationButton
        >

          {getMarkers()}

      </MapView> 

      <ScrollView
        horizontal
        style={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
      >
        <Ripple 
          onPress={() => {handleFilterPress('clear')}} 
          style={[styles.filterButtonBase, styles.filterButtonX]}
          rippleContainerBorderRadius={20}
        >
            <XIcon height={15} width={15} style={styles.filterIcon}/>
            <Text style={styles.filterText}>Clear</Text>
        </Ripple>
        <Ripple 
          onPress={() => {handleFilterPress('cctv')}} 
          style={[styles.filterButtonBase, camPressed ? styles.filterButtonIn : styles.filterButtonOut]}
          rippleContainerBorderRadius={20}
        >
          <CctvIcon height={15} width={15} style={styles.filterIcon}/>
          <Text style={styles.filterText}>Cameras</Text>
        </Ripple>

        <Ripple 
          onPress={() => {handleFilterPress('lcsFull')}} 
          style={[styles.filterButtonBase, lcsFullPressed ? styles.filterButtonIn : styles.filterButtonOut]}
          rippleContainerBorderRadius={20}
        >
          <FullLcsIcon height={15} width={15} style={styles.filterIcon}/>
          <Text style={styles.filterText}>Full Closures</Text>
        </Ripple>
        <Ripple
          onPress={() => {handleFilterPress('lcsOther')}} 
          style={[styles.filterButtonBase, lcsOtherPressed ? styles.filterButtonIn : styles.filterButtonOut]}
          rippleContainerBorderRadius={20}
        >
          <OtherLcsIcon height={15} width={15} style={styles.filterIcon}/>
          <Text style={styles.filterText}>Other Closures</Text>
        </Ripple>
        <Ripple 
          onPress={() => {handleFilterPress('cc')}} 
          style={[styles.filterButtonBase, ccPressed ? styles.filterButtonIn : styles.filterButtonOut]}
          rippleContainerBorderRadius={20}
        >
          <CCIcon height={15} width={15} style={styles.filterIcon}/>
          <Text style={styles.filterText}>Chain Control</Text>
        </Ripple>
      </ScrollView>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        // Initiate bottom sheet in closed state
        index={-1}
        onClose={() => setBottomSheetIsOpen(false)}
      >
          {currMarkerType?.type === 'cctv' ? <CctvDetail cctv={currMarkerType?.marker.cctv}/>
          : currMarkerType?.type === 'lcsFull' ? <LcsDetail lcs={currMarkerType?.marker.lcs}/>
          : currMarkerType?.type === 'lcsOther' ? <LcsDetail lcs={currMarkerType?.marker.lcs}/>
          : currMarkerType?.type === 'cc' ? <CcDetail cc={currMarkerType?.marker.cc}/>
          : <Text>No cctv rendered</Text>
          }
          
      </BottomSheetModal>

    </>
  );
});

const styles = StyleSheet.create({
  map: {flex: 1},
  filterContainer: {
    position: 'absolute',
    marginVertical: 45,
    padding: 10,
    paddingLeft: 0,
    flexDirection: 'row',
  },
  filterButtonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  filterButtonX: {
    backgroundColor: 'white',
  },
  filterButtonIn: {
    backgroundColor: MARKER_COLOR,
  },
  filterButtonOut: {
    backgroundColor: 'white', 
  },
  filterIcon: {
    marginRight: 10,
    width: '20%',
    height: '80%',
  },
  filterText: {
    fontSize: 15,
  }
});