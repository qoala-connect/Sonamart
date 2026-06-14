export type LeadStage =
  | "NEW_INQUIRY"
  | "REQUIREMENT_ANALYSIS"
  | "VENDOR_SOURCING"
  | "QUOTATION_SENT"
  | "NEGOTIATION"
  | "CONFIRMED"
  | "PROCUREMENT"
  | "DELIVERED"
  | "CLOSED";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export type ActivityType =
  | "note"
  | "call"
  | "email"
  | "stage_change"
  | "quotation_sent"
  | "system"
  | "reminder_set";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  text: string;
  author: string;
  timestamp: number;
}

export interface Lead {
  id: string;
  customerName: string;
  company?: string;
  email: string;
  phone: string;
  city: string;
  stage: LeadStage;
  priority: LeadPriority;
  inquiryText: string;
  aiSummary: string;
  materialRequested: string;
  applicationArea: string;
  areaRequired: string;
  budget?: string;
  createdAt: number;
  updatedAt: number;
  followUpDate?: string;
  followUpNote?: string;
  assignedTo: string;
  activityLog: ActivityEntry[];
}

export interface VendorProduct {
  id: string;
  name: string;
  vendorName: string;
  materialType: string;
  color: string;
  finish: string;
  thickness: string;
  origin: string;
  city: string;
  vendorPrice: number;
  unit: string;
  stockQty: number;
  bg: string;
  textLight: boolean;
}

export interface QuotationLineItem {
  id: string;
  sourceId: string;
  name: string;
  materialType: string;
  color: string;
  finish: string;
  thickness: string;
  origin: string;
  unit: string;
  qty: number;
  vendorPrice: number;
  adminPrice: number;
  bg: string;
  textLight: boolean;
}

export interface QuotationMeta {
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  validityDays: string;
  paymentTerms: string;
  notes: string;
}
