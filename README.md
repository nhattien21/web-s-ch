# E-Commerce Platform - Fullstack Implementation

A modern e-commerce platform built with **Node.js + Express**, **React + Vite**, **MongoDB**, and **Docker**.

## 🎯 Features (MVP)

- ✅ **User Authentication**: Register/Login with JWT + Refresh Tokens
- ✅ **Product Catalog**: Browse, search, filter by category
- ✅ **Shopping Cart**: Add/remove items, persistent across sessions
- ✅ **VNPay Integration**: Secure payment processing
- ✅ **Order Management**: Track orders and payment status
- 🔄 **Admin Dashboard**: Coming in Phase 8

## 🏗️ Architecture

### Tech Stack

**Backend**:
- Node.js 18+ with Express.js
- TypeScript for type safety
- MongoDB + Mongoose ODM
- JWT authentication
- Clean Architecture pattern

**Frontend**:
- React 18 with Vite
- TypeScript
- React Router for navigation
- Context API for state management
- Responsive design

**Infrastructure**:
- Docker & Docker Compose
- Multi-stage builds for optimization
- Nginx for frontend serving

## 📁 Project Structure

```
web-s-ch/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── domain/          # Core entities & business logic
│   │   ├── application/     # Use cases & services
│   │   ├── infrastructure/  # Database & external APIs
│   │   ├── presentation/    # Express routes & middleware
│   │   ├── common/          # Shared utilities & errors
│   │   └── main.ts          # Entry point
│   ├── tests/               # Unit & integration tests
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # API clients
│   │   ├── context/         # Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/              # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml       # Local dev orchestration
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- OR Node.js 18+, npm, and MongoDB

### Option 1: Docker Compose (Recommended)

```bash
# Clone and setup
git clone <repo-url>
cd web-s-ch

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000/api
# - MongoDB: localhost:27017
```

### Option 2: Local Development

```bash
# Backend Setup
cd backend
cp .env.example .env
npm install
npm run dev          # Starts on http://localhost:3000

# In another terminal - Frontend Setup
cd frontend
npm install
npm run dev          # Starts on http://localhost:5173
```

> **Note**: For local development without Docker, ensure MongoDB is running on `localhost:27017`

## 📚 API Endpoints (Phase 2+)

### Health Check
- `GET /api/health` - Server health status

### Authentication (Phase 2)
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - Login user
- `POST /api/users/refresh` - Refresh JWT token

### Products (Phase 3)
- `GET /api/products` - List all products (pagination, filters)
- `GET /api/products/:id` - Get product details
- `GET /api/products/category/:categoryId` - Filter by category

### Orders (Phase 5)
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/vnpay-callback` - VNPay webhook

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=3000
MONGODB_URI=mongodb://root:root@mongo:27017/ecommerce?authSource=admin
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
VNPAY_MERCHANT_ID=your_merchant_id
VNPAY_SECRET_KEY=your_secret_key
VNPAY_API_URL=https://sandbox.vnpayment.vn
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=E-Commerce Store
```

## 📋 Implementation Phases

| Phase | Description | Status | Hours |
|-------|-------------|--------|-------|
| 1 | Foundation & Setup | ✅ In Progress | 2-3h |
| 2 | User Authentication | ⏳ Next | 3-4h |
| 3 | Product Catalog | ⏳ Coming | 2-3h |
| 4 | Shopping Cart | ⏳ Coming | 2.5-3h |
| 5 | Orders & VNPay | ⏳ Coming | 4-5h |
| 6 | Error Handling & Polish | ⏳ Coming | 2-3h |
| 7 | Testing & Finalization | ⏳ Coming | 2-3h |

**Total Estimated**: 18-24 hours (12-15h with parallelization)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test         # Run tests
```

## 🔨 Development Commands

### Backend

```bash
cd backend

npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### Frontend

```bash
cd frontend

npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix issues
npm run format       # Format code
```

## 📦 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean everything
docker-compose down -v        # Remove volumes too
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB container is healthy: `docker-compose ps`
- Check connection string in `.env`
- MongoDB takes a few seconds to boot; backend auto-retries

### Port Already in Use
- Change ports in `docker-compose.yml`
- Or stop conflicting services: `lsof -i :3000` then `kill -9 <PID>`

### Frontend displays 404 on routes
- Ensure backend is running: `curl http://localhost:3000/api/health`
- Check `VITE_API_URL` in `.env`

### Slow Docker Build
- Use `docker system prune` to clean up unused images/layers
- Ensure `.dockerignore` files are present

## 📖 Additional Resources

- [Express.js Docs](https://expressjs.com)
- [React/Vite Docs](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [MongoDB Mongoose](https://mongoosejs.com)
- [JWT Authentication](https://jwt.io)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

## 🤝 Contributing

This is a learning project. Contributions and improvements welcomed!

1. Fork or create a branch
2. Make changes
3. Test locally
4. Submit PR with description

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Next Steps**: 
- Install dependencies: `npm install` in both `backend/` and `frontend/` folders
- Configure `.env` files
- Run `docker-compose up --build` to start the project