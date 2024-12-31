import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, ScanLine, Camera } from 'lucide-react';
import hospitalLogo from '../assets/bch.jpeg';
import qlimgsrc from '../assets/ql.jpeg';

const ScannerPage = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [error, setError] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const canvasRef = useRef(null);

    // Handle manual input Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(searchValue);
        }
    };

    // Handle search
    const handleSearch = async (value) => {
        const searchId = value?.trim();
        if (!searchId) {
            setError('Please enter a patient ID');
            return;
        }

        try {
            navigate(`/test-results/${searchId}`);
        } catch (err) {
            setError('Invalid patient ID');
        }
    };

    // Check for camera permissions
    const checkCameraPermission = async () => {
        try {
            const result = await navigator.permissions.query({ name: 'camera' });
            setHasPermission(result.state === 'granted');
            return result.state;
        } catch (error) {
            console.error('Error checking camera permission:', error);
            return 'prompt';
        }
    };

    // Camera handling
    const startCamera = async () => {
        try {
            const permissionStatus = await checkCameraPermission();

            if (permissionStatus === 'denied') {
                setError('Camera access denied. Please enable camera permissions in your browser settings.');
                return;
            }

            const constraints = {
                video: {
                    facingMode: { exact: "environment" }, // Force back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                    setIsCameraOpen(true);
                    startBarcodeDetection();
                }
            } catch (err) {
                // If back camera fails, try any available camera
                console.log('Falling back to any available camera');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                    setIsCameraOpen(true);
                    startBarcodeDetection();
                }
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('Unable to access camera. Please ensure you have granted camera permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    // Handle barcode detection
    const startBarcodeDetection = () => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        const detect = () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);

                // Get the image data for processing
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                // Here you would process the image data for barcode detection
                // When a barcode is detected, call handleSearch with the value
            }

            if (isCameraOpen) {
                requestAnimationFrame(detect);
            }
        };

        video.addEventListener('loadedmetadata', () => {
            detect();
        });
    };

    // Toggle camera
    const handleCameraToggle = async () => {
        if (isCameraOpen) {
            stopCamera();
        } else {
            await startCamera();
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-800">Buraidah Central Hospital</h1>
                            <p className="text-gray-600">Patient Results Scanner</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src={hospitalLogo} alt="Hospital Logo" className="h-16" />
                            <img src={qlimgsrc} alt="QL Logo" className="h-16" />
                        </div>
                    </div>
                </div>

                {/* Scanner Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <div className="flex flex-col items-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <ScanLine className="w-10 h-10 text-blue-500" />
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Scan Patient Barcode
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            Use camera to scan barcode or enter ID manually
                        </p>

                        {/* Hidden Canvas for Image Processing */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {/* Camera View */}
                        {isCameraOpen && (
                            <div className="w-full mb-6">
                                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-blue-500">
                                    <video
                                        ref={videoRef}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        playsInline
                                    />
                                    <div className="absolute inset-0 border-2 border-red-500 border-opacity-50">
                                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 bg-opacity-50"></div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCameraToggle}
                                    className="w-full mt-4 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Close Camera
                                </button>
                            </div>
                        )}

                        {/* Camera Button */}
                        {!isCameraOpen && (
                            <button
                                onClick={handleCameraToggle}
                                className="w-full mb-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                Open Camera
                            </button>
                        )}

                        {/* Manual Input */}
                        <div className="w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter patient ID..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                            </div>

                            <button
                                onClick={() => handleSearch(searchValue)}
                                className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Search
                            </button>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="w-full mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                                    <span className="text-red-700">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="mt-8 w-full bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Instructions:</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>1. Click "Open Camera" to scan barcode</li>
                                <li>2. Hold the barcode within the scanning area</li>
                                <li>3. Or manually enter the patient ID</li>
                                <li>4. Press Enter or click Search to view results</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScannerPage;