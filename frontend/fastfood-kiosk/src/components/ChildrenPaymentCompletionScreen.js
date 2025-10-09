import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChildrenPaymentCompletionScreen.css';

const ChildrenPaymentCompletionScreen = () => {
    const [countdown, setCountdown] = useState(20); // 10-second countdown
    const [receiptPrinted, setReceiptPrinted] = useState(false);
    const navigate = useNavigate();

    // Voice guidance function
    const playVoiceGuidance = (message) => {
        if ('speechSynthesis' in window && !window.paymentCompletionVoicePlayed) {
            const speech = new SpeechSynthesisUtterance(message);
            speech.lang = 'ko-KR'; // Set language to Korean
            window.speechSynthesis.speak(speech);
            window.paymentCompletionVoicePlayed = true; // Ensure it plays only once
        }
    };

    useEffect(() => {
        playVoiceGuidance("결제가 완료되었습니다! 주문 번호를 확인하시고 영수증을 출력하려면 하단의 영수증 출력 버튼을 눌러주세요.");

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
        <div className="children-payment-completion-screen">
            <h1>결제가<br />완료되었습니다!</h1>
            <div className="children-payment-completion-order-number">주문번호 : 001</div>
            <button className="children-payment-completion-receipt-button" onClick={handleReceiptPrint}>
                {receiptPrinted ? '출력 완료' : '영수증 출력'}
            </button>
            
            <div className="children-payment-completion-countdown">{countdown}초 후 초기 화면으로 돌아갑니다.</div>
        </div>
    );
};

export default ChildrenPaymentCompletionScreen;
