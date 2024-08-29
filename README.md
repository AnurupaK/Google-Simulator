
# 🌌 Aether Seek: The Next-Gen Google Simulator

Welcome to **Aether Seek**, a cutting-edge Google Simulator with advanced functionalities that transcend the capabilities of a typical search engine. Imagine Google, but more interactive, versatile, and powerful. From handling text and voice queries to analyzing PDFs, images, and URLs, Aether Seek is your all-in-one AI-powered assistant.

## 🚀 Features

### 🔍 Query Processing
- **Text Queries:** Powered by the **LLaMA3-8B-8192** model via the Groq API. Just type in your query, and Aether Seek will fetch you the most relevant information.
- **Voice Queries:** Speak your questions, and the **Whisper** model will transcribe and respond with incredible accuracy.

### 📄 PDF Analysis
- Upload a PDF document, and Aether Seek will analyze it using **Retrieval-Augmented Generation (RAG)** to extract and present the most pertinent information.

### 🖼️ Image Analysis
- Drop an image, and Aether Seek uses **Gemini 1.5 Flash** to analyze and interpret the visual content.

### 🌐 URL Analysis
- Provide a URL, and Aether Seek employs **Mixtral-8x7B-32768** to analyze the content and offer insightful summaries.

### 🛠️ AI Framework Integration
- Built on **LangChain**, Aether Seek seamlessly integrates multiple AI models to deliver comprehensive responses.

### 📂 Dynamic File Handling
- **Uploads:** PDF files are stored in the `uploads/` folder for processing and analysis.

### 🐋 Fully Dockerized
- The entire application, including all AI services and the backend, is containerized using Docker. This ensures consistency, scalability, and easy deployment.

### 🌍 Deployment with ngrok
- Deployed using ngrok, making the application accessible from anywhere.


## 🏗️ Project Setup with Docker

Aether Seek is containerized using Docker for efficient deployment. Here’s a breakdown of the Docker setup:

### 📄 Dockerfile Explained

```Dockerfile
FROM python:3.9-slim
```
- **Base Image**: Uses Python 3.9-slim for a lightweight environment.

```Dockerfile
# Set the working directory
WORKDIR /app
```
- **Working Directory**: Sets `/app` as the working directory in the container.

```Dockerfile
# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --verbose
```
- **Install Dependencies**: Copies `requirements.txt` and installs the Python packages listed.

```Dockerfile
# Copy application code
COPY Backend /app/Backend
COPY Frontend /app/Frontend
COPY AI_Service /app/AI_Service
```
- **Copy Code**: Transfers the code from your local machine to the container.

```Dockerfile
# Create upload directory
RUN mkdir -p /app/uploads
```
- **Uploads Directory**: Creates a directory for storing uploaded files.

```Dockerfile
# Copy environment variables
COPY .env /app/.env
```
- **Environment Variables**: Copies environment variables into the container.

```Dockerfile
# Expose port
EXPOSE 5000
```
- **Expose Port**: Makes port 5000 available for communication with the container.

```Dockerfile
# Set the working directory for the Flask app
WORKDIR /app/Backend

# Command to run the Flask app
CMD ["python", "app.py"]
```
- **Start Flask App**: Sets the working directory and specifies the command to run the Flask application.

### 📜 docker-compose.yml Explained

```yaml
version: '3.8'
```
- **Version**: Specifies the Docker Compose file format version.

```yaml
services:
  flask-app:
    build:
      context: .
      dockerfile: Dockerfile
    image: rag-app:latest
    container_name: rag-app-container
    ports:
      - "5000:5000"
    depends_on:
      - ollama-service
    environment:
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
    volumes:
      - .:/app
    networks:
      - app-network
```
- **Flask Service**: Defines the Flask application service, builds it from the `Dockerfile`, sets up environment variables, exposes port 5000, and depends on `ollama-service`.

