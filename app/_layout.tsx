import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    // Setup for drawer
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
            // Ignore cctv_details screen in drawer
            screenOptions={({route}) => ({
                drawerItemStyle: {
                    display: route.name === 'cctv-details' ? 'none' : 'flex',
                }
            })}
        >
            <Drawer.Screen
                // This is the name of the page and must match the url from root
                name="index" 
                options={{
                    drawerLabel: 'Home',
                    title: '',
                }}
            />
            <Drawer.Screen
                name="cctv-details"
                options={{
                    drawerLabel: 'User',
                    title: '',
                }}
            />
        </Drawer>
    </GestureHandlerRootView>
  );
}
