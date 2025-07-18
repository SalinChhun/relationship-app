self.__WB_MANIFEST;

self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "New Notification";
    const options = {
      body: data.body || "",
      icon: "/icon-192x192.png",
      data: data.url || "/"
    };
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  });