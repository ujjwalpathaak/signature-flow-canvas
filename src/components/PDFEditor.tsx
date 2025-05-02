
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { PDFPageInfo, FieldElement } from "@/lib/pdfUtils";
import ElementToolbox from "@/components/ElementToolbox";
import PDFViewer from "@/components/PDFViewer";
import { toast } from "sonner";
import { createNewElement } from "@/lib/pdfUtils";

interface PDFEditorProps {
  pdfPages: PDFPageInfo[];
  isFileLoaded: boolean;
}

const PDFEditor = ({ pdfPages, isFileLoaded }: PDFEditorProps) => {
  const [elements, setElements] = useState<FieldElement[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  
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
  );
};

export default PDFEditor;
