import React, { useState, useRef, useEffect } from "react";
import {
  Paper,
  TextInput,
  Button,
  Text,
  ScrollArea,
  Avatar,
  Group,
  ActionIcon,
} from "@mantine/core";
import { Send, X, Robot } from "tabler-icons-react";
import { toast } from "react-toastify";
import { sendChatbotMessage } from "../../api/chatbot/chatbot";
import "./Chatbot.css";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you with news today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Call API to get response
      const data = await sendChatbotMessage(message.trim());

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your request.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      toast.error("Failed to get a response. Please try again later.");

      // Add error message from bot
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Mock responses for now - will be replaced with actual API call
  const getMockResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I assist you with news today?";
    } else if (lowerCaseMessage.includes("latest news")) {
      return "Our latest headlines include updates on technology, politics, sports, and health. What topic are you interested in?";
    } else if (lowerCaseMessage.includes("sport")) {
      return "Our top sports stories today include major league updates, tournament results, and athlete interviews. Would you like me to find specific sports news for you?";
    } else if (
      lowerCaseMessage.includes("tech") ||
      lowerCaseMessage.includes("technology")
    ) {
      return "Today's technology news features new product launches, industry trends, and innovation stories. Any specific technology topic you'd like to know more about?";
    } else {
      return "I understand you're asking about that. Let me help you find relevant articles on our site. You can also browse news by category using our main navigation menu.";
    }
  };

  return (
    <>
      {/* Chat button */}
      <div className="chatbot-button-container">
        <Button
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
          radius="xl"
          size="md"
          leftIcon={<Robot size={20} />}
        >
          Ask AI Assistant
        </Button>
      </div>

      {/* Chat modal */}
      {isOpen && (
        <div className="chatbot-modal">
          <Paper shadow="md" radius="md" className="chatbot-container">
            <div className="chatbot-header">
              <Group position="apart">
                <Group>
                  <Avatar color="violet" radius="xl">
                    AI
                  </Avatar>
                  <Text weight={500}>AI News Assistant</Text>
                </Group>
                <ActionIcon onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </ActionIcon>
              </Group>
            </div>

            <ScrollArea
              className="chatbot-messages"
              viewportRef={scrollAreaRef}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-container ${
                    msg.isUser ? "user-message" : "bot-message"
                  }`}
                >
                  <div className={`message ${msg.isUser ? "user" : "bot"}`}>
                    <Text size="sm">{msg.text}</Text>
                    <Text size="xs" color="dimmed" className="message-time">
                      {formatTime(msg.timestamp)}
                    </Text>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message-container bot-message">
                  <div className="message bot">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="chatbot-input">
              <TextInput
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                disabled={isLoading}
                rightSection={
                  <ActionIcon
                    color="violet"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                  >
                    <Send size={16} />
                  </ActionIcon>
                }
                radius="xl"
                size="md"
                className="chatbot-text-input"
              />
            </div>
          </Paper>
        </div>
      )}
    </>
  );
};
