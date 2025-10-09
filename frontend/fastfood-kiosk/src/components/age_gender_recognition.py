import cv2  # OpenCV 라이브러리 가져오기
import numpy as np  # 행렬 및 배열 처리를 위한 NumPy 가져오기
import base64  # Base64 인코딩을 위한 라이브러리 가져오기
import requests  # HTTP 요청을 위한 requests 라이브러리 가져오기

# 얼굴 인식을 위한 Haar Cascade 모델 로드
face_cascade = cv2.CascadeClassifier(
    'C:/20213507_서유진/학과공부/졸업작품/프론트엔드/fastfood-kiosk/src/components/models/haarcascade_frontalface_alt.xml'
)

# 수정된 연령 범위 정의
age_classes = ['(0-9)', '(10-49)', '(50-100)']  # 업데이트된 연령대

# 웹캠 비디오 캡처 시작
cap = cv2.VideoCapture(0)  # 0은 기본 웹캠을 의미함

while True:
    ret, frame = cap.read()  # 웹캠에서 프레임을 읽음
    if not ret:
        print("Failed to grab frame from webcam.")  # 프레임을 읽을 수 없는 경우 오류 메시지 출력
        break  # 루프 종료

    # 프레임을 그레이스케일로 변환 (얼굴 감지 성능 향상을 위해)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Haar Cascade를 사용하여 얼굴 감지 수행
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        # 감지된 얼굴 주위에 직사각형(박스) 그리기
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        # 얼굴 영역(ROI) 추출
        face = frame[y:y + h, x:x + w]
        face_input = cv2.resize(face, (64, 64))  # 모델 입력 크기로 조정
        face_input = face_input / 255.0  # 픽셀 값을 [0,1] 범위로 정규화
        face_input = np.expand_dims(face_input, axis=0)  # 모델 입력 차원 확장

        # 얼굴 ROI를 Base64 문자열로 변환
        _, buffer = cv2.imencode('.jpg', face)  # 얼굴 이미지를 JPEG로 인코딩
        face_base64 = base64.b64encode(buffer).decode('utf-8')  # Base64로 변환 후 디코딩

        try:
            # 연령 예측을 위해 얼굴 이미지를 AI 서버로 전송
            response = requests.post(
                'http://127.0.0.1:5000/predict-age',  # AI 서버 엔드포인트
                json={'image': face_base64}  # JSON 데이터로 Base64 인코딩된 이미지 전송
            )

            if response.status_code == 200:  # 서버 응답이 정상적인 경우 (200 OK)
                result = response.json()  # JSON 응답을 파싱
                age = result['predicted_age']  # 예측된 연령 정보 추출

                # 예측된 연령 범위를 확인하고 해당 주문 페이지로 이동
                if age in ['(50-100)']:
                    print("Elderly detected, directing to elderly order page...")
                    # 예: open_elderly_order_page()
                elif age in ['(0-9)']:
                    print("Child detected, directing to children order page...")
                    # 예: open_children_order_page()
                else:
                    print("Youth detected, directing to general order page...")
                    # 예: open_general_order_page()

                # 프레임에 예측된 연령을 텍스트로 표시
                label = f"Age: {age}"
                cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

            else:
                print("Error in prediction:", response.json())  # 서버 오류 응답 출력

        except requests.exceptions.RequestException as e:
            print(f"Error connecting to the AI server: {e}")  # AI 서버 연결 실패 예외 처리

    # 결과 프레임을 화면에 표시
    cv2.imshow('Age Prediction', frame)

    # 'q' 키를 누르면 루프 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 비디오 캡처 객체 해제 및 창 닫기
cap.release()
cv2.destroyAllWindows()