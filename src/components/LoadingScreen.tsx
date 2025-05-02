
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-docusign-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium mb-1">Processing PDF...</p>
        <p className="text-sm text-gray-500">This may take a moment depending on the file size.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
