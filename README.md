# 📘 DivvyLog

DivvyLog คือเว็บแอปสำหรับจดบันทึกและวิเคราะห์รายได้จากเงินปันผล (Dividend Tracker) ที่ใช้งานง่าย รองรับการใช้งานทั้งบน PC และมือถือ โดยใช้ **Google Sheets** เป็นฐานข้อมูลหลัก

---

## ✨ Features

- 🔐 ระบบล็อกอินด้วย Username
- 💸 บันทึกรายการปันผล (วันที่ / หุ้น / จำนวน / อัตราแลกเปลี่ยน)
- 📊 Dashboard สรุปผลรวมเงินปันผล, กราฟรายเดือนและรายปี
- 📅 หน้าแสดงรายการทั้งหมด (ดู/แก้ไข/ลบได้)
- 🌗 รองรับ Dark Mode
- 🚀 ใช้งานได้ทั้งบนมือถือและเดสก์ท็อป
- ☁️ ใช้ Google Apps Script เชื่อมต่อกับ Google Sheets โดยตรง

---

## 🛠 Tech Stack

- Frontend: HTML + TailwindCSS + Vanilla JS
- Charting: Chart.js
- Backend: Google Apps Script (GAS)
- Database: Google Sheets

---

## 📁 โครงสร้างไฟล์

```
DivvyLog/
├── index.html         // หน้า Login
├── landing.html       // หน้า Dashboard (สรุปผล)
├── records.html       // หน้าแสดงรายการทั้งหมด
├── js/
│   ├── login.js
│   ├── dashboard.js
│   ├── record.js
│   └── darkmode.js
├── css/
│   └── tailwind.css
└── Google Apps Script (Code.gs) // ฝั่งเซิร์ฟเวอร์
```

---

## 📌 วิธีติดตั้ง

1. สร้าง Google Sheet และเตรียม 2 ชีต:

   - `Users` (A: Username)
   - `Dividends` (A: Date, B: Ticker, C: Amount, D: Rate, E: Username)
2. เปิด Google Apps Script แล้วใส่โค้ด `doGet()` และ `doPost()` จาก `Code.gs`
3. Deploy: firebase deploy

   - เลือก `Deploy > Web App`
   - เลือกให้ Anyone สามารถเข้าใช้ได้
   - ก๊อป URL ที่ได้มาใส่ในตัวแปร `SHEET_API` ใน JS
4. เปิดไฟล์ `index.html` ด้วย Live Server หรือ Web Server ใด ๆ

---

## 🔒 Security Note

- อย่าลืมตั้งค่า Spreadsheet เป็น "Anyone with the link: Viewer" เฉพาะในช่วงทดสอบ
- สามารถใช้ Firebase Auth หรือ OAuth เพิ่มเติมในเวอร์ชันถัดไปได้

---

## 🧑‍💻 ผู้พัฒนา

> พัฒนาโดย: ธันว์
> ตำแหน่ง: Java/Golang Backend Developer
> งานอดิเรก: ลงทุนหุ้น, ทำ Dashboard, เล่นบอร์ดเกมแนวสืบสวน 🕵️‍♂️
> AI Assistant: ChatGPT (ในโหมด Jarvis 🤖)

---

## 📬 ติดต่อเพิ่มเติม

หากต้องการให้ระบบนี้รองรับการคำนวณภาษี, รายงาน PDF, หรือเชื่อมต่อ API โบรกเกอร์
สามารถติดต่อผู้พัฒนาเพื่อขอ roadmap ได้เลย
