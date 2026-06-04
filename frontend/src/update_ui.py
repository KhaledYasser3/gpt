import re

file_path = 'e:/gpt/gpt/frontend/src/components/User/Chat.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add TrendingUp import
content = content.replace("Headphones, Monitor } from 'lucide-react';", "Headphones, Monitor, TrendingUp } from 'lucide-react';")

# Change state
content = content.replace("const [isImageMode, setIsImageMode] = useState(false);", "const [activeMode, setActiveMode] = useState('default');")

old_state_str = '''        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
            <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 40 }}>What's on the agenda today?</h2>
            <div style={{ width: '100%', maxWidth: 720 }}>
              <div style={{ position: 'relative' }}>
                <form onSubmit={handleSubmit} style={{ backgroundColor: activeMode === 'default' || activeMode === 'write' ? 'var(--user-input-bg)' : '#2f2f2f', borderRadius: 24, padding: '12px 16px', display: 'flex', flexDirection: activeMode === 'default' || activeMode === 'write' ? 'row' : 'column', gap: 12, border: '1px solid #444', flexWrap: 'wrap', alignItems: activeMode === 'default' || activeMode === 'write' ? 'center' : 'stretch' }}>
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
                          <X size={14} /> Write
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
                            placeholder={activeMode === 'write' ? "Write anything" : "Ask anything"}
                            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, outline: 'none' }}
                            disabled={botState !== 'idle'}
                          />
                          {inputValue.trim() || attachedFiles.length > 0 ? (
                            <button type="submit" disabled={botState !== 'idle'} style={{ background: botState !== 'idle' ? '#666' : '#fff', border: 'none', color: '#000', cursor: botState !== 'idle' ? 'not-allowed' : 'pointer', display: 'flex', padding: 6, borderRadius: '50%' }}>
                              <ArrowUp size={16} strokeWidth={3} />
                            </button>
                          ) : (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button type="button" onClick={handleMicClick} style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex', padding: 6 }}>
                                <Mic size={20} />
                              </button>
                              <button type="button" style={{ background: '#fff', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: '50%' }}>
                                <Headphones size={16} />
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
                            placeholder={activeMode === 'search' ? "Search the web" : "Describe or edit an image"}
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
                                       <div style={{ padding: '8px 16px', fontSize: 12, color: '#b4b4b4', fontWeight: 600 }}>Choose image aspect ratio</div>
                                       {[
                                         { label: 'Auto', value: 'Auto', icon: <Monitor size={14}/> },
                                         { label: 'Square 1:1', value: 'Square 1:1', icon: <div style={{width: 14, height: 14, border: '1px solid #ececec', borderRadius: 2}}></div> },
                                         { label: 'Portrait 3:4', value: 'Portrait 3:4', icon: <div style={{width: 10, height: 14, border: '1px solid #ececec', borderRadius: 2}}></div> },
                                         { label: 'Story 9:16', value: 'Story 9:16', icon: <div style={{width: 8, height: 14, border: '1px solid #ececec', borderRadius: 2}}></div> },
                                         { label: 'Landscape 4:3', value: 'Landscape 4:3', icon: <div style={{width: 14, height: 10, border: '1px solid #ececec', borderRadius: 2}}></div> },
                                         { label: 'Widescreen 16:9', value: 'Widescreen 16:9', icon: <div style={{width: 14, height: 8, border: '1px solid #ececec', borderRadius: 2}}></div> }
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
                                <X size={14} /> <Globe size={14} /> Search
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
                                  <button type="button" style={{ background: '#fff', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', padding: 8, borderRadius: '50%' }}>
                                    <Headphones size={16} />
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
                  <button type="button" onClick={() => setActiveMode('image')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <ImageIcon size={14} /> Create an image
                  </button>
                  <button type="button" onClick={() => setActiveMode('write')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <Edit3 size={14} /> Write or edit
                  </button>
                  <button type="button" onClick={() => setActiveMode('search')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                    <Globe size={14} /> Look something up
                  </button>
                </div>
              )}

              {activeMode === 'image' && (
                <div style={{ marginTop: 32, userSelect: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#ececec' }}>Explore ideas</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 13, color: '#b4b4b4', cursor: 'pointer', borderBottom: '1px dashed #b4b4b4' }}>What's new</span>
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
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#ececec' }}>Upload a photo</div>
                    </div>
                    <div style={{ minWidth: 160, height: 200, borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to bottom right, #facc15, #ea580c)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Improve Your Desk Setup</div>
                    </div>
                    <div style={{ minWidth: 160, height: 200, borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to bottom right, #38bdf8, #3b82f6)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Wanderlust</div>
                    </div>
                    <div style={{ minWidth: 160, height: 200, borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to bottom right, #10b981, #047857)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Scribble</div>
                    </div>
                  </div>
                </div>
              )}

              {activeMode === 'write' && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div onClick={() => setInputValue("Make a message persuasive ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', backgroundColor: '#2f2f2f', fontSize: 14 }}>
                    <Edit3 size={16} color="#b4b4b4" /> Make a message persuasive
                  </div>
                  <div onClick={() => setInputValue("Improve clarity ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <Edit3 size={16} color="#b4b4b4" /> Improve clarity
                  </div>
                  <div onClick={() => setInputValue("Improve flow ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <Edit3 size={16} color="#b4b4b4" /> Improve flow
                  </div>
                  <div onClick={() => setInputValue("Shorten without losing meaning ")} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, color: '#ececec', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}>
                    <Edit3 size={16} color="#b4b4b4" /> Shorten without losing meaning
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
        ) : ('''

pattern = r"\{messages\.length === 0 \? \(\s*!isImageMode \? \(\s*<div style=\{\{ flex: 1.*?\) : \(\s*<div style=\{\{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: '24px' \}\}>"
new_content = re.sub(pattern, old_state_str + r"\n          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: '24px' }}>", content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Success')
