const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Fungsi untuk mengekstrak kode dari respons OpenAI
const extractCodeFromResponse = (response) => {
  const codeBlockRegex = /```javascript\n([\s\S]*?)```/;
  const match = response.match(codeBlockRegex);
  return match ? match[1].trim() : response.trim();
};

const setupDatabase = async (modelName, dbType = 'mongo') => {
  const isMongoDb = dbType.toLowerCase() === 'mongo' || dbType.toLowerCase() === 'mongodb';
  
  const prompt = `Create a ${isMongoDb ? 'Mongoose' : 'Sequelize'} schema for ${modelName} model.
  Must return code in this exact format:
  \`\`\`javascript
  const mongoose = require('mongoose');
  
  const ${modelName}Schema = new mongoose.Schema({
    // schema fields here
  }, {
    timestamps: true
  });
  
  // schema methods and middleware here
  
  module.exports = mongoose.model('${modelName}', ${modelName}Schema);
  \`\`\`

  Include:
  - Common fields based on model name
  - Appropriate data types
  - Required fields
  - Field validations
  - Default values
  - Indexes if needed
  - Timestamps
  - Schema methods if relevant
  - Pre/post middleware if needed
  - Comments for complex fields
  - No explanations, only code

  For example, if it's a User model, include fields like:
  - email (required, unique, validated)
  - password (required, hashed)
  - name
  - role
  - status
  etc.`;

  try {
    // Menggunakan chat.completions.create sebagai pengganti createChatCompletion
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 1500
    });

    const schemaCode = extractCodeFromResponse(response.choices[0].message.content);

    // Tambahkan imports yang diperlukan berdasarkan konten
    const additionalImports = [];
    if (schemaCode.includes('bcrypt')) {
      additionalImports.push("const bcrypt = require('bcryptjs');");
    }
    if (schemaCode.includes('validator')) {
      additionalImports.push("const validator = require('validator');");
    }

    const finalCode = [
      ...additionalImports,
      '',
      schemaCode
    ].join('\n');

    return finalCode;

  } catch (error) {
    console.error('Error generating schema:', error);
    throw error;
  }
};

module.exports = { setupDatabase };