# **Trip Planning App \- Architecture Guide**

## **Project Structure**

src/

├── components/           \# Reusable UI components

│   ├── ui/              \# Basic UI components (Button, Card, Input, etc.)

│   ├── forms/           \# Form-specific components

│   ├── maps/            \# Map-related components

│   ├── media/           \# Photo/media components

│   └── common/          \# Common components (LoadingSpinner, ErrorBoundary)

├── screens/             \# Screen components

│   ├── auth/            \# Authentication screens

│   ├── explore/         \# Explore tab screens

│   ├── trips/           \# Trips tab screens

│   ├── map/             \# Map tab screens

│   ├── record/          \# Recording tab screens

│   └── profile/         \# Profile tab screens

├── navigation/          \# Navigation configuration

├── store/               \# State management (Redux Toolkit)

│   ├── slices/          \# Redux slices

│   ├── api/             \# RTK Query API slices

│   └── index.ts         \# Store configuration

├── services/            \# External services

│   ├── supabase/        \# Supabase client and functions

│   ├── location/        \# Location services

│   ├── maps/            \# Maps API services

│   └── storage/         \# Local storage services

├── utils/               \# Utility functions

├── hooks/               \# Custom hooks

├── types/               \# TypeScript type definitions

├── constants/           \# App constants

├── assets/              \# Images, fonts, etc.

└── theme/               \# Theme configuration

## **Core Technology Stack**

### **Framework & Runtime**

* **React Native**: 0.72+ with Expo SDK 49+  
* **TypeScript**: For type safety and better developer experience  
* **Expo**: For development tooling and deployment

### **Navigation**

* **Expo Router**: File-based routing system  
* **React Navigation**: For complex navigation patterns

### **State Management**

* **Redux Toolkit**: For global state management  
* **RTK Query**: For server state and caching  
* **React Query**: Alternative for server state (if preferred)

### **UI & Styling**

* **NativeBase**: Primary UI component library  
* **Expo Vector Icons**: For consistent iconography  
* **React Native Reanimated**: For smooth animations  
* **React Native Gesture Handler**: For touch interactions

### **Backend & Data**

* **Supabase**: Backend-as-a-Service (auth, database, storage)  
* **AsyncStorage**: Local storage for app preferences  
* **MMKV**: Fast local storage for critical data  
* **SQLite**: Offline data storage

### **Maps & Location**

* **React Native Maps**: Map component  
* **Expo Location**: Location services  
* **Google Maps Platform**: Places API, Geocoding

### **Media & Files**

* **Expo ImagePicker**: Camera and gallery access  
* **Expo FileSystem**: File operations  
* **React Native Image**: Optimized image handling

## **Data Architecture**

## **Progressive Architecture Approach**

### **Starting Simple (Current Implementation)**

Begin with simpler patterns and evolve as the app grows:

// Phase 1: Context API (Current)

interface AuthContextType {

  user: User | null;

  isAuthenticated: boolean;

  loading: boolean;

  login: (data: LoginData) \=\> Promise\<void\>;

  logout: () \=\> Promise\<void\>;

}

// Phase 2: Multiple Contexts (Growth)

interface AppContexts {

  auth: AuthContextType;

  trips: TripsContextType;

  ui: UIContextType;

}

// Phase 3: Redux (Scale)

interface RootState {

  auth: AuthState;

  trips: TripsState;

  attractions: AttractionsState;

  ui: UIState;

  location: LocationState;

  media: MediaState;

}

### **State Management Evolution**

#### **Option A: Context API (Current \- Recommended for MVP)**

// Good for: Small to medium apps, simple state, team learning

const AuthProvider \= ({ children }) \=\> {

  const \[user, setUser\] \= useState(null);

  const \[loading, setLoading\] \= useState(false);


  // Auth logic here


  return (

    \<AuthContext.Provider value={{ user, loading, login, logout }}\>

      {children}

    \</AuthContext.Provider\>

  );

};

#### **Option B: Redux Toolkit (Scale \- Future Enhancement)**

// Auth State interface AuthState { user: User | null; isAuthenticated: boolean; loading: boolean; error: string | null; }

// Trips State interface TripsState { trips: Trip\[\]; currentTrip: Trip | null; loading: boolean; error: string | null; filters: TripFilters; }

// UI State interface UIState { theme: 'light' | 'dark'; activeTab: TabName; modals: ModalState; notifications: Notification\[\]; }

\#\#\# Database Schema (Supabase)

