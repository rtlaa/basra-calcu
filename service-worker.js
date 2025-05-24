const CACHE_NAME = 'basra-calculator-v1'; // اسم لتخزين ملفات التطبيق مؤقتًا
const urlsToCache = [
  '/index.html', // ملف HTML الخاص بك
  '/manifest.json',        // ملف الهوية الذي أنشأناه
  '/icons/icon-192x192.png', // أيقونات التطبيق
  '/icons/icon-512x512.png', // أيقونات التطبيق
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap' // رابط الخطوط الخارجية
];

// عند تثبيت الـ Service Worker (أول مرة يزور فيها المستخدم تطبيقك)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME) // افتح مكان التخزين المؤقت
      .then(cache => {
        console.log('تم فتح ذاكرة التخزين المؤقتة');
        return cache.addAll(urlsToCache); // ضع كل الملفات المهمة هناك
      })
  );
});

// عند طلب جلب أي شيء (صورة، صفحة، كود) من المتصفح
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request) // ابحث عن الملف في ذاكرة التخزين المؤقتة أولاً
      .then(response => {
        if (response) {
          return response; // إذا وجدته، استخدم النسخة المخزنة مؤقتًا
        }
        return fetch(event.request); // وإلا، اجلب الملف من الإنترنت كالمعتاد
      })
  );
});

// عند تفعيل نسخة جديدة من الـ Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // هذا هو الكاش (مكان التخزين المؤقت) الذي نريد الاحتفاظ به
  event.waitUntil(
    caches.keys().then(cacheNames => { // احصل على أسماء كل أماكن التخزين المؤقتة الموجودة
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // امسح أماكن التخزين القديمة أو غير المستخدمة
          }
        })
      );
    })
  );
});