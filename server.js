const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./db');
const { router: authRoutes } = require('./routes/auth');
const schemesRoutes = require('./routes/schemes');
const adminRoutes = require('./routes/admin');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});

// Middleware
app.use(limiter);
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Optional authentication middleware for chat endpoint
const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            console.log('Invalid token in chat request, proceeding without auth');
        }
    }
    next();
};

// Favicon route to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Government Scheme Finder API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/admin', adminRoutes);

// Intelligent Response Generator for Chatbot
function generateIntelligentResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Government Schemes Database
    const schemes = {
        'pm kisan': {
            name: 'PM-KISAN Samman Nidhi',
            description: 'Direct income support to farmers',
            eligibility: 'Small and marginal farmers with cultivable land up to 2 hectares',
            benefits: '₹6,000 per year in three installments of ₹2,000 each',
            documents: 'Aadhaar card, Bank account details, Land ownership documents',
            application: 'Apply online at pmkisan.gov.in or visit nearest CSC/bank',
            website: 'https://pmkisan.gov.in'
        },
        'ayushman bharat': {
            name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana',
            description: 'Health insurance scheme for economically vulnerable families',
            eligibility: 'Families identified in SECC-2011 database and rural/urban poor',
            benefits: 'Health coverage up to ₹5 lakh per family per year',
            documents: 'Aadhaar card, Ration card, SECC verification',
            application: 'Visit nearest empaneled hospital or apply at Common Service Center',
            website: 'https://pmjay.gov.in'
        },
        'jan dhan': {
            name: 'Pradhan Mantri Jan Dhan Yojana',
            description: 'Financial inclusion program for banking services',
            eligibility: 'All Indian citizens above 10 years of age',
            benefits: 'Zero balance bank account, RuPay debit card, accident insurance ₹2 lakh',
            documents: 'Aadhaar card or any government ID proof, Address proof',
            application: 'Visit any bank branch with required documents',
            website: 'https://pmjdy.gov.in'
        },
        'ujjwala': {
            name: 'Pradhan Mantri Ujjwala Yojana',
            description: 'Free LPG connections to women from BPL families',
            eligibility: 'Women from BPL families, priority to SC/ST/PMAY/AAY households',
            benefits: 'Free LPG connection with deposit-free cylinder and regulator',
            documents: 'BPL ration card, Aadhaar card, Bank account details, Address proof',
            application: 'Apply at nearest LPG distributor or online',
            website: 'https://pmuy.gov.in'
        },
        'awas yojana': {
            name: 'Pradhan Mantri Awas Yojana',
            description: 'Housing for all by 2022',
            eligibility: 'Families without pucca house, annual income criteria varies by category',
            benefits: 'Subsidy on home loans, direct assistance for house construction',
            documents: 'Income certificate, Aadhaar card, Bank account, Property documents',
            application: 'Apply online at pmaymis.gov.in or visit nearest bank',
            website: 'https://pmaymis.gov.in'
        }
    };
    
    // Intent Detection
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! I'm your Government Scheme Assistant. I can help you with:\n\n🏛️ Information about government schemes\n📋 Eligibility criteria\n📄 Required documents\n💰 Benefits and subsidies\n🔗 Application processes\n\nWhich scheme would you like to know about? (PM-KISAN, Ayushman Bharat, Jan Dhan Yojana, Ujjwala, Awas Yojana, etc.)";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
        return "You're welcome! I'm here to help you navigate government schemes. Feel free to ask about any other schemes, eligibility criteria, or application processes. Have a great day! 🙏";
    }
    
    // Scheme-specific responses
    for (const [key, scheme] of Object.entries(schemes)) {
        if (message.includes(key) || message.includes(scheme.name.toLowerCase())) {
            if (message.includes('eligibility') || message.includes('eligible') || message.includes('qualify')) {
                return `**${scheme.name} - Eligibility Criteria:**\n\n✅ ${scheme.eligibility}\n\n**Benefits:** ${scheme.benefits}\n\n**Required Documents:** ${scheme.documents}\n\n**How to Apply:** ${scheme.application}\n\n🔗 Official Website: ${scheme.website}\n\nWould you like to know about the application process or any other details?`;
            }
            
            if (message.includes('document') || message.includes('papers') || message.includes('certificate')) {
                return `**${scheme.name} - Required Documents:**\n\n📄 ${scheme.documents}\n\n**Application Process:** ${scheme.application}\n\n**Benefits:** ${scheme.benefits}\n\n🔗 Official Website: ${scheme.website}\n\nMake sure to have all documents ready before applying. Need help with anything else?`;
            }
            
            if (message.includes('apply') || message.includes('application') || message.includes('how to')) {
                return `**${scheme.name} - Application Process:**\n\n📝 ${scheme.application}\n\n**Required Documents:** ${scheme.documents}\n\n**Eligibility:** ${scheme.eligibility}\n\n**Benefits:** ${scheme.benefits}\n\n🔗 Official Website: ${scheme.website}\n\nTip: Keep all documents ready and apply online for faster processing!`;
            }
            
            if (message.includes('benefit') || message.includes('money') || message.includes('amount') || message.includes('subsidy')) {
                return `**${scheme.name} - Benefits:**\n\n💰 ${scheme.benefits}\n\n**Description:** ${scheme.description}\n\n**Eligibility:** ${scheme.eligibility}\n\n**How to Apply:** ${scheme.application}\n\n🔗 Official Website: ${scheme.website}\n\nWant to know about the application process or eligibility criteria?`;
            }
            
            // General scheme information
            return `**${scheme.name}**\n\n📖 **About:** ${scheme.description}\n\n✅ **Eligibility:** ${scheme.eligibility}\n\n💰 **Benefits:** ${scheme.benefits}\n\n📄 **Documents:** ${scheme.documents}\n\n📝 **Application:** ${scheme.application}\n\n🔗 **Website:** ${scheme.website}\n\nNeed specific information about eligibility, documents, or application process?`;
        }
    }
    
    // Category-based responses
    if (message.includes('farmer') || message.includes('agriculture') || message.includes('farming')) {
        return "**Government Schemes for Farmers:**\n\n🌾 **PM-KISAN:** ₹6,000/year direct income support\n🚜 **PM Fasal Bima:** Crop insurance scheme\n💧 **PM Krishi Sinchai:** Irrigation support\n🏪 **PM-FME:** Food processing support\n\n**PM-KISAN Details:**\n- Eligibility: Small & marginal farmers (up to 2 hectares)\n- Benefits: ₹2,000 every 4 months\n- Apply at: pmkisan.gov.in\n\nWhich scheme interests you most?";
    }
    
    if (message.includes('health') || message.includes('medical') || message.includes('hospital') || message.includes('insurance')) {
        return "**Health-related Government Schemes:**\n\n🏥 **Ayushman Bharat:** ₹5 lakh health coverage per family\n👶 **Janani Suraksha:** Maternal health support\n💊 **Jan Aushadhi:** Affordable medicines\n🩺 **National Health Mission:** Primary healthcare\n\n**Ayushman Bharat Details:**\n- Coverage: Up to ₹5 lakh per family per year\n- Eligibility: SECC-2011 identified families\n- Benefits: Cashless treatment at empaneled hospitals\n- Apply at: Nearest empaneled hospital or CSC\n\nNeed help with eligibility check or application?";
    }
    
    if (message.includes('house') || message.includes('home') || message.includes('housing') || message.includes('loan')) {
        return "**Housing & Loan Schemes:**\n\n🏠 **PM Awas Yojana:** Housing for all\n🏦 **Mudra Loan:** Business loans up to ₹10 lakh\n👩 **Stand Up India:** Loans for women & SC/ST\n💳 **Credit Guarantee:** Collateral-free loans\n\n**PM Awas Yojana Details:**\n- Urban: Interest subsidy on home loans\n- Rural: Direct assistance for house construction\n- Eligibility: Families without pucca house\n- Apply at: pmaymis.gov.in or banks\n\nWant details about loan amounts or eligibility?";
    }
    
    if (message.includes('woman') || message.includes('women') || message.includes('girl') || message.includes('female')) {
        return "**Schemes for Women:**\n\n👩 **Beti Bachao Beti Padhao:** Girl child welfare\n🍳 **Ujjwala Yojana:** Free LPG connections\n💰 **Sukanya Samriddhi:** Girl child savings\n🏪 **Stand Up India:** Business loans for women\n👶 **Janani Suraksha:** Maternal health support\n\n**Ujjwala Yojana Highlights:**\n- Free LPG connection for BPL women\n- Deposit-free cylinder and regulator\n- Priority to SC/ST/PMAY beneficiaries\n- Apply at: Nearest LPG distributor\n\nWhich scheme would you like to explore?";
    }
    
    if (message.includes('student') || message.includes('education') || message.includes('scholarship') || message.includes('study')) {
        return "**Education & Scholarship Schemes:**\n\n🎓 **National Scholarship Portal:** Various scholarships\n📚 **Samagra Shiksha:** Quality education\n💻 **Digital India:** Digital literacy\n🏫 **Mid Day Meal:** Nutrition support\n👨‍🎓 **PM Yasasvi:** OBC/EBC/DNT scholarships\n\n**National Scholarship Portal:**\n- Pre-matric & post-matric scholarships\n- Merit-cum-means scholarships\n- Apply online at: scholarships.gov.in\n- Documents: Income certificate, caste certificate, marks sheets\n\nNeed help with specific scholarship eligibility?";
    }
    
    // General help responses
    if (message.includes('help') || message.includes('guide') || message.includes('assist')) {
        return "**I can help you with:**\n\n🏛️ **Popular Schemes:** PM-KISAN, Ayushman Bharat, Jan Dhan, Ujjwala, Awas Yojana\n\n📋 **Information about:**\n- Eligibility criteria\n- Required documents\n- Application process\n- Benefits & subsidies\n- Official websites\n\n💡 **Just ask me:**\n- \"Tell me about PM-KISAN eligibility\"\n- \"How to apply for Ayushman Bharat?\"\n- \"What documents needed for Ujjwala?\"\n- \"Schemes for farmers/women/students\"\n\nWhat would you like to know?";
    }
    
    if (message.includes('list') || message.includes('all schemes') || message.includes('available')) {
        return "**Popular Government Schemes:**\n\n👨‍🌾 **For Farmers:**\n- PM-KISAN Samman Nidhi\n- PM Fasal Bima Yojana\n\n🏥 **For Health:**\n- Ayushman Bharat\n- Janani Suraksha Yojana\n\n🏠 **For Housing:**\n- PM Awas Yojana\n- Credit Linked Subsidy\n\n👩 **For Women:**\n- Ujjwala Yojana\n- Beti Bachao Beti Padhao\n\n🎓 **For Education:**\n- National Scholarship Portal\n- Samagra Shiksha\n\n💰 **For Financial Inclusion:**\n- Jan Dhan Yojana\n- Mudra Loan\n\nClick on any scheme name or ask \"Tell me about [scheme name]\" for details!";
    }
    
    // Default response for unrecognized queries
    const defaultResponses = [
        "I'd be happy to help you with government schemes! Could you please specify:\n\n🔍 **What you're looking for:**\n- Scheme information (PM-KISAN, Ayushman Bharat, etc.)\n- Eligibility criteria\n- Application process\n- Required documents\n\n👥 **Or your category:**\n- Farmer, Student, Woman, Senior Citizen\n- Health, Housing, Education, Business\n\nExample: \"Tell me about PM-KISAN\" or \"Schemes for farmers\"",
        
        "I can provide detailed information about government schemes. Try asking:\n\n💡 **Specific schemes:** \"Ayushman Bharat eligibility\" or \"How to apply for Ujjwala?\"\n\n🏷️ **By category:** \"Schemes for women\" or \"Education scholarships\"\n\n📋 **General help:** \"List all schemes\" or \"Help with applications\"\n\nWhat specific information do you need?",
        
        "Let me help you find the right government scheme! You can ask about:\n\n🎯 **Popular schemes:** PM-KISAN, Ayushman Bharat, Jan Dhan, Ujjwala, Awas Yojana\n\n📊 **By purpose:** Health insurance, Housing loans, Education scholarships, Business funding\n\n📝 **Process help:** Eligibility check, Document requirements, Application steps\n\nWhat would you like to explore?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// AI Chatbot endpoint (placeholder for external AI API integration)
app.post('/api/chat', optionalAuth, async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }
        
        const systemPrompt = `You are a helpful Government Scheme Assistant for India. While you can answer general questions, your specialty is helping users understand government schemes, eligibility criteria, required documents, and application processes.

Key Guidelines:
- Be helpful, accurate, and concise in your responses
- For general questions: Provide brief, helpful answers but try to connect back to relevant government schemes when possible
- For scheme questions: Focus on Indian government schemes like PM-KISAN, Ayushman Bharat, Jan Dhan Yojana, etc.
- Provide specific information about eligibility, documents, and application processes
- If you don't know something specific, suggest they check the official website
- Keep responses under 200 words
- Use simple, clear language
- Always be polite and helpful

Example connections:
- Health questions → Mention Ayushman Bharat
- Education questions → Mention National Scholarship Portal
- Farming questions → Mention PM-KISAN
- Housing questions → Mention PM Awas Yojana
- Women's questions → Mention Ujjwala Yojana, Beti Bachao Beti Padhao

Available schemes include: Pradhan Mantri Jan Dhan Yojana, Beti Bachao Beti Padhao, PM Kisan Samman Nidhi, Ayushman Bharat, Pradhan Mantri Awas Yojana, National Scholarship Portal, Pradhan Mantri Ujjwala Yojana, Atal Pension Yojana, Stand Up India, Sukanya Samriddhi Yojana.`;
        
        // Try Google Gemini Integration first
        try {
            if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-actual-gemini-api-key-here') {
                const { GoogleGenerativeAI } = require('@google/generative-ai');
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                
                // Try models in order of preference: Gemini 2.0 Flash -> Gemini 1.5 Flash -> Gemini 1.5 Pro
                const modelsToTry = [
                    "gemini-2.0-flash",
                    "gemini-1.5-flash",
                    "gemini-1.5-pro"
                ];
                
                let aiResponse = null;
                let modelUsed = null;
                
                for (const modelName of modelsToTry) {
                    try {
                        const model = genAI.getGenerativeModel({ model: modelName });
                        const prompt = `${systemPrompt}\n\nUser Question: ${message}`;
                        const result = await model.generateContent(prompt);
                        const response = await result.response;
                        aiResponse = response.text();
                        modelUsed = modelName;
                        break;
                    } catch (modelError) {
                        console.log(`Model ${modelName} failed:`, modelError.message.split('\n')[0]);
                        
                        // If quota exceeded, log it but continue trying other models
                        if (modelError.message.includes('429') || modelError.message.includes('quota')) {
                            console.log(`⚠️ Quota exceeded for ${modelName}, trying next model...`);
                        }
                        continue;
                    }
                }
                
                if (aiResponse) {
                    console.log(`✅ Successfully used model: ${modelUsed}`);
                    return res.json({
                        success: true,
                        response: aiResponse,
                        model: modelUsed,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    console.log('❌ All Gemini models failed, falling back to intelligent responses');
                }
            }
        } catch (geminiError) {
            console.error('Gemini API error:', geminiError.message);
            console.error('Full error:', geminiError);
            // Fall through to mock responses
        }
        
        // Enhanced intelligent fallback responses
        const response = generateIntelligentResponse(message.toLowerCase());
        
        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, I encountered an error. Please try again later.'
        });
    }
});

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// 404 handler for other routes
app.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Please check your database configuration.');
            process.exit(1);
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Government Scheme Finder API server running on port ${PORT}`);
            console.log(`📱 Frontend URL: http://localhost:${PORT}`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
            console.log(`💊 Health Check: http://localhost:${PORT}/health`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

startServer();
