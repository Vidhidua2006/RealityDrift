🚀 REALITY-DRIFT INTELLIGENCE PLATFORM

Reality Doesn’t Pause. Neither Should AI.
Continuous drift intelligence for reality-aligned AI systems.

🌍 Overview

Reality-Drift Intelligence Platform is a real-time AI trust and drift monitoring system built using the Pathway streaming framework.

Modern AI systems fail when the real world changes but their knowledge does not.

This platform:

Continuously ingests live or simulated data streams

Detects material changes (drift) in real time

Uses AI to explain the change

Classifies severity

Tracks historical drift patterns

Provides a live chatbot assistant for drift insights

It is designed as a production-style SaaS application with streaming architecture.

🧠 Problem Statement

AI systems become unreliable when:

Data distributions shift

Events change real-world conditions

Policies are updated

Market conditions fluctuate

System states evolve

Most AI applications are static.

This platform ensures:

AI decisions always reflect current reality.

⚙️ Architecture
Frontend (React Dashboard)
        ↓
Node.js API (Auth + REST)
        ↓
Pathway Streaming Engine (Python)
        ↓
Real-Time Drift Detection Pipeline
        ↓
Groq LLM (via Pathway xPack)
        ↓
Live Drift Table + Hybrid Index
        ↓
Auto-Updating Dashboard + Chatbot
🏗 Tech Stack
Frontend

React (Vite)

Tailwind CSS

React Router

Axios

Backend API

Node.js

Express.js

JWT Authentication

Role-Based Access

Streaming Layer

Pathway Framework (Python)

Real-time connectors

Streaming transformations

Stateful window computation

Live hybrid indexing

AI Layer

Groq API (llama-3.3-70b-versatile)

Structured JSON output

Pathway LLM xPack

🔄 How It Works
1️⃣ Real-Time Event Stream

The system ingests live or simulated streaming data such as:

{
  "entity": "Road A",
  "status": "CLOSED",
  "trafficLevel": "HIGH",
  "timestamp": "2026-02-24T10:15:00"
}

Pathway automatically:

Detects new records

Maintains state tables

Computes differences incrementally

2️⃣ Drift Detection Engine

When a new event arrives:

Previous state is fetched

Current state is compared

Material change is detected

Structured input is sent to Groq

Groq returns STRICT JSON:

{
  "driftDetected": true,
  "changeSummary": "Road status changed from OPEN to CLOSED",
  "severity": "HIGH",
  "confidence": 92,
  "explanation": "The road closure significantly impacts traffic flow.",
  "recommendedAction": "Notify navigation systems and reroute traffic."
}
3️⃣ Live Dashboard Updates

No manual refresh required.

When new stream data arrives:

Drift table updates automatically

Dashboard metrics update

Severity indicators update

Chatbot index updates

4️⃣ AI Chat Assistant

Users can ask:

“Why did Road A change?”

“Show high severity events today.”

“Which entity drifted most?”

The assistant performs RAG over live drift history using Pathway’s hybrid index.

📊 Features
🔐 Authentication

JWT-based login/register

Password hashing (bcrypt)

Protected routes

Role-based access

📡 Real-Time Streaming

Continuous ingestion

Incremental transformations

Stateful window processing

🧠 Drift Intelligence

AI-powered change explanation

Severity classification

Confidence scoring

📜 Drift History

Complete audit trail

Timestamped records

Historical trend visibility

📈 Dashboard Analytics

Total entities

Drift count

High-severity alerts

Average confidence score

🎨 Visual Indicators

LOW → Green

MEDIUM → Yellow

HIGH → Red

Confidence progress bars

📂 Project Structure
/api-server
  ├── index.js
  ├── routes/
  ├── controllers/
  ├── middleware/

/pathway-streaming-service
  ├── main.py
  ├── drift_pipeline.py
  ├── llm_integration.py
  ├── connectors/

/client
  ├── src/
  ├── components/
  ├── pages/
  ├── context/
🛠 Installation Guide
1️⃣ Clone Repository
git clone https://github.com/your-username/reality-drift-platform.git
cd reality-drift-platform
2️⃣ Setup Backend API
cd api-server
npm install

Create .env:

PORT=5000
JWT_SECRET=your_secret

Run:

npm run dev
3️⃣ Setup Pathway Streaming Service
cd pathway-streaming-service
pip install pathway groq requests python-dotenv

Create .env:

GROQ_API_KEY=your_groq_key

Run:

python main.py
4️⃣ Setup Frontend
cd client
npm install
npm run dev
🚀 Deployment (Free Tier)
Backend API

Deploy on:

Render (Free)

Pathway Service

Deploy on:

Render (Python service)

Frontend

Deploy on:

Vercel (Free)

🧪 Pathway Compliance

This project:

✔ Uses Pathway as real-time ingestion engine
✔ Uses streaming transformations
✔ Uses stateful drift comparison
✔ Uses live hybrid index
✔ Updates automatically on new data
✔ Follows event-driven architecture

If no new data arrives → no update
If new data arrives → automatic update

Fully compliant with hackathon rules.

🎯 Use Cases

AI Model Monitoring

Smart Logistics

Financial Risk Monitoring

Policy Change Detection

Infrastructure Monitoring

Real-Time System Drift Analysis