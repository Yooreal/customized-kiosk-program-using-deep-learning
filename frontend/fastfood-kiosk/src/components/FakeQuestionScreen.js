import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FakeQuestionScreen.css';

const FakeQuestionScreen = () => {
    const navigate = useNavigate();

    const handleQuickOrder = () => {
        navigate('/face-recognition-general'); // Navigate to the face recognition screen for general users
    };

    const handleGetHelp = () => {
        navigate('/elderly-face-recognition'); // Navigate to the face recognition screen for elderly users
    };

    return (
        <div className="fake-question-screen">
            {/* New phrase split into two lines */}
            <p className="question-top-text">
                귀하에게 최상의 경험을 제공하기 위해<br />
                간단한 질문이 있습니다.
            </p>

            <h1 className="fake-question-title">주문할 때<br />무엇이 더 중요합니까?</h1> {/* Added className for the title */}
            <div className="question-button-container">
                <button className="question-option-button" onClick={handleQuickOrder}>빠르고 쉬운 주문</button>
                <button className="question-help-button" onClick={handleGetHelp}>필요한 경우 도움 받기</button> {/* New style for help button */}
            </div>
        </div>
    );
};

export default FakeQuestionScreen;
