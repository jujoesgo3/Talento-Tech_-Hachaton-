from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import datetime

from app.core.database import get_db
from app.models.lead import Lead
from app.schemas.lead import LeadResponse, LeadCreate
from app.services.ml_service import ml_service

router = APIRouter(
    prefix="/leads",
    tags=["Leads"]
)

@router.get("/", response_model=List[LeadResponse])
async def get_leads(db: Session = Depends(get_db)):
    leads = db.query(Lead).all()
    response = []
    for l in leads:
        response.append({
            "id": l.id,
            "nombre": l.empresa_lead or "Desconocido",
            "fuente": l.fuente_meta,
            "presupuesto": 0.0,
            "urgencia": "Alta" if l.urgencia_compra > 7 else "Baja",
            "score_calidad": l.score_calidad,
            "clasificacion": l.clasificacion_predicha,
            "industria": l.industria,
            "ciudad": l.ciudad
        })
    return response

@router.post("/", response_model=LeadResponse)
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    score, clasif = ml_service.predict_lead_score({
        'urgencia_compra': 5,
        'horas_hasta_contacto': 0,
        'intentos_contacto': 0,
        'fuente_meta': lead.fuente,
        'industria': lead.industria or "Otros"
    })
    
    db_lead = Lead(
        empresa_lead=lead.nombre,
        fuente_meta=lead.fuente,
        urgencia_compra=10 if lead.urgencia == "Alta" else 5,
        industria=lead.industria,
        score_calidad=score,
        clasificacion_predicha=clasif,
        fecha_lead=datetime.date.today().isoformat()
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    
    return {
        "id": db_lead.id,
        "nombre": db_lead.empresa_lead,
        "fuente": db_lead.fuente_meta,
        "presupuesto": lead.presupuesto,
        "urgencia": lead.urgencia,
        "score_calidad": score,
        "clasificacion": clasif,
        "industria": db_lead.industria,
        "ciudad": db_lead.ciudad
    }
