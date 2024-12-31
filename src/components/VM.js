import React, { useState } from 'react';
import {
    X,
    Printer,
    Maximize2,
    Minimize2
} from 'lucide-react';
import hospitalLogo from '../assets/bch.jpeg';
import qlimgsrc from '../assets/ql.jpeg';

const ViewModal = ({ patient, onClose }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const parseTestName = (fullName) => {
        const parts = {};

        const categoryMatch = fullName.match(/\[CAT\](.*?)(?=\[SUB\])/);
        const subCategoryMatch = fullName.match(/\[SUB\](.*?)(?=\[NAME\])/);
        const nameMatch = fullName.match(/\[NAME\](.*?)(?=\[(?:TYPE|RANGE)\])/);
        const typeMatch = fullName.match(/\[TYPE\](.*?)(?=\[RANGE\])/);
        const rangeMatch = fullName.match(/\[RANGE\](.*?)$/);

        parts.category = categoryMatch ? categoryMatch[1].trim() : '';
        parts.subCategory = subCategoryMatch ? subCategoryMatch[1].trim() : '';
        parts.name = nameMatch ? nameMatch[1].trim() : '';
        parts.type = typeMatch ? typeMatch[1].trim() : '';
        parts.normalRange = rangeMatch ? rangeMatch[1].trim() : '';

        return parts;
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Patient Details - ${patient.Name}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            padding: 10px; 
                            line-height: 1.2;
                            font-size: 10px;
                        }
                        .print-header {
                            text-align: center;
                            margin-bottom: 10px;
                            padding-bottom: 5px;
                            border-bottom: 1px solid #000;
                        }
                        .print-header h1 {
                            font-size: 16px;
                            margin: 5px 0;
                        }
                        .print-header p {
                            font-size: 9px;
                            margin: 2px 0;
                        }
                        .logo-container {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 5px;
                        }
                        .logo {
                            height: 30px;
                        }
                        .patient-info {
                            
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 5px;
                            font-size: 9px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 4px;
                            text-align: left;
                        }
                        th {
                            background-color: #f8f9fa;
                            font-weight: bold;
                        }
                        h2 {
                            font-size: 12px;
                            margin: 5px 0;
                        }
                        @media print {
                            .no-print { display: none; }
                            table { page-break-inside: auto; }
                            tr { page-break-inside: avoid; page-break-after: auto; }
                            thead { display: table-header-group; }
                            @page {
                                margin: 0.5cm;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <div class="logo-container">
                            <img src="${hospitalLogo}" alt="Hospital Logo" class="logo" />
                            <img src="${qlimgsrc}" alt="QL Logo" class="logo" />
                        </div>
                                                <p>Generated: ${new Date().toLocaleString()}</p>
                    </div>

                    <div class="patient-info">
                        <table>
                            <tr>
                                <th>Patient Name</th>
                                <td>${patient.Name}</td>
                                <th>ID</th>
                                <td>${patient.Id}</td>
                            </tr>
                            <tr>
                                <th>Gender</th>
                                <td>${patient.Gender}</td>
                                <th>Age</th>
                                <td>${patient.Age}</td>
                            </tr>
                            <tr>
                                <th>Unique Number</th>
                                <td>${patient.UniqNumber}</td>
                                <th>Created Date</th>
                                <td>${new Date(patient.CreatedTime).toLocaleDateString()}</td>
                            </tr>
                        </table>
                    </div>

                    ${patient.PathologyAnalyses && patient.PathologyAnalyses.length > 0 ? `
                        
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 60%;">Test Name</th>
                                    <th style="width: 40%;">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patient.PathologyAnalyses.map(analysis => {
            const parsedTest = parseTestName(analysis.AnalysisName);
            const testName = [parsedTest.name, parsedTest.type]
                .filter(Boolean)
                .join(' - ');
            return `
                                        <tr>
                                            <td>${testName}</td>
                                            <td>${analysis.Result || 'Pending'}</td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>
                    ` : ''}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isFullScreen ? 'p-0' : 'p-4'}`}>
            <div className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${isFullScreen ? 'w-full h-full rounded-none' : 'max-w-4xl w-full max-h-[90vh]'}`}>
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
                    <h3 className="text-2xl font-semibold text-gray-800">Patient Details</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Print"
                        >
                            <Printer className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullScreen ? (
                                <Minimize2 className="w-5 h-5 text-gray-600" />
                            ) : (
                                <Maximize2 className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Close"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6" style={{ height: isFullScreen ? 'calc(100vh - 73px)' : '75vh' }}>
                    <div id="printable-content">
                        {/* Patient Information Card */}
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-blue-600 text-xl font-semibold">
                                        {patient.Name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{patient.Name}</h4>
                                    <p className="text-sm text-gray-500">ID: {patient.Id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Gender</p>
                                    <p className="font-medium text-gray-900">{patient.Gender}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Age</p>
                                    <p className="font-medium text-gray-900">{patient.Age}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Unique Number</p>
                                    <p className="font-medium text-gray-900">{patient.UniqNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Test Results */}
                        {patient.PathologyAnalyses && patient.PathologyAnalyses.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h4>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-2 border text-left bg-gray-50">Test Name</th>
                                            <th className="p-2 border text-left bg-gray-50">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patient.PathologyAnalyses.map(analysis => {
                                            const parsedTest = parseTestName(analysis.AnalysisName);
                                            const testName = [parsedTest.name, parsedTest.type]
                                                .filter(Boolean)
                                                .join(' - ');
                                            return (
                                                <tr key={analysis.Id}>
                                                    <td className="p-2 border">{testName}</td>
                                                    <td className="p-2 border">{analysis.Result || 'Pending'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;