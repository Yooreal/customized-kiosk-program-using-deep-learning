import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import './ElderlyBarcodeScannerScreen.css';

const ElderlyBarcodeScannerScreen = ({ applyDiscount }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isEmployeePopupVisible, setIsEmployeePopupVisible] = useState(false);
  const navigate = useNavigate();

  // Voice guidance function
  const playVoiceGuidance = (message) => {
    if ('speechSynthesis' in window && !window.barcodeScannerVoicePlayed) {
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = 'ko-KR'; // Set language to Korean
      window.speechSynthesis.speak(speech);
      window.barcodeScannerVoicePlayed = true; // Ensure it plays only once
    }
  };

  useEffect(() => {
    playVoiceGuidance("카메라 인식 시작 버튼을 누르고 바코드를 보여주면 자동으로 인식됩니다. 인식이 안되면 직원 호출 버튼을 눌러 도움을 요청하세요.");

    let scanner;
    if (!isScanning) return;

    scanner = new Html5QrcodeScanner("elderly-barcodescanner-reader", {
      fps: 30, qrbox: { width: 500, height: 500 },
      supportedScanFormats: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128
      ]
    });

    const handleResult = (result) => {
      console.log('QR Code scanned: ', result);
      scanner.clear();
      setShowPopup(true);
      setPopupMessage('인식 완료! 잠시만 기다려주세요.');

      setTimeout(() => {
        setShowPopup(false);
        if (applyDiscount) {
          applyDiscount();
        } else {
          console.error('applyDiscount is not a function');
        }
        navigate('/elderly-payment-completion');
      }, 3000);
    };

    scanner.render(handleResult, (error) => {
      console.warn(`QR Code scanning failed: ${error}`);
    });

    return () => scanner.clear();
  }, [isScanning, applyDiscount, navigate]);

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    navigate('/elderly-barcode-scanner');
  };

  const handleEmployeeCall = () => {
    setIsEmployeePopupVisible(true);
    setTimeout(() => {
      setIsEmployeePopupVisible(false);
    }, 5000);
  };

  return (
    <div className="elderly-barcodescannerscreen-scanner-container">
      <h1>바코드를 스캐너에<br />인식해 주세요.</h1>
      {!isScanning && (
        <button className="elderly-barcodescannerscreen-start-scan-button" onClick={handleStartScan}>카메라 인식 시작</button>
      )}

      {isScanning && (
        <div className="elderly-barcodescannerscreen-stop-scan-container">
          <button className="elderly-barcodescannerscreen-stop-scan-button" onClick={handleStopScan}>스캔 중지</button>
        </div>
      )}

      <div className="elderly-barcodescanner-scanner-instructions">
        <div id="elderly-barcodescanner-reader" style={{ width: "100%" }}></div>
        <p>인식이 안되는 경우 <span className="elderly-barcodescannerscreen-scanner-highlight">직원호출</span> 버튼을 눌러주세요.<br />주문을 직접 도와드리겠습니다.</p>
      </div>

      {showPopup && (
        <div className="dimmed">
          <div className="elderly-barcodescannerscreen-scanner-employee-popup">
            <div className="elderly-barcodescannerscreen-scanner-employee-popup-content">
              <p className="elderly-barcodescannerscreen-scanner-employee-popup-message">{popupMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add the back button and employee call button side by side */}
      <div className="elderly-barcodescannerscreen-scanner-actions">
        <button className="elderly-barcodescannerscreen-scanner-back-button" onClick={() => navigate('/elderly-payment-method')}>뒤로가기</button>
        <button className="elderly-barcodescannerscreen-call-employee-button" onClick={handleEmployeeCall}>직원 호출</button>
      </div>

      {/* Employee Call Popup */}
      {isEmployeePopupVisible && (
        <div className="dimmed">
          <div className="elderly-barcodescannerscreen-employee-popup">
            <div className="elderly-barcodescannerscreen-employee-popup-content">
              <p>직원을 호출했습니다!<br />잠시만 기다려주세요.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElderlyBarcodeScannerScreen;
