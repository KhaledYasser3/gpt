import re

file_path = 'e:/gpt/gpt/frontend/src/components/User/Chat.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_state_str = '''
        {/* Dynamic Chat Area */}
        {messages.length === 0 ? (
          !isImageMode ? (
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
                  <button type="button" onClick={() => setIsImageMode(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <ImageIcon size={14} /> Créer une image
                  </button>
                  <button type="button" onClick={() => setInputValue("Écrire ou modifier... ")} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <Edit3 size={14} /> Écrire ou modifier
                  </button>
                  <button type="button" onClick={() => setInputValue("Rechercher quelque chose sur... ")} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <Globe size={14} /> Rechercher quelque chose
                  </button>
                </div>
              </div>
            </div>
          ) : (
'''

pattern = r"\{\/\* Dynamic Chat Area \*\/\}\s*\{messages\.length === 0 \? \(\s*<div style=\{\{ flex: 1"
replacement = old_state_str.strip() + "\n            <div style={{ flex: 1"

new_content = re.sub(pattern, replacement, content, count=1)

pattern2 = r"(\s*</div>\s*</div>\s*)\) : \(\s*<div style=\{\{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: '24px' \}\}>"
replacement2 = r"\g<1>  )\n        ) : (\n          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: '24px' }}>"

new_content = re.sub(pattern2, replacement2, new_content, count=1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Success')
