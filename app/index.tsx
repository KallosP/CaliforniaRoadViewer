import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { MemoizeMapView } from './custom-components/memo-map';
import { CCTV, LCS, CC, CHP } from './custom-types/url-types';
import { ThemeProvider, useTheme } from './custom-components/theme-context';

async function fetchAllData(urlType: string, urlArr: string[]) {
  try {
    // Run through each url in current array and fetch data; make a promise it will return
    const responses = await Promise.all(urlArr.map(url => fetch(url)));
    // Parse responses into a json object
    const dataPromises = responses.map(response => response.json());
    // Await all json promises to resolve and store in jsonData object
    const jsonData = await Promise.all(dataPromises);
    // Combine all json data into one array of the url's type (i.e. CCTV, LCS, etc)
    const allUrlData = jsonData.flatMap(json =>
      json.data
      .filter((item: CCTV | LCS | CC) =>
        // Filter out all chain control markers that are not in effect (R-0 = not in effect)
        !(urlType === "CC" && (item as CC).cc.statusData.status === "R-0") &&
        // Filter out all non-active closures
        !(urlType === "LCS" && (item as LCS).lcs.closure.code1097.isCode1097 === "false"))
    );
    return allUrlData;
  } catch (error) {
    alert("Something went wrong fetching data..." + error);
    //console.error(error);
    return [];
  }
}

// NOTE: don't rely on default component styles, will look different for every platform,
//       ALWAYS make custom styles for otherwise default components (e.g. buttons)
export default function HomeScreen() {

  // CCTVs
  const [cams, setCams] = useState<CCTV[]>([]);
  // Lane closures
  const [lcs, setLcs] = useState<LCS[]>([]);
  const [lcsFull, setLcsFull] = useState<LCS[]>([]);
  const [lcsOther, setLcsOther] = useState<LCS[]>([]);
  // Chain control
  const [cc, setCC] = useState<CC[]>([]);
  const [chpIncs, setCHPIncs] = useState<CHP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /*
    TODO: 

          - Dark theme 
          - Apple Dev Creation

          - Organize details page data to be more readable for all types of data
          - Figure out how to access highway condition search data and integrate
          - (DONE) MAINTAIN state of map when navigating to cctv page and navigating back, don't re-render the whole home/map page
          - (DONE) IMPROVE PERFORMANCE OF LOADING PAGES
          - (DONE - no need, removed unnecessary marker types) FIGURE OUT HOW TO HANDLE Tens of thousands of markers, clustering glitches out after adding third type (CCs). come up
            with strategy for best possible fix/way to handle this
          - Add loading icon on app startup for data fetching as fetch goes through cams, then lcs, etc. Loading message
            and confirmation message for when all data/markers have been loaded
          - Add other caltrans data (lane closures, chain control, etc)
          - (DONE) For live feeds that are in service but don't play, detect it somehow and show current image instead
            (go to fresno (districty 6), a lot of them are there; look into making the thumbnail of videos 
            default to current image? possible?)
          - Decide on info to put under cam video/image
          - Implement highway search for highway conditions
          - Resize camera feeds/images if too small (maybe make a button that the user presses which tries to resize the cctv)
          - Add custom loading icon for app startup/app logo
          - Clean up UI
          - Generate new Google Maps API key before publishing to app store 
          - ...*/

  // Storing data from all districts in CA
  useEffect(() => {

    // TODO: figure out if you want user to wait until all data is loaded, if yes change this to synchronous
    async function fetchData() {
      // CHP Data ------
      // CHP incidents URL
      const chpIncUrl = 'https://media.chp.ca.gov/sa_xml/sa.xml';
      // Setup the XML string parser (for converting to JSON)
      const parseString = require('react-native-xml2js').parseString;

      // Fetch XML url
      fetch(chpIncUrl)
        // Once fetched, use response as text
        .then(response => response.text())
        // Take the text (string) and convert to JSON
        .then((response) => {
            parseString(response, function (err: Error, result: JSON) {
                if (err) {
                  alert('XML to JSON error: ' + err);
                  return;
                }
                const chpData = transformToCHPArray(result);
                setCHPIncs(chpData);
                //console.log(JSON.stringify(chpData, null, 2));
            });
        // Catch any errors that occur
        }).catch((err) => {
            console.log('fetch', err)
        })

      // CalTrans Data ------
      // Cams
      const camUrls = [
        'https://cwwp2.dot.ca.gov/data/d1/cctv/cctvStatusD01.json',
        'https://cwwp2.dot.ca.gov/data/d2/cctv/cctvStatusD02.json',
        'https://cwwp2.dot.ca.gov/data/d3/cctv/cctvStatusD03.json',
        'https://cwwp2.dot.ca.gov/data/d4/cctv/cctvStatusD04.json',
        'https://cwwp2.dot.ca.gov/data/d5/cctv/cctvStatusD05.json',
        'https://cwwp2.dot.ca.gov/data/d6/cctv/cctvStatusD06.json',
        'https://cwwp2.dot.ca.gov/data/d7/cctv/cctvStatusD07.json',
        'https://cwwp2.dot.ca.gov/data/d8/cctv/cctvStatusD08.json',
        'https://cwwp2.dot.ca.gov/data/d9/cctv/cctvStatusD09.json',
        'https://cwwp2.dot.ca.gov/data/d10/cctv/cctvStatusD10.json',
        'https://cwwp2.dot.ca.gov/data/d11/cctv/cctvStatusD11.json',
        'https://cwwp2.dot.ca.gov/data/d12/cctv/cctvStatusD12.json',
      ];

      // Lane closures 
      const lcsUrls = [
        'https://cwwp2.dot.ca.gov/data/d1/lcs/lcsStatusD01.json',
        'https://cwwp2.dot.ca.gov/data/d2/lcs/lcsStatusD02.json',
        'https://cwwp2.dot.ca.gov/data/d3/lcs/lcsStatusD03.json',
        'https://cwwp2.dot.ca.gov/data/d4/lcs/lcsStatusD04.json',
        'https://cwwp2.dot.ca.gov/data/d5/lcs/lcsStatusD05.json',
        'https://cwwp2.dot.ca.gov/data/d6/lcs/lcsStatusD06.json',
        'https://cwwp2.dot.ca.gov/data/d7/lcs/lcsStatusD07.json',
        'https://cwwp2.dot.ca.gov/data/d8/lcs/lcsStatusD08.json',
        'https://cwwp2.dot.ca.gov/data/d9/lcs/lcsStatusD09.json',
        'https://cwwp2.dot.ca.gov/data/d10/lcs/lcsStatusD10.json',
        'https://cwwp2.dot.ca.gov/data/d11/lcs/lcsStatusD11.json',
        'https://cwwp2.dot.ca.gov/data/d12/lcs/lcsStatusD12.json',
      ]

      // Chain control
      const ccUrls = [
        'https://cwwp2.dot.ca.gov/data/d1/cc/ccStatusD01.json',
        'https://cwwp2.dot.ca.gov/data/d2/cc/ccStatusD02.json',
        'https://cwwp2.dot.ca.gov/data/d3/cc/ccStatusD03.json',
        'https://cwwp2.dot.ca.gov/data/d6/cc/ccStatusD06.json',
        'https://cwwp2.dot.ca.gov/data/d7/cc/ccStatusD07.json',
        'https://cwwp2.dot.ca.gov/data/d8/cc/ccStatusD08.json',
        'https://cwwp2.dot.ca.gov/data/d9/cc/ccStatusD09.json',
        'https://cwwp2.dot.ca.gov/data/d10/cc/ccStatusD10.json',
        'https://cwwp2.dot.ca.gov/data/d11/cc/ccStatusD11.json',
      ]

      const allCams = await fetchAllData('CCTV', camUrls);
      setCams(allCams);

      const allLcs = await fetchAllData('LCS', lcsUrls);
      setLcs(allLcs);

      const lcsFull = allLcs.filter(lcs => lcs.lcs.closure.typeOfClosure === "Full");
      setLcsFull(lcsFull)
      const lcsOther = allLcs.filter(lcs => !(lcs.lcs.closure.typeOfClosure === "Full"));
      setLcsOther(lcsOther)

      const allCCs = await fetchAllData('CC', ccUrls);
      setCC(allCCs);

      setIsLoading(false)

    }

    fetchData();

  }, []) // Only fetch data once on app load


const transformToCHPArray = (data: any): CHP[] => {
    const logs: CHP[] = [];
    // Extract logs from the parsed JSON object,
    // [0] at end of props to account for converting
    // single elements into arrays during XML to JSON conversion
    const centers = data.State.Center;
    for (const center of centers) {
        const dispatches = center.Dispatch || [];
        for (const dispatch of dispatches) {
            const logsArray = dispatch.Log || [];
            for (const log of logsArray) {
                // Split up latlon
                const latLonString = log.LATLON?.[0] || '';
                // Remove quotes and whitespace from latlon before processing
                const cleanedLatLonString = latLonString.replace(/["']/g, '').trim();
                const [latStr, lonStr] = cleanedLatLonString.split(':');
                const lat = (parseFloat(latStr) / 1000000).toString();
                const long = (-parseFloat(lonStr) / 1000000).toString();

                const logDetails = log.LogDetails?.[0] || {};

                // Process LogDetails
                const details = logDetails.details.map((detail: any) => ({
                  detailTime: detail.DetailTime || '',
                  incidentDetail: detail.IncidentDetail || ''
                })) || [];

                var units = [];
                // Process units if present
                if(logDetails.units !== undefined) {
                  units = logDetails.units.map((unit: any) => ({
                    unitTime: unit.UnitTime || '',
                    unitDetail: unit.UnitDetail || ''
                  })) || [];
                }

                logs.push({
                        center: [{
                            id: center.$?.ID || '',
                            dispatch: [{
                                id: dispatch.$?.ID || '',
                                log: [{
                                    id: log.$?.ID || '',
                                    logTime: log.LogTime?.[0] || '',
                                    logType: log.LogType?.[0] || '',
                                    location: log.Location?.[0] || '',
                                    locationDesc: log.LocationDesc?.[0] || '',
                                    area: log.Area?.[0] || '',
                                    thomasBrothers: log.ThomasBrothers?.[0] || '',
                                    lat: lat,
                                    long: long,
                                    logDetails: [{
                                        details: details, 
                                        units: units,
                                    }]
                                }]
                            }]
                        }]
                    }
                );
            }
        }
    }

    return logs;
  };


  return (
    <ThemeProvider>

      <MemoizeMapView
        cams={cams}
        lcsFull={lcsFull}
        lcsOther={lcsOther}
        cc={cc}
        chpIncs={chpIncs}
      />

      {isLoading && (
        <ActivityIndicator color="#50FFB3" size={100} style={styles.activityIndicator} />
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});