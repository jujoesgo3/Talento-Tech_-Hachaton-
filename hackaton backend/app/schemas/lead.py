from pydantic import BaseModel
from typing import Optional

class LeadBase(BaseModel):
    nombre: str = "Cliente Nuevo"
    fuente: str = "Web"
    presupuesto: float = 0.0
    urgencia: str = "Media"
    
    industria: Optional[str] = None
    programa_producto_interes: Optional[str] = None
    cargo_lead: Optional[str] = None
    ciudad: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadResponse(LeadBase):
    id: int
    score_calidad: int
    clasificacion: str

    class Config:
        orm_mode = True
