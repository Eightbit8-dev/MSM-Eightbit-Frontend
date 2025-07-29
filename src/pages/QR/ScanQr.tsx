// components/QRScanner.tsx
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type QRData = {
  [key: string]: string;
};

const QRScanner: React.FC = () => {
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<QRData | null>(null);
  const scannerRef = useRef<HTMLDivElement | null>(null);

  const parseQRData = (data: string): QRData => {
    const lines = data.split("\n").filter((line) => line.trim() !== "");
    const result: QRData = {};

    for (const line of lines) {
      const [key, value] = line.split(":");
      if (key && value) {
        result[key.trim()] = value.trim();
      }
    }

    return result;
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScannedText(decodedText);
        const parsed = parseQRData(decodedText);
        setParsedData(parsed);
        scanner.clear();
      },
      (errorMessage) => {
        console.warn("QR Code scan error", errorMessage);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="p-4">
      <div ref={scannerRef} id="qr-reader" style={{ width: "300px" }} />
      {parsedData && (
        <div className="mt-6 border rounded-lg p-4 bg-gray-50 shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-4">Machine Details</h2>
          <ul className="space-y-2">
            {Object.entries(parsedData).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="font-semibold">{key}</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
