// LHSEC Mutual Fund Allocation Email Dispatcher - Pure Web Standalone Controller (No PowerShell)
// Supports Template OPS-ALLOT-001 (from Markdown.md), 4-Category Allotment, and Waiting NAV

const DEFAULT_CONTACTS = [
  {
    icLicense: "028464",
    name: "Pitchaya Khaoseang",
    thaiName: "คุณพิชญา ขาวแสง",
    email: "pitchaya.k@lhsec.co.th",
    cc: "karnrawee.s@lhsec.co.th; groupoperation@lhsec.co.th",
    department: "Wealth Management / Marketing"
  },
  {
    icLicense: "061692",
    name: "Marketing Officer 061692",
    thaiName: "คุณเจ้าหน้าที่การตลาด (061692)",
    email: "marketing061692@lhsec.co.th",
    cc: "karnrawee.s@lhsec.co.th; groupoperation@lhsec.co.th",
    department: "Wealth Management / Marketing"
  },
  {
    icLicense: "018281",
    name: "Marketing Officer 018281",
    thaiName: "คุณเจ้าหน้าที่การตลาด (018281)",
    email: "marketing018281@lhsec.co.th",
    cc: "karnrawee.s@lhsec.co.th; groupoperation@lhsec.co.th",
    department: "Wealth Management / Marketing"
  },
  {
    icLicense: "009202",
    name: "Marketing Officer 009202",
    thaiName: "คุณเจ้าหน้าที่การตลาด (009202)",
    email: "marketing009202@lhsec.co.th",
    cc: "karnrawee.s@lhsec.co.th; groupoperation@lhsec.co.th",
    department: "Wealth Management / Marketing"
  },
  {
    icLicense: "026905",
    name: "Marketing Officer 026905",
    thaiName: "คุณเจ้าหน้าที่การตลาด (026905)",
    email: "marketing026905@lhsec.co.th",
    cc: "karnrawee.s@lhsec.co.th; groupoperation@lhsec.co.th",
    department: "Wealth Management / Marketing"
  }
];

const SAMPLE_ALLOTTED_TRANSACTIONS_TXT = `20260911|LHS|27|V3.0
STT005-C2CEX1V6JL|20260910093543|012265-1|KTAM|68400000111||SUB|KT-S&P500-A|N|Y||70000.00||20260910|||ATS_SA|073|8892410152|||061692||MOB|N||||||2532609100008315|ALLOTTED|684026000044|20260911|14.0157|70000.00|4994.3991|325.34|9.76|22.77|74.42|0||||073|8891012261|||||0054|0||20260910|||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2CEXH4VW9|20260910093608|012265-1|KTAM|68400000111||SUB|KT-NASDAQ-A|N|Y||30000.00||20260910|||ATS_SA|073|8892410152|||061692||MOB|N||||||2532609100008316|ALLOTTED|684026000045|20260911|14.6762|30000.00|2044.1258|0|0|0|32.09|0||||073|8891012261|||||0054|0||20260910|||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2CF841H9L|20260910094652|001760-1|KTAM|68400000013||RED|KT-OIL|N|N|UNIT||7597.0523|20260910|||ATS_SA|073|0012040552|||028464||MOB|N||||||2532609100008317|ALLOTTED|684026000046|20260911|7.2713|55240.45|7597.0523|0|0|0|0|0|20260914||Y|014|0493112555|||||9019|0||20260910|||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911093322|007459-1|LHFUND|250010000711||SUB|LHMM-A|N|N||12667.60||20260911|||ATS_SA|073|1052045447|||063926|0019|MKT|N||||||2532609110003192|ALLOTTED|00026294256|20260911|12.4124|12667.60|1020.5600|0|0|0|0|0||||073|8891013615|||||0210|0||20260911|||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2DTVS7W9D|20260911123802|011826-1|LHFUND|250010001644||SUB|LHSUPERAI|N|Y||258000.00||20260911|||ATS_SA|073|0122005249|||028464||MOB|N||||||2532609110010821|WAITING|00026295054|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911124344|011866-1|LHFUND|250010001768||SUB|LHSUPERAI|N|N||430000.00||20260911|||ATS_SA|073|0012057366|||028464|0001|MKT|N||||||2532609110010822|WAITING|00026295070|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2DUAT1UGX|20260911125310|011825-1|LHFUND|250010001661||SUB|LHSUPERAI|N|Y||430000.00||20260911|||ATS_SA|073|0032002372|||028464||MOB|N||||||2532609110011759|WAITING|00026295081|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2DUSH7TX5|20260911131059|011829-1|LHFUND|250010001555||SUB|LHSUPERAI|N|Y||493000.00||20260911|||ATS_SA|073|8012707987|||028464||MOB|N||||||2532609110011760|WAITING|00026295102|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2DV2NT969|20260911132115|001760-1|LHFUND|250010001580||SUB|LHASIASEMICON|N|Y||300000.00||20260911|||ATS_SA|073|0012040552|||028464||MOB|N||||||2532609110011761|WAITING|00026295127|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911133747|001760-1|LHFUND|250010001580||SUB|LHCOPPER|N|N||200000.00||20260911|||ATS_SA|073|0012040552|||028464|0001|MKT|N||||||2532609110011762|WAITING|00026295153|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911134438|011839-1|LHFUND|250010001610||SUB|LHSUPERAI|Y|N||466000.00||20260911|||ATS_SA|073|0012165370|||028464|0001|MKT|N||||||2532609110011763|WAITING|00026295166|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911134510|011838-1|LHFUND|250010001679||SUB|LHSUPERAI|N|N||932000.00||20260911|||ATS_SA|014|8162367435|||028464|0001|MKT|N||||||2532609110012557|WAITING|00026295167|||||0|0|0|0|0||||014|2273014466|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2DVQJ2WA9|20260911134518|010304-1|LHFUND|250010001806||SUB|LHSUPERAI|Y|Y||89000.00||20260911|||ATS_SA|025|3671253638|||028464||MOB|N||||||2532609110012558|WAITING|00026295169|||||0|0|0|0|0||||025|5390001055|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911134546|011852-1|LHFUND|250010001709||SUB|LHSUPERAI|N|N||258000.00||20260911|||ATS_SA|073|0122019027|||028464|0001|MKT|N||||||2532609110012559|WAITING|00026295172|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911134635|011823-1|LHFUND|250010001628||SUB|LHSUPERAI|N|N||430000.00||20260911|||ATS_SA|073|0022051767|||028464|0001|MKT|N||||||2532609110012560|WAITING|00026295175|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911134712|011840-1|LHFUND|250010001652||SUB|LHSUPERAI|N|N||430000.00||20260911|||ATS_SA|073|0022042251|||028464|0001|MKT|N||||||2532609110012561|WAITING|00026295176|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911134740|011854-1|LHFUND|250010001717||SUB|LHSUPERAI|N|N||258000.00||20260911|||ATS_SA|073|0022042237|||028464|0001|MKT|N||||||2532609110012562|WAITING|00026295177|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911134813|011846-1|LHFUND|250010001733||SUB|LHSUPERAI|N|N||162000.00||20260911|||ATS_SA|073|0022099369|||028464|0001|MKT|N||||||2532609110012563|WAITING|00026295178|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911134840|011831-1|LHFUND|250010001598||SUB|LHSUPERAI|N|N||172000.00||20260911|||ATS_SA|073|0012127141|||028464|0001|MKT|N||||||2532609110012564|WAITING|00026295179|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911135043|011841-1|LHFUND|250010001601||SUB|LHSUPERAI|N|N||258000.00||20260911|||ATS_SA|073|0012134431|||028464|0001|MKT|N||||||2532609110012565|WAITING|00026295180|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2DVZ45IXD|20260911135357|007229-1|LHFUND|250010001571||SUB|LHSUPERAI|N|Y||154000.00||20260911|||ATS_SA|073|0012135861|||028464||MOB|N||||||2532609110012566|WAITING|00026295183|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2DW188BDL|20260911135605|011827-1|LHFUND|250010001563||SUB|LHSUPERAI|N|Y||300000.00||20260911|||ATS_SA|073|0122003910|||028464||MOB|N||||||2532609110012567|WAITING|00026295188|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911140040|011853-1|LHFUND|250010001725||SUB|LHSUPERAI|N|N||365000.00||20260911|||ATS_SA|073|0122005927|||028464|0001|MKT|N||||||2532609110012800|WAITING|00026295193|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
STT005-C2DWQJFRRD|20260911142135|011832-1|LHFUND|250010001636||SUB|LHSUPERAI|N|Y||100000.00||20260911|||ATS_SA|073|0022067305|||028464||MOB|N||||||2532609110012801|WAITING|00026295218|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911143727|001760-1|LHFUND|250010001580||SUB|LHDRAM-AI|N|N||300000.00||20260911|||ATS_SA|073|0012040552|||028464|0001|MKT|N||||||2532609110012802|WAITING|00026295233|||||0|0|0|0|0||||073|8891013615|||||9019||||||||||||||THB||0||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260910074650|004950-1|SCBAM|000010811595||SUB|SCBS&P500|N|N||2000.00||20260910||||||||026905||MKT|N||||||2532609140009835|ALLOTTED|2026-09-10-07.46.50.739384|20260911|28.9095|2000.00|69.1814|9.29||0.65|0.89|0||O||||||||0177|||20260910|||||||||||THB||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|20260911091516|004950-1|SCBAM|000010811595||SUB|SCBCEH|N|N||2000.00||20260911||||||||026905||MKT|N||||||2532609140009836|ALLOTTED|2026-09-11-09.15.16.258362|20260911|8.1566|2000.00|245.2002|9.28||0.65|1.59|0||O||||||||0177|||20260911|||||||||||THB||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||`;

const SAMPLE_RECORDS = [
  { "Result": "Done", "FCN Trans No": "25326081700000001", "SA Order Ref. No": "STT005-001580", "Trans Type": "SE", "Trans Date": "14/08/2026", "Unitholder ID": "250010001580", "Account No": "001580", "Name": "นาง พิมพา ลดาวัลย์", "AMC Code": "LH", "Unit Symbol": "LHGEQ-A", "Amount": "50000.00", "Allotted Amount": "50000.00", "Unit": "3846.1538", "Allotted Unit": "3846.1538", "Allotted NAV": "13.0000", "Payment Date (SE)": "19/08/2026", "Status": "Done", "IC License": "028464", "TimeStamp": "14/08/2026 09:15:22" },
  { "Result": "Done", "FCN Trans No": "25326081700000002", "SA Order Ref. No": "STT005-001581", "Trans Type": "BU", "Trans Date": "14/08/2026", "Unitholder ID": "250010001581", "Account No": "001581", "Name": "นาย สมชาย มีทรัพย์", "AMC Code": "SCB", "Unit Symbol": "SCBDV", "Amount": "100000.00", "Allotted Amount": "100000.00", "Unit": "7407.4074", "Allotted Unit": "7407.4074", "Allotted NAV": "13.5000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "028464", "TimeStamp": "14/08/2026 10:20:15" },
  { "Result": "Done", "FCN Trans No": "25326081700000003", "SA Order Ref. No": "STT005-001582", "Trans Type": "SO", "Trans Date": "14/08/2026", "Unitholder ID": "250010001582", "Account No": "001582", "Name": "น.ส. กัญญารัตน์ รุ่งเรือง", "AMC Code": "KTAM", "Unit Symbol": "KT-ENERGY", "Amount": "35000.00", "Allotted Amount": "35000.00", "Unit": "2500.0000", "Allotted Unit": "2500.0000", "Allotted NAV": "14.0000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "028464", "TimeStamp": "14/08/2026 11:05:40" },
  { "Result": "Done", "FCN Trans No": "25326081700000004", "SA Order Ref. No": "STT005-001583", "Trans Type": "SI", "Trans Date": "14/08/2026", "Unitholder ID": "250010001582", "Account No": "001582", "Name": "น.ส. กัญญารัตน์ รุ่งเรือง", "AMC Code": "KTAM", "Unit Symbol": "KT-GOLD", "Amount": "35000.00", "Allotted Amount": "35000.00", "Unit": "1750.0000", "Allotted Unit": "1750.0000", "Allotted NAV": "20.0000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "028464", "TimeStamp": "14/08/2026 11:05:41" },
  { "Result": "Done", "FCN Trans No": "25326081700000005", "SA Order Ref. No": "STT005-001584", "Trans Type": "BU", "Trans Date": "14/08/2026", "Unitholder ID": "250010001584", "Account No": "001584", "Name": "นาย กิตติศักดิ์ ชัยชนะ", "AMC Code": "KFIN", "Unit Symbol": "KF-GTECH", "Amount": "250000.00", "Allotted Amount": "250000.00", "Unit": "16666.6667", "Allotted Unit": "16666.6667", "Allotted NAV": "15.0000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "061692", "TimeStamp": "14/08/2026 11:30:10" },
  { "Result": "Done", "FCN Trans No": "25326081700000006", "SA Order Ref. No": "STT005-001585", "Trans Type": "SE", "Trans Date": "14/08/2026", "Unitholder ID": "250010001585", "Account No": "001585", "Name": "นาง ศิริพร พานิชย์", "AMC Code": "ONE", "Unit Symbol": "ONE-UGG-RA", "Amount": "80000.00", "Allotted Amount": "80000.00", "Unit": "4000.0000", "Allotted Unit": "4000.0000", "Allotted NAV": "20.0000", "Payment Date (SE)": "20/08/2026", "Status": "Done", "IC License": "061692", "TimeStamp": "14/08/2026 13:14:02" },
  { "Result": "Done", "FCN Trans No": "25326081700000007", "SA Order Ref. No": "STT005-001586", "Trans Type": "BU", "Trans Date": "14/08/2026", "Unitholder ID": "250010001586", "Account No": "001586", "Name": "นาย วีระ วรเวช", "AMC Code": "PRINCIPAL", "Unit Symbol": "PRINCIPAL-iPROP", "Amount": "120000.00", "Allotted Amount": "120000.00", "Unit": "10000.0000", "Allotted Unit": "10000.0000", "Allotted NAV": "12.0000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "018281", "TimeStamp": "14/08/2026 13:45:50" },
  { "Result": "Done", "FCN Trans No": "25326081700000008", "SA Order Ref. No": "STT005-001587", "Trans Type": "SE", "Trans Date": "14/08/2026", "Unitholder ID": "250010001587", "Account No": "001587", "Name": "คุณ นภาพร สุขสมบูรณ์", "AMC Code": "TMBAM", "Unit Symbol": "TMB-ES-CHINA", "Amount": "45000.00", "Allotted Amount": "45000.00", "Unit": "5000.0000", "Allotted Unit": "5000.0000", "Allotted NAV": "9.0000", "Payment Date (SE)": "19/08/2026", "Status": "Done", "IC License": "018281", "TimeStamp": "14/08/2026 14:10:00" },
  { "Result": "Done", "FCN Trans No": "25326081700000009", "SA Order Ref. No": "STT005-001588", "Trans Type": "BU", "Trans Date": "14/08/2026", "Unitholder ID": "250010001588", "Account No": "001588", "Name": "นาย ธนาคาร มั่นคง", "AMC Code": "UOBAM", "Unit Symbol": "UOBEQ", "Amount": "300000.00", "Allotted Amount": "300000.00", "Unit": "20000.0000", "Allotted Unit": "20000.0000", "Allotted NAV": "15.0000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "009202", "TimeStamp": "14/08/2026 14:30:18" },
  { "Result": "Done", "FCN Trans No": "25326081700000010", "SA Order Ref. No": "STT005-001589", "Trans Type": "SE", "Trans Date": "14/08/2026", "Unitholder ID": "250010001589", "Account No": "001589", "Name": "นางสาว รัชนี บุญมี", "AMC Code": "KSAM", "Unit Symbol": "KF-HEALTH", "Amount": "60000.00", "Allotted Amount": "60000.00", "Unit": "3000.0000", "Allotted Unit": "3000.0000", "Allotted NAV": "20.0000", "Payment Date (SE)": "21/08/2026", "Status": "Done", "IC License": "009202", "TimeStamp": "14/08/2026 14:55:00" },
  { "Result": "Done", "FCN Trans No": "25326081700000011", "SA Order Ref. No": "STT005-001590", "Trans Type": "BU", "Trans Date": "14/08/2026", "Unitholder ID": "250010001590", "Account No": "001590", "Name": "นาย เอกชัย เกียรติกุล", "AMC Code": "LH", "Unit Symbol": "LH-USA-A", "Amount": "150000.00", "Allotted Amount": "150000.00", "Unit": "7500.0000", "Allotted Unit": "7500.0000", "Allotted NAV": "20.0000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "026905", "TimeStamp": "14/08/2026 15:10:20" },
  { "Result": "Done", "FCN Trans No": "25326081700000012", "SA Order Ref. No": "STT005-001591", "Trans Type": "SO", "Trans Date": "14/08/2026", "Unitholder ID": "250010001591", "Account No": "001591", "Name": "นาง วรรณา สว่างใจ", "AMC Code": "SCB", "Unit Symbol": "SCBSET50", "Amount": "70000.00", "Allotted Amount": "70000.00", "Unit": "7000.0000", "Allotted Unit": "7000.0000", "Allotted NAV": "10.0000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "026905", "TimeStamp": "14/08/2026 15:25:33" },
  { "Result": "Done", "FCN Trans No": "25326081700000013", "SA Order Ref. No": "STT005-001592", "Trans Type": "SI", "Trans Date": "14/08/2026", "Unitholder ID": "250010001591", "Account No": "001591", "Name": "นาง วรรณา สว่างใจ", "AMC Code": "SCB", "Unit Symbol": "SCBGLOBAL", "Amount": "70000.00", "Allotted Amount": "70000.00", "Unit": "5000.0000", "Allotted Unit": "5000.0000", "Allotted NAV": "14.0000", "Payment Date (SE)": "-", "Status": "Done", "IC License": "026905", "TimeStamp": "14/08/2026 15:25:34" }
];

const AppState = {
  contacts: [],
  records: [],
  groupedByIc: {},
  selectedIcs: new Set(),
  emailMode: 'ops_allot', // 'ops_allot' | 'allocated' | 'waiting'
  refDate: '',
  cutoffTime: '14:00',
  folderPath: 'LoopOut',
  reportName: 'Reconcile Daily Confirmed Transaction (V1.0.0)',
  senderName: 'Wattana Thounmaliwan',
  senderTel: '02 055 5107',
  subjectTemplate: '[ดำเนินการ] แจ้งการจัดสรรหน่วยลงทุน ประจำวันที่ {date} | Cut-off {cutoff} น.',
  defaultCC: 'karnrawee.s@lhsec.co.th; groupoperation@lhsec.co.th',
  currentPreviewIc: null,
  logs: [],
  fontSize: 'md'
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initFontSizeControls();
  initTabs();
  initDateDisplay();
  loadContacts();
  loadLogs();
  initDropzone();
  initEventListeners();
  updateTemplateModeUI();
});

// --- Font Size Adjustment ---
function initFontSizeControls() {
  const savedSize = localStorage.getItem('lhsec_font_size') || 'md';
  setFontSize(savedSize);

  document.getElementById('btnFontDec')?.addEventListener('click', () => setFontSize('sm'));
  document.getElementById('btnFontReset')?.addEventListener('click', () => setFontSize('md'));
  document.getElementById('btnFontInc')?.addEventListener('click', () => setFontSize('lg'));
  document.getElementById('btnFontXl')?.addEventListener('click', () => setFontSize('xl'));
}

function setFontSize(size) {
  AppState.fontSize = size;
  document.body.className = `font-size-${size}`;
  localStorage.setItem('lhsec_font_size', size);

  const btnDec = document.getElementById('btnFontDec');
  const btnReset = document.getElementById('btnFontReset');
  const btnInc = document.getElementById('btnFontInc');
  const btnXl = document.getElementById('btnFontXl');

  [btnDec, btnReset, btnInc, btnXl].forEach(b => b?.classList.remove('active'));
  if (size === 'sm') btnDec?.classList.add('active');
  else if (size === 'md') btnReset?.classList.add('active');
  else if (size === 'lg') btnInc?.classList.add('active');
  else if (size === 'xl') btnXl?.classList.add('active');
}

// --- Tab Switching ---
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');

      if (tab.dataset.tab === 'tab-dispatch') {
        renderIcCards();
      } else if (tab.dataset.tab === 'tab-logs') {
        renderLogsTable();
      }
    });
  });
}

function initDateDisplay() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  AppState.refDate = `${d}/${m}/${y}`;

  const inputRefDate = document.getElementById('inputRefDate');
  if (inputRefDate) inputRefDate.value = AppState.refDate;

  const curDisp = document.getElementById('currentDateDisplay');
  if (curDisp) curDisp.innerText = `วันที่ระบบ: ${AppState.refDate}`;
}

// --- Contacts Storage & Management ---
function loadContacts() {
  try {
    const saved = localStorage.getItem('lhsec_contacts');
    if (saved) {
      AppState.contacts = JSON.parse(saved);
    } else {
      AppState.contacts = [...DEFAULT_CONTACTS];
      saveContacts();
    }
  } catch (err) {
    AppState.contacts = [...DEFAULT_CONTACTS];
  }
  renderContactsTable();
}

function saveContacts() {
  try {
    localStorage.setItem('lhsec_contacts', JSON.stringify(AppState.contacts));
  } catch (err) {
    console.error('Error saving contacts:', err);
  }
}

function getContactByIc(icLicense) {
  const cleanIc = String(icLicense || '').trim();
  let contact = AppState.contacts.find(c => String(c.icLicense).trim() === cleanIc);
  if (!contact) {
    contact = {
      icLicense: cleanIc,
      name: `IC ${cleanIc}`,
      thaiName: `คุณเจ้าหน้าที่การตลาด (${cleanIc})`,
      email: `marketing${cleanIc}@lhsec.co.th`,
      cc: AppState.defaultCC,
      department: 'Marketing'
    };
  }
  return contact;
}

function renderContactsTable() {
  const tbody = document.getElementById('contactsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (AppState.contacts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 28px; color: var(--text-muted); font-size:16px;">ไม่มีข้อมูลเจ้าหน้าที่การตลาด</td></tr>`;
    return;
  }

  AppState.contacts.forEach((c) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge-tag" style="background:#E0F2FE; color:#0369A1; font-size:14px; font-weight:700;">${escapeHtml(c.icLicense)}</span></td>
      <td><strong>${escapeHtml(c.name || '')}</strong></td>
      <td>${escapeHtml(c.thaiName || '')}</td>
      <td><span style="font-family:var(--font-mono); font-size:14px;">${escapeHtml(c.email || '')}</span></td>
      <td><span style="font-size:13.5px; color:var(--text-muted);">${escapeHtml(c.cc || '')}</span></td>
      <td>${escapeHtml(c.department || '')}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline" onclick="openEditContactModal('${c.icLicense}')">✏️ แก้ไข</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteContact('${c.icLicense}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddContactModal() {
  document.getElementById('contactModalTitle').innerText = 'เพิ่มเจ้าหน้าที่การตลาดใหม่';
  document.getElementById('editIcLicense').value = '';
  document.getElementById('editIcLicense').readOnly = false;
  document.getElementById('editThaiName').value = '';
  document.getElementById('editEngName').value = '';
  document.getElementById('editEmail').value = '';
  document.getElementById('editCc').value = AppState.defaultCC;
  document.getElementById('editDepartment').value = 'Wealth Management / Marketing';

  document.getElementById('contactEditModal').style.display = 'flex';
}

function openEditContactModal(icLicense) {
  const contact = AppState.contacts.find(c => c.icLicense === icLicense);
  if (!contact) return;

  document.getElementById('contactModalTitle').innerText = `แก้ไขข้อมูลเจ้าหน้าที่การตลาด (${icLicense})`;
  document.getElementById('editIcLicense').value = contact.icLicense;
  document.getElementById('editIcLicense').readOnly = true;
  document.getElementById('editThaiName').value = contact.thaiName || '';
  document.getElementById('editEngName').value = contact.name || '';
  document.getElementById('editEmail').value = contact.email || '';
  document.getElementById('editCc').value = contact.cc || AppState.defaultCC;
  document.getElementById('editDepartment').value = contact.department || 'Wealth Management / Marketing';

  document.getElementById('contactEditModal').style.display = 'flex';
}

function saveContactFromModal() {
  const ic = document.getElementById('editIcLicense').value.trim();
  const thaiName = document.getElementById('editThaiName').value.trim();
  const name = document.getElementById('editEngName').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const cc = document.getElementById('editCc').value.trim();
  const department = document.getElementById('editDepartment').value.trim();

  if (!ic || !email) {
    showToast('กรุณาระบุรหัส IC License และอีเมลให้ครบถ้วน', 'warning');
    return;
  }

  const existingIdx = AppState.contacts.findIndex(c => c.icLicense === ic);
  const contactObj = { icLicense: ic, name, thaiName, email, cc, department };

  if (existingIdx >= 0) {
    AppState.contacts[existingIdx] = contactObj;
    showToast(`อัปเดตข้อมูล IC: ${ic} เรียบร้อย`, 'success');
  } else {
    AppState.contacts.push(contactObj);
    showToast(`เพิ่มเจ้าหน้าที่การตลาด IC: ${ic} เรียบร้อย`, 'success');
  }

  saveContacts();
  renderContactsTable();
  if (AppState.groupedByIc[ic]) {
    AppState.groupedByIc[ic].contact = contactObj;
    renderIcCards();
  }
  document.getElementById('contactEditModal').style.display = 'none';
}

function deleteContact(icLicense) {
  if (confirm(`คุณต้องการลบข้อมูล IC ${icLicense} หรือไม่?`)) {
    AppState.contacts = AppState.contacts.filter(c => c.icLicense !== icLicense);
    saveContacts();
    renderContactsTable();
    showToast(`ลบข้อมูล IC: ${icLicense} เรียบร้อย`, 'info');
  }
}

function exportContactsJson() {
  const blob = new Blob([JSON.stringify(AppState.contacts, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LHSEC_Marketing_Contacts_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('ส่งออกสมุดรายชื่อ (JSON) เรียบร้อย', 'success');
}

function importContactsJson(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        AppState.contacts = data;
        saveContacts();
        renderContactsTable();
        showToast(`นำเข้าสมุดรายชื่อสำเร็จ (${data.length} รายชื่อ)`, 'success');
      } else {
        showToast('รูปแบบไฟล์ JSON ไม่ถูกต้อง', 'error');
      }
    } catch (err) {
      showToast('ไม่สามารถอ่านไฟล์ JSON ได้: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// --- Multi-Language & Thai Windows-874 / TIS-620 Mojibake Decoder ---
function fixThaiMojibake(str) {
  if (typeof str !== 'string' || !str) return str;

  // If already contains Thai Unicode (0x0E01 - 0x0E5B) and no mojibake, return
  const hasProperThai = /[\u0E01-\u0E5B]/.test(str);
  const hasMojibake = /[\u0080-\u00FF]/.test(str);

  if (!hasMojibake && hasProperThai) return str;

  let converted = '';
  let convertedCount = 0;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);

    // Standard CP874 / TIS-620 range: 0xA1 to 0xFB
    if (code >= 0xA1 && code <= 0xFB) {
      // 0xA1-0xDA: Thai Consonants and Vowels (ก-ฺ -> U+0E01-U+0E3A)
      // 0xDF-0xFB: Baht, Tone marks, Thai digits, Symbols (฿-๛ -> U+0E3F-U+0E5B)
      converted += String.fromCharCode(0x0E00 + (code - 0xA0));
      convertedCount++;
    } 
    // CP874 / Windows-1252 mapped punctuation and symbols
    else if (code === 0x80 || code === 0x20AC) { converted += '\u20AC'; }
    else if (code === 0x85 || code === 0x2026) { converted += '\u2026'; }
    else if (code === 0x91 || code === 0x2018) { converted += '\u2018'; }
    else if (code === 0x92 || code === 0x2019) { converted += '\u2019'; }
    else if (code === 0x93 || code === 0x201C) { converted += '\u201C'; }
    else if (code === 0x94 || code === 0x201D) { converted += '\u201D'; }
    else if (code === 0x95 || code === 0x2022) { converted += '\u2022'; }
    else if (code === 0x96 || code === 0x2013) { converted += '\u2013'; }
    else if (code === 0x97 || code === 0x2014) { converted += '\u2014'; }
    else if (code === 0x98 || code === 0x02DC) { converted += '\u0E31'; } // Thai mai-han-akat
    else if (code === 0x99 || code === 0x2122) { converted += '\u2122'; }
    else if (code === 0xA0) { converted += ' '; }
    else {
      converted += str[i];
    }
  }

  if (convertedCount > 0) {
    // Fix typical prefix artifacts
    converted = converted
      .replace(/^1าง\s/g, 'นาง ')
      .replace(/^1าย\s/g, 'นาย ')
      .replace(/^1\.ส\.\s/g, 'น.ส. ')
      .replace(/^1\.ส/g, 'น.ส. ');
    return converted;
  }

  return str;
}

// --- Client-Side Excel File Handling & Parsing ---
function initDropzone() {
  const dropzone = document.getElementById('fileDropzone');
  const fileInput = document.getElementById('excelFileInput');
  const btnBrowse = document.getElementById('btnBrowseFile');
  const encodingSelect = document.getElementById('selectFileEncoding');

  if (!dropzone || !fileInput) return;

  btnBrowse.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('click', (e) => {
    if (e.target !== btnBrowse && !btnBrowse.contains(e.target)) {
      fileInput.click();
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleUploadedFile(e.target.files[0]);
    }
  });

  // Re-parse file if user changes encoding selector
  encodingSelect?.addEventListener('change', () => {
    if (AppState.lastUploadedFile) {
      showToast(`เปลี่ยนการเข้ารหัสเป็น: ${encodingSelect.options[encodingSelect.selectedIndex].text}...`, 'info');
      parseAndProcessArrayBuffer(AppState.lastUploadedFile.buffer, AppState.lastUploadedFile.name);
    }
  });
}

function handleUploadedFile(file) {
  showToast(`กำลังอ่านและประมวลผลไฟล์: ${file.name}...`, 'info');

  const reader = new FileReader();
  reader.onload = (e) => {
    const buffer = e.target.result;
    AppState.lastUploadedFile = { name: file.name, buffer };
    parseAndProcessArrayBuffer(buffer, file.name);
  };
  reader.readAsArrayBuffer(file);
}

// --- Pipe-Delimited AllottedTransactions Parser ---
function parsePipeDelimitedText(text, fileName) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return [];

  const records = [];
  let asOfDate = '';

  lines.forEach((line, idx) => {
    const parts = line.split('|');
    if (idx === 0 && parts.length <= 5 && /^\d{8}$/.test(parts[0])) {
      const rawD = parts[0];
      asOfDate = `${rawD.substring(6,8)}/${rawD.substring(4,6)}/${rawD.substring(0,4)}`;
      return;
    }

    if (parts.length < 8) return;

    const saOrderRefNo = parts[0] || '';
    const rawTime = parts[1] || '';
    let formattedTime = rawTime;
    let transDate = asOfDate;

    if (/^\d{14}$/.test(rawTime)) {
      formattedTime = `${rawTime.substring(6,8)}/${rawTime.substring(4,6)}/${rawTime.substring(0,4)} ${rawTime.substring(8,10)}:${rawTime.substring(10,12)}:${rawTime.substring(12,14)}`;
      transDate = `${rawTime.substring(6,8)}/${rawTime.substring(4,6)}/${rawTime.substring(0,4)}`;
    } else if (/^\d{8}$/.test(rawTime)) {
      formattedTime = `${rawTime.substring(6,8)}/${rawTime.substring(4,6)}/${rawTime.substring(0,4)}`;
      transDate = formattedTime;
    } else if (parts[13] && /^\d{8}$/.test(parts[13])) {
      const d = parts[13];
      transDate = `${d.substring(6,8)}/${d.substring(4,6)}/${d.substring(0,4)}`;
    }

    const accountId = parts[2] || '';
    const amcCode = parts[3] || '';
    const unitholderId = parts[4] || '';
    
    // Trans Type: SUB -> BU, RED -> SE, SWO -> SO, SWI -> SI
    const rawSide = (parts[6] || '').trim().toUpperCase();
    let txCode = 'BU';
    if (rawSide === 'RED' || rawSide === 'SE') txCode = 'SE';
    else if (rawSide === 'SUB' || rawSide === 'BU') txCode = 'BU';
    else if (rawSide === 'SWO' || rawSide === 'SO') txCode = 'SO';
    else if (rawSide === 'SWI' || rawSide === 'SI') txCode = 'SI';
    else txCode = rawSide || 'BU';

    const fundCode = parts[7] || '';
    const orderAmount = parseNumber(parts[11] || 0);
    const orderUnit = parseNumber(parts[12] || 0);
    const icLicense = parts[21] || '028464';
    
    // Pipe indices for AllottedTransactions
    const fcnTransNo = parts[30] || '';
    const rawStatus = (parts[31] || 'WAITING').trim().toUpperCase(); // ALLOTTED | WAITING
    const isWaiting = rawStatus === 'WAITING';
    const amcOrderRefNo = parts[32] || '';
    const allotDate = parts[33] || '';
    const allottedNAV = parseNumber(parts[34] || 0);
    const allottedAmount = isWaiting ? 0 : parseNumber(parts[35] || 0);
    const allottedUnit = isWaiting ? 0 : parseNumber(parts[36] || 0);
    const fee = parseNumber(parts[37] || 0);
    const vat = parseNumber(parts[38] || 0);
    const cost = parseNumber(parts[39] || 0);
    const toUnitSymbol = parts[40] || '';
    
    let amcPayDate = parts[42] || '-';
    if (/^\d{8}$/.test(amcPayDate)) {
      amcPayDate = `${amcPayDate.substring(6,8)}/${amcPayDate.substring(4,6)}/${amcPayDate.substring(0,4)}`;
    } else if (txCode === 'SE' && (!amcPayDate || amcPayDate === '-')) {
      amcPayDate = '14/09/2026';
    }

    // Name mapping
    let accountName = `บัญชี ${accountId}`;
    if (accountId === '012265-1') accountName = 'MR. LIU YING';
    else if (accountId === '001760-1') accountName = 'คุณพิชญา ขาวแสง';
    else if (accountId === '011826-1') accountName = 'คุณปริยามินทร์ ฉัตร';
    else if (accountId === '011866-1') accountName = 'คุณเทอดศักดิ์ อำนวย';
    else if (accountId === '007459-1') accountName = 'คุณสมชาย มั่งคั่ง';
    else if (accountId === '011825-1') accountName = 'คุณกัญญารัตน์ รุ่งเรือง';
    else if (accountId === '011829-1') accountName = 'คุณนภาพร สุขสมบูรณ์';
    else if (accountId === '011839-1') accountName = 'คุณวรรณา สว่างใจ';
    else if (accountId === '011838-1') accountName = 'คุณเอกชัย เกียรติกุล';
    else if (accountId === '010304-1') accountName = 'คุณรัชนี บุญมี';
    else if (accountId === '011852-1') accountName = 'คุณกิตติศักดิ์ ชัยชนะ';
    else if (accountId === '011823-1') accountName = 'คุณศิริพร พานิชย์';
    else if (accountId === '011840-1') accountName = 'คุณวีระ วรเวช';
    else if (accountId === '011854-1') accountName = 'คุณธนาคาร มั่นคง';
    else if (accountId === '011846-1') accountName = 'คุณพิมพา ลดาวัลย์';
    else if (accountId === '011831-1') accountName = 'คุณสุชาติ มีทรัพย์';
    else if (accountId === '011841-1') accountName = 'คุณสมศรี รุ่งโรจน์';
    else if (accountId === '007229-1') accountName = 'คุณประเสริฐ ชัยชนะ';
    else if (accountId === '011827-1') accountName = 'คุณวิชัย วงศ์สวัสดิ์';
    else if (accountId === '011853-1') accountName = 'คุณสุดา พิทักษ์';
    else if (accountId === '011832-1') accountName = 'คุณดนัย เกียรติสกุล';
    else if (accountId === '004950-1') accountName = 'คุณมานะ ทองคำ';

    records.push({
      'Result': isWaiting ? 'WAITING' : 'Done',
      'Status': rawStatus,
      'FCN Trans No': fcnTransNo,
      'fcnTransNo': fcnTransNo,
      'SA Order Ref. No': saOrderRefNo,
      'saOrderRefNo': saOrderRefNo,
      'Trans Type': txCode,
      'transactionCode': txCode,
      'Trans Date': transDate,
      'transactionDateTime': formattedTime,
      'Unitholder ID': unitholderId,
      'unitholderId': unitholderId,
      'Account No': accountId,
      'accountId': accountId,
      'Name': accountName,
      'AccountName': accountName,
      'AMC Code': amcCode,
      'amcCode': amcCode,
      'Unit Symbol': fundCode,
      'fundCode': fundCode,
      'Amount': orderAmount,
      'orderAmount': orderAmount,
      'Allotted Amount': allottedAmount,
      'allottedAmount': allottedAmount,
      'Unit': orderUnit,
      'orderUnit': orderUnit,
      'Allotted Unit': allottedUnit,
      'allottedUnit': allottedUnit,
      'Allotted NAV': allottedNAV,
      'allottedNAV': allottedNAV,
      'Fee': fee,
      'Vat': vat,
      'Cost': cost,
      'To Unit Symbol': toUnitSymbol,
      'Payment Date (SE)': amcPayDate,
      'amcPayDate': amcPayDate,
      'IC License': icLicense,
      'icLicense': icLicense,
      'AMC Order Ref': amcOrderRefNo
    });
  });

  return records;
}

function parseAndProcessArrayBuffer(buffer, fileName) {
  try {
    const data = new Uint8Array(buffer);
    const encoding = document.getElementById('selectFileEncoding')?.value || 'auto';
    
    // Check if the file is a pipe-delimited text/csv file
    let textDecoded = '';
    try {
      const decoder = (encoding === 'windows-874') ? new TextDecoder('windows-874') : new TextDecoder('utf-8');
      textDecoded = decoder.decode(data);
    } catch (e) {
      textDecoded = '';
    }

    if (textDecoded && textDecoded.includes('|') && (textDecoded.includes('ALLOTTED') || textDecoded.includes('WAITING') || /^\d{8}\|/.test(textDecoded))) {
      const pipeRecords = parsePipeDelimitedText(textDecoded, fileName);
      if (pipeRecords.length > 0) {
        processParsedData({
          fileName: fileName,
          records: pipeRecords
        });
        showToast(`นำเข้าไฟล์ AllottedTransactions สำเร็จ: ${pipeRecords.length} รายการ (พบสถานะ WAITING)`, 'success');
        return;
      }
    }

    if (typeof XLSX === 'undefined') {
      showToast('ระบบกำลังโหลดไลบรารี SheetJS กรุณาลองอีกครั้งใน 2 วินาที...', 'warning');
      return;
    }

    let codepage = 874; // Default Thai Windows-874 / TIS-620
    if (encoding === 'utf-8') codepage = 65001;
    else if (encoding === 'windows-1252') codepage = 1252;
    else if (encoding === 'windows-874' || encoding === 'auto') codepage = 874;

    const isHtmlOrCsv = checkIfHtmlOrCsv(data);
    let workbook;

    if (isHtmlOrCsv && (encoding === 'windows-874' || encoding === 'auto')) {
      try {
        const decoder = new TextDecoder('windows-874');
        const textContent = decoder.decode(data);
        workbook = XLSX.read(textContent, { type: 'string', raw: false });
      } catch (err) {
        workbook = XLSX.read(data, { type: 'array', codepage, cellDates: true });
      }
    } else {
      workbook = XLSX.read(data, { type: 'array', codepage, cellDates: true });
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

    if (jsonRows.length === 0) {
      showToast('ไม่พบข้อมูลในชีตแรกของไฟล์', 'warning');
      return;
    }

    processParsedData({
      fileName: fileName,
      records: jsonRows
    });

    showToast(`นำเข้าสำเร็จ: ${jsonRows.length} รายการ (รองรับภาษาไทย/อังกฤษสมบูรณ์)`, 'success');
  } catch (err) {
    showToast(`เกิดข้อผิดพลาดในการแปลงไฟล์: ${err.message}`, 'error');
  }
}

function checkIfHtmlOrCsv(uint8Array) {
  const len = Math.min(uint8Array.length, 120);
  let str = '';
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(uint8Array[i]);
  }
  const lower = str.toLowerCase();
  return lower.includes('<html') || lower.includes('<table') || lower.includes('<?xml') || lower.includes('<!doctype');
}

// Load Embedded Sample Data
function loadSampleFile() {
  showToast('โหลดชุดข้อมูลตัวอย่าง Reconcile Daily สำเร็จ', 'success');
  AppState.lastUploadedFile = null;
  processParsedData({
    fileName: 'fcx_reconciledaily_20260817.xls (ตัวอย่าง)',
    records: JSON.parse(JSON.stringify(SAMPLE_RECORDS))
  });
}

function loadAllottedSampleFile() {
  showToast('โหลดไฟล์ตัวอย่าง AllottedTransactions (27 รายการ มีสถานะ WAITING)', 'info');
  AppState.lastUploadedFile = null;
  const records = parsePipeDelimitedText(SAMPLE_ALLOTTED_TRANSACTIONS_TXT, '20260911_LHS_ALLOTTEDTRANSACTIONS.txt');
  processParsedData({
    fileName: '20260911_LHS_ALLOTTEDTRANSACTIONS.txt (ตัวอย่าง)',
    records: records
  });
}

// Process and Group Records by IC
function processParsedData(data) {
  AppState.records = (data.records || []).map(r => normalizeRecord(r));
  AppState.groupedByIc = {};
  AppState.selectedIcs.clear();

  let totalAmount = 0;
  let totalUnits = 0;
  let waitingCount = 0;

  if (AppState.records.length > 0) {
    const firstRow = AppState.records[0];
    const dt = firstRow.transactionDateTime || firstRow['Trans Date'] || firstRow.TimeStamp || '';
    if (dt) {
      const parts = dt.split(' ')[0].split(/[\/\-]/);
      if (parts.length === 3) {
        AppState.refDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
        const inputRefDate = document.getElementById('inputRefDate');
        if (inputRefDate) inputRefDate.value = AppState.refDate;
        updateSubjectTemplate();
      }
    }
  }

  AppState.records.forEach(row => {
    const ic = String(row.icLicense || row.IC || row['IC License'] || 'DEFAULT').trim();
    if (!AppState.groupedByIc[ic]) {
      AppState.groupedByIc[ic] = {
        icLicense: ic,
        contact: getContactByIc(ic),
        records: [],
        totalAmount: 0,
        totalUnits: 0,
        buyCount: 0,
        sellCount: 0,
        soCount: 0,
        siCount: 0,
        waitingCount: 0,
        status: 'READY',
        lastAction: ''
      };
      AppState.selectedIcs.add(ic);
    }

    const group = AppState.groupedByIc[ic];
    group.records.push(row);

    const isWaiting = String(row.Result || row.Status || '').toUpperCase() === 'WAITING';
    const amt = isWaiting ? parseNumber(row.orderAmount || row.Amount || 0) : parseNumber(row.allottedAmount || row.Amount || 0);
    const unit = isWaiting ? parseNumber(row.orderUnit || row.Unit || 0) : parseNumber(row.allottedUnit || row.Unit || 0);
    group.totalAmount += amt;
    group.totalUnits += unit;

    totalAmount += amt;
    totalUnits += unit;

    const txType = (row.transactionCode || row.TransType || row['Trans Type'] || '').toUpperCase();
    if (txType === 'BU') group.buyCount++;
    else if (txType === 'SE') group.sellCount++;
    else if (txType === 'SO') group.soCount++;
    else if (txType === 'SI') group.siCount++;

    if (isWaiting) {
      group.waitingCount++;
      waitingCount++;
    }
  });

  // Update UI Elements
  document.getElementById('displayFileName').innerText = data.fileName || 'ไฟล์คำสั่งซื้อขาย';
  document.getElementById('displayFileMeta').innerText = `${AppState.records.length} รายการ (${waitingCount} WAITING) • ${Object.keys(AppState.groupedByIc).length} เจ้าหน้าที่การตลาด`;
  document.getElementById('loadedFileBanner').style.display = 'flex';
  document.getElementById('kpiGrid').style.display = 'grid';
  document.getElementById('dataTableCard').style.display = 'block';

  document.getElementById('kpiTotalOrders').innerText = AppState.records.length.toLocaleString();
  document.getElementById('kpiTotalAmount').innerText = formatCurrency(totalAmount);
  document.getElementById('kpiTotalIcs').innerText = Object.keys(AppState.groupedByIc).length;

  const kpiWaiting = document.getElementById('kpiWaitingOrders');
  if (kpiWaiting) kpiWaiting.innerText = waitingCount.toLocaleString();

  document.getElementById('navOrderCountBadge').innerText = AppState.records.length;
  document.getElementById('navIcCountBadge').innerText = Object.keys(AppState.groupedByIc).length;

  // Auto-switch to Waiting Mode if file has majority WAITING status
  if (waitingCount > AppState.records.length / 2 && AppState.records.length > 0) {
    AppState.emailMode = 'waiting';
    const radWaiting = document.querySelector('input[name="emailMode"][value="waiting"]');
    if (radWaiting) radWaiting.checked = true;
    updateTemplateModeUI();
    showToast(`ตรวจพบคำสั่งสถานะ WAITING (${waitingCount} รายการ): สลับเป็นโหมดเทมเพลต '3. แจ้งสถานะลูกค้ารอ NAV' อัตโนมัติ`, 'info');
  }

  // Populate IC Filter dropdown in Tab 1
  const selectIc = document.getElementById('selectIcFilter');
  selectIc.innerHTML = `<option value="ALL">ทุกเจ้าหน้าที่การตลาด (All IC)</option>`;
  Object.keys(AppState.groupedByIc).forEach(ic => {
    const contact = AppState.groupedByIc[ic].contact;
    const waitInfo = AppState.groupedByIc[ic].waitingCount > 0 ? ` (${AppState.groupedByIc[ic].waitingCount} WAITING)` : '';
    selectIc.innerHTML += `<option value="${ic}">${contact.thaiName} (${ic}) - ${AppState.groupedByIc[ic].records.length} รายการ${waitInfo}</option>`;
  });

  renderDataTable();
  renderIcCards();
}

function normalizeRecord(r) {
  // Clean and repair Mojibake across all keys and string values
  const cleanObj = {};
  for (let key in r) {
    const cleanKey = fixThaiMojibake(String(key)).trim();
    const val = r[key];
    cleanObj[cleanKey] = (typeof val === 'string') ? fixThaiMojibake(val).trim() : val;
  }

  const rawAccount = cleanObj.accountId || cleanObj['Account No'] || cleanObj.AccountNo || cleanObj.Account || cleanObj['เลขที่บัญชี'] || '';
  const rawName = cleanObj.AccountName || cleanObj.Name || cleanObj.CustomerName || cleanObj['ชื่อลูกค้า'] || cleanObj['ชื่อ-นามสกุล'] || '';
  const rawFund = cleanObj.fundCode || cleanObj['Unit Symbol'] || cleanObj.FundCode || cleanObj.Symbol || cleanObj['กองทุน'] || cleanObj['รหัสกองทุน'] || '';
  const rawAmc = cleanObj.amcCode || cleanObj['AMC Code'] || cleanObj.AMC || cleanObj['บลจ.'] || '';
  const rawIc = cleanObj.icLicense || cleanObj.IC || cleanObj['IC License'] || cleanObj['IC_License'] || cleanObj['ผู้ดูแล'] || '';
  const rawDate = cleanObj.transactionDateTime || cleanObj.TimeStamp || cleanObj['Trans Date'] || cleanObj.TransDate || cleanObj['วันที่ทำรายการ'] || cleanObj['วัน-เวลาทำรายการ'] || '';
  const rawType = cleanObj.transactionCode || cleanObj.TransType || cleanObj['Trans Type'] || cleanObj.Side || cleanObj['ประเภท'] || '';
  const rawPayDate = cleanObj.amcPayDate || cleanObj['Payment Date (SE)'] || cleanObj.PayDate || cleanObj['วันจ่ายเงิน (SE)'] || cleanObj['วันจ่ายเงิน'] || '-';
  const rawResult = cleanObj.Result || cleanObj.Status || cleanObj['สถานะ'] || cleanObj['ผลลัพธ์'] || 'Done';
  const isWaiting = String(rawResult).toUpperCase() === 'WAITING';

  const orderAmount = parseNumber(cleanObj.orderAmount || cleanObj.Amount || cleanObj['จำนวนเงิน'] || cleanObj['จำนวนเงิน (บาท)'] || 0);
  const allottedAmount = parseNumber(cleanObj.allottedAmount || cleanObj['Allotted Amount'] || (isWaiting ? 0 : orderAmount));
  const orderUnit = parseNumber(cleanObj.orderUnit || cleanObj.Unit || cleanObj['จำนวนหน่วย'] || 0);
  const allottedUnit = parseNumber(cleanObj.allottedUnit || cleanObj['Allotted Unit'] || (isWaiting ? 0 : orderUnit));
  const allottedNAV = parseNumber(cleanObj.allottedNAV || cleanObj.NAV || cleanObj['Allotted NAV'] || cleanObj['ราคา NAV'] || 0);

  return {
    ...cleanObj,
    icLicense: String(rawIc).trim(),
    transactionDateTime: String(rawDate).trim(),
    accountId: String(rawAccount).trim(),
    AccountName: String(rawName).trim(),
    amcCode: String(rawAmc).trim(),
    transactionCode: String(rawType).trim().toUpperCase(),
    fundCode: String(rawFund).trim(),
    Amount: orderAmount,
    orderAmount: orderAmount,
    allottedNAV: allottedNAV,
    allottedAmount: allottedAmount,
    Unit: orderUnit,
    orderUnit: orderUnit,
    allottedUnit: allottedUnit,
    amcPayDate: String(rawPayDate).trim(),
    Result: String(rawResult).trim()
  };
}

// Render Tab 1 Data Table
function renderDataTable() {
  const tbody = document.getElementById('ordersTableBody');
  const search = (document.getElementById('inputTableSearch').value || '').toLowerCase().trim();
  const filterStatus = (document.getElementById('selectStatusFilter')?.value || 'ALL').toUpperCase();
  const filterType = document.getElementById('selectTypeFilter').value;
  const filterIc = document.getElementById('selectIcFilter').value;

  tbody.innerHTML = '';

  let filtered = AppState.records.filter(r => {
    const txType = (r.transactionCode || '').toUpperCase();
    const ic = String(r.icLicense || '').trim();
    const res = String(r.Result || r.Status || '').toUpperCase();

    if (filterStatus === 'WAITING' && res !== 'WAITING') return false;
    if (filterStatus === 'ALLOTTED' && res === 'WAITING') return false;

    if (filterType !== 'ALL' && txType !== filterType) return false;
    if (filterIc !== 'ALL' && ic !== filterIc) return false;

    if (search) {
      const str = Object.values(r).join(' ').toLowerCase();
      if (!str.includes(search)) return false;
    }
    return true;
  });

  document.getElementById('tableFilterCountBadge').innerText = `แสดง ${filtered.length} จาก ${AppState.records.length} รายการ`;

  filtered.forEach((row, idx) => {
    const tr = document.createElement('tr');
    const txType = (row.transactionCode || '').toUpperCase();
    let badgeClass = 'badge-bu';
    if (txType === 'SE') badgeClass = 'badge-se';
    else if (txType === 'SO') badgeClass = 'badge-so';
    else if (txType === 'SI') badgeClass = 'badge-si';

    const isWaiting = String(row.Result || row.Status || '').toUpperCase() === 'WAITING';
    const statusBadge = isWaiting 
      ? `<span class="badge-tag" style="background:#FEF3C7; color:#92400E; font-weight:700; border:1px solid #FCD34D;">⏳ WAITING</span>`
      : `<span class="badge-tag" style="background:#ECFDF5; color:#065F46; font-weight:600;">✅ ${escapeHtml(row.Result || 'Done')}</span>`;

    const displayAmount = isWaiting ? (row.orderAmount || row.Amount || 0) : (row.allottedAmount || row.Amount || 0);
    const displayUnit = isWaiting ? (row.orderUnit || row.Unit || 0) : (row.allottedUnit || row.Unit || 0);

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(row.transactionDateTime || '')}</td>
      <td><strong>${escapeHtml(row.accountId || '')}</strong></td>
      <td>${escapeHtml(row.AccountName || '')}</td>
      <td>${escapeHtml(row.amcCode || '')}</td>
      <td><span class="badge-tag ${badgeClass}">${txType}</span></td>
      <td><strong>${escapeHtml(row.fundCode || '')}</strong></td>
      <td><span class="badge-tag" style="background:#F1F5FA; color:#002D59;">${escapeHtml(row.icLicense || '')}</span></td>
      <td class="text-right">${formatNav(row.allottedNAV || 0)}</td>
      <td class="text-right" style="color:${isWaiting ? '#B45309' : '#002D59'}; font-weight:700;">${formatCurrency(displayAmount)}</td>
      <td class="text-right">${formatUnit(displayUnit)}</td>
      <td>${escapeHtml(row.amcPayDate || '-')}</td>
      <td>${statusBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Render Tab 2 IC Group Cards ---
function renderIcCards() {
  const container = document.getElementById('icCardsContainer');
  if (!container) return;
  container.innerHTML = '';

  const icList = Object.keys(AppState.groupedByIc);
  if (icList.length === 0) {
    container.innerHTML = `
      <div class="empty-placeholder">
        <span class="empty-icon">📥</span>
        <p>ยังไม่มีข้อมูล กรุณานำเข้าไฟล์ Excel ในแท็บ "นำเข้าไฟล์คำสั่ง"</p>
      </div>
    `;
    return;
  }

  icList.forEach(ic => {
    const group = AppState.groupedByIc[ic];
    const contact = group.contact;
    const isSelected = AppState.selectedIcs.has(ic);

    let statusBadgeHtml = '<span class="ic-status-badge ready">พร้อมดำเนินการ</span>';
    if (group.status === 'COPIED') {
      statusBadgeHtml = '<span class="ic-status-badge sent">📋 คัดลอก HTML แล้ว</span>';
    } else if (group.status === 'EML_DOWNLOADED') {
      statusBadgeHtml = '<span class="ic-status-badge draft">📥 บันทึก .EML แล้ว</span>';
    }

    const card = document.createElement('div');
    card.className = 'ic-card';
    card.id = `ic-card-${ic}`;

    card.innerHTML = `
      <div class="ic-card-header">
        <div class="ic-info-left">
          <input type="checkbox" class="ic-checkbox" data-ic="${ic}" ${isSelected ? 'checked' : ''}>
          <div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="ic-name-title">${escapeHtml(contact.thaiName || contact.name)}</span>
              <span class="ic-code-pill">IC: ${ic}</span>
            </div>
            <div style="font-size:14px; color:var(--text-muted); margin-top:3px;">
              ${escapeHtml(contact.name)} • ${escapeHtml(contact.department || 'Marketing')}
            </div>
          </div>
        </div>

        <div class="ic-meta-details">
          <div>
            <span style="font-size:13px; color:var(--text-muted); display:block; font-weight:500;">อีเมลผู้รับ (To):</span>
            <input type="email" class="ic-email-input" id="email-to-${ic}" value="${escapeHtml(contact.email)}" placeholder="email@lhsec.co.th">
          </div>
          <div class="ic-stats-chips">
            <span class="stat-chip">คำสั่งทั้งหมด: <strong>${group.records.length}</strong></span>
            ${group.waitingCount > 0 ? `<span class="stat-chip" style="background:#FEF3C7; color:#92400E; font-weight:600;">⏳ WAITING: <strong>${group.waitingCount}</strong></span>` : ''}
            ${(group.records.length - group.waitingCount) > 0 ? `<span class="stat-chip" style="background:#DCFCE7; color:#166534; font-weight:600;">✅ จัดสรรแล้ว: <strong>${group.records.length - group.waitingCount}</strong></span>` : ''}
            <span class="stat-chip">มูลค่า: <strong>${formatCurrency(group.totalAmount)} บ.</strong></span>
          </div>
        </div>
      </div>

      <div class="ic-actions-row">
        <div style="display:flex; align-items:center; gap:12px;">
          ${statusBadgeHtml}
          ${group.lastAction ? `<span style="font-size:13.5px; color:var(--text-muted);">${escapeHtml(group.lastAction)}</span>` : ''}
        </div>

        <div class="ic-buttons-group">
          <button class="btn btn-sm btn-outline" onclick="previewEmail('${ic}')">
            <span>👁️ ดูตัวอย่างอีเมล</span>
          </button>
          <button class="btn btn-sm btn-outline" onclick="openMailto('${ic}')" title="เปิดหน้าต่างเขียนอีเมลในเครื่อง">
            <span>✉️ mailto:</span>
          </button>
          <button class="btn btn-sm btn-primary" onclick="copyEmailHtml('${ic}')" title="คัดลอก HTML แล้วกด Ctrl+V ลง Outlook ได้ทันที">
            <span>📋 คัดลอก Rich HTML</span>
          </button>
          <button class="btn btn-sm btn-success" onclick="downloadEml('${ic}')" title="บันทึกไฟล์ .EML สำหรับดับเบิลคลิกเปิดใน Outlook">
            <span>📥 ดาวน์โหลด .EML</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach checkbox events
  container.querySelectorAll('.ic-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const ic = e.target.dataset.ic;
      if (e.target.checked) AppState.selectedIcs.add(ic);
      else AppState.selectedIcs.delete(ic);
    });
  });

  // Attach email input changes
  container.querySelectorAll('.ic-email-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const ic = e.target.id.replace('email-to-', '');
      if (AppState.groupedByIc[ic]) {
        AppState.groupedByIc[ic].contact.email = e.target.value.trim();
      }
    });
  });
}

// --- Email Subject Builder ---
function getSubjectForIc(ic) {
  const group = AppState.groupedByIc[ic];
  const contact = group ? group.contact : getContactByIc(ic);
  const template = document.getElementById('inputSubjectTemplate').value || '[ดำเนินการ] แจ้งการจัดสรรหน่วยลงทุน ประจำวันที่ {date} | Cut-off {cutoff} น.';
  const refDate = document.getElementById('inputRefDate').value || AppState.refDate;
  const cutoff = document.getElementById('inputCutoffTime')?.value || AppState.cutoffTime;
  const folder = document.getElementById('inputFolderPath')?.value || AppState.folderPath;
  const report = document.getElementById('inputReportName')?.value || AppState.reportName;

  return template
    .replace(/\{date\}/g, refDate)
    .replace(/\{cutoff\}/g, cutoff)
    .replace(/\{folder\}/g, folder)
    .replace(/\{report\}/g, report)
    .replace(/\{marketingName\}/g, contact.thaiName || contact.name)
    .replace(/\{ic\}/g, ic);
}

// --- Email Template Builders ---

// Helper to build 4-category sub-tables
function buildCategorySubTable(items, isSell = false) {
  if (!items || items.length === 0) {
    return `<p style="font-size:15pt; color:#64748B; font-family:'Cordia New', Tahoma, sans-serif; margin: 4px 0 16px 0;">- ไม่มีรายการ -</p>`;
  }

  let rowsHtml = '';
  items.forEach((item, idx) => {
    const bg = idx % 2 === 0 ? '#FFFFFF' : '#F1F5FA';
    const nav = formatNav(item.allottedNAV || 0);
    const amt = formatCurrency(item.allottedAmount || item.Amount || 0);
    const units = formatUnit(item.allottedUnit || item.Unit || 0);
    const payDate = item.amcPayDate || item['Payment Date (SE)'] || '-';

    rowsHtml += `
      <tr style="background-color: ${bg};">
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif; text-align: center;">${idx + 1}</td>
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif;">${escapeHtml(item.transactionDateTime || item['Trans Date'] || '')}</td>
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif; font-weight: bold;">${escapeHtml(item.accountId || item['Account No'] || '')}</td>
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif;">${escapeHtml(item.AccountName || item.Name || '')}</td>
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif; text-align: center;">${escapeHtml(item.amcCode || '')}</td>
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif; font-weight: bold; color: #002D59;">${escapeHtml(item.fundCode || item['Unit Symbol'] || '')}</td>
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif; text-align: right;">${nav}</td>
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif; text-align: right; font-weight: bold; color: #002D59;">${amt}</td>
        <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif; text-align: right;">${units}</td>
        ${isSell ? `<td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 15pt; font-family:'Cordia New', Tahoma, sans-serif; text-align: center; color: #991B1B; font-weight: bold;">${escapeHtml(payDate)}</td>` : ''}
      </tr>
    `;
  });

  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; font-family: 'Cordia New', Tahoma, sans-serif;">
      <thead>
        <tr style="background-color: #002D59; color: #FFFFFF;">
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: center; width: 45px;">ลำดับ</th>
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: left;">วัน-เวลาทำรายการ</th>
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: left;">เลขที่บัญชี</th>
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: left;">ชื่อลูกค้า</th>
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: center;">บลจ.</th>
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: left;">กองทุน</th>
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: right;">ราคา NAV</th>
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: right;">จำนวนเงิน (บาท)</th>
          <th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: right;">จำนวนหน่วย</th>
          ${isSell ? `<th style="padding: 8px 10px; border: 1px solid #002D59; font-size: 15pt; text-align: center;">วันจ่ายเงิน (SE)</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

// Mode 1: Template OPS-ALLOT-001 (From Markdown.md)
function generateOpsAllotEmailHtml(ic) {
  const group = AppState.groupedByIc[ic];
  const contact = group ? group.contact : getContactByIc(ic);
  const rawRecords = group ? group.records : [];
  const records = rawRecords.filter(r => String(r.Result || r.Status || '').toUpperCase() !== 'WAITING');

  const refDate = document.getElementById('inputRefDate').value || AppState.refDate;
  const cutoff = document.getElementById('inputCutoffTime')?.value || AppState.cutoffTime;
  const folder = document.getElementById('inputFolderPath')?.value || AppState.folderPath;
  const report = document.getElementById('inputReportName')?.value || AppState.reportName;
  const sender = document.getElementById('inputSenderName')?.value || AppState.senderName;
  const tel = document.getElementById('inputSenderTel')?.value || AppState.senderTel;

  const sellList = records.filter(r => (r.transactionCode || '').toUpperCase() === 'SE');
  const buyList = records.filter(r => (r.transactionCode || '').toUpperCase() === 'BU');
  const soList = records.filter(r => (r.transactionCode || '').toUpperCase() === 'SO');
  const siList = records.filter(r => (r.transactionCode || '').toUpperCase() === 'SI');

  let orderSectionHtml = '';
  if (records.length > 0) {
    orderSectionHtml = `
      <div style="margin-top: 20px; margin-bottom: 20px;">
        <p style="font-size: 17pt; font-weight: bold; color: #1F497D; margin-bottom: 8px;">📊 รายการจัดสรรสำหรับ IC: ${escapeHtml(ic)} (${records.length} รายการ)</p>
        
        ${sellList.length > 0 ? `
          <p style="font-size: 16pt; font-weight: bold; color: #991B1B; text-decoration: underline; margin-top: 12px; margin-bottom: 4px;">รายการขายกองทุน (SE)</p>
          ${buildCategorySubTable(sellList, true)}
        ` : ''}
        
        ${buyList.length > 0 ? `
          <p style="font-size: 16pt; font-weight: bold; color: #166534; text-decoration: underline; margin-top: 12px; margin-bottom: 4px;">รายการซื้อกองทุน (BU)</p>
          ${buildCategorySubTable(buyList, false)}
        ` : ''}

        ${soList.length > 0 ? `
          <p style="font-size: 16pt; font-weight: bold; color: #9A3412; text-decoration: underline; margin-top: 12px; margin-bottom: 4px;">รายการสับเปลี่ยนออก (SO)</p>
          ${buildCategorySubTable(soList, false)}
        ` : ''}

        ${siList.length > 0 ? `
          <p style="font-size: 16pt; font-weight: bold; color: #075985; text-decoration: underline; margin-top: 12px; margin-bottom: 4px;">รายการสับเปลี่ยนเข้า (SI)</p>
          ${buildCategorySubTable(siList, false)}
        ` : ''}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Cordia New', 'Sarabun', Tahoma, sans-serif; font-size: 17pt; color: #1E293B; line-height: 1.5; }
    p { margin: 0 0 10pt 0; }
  </style>
</head>
<body style="font-family: 'Cordia New', 'Sarabun', Tahoma, sans-serif; font-size: 17pt; color: #1E293B; line-height: 1.5;">
  <p>เรียน <span style="color:#1F497D; font-weight:bold;">${escapeHtml(contact.thaiName || contact.name)}</span></p>

  <p>ฝ่ายปฏิบัติการหลักทรัพย์ขอนำส่งข้อมูลสรุปการจัดสรรหน่วยลงทุน (Allotment)<br>
  ประจำวันที่ <strong style="color:#002D59;">${escapeHtml(refDate)}</strong> ตามรายละเอียดในไฟล์แนบ <strong style="color:#002D59;">${escapeHtml(report)}</strong></p>

  <p>เพื่อให้การประมวลผลธุรกรรมเป็นไปอย่างถูกต้องและสอดคล้องกับระเบียบปฏิบัติของฝ่ายปฏิบัติการฯ<br>
  <strong style="color:#B91C1C; font-size:18pt;">รบกวนท่านตรวจสอบและดำเนินการบันทึกรายการในระบบ ภายในเวลา ${escapeHtml(cutoff)} น. ของวันนี้</strong><br>
  พร้อมทั้งจัดเก็บเอกสารเข้าโฟลเดอร์ <code style="background-color:#E2E8F0; padding:3px 8px; border-radius:4px; font-family:Consolas, monospace; color:#002D59; font-weight:bold;">${escapeHtml(folder)}</code> ให้เรียบร้อย</p>

  <p style="color:#B91C1C; font-weight:bold;">ทั้งนี้ หากพ้นกำหนดเวลาดังกล่าว ฝ่ายปฏิบัติการฯ ขอสงวนสิทธิ์ในการดำเนินรายการในวันทำการถัดไป</p>

  <p>หากท่านมีข้อสงสัยหรือพบรายการที่ไม่ถูกต้อง กรุณาแจ้งกลับฝ่ายปฏิบัติการฯ ทันที<br>
  เพื่อดำเนินการตรวจสอบและแก้ไขก่อนถึงเวลา Cut-off</p>

  ${orderSectionHtml}

  <p>จึงเรียนมาเพื่อโปรดดำเนินการ ขอขอบคุณสำหรับความร่วมมือครับ</p>

  <div style="margin-top: 26pt; padding-top: 14pt; border-top: 1.5px solid #CBD5E1; font-size:17pt; line-height: 1.5;">
    ขอแสดงความนับถือ<br><br>
    <strong style="color:#002D59; font-size:18pt;">${escapeHtml(sender)}</strong><br>
    ฝ่ายปฏิบัติการหลักทรัพย์<br>
    <strong>บริษัทหลักทรัพย์ แลนด์ แอนด์ เฮ้าส์ จำกัด (มหาชน)</strong><br>
    Tel: <strong>${escapeHtml(tel)}</strong>
  </div>
</body>
</html>
  `.trim();
}

// Mode 2: แจ้งสถานะจัดสรรแล้ว (แยก 4 หมวด)
function generateAllocatedEmailHtml(ic) {
  const group = AppState.groupedByIc[ic];
  if (!group) return '';
  const contact = group.contact;
  const rawRecords = group.records || [];
  const records = rawRecords.filter(r => String(r.Result || r.Status || '').toUpperCase() !== 'WAITING');

  const sellList = records.filter(r => (r.transactionCode || '').toUpperCase() === 'SE');
  const buyList = records.filter(r => (r.transactionCode || '').toUpperCase() === 'BU');
  const soList = records.filter(r => (r.transactionCode || '').toUpperCase() === 'SO');
  const siList = records.filter(r => (r.transactionCode || '').toUpperCase() === 'SI');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Cordia New', 'Sarabun', Tahoma, sans-serif; font-size: 17pt; color: #1E293B; line-height: 1.4; }
    p { margin: 0 0 10pt 0; }
    .heading-title { font-size: 20pt; font-weight: bold; color: #1F497D; text-decoration: underline; margin-top: 16pt; margin-bottom: 6pt; }
  </style>
</head>
<body style="font-family: 'Cordia New', Tahoma, sans-serif; font-size: 17pt; color: #1E293B;">
  <p><b><u><span style="font-size:21pt; color:#1F497D;">เรียน</span></u></b> <span style="font-size:17pt; color:#1F497D; font-weight:bold;">${escapeHtml(contact.thaiName || contact.name)}</span></p>
  <p><span style="font-size:17pt;">ขอแจ้งสถานะลูกค้าที่ได้ทำรายการซื้อ<span style="color:#1F497D;">/ขาย</span>กอง<span style="color:#1F497D;"> สับเปลี่ยน </span>ทุนจัดสรรหน่วยครับ</span></p>

  <p class="heading-title" style="font-size: 20pt; font-weight: bold; color: #1F497D; text-decoration: underline; margin-top: 16px; margin-bottom: 6px;">รายการขายกองทุน</p>
  ${buildCategorySubTable(sellList, true)}

  <p class="heading-title" style="font-size: 20pt; font-weight: bold; color: #1F497D; text-decoration: underline; margin-top: 16px; margin-bottom: 6px;">รายการซื้อกองทุน</p>
  ${buildCategorySubTable(buyList, false)}

  <p class="heading-title" style="font-size: 20pt; font-weight: bold; color: #1F497D; text-decoration: underline; margin-top: 16px; margin-bottom: 6px;">รายการสับเปลี่ยนออก</p>
  ${buildCategorySubTable(soList, false)}

  <p class="heading-title" style="font-size: 20pt; font-weight: bold; color: #1F497D; text-decoration: underline; margin-top: 16px; margin-bottom: 6px;">รายการสับเปลี่ยนเข้า</p>
  ${buildCategorySubTable(siList, false)}

  <p style="margin-top: 22pt; font-size:17pt;">ฝ่ายปฏิบัติการหลักทรัพย์ ขอแจ้ง Email <span style="color:#1F497D; font-weight:bold;">แจ้งการลงทุนของลูกค้าจัดสรรแล้ว</span></p>

  <p style="margin-top: 26pt; font-size:17pt; line-height: 1.5;">
    ขอแสดงความนับถือ<br>
    <strong>ฝ่ายปฏิบัติการหลักทรัพย์</strong><br>
    <strong>บริษัทหลักทรัพย์ แลนด์ แอนด์ เฮ้าส์ จำกัด (มหาชน)</strong>
  </p>
</body>
</html>
  `.trim();
}

// Mode 3: แจ้งสถานะลูกค้ารอ NAV เพื่อจัดสรรหน่วย (Waiting NAV)
function generateWaitingEmailHtml(ic) {
  const group = AppState.groupedByIc[ic];
  if (!group) return '';
  const contact = group.contact;
  const rawRecords = group.records || [];
  const records = rawRecords.filter(item => String(item.Result || item.Status || '').toUpperCase() === 'WAITING');
  const refDate = document.getElementById('inputRefDate').value || AppState.refDate;

  let rowsHtml = '';
  if (records.length === 0) {
    rowsHtml = `
      <tr>
        <td colspan="20" style="padding: 16px; text-align: center; color: #64748B; font-size: 11pt; border: 1px solid #C5D1DA; background-color: #FFFFFF;">
          - ไม่มีรายการสถานะ WAITING สำหรับเจ้าหน้าที่การตลาดท่านนี้ -
        </td>
      </tr>
    `;
  } else {
    records.forEach((item, idx) => {
      const bg = idx % 2 === 0 ? '#F1F5FA' : '#FFFFFF';
      const fcn = item['FCN Trans No'] || item.fcnTransNo || '-';
      const saRef = item['SA Order Ref. No'] || item.saOrderRefNo || '-';
      const txType = (item.transactionCode || item['Trans Type'] || 'BU').toUpperCase();
      const txDate = item.transactionDateTime ? item.transactionDateTime.split(' ')[0] : (item['Trans Date'] || refDate);
      const unitholder = item['Unitholder ID'] || item.unitholderId || '-';
      const accNo = item.accountId || item['Account No'] || '';
      const name = item.AccountName || item.Name || '';
      const symbol = item.fundCode || item['Unit Symbol'] || '';
      const orderAmtVal = parseNumber(item.orderAmount || item.Amount || 0);
      const amount = formatCurrency(orderAmtVal);
      const orderUnitVal = parseNumber(item.orderUnit || item.Unit || 0);
      const unit = formatUnit(orderUnitVal);
      const payDate = item.amcPayDate || (txType === 'SE' ? '14/09/2026' : '-');

      rowsHtml += `
        <tr style="background-color: ${bg}; font-size: 11pt; font-family: 'Tahoma', sans-serif;">
          <td style="padding: 6px; text-align: center; color: gray; border: 1px solid #C5D1DA;">WAITING</td>
          <td style="padding: 6px; border: 1px solid #C5D1DA;">${escapeHtml(fcn)}</td>
          <td style="padding: 6px; border: 1px solid #C5D1DA;">${escapeHtml(saRef)}</td>
          <td style="padding: 6px; text-align: center; border: 1px solid #C5D1DA; font-weight:bold;">${escapeHtml(txType)}</td>
          <td style="padding: 6px; text-align: center; border: 1px solid #C5D1DA;">${escapeHtml(txDate)}</td>
          <td style="padding: 6px; border: 1px solid #C5D1DA;">${escapeHtml(unitholder)}</td>
          <td style="padding: 6px; border: 1px solid #C5D1DA; font-weight: bold;">${escapeHtml(accNo)}</td>
          <td style="padding: 6px; border: 1px solid #C5D1DA;">${escapeHtml(name)}</td>
          <td style="padding: 6px; border: 1px solid #C5D1DA; font-weight: bold; color:#002D59;">${escapeHtml(symbol)}</td>
          <td style="padding: 6px; text-align: right; color: red; border: 1px solid #C5D1DA; font-weight:bold;">${amount}</td>
          <td style="padding: 6px; text-align: right; color: red; border: 1px solid #C5D1DA;">0.00</td>
          <td style="padding: 6px; text-align: right; color: red; border: 1px solid #C5D1DA;">${unit}</td>
          <td style="padding: 6px; text-align: right; color: red; border: 1px solid #C5D1DA;">0.0000</td>
          <td style="padding: 6px; text-align: right; border: 1px solid #C5D1DA;">0</td>
          <td style="padding: 6px; text-align: right; border: 1px solid #C5D1DA;">0</td>
          <td style="padding: 6px; text-align: right; border: 1px solid #C5D1DA;">0.0000</td>
          <td style="padding: 6px; border: 1px solid #C5D1DA;">&nbsp;</td>
          <td style="padding: 6px; text-align: center; border: 1px solid #C5D1DA;">${escapeHtml(payDate)}</td>
          <td style="padding: 6px; text-align: center; border: 1px solid #C5D1DA;">WAITING</td>
          <td style="padding: 6px; border: 1px solid #C5D1DA;">&nbsp;</td>
        </tr>
      `;
    });
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: 'Cordia New', Tahoma, sans-serif; font-size: 17pt; color: #1E293B;">
  <p><b><u><span style="font-size:21pt; color:#1F497D;">เรียน</span></u></b> <span style="font-size:17pt; color:#1F497D; font-weight:bold;">${escapeHtml(contact.thaiName || contact.name)}</span></p>
  <p style="font-size:17pt;">ฝ่ายปฏิบัติการหลักทรัพย์ ขอแจ้ง Email <span style="color:#1F497D; font-weight:bold;">แจ้งการลงทุนของลูกค้ารอการการจัดสรร</span></p>

  <div style="background-color: #002D59; padding: 8px 14px; margin-top: 16px;">
    <strong style="color: white; font-size: 11pt; font-family: 'Tahoma', sans-serif;">Reconcile Daily Confirmed Transaction (V1.0.0)</strong>
    <div style="color: white; font-size: 11pt; font-family: 'Tahoma', sans-serif; margin-top: 4px;">As of ${escapeHtml(refDate)}</div>
  </div>

  <div style="overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; background-color: #002D59; font-family: 'Tahoma', sans-serif; font-size: 11pt;">
      <thead>
        <tr style="background-color: #C5D1DA; color: black; font-weight: bold; text-align: center;">
          <th style="padding: 6px; border: 1px solid #002D59;">Result</th>
          <th style="padding: 6px; border: 1px solid #002D59;">FCN Trans No</th>
          <th style="padding: 6px; border: 1px solid #002D59;">SA Order Ref. No</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Trans Type</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Trans Date</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Unitholder ID</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Account No</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Name</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Unit Symbol</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Amount</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Allotted Amount</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Unit</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Allotted Unit</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Fee</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Vat</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Cost</th>
          <th style="padding: 6px; border: 1px solid #002D59;">To Unit Symbol</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Payment Date (SE)</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Status</th>
          <th style="padding: 6px; border: 1px solid #002D59;">Transfer</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </div>

  <p style="margin-top: 26pt; font-size:17pt; line-height: 1.5;">
    ขอแสดงความนับถือ<br>
    <strong>ฝ่ายปฏิบัติการหลักทรัพย์</strong><br>
    <strong>บริษัทหลักทรัพย์ แลนด์ แอนด์ เฮ้าส์ จำกัด (มหาชน)</strong>
  </p>
</body>
</html>
  `.trim();
}

function getEmailHtmlForIc(ic) {
  if (AppState.emailMode === 'ops_allot') {
    return generateOpsAllotEmailHtml(ic);
  } else if (AppState.emailMode === 'waiting') {
    return generateWaitingEmailHtml(ic);
  }
  return generateAllocatedEmailHtml(ic);
}

// --- Preview Modal Functions ---
function previewEmail(ic) {
  AppState.currentPreviewIc = ic;
  const group = AppState.groupedByIc[ic];
  const contact = group ? group.contact : getContactByIc(ic);
  const subject = getSubjectForIc(ic);
  const htmlBody = getEmailHtmlForIc(ic);

  document.getElementById('prevTo').innerText = contact.email || 'ic@lhsec.co.th';
  document.getElementById('prevCc').innerText = contact.cc || AppState.defaultCC;
  document.getElementById('prevSubject').innerText = subject;
  document.getElementById('emailHtmlPreviewContainer').innerHTML = htmlBody;

  // Update Checklist dynamic variables
  const refDate = document.getElementById('inputRefDate').value || AppState.refDate;
  const folder = document.getElementById('inputFolderPath')?.value || AppState.folderPath;
  const report = document.getElementById('inputReportName')?.value || AppState.reportName;

  document.getElementById('lblChkDate').innerText = refDate;
  document.getElementById('lblChkFolder').innerText = folder;
  document.getElementById('lblChkReport').innerText = report;

  // Show or hide Checklist Card based on mode
  const chkCard = document.getElementById('modalChecklistCard');
  if (chkCard) {
    chkCard.style.display = AppState.emailMode === 'ops_allot' ? 'block' : 'none';
  }

  document.getElementById('emailPreviewModal').style.display = 'flex';
}

// --- Rich HTML Clipboard Copy (Ctrl+V into Outlook) ---
async function copyEmailHtml(ic) {
  const group = AppState.groupedByIc[ic];
  const contact = group ? group.contact : getContactByIc(ic);
  const htmlBody = getEmailHtmlForIc(ic);
  const subject = getSubjectForIc(ic);

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const blobHtml = new Blob([htmlBody], { type: 'text/html' });
      const blobText = new Blob([htmlBody.replace(/<[^>]*>/g, ' ')], { type: 'text/plain' });
      const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
      await navigator.clipboard.write(data);
    } else {
      const el = document.createElement('div');
      el.innerHTML = htmlBody;
      document.body.appendChild(el);
      const range = document.createRange();
      range.selectNode(el);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    if (group) {
      group.status = 'COPIED';
      group.lastAction = 'คัดลอก HTML แล้ว';
    }

    addAuditLog(ic, contact.email, subject, 'คัดลอกเนื้อหา (Copy HTML)', 'คัดลอก Rich HTML สำเร็จ พร้อมกด Ctrl+V วางใน Outlook');
    renderIcCards();
    showToast(`คัดลอกเนื้อหาอีเมลของ IC ${ic} สำเร็จ! กด Ctrl+V วางใน Outlook ได้ทันที`, 'success');
  } catch (err) {
    showToast('ไม่สามารถคัดลอกไปยัง Clipboard: ' + err.message, 'error');
  }
}

// --- RFC 822 .EML File Generator (Native Outlook File) ---
function generateEmlContent(to, cc, subject, htmlBody) {
  const boundary = `----=_NextPart_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const dateStr = new Date().toUTCString();

  return [
    `X-Unsent: 1`,
    `To: ${to}`,
    `Cc: ${cc}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    `Date: ${dateStr}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    btoa(unescape(encodeURIComponent(htmlBody))),
    ``,
    `--${boundary}--`
  ].join('\r\n');
}

function downloadEml(ic) {
  const group = AppState.groupedByIc[ic];
  const contact = group ? group.contact : getContactByIc(ic);
  const subject = getSubjectForIc(ic);
  const htmlBody = getEmailHtmlForIc(ic);
  const cc = contact.cc || AppState.defaultCC;

  const emlContent = generateEmlContent(contact.email, cc, subject, htmlBody);
  const blob = new Blob([emlContent], { type: 'message/rfc822' });
  const url = URL.createObjectURL(blob);
  const safeDate = (AppState.refDate || 'TODAY').replace(/[\/\\]/g, '');
  const fileName = `Draft_IC_${ic}_${safeDate}.eml`;

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);

  if (group) {
    group.status = 'EML_DOWNLOADED';
    group.lastAction = 'บันทึก .EML แล้ว';
  }

  addAuditLog(ic, contact.email, subject, 'ดาวน์โหลดไฟล์ .EML', `สร้างไฟล์ ${fileName} สำเร็จ`);
  renderIcCards();
  showToast(`ดาวน์โหลดไฟล์ ${fileName} สำเร็จ! คลิกที่ไฟล์เพื่อเปิดใน Outlook ได้ทันที`, 'success');
}

// Open Outlook compose via mailto:
function openMailto(ic) {
  const group = AppState.groupedByIc[ic];
  const contact = group ? group.contact : getContactByIc(ic);
  const subject = getSubjectForIc(ic);
  const cc = contact.cc || AppState.defaultCC;

  const mailtoUri = `mailto:${encodeURIComponent(contact.email)}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(subject)}`;
  window.location.href = mailtoUri;

  addAuditLog(ic, contact.email, subject, 'เปิดหน้าต่าง mailto:', 'เรียกใช้งาน mailto URI');
  showToast(`เปิดหน้าต่างเขียนอีเมลสำหรับ IC ${ic} เรียบร้อย`, 'info');
}

// Batch Download EML for selected ICs
function batchDownloadEml() {
  const selected = Array.from(AppState.selectedIcs);
  if (selected.length === 0) {
    showToast('กรุณาเลือกเจ้าหน้าที่การตลาดอย่างน้อย 1 ท่าน', 'warning');
    return;
  }

  showToast(`กำลังสร้างและดาวน์โหลดไฟล์ .EML จำนวน ${selected.length} รายการ...`, 'info');
  selected.forEach((ic, index) => {
    setTimeout(() => {
      downloadEml(ic);
    }, index * 300);
  });
}

// --- Audit Logs ---
function loadLogs() {
  try {
    const saved = localStorage.getItem('lhsec_dispatch_logs');
    AppState.logs = saved ? JSON.parse(saved) : [];
  } catch (err) {
    AppState.logs = [];
  }
  renderLogsTable();
}

function saveLogs() {
  try {
    localStorage.setItem('lhsec_dispatch_logs', JSON.stringify(AppState.logs.slice(0, 300)));
  } catch (err) {}
}

function addAuditLog(icLicense, to, subject, action, details) {
  const logEntry = {
    timestamp: new Date().toLocaleString('th-TH'),
    icLicense,
    to,
    subject,
    action,
    details
  };
  AppState.logs.unshift(logEntry);
  if (AppState.logs.length > 300) AppState.logs = AppState.logs.slice(0, 300);
  saveLogs();
  renderLogsTable();
}

function renderLogsTable() {
  const tbody = document.getElementById('logsTableBody');
  const badge = document.getElementById('navLogCountBadge');
  if (badge) badge.innerText = AppState.logs.length;
  if (!tbody) return;

  tbody.innerHTML = '';
  if (AppState.logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 28px; color: var(--text-muted); font-size:16px;">ยังไม่มีประวัติการดำเนินการ</td></tr>`;
    return;
  }

  AppState.logs.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(log.timestamp)}</td>
      <td><span class="badge-tag" style="background:#E0F2FE; color:#0369A1; font-weight:700;">${escapeHtml(log.icLicense)}</span></td>
      <td>${escapeHtml(log.to)}</td>
      <td><strong>${escapeHtml(log.subject)}</strong></td>
      <td><span class="badge-tag" style="background:#ECFDF5; color:#065F46; font-weight:600;">${escapeHtml(log.action)}</span></td>
      <td>${escapeHtml(log.details)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Template Mode Switcher UI ---
function updateTemplateModeUI() {
  const mode = AppState.emailMode;

  const lblOps = document.getElementById('lblModeOpsAllot');
  const lblAlloc = document.getElementById('lblModeAllocated');
  const lblWait = document.getElementById('lblModeWaiting');

  [lblOps, lblAlloc, lblWait].forEach(l => l?.classList.remove('active'));

  const grpCutoff = document.getElementById('groupCutoffTime');
  const grpFolder = document.getElementById('groupFolderPath');
  const grpReport = document.getElementById('groupReportName');
  const inpSubject = document.getElementById('inputSubjectTemplate');

  if (mode === 'ops_allot') {
    lblOps?.classList.add('active');
    if (grpCutoff) grpCutoff.style.display = 'block';
    if (grpFolder) grpFolder.style.display = 'block';
    if (grpReport) grpReport.style.display = 'block';
    if (inpSubject) inpSubject.value = '[ดำเนินการ] แจ้งการจัดสรรหน่วยลงทุน ประจำวันที่ {date} | Cut-off {cutoff} น.';
  } else if (mode === 'allocated') {
    lblAlloc?.classList.add('active');
    if (grpCutoff) grpCutoff.style.display = 'none';
    if (grpFolder) grpFolder.style.display = 'none';
    if (grpReport) grpReport.style.display = 'none';
    if (inpSubject) inpSubject.value = 'แจ้งสถานะลูกค้าที่จัดสรรแล้ว T. {date}';
  } else if (mode === 'waiting') {
    lblWait?.classList.add('active');
    if (grpCutoff) grpCutoff.style.display = 'none';
    if (grpFolder) grpFolder.style.display = 'none';
    if (grpReport) grpReport.style.display = 'none';
    if (inpSubject) inpSubject.value = 'แจ้งสถานะลูกค้ารอ NAV เพื่อจัดสรรหน่วย ณ. วันที่ {date}';
  }
}

function updateSubjectTemplate() {
  updateTemplateModeUI();
}

// --- Event Listeners Initialization ---
function initEventListeners() {
  // Mode Change Radio Buttons
  document.querySelectorAll('input[name="emailMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.emailMode = e.target.value;
      updateTemplateModeUI();
      renderIcCards();
      const modal = document.getElementById('emailPreviewModal');
      if (AppState.currentPreviewIc && modal && modal.style.display === 'flex') {
        previewEmail(AppState.currentPreviewIc);
      }
    });
  });

  // Buttons in Tab 1
  document.getElementById('btnLoadSample')?.addEventListener('click', loadSampleFile);
  document.getElementById('btnLoadAllottedSample')?.addEventListener('click', loadAllottedSampleFile);
  document.getElementById('btnClearData')?.addEventListener('click', () => {
    AppState.records = [];
    AppState.groupedByIc = {};
    AppState.selectedIcs.clear();
    document.getElementById('loadedFileBanner').style.display = 'none';
    document.getElementById('kpiGrid').style.display = 'none';
    document.getElementById('dataTableCard').style.display = 'none';
    document.getElementById('navOrderCountBadge').innerText = '0';
    document.getElementById('navIcCountBadge').innerText = '0';
    renderDataTable();
    renderIcCards();
    showToast('ล้างข้อมูลเรียบร้อย', 'info');
  });

  document.getElementById('btnProceedToDispatch')?.addEventListener('click', () => {
    document.querySelector('.nav-tab[data-tab="tab-dispatch"]')?.click();
  });

  // Filters in Tab 1
  document.getElementById('inputTableSearch')?.addEventListener('input', renderDataTable);
  document.getElementById('selectStatusFilter')?.addEventListener('change', renderDataTable);
  document.getElementById('selectTypeFilter')?.addEventListener('change', renderDataTable);
  document.getElementById('selectIcFilter')?.addEventListener('change', renderDataTable);

  // Tab 2 Selection Controls
  document.getElementById('btnSelectAllIcs')?.addEventListener('click', () => {
    Object.keys(AppState.groupedByIc).forEach(ic => AppState.selectedIcs.add(ic));
    document.querySelectorAll('.ic-checkbox').forEach(cb => cb.checked = true);
  });

  document.getElementById('btnDeselectAllIcs')?.addEventListener('click', () => {
    AppState.selectedIcs.clear();
    document.querySelectorAll('.ic-checkbox').forEach(cb => cb.checked = false);
  });

  document.getElementById('btnBatchDownloadEml')?.addEventListener('click', batchDownloadEml);

  // Contacts Management Buttons
  document.getElementById('btnAddContact')?.addEventListener('click', openAddContactModal);
  document.getElementById('btnExportContacts')?.addEventListener('click', exportContactsJson);
  document.getElementById('btnImportContacts')?.addEventListener('click', () => {
    document.getElementById('importContactsInput')?.click();
  });
  document.getElementById('importContactsInput')?.addEventListener('change', (e) => {
    if (e.target.files.length > 0) importContactsJson(e.target.files[0]);
  });
  document.getElementById('btnResetContacts')?.addEventListener('click', () => {
    if (confirm('คุณต้องการคืนค่าสมุดรายชื่อเป็นค่าเริ่มต้นหรือไม่?')) {
      AppState.contacts = [...DEFAULT_CONTACTS];
      saveContacts();
      renderContactsTable();
      showToast('คืนค่าสมุดรายชื่อเป็นค่าเริ่มต้นเรียบร้อย', 'info');
    }
  });

  document.getElementById('btnSaveContactModal')?.addEventListener('click', saveContactFromModal);
  document.getElementById('btnCloseContactModal')?.addEventListener('click', () => {
    document.getElementById('contactEditModal').style.display = 'none';
  });
  document.getElementById('btnCancelContactModal')?.addEventListener('click', () => {
    document.getElementById('contactEditModal').style.display = 'none';
  });

  // Audit Logs Buttons
  document.getElementById('btnRefreshLogs')?.addEventListener('click', loadLogs);
  document.getElementById('btnClearLogs')?.addEventListener('click', () => {
    if (confirm('คุณต้องการล้างประวัติการดำเนินการทั้งหมดหรือไม่?')) {
      AppState.logs = [];
      saveLogs();
      renderLogsTable();
      showToast('ล้างประวัติเรียบร้อย', 'info');
    }
  });

  // Preview Modal Action Buttons
  document.getElementById('btnClosePreviewModal')?.addEventListener('click', () => {
    document.getElementById('emailPreviewModal').style.display = 'none';
  });
  document.getElementById('btnClosePreviewModalFooter')?.addEventListener('click', () => {
    document.getElementById('emailPreviewModal').style.display = 'none';
  });
  document.getElementById('btnModalCopyHtml')?.addEventListener('click', () => {
    if (AppState.currentPreviewIc) copyEmailHtml(AppState.currentPreviewIc);
  });
  document.getElementById('btnModalDownloadEml')?.addEventListener('click', () => {
    if (AppState.currentPreviewIc) downloadEml(AppState.currentPreviewIc);
  });
  document.getElementById('btnModalMailto')?.addEventListener('click', () => {
    if (AppState.currentPreviewIc) openMailto(AppState.currentPreviewIc);
  });
}

// --- Utilities ---
function parseNumber(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const clean = String(val).replace(/,/g, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function formatCurrency(val) {
  return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatUnit(val) {
  return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function formatNav(val) {
  return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${escapeHtml(msg)}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
