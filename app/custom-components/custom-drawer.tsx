import { StyleSheet, View, Text, Image} from 'react-native';
import { useState } from 'react';
import CheckboxComponent from './custom-checkbox';


// TODO: design/implement custom drawer
export default function CustomDrawer() {

  const [isCamChecked, setCamChecked] = useState(false);
  const [isLcsChecked, setLcsChecked] = useState(false);
  const [isFullLcsChecked, setFullLcsChecked] = useState(false);
  const [isTrafficChecked, setTrafficChecked] = useState(false);


  const handleCheckboxPress = (checkType: string) => {
    if(checkType === 'cam') {
      setCamChecked(!isCamChecked);
      return;
    }
    if(checkType === 'lcs') {
      setLcsChecked(!isLcsChecked);
      return;
    }   
    if(checkType === 'fullLcs') {
      setFullLcsChecked(!isFullLcsChecked);
      return;
    }   
    if(checkType === 'traffic') {
      setTrafficChecked(!isTrafficChecked);
      return;
    }   
  };

  return (

    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image style={styles.headerImage} source={require('../../assets/icon.png')} />
      </View>

      {/* Tools/Pages Section */}
      <View style={styles.navAndToolsContainer}>

        <CheckboxComponent 
          isChecked={isCamChecked} 
          onPress={() => handleCheckboxPress('cam')} 
          label="Cameras" />

        <CheckboxComponent 
          isChecked={isLcsChecked} 
          onPress={() => handleCheckboxPress('lcs')} 
          label="Lane Closures" />

        <CheckboxComponent 
          isChecked={isFullLcsChecked} 
          onPress={() => handleCheckboxPress('fullLcs')} 
          label="Full Closures" />

        <CheckboxComponent 
          isChecked={isTrafficChecked} 
          onPress={() => handleCheckboxPress('traffic')} 
          label="Show Traffic" />

      </View>

    </View>
  );
}
CustomDrawer.name = 'CustomDrawer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerImageContainer: {
    height: "25%",
    width: "100%",
    backgroundColor: '#E5E5E5',
    // Aligns children to center (in vertical direction)
    justifyContent: 'center',
    // Aligns children to center (in cross direction)
    alignItems: 'center',
  },
  headerImage: {
    width: 100,
    height: 100,
  },
  navAndToolsContainer: {
    // Children go from left-to-right with 'row'
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 20,
    marginHorizontal: 10,
  },
});