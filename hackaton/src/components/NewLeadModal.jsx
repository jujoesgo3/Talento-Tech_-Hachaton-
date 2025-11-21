import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';

const NewLeadModal = ({ isOpen, onClose, onLeadCreated }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        fuente: 'Web',
        presupuesto: '',
        urgencia: 'Media',
        industria: '',
        programa_producto_interes: '',
        cargo_lead: '',
        ciudad: '',
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Convertir presupuesto a número
            const dataToSend = {
                ...formData,
                presupuesto: formData.presupuesto ? parseFloat(formData.presupuesto) : 0.0,
            };

            const response = await fetch('http://localhost:8000/leads/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) throw new Error('Error al crear lead');

            const newLead = await response.json();
            onLeadCreated(newLead);

            // Reset form
            setFormData({
                nombre: '',
                fuente: 'Web',
                presupuesto: '',
                urgencia: 'Media',
                industria: '',
                programa_producto_interes: '',
                cargo_lead: '',
                ciudad: '',
            });

            onClose();
        } catch (error) {
            console.error('Error al crear lead:', error);
            alert('Error al crear el lead. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Nuevo Lead</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            La IA calculará automáticamente el score y clasificación
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Nombre de la Empresa/Cliente *
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Ej: Tech Solutions S.A."
                            />
                        </div>

                        {/* Fuente */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Fuente
                            </label>
                            <select
                                name="fuente"
                                value={formData.fuente}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                            >
                                <option value="Web">Web</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Lead Form">Lead Form</option>
                                <option value="Referido">Referido</option>
                            </select>
                        </div>

                        {/* Presupuesto */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Presupuesto (USD)
                            </label>
                            <input
                                type="number"
                                name="presupuesto"
                                value={formData.presupuesto}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="5000"
                            />
                        </div>

                        {/* Urgencia */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Urgencia
                            </label>
                            <select
                                name="urgencia"
                                value={formData.urgencia}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                            >
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                        </div>

                        {/* Industria */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Industria
                            </label>
                            <input
                                type="text"
                                name="industria"
                                value={formData.industria}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Ej: Tecnología, Retail, etc."
                            />
                        </div>

                        {/* Programa/Producto de Interés */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Producto/Programa de Interés
                            </label>
                            <input
                                type="text"
                                name="programa_producto_interes"
                                value={formData.programa_producto_interes}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Ej: CRM Enterprise, Consultoría Digital"
                            />
                        </div>

                        {/* Cargo del Lead */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Cargo del Contacto
                            </label>
                            <input
                                type="text"
                                name="cargo_lead"
                                value={formData.cargo_lead}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Ej: Director, Gerente, CEO"
                            />
                        </div>

                        {/* Ciudad */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Ciudad
                            </label>
                            <input
                                type="text"
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Ej: Bogotá, Medellín"
                            />
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                        <p className="text-sm text-indigo-900">
                            <span className="font-bold">💡 Nota:</span> El sistema de IA calculará
                            automáticamente el score de calidad y la clasificación del lead (Caliente,
                            Tibio, Frío) basándose en los datos ingresados.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                'Crear Lead'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewLeadModal;
