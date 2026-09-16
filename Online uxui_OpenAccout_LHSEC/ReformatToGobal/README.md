# LHSEC Global Trading - CashTransaction Exporter (CQ Format)

ระบบแปลงไฟล์ข้อมูลรายงานธุรกรรมประจำวัน (Daily Cash Transaction Reports) สู่รูปแบบมาตรฐาน **CashTransaction_YYYYMMDD.xlsx (28 คอลัมน์)** สำหรับนำเข้าสู่ระบบ **CQ Back-Office**

---

## 📑 เอกสารประกอบระบบ (Documentation)

* 📖 **[เอกสารข้อกำหนดระบบและคู่มือการพัฒนาฉบับสมบูรณ์ (SYSTEM_DEVELOPMENT_SPEC.md)](SYSTEM_DEVELOPMENT_SPEC.md)**

---

## 🚀 ฟังก์ชันหลัก (Key Features)

* **รองรับไฟล์ ZIP และ CSV**: ลากไฟล์ `.zip` รายงานประจำวันหรือ `.csv` วางในหน้าจอเพื่อประมวลผลทันที
* **28-Column CQ Standard Mapping**: จัดวาง 28 คอลัมน์และกำหนด Format ทศนิยม/วันที่ให้ตรงตามมาตรฐาน CQ 100%
* **ระบบตรวจจับภาษีเงินปันผลอัตโนมัติ (DEPDIV / AW)**:
  * ถ้า `vat_amount` = 0 -> จัดเป็น `NoN TAX` และ Amount = `0.00`
  * ถ้า `vat_amount` > 0 -> จัดเป็น `WHT TAX` พร้อมคำนวณยอดเงินภาษี
  * สร้างข้อความ Description เงินปันผลตามจำนวนหุ้นและ Symbol อัตโนมัติ
* **Customer Master Mapping**: จับคู่เลขบัญชี `800001`, `012147`, `001754`, `800005` และชื่อลูกค้าให้อัตโนมัติ พร้อมหน้าต่าง UI ให้เพิ่ม/แก้ไขและบันทึกค่าได้ถาวร
* **In-table Interactive Editor**: สามารถตรวจสอบและแก้ไขค่าในตารางได้โดยตรงก่อนส่งออก
* **ส่งออกไฟล์ XLSX / XLS**: จัดตั้งค่า Column Widths, Number Formats, และตั้งชื่อไฟล์ตามวันที่ของธุรกรรมอัตโนมัติ
* **Node.js CLI Support**: สคริปต์ [export_cashtransaction.js](export_cashtransaction.js) สำหรับรันประมวลผลผ่าน Command Line / Batch Schedule

---

## 🛠️ โครงสร้างไฟล์ (Project Files)

| ไฟล์ / โฟลเดอร์ | หน้าที่ |
|---|---|
| [index.html](index.html) | หน้าจอเว็บแอปพลิเคชันหลัก |
| [export_cashtransaction.js](export_cashtransaction.js) | สคริปต์รันผ่าน Node.js CLI สำหรับรันคำสั่งอัตโนมัติ |
| [css/style.css](css/style.css) | ชุดรูปแบบและดีไซน์ (Modern Dark Dashboard) |
| [js/app.js](js/app.js) | Logic การประมวลผล, Parser, Customer Master, UI Handler |
| [js/xlsx.full.min.js](js/xlsx.full.min.js) | ไลบรารีสร้างไฟล์ Excel (SheetJS) |
| [js/jszip.min.js](js/jszip.min.js) | ไลบรารีแยกไฟล์ ZIP ในเบราว์เซอร์ |
| [SYSTEM_DEVELOPMENT_SPEC.md](SYSTEM_DEVELOPMENT_SPEC.md) | ข้อกำหนดระบบและแนวทางการพัฒนาต่อยอด |

---

## 💻 วิธีการรันและใช้งาน

### 1. ใช้งานผ่าน Web Browser
เปิดไฟล์ [index.html](index.html) ใน Google Chrome หรือ Microsoft Edge เพื่อเริ่มใช้งานได้ทันที (ไม่ต้องติดตั้ง Server)

### 2. ใช้งานผ่าน Command Line (Node.js)
```bash
node export_cashtransaction.js "path/to/2026_08_28_cash_transaction_data.csv"
```
