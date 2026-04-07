import os
from crewai import Agent, LLM, Task, Crew
from dotenv import load_dotenv

load_dotenv()

# Native 2026 CrewAI LLM Setup
# groq_llm

# Define the LLM using the native CrewAI class
# For Groq, use the model name and point to Groq's API endpoint
groq_llm = LLM(
    model="groq/llama-3.3-70b-versatile", # Specify the Groq model
    base_url="https://api.groq.com/openai/v1", # Essential for Groq compatibility
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7,
    stream=True # Enable streaming as per your preference
)


# 1. Define Agents using the 'groq_llm'
auditor = Agent(
    role='Senior Security Auditor',
    goal='Identify security vulnerabilities and "bad smells" in the provided code.',
    backstory='You are an expert at OWASP top 10 and secure coding practices.',
    llm=groq_llm, # Pass the native LLM object here
    allow_delegation=False,
    verbose=True
)

writer = Agent(
    role='Technical Documentation Specialist',
    goal='Create clear, concise Markdown documentation for the code.',
    backstory='You specialize in making complex code understandable.',
    llm=groq_llm, # Reuse the same LLM or define a different one
    allow_delegation=False,
    verbose=True
)
