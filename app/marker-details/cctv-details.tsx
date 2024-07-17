import { ActivityIndicator, StyleSheet, Text, View, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Video, ResizeMode } from 'expo-av';
import React from 'react';
import { CCTV } from "../custom-types/url-types";
import MarkerDetailsStyle from "../custom-styles/marker-details-style";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

// NOTE: rough template of cctv details page, will change in future
export default function CctvDetail({ cctv }: CCTV) { 
  const videoSource = cctv.imageData.streamingVideoURL;
  const imgSource = cctv.imageData.static.currentImageURL;
  const county = cctv.location.county;
  const locationName = cctv.location.locationName;
  const nearbyPlace = cctv.location.nearbyPlace;
  const latlng = `${cctv.location.latitude}, ${cctv.location.longitude}`;
  const elevation = cctv.location.elevation;
  const direction = cctv.location.direction;
  const route = cctv.location.route;
  const routeSuffix = cctv.location.routeSuffix;
  const postmilePrefix = cctv.location.postmilePrefix;
  const postmile = cctv.location.postmile;
  const alignment = cctv.location.alignment;
  const milepost = cctv.location.milepost;

  const renderDetailText = (label: string, value: string) => (
    <Text style={MarkerDetailsStyle.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  return (
    <>
      <View style={MarkerDetailsStyle.titleContainer}>
        <Text style={MarkerDetailsStyle.title}>CCTV</Text>

        {!videoSource && (
          <Text style={MarkerDetailsStyle.cctvText}>
            No live video available for this camera.
          </Text>
        )}

      </View>

      <View style={MarkerDetailsStyle.divider}/>

      <BottomSheetScrollView>
        <View style={styles.spacingContainer}>
          <View style={styles.mediaContainer}>
            {videoSource !== "" ? (
              <Video
                ref={null}
                source={{ uri: videoSource }}
                style={styles.media}
                useNativeControls={true}
                shouldPlay={true}
                isLooping={true}
                resizeMode={ResizeMode.STRETCH}
              >
                <ActivityIndicator size="small" />
              </Video>
            ) : (
              <Image
                source={{ uri: imgSource }}
                style={styles.media}
                resizeMode="stretch"
              />
            )}
            <Text style={styles.caption}>
              {videoSource !== "" ? "Live Video" : "Most Recent Image"}
            </Text>
          </View>
        </View>

        <View style={MarkerDetailsStyle.detailsContainer}>
          <Text style={MarkerDetailsStyle.detailsTitle}>Details</Text>
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
  caption: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  noVideoText: {
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 16,
    
  },
});