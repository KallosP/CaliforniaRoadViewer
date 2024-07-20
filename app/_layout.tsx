import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerItem } from '@react-navigation/drawer';

export default function Layout() {
  return (
    <>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                // Ignore cctv_details screen in drawer
                screenOptions={({route}) => ({
                    drawerItemStyle: {
                        display: route.name === 'cctv-details' ? 'none' : 'flex',
                    },
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
                    name="marker-details/cctv-details"
                    options={{
                        // Hide in drawer
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="marker-details/lcs-details"
                    options={{
                        // Hide in drawer
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="custom-styles/marker-details-style"
                    options={{
                        // Hide in drawer
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="custom-styles/global-safe-view"
                    options={{
                        // Hide in drawer
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="marker-details/cc-details"
                    options={{
                        // Hide in drawer
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="test"
                    options={{
                        // Hide in drawer
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    </>
  );
}
