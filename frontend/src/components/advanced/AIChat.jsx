import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User, X, Copy, Check } from "lucide-react";
import { apiFetch } from "../../services/apiHelper";

const ChatMessage = ({ content }) => {
  const [copiedBlock, setCopiedBlock] = useState(null);

  const parseMarkdown = (text) => {
    if (!text) return null;

    const parts = [];
    let remaining = text;
    let key = 0;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={key++} className="chat-text">
            {renderInline(text.slice(lastIndex, match.index))}
          </span>
        );
      }

      const lang = match[1] || "code";
      const code = match[2].trim();
      const blockId = `code-${key}`;

      parts.push(
        <div key={key++} className="chat-code-block">
          <div className="chat-code-header">
            <span className="chat-code-lang">{lang}</span>
            <button
              className="chat-code-copy"
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopiedBlock(blockId);
                setTimeout(() => setCopiedBlock(null), 2000);
              }}
            >
              {copiedBlock === blockId ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
          <pre className="chat-code-content">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={key++} className="chat-text">
          {renderInline(text.slice(lastIndex))}
        </span>
      );
    }

    return parts.length > 0 ? parts : <span className="chat-text">{renderInline(text)}</span>;
  };

  const renderInline = (text) => {
    if (!text) return text;

    const lines = text.split("\n");
    return lines.map((line, i) => {
      let formatted = line;

      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      formatted = formatted.replace(/`(.*?)`/g, '<code class="chat-inline-code">$1</code>');

      if (formatted.startsWith("- ") || formatted.startsWith("* ")) {
        return (
          <div key={i} className="chat-list-item">
            <span className="chat-bullet">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
          </div>
        );
      }

      if (/^\d+\.\s/.test(formatted)) {
        const numMatch = formatted.match(/^(\d+)\.\s(.*)/);
        return (
          <div key={i} className="chat-list-item">
            <span className="chat-num">{numMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: numMatch[2] }} />
          </div>
        );
      }

      if (formatted.trim() === "") {
        return <div key={i} className="chat-spacer" />;
      }

      return (
        <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return <div className="chat-rendered">{parseMarkdown(content)}</div>;
};

const AIChat = ({ code, language, analysisContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await apiFetch("/chat", {
        method: "POST",
        body: JSON.stringify({
          message: trimmed,
          code: code || "",
          language: language || "python",
          analysis_context: analysisContext || null,
        }),
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "No response received." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err.message || "Could not connect to AI assistant."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)} title="AI Chat Assistant">
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <Bot size={18} />
            <span>AI Assistant</span>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <div className="chat-empty-icon">💬</div>
                <p>Ask me anything about your code</p>
                <div className="chat-suggestions">
                  <button onClick={() => setInput("Explain this code")}>Explain this code</button>
                  <button onClick={() => setInput("How can I optimize this?")}>Optimize this</button>
                  <button onClick={() => setInput("What's the time complexity?")}>Time complexity</button>
                  <button onClick={() => setInput("Find bugs in this code")}>Find bugs</button>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className="chat-avatar">
                  {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="chat-bubble-wrap">
                  {msg.role === "assistant" ? (
                    <ChatMessage content={msg.content} />
                  ) : (
                    <div className="chat-bubble user">{msg.content}</div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="chat-avatar"><Bot size={14} /></div>
                <div className="chat-bubble-wrap">
                  <div className="chat-bubble assistant typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>
          <div className="chat-input-wrap">
            <input
              className="chat-input"
              placeholder={code ? "Ask about your code..." : "Ask me anything..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button className="chat-send" onClick={handleSend} disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
