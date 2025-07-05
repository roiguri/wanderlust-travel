import { Tabs } from 'expo-router';
import { 
  Search, 
  MapPin, 
  Camera, 
  Map, 
  User 
} from 'lucide-react-native';
import { theme } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.semanticColors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.semanticColors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.semanticColors.border.light,
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
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} />
          ),
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
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ size, color }) => (
            <Map size={size} color={color} />
          ),
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
      />
    </Tabs>
  );
}