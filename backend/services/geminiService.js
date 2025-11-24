const OpenAI = require('openai');

// Lazy initialize OpenAI to ensure env variables are loaded
let openai = null;
const getOpenAI = () => {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in environment variables');
        }
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    return openai;
};

/**
 * Enhance professional summary using OpenAI
 * @param {string} text - Original summary text
 * @returns {Promise<string>} - Enhanced summary
 */
const enhanceSummary = async (text) => {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error('Text cannot be empty');
        }

        console.log('🤖 Using OpenAI GPT-4o-mini for summary enhancement');

        const completion = await getOpenAI().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a professional resume writer. Enhance resume content to be more impactful, concise, and professional. Return ONLY the enhanced text without any additional commentary."
                },
                {
                    role: "user",
                    content: `Enhance this professional summary for a resume. Make it more impactful, concise, and professional. Use strong action verbs and quantifiable achievements where possible. Keep it under 100 words:\n\n${text}`
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        const enhancedText = completion.choices[0].message.content.trim();
        return enhancedText;
    } catch (error) {
        console.error('Error enhancing summary:');
        console.error('Error message:', error.message);
        console.error('API Key exists:', !!process.env.OPENAI_API_KEY);
        throw error;
    }
};

/**
 * Enhance description (experience, project, or internship)
 * @param {string} text - Original description
 * @param {string} type - Type of description (experience/project/internship)
 * @returns {Promise<string>} - Enhanced description
 */
const enhanceDescription = async (text, type = 'experience') => {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error('Text cannot be empty');
        }

        console.log(`🤖 Using OpenAI GPT-4o-mini for ${type} enhancement`);

        let systemPrompt = "You are a professional resume writer. Enhance resume content to be more impactful, concise, and professional. Return ONLY the enhanced text without any additional commentary.";
        let userPrompt;

        switch (type) {
            case 'experience':
                userPrompt = `Enhance this job experience description for a resume. Make it more achievement-focused with strong action verbs. Highlight measurable results and impact. Keep it concise and professional:\n\n${text}`;
                break;
            case 'project':
                userPrompt = `Enhance this project description for a resume. Highlight technical skills, technologies used, and the project's impact. Make it concise and impressive:\n\n${text}`;
                break;
            case 'internship':
                userPrompt = `Enhance this internship description for a resume. Focus on learning outcomes, contributions, and skills developed. Make it professional and concise:\n\n${text}`;
                break;
            default:
                userPrompt = `Enhance this description for a resume. Make it more professional, concise, and impactful:\n\n${text}`;
        }

        const completion = await getOpenAI().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 250
        });

        const enhancedText = completion.choices[0].message.content.trim();
        return enhancedText;
    } catch (error) {
        console.error('Error enhancing description:');
        console.error('Error message:', error.message);
        throw error;
    }
};

module.exports = {
    enhanceSummary,
    enhanceDescription,
};
