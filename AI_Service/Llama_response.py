from dotenv import load_dotenv
import os

from groq import Groq
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyPDFDirectoryLoader, WebBaseLoader
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores.chroma import Chroma
from langchain_community.vectorstores.faiss import FAISS
from langchain.chains import create_retrieval_chain
from langchain_core.messages import HumanMessage,AIMessage
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains.history_aware_retriever import create_history_aware_retriever

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("API key for Groq is not set in the environment variables.")

##Whisper
client = Groq(api_key=groq_api_key)
def get_whisper(audio_file_path):
    """Transcribe audio using Whisper."""
    with open(audio_file_path, "rb") as audio_file:
        response = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=audio_file,
            language="en"
        )
    if response.text:
        return response.text
    else:
        return "Error processing the audio"


llm = ChatGroq(
    groq_api_key=groq_api_key,
    model ="llama3-8b-8192",
    temperature=0.4
    )

prompt = ChatPromptTemplate.from_messages({
    ("system","You are just like google and give detailed overview of any topic asked"),
    ("human","{input} {context}"),
  
})

chain = create_stuff_documents_chain(llm,prompt)

def get_llm_response(input_text):
    response = chain.invoke({
        "input":input_text,
        "context": ""
    })
    
    return response


def get_pdfDocument(pdf):
    loader = PyPDFDirectoryLoader(pdf)
    docs = loader.load()
    
    splitter = RecursiveCharacterTextSplitter(chunk_size = 1000, chunk_overlap = 200)
    splitDocs = splitter.split_documents(docs)
    return splitDocs

def create_db(docs):
    # embedding = OllamaEmbeddings(model="llama3.1", base_url="http://localhost:11434")   ##use this if you are ot using docker
    embedding = OllamaEmbeddings(model="llama3", base_url="http://ollama-service:11434")

    
    vectorStore = FAISS.from_documents(docs,embedding)
    return vectorStore

def create_chain(vectorstore):
    llm = ChatGroq(
    groq_api_key=groq_api_key,
    model ="llama3-8b-8192",
    temperature=0.4
     )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system","""
        You are just like google who explains eveything in a very detailed way

        <context>
        {context}
        </context>
        Question: {input}
        """),
        ("human","{input}")
    ])
    
    chain = create_stuff_documents_chain(llm,prompt)
    
    retriever = vectorstore.as_retriever(search_kwargs = {"k":2})
    retriever_prompt = ChatPromptTemplate.from_messages([
        ("human","{input}"),
        ("human","Given the above conversation, generate a search query to look up in order to get information relevant to the conversation")
    ])
    
    history_aware_retriever = create_history_aware_retriever(
        llm=llm,
        retriever=retriever,
        prompt=retriever_prompt
    )
    
    retrieval_chain = create_retrieval_chain(history_aware_retriever,chain)
    
    return retrieval_chain




def get_llm_response_pdf(userInput,chain):
        
    response = chain.invoke({
        "input": userInput,
    })
    
    bot_response = response["answer"]
    
    print(response["answer"])
    return bot_response





