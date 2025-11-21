'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function InboxPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch chats where the current user is a participant
        const q = query(
          collection(db, "chats"), 
          where("participants", "array-contains", currentUser.uid),
          orderBy("lastMessageTime", "desc")
        );

        const unsubscribeChats = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setChats(items);
          setLoading(false);
        });
        return () => unsubscribeChats();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  if (!user && !loading) {
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
                <h2>Please login to view messages.</h2>
            </div>
        </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', minHeight: '60vh' }}>
        <h1 style={{ marginBottom: '20px' }}>Messages</h1>
        
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
            {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading chats...</div>}
            
            {!loading && chats.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                    No messages yet. Start a chat from a Request or Traveler page!
                </div>
            )}

            {chats.map(chat => {
                // Determine the "Other" user's name
                const otherUserId = chat.participants.find(uid => uid !== user.uid);
                const otherUserName = chat.participantNames[otherUserId] || "User";
                
                return (
                    <Link href={`/messages/${chat.id}`} key={chat.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s', cursor: 'pointer' }}
                             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{otherUserName}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                    {chat.contextTitle ? <span style={{background:'#e3f2fd', color:'#0070f3', padding:'2px 6px', borderRadius:'4px', fontSize:'0.7rem', marginRight:'8px'}}>{chat.contextTitle}</span> : null}
                                    {chat.lastMessage}
                                </div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#999' }}>
                                {chat.lastMessageTime?.seconds ? new Date(chat.lastMessageTime.seconds * 1000).toLocaleDateString() : ''} &rarr;
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
      </div>
      <Footer />
    </>
  );
}