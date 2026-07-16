// Realistic demo data for Mannat Packaging — PackInsight ERP
// Values are hand-tuned to look like a mid-sized Indian corrugated packaging plant.

export const COMPANY = {
  name: "Mannat Packaging",
  legal: "Mannat Packaging Pvt. Ltd.",
  gstin: "09ABCDE1234F1Z5",
  address: "Plot 47, Sector 8, Sahibabad Industrial Area, Ghaziabad, UP 201010",
  phone: "+91 120 4567 890",
  email: "info@mannatpackaging.in",
  website: "www.mannatpackaging.in",
  tagline: "Corrugated packaging you can trust",
};

export const CURRENT_USER = {
  name: "Lavanya Satyawali",
  designation: "Data Analyst Intern",
  department: "Operations & Analytics",
  email: "lavanya.satyawali@mannatpackaging.in",
  phone: "+91 98765 43210",
  employeeId: "MP-1042",
  role: "Analyst" as const,
  avatarInitials: "LS",
};

export type Role = "Admin" | "Manager" | "Analyst" | "Operator";

export interface Customer {
  id: string;
  name: string;
  industry: "FMCG" | "Electronics" | "Pharma" | "Food" | "E-commerce";
  contact: string;
  email: string;
  phone: string;
  city: string;
  gstin: string;
  creditLimit: number; // INR
  outstanding: number;
  status: "Active" | "On Hold" | "Inactive";
  since: string;
}

export const CUSTOMERS: Customer[] = [
  { id: "CUST-001", name: "Dabur India Ltd.", industry: "FMCG", contact: "Rajeev Menon", email: "rajeev.menon@dabur.com", phone: "+91 98111 22334", city: "Ghaziabad", gstin: "09AABCD1234E1Z1", creditLimit: 5000000, outstanding: 1240000, status: "Active", since: "2019-04-12" },
  { id: "CUST-002", name: "Havells Electronics", industry: "Electronics", contact: "Priya Sharma", email: "priya.s@havells.com", phone: "+91 99001 55678", city: "Noida", gstin: "09HAVLL7890K1Z9", creditLimit: 3500000, outstanding: 890000, status: "Active", since: "2020-08-03" },
  { id: "CUST-003", name: "Cipla Pharmaceuticals", industry: "Pharma", contact: "Dr. Anand Rao", email: "anand.rao@cipla.com", phone: "+91 90080 12345", city: "Mumbai", gstin: "27CIPLA5678M1Z4", creditLimit: 6000000, outstanding: 2100000, status: "Active", since: "2018-11-21" },
  { id: "CUST-004", name: "Britannia Foods", industry: "Food", contact: "Meera Iyer", email: "meera.iyer@britannia.co.in", phone: "+91 98450 78912", city: "Bengaluru", gstin: "29BRITN3456L1Z6", creditLimit: 4200000, outstanding: 550000, status: "Active", since: "2021-02-14" },
  { id: "CUST-005", name: "Flipkart Fulfilment", industry: "E-commerce", contact: "Karan Verma", email: "karan.verma@flipkart.com", phone: "+91 97400 11223", city: "Gurugram", gstin: "06FLPKT2468N1Z2", creditLimit: 8000000, outstanding: 3560000, status: "Active", since: "2020-01-09" },
  { id: "CUST-006", name: "Amul Dairy", industry: "Food", contact: "Nirav Patel", email: "nirav.patel@amul.coop", phone: "+91 99250 44556", city: "Anand", gstin: "24AMULD9012P1Z7", creditLimit: 3800000, outstanding: 720000, status: "Active", since: "2019-09-30" },
  { id: "CUST-007", name: "Sun Pharma", industry: "Pharma", contact: "Sneha Kapoor", email: "sneha.kapoor@sunpharma.com", phone: "+91 98332 77889", city: "Mumbai", gstin: "27SUNPH1122Q1Z3", creditLimit: 4500000, outstanding: 0, status: "On Hold", since: "2022-03-18" },
  { id: "CUST-008", name: "Meesho Logistics", industry: "E-commerce", contact: "Rohit Bansal", email: "rohit.b@meesho.com", phone: "+91 96100 33445", city: "Bengaluru", gstin: "29MESHO3344R1Z8", creditLimit: 3000000, outstanding: 1810000, status: "Active", since: "2022-07-05" },
  { id: "CUST-009", name: "Nestle India", industry: "FMCG", contact: "Aditi Malhotra", email: "aditi.m@nestle.in", phone: "+91 98999 66778", city: "Gurugram", gstin: "06NESTL5566S1Z0", creditLimit: 5500000, outstanding: 980000, status: "Active", since: "2018-05-22" },
  { id: "CUST-010", name: "boAt Lifestyle", industry: "Electronics", contact: "Aman Gupta", email: "aman.gupta@imaginemarketing.in", phone: "+91 99870 22110", city: "Delhi", gstin: "07BOATL7788T1Z5", creditLimit: 2500000, outstanding: 430000, status: "Active", since: "2023-01-16" },
];

