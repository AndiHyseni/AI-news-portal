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
  Card,
  Image,
} from "@mantine/core";
import { Send, X, Robot } from "tabler-icons-react";
import { toast } from "react-toastify";
import { sendChatbotMessage } from "../../api/chatbot/chatbot";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

interface Message {
  id: string;
  content: {
    type: "text" | "news";
    message: string;
    articles?: Array<{
      id: string;
      title: string;
      subtitle?: string;
      imageUrl?: string;
    }>;
  };
  isUser: boolean;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: {
        type: "text",
        message:
          "Hello! I'm your AI assistant. How can I help you with news today?",
      },
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: {
        type: "text",
        message: message,
      },
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const data = await sendChatbotMessage(message.trim());

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      toast.error("Failed to get a response. Please try again later.");

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: {
          type: "text",
          message:
            "I'm having trouble connecting right now. Please try again later.",
        },
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

  const handleArticleClick = (articleId: string) => {
    navigate(`/news/${articleId}`);
    setIsOpen(false);
  };

  const renderMessage = (msg: Message) => {
    if (msg.content.type === "news" && msg.content.articles) {
      return (
        <>
          <Text size="sm" mb="sm">
            {msg.content.message}
          </Text>
          <div className="news-articles-container">
            {msg.content.articles.map((article, index) => (
              <Card
                key={article.id}
                className="news-article-card"
                onClick={() => handleArticleClick(article.id)}
              >
                {article.imageUrl && (
                  <Card.Section>
                    <Image
                      src={article.imageUrl}
                      height={120}
                      alt={article.title}
                    />
                  </Card.Section>
                )}
                <Text size="sm" weight={500} lineClamp={2}>
                  {article.title}
                </Text>
                {article.subtitle && (
                  <Text size="xs" color="dimmed" lineClamp={1}>
                    {article.subtitle}
                  </Text>
                )}
              </Card>
            ))}
          </div>
        </>
      );
    }

    return <Text size="sm">{msg.content.message}</Text>;
  };

  return (
    <>
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
                    {renderMessage(msg)}
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
