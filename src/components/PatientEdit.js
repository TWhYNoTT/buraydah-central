import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    FileText,
    AlertCircle,
    Trash,
    Plus,
    Tag,
    Bookmark,
    Activity,
    AlertTriangle
} from 'lucide-react';
import { getPatientById, updatePatient } from '../services/api';

const parseTestName = (fullName) => {
    const parts = {};

    // Extract each part using regex
    const categoryMatch = fullName.match(/\[CAT\](.*?)(?=\[SUB\])/);
    const subCategoryMatch = fullName.match(/\[SUB\](.*?)(?=\[NAME\])/);
    const nameMatch = fullName.match(/\[NAME\](.*?)(?=\[(?:TYPE|RANGE)\])/);
    const typeMatch = fullName.match(/\[TYPE\](.*?)(?=\[RANGE\])/);
    const rangeMatch = fullName.match(/\[RANGE\](.*?)$/);

    // Assign matched values or empty strings
    parts.category = categoryMatch ? categoryMatch[1] : '';
    parts.subCategory = subCategoryMatch ? subCategoryMatch[1] : '';
    parts.name = nameMatch ? nameMatch[1] : '';
    parts.type = typeMatch ? typeMatch[1] : '';
    parts.normalRange = rangeMatch ? rangeMatch[1] : '';

    return parts;
};

const PatientEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [patientData, setPatientData] = useState({
        uniqueNumber: '',
        name: '',
        age: '',
        gender: '',
        pathologyAnalyses: []
    });

    const fetchPatientData = useCallback(async () => {
        try {
            const data = await getPatientById(id);
            setPatientData({
                uniqueNumber: data.UniqNumber,
                name: data.Name,
                age: data.Age,
                gender: data.Gender,
                pathologyAnalyses: data.PathologyAnalyses.map(analysis => ({
                    id: analysis.Id,
                    name: analysis.AnalysisName,
                    result: analysis.Result || '',
                    isEditing: false,  // Add this field
                    ...parseTestName(analysis.AnalysisName)
                }))
            });
        } catch (error) {
            setError('Failed to fetch patient data');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [id]); // include any dependencies that fetchPatientData uses

    useEffect(() => {
        fetchPatientData();
    }, [fetchPatientData]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await updatePatient(id, {
                uniqueNumber: parseInt(patientData.uniqueNumber),
                name: patientData.name,
                age: parseInt(patientData.age),
                gender: patientData.gender,
                pathologyAnalyses: patientData.pathologyAnalyses.map(analysis => {
                    // Reconstruct the full name with prefixes
                    const fullName = analysis.type
                        ? `[CAT]${analysis.category}[SUB]${analysis.subCategory}[NAME]${analysis.name}[TYPE]${analysis.type}[RANGE]${analysis.normalRange}`
                        : `[CAT]${analysis.category}[SUB]${analysis.subCategory}[NAME]${analysis.name}[RANGE]${analysis.normalRange}`;

                    return {
                        id: analysis.id,
                        name: fullName,  // Use the reconstructed prefixed name
                        result: analysis.result
                    };
                })
            });
            navigate('/');
        } catch (error) {
            setError('Failed to update patient data');
            console.error('Error:', error);
        }
    };



    const handleAnalysisChange = (index, field, value) => {
        const updatedAnalyses = [...patientData.pathologyAnalyses];

        // Update the specific field
        updatedAnalyses[index] = {
            ...updatedAnalyses[index],
            [field]: value
        };

        setPatientData(prev => ({
            ...prev,
            pathologyAnalyses: updatedAnalyses
        }));
    };

    const addNewAnalysis = () => {
        setPatientData(prev => ({
            ...prev,
            pathologyAnalyses: [
                ...prev.pathologyAnalyses,
                {
                    id: 0,
                    name: '',
                    result: '',
                    category: '',
                    subCategory: '',
                    type: '',
                    normalRange: ''
                }
            ]
        }));
    };

    const removeAnalysis = (index) => {
        const updatedAnalyses = [...patientData.pathologyAnalyses];
        updatedAnalyses.splice(index, 1);
        setPatientData(prev => ({
            ...prev,
            pathologyAnalyses: updatedAnalyses
        }));
    };
    // Add this new state to track the full name




    const toggleEditMode = (index) => {
        const updatedAnalyses = [...patientData.pathologyAnalyses];
        const analysis = updatedAnalyses[index];

        if (analysis.isEditing) {
            // When saving, reconstruct the full name with current values
            const fullName = analysis.type
                ? `[CAT]${analysis.category}[SUB]${analysis.subCategory}[NAME]${analysis.name}[TYPE]${analysis.type}[RANGE]${analysis.normalRange}`
                : `[CAT]${analysis.category}[SUB]${analysis.subCategory}[NAME]${analysis.name}[RANGE]${analysis.normalRange}`;

            updatedAnalyses[index] = {
                ...analysis,
                fullName: fullName,
                isEditing: false
            };
        } else {
            // Just toggle edit mode
            updatedAnalyses[index] = {
                ...analysis,
                isEditing: true
            };
        }

        setPatientData(prev => ({
            ...prev,
            pathologyAnalyses: updatedAnalyses
        }));
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* Header and error section remain the same */}
                <div className="mb-8 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Patient</h1>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient basic info section remains the same */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Health Care No.
                            </label>
                            <input
                                type="text"
                                value={patientData.uniqueNumber}
                                onChange={(e) => setPatientData(prev => ({
                                    ...prev,
                                    uniqueNumber: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                value={patientData.name}
                                onChange={(e) => setPatientData(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Age
                            </label>
                            <input
                                type="number"
                                value={patientData.age}
                                onChange={(e) => setPatientData(prev => ({
                                    ...prev,
                                    age: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <select
                                value={patientData.gender}
                                onChange={(e) => setPatientData(prev => ({
                                    ...prev,
                                    gender: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                    </div>
                    {/* Enhanced Pathology Analyses Section */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <FileText className="w-6 h-6 text-blue-600 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Serology Analyses
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={addNewAnalysis}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Analysis
                            </button>
                        </div>


                        {/* Replace the existing test display section */}
                        <div className="space-y-4">
                            {patientData.pathologyAnalyses.map((analysis, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    {/* Test Name Display/Edit Section */}
                                    <div className="mb-4">
                                        {/* Replace the existing edit input section */}
                                        {analysis.isEditing ? (
                                            <div className="mb-3 space-y-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Category
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={analysis.category}
                                                            onChange={(e) => handleAnalysisChange(index, 'category', e.target.value)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Sub Category
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={analysis.subCategory}
                                                            onChange={(e) => handleAnalysisChange(index, 'subCategory', e.target.value)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Test Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={analysis.name}
                                                            onChange={(e) => handleAnalysisChange(index, 'name', e.target.value)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Type
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={analysis.type}
                                                            onChange={(e) => handleAnalysisChange(index, 'type', e.target.value)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Normal Range
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={analysis.normalRange}
                                                            onChange={(e) => handleAnalysisChange(index, 'normalRange', e.target.value)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleEditMode(index)}
                                                            className="px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="inline-flex items-center px-3 py-2 rounded-md text-base font-medium bg-gray-200 text-gray-900">
                                                    <FileText className="w-5 h-5 mr-2" />
                                                    {analysis.name}
                                                </div>

                                                {analysis.type && (
                                                    <div className="inline-flex items-center px-3 py-1.5 rounded-md text-base font-medium bg-green-100 text-green-800">
                                                        <Activity className="w-4 h-4 mr-1" />
                                                        {analysis.type}
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleEditMode(index)}
                                                    className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}

                                    </div>

                                    {/* Rest of the test display remains the same */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.category && (
                                                <div className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                                    <Tag className="w-4 h-4 mr-1" />
                                                    {analysis.category}
                                                </div>
                                            )}
                                            {analysis.subCategory && (
                                                <div className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                                                    <Bookmark className="w-4 h-4 mr-1" />
                                                    {analysis.subCategory}
                                                </div>
                                            )}
                                            {analysis.normalRange && (
                                                <div className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
                                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                                    Range: {analysis.normalRange}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Result Input Section */}
                                    <div className="grid grid-cols-6 gap-4 items-end">
                                        <div className="col-span-5">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Result
                                            </label>
                                            <input
                                                type="text"
                                                value={analysis.result}
                                                onChange={(e) => handleAnalysisChange(index, 'result', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-1 flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeAnalysis(index)}
                                                className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientEdit;