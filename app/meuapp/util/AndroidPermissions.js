//Publish, EditProfile, EditPost

import { Platform } from 'react-native';
import { requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

export async function AndroidPermissions() {
    if (Platform.OS === 'android') {
        const permissions = Platform.Version >= 33
        ? [
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
            ]
        : [
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ];

    const statuses = await requestMultiple(permissions);

    const allGranted = Object.values(statuses).every(
        status => status === RESULTS.GRANTED
    );

        return allGranted;
    }

    return true;
}
