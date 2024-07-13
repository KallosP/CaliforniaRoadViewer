import GlobalSafeView from '../custom-styles/global-safe-view';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native";
import { router, Slot } from "expo-router";



interface DetailPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

// TODO: figure out how to pass props (title)
export default function DetailPageLayout({ title }: DetailPageLayoutProps) {
    function handleOnPress() {
        requestAnimationFrame(() => {
            router.push('/')
        });
    }
    return (
        <SafeAreaView style={GlobalSafeView.GlobalSafeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => handleOnPress()}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>

                {/* Render the child components */}
                <Slot />

            </ScrollView>
        </SafeAreaView>
    )
};


const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 