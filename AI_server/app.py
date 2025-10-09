# app.py code :

# 사용된 주요 기능 :
# Flask : Flask, request, jsonify, CORS
# OpenCV : cv2.CascadeClassifier, cv2.dnn.readNetFromCaffe, cv2.cvtColor, cv2.imdecode,cv2.dnn.blobFromImage
# Base64 : base64.b64decode
# Numpy : np.frombuffer

# 이 코드는 POST 요청을 통해 전송된 이미지를 처리하고, 얼굴을 감지하고, 사전 훈련된 모델을 사용하여 나이를 예측하고, 그 결과를 인터페이스 추천과 함께 반환한다.



# import 기능 (필수 라이브러리 가져오기)
from flask import Flask, request, jsonify # Flask, request, jsonify : 웹앱을 만들고, 요청을 처리하고, JSON 응답을 반환함
import cv2 # 이미지 처리 및 컴퓨터 비전 작업에 사용되는 OpenCV
import numpy as np # numpy : 수치 연산, 특히 이미지 데이터 조작을 처리
import base64 # Base64 형식으로 전송된 이미지를 디코딩
from flask_cors import CORS # CORS : React 프런트엔드와의 상호작용을 위해 교차 출처 리소스 공유를 활성화
import logging
import traceback # logging, traceback : 디버깅 및 오류 로깅을 위해 사용됨


# Flask app을 초기화하고 교차 출처 요청에 대해 CORS를 활성화
app = Flask(__name__)
CORS(app)  # React frontend에서 교차 오리진 요청 허용


# console에서 자세한 동작과 오류를 포착하기 위해 디버그 수준으로 logging을 설정
logging.basicConfig(level=logging.DEBUG)


# model 경로 정의 : 얼굴 감지(Haar Cascade) 및 연령 예측(Caffe 기반 모델)을 위한 사전 학습된 모델로의 경로를 정의
MODEL_PATH = "models/my_saved_model/"
HAAR_MODEL_PATH = MODEL_PATH + "haarcascade_frontalface_alt.xml"
AGE_PROTO_PATH = MODEL_PATH + "deploy_age.prototxt"
AGE_MODEL_PATH = MODEL_PATH + "age_net.caffemodel"


# 얼굴 감지를 위한 Haar Cascade model 로딩
cascade = cv2.CascadeClassifier(HAAR_MODEL_PATH)


# 연령 예측을 위한 Caffe model 로딩
age_net = cv2.dnn.readNetFromCaffe(AGE_PROTO_PATH, AGE_MODEL_PATH)


# model 매개변수
MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)  # MODEL_MEAN_VALUES : 모델의 예상 입력과 일치하도록 입력 이미지를 정규화
age_list = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-30)', '(31-40)', '(41-100)']  # age_list : 예상 연령대에 해당하는 라벨
age_ranges = [2, 6, 12, 20, 30, 40, 100]  # age_ranges : 더 쉬운 매핑을 위해 연령대를 숫자로 나타냄


# API 엔드포인트 : 업로드된 이미지를 기반으로 사용자의 연령을 예측하는 POST 엔드포인트를 정의
@app.route('/predict-age', methods=['POST'])
def predict_age():
    """
    업로드된 이미지를 기반으로 사용자의 나이를 예측하는 요청을 처리
    """
    try:
        # 들어오는 요청 기록
        logging.debug(f"Received request: {request.json}")


        # 요청 검증 : 요청에 image필드가 있는 JSON이 포함되어 있는지 확인
        if not request.is_json:
            logging.error("Request is not in JSON format.")
            return jsonify({'error': 'Request must be JSON'}), 400


        if 'image' not in request.json:
            logging.error("'image' key not found in the request.")
            return jsonify({'error': 'No image found in request'}), 400


        # Base64 이미지 디코딩 : Base64 이미지를 NumPy 배열로 디코딩, OpenCV를 사용하여 배열을 이미지로 변환
        image_data = request.json['image']  # 요청에서 이미지 데이터 추출
        img_data = base64.b64decode(image_data)  # Base64 문자열을 byte 단위로 디코딩
        np_arr = np.frombuffer(img_data, np.uint8)  # byte를 NumPy 배열로 변환
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)  # 배열을 이미지로 디코딩


        if img is None:
            logging.error("Failed to decode image.")
            return jsonify({'error': 'Invalid image data'}), 400


        # 얼굴 감지 수행 : 얼굴 감지를 위해 이미지를 회색조로 변환, Haar Cascade 모델을 사용하여 얼굴을 감지
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # 얼굴 감지를 위해 이미지를 grayscale로 변환
        faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))  # 얼굴 감지


        if len(faces) == 0:
            logging.warning("No face detected.")
            return jsonify({'error': 'No face detected'}), 400


        # 처음 발견된 얼굴의 나이 예측 : 첫 번째로 감지된 얼굴을 추출하여 모델 입력을 위한 블롭으로 사전 처리
        x, y, w, h = faces[0]  # 첫 번째로 감지된 얼굴의 좌표 가져오기
        face = img[y:y + h, x:x + w]  # 얼굴 영역 자르기
        blob = cv2.dnn.blobFromImage(face, 1, (227, 227), MODEL_MEAN_VALUES, swapRB=False)  # 얼굴 영역 전처리


        # 연령 예측 수행 : Caffe 모델을 사용하여 연령을 예측하고 해당 연령 범위에 매핑
        age_net.setInput(blob)
        age_preds = age_net.forward()  # 연령 네트워크를 통한 전방 통과
        age_index = age_preds.argmax()  # 최고 confidence 지수 얻기
        predicted_age = age_ranges[age_index]  # 연령대별 map index


        # 비현실적인 연령 예측을 위한 fallback : 예측된 연령이 현실적인 범위를 벗어나는 예외적인 사례를 처리
        if predicted_age < 0 or predicted_age > 100:
            logging.warning("Unrealistic age detected, defaulting to elderly interface.")
            predicted_age = 100  # 100세 이상이면 고령층용 인터페이스


        logging.debug(f"Final Predicted Age: {predicted_age}")


        # 예상 연령에 따라 redirect : 예측된 연령을 적합한 인터페이스( elderly, children, 또는 general)에 매핑
        if predicted_age >= 50:  # 50세 이상 고령층용 인터페이스
            logging.info("User identified as elderly, directing to elderly interface.")
            return jsonify({'predicted_age': predicted_age, 'interface': 'elderly'}), 200
        elif predicted_age < 10:  # 10세 미만 아동용 인터페이스
            logging.info("User identified as child, directing to children interface.")
            return jsonify({'predicted_age': predicted_age, 'interface': 'children'}), 200
        else:  # 10세 이상~50세 미만을 위한 청년층 인터페이스
            logging.info("User identified as young, directing to general interface.")
            return jsonify({'predicted_age': predicted_age, 'interface': 'general'}), 200


    # 오류 처리 : 문제가 발생하면 오류를 기록하고 반환
    except Exception as e:
        logging.error(f"Error occurred: {traceback.format_exc()}")
        return jsonify({'error': 'An internal error occurred'}), 500


# Flask App 실행 : Flask 앱을 ​​시작하여 포트 5000에서 접근할 수 있도록 합니다.
if __name__ == '__main__':
    # port 5000에서 Flask app 실행
    app.run(host='0.0.0.0', port=5000, debug=True)  # 모든 network 인터페이스에서 host