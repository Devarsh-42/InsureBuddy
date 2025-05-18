"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  VolumeX,
  Volume2,
  Languages,
  Image,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { motion, AnimatePresence } from '@/lib/motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShieldCheck } from 'lucide-react';

// Mock messages for demo
const initialMessages = [
  {
    id: 1,
    content: "👋 Hello! I'm your InsurBuddy AI assistant. How can I help you with insurance today?",
    sender: 'ai',
    timestamp: new Date(),
  },
];

const languages = [
  { name: 'English', code: 'en' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Bengali', code: 'bn' },
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      let response;
      if (inputValue.toLowerCase().includes('health insurance')) {
        response = "Based on your profile, I recommend a comprehensive health insurance plan with at least ₹10 Lakh coverage. Would you like me to explain the benefits or show you some options?";
      } else if (inputValue.toLowerCase().includes('claim')) {
        response = "To file a claim, you'll need your policy number and supporting documents. I can guide you through the process step by step. Would you like to start a claim now?";
      } else if (inputValue.toLowerCase().includes('premium') || inputValue.toLowerCase().includes('cost')) {
        response = "Insurance premiums depend on several factors including your age, medical history, and coverage amount. Would you like me to calculate an estimate for you?";
      } else {
        response = "I understand you're interested in insurance. Could you share more details about what you're looking for? I can help with health, life, auto, or home insurance.";
      }

      const aiMessage = {
        id: messages.length + 2,
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would trigger voice recognition
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // In a real implementation, this would toggle text-to-speech
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </Button>
        </motion.div>
      )}

      {/* Chat widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed z-50 rounded-lg shadow-xl overflow-hidden ${
              isExpanded
                ? 'top-4 right-4 left-4 bottom-4 md:left-auto md:top-4 md:right-4 md:bottom-4 md:w-[400px]'
                : 'bottom-4 right-4 w-[350px] md:w-[400px] h-[500px]'
            }`}
          >
            <div className="flex flex-col h-full bg-background border border-border rounded-lg overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-primary-foreground">
                    <AvatarFallback>
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">InsurBuddy AI</h3>
                    <p className="text-xs text-primary-foreground/70">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-5 w-5" />
                    ) : (
                      <Maximize2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Language selector */}
              <div className="px-4 py-2 bg-muted/30 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs font-normal"
                      >
                        <Languages className="h-3.5 w-3.5 mr-1" />
                        {selectedLanguage.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {languages.map((language) => (
                        <DropdownMenuItem
                          key={language.code}
                          onClick={() => setSelectedLanguage(language)}
                        >
                          {language.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-full ${
                      isSpeaking ? 'text-primary bg-primary/10' : ''
                    }`}
                    onClick={toggleSpeaking}
                  >
                    {isSpeaking ? (
                      <Volume2 className="h-3.5 w-3.5" />
                    ) : (
                      <VolumeX className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-full ${
                      isListening ? 'text-primary bg-primary/10' : ''
                    }`}
                    onClick={toggleListening}
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === ''}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-primary bg-primary/10 hover:bg-primary/20"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;