import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { IoChatbubblesOutline } from "react-icons/io5";

const ChatBotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Olá, professor! Como posso ajudar com o módulo de correção hoje?' }
    ]);

    const messagesEndRef = useRef(null);

    // Auto-scroll para a última mensagem
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const toggleChatBot = () => {
        setIsOpen(!isOpen);
    };

    // Formata o histórico removendo a saudação inicial
    const getGeminiHistory = () => {
        return messages.slice(1).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
    };

    // Comunicação com o back-end
    const sendMessage = async (textToSend) => {
        if (!textToSend.trim()) return;

        setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/chat-suporte', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mensagemUsuario: textToSend,
                    historico: getGeminiHistory()
                })
            });

            if (!response.ok) throw new Error('Erro na comunicação com o servidor');

            const data = await response.json();
            setMessages(prev => [...prev, { sender: 'bot', text: data.resposta }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Erro de conexão com o servidor.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage(inputValue);
        }
    };

    return (
        <div style={{
            position: 'fixed', bottom: '30px', right: '30px',
            zIndex: '2147483647', display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', pointerEvents: 'none'
        }}>
            {isOpen && (
                <div style={{
                    width: '320px', height: '450px', backgroundColor: 'white',
                    borderRadius: '12px', boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
                    marginBottom: '15px', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', fontFamily: 'sans-serif', pointerEvents: 'auto'
                }}>
                    <div style={{ backgroundColor: '#4a3aff', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>Assistente SIMPATIA</h4>
                        <button onClick={toggleChatBot} style={{ background: 'none', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>X</button>
                    </div>

                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender === 'user' ? '#4a3aff' : '#e6e6fa',
                                color: msg.sender === 'user' ? 'white' : 'black',
                                padding: '10px', borderRadius: '8px', fontSize: '14px',
                                maxWidth: '85%'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', backgroundColor: '#e6e6fa', padding: '10px', borderRadius: '8px', fontSize: '14px' }}>
                                Digitando...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Exibe atalhos apenas se não houver conversa prévia */}
                    {messages.length === 1 && (
                        <div style={{ padding: '0 15px 10px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <button onClick={() => sendMessage("Como anexar gabarito?")} style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #4a3aff', color: '#4a3aff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Como anexar gabarito?</button>
                            <button onClick={() => sendMessage("A IA errou a nota, o que fazer?")} style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #4a3aff', color: '#4a3aff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>A IA errou a nota, o que fazer?</button>
                        </div>
                    )}

                    <div style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex', backgroundColor: 'white' }}>
                        <input 
                            type="text" 
                            placeholder='Digite sua dúvida...' 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px', outline: 'none' }} 
                        />
                        <button 
                            onClick={() => sendMessage(inputValue)} 
                            disabled={isLoading}
                            style={{ backgroundColor: '#4a3aff', color: 'white', border: 'none', borderRadius: '4px', marginLeft: '5px', padding: '0 15px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                            Enviar
                        </button>
                    </div>
                </div>      
            )}

            <button onClick={toggleChatBot} style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, pointerEvents: 'auto' }}>
                <IoChatbubblesOutline size={24} color="#68c6ef" />
            </button>
        </div>
    );
};  

//injetando o DOM
let widgetContainer = document.getElementById('simpatia-widget-container');

if (!widgetContainer) {
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'simpatia-widget-container';
    
    Object.assign(widgetContainer.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: '2147483647',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none'
    });

    document.body.appendChild(widgetContainer);
}

const root = createRoot(widgetContainer);
root.render(
    <div style={{ pointerEvents: 'auto' }}>
        <ChatBotWidget />
    </div>
);