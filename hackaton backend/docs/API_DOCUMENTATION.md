# Documentación de API - Hackathon Backend

## Descripción General
Esta API proporciona servicios de backend para la gestión de leads y predicción de churn de clientes. Utiliza modelos de Machine Learning entrenados con datos históricos para clasificar leads y detectar riesgos de cancelación.

## Estructura del Proyecto
El proyecto sigue una arquitectura modular profesional:

- **app/**: Código fuente principal.
  - **core/**: Configuración y base de datos.
  - **models/**: Modelos de base de datos (SQLAlchemy).
  - **schemas/**: Esquemas de validación de datos (Pydantic).
  - **services/**: Lógica de negocio y Machine Learning.
  - **routers/**: Endpoints de la API organizados por dominio.
- **data/**: Archivos de datos (CSV).
- **docs/**: Documentación.

## Endpoints Principales

### Leads
- **GET /leads/**: Obtiene la lista de leads históricos con su clasificación predicha (Caliente, Tibio, Frío).
- **POST /leads/**: Crea un nuevo lead y devuelve su clasificación en tiempo real.

### Churn
- **GET /churn-alerts/**: Devuelve una lista de clientes con alto riesgo de cancelación (> 70%) y recomendaciones automáticas.

### Métricas
- **GET /metrics/**: Proporciona KPIs del negocio como ROI total, tasa de conversión y leads por día.

## Ejecución
Para iniciar el servidor de desarrollo:

```bash
python run.py
```

La documentación interactiva (Swagger UI) está disponible en: `http://localhost:8000/docs`
