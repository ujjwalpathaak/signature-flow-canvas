
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldElement } from "@/lib/pdfUtils";
import { Signature, Text, Calendar, CheckSquare, PenLine } from "lucide-react";
import SignatureCanvas from "./SignatureCanvas";

interface ElementToolboxProps {
  onAddElement: (type: FieldElement['type']) => void;
  onAddSignature: (signatureDataUrl: string) => void;
}

const ElementToolbox = ({ onAddElement, onAddSignature }: ElementToolboxProps) => {
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  
  const handleAddSignature = (signatureDataUrl: string) => {
    onAddSignature(signatureDataUrl);
  };
  
  return (
    <>
      <Card className="w-full mb-4">
        <CardContent className="p-4">
          <Tabs defaultValue="fields" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
            </TabsList>
            <TabsContent value="fields" className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline"
                  className="flex flex-col items-center justify-center p-4 h-20"
                  onClick={() => onAddElement("text")}
                >
                  <Text size={24} className="mb-1 text-docusign-blue" />
                  <span className="text-xs">Text</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex flex-col items-center justify-center p-4 h-20"
                  onClick={() => onAddElement("date")}
                >
                  <Calendar size={24} className="mb-1 text-docusign-blue" />
                  <span className="text-xs">Date</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex flex-col items-center justify-center p-4 h-20"
                  onClick={() => onAddElement("checkbox")}
                >
                  <CheckSquare size={24} className="mb-1 text-docusign-blue" />
                  <span className="text-xs">Checkbox</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signature" className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  className="flex flex-col items-center justify-center p-4 h-20"
                  onClick={() => onAddElement("signature")}
                >
                  <Signature size={24} className="mb-1 text-docusign-blue" />
                  <span className="text-xs">Signature Field</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex flex-col items-center justify-center p-4 h-20"
                  onClick={() => setSignatureModalOpen(true)}
                >
                  <PenLine size={24} className="mb-1 text-docusign-blue" />
                  <span className="text-xs">Draw Signature</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <SignatureCanvas
        isOpen={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        onSave={handleAddSignature}
      />
    </>
  );
};

export default ElementToolbox;
