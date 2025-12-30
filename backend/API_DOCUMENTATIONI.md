# API Documentation

---

This system exposes a set of REST APIs designed to support document ingestion, retrieval, authentication, and analytics for the RAG-based application.

---

## 1. Core RAG APIs (Primary APIs)

These are the **main APIs** responsible for document ingestion and intelligent querying.

### 1.1 Upload Document (Ingestion)

**Endpoint:**

`POST /api/upload/ingestion`

**Description:**

Uploads documents (PDF, DOCX, etc.) and processes them through the ingestion pipeline.

The system extracts text, creates embeddings, and stores them in the vector database.

---

### 1.2 Ask Question (Retrieval)

**Endpoint:**

`POST /api/search/retrieval`

**Request Body:**

```json
{
  "question": "What is the leave policy?"
}

```

**Description:**

Processes the user query by generating embeddings, retrieving relevant document chunks, and generating an answer using the LLM.

---

## 2. Authentication APIs

### 2.1 User Login

`POST /api/auth/login`

Authenticates a user and returns a JWT token.

---

### 2.2 User Registration

`POST /api/auth/register`

Registers a new user in the system.

---

## 3. File Management APIs

### 3.1 Get All Files

`GET /api/files`

Returns a list of all uploaded documents (Admin only).

### 3.2 Get File Details

`GET /api/files/:id`

Returns metadata of a specific file.

### 3.3 Delete File

`DELETE /api/files/:id`

Deletes a file and its associated data.

### 3.4 File Statistics

`GET /api/files/stats/overview`

Returns file-level statistics such as total files and processing status.

---

## 4. Search & Chat APIs

### 4.1 Conversational Query

`POST /api/chatbot/query`

Allows users to interact with the system using natural language.

### 4.2 Chatbot Health

`GET /api/chatbot/status`

Checks the availability and health of the chat service.

---

## 5. User Management APIs

### 5.1 Get All Users

`GET /api/users`

Returns all registered users (Admin only).

### 5.2 Test Endpoint

`GET /api/users/test`

Used for system testing and validation.

### 5.3 User Analytics

`GET /api/analytics/user/:id`

Returns usage analytics for a specific user.

---

## 6. Analytics APIs

### 6.1 System Analytics

`GET /api/analytics/system`

Provides system-level metrics and usage statistics.

### 6.2 Query Analytics

`GET /api/analytics/queries/recent`

Returns recent search and query activity.

---

## 7. Monitoring APIs

### 7.1 Trigger Manual Scan

`POST /api/monitor/scan`

Manually triggers background scanning or re-indexing.

### 7.2 Monitor Status

`GET /api/monitor/status`

Returns the health and status of background services.

---

## 8. Employee Registration

### 8.1 Employee Registration

`POST /api/auth/employee-register`

Registers a new employee account under the organization.

---

This structure keeps the API clean, modular, and easy to understand while clearly separating **core RAG functionality**, **authentication**, **analytics**, and **system management**.
