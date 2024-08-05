import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Marker, MarkerAnimated, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { Alert, Linking, Animated, StyleSheet, View, Text, Image, Button, ScrollView, Pressable} from 'react-native';
import  BottomSheetModal, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CCTV, LCS, CC, CHP } from "../custom-types/url-types";
import CctvDetail from "../marker-details/cctv-details";
import LcsDetail from "../marker-details/lcs-details";
import CcDetail from "../marker-details/cc-details";
import ChpDetail from "../marker-details/chp-details";
import XIcon from '../../assets/x_icon.svg';
import CctvIcon from '../../assets/cctv_icon.svg';
import FullLcsIcon from '../../assets/full_lcs_icon.svg';
import OtherLcsIcon from '../../assets/other_lcs_icon.svg';
import TrafficIcon from '../../assets/traffic_icon.svg';
import SunIcon from '../../assets/sun_icon.svg'
import CenterUserIcon from '../../assets/center_user_icon.svg'
import CCIcon from '../../assets/cc_icon.svg';
import ChpIcon from '../../assets/chp_icon.svg';
import Ripple from 'react-native-material-ripple';
import CctvMarkerIcon from '../../assets/cam_marker.svg';
import FullMarkerIcon from '../../assets/full_marker.svg';
import OtherMarkerIcon from '../../assets/other_marker.svg';
import CCMarkerIcon from '../../assets/cc_marker.svg';
import ChpMarkerIcon from '../../assets/chp_marker.svg';
import * as Location from 'expo-location';
import LocationPermissionsModal from '../custom-components/permissions-modal';

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
  chpIncs: CHP[]
}

type MarkerType = { type: 'cctv'; marker: CCTV; } | { type: 'lcsFull'; marker: LCS; } 
                | { type: 'lcsOther'; marker: LCS; } | { type: 'cc'; marker: CC; }
                | { type: 'chpInc'; marker: CHP; }

// Main color for all markers/filters
const MARKER_COLOR = '#50FFB3';