export interface SKU {
  id: string;
  code: string;
  name: string;
  size: string; // L x W x H mm
  gsm: number;
  ply: 3 | 5 | 7;
  flute: "B" | "C" | "E" | "BC";
  price: number; // per unit INR
  moq: number;
}

export const SKUS: SKU[] = [
  { id: "SKU-101", code: "MP-3B-300-200-150", name: "3-ply Regular Slotted Carton", size: "300×200×150", gsm: 150, ply: 3, flute: "B", price: 18, moq: 500 },
  { id: "SKU-102", code: "MP-5C-500-400-300", name: "5-ply Heavy Duty Shipper", size: "500×400×300", gsm: 180, ply: 5, flute: "C", price: 42, moq: 250 },
  { id: "SKU-103", code: "MP-3E-250-180-120", name: "3-ply E-flute Retail Box", size: "250×180×120", gsm: 140, ply: 3, flute: "E", price: 22, moq: 1000 },
  { id: "SKU-104", code: "MP-7BC-800-600-500", name: "7-ply Export Grade Carton", size: "800×600×500", gsm: 200, ply: 7, flute: "BC", price: 96, moq: 100 },
  { id: "SKU-105", code: "MP-5C-400-300-250-P", name: "5-ply Pharma Cold-chain", size: "400×300×250", gsm: 200, ply: 5, flute: "C", price: 58, moq: 500 },
  { id: "SKU-106", code: "MP-3B-350-250-200-F", name: "3-ply Food-grade FMCG Box", size: "350×250×200", gsm: 160, ply: 3, flute: "B", price: 26, moq: 500 },
  { id: "SKU-107", code: "MP-5BC-600-450-350-E", name: "5-ply E-com Fulfilment Box", size: "600×450×350", gsm: 180, ply: 5, flute: "BC", price: 51, moq: 250 },
  { id: "SKU-108", code: "MP-3B-200-150-100", name: "3-ply Small Mailer", size: "200×150×100", gsm: 140, ply: 3, flute: "B", price: 12, moq: 1000 },
];

export interface Machine {
  id: string;
  name: string;
  type: "Corrugator" | "Printer" | "Die-Cutter" | "Folder-Gluer";
  status: "Running" | "Idle" | "Down" | "Maintenance";
  operator: string;
  currentJob?: string;
  oee: number; // %
  outputToday: number;
  target: number;
}

