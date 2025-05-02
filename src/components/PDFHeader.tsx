
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PDFHeaderProps {
  isLoading: boolean;
  onUploadClick: () => void;
}

const PDFHeader = ({ isLoading, onUploadClick }: PDFHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container flex justify-between items-center">
        <h1 className="text-2xl font-bold text-docusign-blue">
          SignFlow
        </h1>
        
        <div className="flex gap-2">
          <Button 
            onClick={onUploadClick}
            className="bg-docusign-blue hover:bg-docusign-darkblue"
            disabled={isLoading}
          >
            <Upload size={16} className="mr-2" />
            Upload PDF
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PDFHeader;
