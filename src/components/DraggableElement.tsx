
import { useRef, useState } from "react";
import { FieldElement } from "@/lib/pdfUtils";
import { cn } from "@/lib/utils";
import { Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DraggableElementProps {
  element: FieldElement;
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  scale: number;
}

const DraggableElement = ({
  element,
  onMove,
  onDelete,
  scale = 1
}: DraggableElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const initialPosRef = useRef({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      initialPosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    
    // Add event listeners to window
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    
    setIsDragging(true);
    
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      initialPosRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    
    // Add event listeners to window
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !elementRef.current?.parentElement) return;
    
    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    const x = (e.clientX - parentRect.left - initialPosRef.current.x) / scale;
    const y = (e.clientY - parentRect.top - initialPosRef.current.y) / scale;
    
    onMove(element.id, x, y);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !elementRef.current?.parentElement || e.touches.length !== 1) return;
    e.preventDefault(); // Prevent scrolling
    
    const touch = e.touches[0];
    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    const x = (touch.clientX - parentRect.left - initialPosRef.current.x) / scale;
    const y = (touch.clientY - parentRect.top - initialPosRef.current.y) / scale;
    
    onMove(element.id, x, y);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };
  
  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute draggable-element border-2 flex items-center justify-center",
        isDragging ? "border-docusign-blue z-50" : "border-dashed border-docusign-darkgray",
        element.type === "signature" ? "bg-docusign-gray/40" : "bg-white/80"
      )}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left"
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-6 bg-docusign-blue/20 flex items-center cursor-move px-1"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <GripVertical size={16} className="text-docusign-darkblue" />
        <span className="text-xs ml-1 text-docusign-darkblue">
          {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 ml-auto text-red-500 hover:bg-red-100 hover:text-red-700"
          onClick={() => onDelete(element.id)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
      
      <div className="mt-6 w-full h-full flex items-center justify-center">
        {element.type === "signature" && element.value ? (
          <img
            src={element.value}
            alt="Signature"
            className="max-w-full max-h-full object-contain"
          />
        ) : element.type === "text" ? (
          <span className="text-gray-500 text-sm">Text Field</span>
        ) : element.type === "date" ? (
          <span className="text-gray-500 text-sm">{element.value || "Date"}</span>
        ) : element.type === "checkbox" ? (
          <div className="w-5 h-5 border border-gray-400 rounded"></div>
        ) : (
          <span className="text-gray-500 text-sm">Sign Here</span>
        )}
      </div>
    </div>
  );
};

export default DraggableElement;
