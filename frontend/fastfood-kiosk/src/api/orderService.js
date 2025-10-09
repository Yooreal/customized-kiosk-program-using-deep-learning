import axios from 'axios'; // API 요청을 위한 약속 기반 HTTP 클라이언트인 Axios 가져오기

// 백엔드 API의 기본 URL 정의
const API_BASE_URL = 'http://localhost:8080/api'; // API 요청을 위한 기본 URL은 백엔드 서버 구성과 일치해야 함

// 주문을 생성하는 유틸리티 함수
export const createOrder = async (orderData) => {
  try {
    // 주문 데이터를 포함한 '/주문' 엔드포인트로 POST 요청 전송
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data; // 서버로부터 받은 응답 데이터 반환
  } catch (error) {
    console.error('Error creating order:', error); // API 요청 중 발생하는 오류 기록하기
    throw error; // 호출 함수로 처리할 수 있도록 오류를 던지기(예외 규칙 설정)
  }
};

// (선택 사항) 주문 ID로 주문 세부 정보를 가져오는 유틸리티 기능
export const getOrderDetails = async (orderId) => {
  try {
    // 주어진 주문 ID에 대한 주문 세부 정보를 검색하기 위해 GET 요청 보내기
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
    return response.data; // 서버로부터 받은 응답 데이터 반환
  } catch (error) {
    console.error('Error fetching order details:', error); // API 요청 중 발생하는 오류 기록하기
    throw error; // 호출 함수로 처리할 수 있도록 오류를 던지기(예외 규칙 설정)
  }
};