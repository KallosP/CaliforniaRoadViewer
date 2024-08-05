import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from './custom-components/custom-drawer';
import React, { useState } from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="marker-details/cctv-details"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="marker-details/lcs-details"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="custom-styles/marker-details-style"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="custom-styles/global-safe-view"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="marker-details/cc-details"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
            {/*<Drawer
                drawerContent={() => { 
                    return <CustomDrawer /> 
                }}
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
            </Drawer>*/}
        </GestureHandlerRootView>
    );
}
