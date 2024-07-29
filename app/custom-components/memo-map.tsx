import { router } from "expo-router";
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { StyleSheet, View, Text, Image, Button, ScrollView } from 'react-native';
import  BottomSheetModal, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CCTV, LCS, CC } from "../custom-types/url-types";
import CctvDetail from "../marker-details/cctv-details";
import LcsDetail from "../marker-details/lcs-details";
import CcDetail from "../marker-details/cc-details";
import { TouchableOpacity } from "react-native-gesture-handler";
import XIcon from '../../assets/x_icon.svg';
import CctvIcon from '../../assets/cctv_icon.svg';
import FullLcsIcon from '../../assets/full_lcs_icon.svg';
import OtherLcsIcon from '../../assets/other_lcs_icon.svg';
import CCIcon from '../../assets/cc_icon.svg';

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
  isCamChecked: boolean
}

type MarkerType = { type: 'cctv'; marker: CCTV; } | { type: 'lcsFull'; marker: LCS; } 
                | { type: 'lcsOther'; marker: LCS; } | { type: 'cc'; marker: CC; }

// Memoizing map view for performance improvement (otherwise map along with all markers re-renders every time; slows down app)
export const MemoizeMapView: React.FC<MemoizedMapViewProps> = React.memo(({cams, cc, lcsFull, lcsOther, }) => {

  const sheetRef = useRef<BottomSheetModal>(null);
  const [currMarkerType, setCurrMarkerType] = useState<MarkerType>();
  const [mTypeDisplay, setMTypeDisplay] = useState('All');
  // Percentage of screen bottom sheet takes up/snaps to
  const snapPoints = useMemo(() => ["7%", "40%", "90%"], []);

  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [shouldDisplayCam, setShouldDisplayCam] = useState(false);
  const [shouldDisplayLcsFull, setShouldDisplayLcsFull] = useState(false);

  //const [showCamMarkers, setShowCamMarkers] = useState(true);
  const handleMarkerPress = (marker: MarkerType) => {
    setCurrMarkerType(marker);
    setIsOpening(true);
    sheetRef.current?.snapToIndex(1);
  }
  
  const handleFilterPress = (markerType: string) => {
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

  const displayCamMarkers = cams.flatMap((currCam: CCTV, index: number) => (
      <Marker
        key={index}
        coordinate={{latitude: parseFloat(currCam.cctv.location.latitude), longitude: parseFloat(currCam.cctv.location.longitude)}}
        onPress={() => {let camAsMarkerType: MarkerType = {type: 'cctv', marker: currCam}; handleMarkerPress(camAsMarkerType)}}
        pinColor="#00fbff"
        identifier="cctv"
      />
  ))

  const displayLcsFullMarkers =lcsFull.flatMap((currFullLcsBegin: LCS, index: number) => (
    <Marker
      key={index}
      coordinate={{latitude: parseFloat(currFullLcsBegin.lcs.location.begin.beginLatitude), longitude: parseFloat(currFullLcsBegin.lcs.location.begin.beginLongitude)}}
      onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcsFull', marker: currFullLcsBegin}; handleMarkerPress(lcsAsMarkerType)}}
      pinColor="#ff0000"
    />
  ))

  const displayLcsOtherMarkers = lcsOther.flatMap((currOtherLcs: LCS, index: number) => (
    <Marker
      key={index}
      coordinate={{latitude: parseFloat(currOtherLcs.lcs.location.begin.beginLatitude), longitude: parseFloat(currOtherLcs.lcs.location.begin.beginLongitude)}}
      onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcsOther', marker: currOtherLcs}; handleMarkerPress(lcsAsMarkerType)}}
      pinColor="#ff9d00"
    />
  ))

  const displayCCMarkers = cc.flatMap((currCC: CC, index: number) => (
    <Marker
      key={index}
      coordinate={{latitude: parseFloat(currCC.cc.location.latitude), longitude: parseFloat(currCC.cc.location.longitude)}}
      onPress={() => {let ccAsMarkerType: MarkerType = {type: 'cc', marker: currCC}; handleMarkerPress(ccAsMarkerType)}}
      pinColor="#42f59e"
    />
  ))

  const getMarkers = () => {
    switch (mTypeDisplay) {
      case 'cctv': return displayCamMarkers;
      case 'lcsFull': return displayLcsFullMarkers;
      case 'lcsOther': return displayLcsOtherMarkers;
      case 'cc': return displayCCMarkers;
      case 'clear': return [];
      default: return [];
/*      case 'lcsOther': return displayLcsOtherMarkers;
      case 'cc': return displayCCMarkers;*/
    }
  }

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
        // TODO: figure out why not displaying user location
        // Need to enable location permissions, otherwise fails silently
        //showsUserLocation
        //showsMyLocationButton
        >

          {getMarkers()}
          {
          /*lcsOther.flatMap((currOtherLcs: LCS, index: number) => (
          <Marker
            key={index}
            coordinate={{latitude: parseFloat(currOtherLcs.lcs.location.begin.beginLatitude), longitude: parseFloat(currOtherLcs.lcs.location.begin.beginLongitude)}}
            onPress={() => {let lcsAsMarkerType: MarkerType = {type: 'lcsOther', marker: currOtherLcs}; handleMarkerPress(lcsAsMarkerType)}}
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
          ))*/}

      </MapView> 

      <ScrollView
        horizontal
        style={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
      >
        <TouchableOpacity onPress={() => {handleFilterPress('clear')}} style={[styles.filterButtonBase, styles.filterButtonX]}>
            <XIcon height={15} width={15} style={styles.filterIcon}/>
            <Text style={styles.filterText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {handleFilterPress('cctv')}} style={[styles.filterButtonBase, styles.filterButtonCam]}>
          <CctvIcon height={15} width={15} style={styles.filterIcon}/>
          <Text style={styles.filterText}>Cameras</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {handleFilterPress('lcsFull')}} style={[styles.filterButtonBase, styles.filterButtonFull]}>
          <FullLcsIcon height={15} width={15} style={styles.filterIcon}/>
          <Text style={styles.filterText}>Full Closures</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {handleFilterPress('lcsOther')}} style={[styles.filterButtonBase, styles.filterButtonOther]}>
          <OtherLcsIcon height={15} width={15} style={styles.filterIcon}/>
          <Text style={styles.filterText}>Other Closures</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {handleFilterPress('cc')}} style={[styles.filterButtonBase, styles.filterButtonCC]}>
          <CCIcon height={15} width={15} style={styles.filterIcon}/>
          <Text style={styles.filterText}>Chain Control</Text>
        </TouchableOpacity>
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
    marginVertical: 10,
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
  filterButtonCam: {
    backgroundColor: '#83f8fc',
  },
  filterButtonFull: {
    backgroundColor: '#fc8583',
  },
  filterButtonOther: {
    backgroundColor: '#fcc883',
  },
  filterButtonCC: {
    backgroundColor: '#83fcb5',
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