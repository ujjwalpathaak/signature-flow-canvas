
import { toast } from "sonner";
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker using a more reliable approach
const pdfjsWorkerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

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

export const renderPDFPages = async (file: File): Promise<PDFPageInfo[]> => {
  try {
    // Convert PDF file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    
    const totalPages = pdf.numPages;
    const pages: PDFPageInfo[] = [];
    
    // Process each page
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      
      // Get viewport at default scale
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas dimensions to match the viewport
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
      
      // Create page info object
      pages.push({
        pageNumber: i,
        width: viewport.width,
        height: viewport.height,
        dataURL: canvas.toDataURL(),
      });
    }
    
    return pages;
  } catch (error) {
    console.error('Error rendering PDF:', error);
    toast.error('Failed to render PDF. Please try another file.');
    throw error;
  }
};
