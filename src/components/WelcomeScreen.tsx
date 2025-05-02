
import { Button } from "@/components/ui/button";
import { Signature, Upload } from "lucide-react";

interface WelcomeScreenProps {
  onUploadClick: () => void;
}

const WelcomeScreen = ({ onUploadClick }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <Signature size={64} className="mx-auto text-docusign-blue mb-4" />
        <h2 className="text-2xl font-bold mb-2">Welcome to SignFlow</h2>
        <p className="text-gray-600 mb-6">
          Upload a PDF document to get started. You'll be able to add signatures,
          text fields, and other elements to your document.
        </p>
        <Button 
          onClick={onUploadClick}
          className="bg-docusign-blue hover:bg-docusign-darkblue"
        >
          <Upload size={16} className="mr-2" />
          Upload PDF
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
