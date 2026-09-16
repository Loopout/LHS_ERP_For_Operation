/**
 * Node.js CLI Script for CashTransaction Reformat & CQ Excel Export
 * Usage: node export_cashtransaction.js [input_csv_or_zip_or_dir] [output_dir]
 */

const fs = require('fs');
const path = require('path');

// Check if local xlsx is available or require it
let XLSX;
try {
  XLSX = require('./js/xlsx.full.min.js');
} catch (e) {
  try {
    XLSX = require('xlsx');
  } catch (err) {
    console.error('Error: SheetJS (xlsx) library not found.');
    process.exit(1);
  }
}

const DEFAULT_CUSTOMER_MASTER = {
  "800001": { b2bAcc: "ASI374219405", firstName: "มานะ", lastName: "เอื้ออภิสิทธิ์" },
  "012147": { b2bAcc: "ASI374219405", firstName: "PEI-FEN", lastName: "CHE" },
  "001754": { b2bAcc: "ASI374219405", firstName: "อนันต์", lastName: "จิตตวานิชย์" },
  "800005": { b2bAcc: "ASI374219405", firstName: "พัศวีร์", lastName: "อัศวกิจ" },
  "ASI672238444": { b2bAcc: "ASI374219405", firstName: "มานะ", lastName: "เอื้ออภิสิทธิ์", accountNo: "800001" }
};

const CQ_COLUMNS = [
  { key: "no", label: "No", default: "" },
  { key: "accountNo", label: "Account No", default: "" },
  { key: "subAccountNo", label: "Sub Account No", default: "" },
  { key: "b2bCode", label: "B2B Code", default: "GTN" },
  { key: "b2bAccountNo", label: "B2B Account No", default: "ASI374219405" },
  { key: "b2bSubAccountNo", label: "B2B Sub Account No", default: "" },
  { key: "firstName", label: "First Name", default: "" },
  { key: "lastName", label: "Last Name", default: "" },
  { key: "transDate", label: "Trans Date", default: "" },
  { key: "effectiveDate", label: "Effective Date", default: "" },
  { key: "valueDate", label: "Value Date", default: "" },
  { key: "txnType", label: "Transaction Type", default: "AW" },
  { key: "description", label: "Description", default: "" },
  { key: "companyCode", label: "Company Code", default: "" },
  { key: "format", label: "Format", default: "" },
  { key: "ccy", label: "CCY", default: "THB" },
  { key: "fcdAccount", label: "FCD Account", default: "" },
  { key: "amount", label: "Amount", default: "0" },
  { key: "bankCharge", label: "Bank Charge", default: "" },
  { key: "ccyPurchase", label: "CCY Purchase", default: "" },
  { key: "fcdAccountPurchase", label: "FCD Account Purchase", default: "" },
  { key: "amountPurchase", label: "Amount Purchase", default: "" },
  { key: "bankChargePurchase", label: "Bank Charge Purchase", default: "" },
  { key: "fxRate", label: "FX Rate", default: "" },
  { key: "fxCcy", label: "FX CCY", default: "" },
  { key: "refNo", label: "Ref No", default: "" },
  { key: "status", label: "Status", default: "A" },
  { key: "remark", label: "Remark", default: "NoN TAX" }
];

function parseCsv(text) {
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
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell.length > 0)) lines.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) lines.push(currentRow);
  }
  return lines;
}

function formatDateYYYYMMDD(dateStr) {
  if (!dateStr) return "";
  const str = dateStr.trim().replace(/[-/ :]/g, "");
  return str.length >= 8 ? str.substring(0, 8) : dateStr;
}

