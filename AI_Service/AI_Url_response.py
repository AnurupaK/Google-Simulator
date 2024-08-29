from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS, Chroma

load_dotenv()
# ollama_host = os.getenv("OLLAMA_HOST", "http://0.0.0.0:11434")
groq_api_key = os.getenv("GROQ_API_KEY")
llm_url = ChatGroq(groq_api_key=groq_api_key, model_name="mixtral-8x7b-32768")

prompt_url = ChatPromptTemplate.from_template(
"""
Please provide detailed overview of the context
<context>
{context}
<context>
Questions:{input}
"""
)

def process_url(url, prompt):
    # Load embeddings and documents once
    # embeddings = OllamaEmbeddings(model="llama3.1", base_url="http://localhost:11434")
    embedding = OllamaEmbeddings(model="llama3", base_url="http://ollama-service:11434")
    
    loader = WebBaseLoader(url)
    docs = loader.load()

    # Split documents once
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    final_documents = text_splitter.split_documents(docs[:21])

    # Create vectors once
    vectors = FAISS.from_documents(final_documents, embedding)

    # Define function to get LLM response
    document_chain = create_stuff_documents_chain(llm_url, prompt_url)
    print(1)
    retriever = vectors.as_retriever()
    print(2)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    print(3)
    response = retrieval_chain.invoke({"input": prompt})
    print("From url ai::::::::::::::::::::::",response)
    return response["answer"]

