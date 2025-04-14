from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from chat import get_bot_response
from models.chatMessage import ChatMessageModel
from dbConfig import chat_collection
import datetime
from typing import List

### Create FastAPI instance with custom docs and openapi url
app = FastAPI()

class Query(BaseModel):
    message: str

@app.get("/api/py/chat")
def hello_fast_api():
    return JSONResponse(
        status_code = 200,
        content = {
            "message": "Hello from FastAPI, you can start chatting from this page!"
        }
    )

@app.post("/api/py/chat")
def chat_fast_api(query: Query):
    try:   
        response = get_bot_response(query.message)
        return JSONResponse(
            status_code = 200, 
            content = {"message": response}
        )
    except Exception as e:
        return JSONResponse(
            status_code = 500, 
            content = {"message": str(e)}
        )
    
@app.post("/api/py/chat/save")
def save_chat(message: ChatMessageModel):
    message_dict = message.dict()
    message_dict["timestamp"] = datetime.datetime.now().isoformat()
    result = chat_collection.insert_one(message_dict)

    if not result.acknowledged:
        raise HTTPException(status_code=500, detail="Failed to save chat")
    
    return JSONResponse(
        status_code = 200,
        content={
            "message": "Chat saved",
            "id": str(result.inserted_id)
        }
    )

@app.get("/api/py/chat/all")
def get_all_messages():
    messages = list(chat_collection.find({}, {"_id": 0}))
    return messages


if __name__ == "__main__":
    uvicorn.run("index:app", host="localhost", port=8001, reload=True)