function convertCsvToCq(csvContent) {
  const rows = parseCsv(csvContent);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().trim());
  const dataRows = rows.slice(1);

  const getCol = (row, colName) => {
    const idx = headers.indexOf(colName.toLowerCase());
    return idx >= 0 && idx < row.length ? row[idx] : "";
  };

  const results = [];

  dataRows.forEach((r, idx) => {
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
    const shares = getCol(r, "eligible_shares");

    let accountNo = externalRefNo;
    let b2bAcc = "ASI374219405";
    let firstName = "";
    let lastName = "";

    const masterInfo = DEFAULT_CUSTOMER_MASTER[accountNo] || DEFAULT_CUSTOMER_MASTER[customerNo];
    if (masterInfo) {
      b2bAcc = masterInfo.b2bAcc || "ASI374219405";
      firstName = masterInfo.firstName || firstName;
      lastName = masterInfo.lastName || lastName;
      if (masterInfo.accountNo && !accountNo) accountNo = masterInfo.accountNo;
    }

    const formattedDate = formatDateYYYYMMDD(txnDate);
    const formattedValueDate = formatDateYYYYMMDD(valueDate) || formattedDate;

    let targetTxnType = "AW";
    let description = narration;
    let remark = "NoN TAX";
    let cleanAmount = parseFloat(String(amtInTransCurr || "0").replace(/,/g, ""));
    let amountNum = isNaN(cleanAmount) ? 0 : Number(cleanAmount.toFixed(2));

    if (txnCode.toUpperCase().includes("DEPDIV") || narration.toLowerCase().includes("dividend")) {
      targetTxnType = "AW";
      const vatNum = parseFloat(String(vatAmount || "0").replace(/,/g, ""));
      if (isNaN(vatNum) || vatNum === 0) {
        remark = "NoN TAX";
        amountNum = 0;
      } else {
        remark = "WHT TAX";
        amountNum = Number(vatNum.toFixed(2));
      }

      if (shares && narration.includes("dividend per share")) {
        const matchSym = narration.match(/:\s*([A-Za-z0-9]+)\s*\(([^)]+)\)/);
        const symbol = matchSym ? matchSym[1] : "";
        const isin = matchSym ? matchSym[2] : "";
        const shareFormatted = parseFloat(shares).toFixed(8);
        description = `Tax on Cash Dividends for ${shareFormatted} shares of ${symbol} (${isin}) @ 0.00000000% tax rate, On ${txnDate || formattedDate}`;
      }
    } else if (txnCode.toUpperCase() === "CD") {
      targetTxnType = "CD";
      description = "Cash Deposit";
      remark = "";
    } else if (txnCode.toUpperCase() === "CW") {
      targetTxnType = "CW";
      description = "Cash Withdrawal";
      remark = "";
    } else if (txnCode.toUpperCase() === "CCA") {
      targetTxnType = "CCA";
      description = "Convert Currency (Add)";
      remark = "";
    }

    const ccy3 = (currency || "THB").trim().toUpperCase().substring(0, 3);

    results.push({
      no: idx + 1,
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
      amount: amountNum,
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
    });
  });

  return results;
}

function exportToExcel(records, outputPath) {
  const headerRow = CQ_COLUMNS.map(c => c.label);
  const dataRows = records.map(r => CQ_COLUMNS.map(c => {
    let val = r[c.key];
    if (c.key === "amount" || c.key === "amountPurchase") {
      if (val === "" || val === undefined || val === null) return "";
      const num = parseFloat(String(val).replace(/,/g, ""));
      return isNaN(num) ? 0 : Number(num.toFixed(2));
    }
    if (c.key === "ccy" || c.key === "ccyPurchase") {
      return val ? String(val).trim().toUpperCase().substring(0, 3) : "";
    }
    return val !== undefined ? val : "";
  }));
  const sheetData = [headerRow, ...dataRows];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Apply number format to Amount and Amount Purchase cells
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = 1; R <= range.e.r; ++R) {
    const cellRefR = XLSX.utils.encode_cell({ r: R, c: 17 });
    if (ws[cellRefR] && typeof ws[cellRefR].v === "number") {
      ws[cellRefR].z = "0.00";
    }
    const cellRefV = XLSX.utils.encode_cell({ r: R, c: 21 });
    if (ws[cellRefV] && typeof ws[cellRefV].v === "number") {
      ws[cellRefV].z = "0.00";
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, outputPath);
  console.log(`Successfully exported: ${outputPath} (${records.length} records)`);
}

// Main execution
const inputTarget = process.argv[2] || 's:/Global_T/Customer_F_CQ_Excel/08/2026_08_28_reports/2026_08_28_cash_transaction_data.csv';
const outputDir = process.argv[3] || path.dirname(inputTarget);

if (fs.existsSync(inputTarget)) {
  const csvContent = fs.readFileSync(inputTarget, 'utf8');
  const records = convertCsvToCq(csvContent);
  if (records.length > 0) {
    const dateStr = records[0].transDate || "output";
    const outputFile = path.join(outputDir, `CashTransaction_${dateStr}.xlsx`);
    exportToExcel(records, outputFile);
  } else {
    console.log("No records found to export.");
  }
} else {
  console.error(`Target not found: ${inputTarget}`);
}