```yaml
  ollama-service:
    image: ollama/ollama:latest
    container_name: ollama-service
    ports:
      - "11434:11434"
    volumes:
      - ollama:/root/.ollama
    networks:
      - app-network
```
- **Ollama Service**: Defines the Ollama service with its own port and volume for persistent data, and connects to the same network as the Flask service.

```yaml
networks:
  app-network:
    driver: bridge
```
- **Network**: Sets up a bridge network for communication between services.

```yaml
volumes:
  ollama:
    driver: local
```
- **Volumes**: Defines a local volume for storing Ollama data.


## 🔧 Installation and Setup

### 1. 🌐 Clone the Repository
```bash
git clone https://github.com/yourusername/aether-seek.git
cd aether-seek
```

### 2. 🐍 Set Up the Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux
```

### 3. 📦 Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. 🔑 Obtain API Keys
- **Groq API Key:** Get your API key from [Groq Console](https://console.groq.com/playground).
- **Google AI Studio Key:** Generate your API key from [Google AI Studio](https://ai.google.dev/aistudio?authuser=3).

### 5. 🐳 Dockerize the Application

1. **Pull Docker Images**
   ```bash
   docker pull ollama/ollama
   docker pull ngrok/ngrok
   ```

2. **Run the Application Locally**
   - Ensure your application is running locally:
   ```bash
   cd Backend
   python app.py
   ```

3. **Pull the LLaMA3 Model**
   ```bash
   docker start ollama-service
   docker exec -it ollama-service ollama run llama3
   ```

4. **Build Docker Containers**
   ```bash
   docker-compose up --build
   ```

### 6. 🌍 Deploy Using ngrok
- Visit the official website of [ngrok](https://ngrok.com/) and sign in.
- Obtain your authentication token.
- Deploy your application using the following command:
  ```bash
  docker run --net=host -it -e NGROK_AUTHTOKEN=<Your token> ngrok/ngrok:latest http 8080
  ```
  (Replace `8080` with the port where your Flask application is exposed.)

### 7. 🖥️ Access the Application
- Once deployed, ngrok will provide you with a public URL. Share this URL, and anyone can access your application globally.

## 🗂️ Project Structure

```
Aether-Seek/
├── AI_Service/
│   └── All AI codes
├── Backend/
│   └── app.py
├── Frontend/
│   ├── static/
│   │   ├── Images/
│   │   ├── style.css
│   │   └── script.js
│   └── templates/
│       └── index.html
├── uploads/
├── .env
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## 🛠️ Future Updates

- **🖼️ Image Generation:** Aether Seek will soon be able to generate images based on your queries, just like Google Images.
- **🔧 Enhanced UI:** Plans to make the UI more robust and responsive, ensuring smooth interaction with all types of responses.

## 🤝 Contributions

Contributions are welcome! Feel free to fork this repository, create a new branch, and submit a pull request. Let's build something amazing together!

## 📝 License

This project is licensed under the MIT License.

## 🎥Demo 
Absolutely! Here are five demo use cases for Aether Seek:

---

## 📽️ Aether Seek Demo Use Cases




1. **🔍 Aether Seek with Text Queries**



https://github.com/user-attachments/assets/deed3a47-ad87-4231-af07-fa810334c7ab



2. **🎙️ Aether Seek with Voice Queries**



https://github.com/user-attachments/assets/8ca49854-f2d7-43e4-808d-3d4d7900bcd5


  
3. **📄 Aether Seek with PDF Analysis**



![Screenshot (67)](https://github.com/user-attachments/assets/80ad615f-55d0-406f-824b-c1a89198d688)

https://github.com/user-attachments/assets/fa9733a2-59a4-4bb4-9d42-24535aa15074


   

4. **🖼️ Aether Seek with Image Analysis**

  

https://github.com/user-attachments/assets/2bfba0d1-92ad-4cb9-8c35-a1f398cd7527

5. **🌐 Aether Seek with URL Analysis**



https://github.com/user-attachments/assets/bea50774-0e34-432c-9af5-469b2b7d2941



   
