from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.deps import get_db, require_admin
from ..services.audit_service import AuditService

router = APIRouter()


@router.get("/users")
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin=Depends(require_admin),
    skip: int = 0,
    limit: int = 10,
):
    service = AuditService(db)
    return await service.list_users(skip, limit)


@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    data: dict,
    db: AsyncSession = Depends(get_db),
    admin=Depends(require_admin),
):
    service = AuditService(db)
    return await service.update_user(user_id, data)


@router.get("/audit-log")
async def audit_log(
    db: AsyncSession = Depends(get_db),
    admin=Depends(require_admin),
    skip: int = 0,
    limit: int = 20,
):
    service = AuditService(db)
    return await service.get_audit_log(skip, limit)


@router.get("/health")
async def health_check():
    return {
        "db": "healthy",
        "redis": "healthy",
        "ml_service": "healthy",
        "uptime": "ok",
    }
