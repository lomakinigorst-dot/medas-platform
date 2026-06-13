from fastapi import APIRouter

from app.api.v1.endpoints import auth, clinics, doctors

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(clinics.router)
api_router.include_router(doctors.router)
