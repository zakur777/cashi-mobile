import { act, renderHook } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';

import { useImagePicker } from '../src/hooks/useImagePicker';

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
}));

const mockedImagePicker = ImagePicker as jest.Mocked<typeof ImagePicker>;

describe('useImagePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets an inline error when camera permission is denied', async () => {
    mockedImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({ status: ImagePicker.PermissionStatus.DENIED, granted: false, canAskAgain: false, expires: 'never' });
    const { result } = renderHook(() => useImagePicker());

    await act(async () => {
      await result.current.capturePhoto();
    });

    expect(result.current.photoUri).toBeUndefined();
    expect(result.current.error).toBe('No pudimos acceder a la cámara. Revisá los permisos del dispositivo.');
    expect(mockedImagePicker.launchCameraAsync).not.toHaveBeenCalled();
  });

  it('stores a captured camera photo URI when permission is granted', async () => {
    mockedImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({ status: ImagePicker.PermissionStatus.GRANTED, granted: true, canAskAgain: true, expires: 'never' });
    mockedImagePicker.launchCameraAsync.mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file:///camera.jpg', width: 100, height: 100 }] });
    const { result } = renderHook(() => useImagePicker());

    await act(async () => {
      await result.current.capturePhoto();
    });

    expect(result.current.photoUri).toBe('file:///camera.jpg');
    expect(result.current.error).toBeNull();
  });

  it('stores a selected gallery photo and can clear it', async () => {
    mockedImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ status: ImagePicker.PermissionStatus.GRANTED, granted: true, canAskAgain: true, expires: 'never' });
    mockedImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file:///gallery.jpg', width: 100, height: 100 }] });
    const { result } = renderHook(() => useImagePicker({ initialPhotoUri: 'file:///old.jpg' }));

    await act(async () => {
      await result.current.selectPhoto();
    });
    expect(result.current.photoUri).toBe('file:///gallery.jpg');

    act(() => {
      result.current.clearPhoto();
    });
    expect(result.current.photoUri).toBeUndefined();
  });
});
