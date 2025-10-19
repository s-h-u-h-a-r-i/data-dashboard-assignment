# Data Dashboard Assignment

A full-stack financial dashboard application built with FastAPI (Python) and Next.js (React/TypeScript) that simulates data ingestion from multiple agents, provides AI-powered querying, and presents real-time financial metrics.

## 🏗️ Architecture Overview

- **Backend**: FastAPI with SQLAlchemy, OpenAI integration, in-memory logging
- **Frontend**: Next.js 15 with React 19, Material UI, React Query
- **Database**: SQLite (in-memory for development)
- **AI**: OpenAI GPT integration for natural language queries

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.12+** (required for backend)
- **Node.js 18+** (required for frontend)
- **npm** or **yarn** (package manager)
- **OpenAI API Key** (for AI assistant functionality)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd data-dashboard-assignment
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend

# Install dependencies (using uv for fast dependency management)
uv sync

# Or using pip if you prefer:
# pip install -r requirements.txt
```

#### Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# OpenAI Configuration (Required for AI Assistant)
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration (Optional - defaults to SQLite)
DATABASE_URL=sqlite:///./data/db/app.db

# Server Configuration (Optional)
HOST=0.0.0.0
PORT=8000
```

#### Start the Backend Server

```bash
# Using uv
uv run python -m app.main

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

**Note**: The database will be automatically seeded with mock data (25-30 payments and invoices) on first startup.

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 Development

### Backend Development

The backend uses FastAPI with automatic API documentation available at:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

#### Key Backend Features

- **Agent Simulation**: `/api/payments` and `/api/invoices` endpoints with pagination and filtering
- **Summary Aggregation**: `/api/summary` for financial metrics
- **AI Assistant**: `/api/ai-assistant` for natural language queries
- **Observability**: `/api/agent-logs` for activity monitoring

#### Database Schema

The application uses SQLAlchemy models for:

- **Payments**: Transaction records with status, amount, customer info
- **Invoices**: Invoice records with due dates, status, customer info

### Frontend Development

The frontend is built with Next.js 15 and includes:

- **Dashboard**: Financial metrics overview with charts
- **Data Tables**: Paginated tables for payments and invoices
- **AI Assistant**: Chat interface for natural language queries
- **Observability**: Real-time activity logs

#### Key Technologies

- **React Query**: Server state management and caching
- **Material UI**: Component library and theming
- **TypeScript**: Type safety and development experience
- **MUI X Charts**: Data visualization

## 📊 API Endpoints

### Payments Agent

- `GET /api/payments` - List payments with pagination and filtering
  - Query params: `page`, `page_size`, `status`, `start_date`, `end_date`

### Invoices Agent

- `GET /api/invoices` - List invoices with pagination and filtering
  - Query params: `page`, `page_size`, `status`, `start_date`, `end_date`

### Summary Aggregator

- `GET /api/summary` - Financial metrics and monthly breakdowns

### AI Assistant

- `POST /api/ai-assistant` - Natural language queries about financial data
  - Body: `{"query": "Show me unpaid invoices from last month"}`

### Observability

- `GET /api/agent-logs` - Recent activity logs
- `GET /api/agent-logs/stats` - Log statistics

## 🧪 Testing the Application

### 1. Verify Backend

```bash
# Test the summary endpoint
curl http://localhost:8000/api/summary

# Test payments with filtering
curl "http://localhost:8000/api/payments?page=1&page_size=5&status=paid"
```

### 2. Verify Frontend

1. Open `http://localhost:3000`
2. Navigate to the dashboard
3. Test the AI assistant with queries like:
   - "What are my total payments this month?"
   - "Show me overdue invoices"
   - "How many pending payments do I have?"

### 3. Test AI Assistant

The AI assistant uses real OpenAI API integration. Example queries:

- "What's my total revenue?"
- "Show me recent payments"
- "How many invoices are overdue?"

## 🔍 Troubleshooting

### Common Issues

1. **OpenAI API Errors**

   - Ensure your `OPENAI_API_KEY` is set correctly
   - Check that you have sufficient API credits
   - Verify the API key has the correct permissions

2. **Database Issues**

   - The SQLite database is created automatically
   - If you encounter issues, delete `backend/data/db/app.db` and restart

3. **CORS Issues**

   - The backend is configured to allow all origins for development
   - Ensure the frontend is running on `localhost:3000`

4. **Port Conflicts**
   - Backend default: `8000`
   - Frontend default: `3000`
   - Change ports in the respective configuration files if needed

### Logs and Debugging

- **Backend logs**: Check the console output for SQLAlchemy queries and API requests
- **Frontend logs**: Use browser developer tools and React Query DevTools
- **AI interactions**: All AI queries are logged in the observability panel

## 📁 Project Structure

```
data-dashboard-assignment/
├── backend/
│   ├── app/
│   │   ├── core/           # Database, config, logging
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints
│   │   ├── schemas/        # Pydantic models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── data/              # SQLite database storage
│   └── pyproject.toml      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── lib/           # API client, hooks
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json       # Node.js dependencies
├── README.md
└── SOLUTION.md
```

## 🚀 Production Considerations

This is a development/demo application. For production deployment, consider:

- **Database**: Migrate to PostgreSQL or MySQL
- **Authentication**: Add user authentication and authorization
- **Security**: Implement proper CORS, rate limiting, input validation
- **Monitoring**: Add proper logging and monitoring solutions
- **Deployment**: Use Docker containers and orchestration

## 📝 License

This project is part of a technical assignment and is for demonstration purposes only.
