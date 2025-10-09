import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ElderlyCardPaymentScreen.css';

const ElderlyCardPaymentScreen = () => {
    const [isCardRecognized, setIsCardRecognized] = useState(false);
    const navigate = useNavigate();

    // Voice guidance function
    const playVoiceGuidance = (message) => {
        if ('speechSynthesis' in window && !window.cardPaymentVoicePlayed) {
            const speech = new SpeechSynthesisUtterance(message);
            speech.lang = 'ko-KR'; // Set language to Korean
            window.speechSynthesis.speak(speech);
            window.cardPaymentVoicePlayed = true; // Ensure it plays only once
        }
    };

    useEffect(() => {
        playVoiceGuidance("카드를 투입구에 꽂아주세요.");
    }, []);

    // Function to handle card input
    const handleCardInsert = () => {
        setIsCardRecognized(true);

        // Show card recognition pop-up and then navigate after 5 seconds
        setTimeout(() => {
            navigate('/elderly-payment-completion');  // Redirect to Payment Completion Screen
        }, 5000);
    };

    return (
        <div className="Elderly-card-payment-screen">
            <h1 className="Elderly-card-payment-title">카드를 투입구에<br />꽂아주세요.</h1>
            
            <div className="Elderly-cardpayment-card-slot-wrapper">
                <div className="Elderly-cardpayment-card-slot"></div>
            </div>
            <div className="Elderly-card-payment-controls">
                <button className="Elderly-cardpayment-back-button" onClick={() => navigate('/elderly-payment-method')}>뒤로가기</button>
                <button className="Elderly-cardpayment-card-insert-button" onClick={handleCardInsert}>카드투입</button>
            </div>

            {/* Pop-up for card recognition */}
            {isCardRecognized && (
                <div className="Elderly-cardpayment-card-popup dimmed">
                    <div className="Elderly-cardpayment-card-popup-content">
                        <p className="Elderly-cardpayment-card-popup-message">인식 완료!<br />카드를 제거해 주세요.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElderlyCardPaymentScreen;
