import React, { useState } from 'react';
import { Send, CornerDownLeft, Copy, Check, MessageSquare, Plus, Globe } from 'lucide-react';

export default function Chat({ isRtl }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      time: 'AM 10:42',
      text: 'Implementing Role-Based Access Control (RBAC) with the Nexus API requires a structured approach to permission mapping. Below is a concise example of how to handle token verification and scope checking.',
      code: {
        title: 'auth-middleware.js',
        content: `const nexusAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = await Nexus.verify(token);
    
    if (user.role !== 'enterprise_admin') {
      return res.status(403).json({ error: "Access Denied" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send('Invalid Token');
  }
};`
      },
      textAfter: 'This middleware ensures that only users with the enterprise_admin role can proceed to the protected routes. Would you like me to expand on the database schema for these roles?'
    },
    {
      sender: 'user',
      time: 'AM 10:46',
      text: 'Yes, please provide the SQL schema for the permissions and roles tables.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const trans = {
    placeholder: isRtl ? 'اكتب رسالة إلى نيكسس...' : 'Type a message to SaaS Nexus...',
    disclaimer: isRtl 
      ? 'يمكن لـ نيكسس ارتكاب الأخطاء. تحقق من المعلومات الهامة.' 
      : 'SaaS Nexus can make mistakes. Check important info.',
    copy: isRtl ? 'نسخ' : 'Copy',
    copiedText: isRtl ? 'تم النسخ!' : 'Copied!',
    newChat: isRtl ? 'محادثة جديدة' : 'New Chat',
    historyTitle: isRtl ? 'المحادثات السابقة' : 'RECENT HISTORY'
  };

  const mockHistory = [
    { title: '...e System Architecture', active: true },
    { title: '...cription Logic Review', active: false },
    { title: 'User Role Mapping', active: false },
    { title: 'API Integration Docs', active: false }
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const userMsg = {
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate reply
    setTimeout(() => {
      const assistantMsg = {
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: isRtl 
          ? 'بالتأكيد، إليك نموذج تصميم جداول الصلاحيات والأدوار لقاعدة بيانات Postgres:'
          : 'Certainly, here is the SQL schema for the roles and permissions tables in PostgreSQL:',
        code: {
          title: 'schema.sql',
          content: `CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE role_permissions (
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);`
        },
        textAfter: isRtl
          ? 'يمكنك ربط هذا المخطط مباشرة مع موديلات SQLAlchemy التي قمنا بإنشائها مسبقاً.'
          : 'You can directly integrate this schema with the SQLAlchemy models we defined in the backend.'
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1200);
  };

  return (
    <div style={{ ...styles.chatContainer, direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Dynamic LTR/RTL Side-by-Side View */}
      <div style={{ ...styles.workspaceRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        
        {/* Chat History Sidebar */}
        <div style={{
          ...styles.chatSidebar,
          borderRight: isRtl ? 'none' : '1px solid rgba(255,255,255,0.06)',
          borderLeft: isRtl ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}>
          <button style={styles.newChatBtn}>
            <Plus size={16} />
            {trans.newChat}
          </button>
          
          <span style={styles.historyHeading}>{trans.historyTitle}</span>
          
          <div style={styles.historyList}>
            {mockHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.historyItem,
                  ...(item.active ? styles.historyItemActive : {}),
                  flexDirection: isRtl ? 'row-reverse' : 'row'
                }}
              >
                <MessageSquare size={14} style={isRtl ? { marginLeft: '8px' } : { marginRight: '8px' }} />
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Screen */}
        <div style={styles.chatArea}>
          <div style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageWrapper,
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  textAlign: msg.sender === 'user' ? (isRtl ? 'left' : 'right') : (isRtl ? 'right' : 'left')
                }}
              >
                {/* Meta details */}
                <div style={{ ...styles.msgMeta, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <span style={styles.msgSender}>{msg.sender === 'user' ? (isRtl ? 'أنت' : 'You') : 'SaaS Nexus'}</span>
                  <span style={styles.msgTime}>{msg.time}</span>
                </div>

                {/* Message Body */}
                <div style={{
                  ...styles.msgBody,
                  background: msg.sender === 'user' ? 'rgba(255,255,255,0.04)' : 'transparent',
                  border: msg.sender === 'user' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderRadius: msg.sender === 'user' ? '12px' : '0'
                }}>
                  <p style={styles.msgText}>{msg.text}</p>
                  
                  {msg.code && (
                    <div style={styles.codeBlockCard}>
                      <div style={{ ...styles.codeBlockHeader, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                        <span style={styles.codeTitle}>{msg.code.title}</span>
                        <button onClick={() => handleCopy(msg.code.content)} style={styles.copyBtn}>
                          {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                          <span>{copied ? trans.copiedText : trans.copy}</span>
                        </button>
                      </div>
                      <pre style={styles.codePre}>
                        <code>{msg.code.content}</code>
                      </pre>
                    </div>
                  )}

                  {msg.textAfter && <p style={{ ...styles.msgText, marginTop: '12px' }}>{msg.textAfter}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Bar */}
          <form onSubmit={handleSend} style={styles.chatBarContainer}>
            <div style={{
              ...styles.inputWrapper,
              flexDirection: isRtl ? 'row-reverse' : 'row'
            }}>
              <input
                type="text"
                placeholder={trans.placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  ...styles.chatInput,
                  textAlign: isRtl ? 'right' : 'left'
                }}
              />
              <button type="submit" style={styles.sendIconBtn}>
                <Send size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
              </button>
            </div>
            <p style={styles.disclaimerText}>{trans.disclaimer}</p>
          </form>
        </div>

      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#0B0F19',
    height: '100%',
  },
  workspaceRow: {
    display: 'flex',
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  chatSidebar: {
    width: '240px',
    background: 'rgba(255,255,255,0.01)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 16px',
    gap: '16px',
    flexShrink: 0,
  },
  newChatBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
  },
  historyHeading: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#9CA3AF',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  historyItemActive: {
    background: 'rgba(255,255,255,0.04)',
    color: '#FFFFFF',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px',
    height: '100%',
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBottom: '20px',
    paddingRight: '8px',
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '800px',
    alignSelf: 'center',
  },
  msgMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  msgSender: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  msgTime: {
    fontSize: '11px',
    color: '#4B5563',
  },
  msgBody: {
    padding: '12px 16px',
    width: '100%',
  },
  msgText: {
    fontSize: '15px',
    color: '#D1D5DB',
    lineHeight: '1.6',
    whiteSpace: 'pre-line',
  },
  codeBlockCard: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    marginTop: '16px',
    overflow: 'hidden',
  },
  codeBlockHeader: {
    background: 'rgba(255,255,255,0.02)',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  codeTitle: {
    fontSize: '12px',
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: 'none',
    color: '#6B7280',
    fontSize: '11px',
    cursor: 'pointer',
  },
  codePre: {
    padding: '16px',
    margin: 0,
    overflowX: 'auto',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#34D399',
    lineHeight: '1.5',
    textAlign: 'left',
    direction: 'ltr',
  },
  chatBarContainer: {
    width: '100%',
    maxWidth: '800px',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '12px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '8px 16px',
    gap: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  chatInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    padding: '10px 0',
  },
  sendIconBtn: {
    width: '36px',
    height: '36px',
    background: '#000000',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  disclaimerText: {
    fontSize: '11px',
    color: '#4B5563',
    textAlign: 'center',
  }
};
