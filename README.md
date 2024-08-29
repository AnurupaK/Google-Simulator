
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
- **Groq API Key:** Get your API key from [Groq Console](https://console.groq.com/keys).
- **Google AI Studio Key:** Generate your API key from [Google AI Studio](https://console.groq.com/keys).

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

