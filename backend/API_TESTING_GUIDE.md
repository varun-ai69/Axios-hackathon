# RAG System API Testing Guide

## Prerequisites

1. **Start Services:**
   ```bash
   # Start MongoDB
   mongod

   # Start Qdrant
   docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

   # Start Backend
   cd backend
   npm start
   ```

2. **Environment Variables:**
   - `MONGO_URL`: MongoDB connection string
   - `JWT_SECRET`: JWT secret key
   - `GOOGLE_AI_API_KEY`: For Gemini LLM

---

## 🔐 Authentication Endpoints

### 1. Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "EMPLOYEE",
  "department": "IT"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 📄 Document Ingestion Endpoints

### 3. Upload Document (Admin Only)
```http
POST /api/upload/ingestion
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

Form Data:
- file: [PDF/DOCX/XLSX/TXT file]
- documentType: "POLICY"
- department: "HR"
- version: "v1.0"
- allowedRoles: ["ADMIN", "EMPLOYEE"]
- expiresAt: "2025-12-31T23:59:59.999Z"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Document indexed and stored successfully",
  "documentId": "doc_1703920800000_abc123def",
  "fileId": "file_1703920800000_xyz789uvw",
  "originalFilename": "company_policy.pdf",
  "storedPath": "uploads/1703920800000-123456789.pdf",
  "totalChunks": 15,
  "fileSize": 2048576
}
```

---

## 📁 File Management Endpoints

### 8. Get All Stored Files (Admin Only)
```http
GET /api/files/
Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012345",
    "fileId": "file_1703920800000_xyz789uvw",
    "originalFilename": "company_policy.pdf",
    "storedFilename": "1703920800000-123456789.pdf",
    "filePath": "uploads/1703920800000-123456789.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "documentId": "doc_1703920800000_abc123def",
    "uploadedBy": "64a1b2c3d4e5f6789012346",
    "uploadedByRole": "ADMIN",
    "status": "ACTIVE",
    "ingestionStatus": "COMPLETED",
    "chunksGenerated": 15,
    "embeddingGenerated": true,
    "createdAt": "2024-12-30T10:15:00.000Z",
    "processedAt": "2024-12-30T10:16:00.000Z"
  }
]
```

### 9. Get File by ID
```http
GET /api/files/:fileId
Authorization: Bearer <user_token>
```

### 10. Download File
```http
GET /api/files/:fileId/download
Authorization: Bearer <user_token>
```
**Response:** File download with original filename

### 11. Delete File (Admin Only)
```http
DELETE /api/files/:fileId
Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 12. Get File Statistics (Admin Only)
```http
GET /api/files/stats/overview
Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
{
  "totalFiles": 25,
  "completedFiles": 23,
  "failedFiles": 2,
  "fileTypeStats": [
    { "_id": "application/pdf", "count": 15 },
    { "_id": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "count": 8 },
    { "_id": "text/plain", "count": 2 }
  ],
  "totalSize": 52428800
}
```

---

## 📂 File Monitoring Endpoints

### 13. Scan Uploads Directory (Admin Only)
```http
POST /api/monitor/scan
Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Uploads directory scanned successfully"
}
```

### 14. Get Monitoring Status (Admin Only)
```http
GET /api/monitor/status
Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
{
  "message": "File monitoring service is active",
  "lastScan": "2024-12-30T10:30:00.000Z"
}
```
```json
{
  "success": true,
  "message": "Document indexed successfully",
  "documentId": "doc_1703920800000_abc123def",
  "totalChunks": 15
}
```

**Test Steps:**
1. Create admin user first
2. Login as admin to get token
3. Upload a sample PDF document
4. Check MongoDB for document metadata
5. Check Qdrant for vector embeddings

---

## 🔍 Search & Retrieval Endpoints

### 4. Query Documents
```http
POST /api/search/retrieval
Content-Type: application/json
Authorization: Bearer <user_token>

{
  "question": "What is the company policy on remote work?"
}
```

**Expected Response:**
```json
{
  "queryId": "uuid-1234-5678-9012",
  "question": "What is the company policy on remote work?",
  "answer": "Based on the company policy, remote work is allowed...",
  "confidenceScore": 0.87,
  "sources": [
    {
      "chunk_id": "doc_123_chunk_0",
      "source": "remote_work_policy.pdf"
    }
  ],
  "analytics": {
    "retrievedChunks": 5,
    "filteredChunks": 3,
    "responseTimeMs": 234
  }
}
```

**Test Scenarios:**
1. **Valid Query:** User asks about allowed content
2. **Role Restricted:** Employee asks about admin-only content
3. **No Data:** Query about non-existent information

---

## 📊 Analytics Endpoints

### 5. Get User Analytics
```http
GET /api/analytics/user/:userId
Authorization: Bearer <user_token>
```

**Expected Response:**
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "userId": "64a1b2c3d4e5f6789012345",
  "role": "EMPLOYEE",
  "department": "IT",
  "queriesCount": 25,
  "lastLogin": "2024-12-30T10:15:00.000Z",
  "createdAt": "2024-12-30T09:30:00.000Z",
  "updatedAt": "2024-12-30T10:15:00.000Z"
}
```

### 6. Get System Analytics (Admin Only)
```http
GET /api/analytics/system
Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
{
  "totalQueries": 156,
  "totalDocuments": 12,
  "totalRejections": 8,
  "avgResponseTime": 245.5
}
```

### 7. Get Recent Queries
```http
GET /api/analytics/queries/recent?limit=10
Authorization: Bearer <user_token>
```

**Expected Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012346",
    "queryText": "What are the password requirements?",
    "userRole": "EMPLOYEE",
    "retrievedChunksCount": 3,
    "filteredChunksCount": 2,
    "confidenceScore": 0.91,
    "responseTimeMs": 156,
    "timestamp": "2024-12-30T12:30:00.000Z"
  }
]
```

---

## 🧪 Complete Testing Workflow

### Step 1: Setup Users
```bash
# Create Admin User
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN",
    "department": "IT"
  }'

# Create Employee User
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee User",
    "email": "employee@example.com",
    "password": "emp123",
    "role": "EMPLOYEE",
    "department": "HR"
  }'
```

### Step 2: Login and Get Tokens
```bash
# Admin Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Employee Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "emp123"
  }'
```

### Step 3: Upload Documents (Admin)
```bash
curl -X POST http://localhost:3000/api/upload/ingestion \
  -H "Authorization: Bearer <admin_token>" \
  -F "file=@sample_policy.pdf" \
  -F "documentType=POLICY" \
  -F "department=HR" \
  -F "version=v1.0" \
  -F "allowedRoles=[\"ADMIN\", \"EMPLOYEE\"]"
```

### Step 4: Test File Management
```bash
# List all files (admin only)
curl -X GET http://localhost:3000/api/files/ \
  -H "Authorization: Bearer <admin_token>"

# Download a file
curl -X GET http://localhost:3000/api/files/<file_id>/download \
  -H "Authorization: Bearer <user_token>" \
  -o downloaded_file.pdf

# Get file statistics
curl -X GET http://localhost:3000/api/files/stats/overview \
  -H "Authorization: Bearer <admin_token>"

# Manually scan uploads directory (admin only)
curl -X POST http://localhost:3000/api/monitor/scan \
  -H "Authorization: Bearer <admin_token>"

# Get monitoring status
curl -X GET http://localhost:3000/api/monitor/status \
  -H "Authorization: Bearer <admin_token>"
```

### Step 5: Test Queries
```bash
# Employee Query (Should work)
curl -X POST http://localhost:3000/api/search/retrieval \
  -H "Authorization: Bearer <employee_token>" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the leave policy?"}'

# Employee Query (Should be rejected if document is admin-only)
curl -X POST http://localhost:3000/api/search/retrieval \
  -H "Authorization: Bearer <employee_token>" \
  -H "Content-Type: application/json" \
  -d '{"question": "Show me financial reports"}'
