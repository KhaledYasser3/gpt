import React, { useState, useEffect, useRef } from 'react';
import { MessageSquarePlus, Search, Folder, Plus, Image as ImageIcon, Edit3, Globe, Mic, AlertCircle, Copy, RotateCw, Trash2, Edit2, Check, X, CheckCircle2, Loader2, MoreHorizontal, Share, Users, Pin, Archive, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', margin: '16px 0', border: '1px solid #444', backgroundColor: '#1e1e1e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2f2f2f', padding: '8px 16px', fontSize: '12px', color: '#b4b4b4' }}>
          <span>{match[1]}</span>
          <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {copied ? <><CheckCircle2 size={14} color="#10b981" /> <span style={{color: '#10b981'}}>Copied!</span></> : <><Copy size={14} /> Copy code</>}
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: '16px', backgroundColor: 'transparent' }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  }
  return (
    <code className={className} style={{ backgroundColor: '#2f2f2f', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#ececec' }} {...props}>
      {children}
    </code>
  );
};

export default function Chat() {
  const [showWarning, setShowWarning] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  // Chat State
  const [chats, setChats] = useState([
    { id: 1, title: 'React UI Design', date: 'Aujourd\'hui' },
    { id: 2, title: 'Python Web Scraper', date: 'Hier' }
  ]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [botState, setBotState] = useState('idle'); // idle, thinking, searching, generating
  const [inputValue, setInputValue] = useState('');
  
  // Sidebar Search & Edit State
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [viewArchived, setViewArchived] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botState]);

  // Sidebar Actions
  const filteredChats = chats
    .filter(c => viewArchived ? c.archived : !c.archived)
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.id - a.id;
    });

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setBotState('idle');
  };

  const handleSelectChat = (id) => {
    if (botState !== 'idle') return;
    setActiveChatId(id);
    // Mocking loading previous messages
    setMessages([
      { id: Date.now()-1000, role: 'user', content: 'Hello!' },
      { id: Date.now(), role: 'bot', content: 'Bonjour! Comment puis-je vous aider aujourd\'hui?' }
    ]);
  };

  const handleDeleteChatPrompt = (e, id) => {
    e.stopPropagation();
    setChatToDelete(id);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    setChats(chats.filter(c => c.id !== chatToDelete));
    if (activeChatId === chatToDelete) handleNewChat();
    setChatToDelete(null);
  };

  const handlePinChat = (e, id) => {
    e.stopPropagation();
    setChats(chats.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
    setOpenMenuId(null);
  };

  const handleArchiveChat = (e, id) => {
    e.stopPropagation();
    setChats(chats.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
    if (activeChatId === id) handleNewChat();
    setOpenMenuId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
    setShowAttachmentMenu(false);
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMicClick = () => {
    setIsRecording(true);
  };

  const handleCancelRecord = () => {
    setIsRecording(false);
  };

  const handleSendRecord = () => {
    setIsRecording(false);
    let finalQuery = inputValue + (inputValue ? " " : "") + "(Message vocal simulé)";
    setInputValue('');
    submitMessage(finalQuery);
  };

  const handleAttachClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const handleShareChat = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
    setOpenMenuId(null);
  };

  const handleGroupChat = (e) => {
    e.stopPropagation();
    setShowGroupModal(true);
    setOpenMenuId(null);
  };

  const handleStartRename = (e, id, currentTitle) => {
    e.stopPropagation();
    setEditingChatId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (e) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      setChats(chats.map(c => c.id === editingChatId ? { ...c, title: editingTitle } : c));
    }
    setEditingChatId(null);
  };

  // Chat Simulation Logic
  const submitMessage = (queryText) => {
    if ((!queryText.trim() && attachedFiles.length === 0) || botState !== 'idle') return;

    let finalQuery = queryText.trim();
    if (attachedFiles.length > 0) {
      finalQuery += (finalQuery ? '\n' : '') + '[Fichiers joints: ' + attachedFiles.map(f => f.name).join(', ') + ']';
    }

    const newUserMsg = { id: Date.now(), role: 'user', content: finalQuery };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setAttachedFiles([]);
    
    // Create new chat session if none exists
    if (!activeChatId) {
      const newChat = { id: Date.now(), title: (queryText.trim() || 'Nouveau chat').slice(0, 25) + '...', date: 'Aujourd\'hui' };
      setChats([newChat, ...chats]);
      setActiveChatId(newChat.id);
    }

    setBotState('thinking');

    // Simulate states
    setTimeout(() => {
      // 50% chance to simulate a web search
      const willSearch = Math.random() > 0.5;
      if (willSearch) {
        setBotState('searching');
        setTimeout(() => startGenerating(finalQuery), 2500);
      } else {
        startGenerating(finalQuery);
      }
    }, 1500);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    submitMessage(inputValue);
  };

  const startGenerating = (query) => {
    setBotState('generating');
    const botMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { id: botMsgId, role: 'bot', content: '' }]);

    const markdownResponse = `Voici une réponse générée pour votre requête : **${query}**.\n\n### Points clés\n- C'est une simulation.\n- L'UI ne change pas.\n- Le Markdown est supporté.\n\nVoici un exemple de code :\n\`\`\`javascript\nfunction greet(name) {\n  console.log(\`Bonjour \${name}!\`);\n}\ngreet("Utilisateur");\n\`\`\`\n\nJ'espère que cela vous aide !`;

    let i = 0;
    const interval = setInterval(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === botMsgId) {
          return { ...msg, content: markdownResponse.slice(0, i + 1) };
        }
        return msg;
      }));
      i++;
      if (i >= markdownResponse.length) {
        clearInterval(interval);
        setBotState('idle');
      }
    }, 15); // streaming speed
  };

  const handleRegenerate = () => {
    if (botState !== 'idle' || messages.length === 0) return;
    const lastUserMsg = messages.filter(m => m.role === 'user').pop();
    if (lastUserMsg) {
      // Remove last bot response
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[newMsgs.length - 1].role === 'bot') {
          newMsgs.pop();
        }
        return newMsgs;
      });
      setInputValue(lastUserMsg.content);
      // Wait a tick before submit to clear input
      setTimeout(() => {
        setInputValue('');
        const newUserMsg = { id: Date.now(), role: 'user', content: lastUserMsg.content };
        setMessages(prev => [...prev, newUserMsg]);
        setBotState('thinking');
        setTimeout(() => startGenerating(lastUserMsg.content), 1000);
      }, 0);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div onClick={() => setOpenMenuId(null)} style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: 'var(--user-bg)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: 260, backgroundColor: 'var(--user-sidebar)', display: 'flex', flexDirection: 'column', borderRight: '1px solid #333' }}>
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, flex: 1 }}>
            <span style={{ width: 24, height: 24, backgroundColor: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontSize: 12, fontWeight: 'bold' }}>
              KY
            </span>
          </div>
          <button onClick={handleNewChat} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer' }} title="Nouvelle discussion">
            <MessageSquarePlus size={20} />
          </button>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', gap: 8 }}>
          <button onClick={handleNewChat} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', fontSize: 14, borderRadius: 8, backgroundColor: activeChatId === null ? '#2f2f2f' : 'transparent' }}>
            <MessageSquarePlus size={16} /> Nouvelle discussion
          </button>
          <button onClick={() => setViewArchived(!viewArchived)} style={{ padding: '10px', background: 'transparent', border: 'none', color: viewArchived ? '#10b981' : '#ececec', cursor: 'pointer', borderRadius: 8, backgroundColor: viewArchived ? '#2f2f2f' : 'transparent' }} title={viewArchived ? "Voir l'historique" : "Voir les archives"}>
            <Archive size={16} />
          </button>
        </div>

        <div style={{ marginTop: 24, padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', color: '#b4b4b4', fontSize: 13, backgroundColor: '#2f2f2f', borderRadius: 8 }}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#ececec', outline: 'none', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', color: '#ececec', fontSize: 13, cursor: 'pointer', marginTop: 8 }}>
            <Folder size={16} /> Projects
          </div>
        </div>

        {/* Chat History List */}
        <div style={{ marginTop: 24, flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '8px 28px', fontSize: 11, color: '#b4b4b4', fontWeight: 600, letterSpacing: 1 }}>{viewArchived ? "ARCHIVES" : "HISTORIQUE"}</div>
          <div style={{ padding: '0 16px' }}>
            {filteredChats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => handleSelectChat(chat.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', 
                  backgroundColor: activeChatId === chat.id ? '#2f2f2f' : 'transparent',
                  color: '#ececec', fontSize: 14, borderRadius: 8, cursor: 'pointer',
                  marginBottom: 2
                }}
              >
                {editingChatId === chat.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                    <input 
                      value={editingTitle} 
                      onChange={e => setEditingTitle(e.target.value)} 
                      autoFocus
                      onClick={e => e.stopPropagation()}
                      style={{ flex: 1, minWidth: 0, background: '#1c1c1c', border: '1px solid #444', color: '#fff', padding: '4px 8px', borderRadius: 4, outline: 'none', fontSize: 13 }}
                    />
                    <button onClick={handleSaveRename} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, padding: 0 }}>
                      <Check size={22} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingChatId(null); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, padding: 0 }}>
                      <X size={22} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', flex: 1 }}>
                      {chat.pinned && <Pin size={14} color="#b4b4b4" style={{ flexShrink: 0 }} />}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, opacity: (activeChatId === chat.id || openMenuId === chat.id) ? 1 : 0.4, position: 'relative' }}>
                      <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === chat.id ? null : chat.id); }} style={{ background: 'none', border: 'none', color: '#ececec', cursor: 'pointer' }}>
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {openMenuId === chat.id && (
                        <div style={{ position: 'absolute', top: 24, right: 0, backgroundColor: '#2f2f2f', border: '1px solid #444', borderRadius: 12, padding: '8px', zIndex: 50, width: 220, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'none', border: 'none', color: '#ececec', cursor: 'pointer', fontSize: 14, borderRadius: 6, textAlign: 'left' }} onClick={handleShareChat}>
                            <Share size={16} /> Partager
                          </button>
                          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'none', border: 'none', color: '#ececec', cursor: 'pointer', fontSize: 14, borderRadius: 6, textAlign: 'left' }} onClick={handleGroupChat}>
                            <Users size={16} /> Démarrer un groupe
                          </button>
                          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'none', border: 'none', color: '#ececec', cursor: 'pointer', fontSize: 14, borderRadius: 6, textAlign: 'left' }} onClick={(e) => { handleStartRename(e, chat.id, chat.title); setOpenMenuId(null); }}>
                            <Edit2 size={16} /> Renommer
                          </button>
                          <div style={{ height: 1, backgroundColor: '#444', margin: '4px 0' }} />
                          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'none', border: 'none', color: '#ececec', cursor: 'pointer', fontSize: 14, borderRadius: 6, textAlign: 'left' }} onClick={(e) => handlePinChat(e, chat.id)}>
                            <Pin size={16} /> {chat.pinned ? 'Désépingler' : 'Épingler la discussion'}
                          </button>
                          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'none', border: 'none', color: '#ececec', cursor: 'pointer', fontSize: 14, borderRadius: 6, textAlign: 'left' }} onClick={(e) => handleArchiveChat(e, chat.id)}>
                            <Archive size={16} /> {chat.archived ? 'Désarchiver' : 'Archiver'}
                          </button>
                          <div style={{ height: 1, backgroundColor: '#444', margin: '4px 0' }} />
                          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, borderRadius: 6, textAlign: 'left' }} onClick={(e) => handleDeleteChatPrompt(e, chat.id)}>
                            <Trash2 size={16} /> Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
            {filteredChats.length === 0 && (
              <div style={{ padding: '12px', color: '#888', fontSize: 12, textAlign: 'center' }}>Aucun résultat</div>
            )}
          </div>
        </div>

        {/* Profile Menu Bottom */}
        <div style={{ position: 'relative', marginTop: 'auto' }}>
          
          {/* Profile Modal Popover */}
          {showProfile && (
            <div style={{ position: 'absolute', bottom: 70, left: 16, backgroundColor: '#2f2f2f', padding: 20, borderRadius: 12, width: 300, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, border: '1px solid #444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }}>KY</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Nom de l'utilisateur</div>
                  <div style={{ fontSize: 13, color: '#b4b4b4' }}>user@gmail.com</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#1c1c1c', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#b4b4b4', marginBottom: 4 }}>Type d'abonnement</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e8a87c' }}>GPT Business</div>
              </div>
              <button 
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--admin-accent)', border: 'none', color: '#000', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }} 
                onClick={() => {
                  setShowProfile(false);
                  setShowManageModal(true);
                }}
              >
                Gérer l'abonnement
              </button>
            </div>
          )}

          <div style={{ padding: 16, borderTop: '1px solid #333' }}>
            <div onClick={() => setShowProfile(!showProfile)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 'bold' }}>
                KY
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Nom de l'utilisateur...</div>
                <div style={{ fontSize: 12, color: '#b4b4b4' }}>GPT Business</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        {isDragging && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(47,47,47,0.85)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #10b981', borderRadius: 16, margin: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>Déposez vos fichiers ici</div>
            </div>
          </div>
        )}
        

        {/* Warning Banner */}
        {showWarning && (
          <div style={{ backgroundColor: '#f59e0b', color: '#000', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <AlertCircle size={18} />
            Attention : Votre abonnement expire dans 3 jours. Veuillez contacter l'administrateur pour le renouveler.
            <button onClick={() => setShowWarning(false)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>
        )}

        {/* Top Navbar */}
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#ececec', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            ChatGPT <span style={{ fontSize: 12, color: '#b4b4b4' }}>▼</span>
          </div>
        </div>

        {/* Dynamic Chat Area */}
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
            <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 40 }}>Où commence-t-on ?</h2>
            <div style={{ width: '100%', maxWidth: 720 }}>
              <div style={{ position: 'relative' }}>
                <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--user-input-bg)', borderRadius: 24, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #444', flexWrap: 'wrap' }}>
                  {attachedFiles.length > 0 && (
                    <div style={{ width: '100%', display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      {attachedFiles.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#444', padding: '6px 12px', borderRadius: 8, fontSize: 13, color: '#ececec' }}>
                          <div style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                          <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', color: '#b4b4b4', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="button" onClick={handleAttachClick} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex' }}><Plus size={20} /></button>
                  {isRecording ? (
                    <>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 12, overflow: 'hidden' }}>
                        <div style={{ color: '#555', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', fontSize: 20, letterSpacing: 2, userSelect: 'none' }}>
                          ........................................................................
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '0 12px' }}>
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.05}s`, height: i % 2 === 0 ? '12px' : '8px' }}></div>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={handleCancelRecord} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 8 }}>
                        <X size={20} />
                      </button>
                      <button type="button" onClick={handleSendRecord} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 8 }}>
                        <Check size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Demander n'importe quoi" 
                        style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, outline: 'none' }}
                        disabled={botState !== 'idle'}
                      />
                      {inputValue.trim() || attachedFiles.length > 0 ? (
                        <button type="submit" disabled={botState !== 'idle'} style={{ background: botState !== 'idle' ? '#666' : '#fff', border: 'none', color: '#000', cursor: botState !== 'idle' ? 'not-allowed' : 'pointer', display: 'flex', padding: 6, borderRadius: '50%' }}>
                          <ArrowUp size={16} strokeWidth={3} />
                        </button>
                      ) : (
                        <button type="button" onClick={handleMicClick} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 6 }}>
                          <Mic size={20} />
                        </button>
                      )}
                    </>
                  )}
                </form>
                
                {showAttachmentMenu && (
                  <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 8, backgroundColor: '#2f2f2f', border: '1px solid #444', borderRadius: 12, padding: 8, zIndex: 50, width: 200, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', cursor: 'pointer', fontSize: 14, borderRadius: 6, color: '#ececec' }}>
                      <Folder size={16} /> Importer un fichier
                      <input type="file" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', cursor: 'pointer', fontSize: 14, borderRadius: 6, color: '#ececec' }}>
                      <ImageIcon size={16} /> Importer une image
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => submitMessage("Créer une image de...")} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                  <ImageIcon size={14} /> Créer une image
                </button>
                <button onClick={() => submitMessage("Écrire ou modifier...")} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                  <Edit3 size={14} /> Écrire ou modifier
                </button>
                <button onClick={() => submitMessage("Rechercher quelque chose sur...")} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                  <Globe size={14} /> Rechercher quelque chose
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: 768, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {messages.map((msg, index) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '85%', 
                    backgroundColor: msg.role === 'user' ? '#2f2f2f' : 'transparent',
                    padding: msg.role === 'user' ? '12px 20px' : '0 12px',
                    borderRadius: 24,
                    fontSize: 15,
                    lineHeight: '1.6',
                    color: '#ececec'
                  }}>
                    {msg.role === 'bot' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{ code: CodeBlock }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    )}
                  </div>
                  
                  {/* Bot Message Actions */}
                  {msg.role === 'bot' && botState === 'idle' && index === messages.length - 1 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingLeft: 12 }}>
                      <button onClick={() => copyToClipboard(msg.content)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 12 }}><Copy size={14}/> Copy</button>
                      <button onClick={handleRegenerate} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 12 }}><RotateCw size={14}/> Regenerate</button>
                    </div>
                  )}
                </div>
              ))}

              {/* Bot States (Thinking / Searching) */}
              {botState === 'thinking' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b4b4b4', fontSize: 14, paddingLeft: 12 }}>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Thinking...
                </div>
              )}
              {botState === 'searching' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3b82f6', fontSize: 14, paddingLeft: 12 }}>
                  <Globe size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Searching the web...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input inside chat view */}
            <div style={{ width: '100%', maxWidth: 768, marginTop: 'auto', paddingTop: 20 }}>
              <div style={{ position: 'relative' }}>
                <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--user-input-bg)', borderRadius: 24, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #444', flexWrap: 'wrap' }}>
                  {attachedFiles.length > 0 && (
                    <div style={{ width: '100%', display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      {attachedFiles.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#444', padding: '6px 12px', borderRadius: 8, fontSize: 13, color: '#ececec' }}>
                          <div style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                          <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', color: '#b4b4b4', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="button" onClick={handleAttachClick} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex' }}><Plus size={20} /></button>
                  {isRecording ? (
                    <>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 12, overflow: 'hidden' }}>
                        <div style={{ color: '#555', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', fontSize: 20, letterSpacing: 2, userSelect: 'none' }}>
                          ........................................................................
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '0 12px' }}>
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.05}s`, height: i % 2 === 0 ? '12px' : '8px' }}></div>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={handleCancelRecord} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 8 }}>
                        <X size={20} />
                      </button>
                      <button type="button" onClick={handleSendRecord} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 8 }}>
                        <Check size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Envoyer un message..." 
                        style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, outline: 'none' }}
                        disabled={botState !== 'idle'}
                      />
                      {inputValue.trim() || attachedFiles.length > 0 ? (
                        <button type="submit" disabled={botState !== 'idle'} style={{ background: botState !== 'idle' ? '#666' : '#fff', border: 'none', color: '#000', cursor: botState !== 'idle' ? 'not-allowed' : 'pointer', display: 'flex', padding: 6, borderRadius: '50%' }}>
                          <ArrowUp size={16} strokeWidth={3} />
                        </button>
                      ) : (
                        <button type="button" onClick={handleMicClick} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 6 }}>
                          <Mic size={20} />
                        </button>
                      )}
                    </>
                  )}
                </form>
                
                {showAttachmentMenu && (
                  <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 8, backgroundColor: '#2f2f2f', border: '1px solid #444', borderRadius: 12, padding: 8, zIndex: 50, width: 200, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', cursor: 'pointer', fontSize: 14, borderRadius: 6, color: '#ececec' }}>
                      <Folder size={16} /> Importer un fichier
                      <input type="file" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', cursor: 'pointer', fontSize: 14, borderRadius: 6, color: '#ececec' }}>
                      <ImageIcon size={16} /> Importer une image
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'center', padding: '12px 0 0 0', fontSize: 11, color: '#555' }}>
                ChatGPT peut faire des erreurs. Vérifiez les informations importantes.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Modals */}
      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowShareModal(false)}>
          <div style={{ backgroundColor: '#2f2f2f', padding: 24, borderRadius: 12, width: 400, border: '1px solid #444' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Partager la discussion</h3>
            <p style={{ fontSize: 14, color: '#b4b4b4', marginBottom: 16 }}>Copiez ce lien pour partager la discussion.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input readOnly value="https://chat.openai.com/share/mock-link-123" style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #444', backgroundColor: '#1c1c1c', color: '#fff', outline: 'none' }} />
              <button onClick={() => { navigator.clipboard.writeText('https://chat.openai.com/share/mock-link-123'); setShowShareModal(false); }} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Copier</button>
            </div>
          </div>
        </div>
      )}

      {showGroupModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowGroupModal(false)}>
          <div style={{ backgroundColor: '#2f2f2f', padding: 24, borderRadius: 12, width: 400, border: '1px solid #444' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Démarrer un groupe</h3>
            <p style={{ fontSize: 14, color: '#b4b4b4', marginBottom: 16 }}>Invitez des membres à rejoindre cette discussion.</p>
            <input placeholder="Entrez une adresse email..." style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #444', backgroundColor: '#1c1c1c', color: '#fff', outline: 'none', marginBottom: 16 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowGroupModal(false)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#ececec', border: 'none', cursor: 'pointer' }}>Annuler</button>
              <button onClick={() => setShowGroupModal(false)} style={{ padding: '8px 16px', backgroundColor: '#f97316', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Inviter</button>
            </div>
          </div>
        </div>
      )}

      {chatToDelete !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setChatToDelete(null)}>
          <div style={{ backgroundColor: '#2f2f2f', padding: 24, borderRadius: 12, width: 400, border: '1px solid #444' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Supprimer la discussion</h3>
            <p style={{ fontSize: 14, color: '#b4b4b4', marginBottom: 24 }}>Êtes-vous sûr de vouloir supprimer cette discussion ? Cette action est irréversible.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setChatToDelete(null)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#ececec', border: 'none', cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleConfirmDelete} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Global Style for animations */}
      <style>{`
        .waveform-bar {
          width: 4px;
          background-color: #ececec;
          border-radius: 2px;
          animation: waveform 0.8s infinite ease-in-out;
        }
        @keyframes waveform {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-anim {
          animation: pulse 1s infinite ease-in-out;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
