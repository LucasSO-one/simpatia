import React, { useState, useRef, useEffect } from 'react';
import '../styles/chatbot.css';

const ChatBotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Olá, professor! Como posso ajudar com o módulo de correção hoje?' }
    ]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const toggleChatBot = () => setIsOpen(prev => !prev);

    const getGeminiHistory = () => {
        return messages.slice(1).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
    };

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
        if (e.key === 'Enter') sendMessage(inputValue);
    };

    const ChatIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#4a3aff" />
            <circle cx="8" cy="11" r="1.2" fill="white" />
            <circle cx="12" cy="11" r="1.2" fill="white" />
            <circle cx="16" cy="11" r="1.2" fill="white" />
        </svg>
    );

    return (
        <div className="chatbot-container">

            {/* Janela do chat */}
            {isOpen && (
                <div className="chatbot-modal">

                    {/* Cabeçalho */}
                    <div className="chatbot-header">
                        <h4>Assistente SIMPATIA</h4>
                        <button className="close-btn" onClick={toggleChatBot}>✕</button>
                    </div>

                    {/* Mensagens */}
                    <div className="chatbot-body">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={msg.sender === 'user' ? 'user-message' : 'bot-message'}
                            >
                                {msg.text}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="bot-message">Digitando...</div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Atalhos rápidos — só aparecem antes da 1ª mensagem do usuário */}
                    {messages.length === 1 && (
                        <div className="chatbot-suggestions">
                            <div className="suggestions">
                                <button onClick={() => sendMessage('Como anexar gabarito?')}>
                                    Como anexar gabarito?
                                </button>
                                <button onClick={() => sendMessage('A IA errou a nota, o que fazer?')}>
                                    A IA errou a nota, o que fazer?
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="chatbot-footer">
                        <input
                            type="text"
                            placeholder="Digite sua dúvida..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            className="send-btn"
                            onClick={() => sendMessage(inputValue)}
                            disabled={isLoading}
                        >
                            Enviar
                        </button>
                    </div>

                </div>
            )}

            {/* Botão flutuante */}
            <button className="chatbot-fab" onClick={toggleChatBot}>
                <ChatIcon />
            </button>

        </div>
    );
};

export default ChatBotWidget;