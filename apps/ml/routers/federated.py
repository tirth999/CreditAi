from fastapi import APIRouter
from ..federated.flower_server import run_federated_simulation

router = APIRouter()


@router.post("/federated/train")
async def federated_train(num_rounds: int = 10, use_dp: bool = False):
    result = run_federated_simulation(num_rounds=num_rounds, use_dp=use_dp)
    return result
