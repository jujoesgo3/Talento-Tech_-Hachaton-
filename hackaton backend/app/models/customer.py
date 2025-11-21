from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    id_cliente_csv = Column(Integer, unique=True, index=True)
    presupuesto = Column(Float)
    tamano_empresa = Column(String)
    industria = Column(String)
    frecuencia_compra = Column(Integer)
    engagement = Column(Float)
    valor_historico = Column(Float)
    satisfaccion = Column(Integer)
    categoria_cliente = Column(String)
    dias_desde_ultima_compra = Column(Integer)
    canal_preferido = Column(String)
    
    # Campos calculados/ML
    riesgo_churn = Column(Float, default=0.0)
    recomendacion = Column(String, default="")
