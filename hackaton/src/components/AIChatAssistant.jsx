import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const AIChatAssistant = ({ contextData, apiKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hola! Soy tu asistente de Inteligencia de Clientes. Tengo acceso a todos los datos del dashboard. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const systemPrompt = `
        Actúa como un experto analista de datos de negocios y asistente de CRM.
        Tienes acceso a los siguientes datos del dashboard actual:
        ${JSON.stringify(contextData, null, 2)}

        Responde a la siguiente pregunta del usuario basándote ESTRICTAMENTE en estos datos.
        Si la respuesta no está en los datos, dilo amablemente.
        Sé conciso, profesional y ofrece insights de valor.
            `;

            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "mistral-tiny",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.text })),
                        { role: "user", content: userMessage }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`Mistral API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const botResponse = data.choices[0].message.content;

            setMessages(prev => [...prev, { role: 'assistant', text: botResponse }]);
        } catch (error) {
            console.error("Error calling Mistral API:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: "Lo siento, tuve un problema al conectar con Mistral AI. Por favor verifica tu conexión o la API Key." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up" style={{ height: '500px' }}>
                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Asistente IA</h3>
                                <p className="text-xs text-indigo-300 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    En línea
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3.5 text-sm shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                    }`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-1 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                                            <Bot size={12} /> AI Assistant
                                        </div>
                                    )}
                                    <p className="leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl rounded-bl-none p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                                    <Loader2 size={18} className="animate-spin text-indigo-600" />
                                    <span className="text-xs text-slate-500 font-medium">Analizando datos...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Pregunta sobre tus leads, métricas..."
                                className="w-full bg-slate-100 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-200"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                    }`}
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <MessageSquare size={28} className="text-white" />
                )}
            </button>
        </div>
    );
};

export default AIChatAssistant;
