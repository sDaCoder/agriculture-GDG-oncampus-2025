from pydantic import BaseModel
from datetime import datetime
from typing import Literal

class ChatMessageModel(BaseModel):
    # sessionID: str
    sender: Literal["user", "bot"]
    message: str
    timestamp: str