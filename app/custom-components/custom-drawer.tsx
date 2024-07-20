import { StyleSheet, View, Text, Image } from 'react-native';
import { useState } from 'react';
import Checkbox from 'expo-checkbox';


// TODO: design/implement custom drawer
export default function CustomDrawer() {

    const [isChecked, setChecked] = useState(false);

    return (

        <View style={styles.container}>
            <Image style={{width: 100, height: 100}} source={require('../../assets/icon.png')}/>

            <View style={styles.section}>
                <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
                <Text style={styles.paragraph}>Normal checkbox</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});