```

### Step 6: Test Automatic File Monitoring
```bash
# 1. Place files directly in uploads/ directory
#    - Copy some PDF/DOCX/TXT files to backend/uploads/
#    - Files will be automatically processed on server startup

# 2. Restart server to trigger automatic scan
#    npm start

# 3. Check server logs for processing status
#    You should see: "Processing new file: filename.pdf"

# 4. Manually trigger scan if needed
curl -X POST http://localhost:3000/api/monitor/scan \
  -H "Authorization: Bearer <admin_token>"

# 5. Verify files in database
curl -X GET http://localhost:3000/api/files/ \
  -H "Authorization: Bearer <admin_token>"
```

### How Automatic Monitoring Works:
1. **Server Startup**: Scans `uploads/` directory automatically
2. **File Detection**: Finds files not in database
3. **Smart Classification**: Determines document type and department from filename
4. **Full Processing**: Extracts text → chunks → embeddings → stores in database
5. **Default Permissions**: Auto-scanned files get ADMIN + EMPLOYEE access
6. **Duplicate Prevention**: Skips files already processed
### Step 7: Check Analytics
```bash
# User Analytics
curl -X GET http://localhost:3000/api/analytics/user/<user_id> \
  -H "Authorization: Bearer <user_token>"

# System Analytics
curl -X GET http://localhost:3000/api/analytics/system \
  -H "Authorization: Bearer <admin_token>"
```

---

## 🔍 Database Verification

### Check MongoDB Collections
```javascript
// Connect to MongoDB and verify data
use rag_system

// Check document metadata
db.documentmetadata.find().pretty()

// Check chunk permissions
db.chunkpermissions.find().pretty()

// Check user analytics
db.useranalytics.find().pretty()

// Check query logs
db.querylogs.find().pretty()

// Check rejection logs
db.rejectionlogs.find().pretty()

// Check stored files
db.storedfiles.find().pretty()
```

### Check Qdrant Collections
```bash
# List collections
curl http://localhost:6333/collections

# Search vectors
curl -X POST http://localhost:6333/collections/documents/points/search \
  -H "Content-Type: application/json" \
  -d '{
    "vector": [0.1, 0.2, 0.3, ...],
    "limit": 5,
    "with_payload": true
  }'
```

---

## 🚨 Error Testing

### Test Error Cases:
1. **Invalid Token:** Use expired/invalid JWT
2. **Role Access:** Employee accessing admin endpoints
3. **Missing Fields:** Upload without required fields
4. **Large Files:** Upload files exceeding limits
5. **Unsupported Formats:** Upload unsupported file types
6. **Empty Queries:** Send empty search queries

### Expected Error Responses:
```json
{
  "error": "Invalid token"
}
```

```json
{
  "error": "Admin access required"
}
```

```json
{
  "error": "No relevant documents found for your role",
  "reason": "ROLE_RESTRICTED"
}
```

---

## 📈 Performance Testing

### Load Testing with curl:
```bash
# Simulate multiple concurrent queries
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/search/retrieval \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"question": "What are company policies?"}' &
done
wait
```

### Monitor Performance:
1. Check response times in query logs
2. Monitor MongoDB query performance
3. Check Qdrant search latency
4. Monitor memory usage during embedding generation

---

## ✅ Success Criteria

- [ ] Users can register and login
- [ ] Admin can upload documents successfully
- [ ] Files are stored locally in uploads/ directory
- [ ] **Automatic file monitoring works on server startup**
- [ ] Documents are chunked and embedded properly
- [ ] File metadata is stored in database
- [ ] Role-based access control works
- [ ] Queries return relevant results
- [ ] Analytics are tracked correctly
- [ ] Rejections are logged
- [ ] Files can be downloaded with original names
- [ ] Admin can view file statistics
- [ ] File deletion works properly
- [ ] **Manual directory scanning works**
- [ ] Performance is acceptable (<2s per query)
- [ ] All error cases handled properly
