// Simple test script to verify Gemini API is working
const axios = require('axios');
require('dotenv').config();

const testGeminiAPI = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('API Key exists:', !!apiKey);
        console.log('API Key length:', apiKey?.length);
        console.log('API Key (first 10 chars):', apiKey?.substring(0, 10));

        const modelName = 'gemini-2.0-flash-exp';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        console.log('\n🤖 Testing Gemini API...');
        console.log('Model:', modelName);
        console.log('URL:', apiUrl.replace(apiKey, 'API_KEY_HIDDEN'));

        const response = await axios.post(apiUrl, {
            contents: [{
                parts: [{
                    text: 'Say hello in one word'
                }]
            }]
        });

        console.log('\n✅ SUCCESS!');
        console.log('Response:', response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error('\n❌ ERROR!');
        console.error('Error message:', error.message);
        console.error('Status:', error.response?.status);
        console.error('Status text:', error.response?.statusText);
        console.error('Error data:', JSON.stringify(error.response?.data, null, 2));
    }
};

testGeminiAPI();
