// src/components/TestResultsForm.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Save,
    AlertCircle,
    Tag,
    Bookmark,
    Activity,
    AlertTriangle,
    FileText
} from 'lucide-react';
import { getPatientData, updatePathologyAnalysis } from '../services/api';

const parseTestName = (fullName) => {
    const parts = {};

    const categoryMatch = fullName.match(/\[CAT\](.*?)(?=\[SUB\])/);
    const subCategoryMatch = fullName.match(/\[SUB\](.*?)(?=\[NAME\])/);
    const nameMatch = fullName.match(/\[NAME\](.*?)(?=\[(?:TYPE|RANGE)\])/);
    const typeMatch = fullName.match(/\[TYPE\](.*?)(?=\[RANGE\])/);
    const rangeMatch = fullName.match(/\[RANGE\](.*?)$/);

    parts.category = categoryMatch ? categoryMatch[1] : '';
    parts.subCategory = subCategoryMatch ? subCategoryMatch[1] : '';
    parts.name = nameMatch ? nameMatch[1] : '';
    parts.type = typeMatch ? typeMatch[1] : '';
    parts.normalRange = rangeMatch ? rangeMatch[1] : '';

    return parts;
};

const TestResultsForm = () => {
    const { patientId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [results, setResults] = useState({});

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const data = await getPatientData(patientId);
                // Parse test names when loading data
                const enhancedTests = data.PathologyAnalyses.map(test => ({
                    ...test,
                    ...parseTestName(test.AnalysisName)
                }));
                setPatientData({
                    ...data,
                    PathologyAnalyses: enhancedTests
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [patientId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatePromises = Object.entries(results).map(([testId, result]) =>
                updatePathologyAnalysis(testId, {
                    result: result
                })
            );

            await Promise.all(updatePromises);
            alert('Results saved successfully!');
        } catch (error) {
            setError('Failed to save results. Please try again.');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg text-gray-600">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 rounded-lg">
            <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <div className="text-red-700">Error: {error}</div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
            <div className="mb-8 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Test Results Form</h2>
                <p className="text-gray-600">
                    Patient: {patientData.Name} (ID: {patientData.UniqNumber})
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Age: {patientData.Age} | Gender: {patientData.Gender}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {patientData.PathologyAnalyses.map((test) => (
                    <div key={test.Id} className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                            {/* Test Name */}
                            <div className="font-medium text-lg text-gray-900">
                                <div className="inline-flex items-center px-3 py-2 rounded-md text-base font-medium bg-gray-200 text-gray-900 mr-2">
                                    <FileText className="w-5 h-5 mr-2" />
                                    {test.name}
                                </div>
                                {test.type && (
                                    <div className="inline-flex items-center px-3 py-2 rounded-md text-base font-medium bg-green-100 text-green-800">
                                        <Activity className="w-4 h-4 mr-1" />
                                        {test.type}
                                    </div>
                                )}
                            </div>

                            {/* Categories and Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {test.category && (
                                    <div className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                        <Tag className="w-4 h-4 mr-1" />
                                        {test.category}
                                    </div>
                                )}
                                {test.subCategory && (
                                    <div className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                                        <Bookmark className="w-4 h-4 mr-1" />
                                        {test.subCategory}
                                    </div>
                                )}

                                {test.normalRange && (
                                    <div className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                        Range: {test.normalRange}
                                    </div>
                                )}
                            </div>

                            {/* Result Input */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Result
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => setResults(prev => ({
                                        ...prev,
                                        [test.Id]: e.target.value
                                    }))}
                                    defaultValue={test.Result || ''}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Results
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestResultsForm;