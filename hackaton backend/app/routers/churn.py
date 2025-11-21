from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.customer import Customer
from app.schemas.customer import ChurnAlert

router = APIRouter(
    prefix="/churn-alerts",
    tags=["Churn"]
)

@router.get("/", response_model=List[ChurnAlert])
async def get_churn_alerts(db: Session = Depends(get_db)):
    high_risk = db.query(Customer).filter(Customer.riesgo_churn > 0.7).all()
    
    alerts = []
    for c in high_risk:
        alerts.append({
            "cliente_id": c.id_cliente_csv,
            "nombre": f"Cliente {c.id_cliente_csv} ({c.industria})",
            "riesgo_churn": c.riesgo_churn,
            "impacto_estimado": c.valor_historico * 0.1,
            "recomendacion": c.recomendacion
        })
    return alerts
