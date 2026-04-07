# Use a lightweight Python image
FROM python:3.11-slim

# Install system dependencies required by some AI libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements first to cache the installations
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code (respecting the .dockerignore)
COPY . .

# Render exposes the port dynamically, but we set a default
ENV PORT=8000
EXPOSE 8000

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
