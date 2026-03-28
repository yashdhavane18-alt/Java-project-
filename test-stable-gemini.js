const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testStableGemini() {
    try {
        console.log('🧪 Testing Gemini 2.0 Flash (stable version)...');
        console.log('API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Test the stable Gemini 2.0 Flash model (same as your working HTML code)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = "What is PM-KISAN scheme? Answer in one sentence.";
        console.log(`\n📝 Prompt: ${prompt}`);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini 2.0 Flash (stable) is working!');
        console.log(`🤖 Response: ${text}`);
        
        // Test with a more complex government scheme question
        console.log('\n🏛️ Testing with complex question...');
        const complexPrompt = "I am a farmer with 1.5 hectares of land. Which government schemes can help me? List 2 schemes with brief details.";
        console.log(`📝 Complex Prompt: ${complexPrompt}`);
        
        const complexResult = await model.generateContent(complexPrompt);
        const complexResponse = await complexResult.response;
        const complexText = complexResponse.text();
        
        console.log(`🤖 Complex Response: ${complexText}`);
        
        console.log('\n🎉 SUCCESS: Gemini 2.0 Flash is working perfectly!');
        console.log('✅ Your project should now work with the updated model name.');
        
    } catch (error) {
        console.log('❌ Error:', error.message);
        
        if (error.message.includes('429') || error.message.includes('quota')) {
            console.log('\n⚠️ QUOTA ISSUE: You have exceeded your quota for this model.');
            console.log('💡 SOLUTIONS:');
            console.log('1. Wait a few minutes and try again');
            console.log('2. Enable billing in Google Cloud Console for higher quotas');
            console.log('3. The fallback models in your server will handle this automatically');
        } else if (error.message.includes('401') || error.message.includes('API_KEY_INVALID')) {
            console.log('\n🔑 API KEY ISSUE: Your API key might be invalid');
            console.log('💡 SOLUTION: Check your API key in the .env file');
        } else {
            console.log('\n🔍 OTHER ISSUE:', error.message);
        }
    }
}

testStableGemini();
