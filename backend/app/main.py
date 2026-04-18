import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.health import router as health_router
from app.routes.process import router as process_router
from app.routes.ws import router as ws_router


def create_app() -> FastAPI:
    app = FastAPI(title="Aivon Backend", version="0.1.0")

    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(process_router)
    app.include_router(ws_router)

    return app


app = create_app()
