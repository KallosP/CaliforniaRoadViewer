import React, { useEffect, useState } from 'react';
import { StatusBar, Text, StyleSheet } from 'react-native';
import { MemoizeMapView } from './custom-components/memo-map';
import { CCTV, LCS, CC } from './custom-types/url-types';

// Sets status bar style
function setStatusBar (){
  // TODO: Check if this works on IOS
  StatusBar.setBackgroundColor('black');
  StatusBar.setBarStyle('light-content');
}

var numMarkers = 0;
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
      json.data.filter((item: CCTV | LCS | CC ) => 
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

  //const navigation = useRouter();
  // CCTVs
  const [cams, setCams] = useState<CCTV[]>([]);
  // Lane closures
  const [lcs, setLcs] = useState<LCS[]>([]);
  const [lcsFull, setLcsFull] = useState<LCS[]>([]);
  const [lcsOther, setLcsOther] = useState<LCS[]>([]);
  // Chain control
  const [cc, setCC] = useState<CC[]>([]);
  /*
    TODO: 
          - (DONE) MAINTAIN state of map when navigating to cctv page and navigating back, don't re-render the whole home/map page
          - (DONE) IMPROVE PERFORMANCE OF LOADING PAGES
          - (DONE - no need, removed unnecessary marker types) FIGURE OUT HOW TO HANDLE Tens of thousands of markers, clustering glitches out after adding third type (CCs). come up
            with strategy for best possible fix/way to handle this
          - Add loading icon on app startup for data fetching as fetch goes through cams, then lcs, etc. Loading message
            and confirmation message for when all data/markers have been loaded
          - Add other caltrans data (lane closures, chain control, etc)
          - For live feeds that are in service but don't play, detect it somehow and show current image instead
            (go to fresno (districty 6), a lot of them are there; look into making the thumbnail of videos 
            default to current image? possible?)
          - Decide on info to put under cam video/image
          - Implement highway search for highway conditions
          - Resize camera feeds/images if too small (maybe make a button that the user presses which tries to resize the cctv)
          - Add custom loading icon for app startup/app logo
          - Clean up UI
          - Generate new Google Maps API key before publishing to app store 
          - ...*/
  
  setStatusBar();

  // Storing data from all districts in CA
  useEffect(() => {

    async function fetchData () {
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

      // TODO: rest of caltrans data

      const allCams = await fetchAllData('CCTV', camUrls);
      setCams(allCams);
      numMarkers += allCams.length

      const allLcs = await fetchAllData('LCS', lcsUrls);
      setLcs(allLcs);
      numMarkers += allLcs.length

      const lcsFull = allLcs.filter(lcs => lcs.lcs.closure.typeOfClosure === "Full");
      setLcsFull(lcsFull)
      const lcsOther = allLcs.filter(lcs => !(lcs.lcs.closure.typeOfClosure === "Full"));
      setLcsOther(lcsOther)
/*      lcsOther.forEach(lcs => {
        if(lcs.lcs.closure.typeOfClosure === "Full"){
          console.log('fail')
        } 
        else{
          console.log('pass')
        }
      })*/

      const allCCs = await fetchAllData('CC', ccUrls);
      setCC(allCCs);
      numMarkers += allCCs.length

      console.log(numMarkers)

    }

    fetchData();

  }, []) // Only fetch data once on app load


  return (
    <>
      <MemoizeMapView 
          cams={cams}
          lcsFull={lcsFull}
          lcsOther={lcsOther}
          cc={cc}
      />
    </>
  );
}