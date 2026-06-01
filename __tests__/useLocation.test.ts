import { act, renderHook } from '@testing-library/react-native';
import * as Location from 'expo-location';

import { useLocation } from '../src/hooks/useLocation';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  enableNetworkProviderAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
}));

const mockedLocation = Location as jest.Mocked<typeof Location>;

describe('useLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLocation.enableNetworkProviderAsync.mockResolvedValue(undefined);
    mockedLocation.getLastKnownPositionAsync.mockResolvedValue(null);
  });

  it('sets an inline error when foreground location permission is denied', async () => {
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: Location.PermissionStatus.DENIED, granted: false, canAskAgain: false, expires: 'never' });
    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.captureLocation();
    });

    expect(result.current.location).toBeUndefined();
    expect(result.current.error).toBe('No pudimos acceder a tu ubicación. Revisá los permisos del dispositivo.');
    expect(mockedLocation.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it('stores current coordinates when permission is granted', async () => {
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: Location.PermissionStatus.GRANTED, granted: true, canAskAgain: true, expires: 'never' });
    mockedLocation.getCurrentPositionAsync.mockResolvedValueOnce({ coords: { latitude: -33.4489, longitude: -70.6693 } } as Location.LocationObject);
    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.captureLocation();
    });

    expect(result.current.location).toEqual({ latitude: -33.4489, longitude: -70.6693 });
    expect(result.current.error).toBeNull();
  });

  it('uses the last known position when it is available', async () => {
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: Location.PermissionStatus.GRANTED, granted: true, canAskAgain: true, expires: 'never' });
    mockedLocation.getLastKnownPositionAsync.mockResolvedValueOnce({ coords: { latitude: -33.45, longitude: -70.66 } } as Location.LocationObject);
    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.captureLocation();
    });

    expect(result.current.location).toEqual({ latitude: -33.45, longitude: -70.66 });
    expect(mockedLocation.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it('sets an inline error when current location is unavailable', async () => {
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: Location.PermissionStatus.GRANTED, granted: true, canAskAgain: true, expires: 'never' });
    mockedLocation.getCurrentPositionAsync.mockRejectedValueOnce(new Error('Current location is unavailable'));
    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.captureLocation();
    });

    expect(result.current.location).toBeUndefined();
    expect(result.current.error).toBe('No pudimos obtener tu ubicación actual. Activá la ubicación del emulador o intentá de nuevo.');
  });

  it('initializes with existing coordinates and clears them', () => {
    const { result } = renderHook(() =>
      useLocation({ initialLocation: { latitude: -33.45, longitude: -70.66 } }),
    );

    expect(result.current.location).toEqual({ latitude: -33.45, longitude: -70.66 });

    act(() => {
      result.current.clearLocation();
    });
    expect(result.current.location).toBeUndefined();
  });
});
