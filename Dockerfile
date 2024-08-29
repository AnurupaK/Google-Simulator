FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --verbose

# Copy application code
COPY Backend /app/Backend
COPY Frontend /app/Frontend
COPY AI_Service /app/AI_Service

# Create upload directory
RUN mkdir -p /app/uploads

# Copy environment variables
COPY .env /app/.env

# Expose port
EXPOSE 5000

# Set the working directory for the Flask app
WORKDIR /app/Backend

# Command to run the Flask app
CMD ["python", "app.py"]
