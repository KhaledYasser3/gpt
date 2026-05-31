# 🐘 PostgreSQL Docker Deployment & DBeaver Connection Guide

This directory contains the configurations needed to launch a dedicated PostgreSQL 15 database instance using Docker.

---

## 🇸🇦 دليل التشغيل والربط باللغة العربية

### ١. تشغيل قاعدة البيانات عبر Docker 🚀
لتشغيل قاعدة البيانات في الخلفية، افتح محرك الأوامر (Terminal/PowerShell) في مجلد `docker` واكتب الأمر التالي:
```bash
docker compose up -d
```
*سيقوم هذا الأمر بتحميل نسخة PostgreSQL 15 وتجهيز الحاوية (Container) وتفعيل منفذ الاتصال `5432`.*

#### للتأكد من حالة التشغيل:
```bash
docker compose ps
```

---

### ٢. كيفية الربط باستخدام DBeaver 🛠️
برنامج **DBeaver** هو أداة رائعة لإدارة قواعد البيانات. لربطه بقاعدة البيانات التي قمنا بتشغيلها، اتبع الخطوات التالية:

1. افتح برنامج **DBeaver**.
2. اضغط على زر **New Database Connection** (أيقونة الفيش الكهربائي في الأعلى).
3. اختر **PostgreSQL** من القائمة ثم اضغط **Next**.
4. قم بملء تفاصيل الاتصال بالتطابق مع ملف `.env` كالتالي:
   * **Host**: `localhost` (أو `127.0.0.1`)
   * **Port**: `5432`
   * **Database**: `aichatsaas`
   * **Username**: `postgres`
   * **Password**: `postgres_secure_pass_123`
5. اضغط على زر **Test Connection** في الأسفل للتحقق من الاتصال:
   * *إذا طلب البرنامج تنزيل تعريفات (Drivers)، اضغط على **Download**.*
6. اضغط **Finish** لحفظ الاتصال والدخول لقاعدة البيانات وتصفح الجداول!

---

## 🇺🇸 Setup Guide in English

### 1. Launch PostgreSQL with Docker 🚀
Navigate your terminal/command-prompt to the `docker` directory and run:
```bash
docker compose up -d
```
*This command runs the PostgreSQL database in detached mode, exposing port `5432` to your host machine.*

#### Verify the container health check:
```bash
docker compose ps
```

---

### 2. How to Connect DBeaver 🛠️
To manage your newly created database using **DBeaver**, configure a connection with these settings:

1. Launch **DBeaver**.
2. Click on **New Database Connection** (the plug socket icon on the top-left).
3. Select **PostgreSQL** and click **Next**.
4. Enter the credentials defined in your `.env`:
   * **Host**: `localhost`
   * **Port**: `5432`
   * **Database**: `aichatsaas`
   * **Username**: `postgres`
   * **Password**: `postgres_secure_pass_123`
5. Click **Test Connection** to confirm connectivity:
   * *If DBeaver requests downloading database drivers, click **Download**.*
6. Click **Finish** to save the entry and start creating or viewing tables!
