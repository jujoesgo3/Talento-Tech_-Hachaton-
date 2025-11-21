from pydantic import BaseModel

class ChurnAlert(BaseModel):
    cliente_id: int
    nombre: str
    riesgo_churn: float
    impacto_estimado: float
    recomendacion: str

    class Config:
        orm_mode = True
