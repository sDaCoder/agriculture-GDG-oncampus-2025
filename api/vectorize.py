import os
from dotenv import load_dotenv
from ingest import extract_text_from_url
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pymongo import MongoClient
from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MONGO_URI = os.environ.get("MONGO_URI")

urls = [
    "https://www.fao.org/home/en",
    "https://www.india.gov.in/topics/agriculture/crops",
    "https://krishijagran.com/"
]


all_text = "\n".join(extract_text_from_url(url) for url in urls)
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)
docs = splitter.create_documents([all_text])

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=GEMINI_API_KEY
)

client = MongoClient(MONGO_URI)
collection = client["rag-db"]["vectors"]

vectorStore = MongoDBAtlasVectorSearch(collection, embeddings)
if collection.count_documents({}) == 0:
    vectorStore.add_documents(docs)
    print("✅ Embeddings stored in MongoDB Atlas!")
else:
    print("✅ Embeddings already exist in MongoDB Atlas!")