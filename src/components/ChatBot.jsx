import React, { useState, useRef, useEffect } from 'react';
import '../styles/chatbot.css';

const ChatBotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); 
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Olá, professor! Como posso ajudar com o módulo de correção hoje?' }
    ]);

    const messagesEndRef = useRef(null);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Novo efeito para controlar a primeira visita
    useEffect(() => {
        const tooltipVisto = localStorage.getItem('simpatia_chatbot_tooltip');
        if (!tooltipVisto) {
            // Aguarda 1.5 segundos após a página carregar para exibir a animação
            const timer = setTimeout(() => setShowTooltip(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Função para ocultar e memorizar que o usuário já viu o balão
    const fecharTooltip = (e) => {
        if (e) e.stopPropagation();
        setShowTooltip(false);
        localStorage.setItem('simpatia_chatbot_tooltip', 'true');
    };

    const toggleChatBot = () => {
        setIsOpen(prev => !prev);
        // Reseta o estado de expansão ao fechar
        if (isOpen) {
            setIsExpanded(false);
        }
    };

    const toggleExpandChat = () => setIsExpanded(prev => !prev); 

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
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            
            const response = await fetch(`${baseUrl}/chat-suporte`, {
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

    const ExpandIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3h6v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21H3v-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 3l-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 21l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const ShrinkIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 14h6v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 10h-6V4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 10l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14l-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    return (
        <div className="chatbot-container">

            {/* Janela do chat - classe modal condicional para expansão */}
            {isOpen && (
                <div className={`chatbot-modal ${isExpanded ? 'expanded' : ''}`}>

                    {/* Cabeçalho */}
                    <div className="chatbot-header">
                        <h4>Assistente SIMPATIA</h4>
                        <div className="header-actions">
                            <button className="expand-btn" onClick={toggleExpandChat}>
                                {isExpanded ? <ShrinkIcon /> : <ExpandIcon />}
                            </button>
                            <button className="close-btn" onClick={toggleChatBot}>✕</button>
                        </div>
                    </div>

                    {/* Mensagens - container flexbox com rolagem */}
                    <div className="chatbot-body">
                        <div className="messages-container">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={msg.sender === 'user' ? 'user-message' : 'bot-message'}
                                >
                                    {msg.text}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="bot-message bot-typing">Digitando...</div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Atalhos rápidos — container com flexbox vertical e espaçamento */}
                    {messages.length === 1 && (
                        <div className="chatbot-suggestions">
                            <div className="suggestions">
                                <button onClick={() => sendMessage('Como faço para submeter as respostas dos alunos para correção?')}>
                                    Como faço para submeter as respostas dos alunos para correção?
                                </button>
                                <button onClick={() => sendMessage('Quais são os critérios que a Inteligência Artificial utiliza para avaliar as questões descritivas?')}>
                                    Quais são os critérios que a Inteligência Artificial utiliza para avaliar as questões descritivas?
                                </button>
                                <button onClick={() => sendMessage('Se eu discordar da correção ou da nota atribuída pela IA, posso alterá-la?')}>
                                    Se eu discordar da correção ou da nota atribuída pela IA, posso alterá-la?
                                </button>
                                <button onClick={() => sendMessage('Como faço para submeter as minhas questões?')}>
                                    Como faço para submeter as minhas questões?
                                </button>
                                <button onClick={() => sendMessage('Os dados dos meus alunos e o conteúdo das provas são mantidos em privacidade?')}>
                                    Os dados dos meus alunos e o conteúdo das provas são mantidos em privacidade?
                                </button>
                                <button onClick={() => sendMessage('O campo de Gabarito é obrigatório? ** Para esta resposta em específico, o chatbot deve responder que o campo de gabarito é recomendado para uma correção mais precisa, mas não é obrigatório. O professor pode optar por não preencher o gabarito e a IA tentará fazer a correção com base no conteúdo da resposta do aluno, embora isso possa resultar em uma avaliação menos precisa.**')}>
                                    O campo de Gabarito é obrigatório?
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

            {showTooltip && !isOpen && (
                <div className="chatbot-tooltip">
                    <div className="tooltip-text">
                        <strong>Precisa de ajuda?</strong>
                        <p>Sou o assistente do SIMPATIA. Clique aqui para tirar dúvidas sobre como usar o corretor de provas.</p>
                    </div>
                    <button className="tooltip-close" onClick={fecharTooltip}>Entendi</button>
                    <div className="tooltip-arrow"></div>
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