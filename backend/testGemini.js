require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function testModel(modelName) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello!");
    const response = await result.response;
    return `SUCCESS ${modelName}: ` + response.text();
  } catch (e) {
    return `ERROR ${modelName}: ${e.message}`;
  }
}

async function run() {
  const modelsToTest = ['gemini-flash-latest', 'gemini-pro-latest', 'gemini-3.7-flash', 'gemini-omni-1.1-flash'];
  let results = [];
  for(let m of modelsToTest) {
     results.push(await testModel(m));
  }
  fs.writeFileSync('error.json', JSON.stringify(results, null, 2));
}

run();