export const MACHINES: Machine[] = [
  { id: "M-01", name: "Corrugator Line A", type: "Corrugator", status: "Running", operator: "Suresh Kumar", currentJob: "JOB-2451", oee: 82.4, outputToday: 18400, target: 22000 },
  { id: "M-02", name: "Corrugator Line B", type: "Corrugator", status: "Running", operator: "Ramesh Yadav", currentJob: "JOB-2454", oee: 76.1, outputToday: 15200, target: 20000 },
  { id: "M-03", name: "Flexo Printer 4-Color", type: "Printer", status: "Running", operator: "Vinod Singh", currentJob: "JOB-2452", oee: 79.8, outputToday: 12100, target: 15000 },
  { id: "M-04", name: "Flexo Printer 2-Color", type: "Printer", status: "Idle", operator: "Ashok Meena", oee: 68.2, outputToday: 6800, target: 12000 },
  { id: "M-05", name: "Rotary Die-Cutter", type: "Die-Cutter", status: "Running", operator: "Manoj Tiwari", currentJob: "JOB-2453", oee: 81.0, outputToday: 9600, target: 11500 },
  { id: "M-06", name: "Auto Folder-Gluer", type: "Folder-Gluer", status: "Down", operator: "Deepak Sharma", oee: 54.5, outputToday: 3200, target: 10000 },
  { id: "M-07", name: "Semi-Auto Folder-Gluer", type: "Folder-Gluer", status: "Maintenance", operator: "Ravi Prakash", oee: 61.7, outputToday: 0, target: 8000 },
];

export interface ProductionJob {
  id: string;
  sku: string;
  customer: string;
  quantity: number;
  produced: number;
  machine: string;
  shift: "A" | "B" | "C";
  startDate: string;
  dueDate: string;
  status: "Queued" | "In Progress" | "Completed" | "Delayed";
}

export const JOBS: ProductionJob[] = [
  { id: "JOB-2451", sku: "SKU-102", customer: "Flipkart Fulfilment", quantity: 20000, produced: 14200, machine: "M-01", shift: "A", startDate: "2026-07-14", dueDate: "2026-07-17", status: "In Progress" },
  { id: "JOB-2452", sku: "SKU-106", customer: "Dabur India Ltd.", quantity: 15000, produced: 8500, machine: "M-03", shift: "A", startDate: "2026-07-15", dueDate: "2026-07-18", status: "In Progress" },
  { id: "JOB-2453", sku: "SKU-105", customer: "Cipla Pharmaceuticals", quantity: 10000, produced: 6100, machine: "M-05", shift: "B", startDate: "2026-07-15", dueDate: "2026-07-19", status: "In Progress" },
  { id: "JOB-2454", sku: "SKU-107", customer: "Meesho Logistics", quantity: 25000, produced: 5400, machine: "M-02", shift: "A", startDate: "2026-07-16", dueDate: "2026-07-20", status: "In Progress" },
  { id: "JOB-2455", sku: "SKU-101", customer: "Amul Dairy", quantity: 12000, produced: 12000, machine: "M-01", shift: "C", startDate: "2026-07-12", dueDate: "2026-07-15", status: "Completed" },
  { id: "JOB-2456", sku: "SKU-104", customer: "Havells Electronics", quantity: 5000, produced: 0, machine: "M-05", shift: "B", startDate: "2026-07-17", dueDate: "2026-07-22", status: "Queued" },
  { id: "JOB-2457", sku: "SKU-108", customer: "boAt Lifestyle", quantity: 30000, produced: 4200, machine: "M-03", shift: "C", startDate: "2026-07-14", dueDate: "2026-07-16", status: "Delayed" },
  { id: "JOB-2458", sku: "SKU-103", customer: "Nestle India", quantity: 18000, produced: 0, machine: "M-04", shift: "A", startDate: "2026-07-18", dueDate: "2026-07-21", status: "Queued" },
];

export interface Downtime {
  id: string;
  machine: string;
  reason: string;
  minutes: number;
  shift: "A" | "B" | "C";
  date: string;
}

export const DOWNTIME: Downtime[] = [
  { id: "DT-01", machine: "Auto Folder-Gluer", reason: "Belt breakage", minutes: 145, shift: "A", date: "2026-07-16" },
  { id: "DT-02", machine: "Semi-Auto Folder-Gluer", reason: "Preventive Maintenance", minutes: 240, shift: "B", date: "2026-07-16" },
  { id: "DT-03", machine: "Flexo Printer 2-Color", reason: "Ink change over", minutes: 55, shift: "A", date: "2026-07-16" },
  { id: "DT-04", machine: "Corrugator Line B", reason: "Reel splicing", minutes: 22, shift: "C", date: "2026-07-15" },
  { id: "DT-05", machine: "Rotary Die-Cutter", reason: "Die replacement", minutes: 38, shift: "B", date: "2026-07-15" },
];

