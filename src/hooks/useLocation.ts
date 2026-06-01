import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

import type { TransactionLocation } from '../domain/types';

interface UseLocationOptions {
  initialLocation?: TransactionLocation;
}

const LOCATION_PERMISSION_ERROR =
  'No pudimos acceder a tu ubicación. Revisá los permisos del dispositivo.';
const LOCATION_UNAVAILABLE_ERROR =
  'No pudimos obtener tu ubicación actual. Activá la ubicación del emulador o intentá de nuevo.';

async function enableAndroidNetworkProvider() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Location.enableNetworkProviderAsync().catch(() => undefined);
}

async function getAvailablePosition() {
  const lastKnownPosition = await Location.getLastKnownPositionAsync({
    maxAge: 5 * 60 * 1000,
  }).catch(() => null);

  if (lastKnownPosition) {
    return lastKnownPosition;
  }

  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    mayShowUserSettingsDialog: true,
  }).catch(() => null);
}

export function useLocation({ initialLocation }: UseLocationOptions = {}) {
  const [location, setLocation] = useState<TransactionLocation | undefined>(
    initialLocation,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialLatitude = initialLocation?.latitude;
  const initialLongitude = initialLocation?.longitude;

  useEffect(() => {
    setLocation(
      initialLatitude !== undefined && initialLongitude !== undefined
        ? { latitude: initialLatitude, longitude: initialLongitude }
        : undefined,
    );
  }, [initialLatitude, initialLongitude]);

  const captureLocation = useCallback(async () => {
    setLoading(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError(LOCATION_PERMISSION_ERROR);
        return;
      }

      await enableAndroidNetworkProvider();
      const position = await getAvailablePosition();

      if (!position) {
        setError(LOCATION_UNAVAILABLE_ERROR);
        return;
      }

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(undefined);
    setError(null);
  }, []);

  return {
    location,
    error,
    loading,
    captureLocation,
    clearLocation,
  };
}
