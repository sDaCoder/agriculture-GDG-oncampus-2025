from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
import os
from dotenv import load_dotenv
from vectorize import vectorStore

load_dotenv()

load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0.3
)

prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""
        Think yourself as a virtual farmer and an agricultural expert who predict the favourable crops that can be grown in a particular region and a particular period. If anyone asks your name, tell your name as 'Kissan AI', Now answer the following question using only the context provided.

        Context:
        {context}

        Question:
        {question}

        Answer in a detailed and informative manner:
    """,
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorStore.as_retriever(),
    chain_type="stuff",
    chain_type_kwargs={"prompt": prompt_template},
    return_source_documents=True
)

def get_bot_response(query: str) -> str:
    response = qa_chain.invoke(query)
    return response["result"]