"use client";

import { useRef, useEffect, useState } from "react";
import { Camera, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);
  const processedDataRef = useRef(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
    error: scanError,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      processedDataRef.current = null;

      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        base64Data: base64,
      };

      await scanReceiptFn(fileData);
    } catch (error) {
      console.error("Receipt scan failed:", error);
      toast.error(`Scanning failed: ${error.message || "Unknown error"}`);
    }
  };

  useEffect(() => {
    if (
      scannedData &&
      !scanReceiptLoading &&
      processedDataRef.current !== scannedData
    ) {
      processedDataRef.current = scannedData;

      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully");
    } else if (scanError && !scanReceiptLoading) {
      toast.error(
        `Failed to scan receipt: ${scanError.message || "Unknown error"}`
      );
    }
  }, [scanReceiptLoading, scannedData, scanError, onScanComplete]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    toast.info("Please try scanning again with a clearer image");
    setTimeout(() => fileInputRef.current?.click(), 500);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>

      {scanError && (
        <div className="flex flex-col gap-2 w-full mt-2">
          <p className="text-sm text-red-500">
            {scanError.message || "Failed to scan receipt"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again with a Clearer Image
          </Button>
        </div>
      )}
    </div>
  );
}
