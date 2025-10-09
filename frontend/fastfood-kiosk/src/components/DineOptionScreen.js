import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DineOptionScreen.css';

const DineOptionScreen = () => {
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        if (option) {
            console.log(`Selected option: ${option}`);
            navigate('/payment-method', { state: { dineOption: option } });
        } else {
            console.error('No option selected');
        }
    };

    const handleBackClick = () => {
        navigate('/order-details'); // Navigate back to OrderDetailsScreen
    };

    return (
        <div className="dine-option-screen">
            <h1 className="dine-option-title">식사 방식을<br />선택해 주세요.</h1>
            <div className="dine-option-buttons">
                <button
                    className="dine-option-button"
                    onClick={() => handleOptionClick('매장')}
                >
                    <div className="dineoption-shopandpackaging">
                        <img src="/images/shop.png" alt="매장 아이콘" className="dineoption-icon-image" />
                    </div>
                    <span className="dineoption-option-text">매장</span>
                </button>
                <button
                    className="dine-option-button"
                    onClick={() => handleOptionClick('포장')}
                >
                    <div className="dineoption-shopandpackaging">
                        <img src="/images/packaging.png" alt="포장 아이콘" className="dineoption-icon-image" />
                    </div>
                    <span className="dineoption-option-text">픽업</span>
                </button>
            </div>

            {/* Back button at the bottom */}
            <button className="dine-option-back-button" onClick={handleBackClick}>
                뒤로 가기
            </button>
        </div>
    );
};

export default DineOptionScreen;