\`\`\`sql

\-- Users table

CREATE TABLE users (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  email TEXT UNIQUE NOT NULL,

  username TEXT,

  full\_name TEXT,

  avatar\_url TEXT,

  preferences JSONB DEFAULT '{}',

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Trips table

CREATE TABLE trips (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  user\_id UUID REFERENCES users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,

  description TEXT,

  destination TEXT NOT NULL,

  coordinates POINT,

  start\_date DATE NOT NULL,

  end\_date DATE NOT NULL,

  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),

  budget DECIMAL(10,2),

  is\_public BOOLEAN DEFAULT FALSE,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Attractions table

CREATE TABLE attractions (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  google\_place\_id TEXT UNIQUE,

  name TEXT NOT NULL,

  description TEXT,

  category TEXT NOT NULL,

  coordinates POINT NOT NULL,

  address TEXT,

  phone TEXT,

  website TEXT,

  rating DECIMAL(2,1),

  price\_level INTEGER CHECK (price\_level BETWEEN 0 AND 4),

  opening\_hours JSONB,

  photos TEXT\[\],

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Trip attractions (itinerary items)

CREATE TABLE trip\_attractions (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  trip\_id UUID REFERENCES trips(id) ON DELETE CASCADE,

  attraction\_id UUID REFERENCES attractions(id) ON DELETE CASCADE,

  day\_number INTEGER NOT NULL,

  planned\_time TIME,

  actual\_time TIME,

  duration\_minutes INTEGER,

  order\_index INTEGER NOT NULL,

  user\_rating INTEGER CHECK (user\_rating BETWEEN 1 AND 5),

  user\_notes TEXT,

  photos TEXT\[\],

  expenses DECIMAL(10,2),

  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'visited', 'skipped')),

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Saved attractions

CREATE TABLE saved\_attractions (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  user\_id UUID REFERENCES users(id) ON DELETE CASCADE,

  attraction\_id UUID REFERENCES attractions(id) ON DELETE CASCADE,

  collection\_name TEXT DEFAULT 'Wishlist',

  tags TEXT\[\],

  notes TEXT,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user\_id, attraction\_id)

);

\-- Trip photos

CREATE TABLE trip\_photos (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  trip\_id UUID REFERENCES trips(id) ON DELETE CASCADE,

  trip\_attraction\_id UUID REFERENCES trip\_attractions(id) ON DELETE SET NULL,

  url TEXT NOT NULL,

  thumbnail\_url TEXT,

  coordinates POINT,

  caption TEXT,

  taken\_at TIMESTAMP WITH TIME ZONE,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

## **Component Architecture**

### **UI Component Hierarchy**

App

├── AuthProvider

├── ThemeProvider

├── NavigationContainer

│   ├── AuthStack (when not authenticated)

│   │   ├── SignInScreen

│   │   └── SignUpScreen

│   └── MainTabs (when authenticated)

│       ├── ExploreStack

│       ├── MapStack

│       ├── TripsStack

│       ├── RecordStack

│       └── ProfileStack

└── GlobalModals

    ├── TripCreateModal

    ├── AttractionDetailModal

    └── PhotoViewModal

### **Reusable Components**

// Basic UI Components

export const Button: React.FC\<ButtonProps\>;

export const Card: React.FC\<CardProps\>;

export const Input: React.FC\<InputProps\>;

export const LoadingSpinner: React.FC\<LoadingSpinnerProps\>;

export const ErrorBoundary: React.FC\<ErrorBoundaryProps\>;

// Complex Components

export const AttractionCard: React.FC\<AttractionCardProps\>;

export const TripCard: React.FC\<TripCardProps\>;

export const MapView: React.FC\<MapViewProps\>;

export const PhotoGallery: React.FC\<PhotoGalleryProps\>;

export const ItineraryTimeline: React.FC\<ItineraryTimelineProps\>;

## **API Architecture**

### **RTK Query API Structure**

// Base API

export const baseApi \= createApi({

  reducerPath: 'api',

  baseQuery: fetchBaseQuery({

    baseUrl: 'https://your-supabase-url.com/rest/v1/',

    prepareHeaders: (headers, { getState }) \=\> {

      const token \= (getState() as RootState).auth.token;

      if (token) {

        headers.set('authorization', \`Bearer ${token}\`);

      }

      return headers;

    },

  }),

  tagTypes: \['Trip', 'Attraction', 'User'\],

  endpoints: () \=\> ({}),

});

// Trips API

export const tripsApi \= baseApi.injectEndpoints({

  endpoints: (builder) \=\> ({

    getTrips: builder.query\<Trip\[\], void\>({

      query: () \=\> 'trips',

      providesTags: \['Trip'\],

    }),

    createTrip: builder.mutation\<Trip, Partial\<Trip\>\>({

      query: (trip) \=\> ({

        url: 'trips',

        method: 'POST',

        body: trip,

      }),

      invalidatesTags: \['Trip'\],

    }),

    // ... more endpoints

  }),

});

## **Offline Strategy**

### **Data Synchronization**

// Offline-first approach

interface OfflineAction {

  id: string;

  type: string;

  payload: any;

  timestamp: number;

  synced: boolean;

}

// Queue offline actions

const offlineQueue: OfflineAction\[\] \= \[\];

// Sync when online

const syncOfflineActions \= async () \=\> {

  const unsynced \= offlineQueue.filter(action \=\> \!action.synced);


  for (const action of unsynced) {

    try {

      await processOfflineAction(action);

      action.synced \= true;

    } catch (error) {

      console.error('Sync failed:', error);

    }

  }

};

### **Local Storage Strategy**

// Critical data stored locally

const localStorageKeys \= {

  USER\_PREFERENCES: 'user\_preferences',

  CACHED\_TRIPS: 'cached\_trips',

  OFFLINE\_PHOTOS: 'offline\_photos',

  LOCATION\_HISTORY: 'location\_history',

};

// Storage service

class StorageService {

  async saveTrip(trip: Trip): Promise\<void\> {

    // Save to local storage

    // Queue for sync when online

  }


  async getCachedTrips(): Promise\<Trip\[\]\> {

    // Return cached trips

  }

}

## **Performance Optimization**

### **Image Optimization**

// Image handling strategy

const ImageManager \= {

  // Compress images before upload

  compressImage: async (uri: string): Promise\<string\> \=\> {

    // Use Expo ImageManipulator

  },


  // Cache images locally

  cacheImage: async (url: string): Promise\<string\> \=\> {

    // Use FileSystem for caching

  },


  // Generate thumbnails

  generateThumbnail: async (uri: string): Promise\<string\> \=\> {

    // Create thumbnail version

  },

};

### **Memory Management**

// Proper cleanup and memory management

const useMemoryOptimization \= () \=\> {

  useEffect(() \=\> {

    return () \=\> {

      // Cleanup subscriptions

      // Clear image cache if needed

      // Cancel pending requests

    };

  }, \[\]);

};

## **Security & Privacy**

### **Data Protection**

// Secure storage for sensitive data

import \* as SecureStore from 'expo-secure-store';

const SecurityManager \= {

  storeToken: async (token: string) \=\> {

    await SecureStore.setItemAsync('auth\_token', token);

  },


  getToken: async (): Promise\<string | null\> \=\> {

    return await SecureStore.getItemAsync('auth\_token');

  },


  clearToken: async () \=\> {

    await SecureStore.deleteItemAsync('auth\_token');

  },

};

### **Privacy Controls**

// Privacy settings

interface PrivacySettings {

  shareLocation: boolean;

  publicProfile: boolean;

  shareTrips: boolean;

  allowFollowers: boolean;

}

// Data anonymization

const anonymizeLocationData \= (location: LocationData): LocationData \=\> {

  // Reduce precision for privacy

  return {

    ...location,

    latitude: Math.round(location.latitude \* 1000\) / 1000,

    longitude: Math.round(location.longitude \* 1000\) / 1000,

  };

};

## **Testing Strategy**

### **Test Structure**

\_\_tests\_\_/

├── components/          \# Component tests

├── screens/            \# Screen tests

├── services/           \# Service tests

├── utils/              \# Utility tests

├── integration/        \# Integration tests

└── e2e/               \# End-to-end tests

### **Testing Utilities**

// Test utilities

export const renderWithProviders \= (

  component: React.ReactElement,

  options?: RenderOptions

) \=\> {

  const AllTheProviders \= ({ children }: { children: React.ReactNode }) \=\> (

    \<Provider store={store}\>

      \<ThemeProvider theme={theme}\>

        {children}

      \</ThemeProvider\>

    \</Provider\>

  );


  return render(component, { wrapper: AllTheProviders, ...options });

};

## **Deployment Architecture**

### **Build Configuration**

// app.config.js

export default {

  expo: {

    name: "Trip Planner",

    slug: "trip-planner",

    version: "1.0.0",

    orientation: "portrait",

    icon: "./assets/icon.png",

    userInterfaceStyle: "automatic",

    splash: {

      image: "./assets/splash.png",

      resizeMode: "contain",

      backgroundColor: "\#ffffff"

    },

    assetBundlePatterns: \[

      "\*\*/\*"

    \],

    ios: {

      supportsTablet: true,

      bundleIdentifier: "com.yourcompany.tripplanner"

    },

    android: {

      adaptiveIcon: {

        foregroundImage: "./assets/adaptive-icon.png",

        backgroundColor: "\#FFFFFF"

      },

      package: "com.yourcompany.tripplanner"

    },

    web: {

      favicon: "./assets/favicon.png"

    },

    plugins: \[

      "expo-location",

      "expo-image-picker",

      "expo-notifications",

      \[

        "expo-build-properties",

        {

          ios: {

            newArchEnabled: true

          },

          android: {

            newArchEnabled: true

          }

        }

      \]

    \]

  }

};

This architecture provides a solid foundation for building a scalable, maintainable trip planning app with proper separation of concerns, type safety, and performance optimization.