// Incremented then assigned to component keys for always unique keys
var keyCtr = 0;
// Memoizing map view for performance improvement (otherwise map along with all markers re-renders every time; slows down app)
export const MemoizeMapView: React.FC<MemoizedMapViewProps> = React.memo(({cams, cc, lcsFull, lcsOther, chpIncs}) => {

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
  const [chpIncPressed, setChpIncPressed] = useState(false);

  const [showTraffic, setTraffic] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const mapRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);

//  const markerScales = React.useRef<{ [key: number]: Animated.Value }>({});
//
//  // Initialize marker scales in useEffect
//  useEffect(() => {
//    const newScales = { ...markerScales.current };
//    for (const marker of cams) {
//      if (!newScales[marker.id]) {
//        newScales[marker.id] = new Animated.Value(1);
//      }
//    }
//    markerScales.current = newScales;
//  }, [cams]);
//
//  const animateMarker = (m: MarkerType) => {
//    const scale = markerScales.current[m.marker.id];
//    Animated.timing(scale, {
//     toValue: 6.25,
//     duration: 100,
//     useNativeDriver: false,
//    }).start(() => {
//     Animated.timing(scale, {
//       toValue: 1,
//       duration: 100,
//       useNativeDriver: false,
//    }).start();
//   });
//  };

  const handleMarkerPress = (marker: MarkerType) => {
    //animateMarker(marker);
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
    if (markerType === 'chpInc') !chpIncPressed ? setChpIncPressed(true) : setChpIncPressed(false);
    // Clear all filters
    if (markerType === 'clear'){
      setCamPressed(false);
      setLcsFullPressed(false);
      setLcsOtherPressed(false);
      setCCPressed(false);
      setChpIncPressed(false);
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
        key={++keyCtr}
        coordinate={{latitude: parseFloat(currCam.cctv.location.latitude), longitude: parseFloat(currCam.cctv.location.longitude)}}
        onPress={() => {let camAsMarkerType: MarkerType = {type: 'cctv', marker: currCam}; handleMarkerPress(camAsMarkerType)}}
        pinColor={MARKER_COLOR}
        identifier="cctv"
        tracksViewChanges={false}
      >
       {/* <Animated.View 
          style={{
            transform: [{scale: markerScales.current[currCam.id]}]
          }}
        >*/}
          <CctvMarkerIcon />
        {/*</Marker></Animated.View>*/}
      </Marker>
  ))
  }, [cams]);

  // LCS (Full Closure) Markers
  const displayLcsFullMarkers = useMemo(() => {
    return lcsFull.flatMap((currFullLcsBegin: LCS, index: number) => (
    <Marker
      key={++keyCtr}
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
      key={++keyCtr}
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
      key={++keyCtr}
      coordinate={{latitude: parseFloat(currCC.cc.location.latitude), longitude: parseFloat(currCC.cc.location.longitude)}}
      onPress={() => {let ccAsMarkerType: MarkerType = {type: 'cc', marker: currCC}; handleMarkerPress(ccAsMarkerType)}}
      pinColor={MARKER_COLOR}
      tracksViewChanges={false}
    >
      <CCMarkerIcon />
    </Marker>
  ))
  }, [cc]);

  // CHP (CHP Incident) Markers
  const displayChpIncMarkers = useMemo(() => {
    return chpIncs.flatMap((currChpInc: CHP, index: number) => (
    <Marker
      key={++keyCtr}
      coordinate={{latitude: parseFloat(currChpInc.center[0].dispatch[0].log[0].lat), longitude: parseFloat(currChpInc.center[0].dispatch[0].log[0].long)}}
      onPress={() => {let chpIncAsMarkerType: MarkerType = {type: 'chpInc', marker: currChpInc}; handleMarkerPress(chpIncAsMarkerType)}}
      pinColor={MARKER_COLOR}
      tracksViewChanges={false}
    >
      <ChpMarkerIcon />
    </Marker>
  ))
  }, [chpIncs]);

  // Called/re-rendered whenever a filter is pressed
  // Renders all markers that are being filtered
  const getMarkers = useCallback(() => {
    let markersArr: React.JSX.Element[] = [];
    if (camPressed) markersArr = markersArr.concat(displayCamMarkers);
    if (lcsFullPressed) markersArr = markersArr.concat(displayLcsFullMarkers);
    if (lcsOtherPressed) markersArr = markersArr.concat(displayLcsOtherMarkers);
    if (ccPressed) markersArr = markersArr.concat(displayCCMarkers);
    if (chpIncPressed) markersArr = markersArr.concat(displayChpIncMarkers);

    return markersArr;
  }, [camPressed, lcsFullPressed, lcsOtherPressed, ccPressed, chpIncPressed]);

  const handleCenterUserPress = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setModalVisible(true);
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});

    const {latitude, longitude} = currentLocation.coords;

    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }

    if(mapRef.current)
      //@ts-ignore
      mapRef.current.animateToRegion(region, 1000);
    else 
      alert('Something went wrong...')
  }

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        radius={100}
        minPoints={4}
        extent={512}
        maxZoom={10}
        moveOnMarkerPress={false}
        showsTraffic={showTraffic}
        onTouchStart={() => {handleMapPress()}}
        clusterColor={MARKER_COLOR}
        // TODO: figure out why not displaying user location
        // Need to enable location permissions, otherwise fails silently
        showsUserLocation={true}
        showsMyLocationButton={false}
        >

          {getMarkers()}

      </MapView> 

      <LocationPermissionsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

      <View style={styles.buttonContainer}>
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
          <Ripple 
            onPress={() => {handleFilterPress('chpInc')}} 
            style={[styles.filterButtonBase, chpIncPressed ? styles.filterButtonIn : styles.filterButtonOut]}
            rippleContainerBorderRadius={20}
          >
            <ChpIcon height={15} width={15} style={styles.filterIcon}/>
            <Text style={styles.filterText}>CHP Incidents</Text>
          </Ripple>
        </ScrollView>

        <View style={styles.miscButtonContainer}>
          {/* Top row misc buttons*/}
          <View style={styles.miscButtonsRow}>
            {/* Toggle traffic button*/}
            <Ripple 
              onPress={() => {setTraffic(!showTraffic)}} 
              style={[styles.miscButton, styles.filterButtonBase, showTraffic ? styles.filterButtonIn : styles.filterButtonOut]}
              rippleContainerBorderRadius={20}
            >
              <TrafficIcon />
            </Ripple>
            {/* Center user button*/}
            <Ripple 
              onPress={() => {handleCenterUserPress()}} 
              style={[styles.miscButton, styles.filterButtonBase, styles.filterButtonOut]}
              rippleContainerBorderRadius={20}
            >
              <CenterUserIcon />
            </Ripple>
          </View>

          {/* Second row misc buttons*/}
          <View style={styles.miscButtonsRow}>
            {/* Toggle dark mode button*/}
            <Ripple 
              onPress={() => {setDarkMode(!isDarkMode)}} 
              style={[styles.miscButton, styles.filterButtonBase, isDarkMode ? styles.filterButtonIn : styles.filterButtonOut]}
              rippleContainerBorderRadius={20}
            >
              <SunIcon />
            </Ripple>
          </View>

        </View>
      </View> 

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        // Initiate bottom sheet in closed state
        index={-1}
        onClose={() => setBottomSheetIsOpen(false)}
      >
          {currMarkerType?.type === 'cctv' ? <CctvDetail id={currMarkerType?.marker.id} cctv={currMarkerType?.marker.cctv}/>
          : currMarkerType?.type === 'lcsFull' ? <LcsDetail id={currMarkerType?.marker.id} lcs={currMarkerType?.marker.lcs}/>
          : currMarkerType?.type === 'lcsOther' ? <LcsDetail id={currMarkerType?.marker.id} lcs={currMarkerType?.marker.lcs}/>
          : currMarkerType?.type === 'cc' ? <CcDetail id={currMarkerType?.marker.id} cc={currMarkerType?.marker.cc}/>
          : currMarkerType?.type === 'chpInc' ? <ChpDetail log={currMarkerType?.marker.center[0].dispatch[0].log}/>
          : <Text>No Data Available</Text>
          }
          
      </BottomSheetModal>

    </>
  );
});

const styles = StyleSheet.create({
  map: {flex: 1},
  buttonContainer: {
    position: 'absolute',
    marginVertical: 45,
    paddingTop: 10,
    paddingLeft: 0,
  },
  miscButtonContainer: {
    marginTop: 20,
  },
  miscButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miscButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterContainer: {
/*    position: 'absolute',
    marginVertical: 45,
    padding: 10,
    paddingLeft: 0,*/
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