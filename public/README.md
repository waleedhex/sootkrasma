# صوتك يرسم

لعبة جماعية تفاعلية باستخدام Firebase وFront-End فقط.

## الملفات

- `index.html`: صفحة الدخول
- `player.html`: واجهة اللاعب (لوبي ولعب)
- `viewer.html`: عرض الرسم لايف
- `admin.html`: لوحة إدارة الرموز والإعلانات
- `assets/`: CSS وجافاسكربت
- `data/`: ملفات الكلمات، الرموز، الإعلانات
- `firebase/`: إعدادات Firebase
- `manifest.json`: إعداد PWA
- `service-worker.js`: دعم Offline

## البدء

1. ضع مفاتيح Firebase في `firebase/firebase-config.js`.
2. ارفع المشروع إلى Firebase Hosting.
3. احفظ بيانات Realtime Database في الهيكل `rooms/{roomId}`.
