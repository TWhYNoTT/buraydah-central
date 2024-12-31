import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save, AlertCircle } from 'lucide-react';
import { getPatientData, updatePathologyAnalysis } from '../services/api';

const parseTestName = (fullName) => {
    const parts = {};
    const nameMatch = fullName.match(/\[NAME\](.*?)(?=\[(?:TYPE|RANGE)\])/);
    const typeMatch = fullName.match(/\[TYPE\](.*?)(?=\[RANGE\])/);
    const rangeMatch = fullName.match(/\[RANGE\](.*?)$/);

    parts.name = nameMatch ? nameMatch[1].trim() : '';
    parts.type = typeMatch ? typeMatch[1].trim() : '';
    parts.normalRange = rangeMatch ? rangeMatch[1].trim() : '';

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
                updatePathologyAnalysis(testId, { result })
            );

            await Promise.all(updatePromises);
            alert('Results saved successfully!');
        } catch (error) {
            setError('Failed to save results. Please try again.');
        }
    };

    const renderInput = (test) => {
        if (test.normalRange?.toLowerCase() === 'negative') {
            return (
                <select
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setResults(prev => ({
                        ...prev,
                        [test.Id]: e.target.value
                    }))}
                    value={results[test.Id] || test.Result || ''}
                >
                    <option value="">Select result</option>
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                </select>
            );
        }

        return (
            <input
                type="text"
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setResults(prev => ({
                    ...prev,
                    [test.Id]: e.target.value
                }))}
                defaultValue={test.Result || ''}
            />
        );
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
            {/* Basic Patient Info */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Patient: {patientData.Name}</h2>
                <p className="text-sm text-gray-500">ID: {patientData.UniqNumber} | Age: {patientData.Age} | Gender: {patientData.Gender}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <table className="w-full border-collapse mb-6">
                    <thead>
                        <tr>
                            <th className="text-left p-3 bg-gray-50 border">Test Name</th>
                            <th className="text-left p-3 bg-gray-50 border">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientData.PathologyAnalyses.map((test) => {
                            const testName = [test.name, test.type]
                                .filter(Boolean)
                                .join(' - ');

                            return (
                                <tr key={test.Id}>
                                    <td className="p-3 border">{testName}</td>
                                    <td className="p-3 border">
                                        {renderInput(test)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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