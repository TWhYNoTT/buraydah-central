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
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Handle manual input Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
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
            // You might want to validate the ID exists before navigating
            // const response = await validatePatientId(searchId);
            navigate(`/test-results/${searchId}`);
        } catch (err) {
            setError('Invalid patient ID');
        }
    };

    // Camera handling
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Use back camera if available
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
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

    // Toggle camera
    const handleCameraToggle = async () => {
        if (isCameraOpen) {
            stopCamera();
        } else {
            setIsCameraOpen(true);
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
                        <div className="flex items-center gap-4 flex-wrap justify-center">
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
                            Enter Patient ID
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            Enter the patient ID manually or use the camera
                        </p>

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
                                <li>1. Enter the patient ID in the search box</li>
                                <li>2. Or click "Open Camera" to use device camera</li>
                                <li>3. Press Enter or click Search to view results</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScannerPage;