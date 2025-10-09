import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderDetailsScreen.css';

// Utility function to calculate the total amount
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => {
    const itemPrice = item.price || 0; // Ensure price is not undefined
    const itemQuantity = item.quantity || 1; // Default quantity to 1 if not provided
    return total + itemPrice * itemQuantity;
  }, 0);
};

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
    <div className="orderdetails-keypad-overlay">
      <div className="orderdetails-keypad">
        <div className="orderdetails-keypad-header">
          <span>쿠폰 입력</span>
          <button onClick={onClose}>×</button>
        </div>

        <div className="orderdetails-coupon-code-box">
          <span className="orderdetails-coupon-label">코드 번호 :</span>
          <span className="orderdetails-coupon-code">{inputCode}</span>
        </div>

        <div className="orderdetails-keypad-buttons">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((number) => (
            <button key={number} onClick={() => handleNumberClick(number)}>
              {number}
            </button>
          ))}
          <button onClick={handleClear}>C</button>
          <button onClick={() => handleNumberClick('0')}>0</button>
          <button onClick={handleErase}>삭제</button>
        </div>

        <div className="orderdetails-keypad-actions">
          <button className="orderdetails-keypad-cancel-button" onClick={onClose}>
            취소
          </button>
          <button className="orderdetails-keypad-apply-button" onClick={handleApply}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems = [] } = location.state || {}; // Safely access selectedItems
  const initialTotalAmount = calculateTotalAmount(selectedItems); // Calculate total amount initially

  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [discount, setDiscount] = useState(0);
  const [showKeypad, setShowKeypad] = useState(false);

  const handleCancel = () => {
    navigate('/general-menu');
  };

  const handlePayment = () => {
    navigate('/dine-option');
  };

  const handleApplyDiscount = (discountAmount) => {
    setDiscount(discountAmount);
    setTotalAmount((prevTotal) => Math.max(0, prevTotal - discountAmount));
  };

  return (
    <div className="order-details-screen">
      <h1 className="orderdetails-history-header">주문 내역을<br />확인해 주세요.</h1>
      <div className="orderdetails-order-details">
        <div className="orderdetails-order-summary-header">
          <span>제품명</span>
          <span>수량</span>
          <span>금액</span>
        </div>

        {selectedItems.length > 0 ? (
          selectedItems.map((item, index) => (
            <div key={index} className="orderdetails-order-item">
              <span>{item.name} {item.option && `(${item.option})`}</span>
              <span>{item.quantity || 1}</span>
              <span>₩{(item.price * (item.quantity || 1)).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <div className="orderdetails-order-item empty-space">
            주문하신 제품이 없습니다.
          </div>
        )}
      </div>
      <div className="orderdetails-total-amount">
        <span className="orderdetails-highlight">총 결제금액</span>
        <span className="orderdetails-total-amount">₩{totalAmount.toLocaleString()}</span>

        {discount > 0 && (
          <div className="orderdetails-discount-amount">
            <span>할인금액: -₩{discount.toLocaleString()}</span>
          </div>
        )}
      </div>
      <div className="orderdetails-order-controls">
        <button
          className="orderdetailsscreen-coupon-button"
          onClick={() => setShowKeypad(true)}
        >
          쿠폰 입력
        </button>
        <button className="orderdetailsscreen-cancel-button" onClick={handleCancel}>
          취소
        </button>
        <button className="orderdetailsscreen-pay-button" onClick={handlePayment}>
          결제
        </button>
      </div>

      {showKeypad && (
        <Keypad
          onApplyDiscount={handleApplyDiscount}
          onClose={() => setShowKeypad(false)}
        />
      )}
    </div>
  );
};

export default OrderDetailsScreen;
