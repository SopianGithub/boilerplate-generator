const fs = require('fs-extra');
const path = require('path');


const generateProject = async (projectName, stack) => {
  const projectPath = path.join(process.cwd(), projectName);
  
  // Create base structure
  await fs.ensureDir(path.join(projectPath, 'src/client/components'));
  await fs.ensureDir(path.join(projectPath, 'src/server/models'));
  await fs.ensureDir(path.join(projectPath, 'src/server/routes'));
  await fs.ensureDir(path.join(projectPath, 'src/server/controllers'));
  await fs.ensureDir(path.join(projectPath, 'src/server/middleware'));
  await fs.ensureDir(path.join(projectPath, 'src/server/config'));

  // Create base files
  const serverPackageJson = {
    name: projectName,
    version: "1.0.0",
    description: `${projectName} - A ${stack.toUpperCase()} Stack Application`,
    main: "src/server/server.js",
    scripts: {
      start: "node src/server/server.js",
      dev: "nodemon src/server/server.js",
      client: "cd src/client && npm start",
      "dev:full": "concurrently \"npm run dev\" \"npm run client\"",
      "build": "cd src/client && npm run build",
      "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix src/client && npm run build --prefix src/client"
    },
    dependencies: {
      "express": "^4.18.2",
      "mongoose": "^7.0.0",
      "dotenv": "^16.0.3",
      "cors": "^2.8.5",
      "helmet": "^6.0.1",
      "morgan": "^1.10.0",
      "express-validator": "^7.0.1"
    },
    devDependencies: {
      "nodemon": "^2.0.22",
      "concurrently": "^8.0.1"
    }
  };

  // Template untuk client package.json
  const clientPackageJson = {
    name: "client",
    version: "0.1.0",
    private: true,
    dependencies: {
      "@testing-library/jest-dom": "^5.17.0",
      "@testing-library/react": "^13.4.0",
      "@testing-library/user-event": "^13.5.0",
      "axios": "^1.6.2",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.20.0",
      "react-scripts": "5.0.1",
      "web-vitals": "^2.1.4"
    },
    scripts: {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    eslintConfig: {
      "extends": [
        "react-app",
        "react-app/jest"
      ]
    },
    browserslist: {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    },
    proxy: "http://localhost:5432"
  };

  // Server.js template
  const serverTemplate = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/${projectName}')
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '${projectName} API is running' });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT_SERVER || 5432;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📚 API Documentation: http://localhost:\${PORT}/api/docs\`);
});`;

  // .env template
  const envTemplate = `NODE_ENV=development
PORT_SERVER=5432
PORT_CLIENT=3210
MONGODB_URI=mongodb://localhost/${projectName}
JWT_SECRET=your_jwt_secret_here
`;

  // .gitignore template
  const gitignoreTemplate = `node_modules
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
`;

  // Create client .env
  const clientEnv = `REACT_APP_API_URL=http://localhost:5432/api
REACT_APP_NAME=${projectName}
PORT=3210`;

  // Create basic React app structure
  const appJsx = `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>${projectName}</h1>
          <p>Edit <code>src/App.js</code> and save to reload.</p>
        </header>
      </div>
    </Router>
  );
}

export default App;`;

  const indexJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();`;

  // API utility template
  const apiUtil = `import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5432/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default API;`;

  // Write files
  await fs.writeJson(path.join(projectPath, 'package.json'), serverPackageJson, { spaces: 2 });
  await fs.writeJson(path.join(projectPath, 'src/client/package.json'), clientPackageJson, { spaces: 2 });
  // Install additional client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('npm install', { 
    cwd: path.join(projectPath, 'src/client'), 
    stdio: 'inherit' 
  });

  await fs.writeFile(path.join(projectPath, 'src/server/server.js'), serverTemplate);
  await fs.writeFile(path.join(projectPath, '.env'), envTemplate);
  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreTemplate);
  await fs.writeFile(path.join(projectPath, 'src/client/.env'), clientEnv);
  await fs.writeFile(path.join(projectPath, 'src/client/App.js'), appJsx);
  await fs.writeFile(path.join(projectPath, 'src/client/index.js'), indexJsx);
  
  // Create API utility directory and file
  await fs.ensureDir(path.join(projectPath, 'src/client/utils'));
  await fs.writeFile(path.join(projectPath, 'src/client/utils/api.js'), apiUtil);

  // Create production build script
  const buildScript = `#!/bin/bash
echo "🏗️  Building React application..."
cd src/client && npm run build

echo "📦 Moving build files to server..."
mv build ../server/public

echo "✅ Build complete! Run 'npm start' to start the server."`;

  await fs.writeFile(path.join(projectPath, 'build.sh'), buildScript);
  await fs.chmod(path.join(projectPath, 'build.sh'), '755');

  console.log(`\n✅ Project ${projectName} created successfully!`);
  console.log('\nNext steps:');
  console.log(`1. cd ${projectName}`);
  console.log('2. npm install');
  console.log('3. cd src/client && npm install && cd ../..');
  console.log('4. Update .env with your configuration');
  console.log('\nDevelopment:');
  console.log('5. npm run dev:full');
  console.log('\nProduction:');
  console.log('6. ./build.sh');
  console.log('7. npm start\n');
};

module.exports = { generateProject };