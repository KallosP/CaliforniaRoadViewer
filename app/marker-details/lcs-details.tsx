import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LCS } from "../custom-types/url-types";
import React from 'react';
import MarkerDetailsStyle from "../custom-styles/marker-details-style";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

export default function LcsDetail({ lcs }: LCS) {
  const renderDetailText = (label: string, value: string) => (
    <Text style={MarkerDetailsStyle.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  return (
    <>
      <View style={MarkerDetailsStyle.titleContainer}>
        <Text style={MarkerDetailsStyle.title}>LCS</Text>
      </View>

      <View style={MarkerDetailsStyle.divider} />

      <BottomSheetScrollView> 
        <View style={MarkerDetailsStyle.detailsContainer}>
          <Text style={MarkerDetailsStyle.detailsTitle}>Details</Text>
          {renderDetailText("Type Of Closure", lcs.closure.typeOfClosure)}
          {renderDetailText("Travel Flow Direction", lcs.location.travelFlowDirection)}
          {renderDetailText("Begin Location Name", lcs.location.begin.beginLocationName)}
          {renderDetailText("Begin Longitude", lcs.location.begin.beginLongitude)}
          {renderDetailText("Begin Latitude", lcs.location.begin.beginLatitude)}
          {renderDetailText("Begin Direction", lcs.location.begin.beginDirection)}
          {renderDetailText("Begin County", lcs.location.begin.beginCounty)}
          {renderDetailText("Begin Route", lcs.location.begin.beginRoute)}
          {renderDetailText("End Location Name", lcs.location.end.endLocationName)}
          {renderDetailText("End Longitude", lcs.location.end.endLongitude)}
          {renderDetailText("End Latitude", lcs.location.end.endLatitude)}
          {renderDetailText("End Direction", lcs.location.end.endDirection)}
          {renderDetailText("End County", lcs.location.end.endCounty)}
          {renderDetailText("End Route", lcs.location.end.endRoute)}
          {renderDetailText("Facility", lcs.closure.facility)}
          {renderDetailText("Duration Of Closure", lcs.closure.durationOfClosure)}
          {renderDetailText("Estimated Delay", lcs.closure.estimatedDelay)}
          {renderDetailText("Lanes Closed", lcs.closure.lanesClosed)}
          {renderDetailText("Total Existing Lanes", lcs.closure.totalExistingLanes)}
        </View>
      </BottomSheetScrollView>
    </> 
  );
}