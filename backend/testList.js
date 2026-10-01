require('dotenv').config();
const fs = require('fs');

async function checkModels() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    const geminiModels = data.models.map(m => m.name).filter(n => n.includes('gemini'));
    fs.writeFileSync('models.json', JSON.stringify(geminiModels, null, 2));
  } catch (e) {
    fs.writeFileSync('models.json', JSON.stringify({ error: e.message }));
  }
}

checkModels();
