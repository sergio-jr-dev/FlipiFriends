import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'flipifriends-images-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 140,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
)

registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'flipifriends-fonts-v1',
  }),
)
