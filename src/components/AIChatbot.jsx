import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DEFAULT_WELCOME_MESSAGE =
  "Hi, I am your AI Fintech Assistant. Ask me about budgeting, saving, or investing.";
const RAG_API_URL = "http://localhost:5000/ask";

const messageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const AIChatbot = ({ apiUrl = RAG_API_URL }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    { id: messageId(), role: "assistant", text: DEFAULT_WELCOME_MESSAGE }
  ]);

  const messagesEndRef = useRef(null);

  // Keep the latest message in view while chatting.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isSending) {
      return;
    }

    const userMessage = { id: messageId(), role: "user", text: trimmedMessage };
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue("");

    if (!apiUrl) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: messageId(),
          role: "assistant",
          text: "The chatbot API URL is missing. Please configure the backend endpoint."
        }
      ]);
      return;
    }

    setIsSending(true);

    try {
      // Send the user message to the backend RAG API.
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: trimmedMessage
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`RAG API request failed with status ${response.status}: ${errorBody}`);
      }

      const responsePayload = await response.json();
      const assistantReply = responsePayload?.answer;

      if (typeof assistantReply !== "string" || !assistantReply.trim()) {
        throw new Error("RAG API response did not include a valid answer field.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { id: messageId(), role: "assistant", text: assistantReply }
      ]);
    } catch (error) {
      console.error("Chatbot request failed:", error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: messageId(),
          role: "assistant",
          text: "Sorry, I could not connect right now. Please try again in a moment."
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="surface-panel absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-sm overflow-hidden sm:max-w-md"
          >
            <div className="gradient-hero flex items-center justify-between px-4 py-3 text-white">
              <div>
                <p className="text-sm font-semibold">AI Fintech Assistant</p>
                <p className="text-[11px] text-white/85">Online now</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/15 transition-colors"
                aria-label="Close chatbot"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 4.22a.75.75 0 0 1 1.06 0L10 8.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L11.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 1 1-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="h-[58vh] max-h-[26rem] overflow-y-auto bg-brand-background/70 px-3 py-3 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "rounded-br-md bg-primary-purple text-white"
                        : "rounded-bl-md border border-primary-purple/10 bg-white text-brand-blue dark:border-primary-violet/28 dark:bg-slate-900"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-primary-purple/10 bg-white px-3 py-2 text-sm text-brand-blue/80 shadow-sm dark:border-primary-violet/28 dark:bg-slate-900">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 border-t border-primary-purple/10 bg-white p-3 dark:border-primary-violet/24 dark:bg-slate-950/70"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask about savings, SIPs, or budgeting..."
                className="input-field flex-1 rounded-full"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isSending}
                className="inline-flex items-center justify-center rounded-full bg-brand-dark px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:bg-brand-dark/40"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="btn-primary flex items-center gap-2 px-4 py-3 text-sm shadow-xl"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close AI chatbot" : "Open AI chatbot"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M4 12a8 8 0 0 1 16 0v1a8 8 0 0 1-8 8h-1l-4 2v-4a8 8 0 0 1-3-6v-1Z" />
        </svg>
        <span>{isOpen ? "Close" : "Ask Aarvika"}</span>
      </motion.button>
    </div>
  );
};
