const { GoogleGenerativeAI } = require('@google/generative-ai');
const { handle200 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');

const processChat = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ status: false, message: 'Message is required' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    // Minimal prompt engineering for the Coach persona
    const promptText = `
      You are "MahaPrep AI Coach", a highly supportive and expert study coach for students preparing for Maharashtra PSC (MPSC) and Talathi exams.
      The user is asking: "${message}"

      Rules:
      1. Keep your answers concise, encouraging, and highly structured (use bullet points if needed).
      2. If asked in Marathi, reply in fluent Marathi. If English, reply in English.
      3. Your goal is to guide them on their syllabus. Do not hallucinate facts.
    `;

    const result = await model.generateContent(promptText);
    const response = await result.response;

    handle200(res, { reply: response.text() }, 'AI reply generated');
  } catch (error) {
    console.error('Chat Error:', error);
    
    // Auto-fallback mock response for 503/429 limits
    if (error.status === 503 || error.status === 429 || error.message?.includes('503') || error.message?.includes('429')) {
      const mockReply = "सध्या थोडे नेटवर्क लोड असल्यामुळे मी पूर्ण उत्तर देऊ शकत नाहीये झटपट, पण तुम्ही History आणि Polity ची रिव्हिजन चालू ठेवा! तुम्हाला नक्की फायदा होईल. 🚀";
      return handle200(res, { reply: mockReply }, 'Fallback AI Reply (Due to API Load)');
    }

    handle500(res, error);
  }
};

module.exports = { processChat };
