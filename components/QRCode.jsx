"use client";
import { QRCodeSVG } from "qrcode.react";

export default function QRCode({ value }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <QRCodeSVG value={value} size={200} level="H" includeMargin={true} />
    </div>
  );
}
