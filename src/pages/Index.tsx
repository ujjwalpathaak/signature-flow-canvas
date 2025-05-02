import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Signature, Eraser } from "lucide-react";
import { PDFPageInfo, FieldElement, validatePDF, renderPDFPages } from "@/lib/pdfUtils";
import ElementToolbox from "@/components/ElementToolbox";
import PDFViewer from "@/components/PDFViewer";
import UploadDialog from "@/components/UploadDialog";
import { createNewElement } from "@/lib/pdfUtils";

const Index = () => {
  const [pdfPages, setPdfPages] = useState<PDFPageInfo[]>([]);
  const [elements, setElements] = useState<FieldElement[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileSelected = async (file: File) => {
    if (validatePDF(file)) {
      setIsLoading(true);
      toast.loading("Processing PDF file...");
      
      try {
        const pages = await renderPDFPages(file);
        setPdfPages(pages);
        setIsFileLoaded(true);
        toast.dismiss();
        toast.success("PDF file loaded successfully");
      } catch (error) {
        console.error("Error processing PDF:", error);
        toast.dismiss();
        toast.error("Error processing PDF");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleAddElement = (type: FieldElement['type']) => {
    if (!isFileLoaded) {
      toast.error("Please upload a PDF first");
      return;
    }
    
    // Create a draggable representation of the element
    const dragElement = document.createElement('div');
    dragElement.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    dragElement.className = 'absolute bg-docusign-blue text-white p-2 rounded opacity-70';
    document.body.appendChild(dragElement);
    
    // Set up drag data
    const handleDragStart = (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData('elementType', type);
        
        // Position the drag element
        if (dragElement) {
          dragElement.style.left = `${e.clientX - 20}px`;
          dragElement.style.top = `${e.clientY - 20}px`;
          dragElement.style.display = 'block';
        }
      }
    };
    
    const handleDrag = (e: DragEvent) => {
      if (dragElement && e.clientX > 0 && e.clientY > 0) {
        dragElement.style.left = `${e.clientX - 20}px`;
        dragElement.style.top = `${e.clientY - 20}px`;
      }
    };
    
    const handleDragEnd = () => {
      if (dragElement && dragElement.parentNode) {
        dragElement.parentNode.removeChild(dragElement);
      }
      
      // Clean up event listeners
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drag', handleDrag);
      document.removeEventListener('dragend', handleDragEnd);
    };
    
    // Attach event listeners
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drag', handleDrag);
    document.addEventListener('dragend', handleDragEnd);
    
    // Trigger drag start programmatically
    const event = new DragEvent('dragstart', { bubbles: true });
    Object.defineProperty(event, 'dataTransfer', {
      value: new DataTransfer(),
    });
    
    // We use setTimeout to allow React to update the DOM first
    setTimeout(() => {
      if (dragElement) {
        dragElement.dispatchEvent(event);
      }
    }, 0);
  };
  
  const handleAddSignature = (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    
    // If we already have a PDF loaded, add the signature to the document
    if (isFileLoaded && pdfPages.length > 0) {
      // Create a new signature element on the first page
      const newElement = createNewElement('signature', 1, 100, 100);
      newElement.value = signatureDataUrl;
      
      setElements([...elements, newElement]);
    }
  };
  
  const handleClearAll = () => {
    if (elements.length > 0) {
      if (window.confirm("Are you sure you want to clear all elements?")) {
        setElements([]);
        toast.success("All elements cleared");
      }
    } else {
      toast.info("No elements to clear");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold text-docusign-blue">
            SignFlow
          </h1>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              className="bg-docusign-blue hover:bg-docusign-darkblue"
              disabled={isLoading}
            >
              <Upload size={16} className="mr-2" />
              Upload PDF
            </Button>
          </div>
        </div>
      </header>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-docusign-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Processing PDF...</p>
          </div>
        </div>
      ) : isFileLoaded ? (
        <div className="flex flex-1 container py-6">
          {/* Left sidebar for tools */}
          <div className="w-64 pr-6">
            <ElementToolbox
              onAddElement={handleAddElement}
              onAddSignature={handleAddSignature}
            />
            
            {signature && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Your Signature</h3>
                <div className="border rounded p-2 bg-white">
                  <img
                    src={signature}
                    alt="Your signature"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            )}
            
            {elements.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-4 text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleClearAll}
              >
                <Eraser size={16} className="mr-2" />
                Clear All Elements
              </Button>
            )}
          </div>
          
          {/* Main content - PDF Viewer */}
          <div className="flex-1 border rounded-lg shadow-sm overflow-hidden bg-gray-100">
            <PDFViewer
              pdfPages={pdfPages}
              elements={elements}
              onElementsChange={setElements}
              signature={signature}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md px-4">
            <Signature size={64} className="mx-auto text-docusign-blue mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to SignFlow</h2>
            <p className="text-gray-600 mb-6">
              Upload a PDF document to get started. You'll be able to add signatures,
              text fields, and other elements to your document.
            </p>
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              className="bg-docusign-blue hover:bg-docusign-darkblue"
            >
              <Upload size={16} className="mr-2" />
              Upload PDF
            </Button>
          </div>
        </div>
      )}
      
      <UploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onFileSelected={handleFileSelected}
      />
    </div>
  );
};

export default Index;
