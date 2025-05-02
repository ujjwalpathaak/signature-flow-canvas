
import { toast } from "sonner";

export interface PDFPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  dataURL: string;
}

export interface FieldElement {
  id: string;
  type: "signature" | "text" | "date" | "checkbox";
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string;
  pageNumber: number;
}

export const validatePDF = (file: File): boolean => {
  if (!file.type.includes("pdf")) {
    toast.error("Please upload a valid PDF file");
    return false;
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    toast.error("PDF file size must be less than 10MB");
    return false;
  }
  
  return true;
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const createNewElement = (
  type: FieldElement['type'],
  pageNumber: number,
  x: number,
  y: number
): FieldElement => {
  const sizes = {
    signature: { width: 200, height: 80 },
    text: { width: 200, height: 40 },
    date: { width: 120, height: 40 },
    checkbox: { width: 30, height: 30 },
  };

  return {
    id: generateRandomId(),
    type,
    x,
    y,
    width: sizes[type].width,
    height: sizes[type].height,
    pageNumber,
    value: type === 'date' ? new Date().toLocaleDateString() : '',
  };
};
