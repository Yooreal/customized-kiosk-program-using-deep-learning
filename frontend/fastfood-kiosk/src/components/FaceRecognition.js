// FaceRecognition.js code :

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs-backend-webgl';
import './FaceRecognition.css';

const FaceRecognition = () => {
    const videoRef = useRef(null); // video 요소에 대한 참조
    const canvasRef = useRef(null); // canvas 요소에 대한 참조
    const navigate = useNavigate(); // React Router navigation hook
    const [recognitionComplete, setRecognitionComplete] = useState(false); // 인식이 완료되면 Tracks
    const [predictedAge, setPredictedAge] = useState(null); // 예측된 연령을 저장
    const [showRecognition, setShowRecognition] = useState(false); // 인식 popup 가시성 제어

    useEffect(() => {
        let detectionInterval; // 얼굴 인식 간격
        let timeoutId; // 인식 숨기기를 위한 Timeout ID popup

        // webcam video stream을 시작
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // webcam access
                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream; // video stream 설정
                    video.onloadedmetadata = () => video.play(); // metadata가 load되면 동영상 재생
                }
            } catch (err) {
                console.error('Error accessing the camera: ', err); // 카메라 접근 오류 기록
            }
        };

        // BlazeFace model을 사용하여 얼굴 감지
        const detectFaces = async (model) => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
                console.warn('Skipping frame: Video not ready.'); // 비디오가 준비되지 않은 경우 처리 건너뛰기
                return;
            }

            const ctx = canvas.getContext('2d'); // canvas 그리기 context 가져오기
            canvas.width = video.videoWidth; // canvas 너비를 video 너비로 설정
            canvas.height = video.videoHeight; // canvas 높이를 video 높이로 설정

            const predictions = await model.estimateFaces(video, false); // 얼굴 예측 받기

            if (predictions.length === 0) {
                console.warn('No face detected in this frame.'); // 얼굴이 감지되지 않으면 log 기록
            } else {
                predictions.forEach((prediction) => {
                    const [x1, y1] = prediction.topLeft; // 경계 상자의 왼쪽 상단 모서리 가져오기
                    const [x2, y2] = prediction.bottomRight; // 경계 상자의 오른쪽 하단 모서리 가져오기
                    const width = x2 - x1; // 경계 상자 너비 계산
                    const height = y2 - y1; // 경계 상자 높이 계산

                    // canvas에 경계 상자 그리기
                    ctx.beginPath();
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'red';
                    ctx.rect(x1, y1, width, height);
                    ctx.stroke();

                    // 예측 연령 표시
                    const label = predictedAge !== null 
                        ? `Age: ${predictedAge}` 
                        : 'Age loading...';
                    ctx.font = '16px Arial';
                    ctx.fillStyle = 'red';
                    ctx.fillText(label, x1, y1 - 10); // 경계 상자 위에 label을 그리기
                });

                setShowRecognition(true); // 인식 popup 표시
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => setShowRecognition(false), 5000); // 5초 후 popup 숨기기

                if (!recognitionComplete) {
                    setRecognitionComplete(true); // 인식 완료 표시
                    setTimeout(() => sendImageForAgePrediction(), 3000); // 연령 예측 3초 지연
                }
            }
        };

        // video에서 frame을 캡처하여 기본 64 이미지로 반환
        const captureImage = () => {
            const video = videoRef.current;
            if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
                console.error('Video stream not ready for capturing image.'); // video가 준비되지 않은 경우 Log 오류
                return null;
            }

            const canvas = document.createElement('canvas'); // 화면 밖 canvas 생성
            canvas.width = 227; // 예측 model을 위한 canvas 너비 설정
            canvas.height = 227; // 예측 model을 위한 canvas 높이 설정
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); // video frame을 canvas에 그리기

            return canvas.toDataURL('image/jpeg'); // frame을 기본 64 문자열로 반환
        };

        // 캡처된 이미지를 연령 예측을 위해 서버로 보내기
        const sendImageForAgePrediction = async () => {
            let predictions = []; // 연령 예측을 저장하는 배열
            let elderlyConfidence = 0; // 고령층을 나타내는 예측을 추적(>= 50)
            let childConfidence = 0; // 아동을 나타내는 예측을 추적(< 10)

            for (let i = 0; i < 5; i++) { // 견고한 예측을 위해 여러 frame 캡처
                const imageDataUrl = captureImage(); // frame 캡처
                if (!imageDataUrl) {
                    console.warn('Skipped frame: Image not ready'); // 이미지가 준비되지 않은 경우 경고 기록
                    continue;
                }

                const base64Image = imageDataUrl.split(',')[1]; // 기본 64 데이터 추출

                try {
                    const response = await axios.post(
                        'http://localhost:5000/predict-age', // 연령 예측을 위한 API endpoint
                        { image: base64Image },
                        { headers: { 'Content-Type': 'application/json' } }
                    );

                    const { predicted_age } = response.data; // 응답에서 예상 연령 추출
                    predictions.push(predicted_age); // 배열에 예측 추가

                    if (predicted_age >= 50) elderlyConfidence++; // 나이가 50을 초과하면 고령층 confidence가 증가
                    if (predicted_age < 10) childConfidence++; // 10세 미만인 경우 아동 confidence가 증가
                } catch (error) {
                    console.error('Error predicting age: ', error); // 예측 실패 시 오류 기록
                }
            }

            // 평균 예측 연령 계산
            const averageAge = Math.round(
                predictions.reduce((sum, age) => sum + age, 0) / predictions.length
            );

            console.log(`Final Predicted Age: ${averageAge}`); // 평균 예측 연령 기록
            console.log(`Elderly Confidence: ${elderlyConfidence}`); // Log 고령층 confidence 수준
            console.log(`Child Confidence: ${childConfidence}`); // Log 아동 confidence 수준

            // 예측된 연령과 confidence 수준에 따라 탐색
            if (averageAge < 10 || childConfidence >= 3) {
                console.log('Navigating to Children Menu in 5 seconds...');
                setTimeout(() => navigate('/children-menu'), 5000); // 아동용 메뉴 화면으로 이동
            } else if (averageAge >= 50 || elderlyConfidence >= 3) {
                console.log('Navigating to Elderly Menu in 5 seconds...');
                setTimeout(() => navigate('/elderly-menu'), 5000); // 고령층 메뉴 화면으로 이동
            } else {
                console.log('Navigating to General Menu in 5 seconds...');
                setTimeout(() => navigate('/general-menu'), 5000); // 청년층 메뉴 화면으로 이동
            }
        };

        // BlazeFace model을 load하고 얼굴 감지를 시작
        const loadModelAndStartDetection = async () => {
            const model = await blazeface.load(); // Load the BlazeFace model
            await startVideo(); // Start the webcam
            detectionInterval = setInterval(() => detectFaces(model), 50); // 50ms마다 얼굴 감지
        };

        loadModelAndStartDetection(); // 탐지 프로세스 초기화

        return () => {
            const video = videoRef.current;
            if (video && video.srcObject) {
                const stream = video.srcObject;
                stream.getTracks().forEach((track) => track.stop()); // Stop the video stream
            }
            clearInterval(detectionInterval); // 탐지 간격 지우기
        };
    }, [navigate, recognitionComplete]);

    return (
        <div className="face-recognition-screen">
            <h1 className="facerecognition-main-heading-Face">
                AI가 얼굴인식을 시작합니다.
            </h1>
            <div className="facerecognition-video-container">
                <video ref={videoRef} className="facerecognition-video" playsInline />
                <canvas ref={canvasRef} className="facerecognition-video-canvas" />
                <div className="facerecognition-overlay-text">카메라 기능</div>
            </div>
            <p className="facerecognition-instruction-text">
                화면을 잠시 응시해 주세요.
            </p>
            {showRecognition && (
                <div className="facerecognition-recognition-popup">
                    인식을 완료했습니다.<br />잠시만 기다려주세요.
                </div>
            )}
        </div>
    );
};

export default FaceRecognition;