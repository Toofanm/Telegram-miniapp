# راهنمای نصب: UI/UX Pro Max (Lite)
شخصی‌سازی‌شده برای EditorFarzad

## روش ۱: Claude.ai یا اپ دسکتاپ
1. فایل `editorfarzad-uiux-pro-max.skill` رو دانلود کن (یا داخل اپ دکمه‌ی Save skill رو بزن).
2. برو به Settings ← Capabilities ← Skills و فایل رو آپلود کن (اگه فقط zip قبول کرد، پسوند رو به .zip تغییر بده).
3. مطمئن شو Code execution روشنه و اسکیل فعاله.

## روش ۲: Claude Code
```bash
unzip editorfarzad-uiux-pro-max.skill -d ~/.claude/skills/
```
بعد Claude Code رو دوباره باز کن. اسکیل با دستور `/editorfarzad-uiux-pro-max` یا خودکار فعال می‌شه.

## نسخه‌ی کامل
این نسخه‌ی سبک و مستقله. نسخه‌ی کامل با دیتابیس استایل‌ها و فونت‌ها فقط در Claude Code نصب می‌شه:
```bash
npm install -g ui-ux-pro-max-cli
uipro init --ai claude --global
```
(پایتون ۳ لازمه.) سازنده‌ی اصلی: nextlevelbuilder، لایسنس MIT.
