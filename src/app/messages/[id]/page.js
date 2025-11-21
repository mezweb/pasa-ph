'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function ChatRoomPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const dummyScroll = useRef();

  // 1. Setup Auth & Chat Info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if(user) {
            setCurrentUser(user);
            // Fetch Chat Metadata
            const chatDoc = await getDoc(doc(db, "chats", id));
            if(chatDoc.exists()) {
                setChatInfo(chatDoc.data());
            }
        }
    });
    return () => unsubscribe();
  }, [id]);

  // 2. Listen for Messages AND Mark as Read
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "chats", id, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      
      // Scroll to bottom
      setTimeout(() => dummyScroll.current?.scrollIntoView({ behavior: 'smooth' }), 100);

      // --- MARK AS READ LOGIC ---
      // We update the 'lastRead' field for THIS user to the current time
      // This tells the Navbar "I have seen everything up to this point"
      updateDoc(doc(db, "chats", id), {
        [`lastRead.${currentUser.uid}`]: serverTimestamp()
      }).catch(err => console.error("Error marking read:", err));
      // ---------------------------
    });
    return () => unsubscribe();
  }, [id, currentUser]); // Re-run when currentUser is loaded

  // 3. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const text = newMessage;
    setNewMessage(''); 

    await addDoc(collection(db, "chats", id, "messages"), {
      text,
      senderId: currentUser.uid,
      createdAt: serverTimestamp()
    });

    await updateDoc(doc(db, "chats", id), {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      // Automatically mark as read for the SENDER (so you don't notify yourself)
      [`lastRead.${currentUser.uid}`]: serverTimestamp() 
    });
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '20px', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '15px', background: 'white', border: '1px solid #eaeaea', borderRadius: '12px 12px 0 0', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3 style={{ margin: 0 }}>
                    {chatInfo ? chatInfo.contextTitle : "Chat"}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Order Discussion</span>
            </div>
            <a href="/messages" style={{ fontSize: '0.9rem', color: '#0070f3', textDecoration:'none' }}>&larr; Back to Inbox</a>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, background: '#f9f9f9', border: '1px solid #eaeaea', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map(msg => {
                const isMe = msg.senderId === currentUser?.uid;
                return (
                    <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                        <div style={{ 
                            background: isMe ? '#0070f3' : 'white', 
                            color: isMe ? 'white' : '#333',
                            padding: '10px 15px', 
                            borderRadius: '12px',
                            border: isMe ? 'none' : '1px solid #ddd',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                            {msg.text}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>
                            {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Sending...'}
                        </div>
                    </div>
                );
            })}
            <div ref={dummyScroll}></div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', padding: '15px', background: 'white', border: '1px solid #eaeaea', borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
            <input 
                type="text" 
                placeholder="Type a message..." 
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
                type="submit" 
                className="btn-primary"
                disabled={!newMessage.trim()}
                style={{ padding: '0 20px' }}
            >
                Send
            </button>
        </form>

      </div>
    </>
  );
}