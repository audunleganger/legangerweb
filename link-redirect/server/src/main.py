from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

URL_INDEX = 0

URLS = [
    "https://nrk.no",
    "https://reddit.com",
    "https://gamefaqs.com"
]

def increment_index() -> int:
    global URL_INDEX
    URL_INDEX = (URL_INDEX + 1) % len(URLS)
    return URL_INDEX

def get_current_index() -> int:
    return URL_INDEX

def get_current_url() -> str:
    return URLS[URL_INDEX]



@app.get("/api/health")
def health():
    return {"status": "ok"}

class ValidateLinkRequest(BaseModel):
    index: str
    link: str

@app.post("/api/validate")
def validate_link(request: ValidateLinkRequest):
    request_index = request.index
    request_link = request.link
    is_valid_pair = URLS[int(request_index)] == request_link
    if is_valid_pair:
        return request
    else:
        index = get_current_index()
        url = get_current_url()
        increment_index()
        return {"index": index, "link": url}


# @app.get("/api/acquire-link")
# def acquire_link():
#     current_index = get_current_index()
#     current_url = get_current_url()
#     increment_index()
#     return {
#         "index": current_index,
#         "url": current_url
#     }