// API Base URL
const API_BASE_URL = 'http://localhost:8000';

/**
 * Servicio para gestionar Leads
 */
export const leadsService = {
    /**
     * Obtener todos los leads
     * @returns {Promise} Lista de leads con clasificación y score
     */
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/leads/`);
            if (!response.ok) throw new Error('Error al obtener leads');
            return await response.json();
        } catch (error) {
            console.error('Error en leadsService.getAll:', error);
            throw error;
        }
    },

    /**
     * Crear un nuevo lead
     * @param {Object} leadData - Datos del lead
     * @returns {Promise} Lead creado con score ML calculado
     */
    create: async (leadData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/leads/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
            });
            if (!response.ok) throw new Error('Error al crear lead');
            return await response.json();
        } catch (error) {
            console.error('Error en leadsService.create:', error);
            throw error;
        }
    },
};

/**
 * Servicio para gestionar alertas de Churn
 */
export const churnService = {
    /**
     * Obtener alertas de clientes en riesgo de abandono
     * @returns {Promise} Lista de clientes con riesgo > 0.7
     */
    getAlerts: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/churn-alerts/`);
            if (!response.ok) throw new Error('Error al obtener alertas de churn');
            return await response.json();
        } catch (error) {
            console.error('Error en churnService.getAlerts:', error);
            throw error;
        }
    },
};

/**
 * Servicio para obtener métricas de negocio
 */
export const metricsService = {
    /**
     * Obtener métricas generales del negocio
     * @returns {Promise} Métricas de ROI, conversión y distribución
     */
    get: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/metrics/`);
            if (!response.ok) throw new Error('Error al obtener métricas');
            return await response.json();
        } catch (error) {
            console.error('Error en metricsService.get:', error);
            throw error;
        }
    },
};

/**
 * Servicio agregado para cargar todos los datos
 */
export const dashboardService = {
    /**
     * Cargar todos los datos del dashboard en una sola llamada
     * @returns {Promise<Object>} Objeto con leads, alerts y metrics
     */
    loadAll: async () => {
        try {
            const [leads, alerts, metrics] = await Promise.all([
                leadsService.getAll(),
                churnService.getAlerts(),
                metricsService.get(),
            ]);

            return {
                leads,
                churnAlerts: alerts,
                metrics,
            };
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
            throw error;
        }
    },
};

export default {
    leads: leadsService,
    churn: churnService,
    metrics: metricsService,
    dashboard: dashboardService,
};
