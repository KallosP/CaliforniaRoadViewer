/*import { ActivityIndicator, StyleSheet, Text, View, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef, RefObject} from 'react';
import { CCTV } from "../custom-types/url-types";
import MarkerDetailsStyleBase from "../custom-styles/marker-details-style-base";
import MarkerDetailsStyleDark from "../custom-styles/marker-details-style-dark";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from "react-native-gesture-handler";

// TODO: Add dark mode support (also for rest of detail screens)

let keyCtr = 0;
// NOTE: rough template of cctv details page, will change in future
export default function CctvDetail() { 
  // Variable for managing the display of live video or a recent image (used when video source exists)
  const [showVideo, setShowVideo] = React.useState(true);
  // Variable for allowing video (is based on whether or not a video source exists)
  const [allowVideo, setAllowVideo] = React.useState(true);
  // Manages disabling button; is disabled when no video source available
  const [disableButton, setDisableButton] = React.useState(false);
  // Dynamic caption text top
  const [captionTextTop, setCaptionTextTop] = React.useState('Most Recent Image');
  // Dynamic caption text bottom 
  const [captionTextBottom, setCaptionTextBottom] = React.useState('Live Video');
  const { isDarkMode, toggleTheme } = useTheme();
  const themeStyles = isDarkMode ? MarkerDetailsStyleDark : MarkerDetailsStyleBase;


  const videoSource = ""
  const county = ""
  const locationName = ""
  const nearbyPlace = ""
  const latlng = ""
  const elevation = ""
  const direction = ''
  const route = ''
  const routeSuffix = ''
  const postmilePrefix = ''
  const postmile = ''
  const alignment = ''
  const milepost = ''

  const renderDetailText = (label: string, value: string) => (
    <Text style={themeStyles.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  useEffect(() => {
    // Manage whether or not video is allowed to be displayed
    if (videoSource === "") {
      setAllowVideo(false);
      setDisableButton(true);
      setCaptionTextTop("Live Video");
      setCaptionTextBottom("Most Recent Image");
    } 
    else{
      setAllowVideo(true);
      setDisableButton(false);
    }
  }, [videoSource])

  function handleCaptionButtonPress() {
    if (captionTextTop === "Live Video") {
      setShowVideo(true);
      setCaptionTextTop("Most Recent Image");
      setCaptionTextBottom("Live Video");
    }
    else{
      setShowVideo(false);
      setCaptionTextTop("Live Video");
      setCaptionTextBottom("Most Recent Image");
    }
  }

  return (
    <>
      <View style={themeStyles.titleContainer}>
        <Text style={themeStyles.title}>CCTV</Text>

        {!allowVideo && (
          <Text style={themeStyles.cctvText}>
            No live video available for this camera.
          </Text>
        )}

      </View>

      <View style={themeStyles.divider}/>

      <BottomSheetScrollView>
        <View style={styles.spacingContainer}>
          <View style={styles.mediaContainer}>
            <View style={styles.captionContainer}>
              <TouchableOpacity disabled={disableButton} style={[styles.buttonCaptionDisabled, disableButton ? styles.buttonCaptionDisabled : styles.buttonCaption]} onPress={() => disableButton ? alert("Video not available") : handleCaptionButtonPress()}>
                <Text style={styles.buttonCaptionText}>
                  {captionTextTop}
                </Text>
              </TouchableOpacity>
              <Text style={styles.caption}>
                  {captionTextBottom}
              </Text>

            </View>
          </View>
        </View>

        <View style={themeStyles.detailsContainer}>
          <Text style={themeStyles.detailsTitle}>Details</Text>
          {renderDetailText("Location", locationName)}
          {renderDetailText("County", county)}
          {renderDetailText("Nearby Place", nearbyPlace)}
          {renderDetailText("Latitude/Longitude", latlng)}
          {renderDetailText("Elevation", elevation)}
          {renderDetailText("Direction", direction)}
          {renderDetailText("Route", route)}
          {renderDetailText("Route Suffix", routeSuffix)}
          {renderDetailText("Postmile Prefix", postmilePrefix)}
          {renderDetailText("Postmile", postmile)}
          {renderDetailText("Alignment", alignment)}
          {renderDetailText("Milepost", milepost)}
        </View>
      </BottomSheetScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  spacingContainer: {
    marginTop: 16,
  },
  mediaContainer: {
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 25,
    right: 10,
  },
  buttonCaption: {
    backgroundColor: 'rgba(80, 255, 179, 1)',
  },
  buttonCaptionDisabled: {
    backgroundColor: 'rgba(80, 255, 179, 0.5)',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  buttonCaptionText: {
    color: 'white',
    fontSize: 12,
  },
  caption: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  noVideoText: {
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 16,
    
  },
});*/