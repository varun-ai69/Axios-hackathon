# RAG System - Complete Setup Guide

## 🚀 Quick Start

### 1. Start All Services
```bash
# Start MongoDB, Qdrant, Backend, and Frontend
cd C:\Users\ahadd\Documents\GitHub\Axios-hackathon\backend
start.bat
```

### 2. Manual Qdrant Setup (Alternative)
```bash
# Start Qdrant Vector Database
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

### 3. Test Credentials
- **Admin**: `admin@example.com` / `admin123`
- **Employee**: `employee@example.com` / `emp123`

## 📊 Database Population
```bash
# Add rich test data to your dashboard
cd C:\Users\ahadd\Documents\GitHub\Axios-hackathon\backend
node populateTestData.js
```

## 🎯 Features
- ✅ **Real-time Dashboard** with live database data
- ✅ **File Management** with upload/delete functionality
- ✅ **Smart Chatbot** for employee queries
- ✅ **User Analytics** and query tracking
- ✅ **Document Search** with role-based access
- ✅ **Manual Refresh** - No auto-reload as requested

## 🔧 Tech Stack
- **Frontend**: React + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + MongoDB
- **Vector DB**: Qdrant for semantic search
- **Authentication**: JWT with role-based access

## 📁 Project Structure
```
Axios-hackathon/
├── frontend/          # React application
├── backend/           # Node.js API server
├── start.bat         # Automated startup script
└── README.md         # This file
```