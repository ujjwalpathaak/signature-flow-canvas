
import { useState } from "react";
import { toast } from "sonner";
import { PDFPageInfo, validatePDF, renderPDFPages } from "@/lib/pdfUtils";
import UploadDialog from "@/components/UploadDialog";
import PDFHeader from "@/components/PDFHeader";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoadingScreen from "@/components/LoadingScreen";
import PDFEditor from "@/components/PDFEditor";

const Index = () => {
  const [pdfPages, setPdfPages] = useState<PDFPageInfo[]>([]);
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <PDFHeader 
        isLoading={isLoading}
        onUploadClick={() => setUploadDialogOpen(true)}
      />
      
      {isLoading ? (
        <LoadingScreen />
      ) : isFileLoaded ? (
        <PDFEditor 
          pdfPages={pdfPages}
          isFileLoaded={isFileLoaded}
        />
      ) : (
        <WelcomeScreen onUploadClick={() => setUploadDialogOpen(true)} />
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
