// React에서 필요한 모듈 가져오기
import React, { useState, useEffect } from 'react';

// react-router-dom에서 내비게이션 hook 가져오기
import { useNavigate } from 'react-router-dom';

// 스타일링을 위한 CSS 파일 가져오기
import './ChildrenCardPaymentScreen.css';

// ChildrenCardPaymentScreen 구성 요소 정의
const ChildrenCardPaymentScreen = () => {
    // 카드가 인식되었는지 여부를 추적하는 상태
    const [isCardRecognized, setIsCardRecognized] = useState(false);

    // 페이지 간 프로그래밍 내비게이션을 위한 hook
    const navigate = useNavigate();

    // 사용자에게 오디오 지침을 제공하는 음성 안내 기능
    const playVoiceGuidance = (message) => {
        // 브라우저가 음성 합성을 지원하는지, 그리고 음성 안내가 아직 재생되지 않았는지 확인
        if ('speechSynthesis' in window && !window.cardPaymentVoicePlayed) {
            const speech = new SpeechSynthesisUtterance(message); // 음성 합성 인스턴스 만들기
            speech.lang = 'ko-KR'; // 언어를 한국어로 설정하기
            window.speechSynthesis.speak(speech); // 음성 메시지 재생
            window.cardPaymentVoicePlayed = true; // 메시지가 한 번만 재생되는지 확인
        }
    };

    // 이펙트 훅을 사용하여 구성 요소가 장착될 때 음성 안내를 트리거
    useEffect(() => {
        playVoiceGuidance("카드를 투입구에 꽂아주세요."); // 지시 메시지 재생
    }, []); // 빈 종속성 배열은 구성 요소가 마운트될 때 한 번만 실행되도록 보장

    // 카드 삽입을 처리하는 기능
    const handleCardInsert = () => {
        setIsCardRecognized(true); // 카드가 인식되었음을 나타내는 상태 설정

        // 결제 완료 화면으로의 내비게이션 지연 시간 5초
        setTimeout(() => {
            navigate('/children-payment-completion');  // 결제 완료 화면으로 리디렉션
        }, 5000);
    };

    return (
        <div className="Children-card-payment-screen">  {/* 결제 화면용 container */}
            <h1 className="Children-card-payment-title">카드를 투입구에<br />꽂아주세요.</h1> {/* 지시 메시지 표시 */}

            {/* 카드 슬롯 UI용 wrapper */}
            <div className="Children-cardpayment-card-slot-wrapper">
                <div className="Children-cardpayment-card-slot"></div> {/* 카드 슬롯 비주얼 */}
            </div>

            {/* 카드 결제 제어 */}
            <div className="Children-card-payment-controls">
                {/* 결제 수단 선택 화면으로 돌아가는 버튼 */}
                <button className="Children-cardpayment-back-button" onClick={() => navigate('/children-payment-method')}>뒤로가기</button>

                {/* 카드 삽입을 시뮬레이션하고 인식 프로세스를 트리거하는 버튼 */}
                <button className="Children-cardpayment-card-insert-button" onClick={handleCardInsert}>카드투입</button>
            </div>

            {/* 조건부 렌더링: 카드가 인식된 경우 팝업 표시 */}
            {isCardRecognized && (
                <div className="Children-cardpayment-card-popup dimmed"> {/* 팝업 배경 흐림 효과 */}
                    <div className="Children-cardpayment-card-popup-content">
                        <p className="Children-cardpayment-card-popup-message">인식 완료!<br />카드를 제거해 주세요.</p> {/* 성공 메시지 표시 */}
                    </div>
                </div>
            )}
        </div>
    );
};

// 애플리케이션의 다른 부분에 사용할 구성 요소 내보내기
export default ChildrenCardPaymentScreen;
