from pydantic import BaseModel
from typing import Dict

class MetricsResponse(BaseModel):
    roi_total: float
    tasa_conversion_promedio: float
    total_leads: int
    conversion_por_fuente: Dict[str, float]
    leads_por_dia: Dict[str, int]
