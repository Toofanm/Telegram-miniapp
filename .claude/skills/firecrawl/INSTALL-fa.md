# راهنمای نصب: Firecrawl
شخصی‌سازی‌شده برای EditorFarzad

## روش ۱: Claude.ai یا اپ دسکتاپ
1. فایل `editorfarzad-firecrawl.skill` رو دانلود کن (یا داخل اپ دکمه‌ی Save skill رو بزن).
2. برو به Settings ← Capabilities ← Skills و فایل رو آپلود کن (اگه فقط zip قبول کرد، پسوند رو به .zip تغییر بده).
3. مطمئن شو Code execution روشنه و اسکیل فعاله.

## روش ۲: Claude Code
```bash
unzip editorfarzad-firecrawl.skill -d ~/.claude/skills/
```
بعد Claude Code رو دوباره باز کن. اسکیل با دستور `/editorfarzad-firecrawl` یا خودکار فعال می‌شه.

## پیش‌نیاز (مهم)
این اسکیل بدون ابزار Firecrawl کار نمی‌کنه و فقط در Claude Code یا محیطی که ترمینال و اینترنت داره قابل استفاده‌ست:
```bash
npm install -g firecrawl-cli
firecrawl login
```
کلید API رو از firecrawl.dev بگیر (پلن رایگان داره). نسخه‌ی کامل اسکیل‌های رسمی: `npx skills add firecrawl/skills`