export interface DefectLog {
  id: string;
  date: string;
  sku: string;
  stage: "Corrugation" | "Printing" | "Die-Cutting" | "Gluing" | "Packing";
  type: string;
  quantity: number;
  severity: "Minor" | "Major" | "Critical";
  reportedBy: string;
}

export const DEFECTS: DefectLog[] = [
  { id: "NCR-1201", date: "2026-07-16", sku: "SKU-102", stage: "Printing", type: "Print misalignment", quantity: 240, severity: "Major", reportedBy: "Priya Nair" },
  { id: "NCR-1202", date: "2026-07-16", sku: "SKU-106", stage: "Gluing", type: "Weak glue bond", quantity: 180, severity: "Major", reportedBy: "Arun Kumar" },
  { id: "NCR-1203", date: "2026-07-15", sku: "SKU-105", stage: "Corrugation", type: "Warping / Bow", quantity: 95, severity: "Minor", reportedBy: "Priya Nair" },
  { id: "NCR-1204", date: "2026-07-15", sku: "SKU-104", stage: "Die-Cutting", type: "Cut depth deviation", quantity: 60, severity: "Minor", reportedBy: "Arun Kumar" },
  { id: "NCR-1205", date: "2026-07-14", sku: "SKU-107", stage: "Printing", type: "Ink smudging", quantity: 320, severity: "Critical", reportedBy: "Rekha Devi" },
  { id: "NCR-1206", date: "2026-07-14", sku: "SKU-101", stage: "Packing", type: "Loose strapping", quantity: 45, severity: "Minor", reportedBy: "Rekha Devi" },
  { id: "NCR-1207", date: "2026-07-13", sku: "SKU-108", stage: "Corrugation", type: "Delamination", quantity: 130, severity: "Major", reportedBy: "Priya Nair" },
];

export interface InventoryItem {
  id: string;
  name: string;
  category: "Paper Reel" | "Glue" | "Ink" | "Stitching Wire" | "Finished Goods";
  uom: string;
  stock: number;
  reorderLevel: number;
  supplier: string;
  lastUpdated: string;
}

export const INVENTORY: InventoryItem[] = [
  { id: "RAW-01", name: "Kraft Liner 150 GSM", category: "Paper Reel", uom: "kg", stock: 24500, reorderLevel: 15000, supplier: "ITC Paperboards", lastUpdated: "2026-07-16" },
  { id: "RAW-02", name: "Kraft Liner 180 GSM", category: "Paper Reel", uom: "kg", stock: 9800, reorderLevel: 12000, supplier: "JK Paper", lastUpdated: "2026-07-16" },
  { id: "RAW-03", name: "Fluting Medium 120 GSM", category: "Paper Reel", uom: "kg", stock: 18200, reorderLevel: 15000, supplier: "Century Pulp & Paper", lastUpdated: "2026-07-15" },
  { id: "RAW-04", name: "Corrugation Starch Glue", category: "Glue", uom: "kg", stock: 620, reorderLevel: 800, supplier: "Roquette India", lastUpdated: "2026-07-16" },
  { id: "RAW-05", name: "Water-based Flexo Ink (Cyan)", category: "Ink", uom: "L", stock: 340, reorderLevel: 200, supplier: "Sakata Inx", lastUpdated: "2026-07-15" },
  { id: "RAW-06", name: "Water-based Flexo Ink (Magenta)", category: "Ink", uom: "L", stock: 180, reorderLevel: 200, supplier: "Sakata Inx", lastUpdated: "2026-07-15" },
  { id: "RAW-07", name: "Stitching Wire 22 SWG", category: "Stitching Wire", uom: "kg", stock: 480, reorderLevel: 300, supplier: "Bansal Wires", lastUpdated: "2026-07-14" },
  { id: "FG-101", name: "3-ply RSC 300×200×150", category: "Finished Goods", uom: "pcs", stock: 12400, reorderLevel: 5000, supplier: "In-house", lastUpdated: "2026-07-16" },
  { id: "FG-105", name: "5-ply Pharma Cold-chain 400×300×250", category: "Finished Goods", uom: "pcs", stock: 3900, reorderLevel: 4000, supplier: "In-house", lastUpdated: "2026-07-16" },
];

