import React, { useState, useRef, useEffect } from 'react';
import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
// Initialize the client as requested
const client = new InferenceClient(HF_TOKEN);

const App = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am AetherChat AI. Ask me anything or type an image prompt and click 🎨!', type: 'text' }
  ]);
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', content: 'You are AetherChat AI, a helpful and concise assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const appendMessage = (role, content, type = 'text') => {
    setMessages(prev => [...prev, { role, content, type }]);
  };

  /**
   * Text generation using Qwen model via Router Proxy
   */
  const queryText = async (userInput) => {
    if (!HF_TOKEN) return "Error: Token missing in .env";
    const updatedHistory = [...chatHistory, { role: 'user', content: userInput }];
    
    try {
      console.log("Requesting chat completion via SDK using Gemma 4...");
      const response = await client.chatCompletion({
        model: "google/gemma-4-31B-it",
        messages: updatedHistory,
        max_tokens: 1000,
      });

      const reply = response.choices?.[0]?.message?.content || "No response.";
      setChatHistory([...updatedHistory, { role: 'assistant', content: reply }]);
      return reply;
    } catch (e) {
      console.error("SDK Chat Error:", e);
      return `API Error: ${e.message}`;
    }
  };

  /**
   * Image generation using Inference Client (as requested)
   */
  const generateImage = async (prompt) => {
    if (!HF_TOKEN) return { error: "No Token in .env" };
    console.log("Generating image for:", prompt);
    try {
      const blob = await client.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: prompt,
        parameters: { 
          num_inference_steps: 25, // Standard quality
        },
      });
      
      console.log("Image generation successful");
      return { url: URL.createObjectURL(blob) };
    } catch (e) {
      console.error("SDK Image error:", e);
      return { error: `Generation Error: ${e.message}` };
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const q = input.trim();
    setInput('');
    appendMessage('user', q);
    setIsTyping(true);
    const answer = await queryText(q);
    setIsTyping(false);
    appendMessage('assistant', answer);
  };

  const handleGenerateImage = async () => {
    if (!input.trim() || isTyping) return;
    const prompt = input.trim();
    setInput('');
    appendMessage('user', `🎨 Generating: ${prompt}`);
    setIsTyping(true);
    const result = await generateImage(prompt);
    setIsTyping(false);
    
    if (result?.url) {
      appendMessage('assistant', result.url, 'image');
    } else {
      appendMessage('assistant', result?.error || "Image failed.");
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat history cleared.', type: 'text' }]);
    setChatHistory([{ role: 'system', content: 'You are AetherChat AI, a helpful and concise assistant.' }]);
  };

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>AetherChat AI</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Qwen + SDXL (SDK)</div>
        </div>
        <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={clearChat}>Clear</button>
      </header>

      <div className="chat-history">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
            {msg.type === 'text'
              ? <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              : <img src={msg.content} alt="AI Generated" className="message-image" />
            }
          </div>
        ))}
        {isTyping && <div className="typing-indicator"><span></span><span></span><span></span></div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Message or image prompt..."
          disabled={isTyping}
        />
        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleGenerateImage} disabled={isTyping || !input.trim()}>🎨</button>
          <button onClick={sendMessage} disabled={isTyping || !input.trim()}>Send 🚀</button>
        </div>
      </div>
    </div>
  );
};

export default App;
