# 📊 Hackathon Backend API - Documentación

## 🚀 Información General

**API Profesional para Gestión de Leads y Predicción de Churn**

- **Base URL**: `http://localhost:8000`
- **Versión**: 2.0.0
- **Framework**: FastAPI
- **Documentación Interactiva**: 
  - Swagger UI: `http://localhost:8000/docs`
  - ReDoc: `http://localhost:8000/redoc`

## 🎯 Descripción

Esta API proporciona endpoints para gestionar leads de ventas, predecir el riesgo de abandono de clientes (churn) y obtener métricas de negocio. Utiliza modelos de Machine Learning para clasificar leads y calcular riesgos de churn.

---

## 📋 Índice de Endpoints

1. [Leads](#-leads)
2. [Alertas de Churn](#-alertas-de-churn)
3. [Métricas](#-métricas)

---

## 🎯 Leads

### 1. Obtener Todos los Leads

**Endpoint**: `GET /leads/`

**Descripción**: Obtiene la lista completa de todos los leads registrados con su clasificación y score de calidad.

**Respuesta Exitosa** (200):

```json
[
  {
    "id": 1,
    "nombre": "Empresa 21",
    "fuente": "Instagram",
    "presupuesto": 0.0,
    "urgencia": "Baja",
    "score_calidad": 65,
    "clasificacion": "Tibio",
    "industria": "Educación",
    "ciudad": "Pasto"
  },
  {
    "id": 2,
    "nombre": "Empresa 281",
    "fuente": "Instagram",
    "presupuesto": 0.0,
    "urgencia": "Alta",
    "score_calidad": 82,
    "clasificacion": "Caliente",
    "industria": "Ropa Deportiva",
    "ciudad": "Armenia"
  }
]
```

**Campos de Respuesta**:
- `id` (integer): ID único del lead
- `nombre` (string): Nombre de la empresa del lead
- `fuente` (string): Fuente de adquisición (Instagram, Facebook, WhatsApp, etc.)
- `presupuesto` (float): Presupuesto estimado
- `urgencia` (string): Nivel de urgencia ("Alta" si urgencia > 7, "Baja" en otro caso)
- `score_calidad` (integer): Puntaje de calidad calculado por ML (0-100)
- `clasificacion` (string): Clasificación del lead ("Caliente", "Tibio", "Frío")
- `industria` (string): Industria del lead
- `ciudad` (string): Ciudad del lead

---

### 2. Crear un Nuevo Lead

**Endpoint**: `POST /leads/`

**Descripción**: Crea un nuevo lead y automáticamente calcula su score de calidad y clasificación usando Machine Learning.

**Body de la Solicitud**:

```json
{
  "nombre": "Empresa Nueva S.A.",
  "fuente": "Facebook",
  "presupuesto": 50000.0,
  "urgencia": "Alta",
  "industria": "Tecnología",
  "programa_producto_interes": "IA Generativa para Empresas",
  "cargo_lead": "Director",
  "ciudad": "Bogotá"
}
```

**Campos del Body**:
- `nombre` (string, opcional): Nombre de la empresa (default: "Cliente Nuevo")
- `fuente` (string, opcional): Fuente de adquisición (default: "Web")
- `presupuesto` (float, opcional): Presupuesto estimado (default: 0.0)
- `urgencia` (string, opcional): Nivel de urgencia (default: "Media")
- `industria` (string, opcional): Industria del lead
- `programa_producto_interes` (string, opcional): Producto/programa de interés
- `cargo_lead` (string, opcional): Cargo del contacto
- `ciudad` (string, opcional): Ciudad del lead

**Respuesta Exitosa** (200):

```json
{
  "id": 150,
  "nombre": "Empresa Nueva S.A.",
  "fuente": "Facebook",
  "presupuesto": 50000.0,
  "urgencia": "Alta",
  "score_calidad": 78,
  "clasificacion": "Caliente",
  "industria": "Tecnología",
  "ciudad": "Bogotá"
}
```

---

## 🚨 Alertas de Churn

### 1. Obtener Alertas de Riesgo de Churn

**Endpoint**: `GET /churn-alerts/`

**Descripción**: Obtiene una lista de clientes con alto riesgo de abandono (churn > 0.7) junto con recomendaciones de acción.

**Respuesta Exitosa** (200):

```json
[
  {
    "cliente_id": 1665,
    "nombre": "Cliente 1665 (Comercio)",
    "riesgo_churn": 0.85,
    "impacto_estimado": 6824.30,
    "recomendacion": "Ofrecer descuento agresivo"
  },
  {
    "cliente_id": 302,
    "nombre": "Cliente 302 (Tecnología)",
    "riesgo_churn": 0.72,
    "impacto_estimado": 154211.70,
    "recomendacion": "Ofrecer descuento agresivo"
  }
]
```

**Campos de Respuesta**:
- `cliente_id` (integer): ID del cliente
- `nombre` (string): Nombre identificador del cliente con su industria
- `riesgo_churn` (float): Riesgo de abandono (0.0 - 1.0). Valores > 0.7 indican alto riesgo
- `impacto_estimado` (float): Impacto económico estimado si el cliente abandona (10% del valor histórico)
- `recomendacion` (string): Acción recomendada según el nivel de riesgo:
  - Riesgo > 0.7: "Ofrecer descuento agresivo"
  - Riesgo > 0.4: "Llamada de seguimiento"
  - Riesgo ≤ 0.4: "Mantener relación"

---

## 📊 Métricas

### 1. Obtener Métricas de Negocio

**Endpoint**: `GET /metrics/`

**Descripción**: Obtiene métricas generales del negocio, incluyendo ROI, tasas de conversión y distribución de leads.

**Respuesta Exitosa** (200):

```json
{
  "roi_total": 25000.0,
  "tasa_conversion_promedio": 15.5,
  "total_leads": 500,
  "conversion_por_fuente": {
    "Instagram": 18.5,
    "Facebook": 22.3,
    "WhatsApp": 12.1,
    "Lead Form": 25.8
  },
  "leads_por_dia": {
    "2025-11-21": 42,
    "2025-11-20": 35,
    "2025-11-19": 28,
    "2025-11-18": 47,
    "2025-11-17": 33,
    "2025-11-16": 29,
    "2025-11-15": 38
  }
}
```

**Campos de Respuesta**:
- `roi_total` (float): ROI total estimado (leads calientes × $500)
- `tasa_conversion_promedio` (float): Tasa de conversión promedio en porcentaje
- `total_leads` (integer): Número total de leads en el sistema
- `conversion_por_fuente` (object): Diccionario con tasa de conversión por fuente de adquisición
  - Key: Nombre de la fuente (string)
  - Value: Tasa de conversión en porcentaje (float)
- `leads_por_dia` (object): Diccionario con cantidad de leads por día (últimos 7 días)
  - Key: Fecha en formato ISO (YYYY-MM-DD)
  - Value: Cantidad de leads (integer)

---

## 📁 Estructura de Datos

### Modelo Lead (Base de Datos)

Campos completos disponibles en la base de datos:

```typescript
interface Lead {
  id: number;                          // ID autogenerado
  lead_id_csv: string;                 // ID original del CSV
  fecha_lead: string;                  // Fecha de generación del lead
  industria: string;                   // Industria del negocio
  programa_producto_interes: string;   // Producto/servicio de interés
  tipo_campana: string;                // Tipo de campaña marketing
  fuente_meta: string;                 // Fuente de adquisición (Facebook, Instagram, etc.)
  dispositivo: string;                 // Dispositivo usado (Mobile, Desktop)
  hora_generacion: string;             // Hora de generación
  cargo_lead: string;                  // Cargo del contacto
  empresa_lead: string;                // Nombre de la empresa
  ciudad: string;                      // Ciudad
  urgencia_compra: number;             // Urgencia de 0-10
  interaccion_previa: string;          // Si tuvo interacción previa
  horas_hasta_contacto: number;        // Horas hasta primer contacto
  lead_respondio: string;              // Si respondió
  intentos_contacto: number;           // Número de intentos
  observacion_asesor: string;          // Observaciones del asesor
  status: string;                      // Estado del lead
  compro: string;                      // Si compró
  score_calidad: number;               // Score ML (0-100)
  clasificacion_predicha: string;      // Clasificación ML (Caliente/Tibio/Frío)
}
```

### Modelo Customer (Base de Datos)

Campos completos disponibles para análisis de churn:

```typescript
interface Customer {
  id: number;                          // ID autogenerado
  id_cliente_csv: number;              // ID original del CSV
  presupuesto: number;                 // Presupuesto del cliente
  tamano_empresa: string;              // Tamaño de empresa (Micro, Pequeña, Mediana, Grande)
  industria: string;                   // Industria del cliente
  frecuencia_compra: number;           // Frecuencia de compra (veces al mes)
  engagement: number;                  // Nivel de engagement (0.0 - 1.0)
  valor_historico: number;             // Valor histórico de compras
  satisfaccion: number;                // Nivel de satisfacción (1-5)
  categoria_cliente: string;           // Categoría (Nuevo, Recurrente, VIP)
  dias_desde_ultima_compra: number;    // Días desde última compra
  canal_preferido: string;             // Canal preferido (Instagram, WhatsApp, etc.)
  riesgo_churn: number;                // Riesgo de abandono ML (0.0 - 1.0)
  recomendacion: string;               // Recomendación de acción
}
```

---

## 🔧 Configuración CORS

La API está configurada con CORS abierto para desarrollo:

```python
allow_origins=["*"]
allow_credentials=True
allow_methods=["*"]
allow_headers=["*"]
```

**⚠️ Nota**: En producción, restringe los orígenes permitidos.

---

## 🚀 Cómo Iniciar el Backend

### Opción 1: Usando run.py
```bash
python run.py
```

### Opción 2: Usando uvicorn directamente
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

El servidor estará disponible en: `http://localhost:8000`

---

## 📦 Dependencias

Ver `requirements.txt` para la lista completa. Principales dependencias:

- **FastAPI**: Framework web
- **Uvicorn**: Servidor ASGI
- **SQLAlchemy**: ORM para base de datos
- **Pandas**: Procesamiento de datos
- **Scikit-learn**: Machine Learning
- **Pydantic**: Validación de datos

---

## 🧪 Testing de la API

### Usando cURL

**Obtener todos los leads:**
```bash
curl http://localhost:8000/leads/
```

**Crear un nuevo lead:**
```bash
curl -X POST http://localhost:8000/leads/ \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Empresa",
    "fuente": "Facebook",
    "urgencia": "Alta",
    "industria": "Tecnología"
  }'
```

**Obtener alertas de churn:**
```bash
curl http://localhost:8000/churn-alerts/
```

**Obtener métricas:**
```bash
curl http://localhost:8000/metrics/
```

### Usando JavaScript/Fetch

```javascript
// Obtener leads
const getLeads = async () => {
  const response = await fetch('http://localhost:8000/leads/');
  const leads = await response.json();
  console.log(leads);
};

// Crear nuevo lead
const createLead = async (leadData) => {
  const response = await fetch('http://localhost:8000/leads/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData)
  });
  const newLead = await response.json();
  console.log(newLead);
};

// Obtener alertas de churn
const getChurnAlerts = async () => {
  const response = await fetch('http://localhost:8000/churn-alerts/');
  const alerts = await response.json();
  console.log(alerts);
};

// Obtener métricas
const getMetrics = async () => {
  const response = await fetch('http://localhost:8000/metrics/');
  const metrics = await response.json();
  console.log(metrics);
};
```

### Usando Axios (React/Vue)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Servicio de Leads
export const leadsService = {
  getAll: () => axios.get(`${API_BASE_URL}/leads/`),
  create: (leadData) => axios.post(`${API_BASE_URL}/leads/`, leadData)
};

// Servicio de Churn
export const churnService = {
  getAlerts: () => axios.get(`${API_BASE_URL}/churn-alerts/`)
};

// Servicio de Métricas
export const metricsService = {
  get: () => axios.get(`${API_BASE_URL}/metrics/`)
};

// Ejemplo de uso
const loadData = async () => {
  try {
    const leads = await leadsService.getAll();
    const alerts = await churnService.getAlerts();
    const metrics = await metricsService.get();
    
    console.log('Leads:', leads.data);
    console.log('Alertas:', alerts.data);
    console.log('Métricas:', metrics.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🤖 Machine Learning

### Clasificación de Leads

El sistema utiliza modelos de ML para clasificar leads en tres categorías:

- **Caliente** 🔥: Lead con alta probabilidad de conversión
- **Tibio** 🟡: Lead con probabilidad media de conversión
- **Frío** ❄️: Lead con baja probabilidad de conversión

**Factores considerados**:
- Urgencia de compra
- Horas hasta contacto
- Intentos de contacto
- Fuente de adquisición
- Industria

### Predicción de Churn

El modelo predice la probabilidad de que un cliente abandone (0.0 - 1.0):

**Niveles de Riesgo**:
- **Alto** (> 0.7): Requiere acción inmediata
- **Medio** (0.4 - 0.7): Requiere seguimiento
- **Bajo** (< 0.4): Mantener relación normal

**Factores considerados**:
- Frecuencia de compra
- Engagement
- Satisfacción
- Días desde última compra
- Valor histórico

---

## 📊 Datos de Ejemplo

### CSV: leads_historicos.csv

**Columnas disponibles**:
- lead_id
- fecha_lead
- industria
- programa_producto_interes
- tipo_campana
- fuente_meta
- dispositivo
- hora_generacion
- cargo_lead
- empresa_lead
- ciudad
- urgencia_compra
- interaccion_previa
- horas_hasta_contacto
- lead_respondio
- intentos_contacto
- observacion_asesor
- status
- compro

### CSV: mi_dataset.csv

**Columnas disponibles**:
- id_cliente
- presupuesto
- tamaño_empresa
- industria
- frecuencia_compra
- engagement
- valor_historico
- satisfaccion
- categoria_cliente
- dias_desde_ultima_compra
- canal_preferido

---

## 💡 Casos de Uso para el Frontend

### Dashboard de Leads
```javascript
// Mostrar todos los leads con sus scores
const leads = await fetch('http://localhost:8000/leads/').then(r => r.json());

// Filtrar leads calientes para priorización
const hotLeads = leads.filter(lead => lead.clasificacion === 'Caliente');

// Ordenar por score de calidad
const sortedLeads = leads.sort((a, b) => b.score_calidad - a.score_calidad);
```

### Dashboard de Retención
```javascript
// Obtener clientes en riesgo
const alerts = await fetch('http://localhost:8000/churn-alerts/').then(r => r.json());

// Calcular impacto total
const totalImpact = alerts.reduce((sum, alert) => sum + alert.impacto_estimado, 0);

// Agrupar por nivel de urgencia
const critical = alerts.filter(a => a.riesgo_churn > 0.85);
const high = alerts.filter(a => a.riesgo_churn > 0.7 && a.riesgo_churn <= 0.85);
```

### Dashboard de Métricas
```javascript
// Obtener métricas para visualización
const metrics = await fetch('http://localhost:8000/metrics/').then(r => r.json());

// Crear gráfico de conversión por fuente
const chartData = Object.entries(metrics.conversion_por_fuente)
  .map(([fuente, conversion]) => ({ fuente, conversion }));

// Crear gráfico de tendencia de leads
const trendData = Object.entries(metrics.leads_por_dia)
  .map(([fecha, cantidad]) => ({ fecha, cantidad }));
```

---

## 🔒 Notas de Seguridad

- ✅ CORS configurado (ajustar para producción)
- ✅ Validación de datos con Pydantic
- ⚠️ No implementa autenticación (agregar JWT/OAuth para producción)
- ⚠️ Base de datos SQLite (usar PostgreSQL/MySQL en producción)

---

## 📞 Soporte

Para más información, consulta la documentación interactiva:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

**¡Listo para integrar con tu frontend! 🚀**