export interface SalesOrder {
  id: string;
  customer: string;
  sku: string;
  quantity: number;
  amount: number;
  orderDate: string;
  dueDate: string;
  status: "Quotation" | "Confirmed" | "In Production" | "Dispatched" | "Delivered";
  payment: "Pending" | "Partial" | "Paid" | "Overdue";
}

export const ORDERS: SalesOrder[] = [
  { id: "SO-8801", customer: "Flipkart Fulfilment", sku: "SKU-102", quantity: 20000, amount: 840000, orderDate: "2026-07-10", dueDate: "2026-07-17", status: "In Production", payment: "Partial" },
  { id: "SO-8802", customer: "Dabur India Ltd.", sku: "SKU-106", quantity: 15000, amount: 390000, orderDate: "2026-07-11", dueDate: "2026-07-18", status: "In Production", payment: "Pending" },
  { id: "SO-8803", customer: "Cipla Pharmaceuticals", sku: "SKU-105", quantity: 10000, amount: 580000, orderDate: "2026-07-11", dueDate: "2026-07-19", status: "In Production", payment: "Paid" },
  { id: "SO-8804", customer: "Amul Dairy", sku: "SKU-101", quantity: 12000, amount: 216000, orderDate: "2026-07-05", dueDate: "2026-07-15", status: "Delivered", payment: "Paid" },
  { id: "SO-8805", customer: "Havells Electronics", sku: "SKU-104", quantity: 5000, amount: 480000, orderDate: "2026-07-12", dueDate: "2026-07-22", status: "Confirmed", payment: "Pending" },
  { id: "SO-8806", customer: "boAt Lifestyle", sku: "SKU-108", quantity: 30000, amount: 360000, orderDate: "2026-07-09", dueDate: "2026-07-16", status: "In Production", payment: "Partial" },
  { id: "SO-8807", customer: "Meesho Logistics", sku: "SKU-107", quantity: 25000, amount: 1275000, orderDate: "2026-07-12", dueDate: "2026-07-20", status: "In Production", payment: "Overdue" },
  { id: "SO-8808", customer: "Nestle India", sku: "SKU-103", quantity: 18000, amount: 396000, orderDate: "2026-07-13", dueDate: "2026-07-21", status: "Confirmed", payment: "Pending" },
  { id: "SO-8809", customer: "Britannia Foods", sku: "SKU-106", quantity: 22000, amount: 572000, orderDate: "2026-07-08", dueDate: "2026-07-14", status: "Dispatched", payment: "Paid" },
  { id: "SO-8810", customer: "Sun Pharma", sku: "SKU-105", quantity: 8000, amount: 464000, orderDate: "2026-07-06", dueDate: "2026-07-13", status: "Quotation", payment: "Pending" },
];

export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: "Production" | "Quality" | "Sales" | "Warehouse" | "Admin" | "Analytics";
  shift: "A" | "B" | "C" | "General";
  phone: string;
  email: string;
  status: "Present" | "On Leave" | "Absent";
  performance: number; // %
  joined: string;
}

