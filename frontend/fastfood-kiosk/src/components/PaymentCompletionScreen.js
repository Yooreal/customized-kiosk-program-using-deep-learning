// success code :
//PaymentCompletionScreen.js code :
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentCompletionScreen.css';

const PaymentCompletionScreen = () => {
    const [countdown, setCountdown] = useState(10); // 10-second countdown
    const [receiptPrinted, setReceiptPrinted] = useState(false);
    const navigate = useNavigate();

    // Countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        // Redirect to the initial screen after countdown reaches 0
        if (countdown === 0) {
            navigate('/');
        }

        return () => clearInterval(timer);
    }, [countdown, navigate]);

    // Handle receipt output button click
    const handleReceiptPrint = () => {
        setReceiptPrinted(true);
    };

    return (
        <div className="general-payment-completion-screen">
            <h1>결제가<br />완료되었습니다!</h1>
            <div className="general-payment-completion-order-number">주문번호 : 001</div>
            <button className="general-payment-completion-receipt-button" onClick={handleReceiptPrint}>
                {receiptPrinted ? '출력 완료' : '영수증 출력'}
            </button>
            
            <div className="general-payment-completion-countdown">{countdown}초 후 초기 화면으로 돌아갑니다.</div>
        </div>
    );
};

export default PaymentCompletionScreen;