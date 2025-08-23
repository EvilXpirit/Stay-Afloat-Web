
import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/ChatService';
import type { ChatMessage } from '../types/chat';
import { MessageSender } from '../types/types';
import { Leaf, Send } from 'lucide-react';

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Hello! I'm your StayAfloat companion. How are you feeling today?", sender: MessageSender.AI }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            text: input,
            sender: MessageSender.User,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await aiService.sendMessage(input);
            const aiMessage: ChatMessage = {
                id: Date.now() + 1,
                text: aiResponseText,
                sender: MessageSender.AI,
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                text: 'Sorry, something went wrong. Please try again.',
                sender: MessageSender.AI,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-0">
            <header className="p-4 border-b border-gray-200 md:hidden">
                <h1 className="text-xl font-bold text-[#2F4F4F]">AI Companion</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === MessageSender.User ? 'justify-end' : 'justify-start'}`}>
                       {msg.sender === MessageSender.AI && <div className="w-8 h-8 rounded-full bg-[#4DB6AC] flex items-center justify-center text-white flex-shrink-0"><Leaf size={18}/></div>}
                        <div className={`max-w-xs md:max-w-md lg:max-w-xl px-4 py-3 rounded-2xl ${msg.sender === MessageSender.User ? 'bg-[#4DB6AC] text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-[#4DB6AC] flex items-center justify-center text-white flex-shrink-0"><Leaf size={18}/></div>
                        <div className="max-w-xs md:max-w-md lg:max-w-xl px-4 py-3 rounded-2xl bg-white text-slate-700 shadow-sm rounded-bl-none">
                           <div className="flex items-center gap-2">
                               <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                               <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                               <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-[#FAF9F6] border-t border-gray-200">
                <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="w-full bg-transparent focus:outline-none p-2"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="bg-[#4DB6AC] text-white rounded-md p-2 hover:bg-teal-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
                        <Send className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;