export const EMPLOYEES: Employee[] = [
  { id: "MP-1001", name: "Rakesh Aggarwal", designation: "Plant Manager", department: "Production", shift: "General", phone: "+91 98111 00001", email: "rakesh.a@mannatpackaging.in", status: "Present", performance: 92, joined: "2015-06-10" },
  { id: "MP-1012", name: "Suresh Kumar", designation: "Corrugator Operator", department: "Production", shift: "A", phone: "+91 98111 00012", email: "suresh.k@mannatpackaging.in", status: "Present", performance: 88, joined: "2018-03-04" },
  { id: "MP-1015", name: "Vinod Singh", designation: "Printer Operator", department: "Production", shift: "A", phone: "+91 98111 00015", email: "vinod.s@mannatpackaging.in", status: "Present", performance: 84, joined: "2019-11-22" },
  { id: "MP-1023", name: "Priya Nair", designation: "QA Executive", department: "Quality", shift: "A", phone: "+91 98111 00023", email: "priya.n@mannatpackaging.in", status: "Present", performance: 91, joined: "2020-07-15" },
  { id: "MP-1030", name: "Karthik Reddy", designation: "Sales Manager", department: "Sales", shift: "General", phone: "+91 98111 00030", email: "karthik.r@mannatpackaging.in", status: "Present", performance: 89, joined: "2017-09-19" },
  { id: "MP-1034", name: "Anjali Bhatt", designation: "Warehouse Supervisor", department: "Warehouse", shift: "B", phone: "+91 98111 00034", email: "anjali.b@mannatpackaging.in", status: "On Leave", performance: 82, joined: "2021-01-11" },
  { id: "MP-1042", name: "Lavanya Satyawali", designation: "Data Analyst Intern", department: "Analytics", shift: "General", phone: "+91 98765 43210", email: "lavanya.satyawali@mannatpackaging.in", status: "Present", performance: 94, joined: "2026-05-01" },
];

// 30-day production trend
export const PRODUCTION_TREND = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 45000 + Math.sin(i / 3) * 6000 + (i > 20 ? 4000 : 0);
  const output = Math.round(base + Math.random() * 4000);
  const target = 52000;
  return {
    date: `${String(day).padStart(2, "0")} Jun`,
    output,
    target,
    defects: Math.round(output * (0.015 + Math.random() * 0.01)),
  };
});

export const REVENUE_TREND = [
  { month: "Jan", revenue: 4200000, target: 4500000 },
  { month: "Feb", revenue: 4650000, target: 4500000 },
  { month: "Mar", revenue: 5120000, target: 5000000 },
  { month: "Apr", revenue: 4890000, target: 5000000 },
  { month: "May", revenue: 5340000, target: 5200000 },
  { month: "Jun", revenue: 5980000, target: 5500000 },
  { month: "Jul", revenue: 4120000, target: 5800000 },
];

export const DEFECT_PARETO = [
  { type: "Print misalignment", count: 420 },
  { type: "Weak glue bond", count: 310 },
  { type: "Ink smudging", count: 265 },
  { type: "Delamination", count: 180 },
  { type: "Warping / Bow", count: 145 },
  { type: "Cut deviation", count: 92 },
  { type: "Loose strapping", count: 48 },
];

export const RECENT_ACTIVITY = [
  { id: 1, at: "10:42", who: "Suresh Kumar", what: "Completed JOB-2455 (Amul, 12,000 pcs)", tone: "success" as const },
  { id: 2, at: "10:28", who: "System", what: "Low stock alert: Fluting Medium 120 GSM below reorder", tone: "warning" as const },
  { id: 3, at: "10:11", who: "Priya Nair", what: "NCR-1201 raised — Print misalignment on SKU-102", tone: "destructive" as const },
  { id: 4, at: "09:55", who: "Karthik Reddy", what: "New order SO-8810 from Sun Pharma (Quotation)", tone: "info" as const },
  { id: 5, at: "09:32", who: "Deepak Sharma", what: "Auto Folder-Gluer went DOWN — Belt breakage", tone: "destructive" as const },
  { id: 6, at: "09:05", who: "Anjali Bhatt", what: "Received 8T Kraft Liner 150 GSM from ITC Paperboards", tone: "success" as const },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const formatNum = (n: number) => new Intl.NumberFormat("en-IN").format(n);
