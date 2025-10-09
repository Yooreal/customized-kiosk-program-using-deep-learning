import React, { useState } from 'react'; // 구성 요소 상태 관리를 위해 React 및 useState hook 가져오기
import { useNavigate } from 'react-router-dom'; // 페이지 간 탐색을 위한 내비게이션 가져오기
import './CardPaymentScreen.css'; // 구성 요소 스타일링을 위한 CSS 파일 가져오기

const CardPaymentScreen = () => {
    const [isCardRecognized, setIsCardRecognized] = useState(false); // 카드가 인식되었는지 추적하는 상태
    const navigate = useNavigate(); // 페이지 간 내비게이션을 처리하는 hook

    // 카드 삽입 이벤트를 처리하는 기능
    const handleCardInsert = () => {
        setIsCardRecognized(true); // 카드 인식 상태를 true로 설정

        // 카드 인식 팝업 표시 후 5초 후 결제 완료 화면으로 이동
        setTimeout(() => {
            navigate('/payment-completion');  // 결제 완료 화면으로 리디렉션
        }, 5000);
    };

    return (
        <div className="card-payment-screen"> {/* 카드 결제 화면의 메인 container */}
            <h1 className="card-payment-title">카드를 투입구에<br />꽂아주세요.</h1> {/* 사용자에게 카드 삽입을 요청하는 메시지 표시 */}
            
            <div class="cardpayment-card-slot-wrapper"> {/* 카드 투입구 UI */}
                <div class="cardpayment-card-slot"></div> {/* 카드 슬롯의 시각적 표현 */}
            </div>
            
            <div className="card-payment-controls"> {/* 제어 버튼용 container */}
                <button className="cardpayment-back-button" onClick={() => navigate('/payment-method')}>뒤로가기</button> {/* 결제 방법 선택으로 이동하려면 뒤로 가기 버튼을 클릭 */}
                <button className="cardpayment-card-insert-button" onClick={handleCardInsert}>카드투입</button> {/* 카드 삽입 시뮬레이션 버튼 */}
            </div>

            {/* 카드 인식 팝업 */}
            {isCardRecognized && (
                <div className="cardpayment-card-popup dimmed"> {/* 팝업 효과를 위한 배경 흐림 */}
                    <div className="cardpayment-card-popup-content"> {/* 팝업 container */}
                        <p className="cardpayment-card-popup-message">인식 완료!<br />카드를 제거해 주세요.</p> {/* 성공적인 카드 인식을 나타내는 메시지 */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardPaymentScreen; // 애플리케이션의 다른 부분에 사용할 수 있도록 구성 요소 내보내기