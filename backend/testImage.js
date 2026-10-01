require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testImage() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.7-flash" }); // testing a specific stable version

    // Dummy 1x1 image base64
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

    const result = await model.generateContent([
      "Extract text from this image",
      { inlineData: { data: base64Data, mimeType: "image/png" } }
    ]);
    const response = await result.response;
    console.log("SUCCESS with 3.7-flash:", response.text());
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}

testImage();
