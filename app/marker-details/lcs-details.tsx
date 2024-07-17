import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LCS } from "../custom-types/url-types";
import React from 'react';

// NOTE: rough template of cctv details page, will change in future

export default function LcsDetail({ lcs }: LCS) {
  const renderDetailText = (label: string, value: string) => (
    <Text style={styles.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  const typeOfClosure = lcs.closure.typeOfClosure

  return (
    <>
      <View style={styles.lcsTitleContainer}>
        <Text style={styles.lcsTitle}>LCS</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Details</Text>
        {renderDetailText("Type Of Closure", typeOfClosure)}
      </View>
    </> 
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  lcsTitleContainer: {
    marginBottom: 10,
    marginLeft: 16,
    flexWrap: 'wrap',
  },
  lcsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  lcsText: {
    marginTop: 5,
  },
  divider: {
    marginBottom: 16,
    borderRadius: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});