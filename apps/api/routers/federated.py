from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.post("/train")
async def federated_train():
    return {"job_id": "fed-001", "status": "queued"}


@router.get("/status/{job_id}")
async def federated_status(job_id: str):
    return {"status": "completed", "round": 10, "loss": 0.23, "auc": 0.81}
