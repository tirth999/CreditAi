from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut
from services.auth_service import AuthService
from core.deps import get_db, get_current_user

router = APIRouter()


@router.post("/register", response_model=UserOut)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.register(data)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.login(data)


@router.post("/refresh")
async def refresh(data: dict, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.refresh(data.get("refresh_token"))


@router.post("/logout")
async def logout(current_user=Depends(get_current_user)):
    return {"message": "Logged out"}


@router.get("/me", response_model=UserOut)
async def me(current_user=Depends(get_current_user)):
    return current_user
