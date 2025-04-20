
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Types
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  role: 'doctor' | 'patient';
  lastMessage?: string;
  unread: number;
}

interface NewMessage {
  text: string;
  receiverId: string;
}

interface ChatContextType {
  messages: Message[];
  contacts: ChatContact[];
  sendMessage: (message: NewMessage) => void;
  markAsRead: (contactId: string) => void;
}

// Create context
const ChatContext = createContext<ChatContextType>({
  messages: [],
  contacts: [],
  sendMessage: () => {},
  markAsRead: () => {},
});

// Mock data for contacts based on appointments
const generateContacts = (userId: string, userRole: string): ChatContact[] => {
  // In a real app, this would fetch from an API based on the user's appointments
  if (userRole === 'doctor') {
    return [
      {
        id: 'patient1',
        name: 'Mohammed Alami',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'patient' as const,
        lastMessage: 'Bonjour Docteur, comment allez-vous?',
        unread: 2,
      },
      {
        id: 'patient2',
        name: 'Fatima Benziane',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        role: 'patient' as const,
        lastMessage: 'Merci pour la consultation',
        unread: 0,
      },
      {
        id: 'patient3',
        name: 'Karim Tadlaoui',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        role: 'patient' as const,
        unread: 0,
      },
    ];
  } else {
    return [
      {
        id: 'doctor1',
        name: 'Dr. Yasmine Benali',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'doctor' as const,
        lastMessage: 'N\'oubliez pas votre rendez-vous demain',
        unread: 1,
      },
      {
        id: 'doctor2',
        name: 'Dr. Omar Kadiri',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'doctor' as const,
        unread: 0,
      },
    ];
  }
};

// Generate mock messages
const generateMessages = (userId: string, contacts: ChatContact[]) => {
  const now = new Date();
  const messages: Message[] = [];

  contacts.forEach(contact => {
    // For each contact, create a conversation with 0-5 messages
    const numMessages = Math.floor(Math.random() * 6);
    
    for (let i = 0; i < numMessages; i++) {
      // Alternate message sender
      const isSenderUser = i % 2 === 0;
      const senderId = isSenderUser ? userId : contact.id;
      const receiverId = isSenderUser ? contact.id : userId;
      
      // Create message with timestamp in the past (random minutes)
      const timestamp = new Date(now.getTime() - Math.random() * 60 * 24 * 60000);
      
      messages.push({
        id: uuidv4(),
        senderId,
        receiverId,
        text: `Message test ${i + 1}`,
        timestamp,
        read: true,
      });
    }
    
    // Add last message if it exists on the contact
    if (contact.lastMessage) {
      messages.push({
        id: uuidv4(),
        senderId: contact.id,
        receiverId: userId,
        text: contact.lastMessage,
        timestamp: new Date(now.getTime() - Math.random() * 60 * 60000),
        read: contact.unread === 0,
      });
    }
  });
  
  // Sort messages by timestamp
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);

  // Initialize contacts and messages when user changes
  useEffect(() => {
    if (user) {
      const userContacts = generateContacts(user.id, user.role);
      setContacts(userContacts);
      setMessages(generateMessages(user.id, userContacts));
    }
  }, [user]);

  // Send a new message
  const sendMessage = (newMessage: NewMessage) => {
    if (!user) return;

    const message: Message = {
      id: uuidv4(),
      senderId: user.id,
      receiverId: newMessage.receiverId,
      text: newMessage.text,
      timestamp: new Date(),
      read: false,
    };

    setMessages(prev => [...prev, message]);

    // Update contact's last message
    setContacts(prev =>
      prev.map(contact => {
        if (contact.id === newMessage.receiverId) {
          return {
            ...contact,
            lastMessage: newMessage.text,
          };
        }
        return contact;
      })
    );

    // In a real app, you would send this to your backend
    console.log('Message sent:', message);
  };

  // Mark messages from a contact as read
  const markAsRead = (contactId: string) => {
    if (!user) return;

    setMessages(prev =>
      prev.map(message => {
        if (message.senderId === contactId && message.receiverId === user.id && !message.read) {
          return { ...message, read: true };
        }
        return message;
      })
    );

    // Update unread count for contact
    setContacts(prev =>
      prev.map(contact => {
        if (contact.id === contactId) {
          return { ...contact, unread: 0 };
        }
        return contact;
      })
    );
  };

  return (
    <ChatContext.Provider value={{ messages, contacts, sendMessage, markAsRead }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook for using the chat context
export const useChatContext = () => useContext(ChatContext);
