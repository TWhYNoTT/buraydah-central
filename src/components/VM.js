import React, { useState } from 'react';
import {
    X,
    Tag,
    Bookmark,
    Activity,
    AlertTriangle,
    FileText,
    Printer,
    Maximize2,
    Minimize2
} from 'lucide-react';

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
                            padding: 20px; 
                            line-height: 1.5;
                        }
                        .print-header {
                            text-align: center;
                            margin-bottom: 20px;
                            padding-bottom: 10px;
                            border-bottom: 2px solid #000;
                        }
                        .patient-info {
                            margin-bottom: 30px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f8f9fa;
                            font-weight: bold;
                        }
                        .category-header {
                            background-color: #f0f7ff;
                            font-weight: bold;
                            padding: 10px;
                        }
                        .subcategory-header {
                            background-color: #f8f0ff;
                            padding: 8px;
                            padding-left: 20px;
                        }
                        .result-row td {
                            padding-left: 30px;
                        }
                        @media print {
                            .no-print { display: none; }
                            table { page-break-inside: auto; }
                            tr { page-break-inside: avoid; page-break-after: auto; }
                            thead { display: table-header-group; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <h1>Patient Medical Report</h1>
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
                        <h2>Pathology Analyses</h2>
                        ${(() => {
                    const groupedAnalyses = patient.PathologyAnalyses.reduce((acc, analysis) => {
                        const parsedTest = parseTestName(analysis.AnalysisName);
                        const categoryKey = parsedTest.category || 'Uncategorized';
                        const subCategoryKey = parsedTest.subCategory || 'Uncategorized';
                        const typeKey = parsedTest.name || 'Uncategorized';

                        if (!acc[categoryKey]) acc[categoryKey] = {};
                        if (!acc[categoryKey][subCategoryKey]) acc[categoryKey][subCategoryKey] = {};
                        if (!acc[categoryKey][subCategoryKey][typeKey]) acc[categoryKey][subCategoryKey][typeKey] = [];

                        acc[categoryKey][subCategoryKey][typeKey].push({
                            ...parsedTest,
                            result: analysis.Result,
                            id: analysis.Id
                        });

                        return acc;
                    }, {});

                    return Object.entries(groupedAnalyses).map(([category, subCategories]) => `
                                <div class="category-header">${category}</div>
                                ${Object.entries(subCategories).map(([subCategory, types]) => `
                                    <div class="subcategory-header">${subCategory}</div>
                                    ${Object.entries(types).map(([type, analyses]) => `
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colspan="2">${type}</th>
                                                </tr>
                                                <tr>
                                                    <th>Test Type</th>
                                                    <th>Result</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${analyses.map(analysis => `
                                                    <tr class="result-row">
                                                        <td>${analysis.type || type}</td>
                                                        <td>${analysis.result || 'Pending'}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    `).join('')}
                                `).join('')}
                            `).join('')

                })()}
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
            <div className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${isFullScreen ? 'w-full h-full rounded-none' : 'max-w-4xl w-full max-h-[90vh]'
                }`}>
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

                        {/* Pathology Analyses */}
                        {patient.PathologyAnalyses && patient.PathologyAnalyses.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Pathology Analyses</h4>
                                <div className="space-y-6">
                                    {(() => {
                                        const groupedAnalyses = patient.PathologyAnalyses.reduce((acc, analysis) => {
                                            const parsedTest = parseTestName(analysis.AnalysisName);
                                            const categoryKey = parsedTest.category || 'Uncategorized';
                                            const subCategoryKey = parsedTest.subCategory || 'Uncategorized';
                                            const typeKey = parsedTest.name || 'Uncategorized';

                                            if (!acc[categoryKey]) acc[categoryKey] = {};
                                            if (!acc[categoryKey][subCategoryKey]) acc[categoryKey][subCategoryKey] = {};
                                            if (!acc[categoryKey][subCategoryKey][typeKey]) acc[categoryKey][subCategoryKey][typeKey] = [];

                                            acc[categoryKey][subCategoryKey][typeKey].push({
                                                ...parsedTest,
                                                result: analysis.Result,
                                                id: analysis.Id
                                            });

                                            return acc;
                                        }, {});

                                        return Object.entries(groupedAnalyses).map(([category, subCategories]) => (
                                            <div key={category} className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center mb-3">
                                                    <Tag className="w-5 h-5 text-blue-600 mr-2" />
                                                    <span className="text-lg font-medium text-blue-800">{category}</span>
                                                </div>

                                                {Object.entries(subCategories).map(([subCategory, types]) => (
                                                    <div key={subCategory} className="ml-4 mt-3">
                                                        <div className="flex items-center mb-2">
                                                            <Bookmark className="w-4 h-4 text-purple-600 mr-2" />
                                                            <span className="text-md font-medium text-purple-800">
                                                                {subCategory}
                                                            </span>
                                                        </div>

                                                        {Object.entries(types).map(([type, analyses]) => (
                                                            <div key={type} className="ml-4 mt-2">
                                                                <div className="flex items-center mb-2">
                                                                    <Activity className="w-4 h-4 text-green-600 mr-2" />
                                                                    <span className="text-md font-medium text-green-800">
                                                                        {type}
                                                                    </span>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                                                                    {analyses.map((analysis) => (
                                                                        <div
                                                                            key={analysis.id}
                                                                            className="bg-white rounded-lg p-4 shadow-sm border transition-all hover:shadow-md"
                                                                        >
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <div className="flex items-center">
                                                                                    <FileText className="w-4 h-4 text-gray-600 mr-2" />
                                                                                    <span className="font-medium text-gray-900">
                                                                                        {analysis.type || type}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {analysis.normalRange && (
                                                                                <div className="flex items-center mb-2">
                                                                                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
                                                                                    <span className="text-sm text-yellow-800">
                                                                                        Range: {analysis.normalRange}
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            <div className="mt-2 p-2 bg-gray-50 rounded">
                                                                                <span className="font-medium text-gray-700">Result: </span>
                                                                                <span className="text-gray-900">
                                                                                    {analysis.result || 'Pending'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;