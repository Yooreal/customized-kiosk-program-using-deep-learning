import React, { useEffect, useState } from 'react'; // React 및 필요한 hook 가져오기
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'; // QR 코드 스캐너 라이브러리 가져오기
import { useNavigate } from 'react-router-dom'; // React 라우터에서 내비게이션 hook 가져오기
import './BarcodeScannerScreen.css'; // 연결된 CSS 파일 가져오기

const BarcodeScannerScreenCoupon = ({ applyDiscount }) => {
  const [isScanning, setIsScanning] = useState(false); // 스캔이 활성화되었는지 추적하는 상태
  const [showPopup, setShowPopup] = useState(false); // 팝업 메시지의 가시성을 제어하는 상태
  const [popupMessage, setPopupMessage] = useState(''); // 팝업에 표시되는 메시지를 저장할 상태
  const [isEmployeePopupVisible, setIsEmployeePopupVisible] = useState(false); // 직원 호출 팝업 가시성 상태
  const navigate = useNavigate(); // 프로그래밍 내비게이션용 hook

  // 이펙트를 사용하여 스캐너 기능을 초기화하고 처리
  useEffect(() => {
    let scanner;
    if (!isScanning) return; // 스캔이 활성화되지 않은 경우 조기 종료

    // 설정으로 QR 코드 스캐너 초기화
    scanner = new Html5QrcodeScanner("barcodescanner-reader", {
      fps: 30, // 초당 스캔 프레임 설정
      qrbox: { width: 500, height: 500 }, // 스캔 박스 크기 정의
      supportedScanFormats: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128
      ]
    });

    // 바코드가 성공적으로 스캔되면 결과 처리
    const handleResult = (result) => {
      console.log('QR Code scanned: ', result); // 스캔한 결과 기록
      scanner.clear(); // 스캔을 멈추고 스캐너를 지움
      setShowPopup(true); // 확인 팝업 표시
      setPopupMessage('인식 완료! 잠시만 기다려주세요.'); // 성공 메시지 표시

      setTimeout(() => {
        setShowPopup(false); // 3초 후 팝업 숨기기
        if (applyDiscount) {
          applyDiscount(); // 기능이 제공되는 경우 할인 적용
        } else {
          console.error('applyDiscount is not a function'); // applyDiscount가 누락된 경우 로그 오류 발생
        }
        navigate('/payment-completion'); // 결제 완료 페이지로 리디렉션
      }, 3000);
    };

    // 스캐너를 렌더링하고 결과 핸들러를 전달
    scanner.render(handleResult, (error) => {
      console.warn(`QR Code scanning failed: ${error}`); // 로그 스캔 오류
    });

    return () => scanner.clear(); // unmount일 때 스캐너를 지우는 청소 기능
  }, [isScanning, applyDiscount, navigate]);

  // 버튼을 클릭하면 스캔을 시작하는 기능
  const handleStartScan = () => {
    setIsScanning(true);
  };

  // 스캔을 멈추고 바코드 스캐너 화면으로 다시 이동하는 기능
  const handleStopScan = () => {
    setIsScanning(false);
    navigate('/barcode-scanner');
  };

  // 직원 호출 팝업을 표시하고 5초 후 숨기기 기능
  const handleEmployeeCall = () => {
    setIsEmployeePopupVisible(true);
    setTimeout(() => {
      setIsEmployeePopupVisible(false);
    }, 5000);
  };

  return (
    <div className="barcodescannerscreen-scanner-container">
      <h1>바코드를 스캐너에<br />인식해 주세요.</h1>
      {!isScanning && (
        <button className="barcodescannerscreen-start-scan-button" onClick={handleStartScan}>카메라 인식 시작</button>
      )}

      {isScanning && (
        <div className="barcodescannerscreen-stop-scan-container">
          <button className="barcodescannerscreen-stop-scan-button" onClick={handleStopScan}>스캔 중지</button>
        </div>
      )}

      {/* 바코드 스캐너 섹션 */}
      <div className="barcodescanner-scanner-instructions">
        <div id="barcodescanner-reader" style={{ width: "100%" }}></div>
        <p>인식이 안되는 경우 <span className="barcodescannerscreen-scanner-highlight">직원호출</span> 버튼을 눌러주세요.<br />주문을 직접 도와드리겠습니다.</p>
      </div>

      {/* 스캔이 성공하면 팝업 메시지 표시 */}
      {showPopup && (
        <div className="dimmed">
          <div className="barcodescannerscreen-scanner-employee-popup">
            <div className="barcodescannerscreen-scanner-employee-popup-content">
              <p className="barcodescannerscreen-scanner-employee-popup-message">{popupMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* 뒤로 가기 버튼과 직원 호출 버튼 섹션 */}
      <div className="barcodescannerscreen-scanner-actions">
        <button className="barcodescannerscreen-scanner-back-button" onClick={() => navigate('/payment-method')}>뒤로가기</button>
        <button className="barcodescannerscreen-call-employee-button" onClick={handleEmployeeCall}>직원 호출</button>
      </div>

      {/* 직원 호출 팝업 */}
      {isEmployeePopupVisible && (
        <div className="dimmed">
          <div className="barcodescannerscreen-employee-popup">
            <div className="barcodescannerscreen-employee-popup-content">
              <p>직원을 호출했습니다!<br />잠시만 기다려주세요.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerScreenCoupon; // 애플리케이션의 다른 부분에 사용할 수 있도록 구성 요소 내보내기