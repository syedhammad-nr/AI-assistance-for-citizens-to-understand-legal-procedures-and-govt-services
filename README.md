# AI Assistant for Legal Procedures and Government Services

Production-ready full-stack web application for Indian citizens to understand legal procedures, government services, public grievance systems, and documentation workflows in simple step-by-step language.

## Project Structure

```text
AI-assistance-for-citizens-to-understand-legal-procedures-and-govt-services/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- constants/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   |-- .env.example
|   |-- index.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- i18n/
|   |   |-- lib/
|   |   `-- pages/
|   |-- .env.example
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   `-- package.json
`-- README.md
```

## Features

- JWT-based signup, login, logout, and protected routes
- Secure password hashing with `bcryptjs`
- MySQL user profile storage with Indian citizen-oriented fields
- Profile-aware Groq + LLaMA legal/government assistant
- Relevance guard to refuse unrelated queries
- Conversation history saved in MySQL
- Multilingual UI and responses in English, Hindi, and Kannada
- Tailwind-based responsive SaaS-style interface
- Input validation, sanitization, `helmet`, CORS, and chat rate limiting

## Backend API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Profile

- `GET /api/profile`
- `PUT /api/profile`

### Chat

- `GET /api/chat`
- `POST /api/chat`

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Copy:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

### 3. Start the backend

```bash
cd backend
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:5000`

## Environment Variables

### Backend

- `PORT`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `FRONTEND_URL`

### Frontend

- `VITE_API_URL`

## Recommended Groq Model

Default configured fallback:

- `llama-3.1-8b-instant`

You can switch the model in `backend/.env` using `GROQ_MODEL`.

## Security Notes

- Passwords are hashed before storage
- JWT auth is required for profile and chat endpoints
- Chat endpoint is rate limited
- User inputs are sanitized server-side
- API keys stay on the backend only

## Production Notes

- Add reverse proxy and HTTPS in deployment
- Use a managed MySQL instance or a production MySQL server
- Set strong secrets for JWT and API keys
- Update CORS `FRONTEND_URL` for your deployed frontend domain
- Consider adding unit/integration tests and centralized logging before launch
