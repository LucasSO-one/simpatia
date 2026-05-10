from fastapi import FastAPI
from routers import router

app = FastAPI(
    title="API de Foco",
    description="Backend estruturado com separação de responsabilidades."
)

# Conectamos as rotas definidas no arquivo routers.py
app.include_router(router)