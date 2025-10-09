import React, { useEffect } from 'react'; // Import React and useEffect hook for lifecycle management
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation between pages
import './ChildrenDineOptionScreen.css'; // Import external CSS file for styling

const ChildrenDineOptionScreen = () => {
    const navigate = useNavigate(); // Initialize navigation function

    // Voice guidance function to provide audio instructions
    const playVoiceGuidance = (message) => {
        if ('speechSynthesis' in window && !window.dineOptionVoicePlayed) { // Check if speech synthesis is supported and has not played before
            const speech = new SpeechSynthesisUtterance(message); // Create speech synthesis object with provided message
            speech.lang = 'ko-KR'; // Set language to Korean
            window.speechSynthesis.speak(speech); // Trigger speech synthesis to play the message
            window.dineOptionVoicePlayed = true; // Mark voice guidance as played to prevent repetition
        }
    };

    useEffect(() => {
        playVoiceGuidance("식사 방식을 선택해 주세요."); // Play voice guidance when the component is mounted
    }, []); // Empty dependency array ensures the effect runs only once on mount

    // Handle selection of dining option (매장 or 포장)
    const handleOptionClick = (option) => {
        if (option) { // Check if an option is provided
            console.log(`Selected option: ${option}`); // Log selected option to console
            navigate('/children-payment-method', { state: { dineOption: option } }); // Navigate to payment method screen with selected option
        } else {
            console.error('No option selected'); // Log an error if no option is provided
        }
    };

    // Handle back button click to navigate to the previous screen
    const handleBackClick = () => {
        navigate('/children-order-details'); // Navigate back to the order details screen
    };

    return (
        <div className="Children-dine-option-screen"> {/* Main container for the dine option screen */}
            <h1 className="Children-dine-option-title">식사 방식을<br />선택해 주세요.</h1> {/* Title with line break */}
            <div className="Children-dine-option-buttons"> {/* Container for dine option buttons */}
                <button
                    className="Children-dine-option-button"
                    onClick={() => handleOptionClick('매장')} // Call handleOptionClick with '매장' (dining in)
                >
                    <div className="Children-dineoption-shopandpackaging"> {/* Wrapper for icon */}
                        <img src="/images/shop.png" alt="매장 아이콘" className="Children-dineoption-icon-image" /> {/* Store icon */}
                    </div>
                    <span className="Children-dineoption-option-text">매장</span> {/* Text label for store option */}
                </button>
                <button
                    className="Children-dine-option-button"
                    onClick={() => handleOptionClick('포장')} // Call handleOptionClick with '포장' (takeout)
                >
                    <div className="Children-dineoption-shopandpackaging"> {/* Wrapper for icon */}
                        <img src="/images/packaging.png" alt="포장 아이콘" className="Children-dineoption-icon-image" /> {/* Packaging icon */}
                    </div>
                    <span className="Children-dineoption-option-text">포장</span> {/* Text label for takeout option */}
                </button>
            </div>

            {/* Back button at the bottom */}
            <button className="Children-dine-option-back-button" onClick={handleBackClick}> {/* Navigate back on click */}
                뒤로 가기
            </button>
        </div>
    );
};

export default ChildrenDineOptionScreen; // Export component for use in other parts of the app
