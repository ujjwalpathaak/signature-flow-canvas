
import { useEffect, useState, useRef } from "react";
import { PDFPageInfo, FieldElement, createNewElement } from "@/lib/pdfUtils";
import DraggableElement from "./DraggableElement";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ZoomIn, ZoomOut, Save } from "lucide-react";

interface PDFViewerProps {
  pdfPages: PDFPageInfo[];
  elements: FieldElement[];
  onElementsChange: (elements: FieldElement[]) => void;
  signature: string | null;
}

const PDFViewer = ({
  pdfPages,
  elements,
  onElementsChange,
  signature
}: PDFViewerProps) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, pageNumber: number) => {
    e.preventDefault();
    
    const elementType = e.dataTransfer.getData("elementType") as FieldElement["type"];
    if (!elementType) return;
    
    const containerRect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - containerRect.left) / scale;
    const y = (e.clientY - containerRect.top) / scale;
    
    const newElement = createNewElement(elementType, pageNumber, x, y);
    
    // If it's a signature and we have a signature, set its value
    if (elementType === "signature" && signature) {
      newElement.value = signature;
    }
    
    onElementsChange([...elements, newElement]);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const moveElement = (id: string, x: number, y: number) => {
    const updatedElements = elements.map(el =>
      el.id === id ? { ...el, x, y } : el
    );
    onElementsChange(updatedElements);
  };
  
  const deleteElement = (id: string) => {
    const updatedElements = elements.filter(el => el.id !== id);
    onElementsChange(updatedElements);
  };
  
  const handleSaveDocument = () => {
    toast.success("Document saved successfully");
    // In a real app, you'd implement the actual saving logic here
  };
  
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2));
  };
  
  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={zoomOut}>
            <ZoomOut size={18} />
          </Button>
          <Slider
            className="w-32"
            value={[scale * 100]}
            min={50}
            max={200}
            step={10}
            onValueChange={values => setScale(values[0] / 100)}
          />
          <Button variant="outline" size="icon" onClick={zoomIn}>
            <ZoomIn size={18} />
          </Button>
          <span className="text-sm text-gray-500">
            {Math.round(scale * 100)}%
          </span>
        </div>
        <Button onClick={handleSaveDocument}>
          <Save size={16} className="mr-2" />
          Save Document
        </Button>
      </div>
      
      <div 
        className="flex-1 overflow-auto"
        ref={containerRef}
      >
        <div className="flex flex-col items-center pb-8">
          {pdfPages.map((page) => (
            <div 
              key={page.pageNumber}
              className="pdf-page bg-white mb-4"
              style={{
                width: page.width * scale,
                height: page.height * scale,
              }}
            >
              <div
                className="relative"
                style={{
                  width: page.width,
                  height: page.height,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left'
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, page.pageNumber)}
              >
                <img 
                  src={page.dataURL} 
                  alt={`Page ${page.pageNumber}`}
                  className="absolute top-0 left-0 w-full h-full"
                />
                
                {elements
                  .filter(el => el.pageNumber === page.pageNumber)
                  .map(element => (
                    <DraggableElement
                      key={element.id}
                      element={element}
                      onMove={moveElement}
                      onDelete={deleteElement}
                      scale={1}
                    />
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
