import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, ScanLine, Camera } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import hospitalLogo from '../assets/bch.jpeg';
import qlimgsrc from '../assets/ql.jpeg';

const ScannerPage = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [error, setError] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const codeReaderRef = useRef(null);
    const isMountedRef = useRef(false);

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

    const startCamera = async () => {
        try {
            setError(''); // Clear any previous errors

            // Try to get the back camera first
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { exact: "environment" } }
                });
            } catch (err) {
                // If back camera fails, try any camera
                console.log('Falling back to any available camera');
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
            }

            // Check if component is still mounted
            if (isMountedRef.current && videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                // Wait for video to be ready
                await new Promise((resolve) => {
                    videoRef.current.onloadedmetadata = () => {
                        resolve();
                    };
                });

                setIsCameraOpen(true);
                await initBarcodeDetection();
            } else {
                // Clean up stream if component unmounted
                stream.getTracks().forEach(track => track.stop());
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('Unable to access camera. Please ensure you have granted camera permissions and are using HTTPS.');
        }
    };

    const initBarcodeDetection = async () => {
        if (!videoRef.current || !isMountedRef.current) return;

        try {
            if (!codeReaderRef.current) {
                codeReaderRef.current = new BrowserMultiFormatReader();
            }

            setIsScanning(true);

            await codeReaderRef.current.decodeFromVideoElement(
                videoRef.current,
                (result) => {
                    if (result && isMountedRef.current) {
                        const scannedValue = result.getText();
                        console.log('Barcode detected:', scannedValue);
                        playSuccessSound();
                        handleSearch(scannedValue);
                        stopCamera();
                    }
                },
                (error) => {
                    if (error && !(error instanceof TypeError)) {
                        console.error('Barcode scanning error:', error);
                    }
                }
            );
        } catch (error) {
            console.error('Error initializing barcode detection:', error);
            setError('Failed to start barcode scanner. Please try again.');
        }
    };


    const playSuccessSound = () => {
        const audio = new Audio('data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA5TEFNRTMuOTlyAc0AAAAAAAAAABSAJAOkQgAAgAAABoZuZBwxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAAAElTlJnQ3gAJ6vG0DGjQAQAFASA0GmRAEAIAgBgGATB8HwfB8Xg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+D4Pg+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        audio.play().catch(e => console.log('Audio play error:', e));
    };

    // 5. Update the stopCamera function
    const stopCamera = () => {
        if (!isMountedRef.current) return;

        setIsCameraOpen(false);
        setIsScanning(false);

        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
            codeReaderRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Add this function and call it before starting the camera
    const checkCameraSupport = () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Camera not supported on this device or browser.');
            return false;
        }
        return true;
    };

    // Update handleCameraToggle
    const handleCameraToggle = async () => {
        if (isCameraOpen) {
            stopCamera();
        } else {
            if (checkCameraSupport()) {
                await startCamera();
            }
        }
    };

    useEffect(() => {
        isMountedRef.current = true;

        // Cleanup function
        return () => {
            isMountedRef.current = false;
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
                        {!isCameraOpen && (

                            <div>

                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                    <ScanLine className="w-10 h-10 text-blue-500" />
                                </div>

                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    Scan Patient Barcode
                                </h2>
                                <p className="text-gray-600 text-center mb-8">
                                    Use camera to scan barcode or enter ID manually
                                </p>
                            </div>
                        )}



                        {isCameraOpen && (
                            <div className="w-full mb-6">
                                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-blue-500">
                                    {/* Video Element */}
                                    <video
                                        ref={videoRef}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        playsInline
                                        muted
                                        onError={(e) => {
                                            console.error('Video error:', e);
                                            setError('Error starting video stream');
                                        }}
                                    />

                                    {/* Scanning Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* Dark overlay outside scanning area */}
                                        <div className="absolute inset-0 bg-black bg-opacity-50">
                                            {/* Clear scanning window */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-32 border-2 border-white">
                                                {/* Corner markers */}
                                                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-red-500"></div>
                                                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-red-500"></div>
                                                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-red-500"></div>
                                                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-red-500"></div>

                                                {/* Scanning line */}
                                                {isScanning && (
                                                    <div
                                                        className="absolute left-0 w-full h-0.5 bg-red-500 animate-scan"
                                                        style={{
                                                            animation: 'scan 2s linear infinite',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
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
                                <li>2. Allow camera access when prompted</li>
                                <li>3. Hold the barcode within the scanning area</li>
                                <li>4. Or manually enter the patient ID</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScannerPage;