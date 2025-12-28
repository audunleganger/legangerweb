FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "src.main:app", "--reload", "--reload-dir", "/app", "--host", "0.0.0.0", "--port", "8000"]