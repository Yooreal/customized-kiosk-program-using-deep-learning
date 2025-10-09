import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SecretRoot.css';

const SecretRoot = () => {
    const navigate = useNavigate();
    const [isSpeechTriggered, setIsSpeechTriggered] = useState(false);
    const [isInteractionRequired, setIsInteractionRequired] = useState(true);
    const [instructionText, setInstructionText] = useState("화면을 터치해주세요!"); // Initial text
    const [isFakeScreen, setIsFakeScreen] = useState(false); // Track screen state

    // Function to handle text-to-speech using the Web Speech API
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = 'ko-KR'; // Change to 'ko-KR' for Korean
            speech.volume = 1;     // Max volume
            speech.rate = 1;       // Normal speed
            speech.pitch = 1;      // Normal pitch
            window.speechSynthesis.speak(speech);
        } else {
            console.error('Speech Synthesis not supported in this browser.');
        }
    };

    // Function to trigger speech after user interaction
    const triggerSpeech = () => {
        if (!isSpeechTriggered && 'speechSynthesis' in window) {
            speakText('어서 오세요. 딥러닝을 활용한 사용자 맞춤형 키오스크입니다. 주문을 시작하려면 아래의 주문 시작 버튼을 눌러주세요.');
            setIsSpeechTriggered(true);  // Prevent multiple triggers
            setIsInteractionRequired(false); // Remove the visual prompt
            setInstructionText("현금 결제를 원하시는 분과 시각 장애인이신 분은 카운터로 와주세요.");  // Update text after interaction
        }
    };

    // Add event listener for click to trigger speech
    useEffect(() => {
        const handleTouch = () => {
            if ('speechSynthesis' in window) {
                triggerSpeech();
                window.removeEventListener('click', handleTouch);
            }
        };

        window.addEventListener('click', handleTouch);

        return () => {
            window.removeEventListener('click', handleTouch);
        };
    }, [isSpeechTriggered]);

    const handleGeneralClick = () => {
        navigate('/face-recognition-2'); // Navigate to FaceRecognition page
    };

    const handleEmergencyClick = () => {
        console.log('Emergency button clicked'); // Placeholder action
    };

    const handleTransparentClick = () => {
        setIsFakeScreen(true); // Switch to fake screen mode
    };

    return (
        <div className="secretroot-initial-screen">
            <h1 className="secretroot-main-heading">
                AI가 주문을 <br />
                도와드려요!
            </h1>
            <p className="secretroot-subtext">
                AI가 사용자의 얼굴을 인식해서 <br />
                연령을 파악한 후 <br />
                <span className="secretroot-highlight">맞춤형 화면</span>을 제공해 드립니다.
            </p>

            {/* Display the changing instruction text */}
            <div className="secretroot-instruction-text-container">
                <p className="secretroot-instruction-text">{instructionText}</p>
            </div>

            <div className="secretroot-button-container">
                {/* General Public button */}
                <button className="secretroot-option-button" onClick={handleGeneralClick}>
                    주문 시작
                </button>

                {/* Emergency button */}
                <button className="secretroot-option-button-2" onClick={handleEmergencyClick}>
                    기타
                </button>

                {/* Transparent button for fake screen */}
                <button className="secretroot-transparent-button" onClick={handleTransparentClick}></button>
            </div>
        </div>
    );
};

export default SecretRoot;
