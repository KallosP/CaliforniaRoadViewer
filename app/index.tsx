import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StatusBar, Text, StyleSheet } from 'react-native';
import { MemoizeMapView } from './custom-components/memo-map';
import { CCTV, LCS } from './custom-types/url-types';

// Sets status bar style
function setStatusBar (){
  // TODO: Check if this works on IOS
  StatusBar.setBackgroundColor('black');
  StatusBar.setBarStyle('light-content');
}

async function fetchAllData<T>(urlArr: string[]) {
  try {
    // Run through each url in current array and fetch data; make a promise it will return
    const responses = await Promise.all(urlArr.map(url => fetch(url)));
    // Parse responses into a json object
    const dataPromises = responses.map(response => response.json());
    // Await all json promises to resolve and store in jsonData object
    const jsonData = await Promise.all(dataPromises);
    // Combine all json data into one array of the url's type (i.e. CCTV, LCS, etc)
    const allUrlData = jsonData.flatMap(json => json.data.map((item: T) => item));
    return allUrlData;
    //console.log(allCams.length);
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
  // State fore storing all cctvs
  const [cams, setCams] = useState<CCTV[]>([]);
  const [lcs, setLcs] = useState<LCS[]>([]);
  /*
    TODO: 
          - (DONE) MAINTAIN state of map when navigating to cctv page and navigating back, don't re-render the whole home/map page
          - (DONE) IMPROVE PERFORMANCE OF LOADING PAGES
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

      // TODO: rest of caltrans data

      const allCams = await fetchAllData<CCTV>(camUrls);
      setCams(allCams);

      const allLcs = await fetchAllData<LCS>(lcsUrls);
      setLcs(allLcs);

    }

    fetchData();

  }, []) // Only fetch data once on app load


  return (
    <>
      <MemoizeMapView 
          cams={cams}
          lcs={lcs}
      />
    </>
  );
}