from fastapi import FastAPI
import uvicorn

### Create FastAPI instance with custom docs and openapi url
app = FastAPI()

@app.get("/api/py/hello")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

if __name__ == "__main__":
    uvicorn.run("index:app", host="localhost", port=8000, reload=True)