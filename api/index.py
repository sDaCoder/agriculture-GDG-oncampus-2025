from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from chat import get_bot_response


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
    response = get_bot_response(query.message)
    return JSONResponse(
        status_code = 200, 
        content = {"message": response}
    )


if __name__ == "__main__":
    uvicorn.run("index:app", host="localhost", port=8001, reload=True)