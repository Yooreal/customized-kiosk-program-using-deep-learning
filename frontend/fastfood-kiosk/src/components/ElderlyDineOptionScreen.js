import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ElderlyDineOptionScreen.css';

const ElderlyDineOptionScreen = () => {
    const navigate = useNavigate();

    // Voice guidance function
    const playVoiceGuidance = (message) => {
        if ('speechSynthesis' in window && !window.dineOptionVoicePlayed) {
            const speech = new SpeechSynthesisUtterance(message);
            speech.lang = 'ko-KR'; // Set language to Korean
            window.speechSynthesis.speak(speech);
            window.dineOptionVoicePlayed = true; // Ensure it plays only once
        }
    };

    useEffect(() => {
        playVoiceGuidance("식사 방식을 선택해 주세요.");
    }, []);

    const handleOptionClick = (option) => {
        if (option) {
            console.log(`Selected option: ${option}`);
            navigate('/elderly-payment-method', { state: { dineOption: option } });
        } else {
            console.error('No option selected');
        }
    };

    const handleBackClick = () => {
        navigate('/elderly-order-details'); // Navigate back to OrderDetailsScreen
    };

    return (
        <div className="Elderly-dine-option-screen">
            <h1 className="Elderly-dine-option-title">식사 방식을<br />선택해 주세요.</h1>
            <div className="Elderly-dine-option-buttons">
                <button
                    className="Elderly-dine-option-button"
                    onClick={() => handleOptionClick('매장')}
                >
                    <div className="Elderly-dineoption-shopandpackaging">
                        <img src="/images/shop.png" alt="매장 아이콘" className="Elderly-dineoption-icon-image" />
                    </div>
                    <span className="Elderly-dineoption-option-text">매장</span>
                </button>
                <button
                    className="Elderly-dine-option-button"
                    onClick={() => handleOptionClick('포장')}
                >
                    <div className="Elderly-dineoption-shopandpackaging">
                        <img src="/images/packaging.png" alt="포장 아이콘" className="Elderly-dineoption-icon-image" />
                    </div>
                    <span className="Elderly-dineoption-option-text">포장</span>
                </button>
            </div>

            {/* Back button at the bottom */}
            <button className="Elderly-dine-option-back-button" onClick={handleBackClick}>
                뒤로 가기
            </button>
        </div>
    );
};

export default ElderlyDineOptionScreen;
