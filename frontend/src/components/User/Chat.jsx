import React, { useState, useEffect, useRef } from 'react';
import { MessageSquarePlus, Search, Folder, Plus, Image as ImageIcon, Edit3, Globe, Mic, AlertCircle, Copy, RotateCw, Check, ArrowUp, MoreHorizontal, Share, Users, Edit2, Pin, Archive, Trash2, StopCircle, PanelLeftClose, PanelLeft, ArrowLeft, LogOut, CheckCircle2, Loader2, X, ChevronDown, ChevronLeft, ChevronRight, Headphones, Monitor, TrendingUp, AudioLines } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { api } from '../../services/api';
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

const MarkdownComponents = {
  code: CodeBlock,
  h1: ({ children }) => (
    <h1 style={{ fontSize: 30, lineHeight: 1.2, margin: '4px 0 18px', fontWeight: 750, color: '#f5f5f5' }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: 23, lineHeight: 1.3, margin: '34px 0 14px', paddingBottom: 8, borderBottom: '1px solid #343434', fontWeight: 720, color: '#f1f1f1' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: 19, lineHeight: 1.35, margin: '24px 0 10px', fontWeight: 700, color: '#ffffff' }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{ margin: '8px 0 14px', lineHeight: 1.75, color: '#e6e6e6' }}>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul style={{ margin: '8px 0 18px', paddingLeft: 24, display: 'grid', gap: 7 }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{ margin: '8px 0 18px', paddingLeft: 24, display: 'grid', gap: 7 }}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ lineHeight: 1.7, paddingLeft: 4, color: '#e8e8e8' }}>
      {children}
    </li>
  ),
  hr: () => (
    <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #3a3a3a, transparent)', margin: '22px 0' }} />
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #7c7c7c', backgroundColor: '#242424', borderRadius: 8, color: '#e8e8e8' }}>
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '18px 0', border: '1px solid #3c3c3c', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th style={{ padding: '10px 12px', borderBottom: '1px solid #444', backgroundColor: '#2b2b2b', textAlign: 'left', fontWeight: 700 }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '10px 12px', borderBottom: '1px solid #333', verticalAlign: 'top' }}>
      {children}
    </td>
  ),
  strong: ({ children }) => (
    <strong style={{ color: '#ffffff', fontWeight: 750 }}>
      {children}
    </strong>
  )
};

export default function Chat({ currentUser, onLogout }) {
  const subscription = currentUser?.subscription;
  const daysLeft = subscription?.end_date ? Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const tokenUsagePercent = subscription?.token_limit ? (subscription.tokens_used / subscription.token_limit) * 100 : 0;

  const isNearingExpiration = daysLeft !== null && daysLeft <= 3;
  const isTokensLow = tokenUsagePercent >= 90;
  const shouldShowWarning = isNearingExpiration || isTokensLow;

  const [warningDismissed, setWarningDismissed] = useState(false);
  const displayWarning = shouldShowWarning && !warningDismissed;

  const warningMessage = isNearingExpiration 
    ? `Attention : Votre abonnement expire dans ${Math.max(0, daysLeft)} jour(s). Veuillez contacter l'administrateur.`
    : `Attention : Vous avez utilisé ${Math.round(tokenUsagePercent)}% de votre limite de jetons.`;
  const [showManageModal, setShowManageModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Dynamic user data
  const userName = currentUser?.full_name || currentUser?.username || "Utilisateur";
  const userEmail = currentUser?.email || "utilisateur@example.com";
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const [showProfile, setShowProfile] = useState(false);
  // Chat State
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await api.chat.getChats();
        if (res) setChats(res);
      } catch (e) {
        console.error(e);
      }
    };
    loadChats();
  }, []);
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
  const [showAspectRatioMenu, setShowAspectRatioMenu] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('Auto');
  const [activeMode, setActiveMode] = useState('default');

  // Projects state
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsTab, setProjectsTab] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [projectChats, setProjectChats] = useState([]);
  const [projectChatsLoading, setProjectChatsLoading] = useState(false);

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
    setShowProjects(false);
    setActiveProject(null);
  };

  const handleOpenProjects = async () => {
    setShowProjects(true);
    setProjectsLoading(true);
    try {
      const res = await api.projects.getProjects();
      setProjects(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      if (!api.projects) {
        alert("Erreur système: api.projects est introuvable. Veuillez recharger la page (F5).");
        return;
      }
      const res = await api.projects.createProject(newProjectName.trim(), newProjectDesc.trim());
      setProjects(prev => [res, ...prev]);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowNewProjectModal(false);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la création du projet: " + (e.message || "Erreur inconnue"));
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.projects.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProjectRename = async (projectId) => {
    if (!editingProjectName.trim()) return;
    try {
      const res = await api.projects.updateProject(projectId, editingProjectName.trim());
      setProjects(prev => prev.map(p => p.id === projectId ? res : p));
      setEditingProject(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProjectClick = async (project) => {
    setActiveProject(project);
    setShowProjects(false);
    setProjectChatsLoading(true);
    try {
      const res = await api.chat.getChats(project.id);
      setProjectChats(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setProjectChatsLoading(false);
    }
  };

  const handleCreateProjectChat = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeProject) return;
    const msg = inputValue;
    setInputValue('');
    setBotState('thinking');
    
    try {
      const chatRes = await api.chat.createChat(msg.substring(0, 30), activeProject.id);
      setActiveChatId(chatRes.id);
      setProjectChats(prev => [chatRes, ...prev]);
      
      const res = await api.chat.sendMessage(chatRes.id, msg);
      setMessages(res || []);
    } catch(e) {
      console.error(e);
    } finally {
      setBotState('idle');
    }
  };

  const handleSelectChat = async (id) => {
    if (botState !== 'idle') return;
    setShowProjects(false);
    setActiveChatId(id);
    setMessages([]);
    try {
      const msgs = await api.chat.getMessages(id);
      setMessages(msgs || []);
    } catch(e) {
      console.error(e);
    }
  };

  const handleDeleteChatPrompt = (e, id) => {
    e.stopPropagation();
    setChatToDelete(id);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.chat.deleteChat(chatToDelete);
      setChats(chats.filter(c => c.id !== chatToDelete));
      if (activeChatId === chatToDelete) handleNewChat();
      setChatToDelete(null);
    } catch(e) {
      console.error(e);
    }
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
  const submitMessage = async (queryText) => {
    if ((!queryText.trim() && attachedFiles.length === 0) || botState !== 'idle') return;

    let finalQuery = queryText.trim();
    if (attachedFiles.length > 0) {
      finalQuery += (finalQuery ? '\n' : '') + '[Fichiers joints: ' + attachedFiles.map(f => f.name).join(', ') + ']';
    }

    const newUserMsg = { id: Date.now(), role: 'user', content: finalQuery };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setAttachedFiles([]);
    
    let currentChatId = activeChatId;
    if (!currentChatId) {
      try {
        const newChatTitle = (queryText.trim() || 'Nouveau chat').slice(0, 25) + '...';
        const createdChat = await api.chat.createChat(newChatTitle, activeProject ? activeProject.id : null);
        if (!activeProject) {
          setChats([createdChat, ...chats]);
        } else {
          setProjectChats(prev => [createdChat, ...prev]);
        }
        setActiveChatId(createdChat.id);
        currentChatId = createdChat.id;
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setBotState('thinking');

    try {
      const res = await api.chat.sendMessage(currentChatId, finalQuery);
      setMessages(res);
      setBotState('idle');
    } catch (e) {
      console.error(e);
      setBotState('idle');
      const errorMsg = e.message?.toLowerCase().includes('token limit')
        ? '⚠️ Limite de jetons atteinte. Contactez votre administrateur pour recharger votre solde.'
        : 'Erreur lors de la communication avec le serveur.';
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: errorMsg }]);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    submitMessage(inputValue);
  };

  // Removed mock startGenerating

  const handleRegenerate = () => {
    if (botState !== 'idle' || messages.length === 0) return;
    const lastUserMsg = messages.filter(m => m.role === 'user').pop();
    if (lastUserMsg) {
      setInputValue(lastUserMsg.content);
      setTimeout(() => {
        handleSubmit();
      }, 100);
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
          <div
            onClick={handleOpenProjects}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', color: showProjects ? '#ececec' : '#b4b4b4', fontSize: 13, cursor: 'pointer', marginTop: 8, borderRadius: 8, backgroundColor: showProjects ? '#2f2f2f' : 'transparent' }}
          >
            <Folder size={16} /> Projets
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
        <div style={{ position: 'relative', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          
          {/* Profile Modal Popover */}
          {showProfile && (
            <div style={{ position: 'absolute', bottom: 120, left: 16, backgroundColor: '#2f2f2f', padding: 20, borderRadius: 12, width: 300, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, border: '1px solid #444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }}>{getInitials(userName)}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userName}</div>
                  <div style={{ fontSize: 13, color: '#b4b4b4', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userEmail}</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#1c1c1c', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#b4b4b4', marginBottom: 4 }}>Type d'abonnement</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e8a87c' }}>Abonnement Pro</div>
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

          <div style={{ padding: '0 16px 8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div onClick={() => setShowProfile(!showProfile)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 'bold' }}>
                {getInitials(userName)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userName}</div>
                <div style={{ fontSize: 12, color: '#b4b4b4' }}>Abonnement Pro</div>
              </div>
            </div>

            <button 
              onClick={() => setShowLogoutConfirm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'transparent', border: '1px solid #333', color: '#ef4444', borderRadius: 12, cursor: 'pointer', fontWeight: 500, justifyContent: 'center' }}
            >
              <LogOut size={16} /> Déconnexion
            </button>
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
        
        {/* Expiration Warning */}
        {displayWarning && (
          <div style={{ backgroundColor: '#f59e0b', color: '#000', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 500, fontSize: 13, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} />
              <span>{warningMessage}</span>
            </div>
            <button onClick={() => setWarningDismissed(true)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Top Navbar */}
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#ececec', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            {activeProject && activeChatId ? (
              <button
                onClick={() => { setActiveChatId(null); setMessages([]); }}
                style={{ background: 'none', border: 'none', color: '#b4b4b4', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500 }}
              >
                <ChevronLeft size={18} /> {activeProject.name}
              </button>
            ) : (
              <>ChatGPT <span style={{ fontSize: 12, color: '#b4b4b4' }}>▼</span></>
            )}
          </div>
        </div>

        {/* Projects View */}
        {showProjects ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '40px 60px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#ececec', margin: 0 }}>Projets</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#2f2f2f', borderRadius: 999, padding: '8px 16px', border: '1px solid #444' }}>
                  <Search size={14} color="#b4b4b4" />
                  <input
                    type="text"
                    placeholder="Rechercher des projets"
                    value={projectSearch}
                    onChange={e => setProjectSearch(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#ececec', outline: 'none', fontSize: 14, width: 180 }}
                  />
                </div>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  style={{ padding: '8px 20px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Nouveau
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #333', paddingBottom: 0 }}>
              {[{ key: 'all', label: 'Tous' }, { key: 'mine', label: 'Créés par vous' }, { key: 'shared', label: 'Partagés avec vous' }].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setProjectsTab(tab.key)}
                  style={{
                    padding: '8px 16px', background: 'none', border: 'none',
                    color: projectsTab === tab.key ? '#ececec' : '#b4b4b4',
                    fontSize: 14, cursor: 'pointer', fontWeight: projectsTab === tab.key ? 600 : 400,
                    borderBottom: projectsTab === tab.key ? '2px solid #ececec' : '2px solid transparent',
                    marginBottom: -1
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table */}
            {projectsLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, color: '#b4b4b4' }}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px', padding: '8px 16px', color: '#b4b4b4', fontSize: 13, fontWeight: 500, borderBottom: '1px solid #333', marginBottom: 4 }}>
                  <span>Nom</span>
                  <span>Modifié</span>
                  <span></span>
                </div>
                {projects
                  .filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase()))
                  .map(project => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px', padding: '12px 16px', borderRadius: 8, alignItems: 'center', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2f2f2f'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, backgroundColor: '#444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Folder size={16} color="#ececec" />
                      </div>
                      {editingProject === project.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            value={editingProjectName}
                            onChange={e => setEditingProjectName(e.target.value)}
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveProjectRename(project.id); if (e.key === 'Escape') setEditingProject(null); }}
                            style={{ background: '#1c1c1c', border: '1px solid #444', color: '#fff', padding: '4px 8px', borderRadius: 4, outline: 'none', fontSize: 14 }}
                          />
                          <button onClick={() => handleSaveProjectRename(project.id)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: 0 }}><Check size={16} /></button>
                          <button onClick={() => setEditingProject(null)} style={{ background: 'none', border: 'none', color: '#b4b4b4', cursor: 'pointer', padding: 0 }}><X size={16} /></button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 14, color: '#ececec', fontWeight: 500 }}>{project.name}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: '#b4b4b4' }}>
                      {new Date(project.updated_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                    </span>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingProject(project.id); setEditingProjectName(project.name); }}
                        style={{ background: 'none', border: 'none', color: '#b4b4b4', cursor: 'pointer', padding: 4, borderRadius: 4 }}
                        title="Renommer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, borderRadius: 4 }}
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {projects.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase())).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#b4b4b4' }}>
                    <Folder size={40} style={{ marginBottom: 16, opacity: 0.4 }} />
                    <div style={{ fontSize: 16, marginBottom: 8 }}>Aucun projet trouvé</div>
                    <div style={{ fontSize: 13 }}>Créez votre premier projet en cliquant sur "Nouveau"</div>
                  </div>
                )}
              </>
            )}

            {/* New Project Modal */}
            {showNewProjectModal && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: '#2f2f2f', borderRadius: 16, padding: 32, width: 420, border: '1px solid #444', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                  <h2 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 600 }}>Nouveau projet</h2>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, color: '#b4b4b4', marginBottom: 8 }}>Nom du projet *</label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      placeholder="Mon projet"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
                      style={{ width: '100%', backgroundColor: '#1c1c1c', border: '1px solid #444', color: '#fff', padding: '10px 12px', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 13, color: '#b4b4b4', marginBottom: 8 }}>Description (optionnel)</label>
                    <textarea
                      value={newProjectDesc}
                      onChange={e => setNewProjectDesc(e.target.value)}
                      placeholder="Description du projet..."
                      rows={3}
                      style={{ width: '100%', backgroundColor: '#1c1c1c', border: '1px solid #444', color: '#fff', padding: '10px 12px', borderRadius: 8, outline: 'none', fontSize: 14, resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowNewProjectModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #444', color: '#ececec', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                      Annuler
                    </button>
                    <button onClick={handleCreateProject} disabled={!newProjectName.trim()} style={{ padding: '10px 20px', backgroundColor: newProjectName.trim() ? '#fff' : '#555', color: newProjectName.trim() ? '#000' : '#888', border: 'none', borderRadius: 8, cursor: newProjectName.trim() ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 600 }}>
                      Créer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Project Details View */}
        {!showProjects && activeProject && !activeChatId ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: '40px 60px' }}>
            <div style={{ width: '100%', maxWidth: 720 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <Folder size={32} color="#ececec" />
                <h1 style={{ fontSize: 28, fontWeight: 700, color: '#ececec', margin: 0 }}>{activeProject.name}</h1>
              </div>

              <form onSubmit={handleCreateProjectChat} style={{ backgroundColor: '#2f2f2f', borderRadius: 24, padding: '12px 16px', display: 'flex', gap: 12, border: '1px solid #444', alignItems: 'center', marginBottom: 24 }}>
                <Plus size={20} color="#b4b4b4" style={{ cursor: 'pointer' }} />
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={`Nouveau chat dans ${activeProject.name}`}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, outline: 'none' }}
                  disabled={botState !== 'idle'}
                />
                <button type="button" style={{ background: 'transparent', border: 'none', color: '#b4b4b4', cursor: 'pointer', display: 'flex', padding: 6 }}>
                  <Mic size={20} />
                </button>
                <button type="submit" disabled={!inputValue.trim() || botState !== 'idle'} style={{ background: botState !== 'idle' || !inputValue.trim() ? '#666' : '#fff', border: 'none', color: '#000', cursor: botState !== 'idle' || !inputValue.trim() ? 'not-allowed' : 'pointer', display: 'flex', padding: 6, borderRadius: '50%' }}>
                  <AudioLines size={18} strokeWidth={2.5} />
                </button>
              </form>

              <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #333', marginBottom: 24 }}>
                <button style={{ padding: '8px 0', background: 'none', border: 'none', color: '#ececec', fontSize: 14, fontWeight: 600, borderBottom: '2px solid #ececec', cursor: 'pointer' }}>Chats</button>
                <button style={{ padding: '8px 0', background: 'none', border: 'none', color: '#b4b4b4', fontSize: 14, cursor: 'pointer' }}>Sources</button>
              </div>

              {projectChatsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40, color: '#b4b4b4' }}>
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              ) : projectChats.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {projectChats.map(chat => (
                    <div key={chat.id} onClick={() => handleSelectChat(chat.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #333', cursor: 'pointer' }}>
                      <span style={{ fontSize: 15, color: '#ececec', fontWeight: 500 }}>{chat.title}</span>
                      <span style={{ fontSize: 13, color: '#b4b4b4' }}>{new Date(chat.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#b4b4b4', textAlign: 'center', padding: '40px 0' }}>Aucun chat dans ce projet.</div>
              )}
            </div>
          </div>
        ) : null}

        {/* Dynamic Chat Area */}
        {!showProjects && (activeChatId || !activeProject) ? (
          messages.length === 0 && !activeChatId ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
            <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 40 }}>Où commence-t-on ?</h2>
            <div style={{ width: '100%', maxWidth: 720 }}>
              <div style={{ position: 'relative' }}>
                <form onSubmit={handleSubmit} style={{ backgroundColor: activeMode === 'default' || activeMode === 'write' ? '#2f2f2f' : '#2f2f2f', borderRadius: 24, padding: '12px 16px', display: 'flex', flexDirection: activeMode === 'default' || activeMode === 'write' ? 'row' : 'column', gap: 12, border: '1px solid #444', flexWrap: 'wrap', alignItems: activeMode === 'default' || activeMode === 'write' ? 'center' : 'stretch' }}>
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

                  {/* Input Row for Default & Write modes */}
                  {(activeMode === 'default' || activeMode === 'write') && (
                    <>
                      {activeMode === 'write' ? (
                        <button type="button" onClick={() => setActiveMode('default')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: '#2f425c', color: '#93c5fd', border: 'none', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                          <X size={14} /> Écrire
                        </button>
                      ) : (
                        <button type="button" onClick={handleAttachClick} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex' }}><Plus size={20} /></button>
                      )}
                      
                      {isRecording ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 12, overflow: 'hidden' }}>
                          <div style={{ color: '#555', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', fontSize: 20, letterSpacing: 2, userSelect: 'none' }}>
                            ........................................................................
                          </div>
                          <button type="button" onClick={handleCancelRecord} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 8 }}>
                            <X size={20} />
                          </button>
                          <button type="button" onClick={handleSendRecord} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 8 }}>
                            <Check size={20} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <input 
                            type="text" 
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder={activeMode === 'write' ? "Écrire n'importe quoi" : "Demander n'importe quoi"}
                            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, outline: 'none' }}
                            disabled={botState !== 'idle'}
                          />
                          {inputValue.trim() || attachedFiles.length > 0 ? (
                            <button type="submit" disabled={botState !== 'idle'} style={{ background: botState !== 'idle' ? '#666' : '#fff', border: 'none', color: '#000', cursor: botState !== 'idle' ? 'not-allowed' : 'pointer', display: 'flex', padding: 6, borderRadius: '50%' }}>
                              <ArrowUp size={16} strokeWidth={3} />
                            </button>
                          ) : (
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <button type="button" onClick={handleMicClick} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 6 }}>
                                <Mic size={20} />
                              </button>
                              <button type="button" style={{ background: '#fff', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: '50%' }}>
                                <AudioLines size={18} strokeWidth={2.5} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Input Layout for Image & Search modes */}
                  {(activeMode === 'image' || activeMode === 'search') && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                          <input 
                            type="text" 
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder={activeMode === 'search' ? "Rechercher sur le web" : "Décrire ou modifier une image"}
                            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, outline: 'none', minHeight: '40px' }}
                            disabled={botState !== 'idle'}
                          />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button type="button" onClick={handleAttachClick} style={{ background: 'transparent', border: '1px solid #444', borderRadius: '50%', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 6, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}><Plus size={16} /></button>
                            
                            {activeMode === 'image' && (
                              <>
                                <button type="button" onClick={() => { setActiveMode('default'); setShowAspectRatioMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: '#2f425c', color: '#93c5fd', border: 'none', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                                  <X size={14} /> Image
                                </button>
                                <div style={{ position: 'relative' }}>
                                  <button type="button" onClick={() => setShowAspectRatioMenu(!showAspectRatioMenu)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: '#444', border: 'none', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                                    <Monitor size={14} /> {aspectRatio} <ChevronDown size={14} />
                                  </button>
                                  {showAspectRatioMenu && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, backgroundColor: '#2f2f2f', border: '1px solid #444', borderRadius: 12, padding: '8px 0', zIndex: 50, width: 220, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                                       <div style={{ padding: '8px 16px', fontSize: 12, color: '#b4b4b4', fontWeight: 600 }}>Choisir le format de l'image</div>
                                       {[
                                         { label: 'Auto', value: 'Auto', icon: <Monitor size={14}/> },
                                         { label: 'Carré 1:1', value: 'Square 1:1', icon: <div style={{width: 14, height: 14, border: '1px solid #ececec', borderRadius: 2}}></div> },
                                         { label: 'Portrait 3:4', value: 'Portrait 3:4', icon: <div style={{width: 10, height: 14, border: '1px solid #ececec', borderRadius: 2}}></div> },
                                         { label: 'Story 9:16', value: 'Story 9:16', icon: <div style={{width: 8, height: 14, border: '1px solid #ececec', borderRadius: 2}}></div> },
                                         { label: 'Paysage 4:3', value: 'Landscape 4:3', icon: <div style={{width: 14, height: 10, border: '1px solid #ececec', borderRadius: 2}}></div> },
                                         { label: 'Écran large 16:9', value: 'Widescreen 16:9', icon: <div style={{width: 14, height: 8, border: '1px solid #ececec', borderRadius: 2}}></div> }
                                       ].map(opt => (
                                         <div key={opt.value} onClick={() => { setAspectRatio(opt.value); setShowAspectRatioMenu(false); }} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontSize: 14, color: '#ececec', backgroundColor: aspectRatio === opt.value ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                                           {opt.icon} <span style={{flex: 1}}>{opt.label}</span> {aspectRatio === opt.value && <Check size={14} />}
                                         </div>
                                       ))}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                            
                            {activeMode === 'search' && (
                              <button type="button" onClick={() => setActiveMode('default')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: '#1e3a8a', color: '#60a5fa', border: 'none', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                                <X size={14} /> <Globe size={14} /> Rechercher
                              </button>
                            )}

                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {isRecording ? (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 12, overflow: 'hidden' }}>
                                  <div style={{ color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: 20, letterSpacing: 2, userSelect: 'none' }}>
                                    ........................
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
                                <button type="button" onClick={handleMicClick} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 6 }}>
                                  <Mic size={20} />
                                </button>
                                {inputValue.trim() || attachedFiles.length > 0 ? (
                                  <button type="submit" disabled={botState !== 'idle'} style={{ background: botState !== 'idle' ? '#666' : '#fff', border: 'none', color: '#000', cursor: botState !== 'idle' ? 'not-allowed' : 'pointer', display: 'flex', padding: 8, borderRadius: '50%' }}>
                                    <ArrowUp size={16} strokeWidth={3} />
                                  </button>
                                ) : (
                                  <button type="button" style={{ background: '#fff', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: '50%' }}>
                                    <AudioLines size={18} strokeWidth={2.5} />
                                  </button>
                                )}
                              </>
                            )}
                         </div>
                      </div>
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
              
              {/* Context Menus below input */}
              {activeMode === 'default' && (
                <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setActiveMode('image')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <ImageIcon size={14} /> Créer une image
                  </button>
                  <button type="button" onClick={() => setActiveMode('write')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <Edit3 size={14} /> Écrire ou modifier
                  </button>
                  <button type="button" onClick={() => setActiveMode('search')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <Globe size={14} /> Rechercher quelque chose
                  </button>
                </div>
              )}

              {activeMode === 'image' && (
                <div style={{ marginTop: 32, userSelect: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#ececec' }}>Explorer des idées</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 13, color: '#b4b4b4', cursor: 'pointer', borderBottom: '1px dashed #b4b4b4' }}>Nouveautés</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', backgroundColor: '#2f2f2f', color: '#ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={16}/></button>
                        <button type="button" style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', backgroundColor: '#2f2f2f', color: '#ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={16}/></button>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    <div style={{ minWidth: 160, height: 200, backgroundColor: '#2f2f2f', borderRadius: 16, display: 'flex', flexDirection: 'column', padding: 16, cursor: 'pointer', position: 'relative' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={24} color="#ececec" />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#ececec' }}>Importer une photo</div>
                    </div>
                    <div style={{ minWidth: 160, height: 200, borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to bottom right, #facc15, #ea580c)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Améliorer votre espace</div>
                    </div>
                    <div style={{ minWidth: 160, height: 200, borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to bottom right, #38bdf8, #3b82f6)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Envie de voyager</div>
                    </div>
                    <div style={{ minWidth: 160, height: 200, borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to bottom right, #10b981, #047857)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Gribouillage</div>
                    </div>
                  </div>
                </div>
              )}

              {activeMode === 'write' && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div onClick={() => setInputValue("Rendre un message persuasif ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', backgroundColor: '#2f2f2f', fontSize: 14 }}>
                    <Edit3 size={16} color="#b4b4b4" /> Rendre un message persuasif
                  </div>
                  <div onClick={() => setInputValue("Améliorer la clarté ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <Edit3 size={16} color="#b4b4b4" /> Améliorer la clarté
                  </div>
                  <div onClick={() => setInputValue("Améliorer la fluidité ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <Edit3 size={16} color="#b4b4b4" /> Améliorer la fluidité
                  </div>
                  <div onClick={() => setInputValue("Raccourcir sans perdre le sens ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <Edit3 size={16} color="#b4b4b4" /> Raccourcir sans perdre le sens
                  </div>
                </div>
              )}

              {activeMode === 'search' && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div onClick={() => setInputValue("Clint Eastwood ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <TrendingUp size={16} color="#b4b4b4" /> Clint Eastwood
                  </div>
                  <div onClick={() => setInputValue("California Governor Race 2026 ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <TrendingUp size={16} color="#b4b4b4" /> California Governor Race 2026
                  </div>
                  <div onClick={() => setInputValue("Scott Pelley ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <TrendingUp size={16} color="#b4b4b4" /> Scott Pelley
                  </div>
                  <div onClick={() => setInputValue("Spencer Pratt ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <TrendingUp size={16} color="#b4b4b4" /> Spencer Pratt
                  </div>
                </div>
              )}

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
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    )}
                  </div>
                  
                  {/* Bot Message Actions */}
                  {msg.role === 'assistant' && botState === 'idle' && index === messages.length - 1 && (
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
        )
        ) : null}
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

      {showLogoutConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: 32, borderRadius: 16, width: 380, textAlign: 'center', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Déconnexion</h2>
            <p style={{ color: '#a3a3a3', fontSize: 14, marginBottom: 24 }}>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Annuler</button>
              <button onClick={() => { setShowLogoutConfirm(false); onLogout(); }} style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Oui, déconnecter</button>
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
