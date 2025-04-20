
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  role: 'doctor' | 'patient';
  lastMessage?: string;
  unread: number;
}

interface ChatRoomProps {
  selectedContactId?: string; 
}

const ChatRoom = ({ selectedContactId }: ChatRoomProps) => {
  const { user } = useAuth();
  const { contacts, messages, sendMessage } = useChatContext();
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  // Set selected contact from provided ID or first in list
  useEffect(() => {
    if (selectedContactId) {
      const contact = contacts.find(c => c.id === selectedContactId);
      if (contact) setSelectedContact(contact);
    } else if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [selectedContactId, contacts, selectedContact]);

  // Get messages for the selected contact
  const contactMessages = selectedContact 
    ? messages.filter(msg => 
        msg.senderId === user?.id && msg.receiverId === selectedContact.id || 
        msg.senderId === selectedContact.id && msg.receiverId === user?.id
      )
    : [];

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [contactMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      sendMessage({
        text: newMessage.trim(),
        receiverId: selectedContact.id
      });
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50 rounded-md overflow-hidden">
      {/* Contact sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un contact..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-70px)]">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedContact?.id === contact.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>
                    {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium truncate">{contact.name}</h4>
                    {contact.unread > 0 && (
                      <span className="bg-tbibdaba-teal text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  {contact.lastMessage && (
                    <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun contact trouvé
            </div>
          )}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="hidden md:flex flex-col flex-1 bg-gray-50">
        {selectedContact ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200 flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                <AvatarFallback>
                  {selectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">{selectedContact.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedContact.role === 'doctor' ? 'Médecin' : 'Patient'}
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {contactMessages.length > 0 ? (
                contactMessages.map((message) => {
                  const isSender = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isSender && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                          <AvatarFallback>
                            {selectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          isSender
                            ? 'bg-tbibdaba-teal text-white rounded-tr-none'
                            : 'bg-white text-gray-700 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isSender ? 'text-white/70' : 'text-gray-500'
                          }`}
                        >
                          {formatDistanceToNow(message.timestamp, { 
                            addSuffix: true,
                            locale: fr
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Commencez à discuter avec {selectedContact.name}</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tapez votre message..."
                  className="min-h-10 resize-none flex-1 mr-2"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Sélectionnez un contact pour commencer une conversation</p>
          </div>
        )}
      </div>
      
      {/* Mobile view - show only contacts or chat */}
      <div className="flex flex-col flex-1 md:hidden">
        {!selectedContact ? (
          // Show contacts list on mobile
          <div className="p-4 text-center text-gray-500">
            Veuillez sélectionner un contact
          </div>
        ) : (
          // Show selected chat on mobile
          <>
            <div className="p-4 bg-white border-b border-gray-200 flex items-center">
              <Button 
                variant="ghost" 
                className="mr-2 p-0 h-8 w-8"
                onClick={() => setSelectedContact(null)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
              </Button>
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                <AvatarFallback>
                  {selectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">{selectedContact.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedContact.role === 'doctor' ? 'Médecin' : 'Patient'}
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {contactMessages.length > 0 ? (
                contactMessages.map((message) => {
                  const isSender = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isSender && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                          <AvatarFallback>
                            {selectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          isSender
                            ? 'bg-tbibdaba-teal text-white rounded-tr-none'
                            : 'bg-white text-gray-700 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isSender ? 'text-white/70' : 'text-gray-500'
                          }`}
                        >
                          {formatDistanceToNow(message.timestamp, { 
                            addSuffix: true,
                            locale: fr
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Commencez à discuter avec {selectedContact.name}</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tapez votre message..."
                  className="min-h-10 resize-none flex-1 mr-2"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
