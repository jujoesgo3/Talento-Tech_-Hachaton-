from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    lead_id_csv = Column(String, unique=True, index=True)
    fecha_lead = Column(String)
    industria = Column(String)
    programa_producto_interes = Column(String)
    tipo_campana = Column(String)
    fuente_meta = Column(String)
    dispositivo = Column(String)
    hora_generacion = Column(String)
    cargo_lead = Column(String)
    empresa_lead = Column(String)
    ciudad = Column(String)
    urgencia_compra = Column(Integer)
    interaccion_previa = Column(String)
    horas_hasta_contacto = Column(Integer)
    lead_respondio = Column(String)
    intentos_contacto = Column(Integer)
    observacion_asesor = Column(String)
    status = Column(String)
    compro = Column(String)
    
    # Campos calculados/ML
    score_calidad = Column(Integer, default=0)
    clasificacion_predicha = Column(String, default="Tibio")
