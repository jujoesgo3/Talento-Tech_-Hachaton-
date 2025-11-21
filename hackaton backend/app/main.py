import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core.database import engine, get_db, Base
from app.models import lead, customer
from app.services.ml_service import ml_service
from app.routers import leads_router, churn_router, metrics_router

# --- Configuración de la App ---
app = FastAPI(
    title="Hackathon Backend Professional API",
    version="2.0.0",
    description="API profesional para gestión de leads y predicción de churn.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir Routers
app.include_router(leads_router)
app.include_router(churn_router)
app.include_router(metrics_router)

# Crear tablas
Base.metadata.create_all(bind=engine)

# --- Eventos de Ciclo de Vida ---

@app.on_event("startup")
async def startup_event():
    print("Iniciando sistema profesional...")
    db = next(get_db())
    
    try:
        # Rutas a los datos
        leads_path = os.path.join("data", "leads_historicos.csv")
        churn_path = os.path.join("data", "mi_dataset.csv")
        
        if os.path.exists(leads_path) and os.path.exists(churn_path):
            leads_df = pd.read_csv(leads_path)
            churn_df = pd.read_csv(churn_path)
            
            print("Entrenando modelos con datos actualizados...")
            ml_service.train_lead_model(leads_df)
            ml_service.train_churn_model(churn_df)
            
            if db.query(lead.Lead).count() == 0:
                print("Poblando base de datos de Leads...")
                for _, row in leads_df.iterrows():
                    score, clasif = ml_service.predict_lead_score({
                        'urgencia_compra': row.get('urgencia_compra', 0),
                        'horas_hasta_contacto': row.get('horas_hasta_contacto', 0),
                        'intentos_contacto': row.get('intentos_contacto', 0),
                        'fuente_meta': row.get('fuente_meta', 'Desconocido'),
                        'industria': row.get('industria', 'Otros')
                    })
                    
                    db_lead = lead.Lead(
                        lead_id_csv=str(row.get('lead_id')),
                        fecha_lead=str(row.get('fecha_lead')),
                        industria=str(row.get('industria')),
                        programa_producto_interes=str(row.get('programa_producto_interes')),
                        tipo_campana=str(row.get('tipo_campana')),
                        fuente_meta=str(row.get('fuente_meta')),
                        dispositivo=str(row.get('dispositivo')),
                        hora_generacion=str(row.get('hora_generacion')),
                        cargo_lead=str(row.get('cargo_lead')),
                        empresa_lead=str(row.get('empresa_lead')),
                        ciudad=str(row.get('ciudad')),
                        urgencia_compra=int(row.get('urgencia_compra', 0)),
                        interaccion_previa=str(row.get('interaccion_previa')),
                        horas_hasta_contacto=int(row.get('horas_hasta_contacto', 0)),
                        lead_respondio=str(row.get('lead_respondio')),
                        intentos_contacto=int(row.get('intentos_contacto', 0)),
                        observacion_asesor=str(row.get('observacion_asesor')),
                        status=str(row.get('status')),
                        compro=str(row.get('compro')),
                        score_calidad=score,
                        clasificacion_predicha=clasif
                    )
                    db.add(db_lead)
                db.commit()

            if db.query(customer.Customer).count() == 0:
                print("Poblando base de datos de Clientes...")
                for _, row in churn_df.iterrows():
                    risk = ml_service.predict_churn_risk({
                        'frecuencia_compra': row.get('frecuencia_compra', 0),
                        'engagement': row.get('engagement', 0),
                        'satisfaccion': row.get('satisfaccion', 5),
                        'dias_desde_ultima_compra': row.get('dias_desde_ultima_compra', 0),
                        'valor_historico': row.get('valor_historico', 0)
                    })
                    
                    rec = "Mantener relación"
                    if risk > 0.7:
                        rec = "Ofrecer descuento agresivo"
                    elif risk > 0.4:
                        rec = "Llamada de seguimiento"

                    db_customer = customer.Customer(
                        id_cliente_csv=int(row.get('id_cliente', 0)),
                        presupuesto=float(row.get('presupuesto', 0)),
                        tamano_empresa=str(row.get('tamaño_empresa')),
                        industria=str(row.get('industria')),
                        frecuencia_compra=int(row.get('frecuencia_compra', 0)),
                        engagement=float(row.get('engagement', 0)),
                        valor_historico=float(row.get('valor_historico', 0)),
                        satisfaccion=int(row.get('satisfaccion', 5)),
                        categoria_cliente=str(row.get('categoria_cliente')),
                        dias_desde_ultima_compra=int(row.get('dias_desde_ultima_compra', 0)),
                        canal_preferido=str(row.get('canal_preferido')),
                        riesgo_churn=risk,
                        recomendacion=rec
                    )
                    db.add(db_customer)
                db.commit()
        else:
            print("Advertencia: Archivos CSV no encontrados en carpeta data/")
            
    except Exception as e:
        print(f"Error crítico en startup: {e}")
