const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function checkGeminiAPI() {
    try {
        console.log('🔍 Checking Gemini API Status...');
        console.log('API Key:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'Missing');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Try to list available models
        console.log('\n📋 Attempting to list available models...');
        const models = await genAI.listModels();
        
        console.log('✅ Available models:');
        models.forEach(model => {
            console.log(`- ${model.name}`);
        });
        
        // Try the first available model
        if (models.length > 0) {
            const firstModel = models[0];
            console.log(`\n🧪 Testing with Gemini 2.0 Flash model...`);
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const result = await model.generateContent("Hello, respond with just 'API Working'");
                const response = await result.response;
                const text = response.text();
                
                console.log('✅ Gemini API is fully functional!');
                console.log('Test response:', text);
            } catch (error) {
                console.log('❌ Gemini API Error:');
                console.log('Error message:', error.message);
                
                if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
                    console.log('\n🔑 SOLUTION: Your API key is invalid or expired');
                    console.log('1. Go to: https://makersuite.google.com/app/apikey');
                    console.log('2. Create a new API key');
                    console.log('3. Replace GEMINI_API_KEY in your .env file');
                } else if (error.message.includes('403') || error.message.includes('permission')) {
                    console.log('\n🔐 SOLUTION: API access issue');
                    console.log('1. Enable Generative AI API in Google Cloud Console');
                    console.log('2. Check billing is enabled');
                    console.log('3. Verify API key permissions');
                } else if (error.message.includes('quota') || error.message.includes('429')) {
                    console.log('\n📊 SOLUTION: Quota exceeded');
                    console.log('1. Check your usage limits');
                    console.log('2. Wait for quota reset');
                    console.log('3. Consider upgrading your plan');
                } else {
                    console.log('\n🌐 SOLUTION: Network or configuration issue');
                    console.log('1. Check internet connection');
                    console.log('2. Verify firewall settings');
                    console.log('3. Try again in a few minutes');
                }
            }
        }
        
    } catch (error) {
        console.log('❌ Gemini API Error:');
        console.log('Error message:', error.message);
        
        if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
            console.log('\n🔑 SOLUTION: Your API key is invalid or expired');
            console.log('1. Go to: https://makersuite.google.com/app/apikey');
            console.log('2. Create a new API key');
            console.log('3. Replace GEMINI_API_KEY in your .env file');
        } else if (error.message.includes('403') || error.message.includes('permission')) {
            console.log('\n🔐 SOLUTION: API access issue');
            console.log('1. Enable Generative AI API in Google Cloud Console');
            console.log('2. Check billing is enabled');
            console.log('3. Verify API key permissions');
        } else if (error.message.includes('quota') || error.message.includes('429')) {
            console.log('\n📊 SOLUTION: Quota exceeded');
            console.log('1. Check your usage limits');
            console.log('2. Wait for quota reset');
            console.log('3. Consider upgrading your plan');
        } else {
            console.log('\n🌐 SOLUTION: Network or configuration issue');
            console.log('1. Check internet connection');
            console.log('2. Verify firewall settings');
            console.log('3. Try again in a few minutes');
        }
    }
}

checkGeminiAPI();
