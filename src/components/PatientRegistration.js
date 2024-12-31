import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { UserPlus, Save, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { testCategories } from '../data/testData';
import { savePatient, savePathologyAnalysis } from '../services/api';
import { useNavigate } from 'react-router-dom';
import hospitalLogo from '../assets/bch.jpeg';
import qlimgsrc from '../assets/ql.jpeg';










const Barcode = ({ value, width = 1.5, height = 80, fontSize = 14 }) => {
    const barcodeRef = useRef();

    useEffect(() => {
        if (barcodeRef.current) {
            try {
                JsBarcode(barcodeRef.current, value, {
                    width,
                    height,
                    fontSize,
                    margin: 10,
                    format: "CODE128",
                    background: "#FFFFFF",
                });
            } catch (error) {
                console.error('Error generating barcode:', error);
            }
        }
    }, [value, width, height, fontSize]);

    return <svg ref={barcodeRef} />;
};

const PrintableBarcode = ({ barcodeValue, patientData, PID }) => {
    return (
        <div id="printable-section">
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        html, body {
                            height: 500px !important;
                            overflow: hidden !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            background: #fff;
                        }
                        #printable-section,
                        #printable-section * {
                            visibility: visible;
                        }
                        #printable-section {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 15mm;
                            box-sizing: border-box;
                            page-break-after: avoid;
                            background: #fff;
                        }
                        @page {
                            size: A4;
                            margin: 0;
                        }
                    }
                    @media screen {
                        #printable-section {
                            display: none;
                        }
                    }
                `}
            </style>

            <div className="w-full max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Buraidah Central Hospital</h1>
                        <p className="text-sm text-gray-600">Ministry of Health - Kingdom of Saudi Arabia</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src={hospitalLogo} alt="Hospital Logo" className="h-12" />
                        <img src={qlimgsrc} alt="Logo" className="h-12" />
                    </div>
                </div>

                {/* Patient Info */}
                <div className="text-center mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Patient Test Results Barcode</h2>
                    <div className="space-y-2">
                        <p className="text-gray-600">Patient ID: {PID}</p>
                        <p className="text-gray-600">Patient Name: {patientData.name}</p>
                        <p className="text-gray-600">Healthcare No: {patientData.healthCareNo}</p>
                    </div>
                </div>

                {/* Barcode */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-white p-4 border rounded-lg mb-4">
                        <Barcode
                            value={barcodeValue}
                            width={1.5}
                            height={80}
                            fontSize={14}
                        />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                        Scan this barcode to access and update test results for this patient.
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">
                        Generated on: {new Date().toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                        Buraidah Central Hospital - Laboratory Department
                    </p>
                </div>
            </div>
        </div>
    );
};

const BarcodeDisplay = ({ barcodeValue, onPrint, onNext, onRegisterAnother }) => {
    return (
        <div className="text-center p-4 print:hidden">
            <div className="mb-6">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500 mx-auto" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
                    Patient Registration Complete
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-2">
                    Scan this barcode to access the test results form
                </p>
            </div>

            <div className="flex justify-center mb-6 md:mb-8">
                <div className="p-3 md:p-4 bg-white border rounded-lg shadow-sm">
                    <Barcode
                        value={barcodeValue}
                        width={1.5}
                        height={80}
                        fontSize={14}
                    />
                </div>
            </div>

            <div className="max-w-md mx-auto mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                        Scan this barcode to open the results form. The form will allow you to enter test results for this patient.
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={onRegisterAnother}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Register Another Patient
                </button>
                <button
                    onClick={onNext}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Next Step
                </button>
                <button
                    onClick={onPrint}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <span className="mr-2">🖨️</span> Print Barcode
                </button>
            </div>
        </div>
    );
};



const PatientRegistration = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);

    const [PID, setPID] = useState('');


    const [patientData, setPatientData] = useState({
        healthCareNo: '',
        name: '',
        age: '',
        sex: '',
        nationality: '',
        consultant: '',
        department: '',
        unit: '',
        labNo: ''
    });

    const [selectedTests, setSelectedTests] = useState(testCategories);
    const handlePrint = () => {
        window.print();
    };


    const handleTestSelection = (category, subCategory, test, subTest = null) => {
        console.log('Selection:', { category, subCategory, test, subTest }); // Debug

        setSelectedTests(prev => {
            const newState = JSON.parse(JSON.stringify(prev));

            // Handle Widal Test special case
            if (test === 'widalTest' && subTest) {
                const [type, subtype] = subTest.split('.');
                if (newState[category][subCategory].widalTest[type] &&
                    newState[category][subCategory].widalTest[type][subtype]) {
                    newState[category][subCategory].widalTest[type][subtype].selected =
                        !newState[category][subCategory].widalTest[type][subtype].selected;
                }
                return newState;
            }

            // Handle regular nested tests (IgM/IgG)
            if (subTest) {
                if (newState[category][subCategory][test] &&
                    newState[category][subCategory][test][subTest]) {
                    newState[category][subCategory][test][subTest].selected =
                        !newState[category][subCategory][test][subTest].selected;
                }
                return newState;
            }

            // Handle regular tests
            if (newState[category][subCategory][test]) {
                newState[category][subCategory][test].selected =
                    !newState[category][subCategory][test].selected;
            }

            return newState;
        });
    };

    const handlePatientSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const patientPayload = {
                uniqueNumber: parseInt(patientData.healthCareNo),
                name: patientData.name,
                age: parseInt(patientData.age),
                gender: patientData.sex,
                dateTime: new Date().toISOString()
            };

            const patientResult = await savePatient(patientPayload);
            const patientId = patientResult.ID;

            if (!patientId) {
                throw new Error('Patient ID not received from server');
            }

            const selectedTestsToSave = processSelectedTests(patientId);

            if (selectedTestsToSave.length === 0) {
                throw new Error('No tests selected');
            }

            // Save all selected tests
            const savePromises = selectedTestsToSave.map(test => savePathologyAnalysis(test));
            await Promise.all(savePromises);




            setPID(patientId);
            setStep(2);
        } catch (error) {
            console.error('Error details:', error);
            setError(error.message || 'Failed to save patient data. Please try again.');
        }
    };

    const handleNextStep = () => {
        navigate(`/test-results/${PID}`);

    };

    const processSelectedTests = (patientId) => {
        const selectedTestsToSave = [];

        Object.entries(selectedTests).forEach(([category, categoryTests]) => {
            Object.entries(categoryTests).forEach(([subCategory, subCategoryTests]) => {
                Object.entries(subCategoryTests).forEach(([testName, test]) => {
                    // Handle tests with IgM/IgG subtypes (like HAV Ab)
                    if (test.hasOwnProperty('igm') || test.hasOwnProperty('igg')) {
                        ['igm', 'igg'].forEach(type => {
                            if (test[type] && test[type].selected) {
                                selectedTestsToSave.push({
                                    name: `[CAT]${category}[SUB]${subCategory}[NAME]${test.name}[TYPE]${test[type].name}[RANGE]${test[type].normalRange}`,
                                    patientID: patientId,
                                    result: null
                                });
                            }
                        });
                    }
                    // Handle Widal Test
                    else if (testName === 'widalTest') {
                        // Handle Salmonella Typhi
                        Object.entries(test.salmonellaTyphi).forEach(([, value]) => {
                            if (value.selected) {
                                selectedTestsToSave.push({
                                    name: `[CAT]${category}[SUB]${subCategory}[NAME]Widal Test[TYPE]Salmonella Typhi ${value.name}[RANGE]${value.normalRange}`,
                                    patientID: patientId,
                                    result: null
                                });
                            }
                        });
                        // Handle Salmonella Paratyphi
                        Object.entries(test.salmonellaParatyphi).forEach(([, value]) => {
                            if (value.selected) {
                                selectedTestsToSave.push({
                                    name: `[CAT]${category}[SUB]${subCategory}[NAME]Widal Test[TYPE]Salmonella Paratyphi ${value.name}[RANGE]${value.normalRange}`,
                                    patientID: patientId,
                                    result: null
                                });
                            }
                        });
                    }
                    // Handle Brucella test
                    else if (testName === 'brucella') {
                        Object.entries(test).forEach(([, brucellaData]) => {
                            if (brucellaData.selected) {
                                selectedTestsToSave.push({
                                    name: `[CAT]${category}[SUB]${subCategory}[NAME]${brucellaData.name}[RANGE]${brucellaData.normalRange}`,
                                    patientID: patientId,
                                    result: null
                                });
                            }
                        });
                    }
                    // Handle regular tests
                    else if (test.selected) {
                        selectedTestsToSave.push({
                            name: `[CAT]${category}[SUB]${subCategory}[NAME]${test.name}[RANGE]${test.normalRange}`,
                            patientID: patientId,
                            result: null
                        });
                    }
                });
            });
        });

        return selectedTestsToSave;
    };

    const renderTests = (categoryName, category) => {
        return Object.entries(category).map(([subCategoryName, subCategory]) => (
            <div key={`${categoryName}-${subCategoryName}`} className="mb-6">
                <h4 className="font-medium mb-3 text-gray-700">
                    {subCategoryName.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="space-y-2">
                    {Object.entries(subCategory).map(([testName, test]) => {
                        // Handle antibody tests with IgM/IgG subtypes
                        if (['havAb', 'toxoplasmaAb'].includes(testName)) {
                            return (
                                <div key={testName} className="ml-4 mb-4">
                                    <div className="font-medium text-sm text-gray-700 mb-2">
                                        {test.name}
                                    </div>
                                    <div className="ml-4">
                                        {test.igm && (
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={test.igm.selected || false}
                                                    onChange={() => handleTestSelection(categoryName, subCategoryName, testName, 'igm')}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm text-gray-700">
                                                    {test.igm.name}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({test.igm.normalRange})
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                        {test.igg && (
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={test.igg.selected || false}
                                                    onChange={() => handleTestSelection(categoryName, subCategoryName, testName, 'igg')}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm text-gray-700">
                                                    {test.igg.name}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({test.igg.normalRange})
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                        // Handle Brucella test
                        if (testName === 'brucella') {
                            return (
                                <div key={testName} className="mb-4">
                                    <div className="font-medium text-sm text-gray-600 mb-2">
                                        {testName}
                                    </div>
                                    <div className="ml-4">
                                        {Object.entries(test).map(([brucellaType, brucellaData]) => (
                                            <div key={brucellaType} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={brucellaData.selected || false}
                                                    onChange={() => handleTestSelection(categoryName, subCategoryName, 'brucella', brucellaType)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm text-gray-700">
                                                    {brucellaData.name}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({brucellaData.normalRange})
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        // Handle Widal Test
                        if (testName === 'widalTest') {
                            return (
                                <div key={testName} className="mb-4">
                                    <div className="font-medium text-sm text-gray-600 mb-2">
                                        {test.name}
                                    </div>
                                    <div className="ml-4">
                                        {/* Salmonella Typhi */}
                                        {Object.entries(test.salmonellaTyphi).map(([key, value]) => (
                                            <div key={`typhi-${key}`} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={value.selected || false}
                                                    onChange={() => handleTestSelection(categoryName, subCategoryName, 'widalTest', `salmonellaTyphi.${key}`)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm text-gray-700">
                                                    {value.name}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({value.normalRange})
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                        {/* Salmonella Paratyphi */}
                                        {Object.entries(test.salmonellaParatyphi).map(([key, value]) => (
                                            <div key={`paratyphi-${key}`} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={value.selected || false}
                                                    onChange={() => handleTestSelection(categoryName, subCategoryName, 'widalTest', `salmonellaParatyphi.${key}`)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm text-gray-700">
                                                    {value.name}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({value.normalRange})
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        // Regular tests (like Paul Bunnel Test, Toxoplasma, etc.)
                        if (test.hasOwnProperty('name')) {
                            return (
                                <div key={testName} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={test.selected || false}
                                        onChange={() => handleTestSelection(categoryName, subCategoryName, testName)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        {test.name}
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({test.normalRange})
                                        </span>
                                    </label>
                                </div>
                            );
                        }

                        return null; // Skip any invalid data
                    })}
                </div>
            </div>
        ));
    };

    return (
        <>
            {step === 2 && (
                <PrintableBarcode
                    barcodeValue={PID}
                    patientData={patientData}
                    PID={PID}
                />
            )}

            <div className="min-h-screen bg-gray-50 py-4 px-2 md:py-8 md:px-4 print:bg-white print:p-0">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-6 print:shadow-none print:p-0">
                    {/* Header Section */}
                    <div className="mb-6 md:mb-8 border-b pb-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="text-center md:text-left">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Buraidah Central Hospital</h1>
                                <p className="text-sm md:text-base text-gray-600">Ministry of Health - Kingdom of Saudi Arabia</p>
                            </div>
                            <div className="flex items-center justify-center md:justify-end gap-2">
                                <img src={hospitalLogo} alt="Hospital Logo" className="h-12 md:h-16" />
                                <img src={qlimgsrc} alt="Logo" className="h-12 md:h-16" />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <AlertCircle className="h-5 w-5 text-red-400 mb-2 md:mb-0 md:mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <div className="mt-1 text-sm text-red-700">{error}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 ? (
                        <div>
                            <div className="flex items-center mb-6">
                                <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
                                <h2 className="text-lg md:text-xl font-semibold text-gray-700">Patient Registration</h2>
                            </div>

                            <form onSubmit={handlePatientSubmit} className="space-y-4 md:space-y-6">
                                {/* Patient Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Health Care No.</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={patientData.healthCareNo}
                                            onChange={(e) => setPatientData({ ...patientData, healthCareNo: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={patientData.name}
                                            onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Age</label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={patientData.age}
                                            onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Sex</label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={patientData.sex}
                                            onChange={(e) => setPatientData({ ...patientData, sex: e.target.value })}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nationality</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={patientData.nationality}
                                            onChange={(e) => setPatientData({ ...patientData, nationality: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Test Selection Section */}
                                <div className="border-t pt-4 md:pt-6 mt-4 md:mt-6">
                                    <div className="flex items-center mb-4 md:mb-6">
                                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
                                        <h3 className="text-base md:text-lg font-semibold text-gray-700">Test Selection</h3>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                                        {Object.entries(selectedTests).map(([category, tests]) => (
                                            <div key={category} className="bg-gray-50 p-3 md:p-4 rounded-lg">
                                                <h4 className="font-bold mb-3 md:mb-4 text-gray-800 border-b pb-2">
                                                    {category.replace(/([A-Z])/g, ' $1').trim()}
                                                </h4>
                                                {renderTests(category, tests)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 md:pt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save and Generate QR
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <BarcodeDisplay
                            barcodeValue={PID}
                            onPrint={handlePrint}
                            onNext={handleNextStep}
                            onRegisterAnother={() => setStep(1)}
                        />
                    )}
                </div>
            </div>

        </>
    );
};



export default PatientRegistration;