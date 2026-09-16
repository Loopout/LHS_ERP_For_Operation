/**
 * CashTransaction Export Application for CQ System
 * LHSEC Global Trading - Reformat Module
 */

// Default Customer Master Mappings
const DEFAULT_CUSTOMER_MASTER = {
  "800001": { b2bAcc: "ASI374219405", firstName: "มานะ", lastName: "เอื้ออภิสิทธิ์" },
  "012147": { b2bAcc: "ASI374219405", firstName: "PEI-FEN", lastName: "CHE" },
  "001754": { b2bAcc: "ASI374219405", firstName: "อนันต์", lastName: "จิตตวานิชย์" },
  "800005": { b2bAcc: "ASI374219405", firstName: "พัศวีร์", lastName: "อัศวกิจ" },
  "ASI672238444": { b2bAcc: "ASI374219405", firstName: "มานะ", lastName: "เอื้ออภิสิทธิ์", accountNo: "800001" }
};

// 28 CQ Columns with specific classes
const CQ_COLUMNS = [
  { key: "no", label: "No", default: "", cssClass: "col-no" },
  { key: "accountNo", label: "Account No", default: "", cssClass: "col-acc" },
  { key: "subAccountNo", label: "Sub Account No", default: "", cssClass: "col-acc" },
  { key: "b2bCode", label: "B2B Code", default: "GTN", cssClass: "col-code" },
  { key: "b2bAccountNo", label: "B2B Account No", default: "ASI374219405", cssClass: "col-acc" },
  { key: "b2bSubAccountNo", label: "B2B Sub Account No", default: "", cssClass: "col-acc" },
  { key: "firstName", label: "First Name", default: "", cssClass: "col-name" },
  { key: "lastName", label: "Last Name", default: "", cssClass: "col-name" },
  { key: "transDate", label: "Trans Date", default: "", cssClass: "col-date" },
  { key: "effectiveDate", label: "Effective Date", default: "", cssClass: "col-date" },
  { key: "valueDate", label: "Value Date", default: "", cssClass: "col-date" },
  { key: "txnType", label: "Transaction Type", default: "AW", cssClass: "col-type" },
  { key: "description", label: "Description", default: "", cssClass: "col-desc" },
  { key: "companyCode", label: "Company Code", default: "", cssClass: "col-code" },
  { key: "format", label: "Format", default: "", cssClass: "col-code" },
  { key: "ccy", label: "CCY", default: "THB", cssClass: "col-ccy" },
  { key: "fcdAccount", label: "FCD Account", default: "", cssClass: "col-acc" },
  { key: "amount", label: "Amount", default: "0.00", cssClass: "col-amount" },
  { key: "bankCharge", label: "Bank Charge", default: "", cssClass: "col-amount" },
  { key: "ccyPurchase", label: "CCY Purchase", default: "", cssClass: "col-ccy" },
  { key: "fcdAccountPurchase", label: "FCD Account Purchase", default: "", cssClass: "col-acc" },
  { key: "amountPurchase", label: "Amount Purchase", default: "", cssClass: "col-amount" },
  { key: "bankChargePurchase", label: "Bank Charge Purchase", default: "", cssClass: "col-amount" },
  { key: "fxRate", label: "FX Rate", default: "", cssClass: "col-rate" },
  { key: "fxCcy", label: "FX CCY", default: "", cssClass: "col-rate" },
  { key: "refNo", label: "Ref No", default: "", cssClass: "col-ref" },
  { key: "status", label: "Status", default: "A", cssClass: "col-status" },
  { key: "remark", label: "Remark", default: "NoN TAX", cssClass: "col-remark" }
];

class CashTransactionManager {
  constructor() {
    this.customerMaster = this.loadCustomerMaster();
    this.processedRows = [];
    this.initElements();
    this.initEvents();
    this.renderMasterTable();
  }

  loadCustomerMaster() {
    const saved = localStorage.getItem("cq_customer_master");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved master data", e);
      }
    }
    return { ...DEFAULT_CUSTOMER_MASTER };
  }

  saveCustomerMaster() {
    localStorage.setItem("cq_customer_master", JSON.stringify(this.customerMaster));
  }

  initElements() {
    this.dropzone = document.getElementById("dropzone");
    this.fileInput = document.getElementById("fileInput");
    this.tableBody = document.getElementById("cqTableBody");
    this.emptyState = document.getElementById("emptyState");
    this.rowCountBadge = document.getElementById("rowCountBadge");
    this.exportXlsxBtn = document.getElementById("exportXlsxBtn");
    this.exportXlsBtn = document.getElementById("exportXlsBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.addRowBtn = document.getElementById("addRowBtn");
    this.txnTypeSelect = document.getElementById("defaultTxnType");
    this.defaultB2BAccInput = document.getElementById("defaultB2BAcc");
    this.remarkInput = document.getElementById("defaultRemark");
    this.transDateInput = document.getElementById("defaultTransDate");
    this.manageMasterBtn = document.getElementById("manageMasterBtn");
    this.masterModal = document.getElementById("masterModal");
    this.closeModalBtn = document.getElementById("closeModalBtn");
    this.masterTableBody = document.getElementById("masterTableBody");
    this.addMasterRowBtn = document.getElementById("addMasterRowBtn");
    this.saveMasterBtn = document.getElementById("saveMasterBtn");
    this.resetMasterBtn = document.getElementById("resetMasterBtn");
  }

  initEvents() {
    // Drag and drop events
    ["dragenter", "dragover"].forEach(event => {
      this.dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        this.dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(event => {
      this.dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        this.dropzone.classList.remove("dragover");
      });
    });

    this.dropzone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.handleFiles(files);
      }
    });

    this.dropzone.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFiles(e.target.files);
      }
    });

    // Export buttons
    this.exportXlsxBtn.addEventListener("click", () => this.exportExcel("xlsx"));
    this.exportXlsBtn.addEventListener("click", () => this.exportExcel("xls"));
    this.clearBtn.addEventListener("click", () => this.clearData());
    this.addRowBtn.addEventListener("click", () => this.addNewRow());

    // Master Modal
    this.manageMasterBtn.addEventListener("click", () => {
      this.renderMasterTable();
      this.masterModal.style.display = "flex";
    });

    this.closeModalBtn.addEventListener("click", () => {
      this.masterModal.style.display = "none";
    });

    this.addMasterRowBtn.addEventListener("click", () => this.addMasterTableRow());
    this.saveMasterBtn.addEventListener("click", () => this.saveMasterFromUI());
    this.resetMasterBtn.addEventListener("click", () => {
      if (confirm("คุณต้องการคืนค่าเริ่มต้นของ Customer Master หรือไม่?")) {
        this.customerMaster = { ...DEFAULT_CUSTOMER_MASTER };
        this.saveCustomerMaster();
        this.renderMasterTable();
        this.showToast("คืนค่าเริ่มต้นเรียบร้อยแล้ว", "success");
      }
    });
  }

  async handleFiles(files) {
    for (let file of files) {
      const name = file.name.toLowerCase();
      if (name.endsWith(".zip")) {
        await this.processZipFile(file);
      } else if (name.endsWith(".csv")) {
        const text = await file.text();
        this.processCsvContent(text, file.name);
      } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        await this.processExcelFile(file);
      } else {
        this.showToast(`ไฟล์ ${file.name} ไม่รองรับ (รองรับ .csv, .zip, .xlsx)`, "error");
      }
    }
  }

  async processZipFile(file) {
    if (typeof JSZip === "undefined") {
      this.showToast("JSZip library is loading...", "info");
      return;
    }
    try {
      const zip = await JSZip.loadAsync(file);
      let foundCsv = false;
      for (let filename of Object.keys(zip.files)) {
        if (filename.toLowerCase().includes("cash_transaction") && filename.toLowerCase().endsWith(".csv")) {
          const csvText = await zip.files[filename].async("text");
          this.processCsvContent(csvText, filename);
          foundCsv = true;
        }
      }
      if (!foundCsv) {
        // Look for any csv
        for (let filename of Object.keys(zip.files)) {
          if (filename.toLowerCase().endsWith(".csv")) {
            const csvText = await zip.files[filename].async("text");
            this.processCsvContent(csvText, filename);
            foundCsv = true;
          }
        }
      }
      if (foundCsv) {
        this.showToast(`อ่านไฟล์จาก ZIP สำเร็จ: ${file.name}`, "success");
      } else {
        this.showToast(`ไม่พบไฟล์ CSV ภายใน ZIP: ${file.name}`, "error");
      }
    } catch (e) {
      console.error("Error reading zip", e);
      this.showToast("เกิดข้อผิดพลาดในการอ่านไฟล์ ZIP", "error");
    }
  }

  async processExcelFile(file) {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      if (jsonData && jsonData.length > 1) {
        this.processRowsFromSheet(jsonData);
      }
    } catch (e) {
      console.error("Error reading Excel", e);
      this.showToast("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel", "error");
    }
  }

  processRowsFromSheet(rows) {
    const headers = rows[0].map(h => String(h).trim());
    const dataRows = rows.slice(1);
    
    // Check if it's already in CQ 28-column format
    if (headers.includes("B2B Code") || headers.includes("Transaction Type")) {
      dataRows.forEach(r => {
        if (r && r.length > 0) {
          const rowObj = {};
          CQ_COLUMNS.forEach((col, idx) => {
            rowObj[col.key] = r[idx] !== undefined && r[idx] !== null ? String(r[idx]) : col.default;
          });
          this.processedRows.push(rowObj);
        }
      });
      this.renderTable();
      this.showToast(`นำเข้า ${dataRows.length} รายการสำเร็จ`, "success");
      return;
    }

    // Otherwise treat like CSV
    const csvArray = [headers.join(","), ...dataRows.map(r => r.join(","))].join("\n");
    this.processCsvContent(csvArray, "Imported Excel");
  }

  parseCsv(text) {
    const lines = [];
    let currentRow = [];
    let currentCell = "";
    let insideQuote = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          currentCell += '"';
          i++; // skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if ((char === '\r' || char === '\n') && !insideQuote) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        lines.push(currentRow);
      }
    }
    return lines;
  }

  formatDateYYYYMMDD(dateStr) {
    if (!dateStr) return "";
    // Clean string
    const str = dateStr.trim().replace(/[-/ :]/g, "");
    if (str.length >= 8) {
      return str.substring(0, 8);
    }
    return dateStr;
  }

  processCsvContent(csvText, sourceName) {
    const rows = this.parseCsv(csvText);
    if (!rows || rows.length < 2) {
      this.showToast(`ไฟล์ ${sourceName} ไม่มีข้อมูล`, "error");
      return;
    }

    const headers = rows[0].map(h => h.toLowerCase().trim());
    const dataRows = rows.slice(1);

    const getCol = (row, colName) => {
      const idx = headers.indexOf(colName.toLowerCase());
      return idx >= 0 && idx < row.length ? row[idx] : "";
    };

    const newRows = [];

    dataRows.forEach((r) => {
      const txnCode = getCol(r, "txn_code") || getCol(r, "transaction_type") || "";
      const customerNo = getCol(r, "customer_no");
      const externalRefNo = getCol(r, "external_ref_no") || getCol(r, "account_no");
      const txnDate = getCol(r, "txn_date") || getCol(r, "trans_date");
      const valueDate = getCol(r, "value_date");
      const narration = getCol(r, "narration") || getCol(r, "description");
      const currency = getCol(r, "account_currency") || getCol(r, "currency") || "THB";
      const amtInTransCurr = getCol(r, "amt_in_trans_currency") || getCol(r, "amount") || "0";
      const vatAmount = getCol(r, "vat_amount");
      const transactionId = getCol(r, "transaction_id") || getCol(r, "related_transaction_id") || getCol(r, "ref_no");
      const shares = getCol(r, "eligible_shares") || getCol(r, "filled_volume");

      // Resolve Customer Master
      let accountNo = externalRefNo;
      let b2bAcc = this.defaultB2BAccInput?.value?.trim() || "ASI374219405";
      let firstName = "";
      let lastName = "";

      // Check Master Table
      const masterInfo = this.customerMaster[accountNo] || this.customerMaster[customerNo];
      if (masterInfo) {
        b2bAcc = masterInfo.b2bAcc || b2bAcc;
        firstName = masterInfo.firstName || firstName;
        lastName = masterInfo.lastName || lastName;
        if (masterInfo.accountNo && !accountNo) {
          accountNo = masterInfo.accountNo;
        }
      }

      // Default dates
      let formattedDate = this.formatDateYYYYMMDD(txnDate);
      if (!formattedDate && this.transDateInput.value) {
        formattedDate = this.formatDateYYYYMMDD(this.transDateInput.value);
      }
      let formattedValueDate = this.formatDateYYYYMMDD(valueDate) || formattedDate;

      // Determine Transaction Type and Description
      let targetTxnType = this.txnTypeSelect.value || "AW";
      let description = narration;
      let remark = this.remarkInput.value || "NoN TAX";
      let cleanAmount = parseFloat(String(amtInTransCurr || "0").replace(/,/g, ""));
      let amountFormatted = isNaN(cleanAmount) ? "0.00" : cleanAmount.toFixed(2);

      if (txnCode.toUpperCase().includes("DEPDIV") || narration.toLowerCase().includes("dividend")) {
        // Dividend handling
        targetTxnType = "AW"; // Default Adjust Dividend Tax
        // Check if VAT / Tax is 0 -> Non TAX
        const vatNum = parseFloat(String(vatAmount || "0").replace(/,/g, ""));
        if (isNaN(vatNum) || vatNum === 0) {
          remark = "NoN TAX";
          amountFormatted = "0.00";
        } else {
          remark = "WHT TAX";
          amountFormatted = vatNum.toFixed(2);
        }

        // Construct description if needed
        if (shares && narration.includes("dividend per share")) {
          const matchSym = narration.match(/:\s*([A-Za-z0-9]+)\s*\(([^)]+)\)/);
          const symbol = matchSym ? matchSym[1] : "";
          const isin = matchSym ? matchSym[2] : "";
          const shareFormatted = parseFloat(shares).toFixed(8);
          description = `Tax on Cash Dividends for ${shareFormatted} shares of ${symbol} (${isin}) @ 0.00000000% tax rate, On ${txnDate || formattedDate}`;
        }
      } else if (txnCode.toUpperCase() === "CD" || narration.toLowerCase().includes("cash deposit")) {
        targetTxnType = "CD";
        description = "Cash Deposit";
        remark = "";
      } else if (txnCode.toUpperCase() === "CW" || narration.toLowerCase().includes("cash withdrawal")) {
        targetTxnType = "CW";
        description = "Cash Withdrawal";
        remark = "";
      } else if (txnCode.toUpperCase() === "CCA" || narration.toLowerCase().includes("convert currency")) {
        targetTxnType = "CCA";
        description = "Convert Currency (Add)";
        remark = "";
      }

      // Format CCY (exactly 3 characters uppercase)
      const ccy3 = (currency || "THB").trim().toUpperCase().substring(0, 3);

      const rowObj = {
        no: String(this.processedRows.length + newRows.length + 1),
        accountNo: accountNo || "",
        subAccountNo: accountNo || "",
        b2bCode: "GTN",
        b2bAccountNo: b2bAcc || "ASI374219405",
        b2bSubAccountNo: accountNo || "",
        firstName: firstName || "",
        lastName: lastName || "",
        transDate: formattedDate,
        effectiveDate: formattedDate,
        valueDate: formattedValueDate,
        txnType: targetTxnType,
        description: description || narration || "",
        companyCode: "",
        format: "",
        ccy: ccy3,
        fcdAccount: "",
        amount: amountFormatted,
        bankCharge: "",
        ccyPurchase: "",
        fcdAccountPurchase: "",
        amountPurchase: "",
        bankChargePurchase: "",
        fxRate: "",
        fxCcy: "",
        refNo: transactionId || "",
        status: "A",
        remark: remark
      };

      newRows.push(rowObj);
    });

    this.processedRows = [...this.processedRows, ...newRows];
    this.renumberRows();
    this.renderTable();
    this.showToast(`ประมวลผลไฟล์ ${sourceName} สำเร็จ (${newRows.length} แถว)`, "success");
  }

  renumberRows() {
    this.processedRows.forEach((r, idx) => {
      r.no = String(idx + 1);
    });
  }

  renderTable() {
    if (this.processedRows.length === 0) {
      this.tableBody.innerHTML = "";
      this.emptyState.style.display = "flex";
      this.rowCountBadge.textContent = "0 รายการ";
      this.exportXlsxBtn.disabled = true;
      this.exportXlsBtn.disabled = true;
      return;
    }

    this.emptyState.style.display = "none";
    this.exportXlsxBtn.disabled = false;
    this.exportXlsBtn.disabled = false;
    this.rowCountBadge.textContent = `${this.processedRows.length} รายการ`;

    let html = "";
    this.processedRows.forEach((row, rowIndex) => {
      html += `<tr>`;
      CQ_COLUMNS.forEach((col) => {
        const val = row[col.key] || "";
        html += `<td class="${col.cssClass}">
          <input type="text" value="${this.escapeHtml(val)}" 
                 data-row="${rowIndex}" data-col="${col.key}" 
                 onchange="window.cqApp.handleCellEdit(this)"
                 onblur="window.cqApp.handleCellEdit(this)" />
        </td>`;
      });
      html += `<td class="col-action" style="text-align:center;">
        <button class="btn btn-secondary btn-sm" onclick="window.cqApp.deleteRow(${rowIndex})" title="ลบแถว">✕</button>
      </td>`;
      html += `</tr>`;
    });

    this.tableBody.innerHTML = html;
  }

  handleCellEdit(inputElem) {
    const rowIdx = parseInt(inputElem.getAttribute("data-row"));
    const colKey = inputElem.getAttribute("data-col");
    if (this.processedRows[rowIdx]) {
      let val = inputElem.value;

      // Enforce CCY 3 chars uppercase
      if (colKey === "ccy" || colKey === "ccyPurchase") {
        val = val.trim().toUpperCase().substring(0, 3);
        inputElem.value = val;
      }
      // Enforce Amount .00
      else if (colKey === "amount" || colKey === "amountPurchase") {
        if (val !== "") {
          const num = parseFloat(String(val).replace(/,/g, ""));
          val = isNaN(num) ? "0.00" : num.toFixed(2);
          inputElem.value = val;
        }
      }

      this.processedRows[rowIdx][colKey] = val;
      
      // Auto-update linked fields if accountNo changed
      if (colKey === "accountNo") {
        const acc = inputElem.value;
        this.processedRows[rowIdx].subAccountNo = acc;
        this.processedRows[rowIdx].b2bSubAccountNo = acc;
        if (this.customerMaster[acc]) {
          this.processedRows[rowIdx].b2bAccountNo = this.customerMaster[acc].b2bAcc || this.processedRows[rowIdx].b2bAccountNo;
          this.processedRows[rowIdx].firstName = this.customerMaster[acc].firstName || this.processedRows[rowIdx].firstName;
          this.processedRows[rowIdx].lastName = this.customerMaster[acc].lastName || this.processedRows[rowIdx].lastName;
        }
        this.renderTable();
      }
    }
  }

  deleteRow(index) {
    this.processedRows.splice(index, 1);
    this.renumberRows();
    this.renderTable();
  }

  addNewRow() {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const newRow = {};
    CQ_COLUMNS.forEach(c => {
      newRow[c.key] = c.default;
    });
    newRow.no = String(this.processedRows.length + 1);
    newRow.transDate = today;
    newRow.effectiveDate = today;
    newRow.valueDate = today;
    newRow.amount = "0.00";
    newRow.ccy = "THB";
    this.processedRows.push(newRow);
    this.renderTable();
  }

  clearData() {
    if (this.processedRows.length > 0 && confirm("คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?")) {
      this.processedRows = [];
      this.renderTable();
      this.showToast("ล้างข้อมูลเรียบร้อย", "info");
    }
  }

  exportExcel(format = "xlsx") {
    if (this.processedRows.length === 0) {
      this.showToast("ไม่มีข้อมูลสำหรับส่งออก", "error");
      return;
    }

    // Determine target Date for filename
    let dateForName = this.processedRows[0].transDate || new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = `CashTransaction_${dateForName}.${format}`;

    // Prepare Sheet Data
    const sheetData = [];
    // Header Row
    const headerRow = CQ_COLUMNS.map(c => c.label);
    sheetData.push(headerRow);

    // Data Rows
    this.processedRows.forEach(row => {
      const r = CQ_COLUMNS.map(c => {
        let val = row[c.key];
        if (c.key === "amount" || c.key === "amountPurchase") {
          if (val === "" || val === undefined || val === null) return "";
          const num = parseFloat(String(val).replace(/,/g, ""));
          return isNaN(num) ? 0 : Number(num.toFixed(2));
        }
        if (c.key === "fxRate") {
          if (val === "" || val === undefined || val === null) return "";
          const num = parseFloat(val);
          return isNaN(num) ? val : num;
        }
        if (c.key === "ccy" || c.key === "ccyPurchase") {
          return val ? String(val).trim().toUpperCase().substring(0, 3) : "";
        }
        if (c.key === "no") {
          return parseInt(val) || val;
        }
        return val !== undefined && val !== null ? String(val) : "";
      });
      sheetData.push(r);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Apply number format to Amount and Amount Purchase cells
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = 1; R <= range.e.r; ++R) {
      // Col 17 (Amount - Col R)
      const cellRefR = XLSX.utils.encode_cell({ r: R, c: 17 });
      if (ws[cellRefR] && typeof ws[cellRefR].v === "number") {
        ws[cellRefR].z = "0.00";
      }
      // Col 21 (Amount Purchase - Col V)
      const cellRefV = XLSX.utils.encode_cell({ r: R, c: 21 });
      if (ws[cellRefV] && typeof ws[cellRefV].v === "number") {
        ws[cellRefV].z = "0.00";
      }
    }

    // Set Column widths
    const colWidths = [
      { wch: 6 },  // No
      { wch: 14 }, // Account No
      { wch: 14 }, // Sub Account No
      { wch: 10 }, // B2B Code
      { wch: 16 }, // B2B Account No
      { wch: 16 }, // B2B Sub Account No
      { wch: 18 }, // First Name
      { wch: 20 }, // Last Name
      { wch: 12 }, // Trans Date
      { wch: 14 }, // Effective Date
      { wch: 12 }, // Value Date
      { wch: 16 }, // Transaction Type
      { wch: 45 }, // Description
      { wch: 14 }, // Company Code
      { wch: 10 }, // Format
      { wch: 8 },  // CCY
      { wch: 14 }, // FCD Account
      { wch: 16 }, // Amount
      { wch: 12 }, // Bank Charge
      { wch: 14 }, // CCY Purchase
      { wch: 20 }, // FCD Account Purchase
      { wch: 16 }, // Amount Purchase
      { wch: 18 }, // Bank Charge Purchase
      { wch: 12 }, // FX Rate
      { wch: 12 }, // FX CCY
      { wch: 18 }, // Ref No
      { wch: 8 },  // Status
      { wch: 14 }  // Remark
    ];
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, filename, { bookType: format });
    this.showToast(`สร้างไฟล์ ${filename} เรียบร้อยแล้ว`, "success");
  }

  // Customer Master UI
  renderMasterTable() {
    let html = "";
    Object.keys(this.customerMaster).forEach(acc => {
      const info = this.customerMaster[acc];
      html += `<tr>
        <td><input type="text" class="master-acc" value="${this.escapeHtml(acc)}" /></td>
        <td><input type="text" class="master-b2b" value="${this.escapeHtml(info.b2bAcc || '')}" /></td>
        <td><input type="text" class="master-fname" value="${this.escapeHtml(info.firstName || '')}" /></td>
        <td><input type="text" class="master-lname" value="${this.escapeHtml(info.lastName || '')}" /></td>
        <td style="text-align:center;"><button class="btn btn-secondary btn-sm" onclick="this.closest('tr').remove()">✕</button></td>
      </tr>`;
    });
    this.masterTableBody.innerHTML = html;
  }

  addMasterTableRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" class="master-acc" placeholder="Account No (เช่น 800001)" /></td>
      <td><input type="text" class="master-b2b" placeholder="ASI Account No" value="ASI374219405" /></td>
      <td><input type="text" class="master-fname" placeholder="ชื่อ" /></td>
      <td><input type="text" class="master-lname" placeholder="นามสกุล" /></td>
      <td style="text-align:center;"><button class="btn btn-secondary btn-sm" onclick="this.closest('tr').remove()">✕</button></td>
    `;
    this.masterTableBody.appendChild(tr);
  }

  saveMasterFromUI() {
    const newMaster = {};
    const rows = this.masterTableBody.querySelectorAll("tr");
    rows.forEach(r => {
      const acc = r.querySelector(".master-acc")?.value.trim();
      const b2b = r.querySelector(".master-b2b")?.value.trim();
      const fname = r.querySelector(".master-fname")?.value.trim();
      const lname = r.querySelector(".master-lname")?.value.trim();
      if (acc) {
        newMaster[acc] = { b2bAcc: b2b, firstName: fname, lastName: lname };
      }
    });
    this.customerMaster = newMaster;
    this.saveCustomerMaster();
    this.masterModal.style.display = "none";
    this.showToast("บันทึก Customer Master เรียบร้อยแล้ว", "success");
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.cqApp = new CashTransactionManager();
});
