import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ChildrenOrderDetailsScreen.css';

// Keypad component for coupon input
const Keypad = ({ onApplyDiscount, onClose }) => {
  const [inputCode, setInputCode] = useState('');

  const handleNumberClick = (number) => {
    setInputCode((prev) => prev + number.toString());
  };

  const handleClear = () => {
    setInputCode('');
  };

  const handleErase = () => {
    setInputCode((prev) => prev.slice(0, -1)); // Remove last digit
  };

  const handleApply = () => {
    switch (inputCode) {
      case '123':
        onApplyDiscount(1000);
        break;
      case '456':
        onApplyDiscount(2000);
        break;
      case '789':
        onApplyDiscount(3000);
        break;
      default:
        alert('유효하지 않은 쿠폰번호 입니다.');
        break;
    }
    setInputCode('');
    onClose();
  };

  return (
    <div className="Children-orderdetails-keypad-overlay">
      <div className="Children-orderdetails-keypad">
        <div className="Children-orderdetails-keypad-header">
          <span>쿠폰 입력</span>
          <button onClick={onClose}>×</button>
        </div>

        <div className="Children-orderdetails-coupon-code-box">
          <span className="Children-orderdetails-coupon-label">코드 번호 :</span>
          <span className="Children-orderdetails-coupon-code">{inputCode}</span>
        </div>

        <div className="Children-orderdetails-keypad-buttons">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((number) => (
            <button key={number} onClick={() => handleNumberClick(number)}>
              {number}
            </button>
          ))}
          <button onClick={handleClear}>C</button>
          <button onClick={() => handleNumberClick('0')}>0</button>
          <button onClick={handleErase}>삭제</button>
        </div>

        <div className="Children-orderdetails-keypad-actions">
          <button className="Children-orderdetails-keypad-cancel-button" onClick={onClose}>취소</button>
          <button className="Children-orderdetails-keypad-apply-button" onClick={handleApply}>완료</button>
        </div>
      </div>
    </div>
  );
};

const ChildrenOrderDetailsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [totalAmount, setTotalAmount] = useState(selectedItems.reduce((total, item) => total + item.price * item.quantity, 0));
  const [discount, setDiscount] = useState(0);
  const [showKeypad, setShowKeypad] = useState(false);

  // Voice guidance function
  const playVoiceGuidance = (message) => {
    if ('speechSynthesis' in window && !window.orderDetailsVoicePlayed) {
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = 'ko-KR'; // Set language to Korean
      window.speechSynthesis.speak(speech);
      window.orderDetailsVoicePlayed = true; // Flag to play only once
    }
  };

  useEffect(() => {
    playVoiceGuidance("주문 내역을 확인하고 하단의 결제 버튼을 눌러주세요. 쿠폰을 적용하려면 쿠폰 버튼을 누르세요.");
  }, []);

  const handleCancel = () => {
    navigate('/children-menu');
  };

  const handlePayment = () => {
    navigate('/children-dine-option');
  };

  const handleApplyDiscount = (discountAmount) => {
    setDiscount(discountAmount);
    setTotalAmount((prevTotal) => prevTotal - discountAmount);
  };

  return (
    <div className="Children-order-details-screen">
      <h1 className="Children-orderdetails-history-header">주문 내역을<br />확인해 주세요.</h1>
      <div className="Children-orderdetails-order-details">
        <div className="Children-orderdetails-order-summary-header">
          <span>제품명</span>
          <span>수량</span>
          <span>금액</span>
        </div>
        
        {selectedItems.length > 0 ? (
          selectedItems.map((item, index) => (
            <div key={index} className="Children-orderdetails-order-item">
              <span>{item.name} {item.option && `(${item.option})`}</span>
              <span>{item.quantity}</span>
              <span>₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <div className="Children-orderdetails-order-item empty-space">주문하신 제품이 없습니다.</div>
        )}
      </div>
      <div className="Children-orderdetails-total-amount">
        <span className="Children-orderdetails-highlight">총 결제금액</span>
        <span className="Children-orderdetails-total-amount">₩{totalAmount.toLocaleString()}</span>
        {discount > 0 && (
          <div className="Children-orderdetails-discount-amount">
            <span>할인금액: -₩{discount.toLocaleString()}</span>
          </div>
        )}
      </div>
      <div className="Children-orderdetails-order-controls">
        <button className="Children-orderdetailsscreen-coupon-button" onClick={() => setShowKeypad(true)}>쿠폰 입력</button>
        <button className="Children-orderdetailsscreen-cancel-button" onClick={handleCancel}>취소</button>
        <button className="Children-orderdetailsscreen-pay-button" onClick={handlePayment}>결제</button>
      </div>

      {showKeypad && <Keypad onApplyDiscount={handleApplyDiscount} onClose={() => setShowKeypad(false)} />}
    </div>
  );
};

export default ChildrenOrderDetailsScreen;
