# Redux Store Architecture

This directory contains the Redux Toolkit store configuration for the travel app.

## Structure

```
store/
├── index.ts              # Main store configuration
├── hooks.ts              # Typed Redux hooks
├── slices/               # Redux slices for different features
│   ├── authSlice.ts      # Authentication state
│   ├── tripsSlice.ts     # Trips management
│   └── uiSlice.ts        # UI state and preferences
├── api/                  # RTK Query API endpoints
│   ├── baseApi.ts        # Base API configuration
│   ├── authApi.ts        # Authentication endpoints
│   └── tripsApi.ts       # Trips endpoints
└── selectors/            # Reselect selectors for computed state
    ├── authSelectors.ts  # Auth-related selectors
    ├── tripsSelectors.ts # Trips-related selectors
    └── uiSelectors.ts    # UI-related selectors

```

## Key Features

### State Persistence
- Uses `redux-persist` with AsyncStorage
- Persists auth and UI state
- Excludes API cache and trips (fetched fresh)

### RTK Query Integration
- Centralized API state management
- Automatic caching and invalidation
- Optimistic updates for better UX

### Typed Hooks
- `useAppDispatch` and `useAppSelector` for type safety
- Prevents common TypeScript errors

### Selectors
- Memoized selectors using Reselect
- Computed state for complex data transformations
- Performance optimized

## Usage Examples

### Using Typed Hooks
```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, selectIsLoggedIn } from '@/store/selectors/authSelectors';
import { loginAsync } from '@/store/slices/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  
  const handleLogin = (credentials) => {
    dispatch(loginAsync(credentials));
  };
}
```

### Using RTK Query
```typescript
import { useGetTripsQuery, useCreateTripMutation } from '@/store/api/tripsApi';

function TripsComponent() {
  const { data: trips, isLoading, error } = useGetTripsQuery();
  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation();
  
  const handleCreateTrip = async (tripData) => {
    try {
      await createTrip(tripData).unwrap();
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };
}
```

### Using Selectors
```typescript
import { useAppSelector } from '@/store/hooks';
import { selectFilteredTrips, selectTripStats } from '@/store/selectors/tripsSelectors';

function TripsOverview() {
  const filteredTrips = useAppSelector(selectFilteredTrips);
  const stats = useAppSelector(selectTripStats);
  
  return (
    <View>
      <Text>Total Trips: {stats.total}</Text>
      <Text>Active Trips: {stats.active}</Text>
    </View>
  );
}
```

## Migration Strategy

This Redux setup runs alongside the existing AuthContext during migration:

1. **Phase 1**: Redux infrastructure setup (current)
2. **Phase 2**: Migrate auth screens to use Redux
3. **Phase 3**: Replace AuthContext with Redux auth
4. **Phase 4**: Add trips and other features to Redux

## Best Practices

1. **Use RTK Query for server state** - Don't duplicate server data in slices
2. **Keep slices focused** - Each slice should handle one domain
3. **Use selectors for computed state** - Avoid computing in components
4. **Normalize data when needed** - Use `createEntityAdapter` for collections
5. **Handle loading states** - Always show loading indicators for async operations

## Performance Considerations

- Selectors are memoized and only recompute when dependencies change
- RTK Query automatically deduplicates requests
- Redux DevTools are only enabled in development
- Persistence is configured to avoid blocking the main thread