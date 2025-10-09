import React, { useEffect, useState } from 'react'; // 상태 및 부작용 관리를 위한 React 및 hook 가져오기
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'; // 바코드 스캐너 라이브러리 가져오기
import { useNavigate } from 'react-router-dom'; // 페이지 리디렉션을 위한 내비게이션 hook 가져오기
import './ChildrenBarcodeScannerScreen.css'; // 스타일링을 위한 CSS 파일 가져오기

// applyDiscount 함수가 포함된 구성 요소 정의가 소품으로 전달됨
const ChildrenBarcodeScannerScreen = ({ applyDiscount }) => {
  const [isScanning, setIsScanning] = useState(false); // 스캔이 활성화되었는지 추적하는 상태
  const [showPopup, setShowPopup] = useState(false); // 스캔 결과 팝업의 가시성을 제어하는 상태
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 내용을 저장할 상태
  const [isEmployeePopupVisible, setIsEmployeePopupVisible] = useState(false); // 직원 호출 팝업 가시성을 추적하는 상태
  const navigate = useNavigate(); // 페이지 간 탐색을 위한 hook

  // 음성 안내 기능
  const playVoiceGuidance = (message) => {
    if ('speechSynthesis' in window && !window.barcodeScannerVoicePlayed) { // 음성 합성이 가능한지 확인하고 여러 재생을 방지
      const speech = new SpeechSynthesisUtterance(message); // 음성 객체 만들기
      speech.lang = 'ko-KR'; // 언어를 한국어로 설정하기
      window.speechSynthesis.speak(speech); // 음성 안내 재생
      window.barcodeScannerVoicePlayed = true; // 중복 재생 방지
    }
  };

  useEffect(() => {
    playVoiceGuidance("카메라 인식 시작 버튼을 누르고 바코드를 보여주면 자동으로 인식됩니다. 인식이 안되면 직원 호출 버튼을 눌러 도움을 요청하세요."); // 컴포넌트 마운트에서 음성 안내 재생

    let scanner;
    if (!isScanning) return; // 스캔이 활성화되지 않은 경우 조기 종료 효과

    scanner = new Html5QrcodeScanner("children-barcodescanner-reader", {
      fps: 30, // 초당 스캔 프레임 수
      qrbox: { width: 500, height: 500 }, // 스캐너 박스 크기
      supportedScanFormats: [ // 지원되는 바코드 형식 목록
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128
      ]
    });

    // 성공적인 바코드 스캔을 처리하는 기능
    const handleResult = (result) => {
      console.log('QR Code scanned: ', result); // 스캔 결과 로그 기록
      scanner.clear(); // 성공 후 스캔 중지
      setShowPopup(true); // 인식을 나타내는 팝업 표시
      setPopupMessage('인식 완료! 잠시만 기다려주세요.'); // 팝업 메시지 설정

      setTimeout(() => {
        setShowPopup(false); // 3초 후 팝업 숨기기
        if (applyDiscount) {
          applyDiscount(); // 기능이 제공되는 경우 할인 적용
        } else {
          console.error('applyDiscount is not a function'); // 함수가 누락된 경우 로그 오류
        }
        navigate('/children-payment-completion'); // 결제 완료 페이지로 이동
      }, 3000);
    };

    scanner.render(handleResult, (error) => { // 스캔 시작 및 오류 처리
      console.warn(`QR Code scanning failed: ${error}`); // 스캔 중 오류 기록
    });

    return () => scanner.clear(); // 구성 요소가 마운트 해제될 때 스캔을 중지하는 정리 기능
  }, [isScanning, applyDiscount, navigate]); // 종속성 배열은 스캔 상태 변경 시 효과 실행을 보장

  // 스캔을 시작하는 기능
  const handleStartScan = () => {
    setIsScanning(true); // 스캔 상태 활성화
  };

  // 스캔을 멈추고 이전 화면으로 돌아가는 기능
  const handleStopScan = () => {
    setIsScanning(false); // 스캔 상태 비활성화
    navigate('/children-barcode-scanner'); // 바코드 스캐너 페이지로 돌아가기
  };

  // 직원 호출 요청을 처리하는 기능
  const handleEmployeeCall = () => {
    setIsEmployeePopupVisible(true); // 직원 호출 팝업 표시
    setTimeout(() => {
      setIsEmployeePopupVisible(false); // 5초 후 팝업 숨기기
    }, 5000);
  };

  return (
    <div className="children-barcodescannerscreen-scanner-container">
      <h1>바코드를 스캐너에<br />인식해 주세요.</h1>
      {!isScanning && (
        <button className="children-barcodescannerscreen-start-scan-button" onClick={handleStartScan}>카메라 인식 시작</button>
      )}

      {isScanning && (
        <div className="children-barcodescannerscreen-stop-scan-container">
          <button className="children-barcodescannerscreen-stop-scan-button" onClick={handleStopScan}>스캔 중지</button>
        </div>
      )}

      <div className="children-barcodescanner-scanner-instructions">
        <div id="children-barcodescanner-reader" style={{ width: "100%" }}></div> {/* 스캐너 container */}
        <p>인식이 안되는 경우 <span className="children-barcodescannerscreen-scanner-highlight">직원호출</span> 버튼을 눌러주세요.<br />주문을 직접 도와드리겠습니다.</p>
      </div>

      {showPopup && (
        <div className="dimmed">
          <div className="children-barcodescannerscreen-scanner-employee-popup">
            <div className="children-barcodescannerscreen-scanner-employee-popup-content">
              <p className="children-barcodescannerscreen-scanner-employee-popup-message">{popupMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* 뒤로 가기 버튼과 직원 호출 버튼 */}
      <div className="children-barcodescannerscreen-scanner-actions">
        <button className="children-barcodescannerscreen-scanner-back-button" onClick={() => navigate('/children-payment-method')}>뒤로가기</button>
        <button className="children-barcodescannerscreen-call-employee-button" onClick={handleEmployeeCall}>직원 호출</button>
      </div>

      {/* 직원 호출 팝업 */}
      {isEmployeePopupVisible && (
        <div className="dimmed">
          <div className="children-barcodescannerscreen-employee-popup">
            <div className="children-barcodescannerscreen-employee-popup-content">
              <p>직원을 호출했습니다!<br />잠시만 기다려주세요.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildrenBarcodeScannerScreen; // 앱에서 사용할 구성 요소 내보내기
