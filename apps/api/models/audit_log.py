import uuid
from datetime import datetime
from sqlalchemy import String, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String(100))
    application_id: Mapped[uuid.UUID | None]
    model_version: Mapped[str | None] = mapped_column(String(50))
    timestamp: Mapped[datetime] = mapped_column(default=datetime.utcnow, index=True)
    ip_address: Mapped[str | None] = mapped_column(String(45))
    metadata: Mapped[dict] = mapped_column(JSON, default={})
