import { baseUrl } from "../constants/apiConstants";

const API_URL = baseUrl;

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh?: string;
    auth?: string;
  };
};

export const getPushSubscription = async (): Promise<
  PushSubscriptionPayload | undefined
> => {
  try {
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('Notification' in window)
    ) {
      return undefined;
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return undefined;
    }

    const registration = await navigator.serviceWorker.register('/push-sw.js');
    const keyResponse = await fetch(
      `${API_URL}/api/electrician/push-public-key`,
    );
    const keyData = await keyResponse.json();

    if (!keyResponse.ok) {
      throw new Error(keyData.message || 'Failed to get VAPID public key');
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
      });
    }

    const subscriptionJson = subscription.toJSON();

    if (!subscriptionJson.endpoint) {
      return undefined;
    }

    return {
      endpoint: subscriptionJson.endpoint,
      keys: {
        p256dh: subscriptionJson.keys?.p256dh,
        auth: subscriptionJson.keys?.auth,
      },
    };
  } catch (error) {
    console.error('Push subscription preparation error:', error);
    return undefined;
  }
};

export const registerPushNotification = async (
  authToken: string,
) => {
  try {
    // Browser support check
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('Notification' in window)
    ) {
      // console.log(
      //   'Push notifications are not supported',
      // );

      return false;
    }

    // Ask notification permission
    const permission =
      await Notification.requestPermission();

    if (permission !== 'granted') {
      // console.log(
      //   'Notification permission denied',
      // );

      return false;
    }

    // Register service worker
    const registration =
      await navigator.serviceWorker.register(
        '/push-sw.js',
      );

    // console.log(
    //   'Push service worker registered',
    //   registration,
    // );

    // Get VAPID public key
    const keyResponse = await fetch(
      `${API_URL}/api/electrician/push-public-key`,
    );

    const keyData =
      await keyResponse.json();

    if (!keyResponse.ok) {
      throw new Error(
        keyData.message ||
          'Failed to get VAPID public key',
      );
    }

    // Create push subscription
    let subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,

          applicationServerKey:
            urlBase64ToUint8Array(
              keyData.publicKey,
            ),
        });
    }

    const subscriptionJson =
      subscription.toJSON();

    // Save subscription in backend
    const response = await fetch(
      `${API_URL}/api/electrician/push-subscription`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          Authorization:
            `Bearer ${authToken}`,
        },

        body: JSON.stringify({
          endpoint:
            subscriptionJson.endpoint,

          keys: {
            p256dh:
              subscriptionJson.keys?.p256dh,

            auth:
              subscriptionJson.keys?.auth,
          },
        }),
      },
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Failed to save push subscription',
      );
    }

    // console.log(
    //   'Push subscription saved',
    // );

    return true;
  } catch (error) {
    console.error(
      'Push notification registration error:',
      error,
    );

    return false;
  }
};

const urlBase64ToUint8Array = (
  base64String: string,
) => {
  const padding =
    '='.repeat(
      (4 -
        (base64String.length % 4)) %
        4,
    );

  const base64 =
    base64String +
    padding;

  const rawData =
    window.atob(
      base64
        .replace(/-/g, '+')
        .replace(/_/g, '/'),
    );

  return Uint8Array.from(
    [...rawData].map(
      (char) =>
        char.charCodeAt(0),
    ),
  );
};