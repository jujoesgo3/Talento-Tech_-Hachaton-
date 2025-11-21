from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime
import numpy as np

from app.core.database import get_db
from app.models.lead import Lead
from app.schemas.metrics import MetricsResponse

router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"]
)

@router.get("/", response_model=MetricsResponse)
async def get_metrics(db: Session = Depends(get_db)):
    total_leads = db.query(Lead).count()
    
    leads_calientes = db.query(Lead).filter(Lead.clasificacion_predicha == "Caliente").count()
    roi_total = leads_calientes * 500.0
    
    fuentes = db.query(Lead.fuente_meta).distinct().all()
    conversion_data = {}
    for f in fuentes:
        fuente_name = f[0]
        if not fuente_name: continue
        count = db.query(Lead).filter(Lead.fuente_meta == fuente_name).count()
        hot = db.query(Lead).filter(Lead.fuente_meta == fuente_name, Lead.clasificacion_predicha == "Caliente").count()
        if count > 0:
            conversion_data[fuente_name] = round((hot / count) * 100, 1)
            
    leads_por_dia = {}
    today = datetime.date.today()
    for i in range(7):
        d = (today - datetime.timedelta(days=i)).isoformat()
        leads_por_dia[d] = np.random.randint(5, 50)
        
    return {
        "roi_total": roi_total,
        "tasa_conversion_promedio": 15.5,
        "total_leads": total_leads,
        "conversion_por_fuente": conversion_data,
        "leads_por_dia": leads_por_dia
    }
