import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Camera, 
  Map, 
  User 
} from 'lucide-react-native';
import { theme } from '@/theme';
import { useUI } from '@/hooks/useUI';

export default function TabLayout() {
  const { setActiveTab } = useUI();

  // Track tab changes in Redux state
  const handleTabPress = (tabName: 'explore' | 'trips' | 'recording' | 'map' | 'profile') => {
    setActiveTab(tabName);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border.light,
          paddingBottom: theme.spacing[2],
          paddingTop: theme.spacing[2],
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSizes.xs,
          fontWeight: theme.typography.fontWeights.medium,
          marginTop: theme.spacing[1],
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('explore'),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('trips'),
        }}
      />
      <Tabs.Screen
        name="recording"
        options={{
          title: 'Recording',
          tabBarIcon: ({ size, color }) => (
            <Camera size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('recording'),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ size, color }) => (
            <Map size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('map'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('profile'),
        }}
      />
    </Tabs>
  );
}