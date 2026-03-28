const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        console.log('API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Try different model names
        const models = ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-pro"];
        let model;
        let modelName;
        
        for (const modelName of models) {
            try {
                model = genAI.getGenerativeModel({ model: modelName });
                console.log(`Trying model: ${modelName}`);
                break;
            } catch (e) {
                console.log(`Model ${modelName} not available`);
                continue;
            }
        }
        
        const prompt = "Hello, can you tell me about PM-KISAN scheme in one sentence?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini API is working!');
        console.log('Response:', text);
        
    } catch (error) {
        console.log('❌ Gemini API Error:');
        console.log('Error message:', error.message);
        console.log('Error details:', error);
        
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('🔑 Solution: Get a new API key from https://makersuite.google.com/app/apikey');
        } else if (error.message.includes('quota')) {
            console.log('📊 Solution: Check your quota limits or enable billing');
        } else if (error.message.includes('permission')) {
            console.log('🔐 Solution: Enable Generative AI API in Google Cloud Console');
        }
    }
}

testGemini();
