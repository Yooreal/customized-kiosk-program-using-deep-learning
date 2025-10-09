import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ElderlyPaymentMethodScreen.css';

const ElderlyPaymentMethodScreen = () => {
  const navigate = useNavigate();
  const [isEmployeePopupVisible, setIsEmployeePopupVisible] = useState(false);

  // Voice guidance function
  const playVoiceGuidance = (message) => {
    if ('speechSynthesis' in window && !window.paymentMethodVoicePlayed) {
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = 'ko-KR'; // Set language to Korean
      window.speechSynthesis.speak(speech);
      window.paymentMethodVoicePlayed = true; // Ensure it plays only once
    }
  };

  useEffect(() => {
    playVoiceGuidance("결제 방식을 선택하세요. 카드와 페이 중 원하는 방식을 선택하세요.");
  }, []);

  const handlePaymentMethodClick = (method) => {
    if (method === '카드') {
      navigate('/elderly-card-payment');
    } else if (method === '페이') {
      navigate('/elderly-barcode-scanner');
    }
  };

  const handleCallEmployee = () => {
    setIsEmployeePopupVisible(true);
    setTimeout(() => {
      setIsEmployeePopupVisible(false);
    }, 5000);
  };

  const handleBackButton = () => {
    navigate('/elderly-dine-option');
  };

  return (
    <div className="Elderly-payment-method-screen">
      <h1 className="Elderly-payment-method-title">결제 방식을<br />선택하세요.</h1>

      <div className="Elderly-payment-method-options">
        <button className="Elderly-payment-method-option-button" onClick={() => handlePaymentMethodClick('카드')}>카드</button>
        <button className="Elderly-payment-method-option-button" onClick={() => handlePaymentMethodClick('페이')}>페이/바코드</button>
      </div>

      <button className="Elderly-payment-method-employee-call-button" onClick={handleCallEmployee}>직원 호출</button>

      <button className="Elderly-paymentmethod-back-button" onClick={handleBackButton}>뒤로 가기</button>

      {isEmployeePopupVisible && (
        <div className="Elderly-paymentmethod-employee-popup dimmed">
          <div className="Elderly-paymentmethod-employee-popup-content">
            <p>직원을 호출했습니다!<br />도움을 드릴테니 잠시만 기다려주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElderlyPaymentMethodScreen;
