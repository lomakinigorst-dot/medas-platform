from fastapi import APIRouter

from app.api.v1.endpoints import clinics, doctors

api_router = APIRouter()
api_router.include_router(clinics.router)
api_router.include_router(doctors.router)
