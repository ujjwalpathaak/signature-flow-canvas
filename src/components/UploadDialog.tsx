
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";
import { validatePDF } from "@/lib/pdfUtils";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected: (file: File) => void;
}

const UploadDialog = ({ isOpen, onClose, onFileSelected }: UploadDialogProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };
  
  const handleFileSelection = (file: File) => {
    if (!validatePDF(file)) return;
    
    setSelectedFile(file);
    // In a real app, you might want to show a preview here
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
      setSelectedFile(null);
      onClose();
    } else {
      toast.error("Please select a PDF file first");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setSelectedFile(null);
      onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PDF Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className={`document-dropzone ${isDragging ? "active" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClickUploadArea}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileInputChange}
            />
            <div className="flex flex-col items-center">
              <Upload size={40} className="text-docusign-blue mb-4" />
              <p className="text-lg font-medium mb-2">
                {selectedFile ? selectedFile.name : "Drag & Drop PDF here"}
              </p>
              <p className="text-sm text-gray-500">
                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "or click to browse"}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile}
              className="bg-docusign-blue hover:bg-docusign-darkblue"
            >
              <FileText size={16} className="mr-2" />
              Use This Document
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
