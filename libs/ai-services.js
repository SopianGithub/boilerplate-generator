const OpenAI = require('openai');
const fs = require('fs-extra');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateComponent = async (prompt) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert React developer. Generate modern, clean code following best practices.
          Include PropTypes, proper JSX structure, and functional components with hooks where appropriate.`
      },
      { role: "user", content: prompt }
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
};

module.exports = { generateComponent };