# MERN/PERN Stack Codegen CLI

AI-Powered Code Generator untuk MERN/PERN Stack Development.

## 🚀 Installation

1. Clone repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:

```bash
npm install
```

3. Set up OpenAI API Key:

```bash
export OPENAI_API_KEY='your-api-key-here'
```

4. Make CLI executable:

```bash
chmod +x codegen
```

5. Create symlink (optional, untuk akses global):

```bash
sudo npm link
```


## 📚 Commands

### Generate New Project

```bash
codegen generate <project-name> --stack <mern|pern>
```
Example:

```bash
codegen generate my-awesome-app --stack mern
```

### Generate React Component
```bash
codegen component <ComponentName> --type <function|class>
```
Example:

```bash
codegen component UserProfile --type function

codegen component AdminDashboard --type class
```

### Generate Database Schema
```bash
codegen schema <ModelName> --db <mongo|postgres>
```
Example:

```bash
codegen schema User --db mongo
```

### Generate API Endpoints
```bash
codegen api <ResourceName> --operations <crud-operations>
```
Example:

```bash
codegen api User --operations create,read,update,delete

codegen api Product --operations create,read
```

## 📁 Generated Project Structure
├── src/
│ ├── client/
│ │ └── components/
│ └── server/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md

## 🛠️ Generated Files Examples

### Component Generation

src/components/UserProfile/
├── UserProfile.jsx
├── UserProfile.css
└── index.js


### API Generation
src/server/
├── routes/
│ └── user.routes.js
└── controllers/
└── user.controller.js


### Schema Generation
src/server/models/
└── user.model.js


## 🔑 Environment Variables

Create `.env` file in your project root:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost/your-db-name
OPENAI_API_KEY=your-openai-api-key
```


## 🚀 Development Workflow

1. Generate new project:
```bash
codegen generate my-project --stack mern
```

2. Navigate to project:
```bash
cd my-project
```

3. Generate components:
```bash
codegen component UserProfile --type function
```

4. Generate schema:
```bash
codegen schema User --db mongo
```

5. Generate API:
```bash
codegen api User --operations create,read,update,delete
```


## 📝 Notes

- Component names must start with uppercase letter
- Schema names are typically singular (User, Product)
- API resource names are used to generate RESTful endpoints
- Generated code includes:
  - Modern React practices
  - PropTypes validation
  - Error handling
  - Database operations
  - API documentation
  - Basic styling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- OpenAI for AI-powered code generation
- Express.js
- React
- MongoDB/PostgreSQL