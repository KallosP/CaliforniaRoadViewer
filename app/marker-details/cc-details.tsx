import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { CC } from "../custom-types/url-types";
import React from 'react';
import MarkerDetailsStyle from "../custom-styles/marker-details-style";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

export default function CcDetail({ cc }: CC) {
  const renderDetailText = (label: string, value: string) => (
    <Text style={MarkerDetailsStyle.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  return (
    <>
      <View style={MarkerDetailsStyle.titleContainer}>
        <Text style={MarkerDetailsStyle.title}>Chain Control</Text>
      </View>

      <View style={MarkerDetailsStyle.divider} />

      <BottomSheetScrollView> 
        <View style={MarkerDetailsStyle.detailsContainer}>
          <Text style={MarkerDetailsStyle.detailsTitle}>Details</Text>
            {renderDetailText("District", cc.location.district)}
            {renderDetailText("Location Name", cc.location.locationName)}
            {renderDetailText("Nearby Place", cc.location.nearbyPlace)}
            {renderDetailText("Longitude", cc.location.longitude)}
            {renderDetailText("Latitude", cc.location.latitude)}
            {renderDetailText("Elevation", cc.location.elevation)}
            {renderDetailText("Direction", cc.location.direction)}
            {renderDetailText("County", cc.location.county)}
            {renderDetailText("Route", cc.location.route)}
            {renderDetailText("Route Suffix", cc.location.routeSuffix)}
            {renderDetailText("Postmile Prefix", cc.location.postmilePrefix)}
            {renderDetailText("Postmile", cc.location.postmile)}
            {renderDetailText("Alignment", cc.location.alignment)}
            {renderDetailText("Milepost", cc.location.milepost)}
            {renderDetailText("In Service", cc.inService)}
            {renderDetailText("Status", cc.statusData.status)}
            {renderDetailText("Status Description", cc.statusData.statusDescription)}
            {renderDetailText("Record Date", cc.recordTimestamp.recordDate)}
            {renderDetailText("Record Time", cc.recordTimestamp.recordTime)}
            {renderDetailText("Status Date", cc.statusData.statusTimestamp.statusDate)}
            {renderDetailText("Status Time", cc.statusData.statusTimestamp.statusTime)}
        </View>
      </BottomSheetScrollView>
    </> 
  );
}