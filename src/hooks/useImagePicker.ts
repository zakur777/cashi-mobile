import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

interface UseImagePickerOptions {
  initialPhotoUri?: string;
}

const CAMERA_PERMISSION_ERROR =
  'No pudimos acceder a la cámara. Revisá los permisos del dispositivo.';
const GALLERY_PERMISSION_ERROR =
  'No pudimos acceder a tus fotos. Revisá los permisos del dispositivo.';

function getPickedUri(result: ImagePicker.ImagePickerResult): string | undefined {
  if (result.canceled) {
    return undefined;
  }

  return result.assets[0]?.uri;
}

export function useImagePicker({ initialPhotoUri }: UseImagePickerOptions = {}) {
  const [photoUri, setPhotoUri] = useState<string | undefined>(initialPhotoUri);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPhotoUri(initialPhotoUri);
  }, [initialPhotoUri]);

  const capturePhoto = useCallback(async () => {
    setLoading(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setError(CAMERA_PERMISSION_ERROR);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      const uri = getPickedUri(result);
      if (uri) {
        setPhotoUri(uri);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const selectPhoto = useCallback(async () => {
    setLoading(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError(GALLERY_PERMISSION_ERROR);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      const uri = getPickedUri(result);
      if (uri) {
        setPhotoUri(uri);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPhoto = useCallback(() => {
    setPhotoUri(undefined);
    setError(null);
  }, []);

  return {
    photoUri,
    error,
    loading,
    capturePhoto,
    selectPhoto,
    clearPhoto,
  };
}
