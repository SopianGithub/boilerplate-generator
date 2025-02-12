const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Fungsi untuk mengekstrak kode dari respons OpenAI
const extractCodeFromResponse = (response) => {
  const codeBlockRegex = /```(?:js|javascript)?\n([\s\S]*?)```/;
  const match = response.match(codeBlockRegex);
  return match ? match[1].trim() : response.trim();
};

const generateAPI = async (resource, operations = ['create', 'read', 'update', 'delete']) => {
  const resourceLower = resource.toLowerCase();

  // Generate Route dengan OpenAI
  const routePrompt = `Create Express.js routes for ${resource} resource with these operations: ${operations.join(', ')}.
  Include proper route handlers and middleware.
  Return only the code without explanation, wrapped in code block markers.
  Example format:
  \`\`\`javascript
  router.post('/', controller.create);
  router.get('/', controller.getAll);
  \`\`\``;

  // Generate Controller dengan OpenAI
  const controllerPrompt = `Create Express.js controller for ${resource} resource with these operations: ${operations.join(', ')}.
  Include:
  - Proper error handling
  - Status codes
  - Async/await
  - MongoDB/Mongoose operations
  - Input validation
  - Success/error responses
  Return only the code without explanation, wrapped in code block markers.`;

  try {
    // Generate route code
    const routeResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: routePrompt
      }],
    });
    
    // Generate controller code
    const controllerResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: controllerPrompt
      }],
    });

    const routes = extractCodeFromResponse(routeResponse.choices[0].message.content);
    const controllers = extractCodeFromResponse(controllerResponse.choices[0].message.content);

    // Tambahkan import model di awal controller
    const controllerWithModel = `const ${resource}Model = require('../models/${resourceLower}.model');\n\n${controllers}`;

    return {
      routes,
      controllers: controllerWithModel
    };
  } catch (error) {
    console.error('Error generating API code:', error);
    throw error;
  }
};

module.exports = { generateAPI };