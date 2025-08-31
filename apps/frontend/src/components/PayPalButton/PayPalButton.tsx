import React, { useState } from "react";
import "./PayPalButton.css";

interface PayPalButtonProps {
  buttonId?: string;
  text?: string;
  className?: string;
  qrCodeImage?: string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ 
  buttonId = "YOUR_PAYPAL_BUTTON_ID", 
  text = "☕ Buy me a coffee",
  className = "",
  qrCodeImage = "/images/paypal-qr.png"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQRClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Allow QR code to be clickable if needed
  };

  return (
    <div className={`paypal-container ${className}`}>
      {/* Main floating button */}
      <button
        onClick={toggleExpanded}
        className={`paypal-float ${isExpanded ? 'expanded' : ''}`}
        aria-label="Support this project via PayPal"
        aria-expanded={isExpanded}
      >
        {text}
        <span className={`arrow ${isExpanded ? 'rotated' : ''}`}>▼</span>
      </button>

      {/* Expanding QR Code Card */}
      <div className={`qr-card ${isExpanded ? 'visible' : 'hidden'}`}>
        <div className="qr-header">
          <h3>Support via PayPal</h3>
          <button 
            onClick={toggleExpanded}
            className="close-btn"
            aria-label="Close QR code"
          >
            ×
          </button>
        </div>
        <div className="qr-content">
          <img 
            src={qrCodeImage} 
            alt="PayPal QR Code"
            className="qr-image"
            onClick={handleQRClick}
          />
          <p className="qr-description">
            Scan with your phone camera or PayPal app
          </p>
        </div>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="backdrop" 
          onClick={toggleExpanded}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default PayPalButton;
