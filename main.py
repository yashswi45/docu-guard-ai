from fastapi import FastAPI
from pydantic import BaseModel
from agents import auditor, writer, Crew, Task
from agents import auditor, writer  # These are your custom agents
from crewai import Crew, Task, Process # These come from the library
from fastapi.middleware.cors import CORSMiddleware
import os
from motor.motor_asyncio import AsyncIOMotorClient
import datetime
from fastapi.middleware.cors import CORSMiddleware

# Setup MongoDB client (Add your URI to .env)
client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client.docu_guard_db

app = FastAPI()
# Add CORS Middleware so React can talk to FastAPI
# ... your app = FastAPI() line ...

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # The Wildcard Nuke! Allows any frontend to connect.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class CodeRequest(BaseModel):
    code: str


@app.post("/audit")
async def run_audit(request: CodeRequest):
    # 1. Define Tasks with expected_output (Required in v1.x)
    task1 = Task(
        description=f"Audit this code for bugs and security flaws: {request.code}",
        expected_output="A detailed list of security vulnerabilities and suggestions for fixing them.",
        agent=auditor
    )

    task2 = Task(
        description="Summarize the code functionality and provide usage instructions.",
        expected_output="A professional Markdown documentation report including a summary and usage examples.",
        agent=writer
    )

    # 2. Execute Crew
    crew = Crew(
        agents=[auditor, writer],
        tasks=[task1, task2],
        process=Process.sequential,
        verbose=True  # This lets you see the logs in your terminal
    )

    result = crew.kickoff()
    report_text = str(result)

    # NEW: Save to MongoDB
    audit_entry = {
        "code_snippet": request.code,
        "report": report_text,
        "timestamp": datetime.datetime.utcnow()
    }
    await db.audits.insert_one(audit_entry)

    return {"report": report_text}
