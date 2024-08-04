import { Text, View, } from "react-native";
import { CHPLog } from "../custom-types/url-types";
import React from 'react';
import MarkerDetailsStyle from "../custom-styles/marker-details-style";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

export default function ChpDetail({ log }: CHPLog) {
  const renderDetailText = (label: string, value: string) => (
    <Text style={MarkerDetailsStyle.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  return (
    <>
      <View style={MarkerDetailsStyle.titleContainer}>
        <Text style={MarkerDetailsStyle.title}>CHP Incident</Text>
      </View>

      <View style={MarkerDetailsStyle.divider} />

      <BottomSheetScrollView> 
        <View style={MarkerDetailsStyle.detailsContainer}>
          <Text style={MarkerDetailsStyle.detailsTitle}>Details</Text>
                {renderDetailText("Log ID", log[0].id)}
                {renderDetailText("Log Time", log[0].logTime)}
                {renderDetailText("Log Type", log[0].logType)}
                {renderDetailText("Location", log[0].location)}
                {renderDetailText("Location Desc", log[0].locationDesc)}
                {renderDetailText("Area", log[0].area)}
                {renderDetailText("Thomas Brothers", log[0].thomasBrothers)}
                {renderDetailText("Latitude", log[0].lat)}
                {renderDetailText("Longitude", log[0].long)}
                {log[0].logDetails[0].details.map((detail, index) => (
                  <View key={index}>
                    {renderDetailText("Detail Time", detail.detailTime)}
                    {renderDetailText("Incident Detail", detail.incidentDetail)}
                  </View>
                ))}

                {log[0].logDetails[0].units.map((unit, index) => (
                  <View key={index}>
                    {renderDetailText("Unit Time", unit.unitTime)}
                    {renderDetailText("Unit Detail", unit.unitDetail)}
                  </View>
                ))}
        </View>
      </BottomSheetScrollView>
    </> 
  );
}