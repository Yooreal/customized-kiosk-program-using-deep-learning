// 깃헙에 업로드 x
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs-backend-webgl';
import './FaceRecognition2.css';

const FaceRecognition2 = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [recognitionComplete, setRecognitionComplete] = useState(false);
    const [predictedAge, setPredictedAge] = useState(null);
    const [showRecognition, setShowRecognition] = useState(false);

    useEffect(() => {
        let detectionInterval;
        let timeoutId;

        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.onloadedmetadata = () => video.play();
                }
            } catch (err) {
                console.error('Error accessing the camera: ', err);
            }
        };

        const detectFaces = async (model) => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
                console.warn('Skipping frame: Video not ready.');
                return;
            }

            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const predictions = await model.estimateFaces(video, false);

            if (predictions.length > 0) {
                predictions.forEach((prediction) => {
                    const [x1, y1] = prediction.topLeft;
                    const [x2, y2] = prediction.bottomRight;
                    const width = x2 - x1;
                    const height = y2 - y1;

                    // Draw the square border for face detection
                    ctx.beginPath();
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'red';
                    ctx.rect(x1, y1, width, height);
                    ctx.stroke();

                    // Display "Age loading..." label
                    const label = predictedAge !== null 
                        ? `Age: ${predictedAge}` 
                        : 'Age loading...';
                    ctx.font = '16px Arial';
                    ctx.fillStyle = 'red';
                    ctx.fillText(label, x1, y1 - 10);
                });

                // Show recognition box and message for 5 seconds
                setShowRecognition(true);
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => setShowRecognition(false), 5000);
            }

            // Set recognition complete after detecting a face and start 5-second delay
            if (predictions.length > 0 && !recognitionComplete) {
                setRecognitionComplete(true);
                timeoutId = setTimeout(() => navigateToElderlyMenu(), 5000); // Delay before navigating
            }
        };

        const navigateToElderlyMenu = () => {
            console.log('Navigating to Elderly Menu');
            navigate('/elderly-menu'); // chldren-menu로 변경해서 테스트 후 원래대로 되돌리기.
        };

        const loadModelAndStartDetection = async () => {
            const model = await blazeface.load();
            await startVideo();
            detectionInterval = setInterval(() => detectFaces(model), 50);
        };

        loadModelAndStartDetection();

        return () => {
            console.log('Cleaning up resources...');
            const video = videoRef.current;
            if (video && video.srcObject) {
                const stream = video.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }
            if (detectionInterval) clearInterval(detectionInterval);
            clearTimeout(timeoutId); // Ensure timeout is cleared on unmount
        };
    }, [navigate, recognitionComplete]);

    return (
        <div className="face-recognition-2-screen">
            <h1 className="facerecognition-2-main-heading-Face">
                AI가 얼굴인식을 시작합니다.
            </h1>
            <div className="facerecognition-2-video-container">
                <video ref={videoRef} className="facerecognition-2-video" playsInline />
                <canvas ref={canvasRef} className="facerecognition-2-video-canvas" />
                <div className="facerecognition-2-overlay-text">카메라 기능</div>
            </div>
            <p className="facerecognition-2-instruction-text">
                화면을 잠시 응시해 주세요.
            </p>
            {showRecognition && (
                <div className="facerecognition-2-recognition-popup">
                    인식을 완료했습니다.<br />잠시만 기다려주세요.
                </div>
            )}
        </div>
    );
};

export default FaceRecognition2;
