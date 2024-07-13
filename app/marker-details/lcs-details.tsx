import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from 'react';

// NOTE: rough template of cctv details page, will change in future

export default function Home() {
  const { 
    typeOfClosure = "", 
  } = 
    useLocalSearchParams<{ 
        typeOfClosure: string
    }>();

  const renderDetailText = (label: string, value: string) => (
    <Text style={styles.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  return (
    <>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>CCTV Details</Text>
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
});