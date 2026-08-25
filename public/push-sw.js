self.addEventListener('push', (event) => {
  console.log('[Push SW] Push event received');

  if (!event.data) {
    console.log('[Push SW] No data');
    return;
  }

  let data;

  try {
    data = event.data.json();
  } catch (error) {
    console.log(
      '[Push SW] Received plain text push',
    );

    data = {
      title: 'New Notification',
      message: event.data.text(),
      url: '/electrician',
    };
  }

  console.log('[Push SW] Push data:', data);

  const title =
    data.title || 'New Notification';

  const options = {
    body: data.message || '',
    tag: 'electrician-notification',
    requireInteraction: true,
    data: {
      url: data.url || '/electrician',
    },
  };

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(() => {
        console.log(
          '[Push SW] Notification displayed',
        );
      })
      .catch((error) => {
        console.error(
          '[Push SW] showNotification failed:',
          error,
        );
      }),
  );
});

self.addEventListener(
  'notificationclick',
  (event) => {
    console.log(
      '[Push SW] Notification clicked',
    );

    event.notification.close();

    const url =
      event.notification.data?.url ||
      '/electrician';

    event.waitUntil(
      clients.openWindow(
        new URL(
          url,
          self.location.origin,
        ).href,
      ),
    );
  },
);