# generate_base64.py code :    

# 사용된 주요 기능 :
# cv2.dnn.readNetFromCaffe : Caffe 모델을 아키텍처와 사전 훈련된 가중치로 로드
# prototxt : 네트워크 구조를 정의
# caffemodel : 훈련된 가중치를 포함

# 이 코드는 필요한 라이브러리를 가져온 후(cv2), Caffe 모델의 아키텍처(deploy_age.prototxt)와 가중치(age_net.caffemodel)에 대한 경로를 정의하고, cv2.dnn.readNetFromCaffe모델을 로드하는 데 사용한다. 성공 시 성공 메시지를 인쇄, 실패 시 예외를 포착하고 오류 메시지를 출력한다.

# import 기능 : OpenCV 라이브러리를 가져옴
import cv2

# Caffe models 및 Prototext 경로
AGE_PROTO_PATH = "models/my_saved_model/deploy_age.prototxt" # deploy_age.prototxt : Caffe model의 아키텍처를 정의
AGE_MODEL_PATH = "models/my_saved_model/age_net.caffemodel" # age_net.caffemodel : 연령 예측 모델에 대한 사전 훈련된 가중치를 포함

# Try-Except Block : OpenCV의 DNN 모듈을 사용하여 연령 예측 모델을 로드하고 오류를 정상적으로 처리
try:
    # OpenCV DNN 모듈을 사용하여 Caffe model 로드
    age_net = cv2.dnn.readNetFromCaffe(AGE_PROTO_PATH, AGE_MODEL_PATH) # OpenCV의 심층 신경망(DNN) 모듈을 사용하여 사전 학습된 모델과 구성을 로드
    # cv2.dnn.readNetFromCaffe 작동 원리 : prototxt 네트워크 구조(예: 계층, 계층 유형, 연결)를 이해하기 위해 파일을 읽음 - 파일에서 훈련된 가중치를 로드하여 caffemodel 예측을 위한 네트워크를 구성함
    print("Age model loaded successfully!") # 콘솔에 성공 또는 오류 메시지를 출력

except Exception as e:
    print(f"Error loading model: {e}") # 모델 로딩 중 예외를 처리함. 오류가 발생하면(예: 누락된 파일, 잘못된 경로) 문제를 기록