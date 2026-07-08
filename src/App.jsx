import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://dgsgugorolenijuqkajq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnc2d1Z29yb2xlbmlqdXFrYWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyOTUyMTAsImV4cCI6MjA5Nzg3MTIxMH0.DqPez8m-c637a2B6T8UhROk9Qec-7Fz4jezzs22nZXY'
)

function Logo() {
  return (
    <svg width="160" height="53" viewBox="0 0 480 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B4DB"/>
          <stop offset="50%" stopColor="#3A7BFF"/>
          <stop offset="100%" stopColor="#7B4DFF"/>
        </linearGradient>
      </defs>
      <path d="M80 10 L10 62 L10 140 Q10 148 18 148 L48 148 L48 112 Q48 104 56 104 L104 104 Q112 104 112 112 L112 148 L142 148 Q150 148 150 140 L150 62 Z"
        fill="none" stroke="url(#grad)" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M80 132 C80 132 58 116 58 100 C58 91 65 85 73 85 C77 85 80 88 80 88 C80 88 83 85 87 85 C95 85 102 91 102 100 C102 116 80 132 80 132 Z" fill="url(#grad)"/>
      <text x="175" y="95" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="64" fill="#0D1328">homli</text>
      <text x="178" y="130" fontFamily="Poppins, sans-serif" fontWeight="300" fontSize="18" fill="#6B7280" letterSpacing="1">Byt bolig. Skab minder.</text>
    </svg>
  )
}

function Nav({ setPage, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <nav style={styles.nav}>
        <div style={{ cursor:'pointer' }} onClick={() => setPage('home')}><Logo/></div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => setPage('search')}>Søg boliger</button>
          {user ? (
            <>
              <button style={styles.navLink} onClick={() => setPage('messages')}>Beskeder</button>
              <button style={styles.navLink} onClick={() => setPage('profile')}>Min profil</button>
              <button style={styles.navCta} onClick={onLogout}>Log ud</button>
            </>
          ) : (
            <>
              <button style={styles.navLink} onClick={() => setPage('login')}>Log ind</button>
              <button style={styles.navCta} onClick={() => setPage('login')}>Kom i gang</button>
            </>
          )}
        </div>
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
        </button>
      </nav>
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <button style={styles.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
          {[['home','Forside'],['search','Søg boliger'],['messages','Beskeder'],['profile','Min profil']].map(([p,l]) => (
            <button key={p} style={styles.mobileMenuLink} onClick={() => { setPage(p); setMenuOpen(false) }}>{l}</button>
          ))}
          {user
            ? <button style={styles.mobileMenuCta} onClick={() => { onLogout(); setMenuOpen(false) }}>Log ud</button>
            : <button style={styles.mobileMenuCta} onClick={() => { setPage('login'); setMenuOpen(false) }}>Log ind</button>
          }
        </div>
      )}
    </>
  )
}

function HomePage({ setPage }) {
  const [email, setEmail] = useState('')
  const [waitlistMsg, setWaitlistMsg] = useState('')

  async function joinWaitlist() {
    if (!email || !email.includes('@')) { setWaitlistMsg('Skriv en gyldig email'); return }
    const { error } = await supabase.from('waitlist').insert({ email })
    if (error?.code === '23505') setWaitlistMsg('Du er allerede tilmeldt!')
    else if (error) setWaitlistMsg('Noget gik galt')
    else setWaitlistMsg('Tak! Vi giver dig besked når vi åbner. 🏡')
  }

  return (
    <div>
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.eyebrow}><span style={styles.eyebrowDot}></span>Boligbytte uden besvær</div>
          <h1 style={styles.h1}>Dit hjem er <em style={styles.h1Em}>dit</em> rejsebudget</h1>
          <p style={styles.heroSub}>Byt bolig med familier der vil derhen, du vil hjem fra. Ingen penge. Ingen mellemled. Bare tillid og god timing.</p>
          <div style={styles.heroActions}>
            <button style={styles.btnPrimary} onClick={() => setPage('login')}>Opret din bolig — det er gratis</button>
            <button style={styles.btnGhost} onClick={() => setPage('search')}>Se boliger →</button>
          </div>
          <div style={styles.trustRow}>
            {[['100%','Gratis at bytte'],['0 kr.','Ingen gebyrer'],['ID ✓','Verificerede']].map(([num,lbl]) => (
              <div key={lbl} style={styles.trustStat}>
                <div style={styles.trustNum}>{num}</div>
                <div style={styles.trustLbl}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardImg}></div>
            <div style={{ padding:'16px' }}>
              <div style={styles.cardCity}>Hellerup, København</div>
              <div style={styles.cardName}>Lys villa med have og terrasse</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={styles.cardPill}>1–14 jul.</span>
                <span style={{ color:'#F59E0B' }}>★★★★★</span>
              </div>
            </div>
          </div>
          <div style={styles.verifiedPill}><div style={styles.verifiedDot}></div>ID-verificeret bruger</div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Sådan virker det</div>
        <h2 style={styles.h2}>Fra sofa til Barcelona i fire trin</h2>
        <div style={styles.stepsGrid}>
          {[
            ['01','Opret din bolig','Tilføj billeder og datoer. Gratis og tager under 10 minutter.'],
            ['02','Søg på datoer','Find boliger der er ledige præcis når du vil rejse.'],
            ['03','Skriv sammen','Send en forespørgsel og koordiner direkte i chatten.'],
            ['04','Byt og rejs','Anmeld hinanden efter byttet og opbyg din troværdighed.'],
          ].map(([num,title,desc]) => (
            <div key={num} style={styles.step}>
              <div style={styles.stepNum}>{num}</div>
              <h3 style={styles.stepTitle}>{title}</h3>
              <p style={styles.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.section, background:'#F8F9FF' }}>
        <div style={styles.sectionLabel}>Priser</div>
        <h2 style={styles.h2}>Byt gratis. Betal kun for mere.</h2>
        <div style={styles.pricingGrid}>
          <div style={styles.priceCard}>
            <div style={styles.priceBadgeFree}>Gratis</div>
            <div style={styles.priceName}>Basis</div>
            <div style={styles.priceAmount}>0 kr.</div>
            <div style={styles.pricePeriod}>for altid</div>
            <hr style={styles.priceDivider}/>
            {['En bolig med op til 5 billeder','Søg på datoer og område','Op til 3 aktive samtaler','Anmeldelser efter bytte','Push-notifikationer'].map(f => (
              <div key={f} style={styles.priceFeature}><span style={styles.checkmark}>✓</span>{f}</div>
            ))}
            <button style={styles.btnOutline} onClick={() => setPage('login')}>Kom i gang gratis</button>
          </div>
          <div style={{ ...styles.priceCard, background:'#1B2A5E', border:'none' }}>
            <div style={styles.priceBadgePlus}>Mest populær</div>
            <div style={{ ...styles.priceName, color:'#fff' }}>Plus</div>
            <div style={{ ...styles.priceAmount, color:'#fff' }}>79 kr.</div>
            <div style={{ ...styles.pricePeriod, color:'rgba(255,255,255,0.5)' }}>per måned · eller 599 kr./år</div>
            <hr style={{ ...styles.priceDivider, background:'rgba(255,255,255,0.15)' }}/>
            {['Alt i Basis','Ubegrænsede samtaler','Op til 3 boliger','Op til 15 billeder per bolig','Avancerede filtre','Se hvem der har kigget'].map(f => (
              <div key={f} style={{ ...styles.priceFeature, color:'rgba(255,255,255,0.85)' }}><span style={{ ...styles.checkmark, color:'#4ECDC4' }}>✓</span>{f}</div>
            ))}
            <button style={styles.btnWhite} onClick={() => setPage('login')}>Prøv Plus</button>
          </div>
          <div style={styles.priceCard}>
            <div style={styles.priceBadgeOnce}>Livstidsadgang</div>
            <div style={styles.priceName}>Livstid</div>
            <div style={styles.priceAmount}>999 kr.</div>
            <div style={styles.pricePeriod}>betal én gang, brug for altid</div>
            <hr style={styles.priceDivider}/>
            {['Alt i Plus for evigt','Op til 3 boliger','Op til 15 billeder','Fremhævet i søgeresultater','Ingen løbende betaling'].map(f => (
              <div key={f} style={styles.priceFeature}><span style={styles.checkmark}>✓</span>{f}</div>
            ))}
            <button style={styles.btnOutline} onClick={() => setPage('login')}>Køb livstidsadgang</button>
          </div>
        </div>
      </div>

      <div style={styles.waitlist}>
        <h2 style={{ ...styles.h2, color:'#fff', marginBottom:'12px' }}>Klar til at bytte?</h2>
        <p style={{ color:'rgba(255,255,255,0.65)', marginBottom:'32px', fontSize:'16px' }}>Skriv dig op og vær blandt de første til at prøve Homli.</p>
        <div style={styles.waitlistForm}>
          <input style={styles.waitlistInput} type="email" placeholder="din@email.dk" value={email} onChange={e => setEmail(e.target.value)}/>
          <button style={styles.waitlistBtn} onClick={joinWaitlist}>Skriv mig op</button>
        </div>
        {waitlistMsg && <p style={{ color:'#4ECDC4', marginTop:'12px', fontSize:'14px' }}>{waitlistMsg}</p>}
      </div>
    </div>
  )
}

function LoginPage({ setPage, setUser }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email:'', password:'', password2:'', firstName:'', lastName:'' })
  const [msg, setMsg] = useState({ text:'', ok:false })
  const [loading, setLoading] = useState(false)

  function update(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function login() {
    if (!form.email || !form.password) { setMsg({ text:'Udfyld email og adgangskode', ok:false }); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(false)
    if (error) setMsg({ text:'Forkert email eller adgangskode', ok:false })
    else { setUser(data.user); setPage('profile') }
  }

  async function signup() {
    if (!form.firstName || !form.lastName || !form.email || !form.password) { setMsg({ text:'Udfyld alle felter', ok:false }); return }
    if (form.password !== form.password2) { setMsg({ text:'Adgangskoderne matcher ikke', ok:false }); return }
    if (form.password.length < 6) { setMsg({ text:'Adgangskoden skal være mindst 6 tegn', ok:false }); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { first_name: form.firstName, last_name: form.lastName } }
    })
    setLoading(false)
    if (error) setMsg({ text: error.message, ok:false })
    else { setMsg({ text:'Konto oprettet! Du sendes videre...', ok:true }); setUser(data.user); setTimeout(() => setPage('create-property'), 1500) }
  }

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginLeft}>
        <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:'42px', color:'#fff', lineHeight:1.1, marginBottom:'20px' }}>
          Verden venter.<br/>Dit hjem er<br/><em>billetten.</em>
        </h2>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'16px', lineHeight:1.7 }}>Opret en gratis konto og byt bolig med familier over hele Danmark.</p>
      </div>
      <div style={styles.loginRight}>
        <div style={styles.formBox}>
          <div style={styles.formTabs}>
            <div style={{ ...styles.formTab, ...(tab==='login' ? styles.formTabActive : {}) }} onClick={() => setTab('login')}>Log ind</div>
            <div style={{ ...styles.formTab, ...(tab==='signup' ? styles.formTabActive : {}) }} onClick={() => setTab('signup')}>Opret konto</div>
          </div>
          {msg.text && <div style={{ ...styles.msgBox, background: msg.ok ? '#EEF0FB' : '#FEF0F0', color: msg.ok ? '#1B2A5E' : '#EF4444' }}>{msg.text}</div>}
          {tab === 'login' ? (
            <>
              <h1 style={styles.formTitle}>Velkommen tilbage</h1>
              <p style={styles.formSub}>Log ind for at se dine bytter og beskeder</p>
              <div style={styles.field}><label style={styles.label}>Email</label><input style={styles.input} type="email" placeholder="din@email.dk" value={form.email} onChange={e => update('email', e.target.value)}/></div>
              <div style={styles.field}><label style={styles.label}>Adgangskode</label><input style={styles.input} type="password" placeholder="Adgangskode" value={form.password} onChange={e => update('password', e.target.value)} onKeyDown={e => e.key==='Enter' && login()}/></div>
              <button style={styles.btnPrimary} onClick={login} disabled={loading}>{loading ? 'Logger ind...' : 'Log ind'}</button>
              <p style={{ textAlign:'center', fontSize:'13px', color:'#6B7280', marginTop:'20px' }}>Ny bruger? <span style={{ color:'#1B2A5E', cursor:'pointer', fontWeight:500 }} onClick={() => setTab('signup')}>Opret gratis konto</span></p>
            </>
          ) : (
            <>
              <h1 style={styles.formTitle}>Opret konto</h1>
              <p style={styles.formSub}>Gratis — ingen kreditkort kræves</p>
              <div style={styles.fieldRow}>
                <div style={styles.field}><label style={styles.label}>Fornavn</label><input style={styles.input} placeholder="Magnus" value={form.firstName} onChange={e => update('firstName', e.target.value)}/></div>
                <div style={styles.field}><label style={styles.label}>Efternavn</label><input style={styles.input} placeholder="Jensen" value={form.lastName} onChange={e => update('lastName', e.target.value)}/></div>
              </div>
              <div style={styles.field}><label style={styles.label}>Email</label><input style={styles.input} type="email" placeholder="din@email.dk" value={form.email} onChange={e => update('email', e.target.value)}/></div>
              <div style={styles.field}><label style={styles.label}>Adgangskode</label><input style={styles.input} type="password" placeholder="Mindst 6 tegn" value={form.password} onChange={e => update('password', e.target.value)}/></div>
              <div style={styles.field}><label style={styles.label}>Gentag adgangskode</label><input style={styles.input} type="password" placeholder="Gentag" value={form.password2} onChange={e => update('password2', e.target.value)}/></div>
              <button style={styles.btnPrimary} onClick={signup} disabled={loading}>{loading ? 'Opretter...' : 'Opret konto — det er gratis'}</button>
              <p style={{ textAlign:'center', fontSize:'13px', color:'#6B7280', marginTop:'20px' }}>Har du allerede en konto? <span style={{ color:'#1B2A5E', cursor:'pointer', fontWeight:500 }} onClick={() => setTab('login')}>Log ind</span></p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SearchPage({ setPage, setSelectedProperty }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const colors = ['linear-gradient(135deg,#4ECDC4,#3A7BFF)','linear-gradient(135deg,#3A7BFF,#7B4DFF)','linear-gradient(135deg,#7B4DFF,#4ECDC4)','linear-gradient(135deg,#00B4DB,#4ECDC4)','linear-gradient(135deg,#6B7FD7,#3A7BFF)','linear-gradient(135deg,#9B59B6,#7B4DFF)']
  const typeLabels = { house:'Villa / Hus', apartment:'Lejlighed', cottage:'Sommerhus', townhouse:'Rækkehus' }

  useEffect(() => { fetchProperties('') }, [])

  async function fetchProperties(searchTerm) {
    setLoading(true)
    let query = supabase.from('properties').select('*').eq('is_active', true)
    if (searchTerm) query = query.or(`city.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`)
    const { data } = await query.order('created_at', { ascending: false })
    setProperties(data || [])
    setLoading(false)
  }

  return (
    <div style={{ padding:'32px 48px' }}>
      <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
        <input style={{ ...styles.input, flex:1, minWidth:'200px' }} placeholder="By, område eller land..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && fetchProperties(search)}/>
        <button style={styles.btnPrimary} onClick={() => fetchProperties(search)}>Søg</button>
      </div>
      {loading ? (
        <div style={{ textAlign:'center', padding:'48px', color:'#6B7280' }}>Henter boliger...</div>
      ) : properties.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🏠</div>
          <div style={{ fontSize:'16px', color:'#6B7280', marginBottom:'24px' }}>Ingen boliger fundet</div>
          <button style={{ ...styles.btnPrimary, maxWidth:'240px' }} onClick={() => fetchProperties('')}>Vis alle boliger</button>
        </div>
      ) : (
        <>
          <p style={{ fontSize:'14px', color:'#6B7280', marginBottom:'20px' }}>{properties.length} {properties.length === 1 ? 'bolig' : 'boliger'} fundet</p>
          <div style={styles.searchGrid}>
            {properties.map((p, i) => (
              <div key={p.id} style={styles.propCard} onClick={() => { setSelectedProperty(p); setPage('property') }}>
                <div style={{ height:'180px', background: colors[i % colors.length], borderRadius:'12px 12px 0 0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div style={{ padding:'14px 16px' }}>
                  <div style={styles.cardCity}>{p.city}</div>
                  <div style={styles.cardName}>{p.title}</div>
                  <div style={{ fontSize:'12px', color:'#6B7280', marginBottom:'10px' }}>{typeLabels[p.type] || p.type} · {p.bedrooms} sov. {p.sqm ? `· ${p.sqm} m²` : ''}</div>
                  <span style={styles.cardPill}>
                    {p.available_from ? new Date(p.available_from).toLocaleDateString('da-DK', { day:'numeric', month:'short' }) : 'Fleksibelt'}
                    {p.available_to ? ` – ${new Date(p.available_to).toLocaleDateString('da-DK', { day:'numeric', month:'short' })}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function PropertyPage({ setPage, property, user }) {
  const typeLabels = { house:'Villa / Hus', apartment:'Lejlighed', cottage:'Sommerhus', townhouse:'Rækkehus' }

  if (!property) return (
    <div style={{ textAlign:'center', padding:'80px' }}>
      <p style={{ color:'#6B7280', marginBottom:'24px' }}>Ingen bolig valgt</p>
      <button style={styles.btnPrimary} onClick={() => setPage('search')}>Gå til søgning</button>
    </div>
  )

  return (
    <div style={{ padding:'40px 48px' }}>
      <button style={styles.btnGhost} onClick={() => setPage('search')}>← Tilbage til søgning</button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'48px', marginTop:'24px', alignItems:'start' }}>
        <div>
          <div style={{ height:'320px', background:'linear-gradient(135deg,#4ECDC4,#3A7BFF)', borderRadius:'16px', marginBottom:'24px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h1 style={{ fontFamily:'DM Serif Display, serif', fontSize:'32px', marginBottom:'8px', color:'#111827' }}>{property.title}</h1>
          <p style={{ color:'#6B7280', fontSize:'14px', marginBottom:'16px' }}>
            {property.city} · {typeLabels[property.type] || property.type} · {property.bedrooms} sov. {property.sqm ? `· ${property.sqm} m²` : ''}
          </p>
          {property.description && (
            <p style={{ fontSize:'15px', lineHeight:1.75, color:'#374151', marginBottom:'32px' }}>{property.description}</p>
          )}
          <div style={{ fontSize:'14px', color:'#6B7280' }}>
            <strong style={{ color:'#111827' }}>Tilgængelig: </strong>
            {property.available_from ? new Date(property.available_from).toLocaleDateString('da-DK', { day:'numeric', month:'long' }) : 'Ikke angivet'}
            {property.available_to ? ` – ${new Date(property.available_to).toLocaleDateString('da-DK', { day:'numeric', month:'long' })}` : ''}
          </div>
        </div>
        <div style={{ background:'#fff', border:'1.5px solid #E5E7EB', borderRadius:'20px', padding:'28px', position:'sticky', top:'90px' }}>
          <h3 style={{ fontFamily:'DM Serif Display, serif', fontSize:'22px', marginBottom:'16px', color:'#111827' }}>Send bytteforespørgsel</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'16px' }}>
            <input style={styles.input} type="date"/>
            <input style={styles.input} type="date"/>
          </div>
          <button style={{ ...styles.btnPrimary, width:'100%', marginBottom:'10px' }} onClick={() => setPage('messages')}>Send bytteforespørgsel</button>
          <button style={{ ...styles.btnOutline, width:'100%' }} onClick={() => setPage('messages')}>Skriv en besked først</button>
          <p style={{ fontSize:'11px', color:'#9CA3AF', textAlign:'center', marginTop:'12px' }}>Ingen betaling involveret.</p>
        </div>
      </div>
    </div>
  )
}

function MessagesPage() {
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState([
    { mine:false, text:'Hej! Vi er super interesserede i jeres bolig i juli', time:'10:14' },
    { mine:true, text:'Hej! Det lyder spændende. Hvilke datoer tænker I?', time:'10:22' },
    { mine:false, text:'Vi tænker 1.–14. juli. Vi er en familie med to børn.', time:'10:31' },
    { mine:true, text:'Super! Har I kæledyr?', time:'10:45' },
    { mine:false, text:'Ingen kæledyr. Vi har byttet to gange før med 5 stjerner.', time:'10:52' },
  ])

  function send() {
    if (!msg.trim()) return
    setMessages(m => [...m, { mine:true, text:msg, time:'Nu' }])
    setMsg('')
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', height:'calc(100vh - 77px)' }}>
      <div style={{ borderRight:'1px solid #E5E7EB', background:'#fff', overflowY:'auto' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #E5E7EB', fontWeight:500, fontSize:'16px', color:'#111827' }}>Beskeder</div>
        {[['MH','Mette og Henrik','Hellerup → Aarhus',true],['TN','Thomas og Nina','Aarhus → Amsterdam',false]].map(([init,name,sub,active]) => (
          <div key={name} style={{ display:'flex', gap:'10px', padding:'14px 16px', borderBottom:'1px solid #E5E7EB', background: active ? '#EEF0FB' : '#fff', cursor:'pointer' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'13px', fontWeight:500, flexShrink:0 }}>{init}</div>
            <div><div style={{ fontSize:'14px', fontWeight:500, color:'#111827' }}>{name}</div><div style={{ fontSize:'12px', color:'#6B7280' }}>{sub}</div></div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:500 }}>MH</div>
          <div><div style={{ fontWeight:500, color:'#111827' }}>Mette og Henrik</div><div style={{ fontSize:'12px', color:'#6B7280' }}>Hellerup · Verificeret</div></div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent: m.mine ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth:'70%', padding:'10px 14px', borderRadius: m.mine ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: m.mine ? '#1B2A5E' : '#F3F4F6', color: m.mine ? '#fff' : '#111827', fontSize:'14px', lineHeight:1.55 }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid #E5E7EB', display:'flex', gap:'12px' }}>
          <input style={{ ...styles.input, flex:1 }} placeholder="Skriv en besked..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}/>
          <button style={styles.btnPrimary} onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}

function ProfilePage({ user, setPage, onLogout, setEditProperty }) {
  const [tab, setTab] = useState('properties')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const name = user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : user?.email || 'Bruger'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
  const gradients = ['linear-gradient(135deg,#4ECDC4,#3A7BFF)','linear-gradient(135deg,#3A7BFF,#7B4DFF)','linear-gradient(135deg,#7B4DFF,#4ECDC4)']
  const typeLabels = { house:'Villa / Hus', apartment:'Lejlighed', cottage:'Sommerhus', townhouse:'Rækkehus' }

  useEffect(() => {
    if (!user) return
    supabase.from('properties').select('*').eq('owner_id', user.id).order('created_at', { ascending:false })
      .then(({ data }) => { setProperties(data || []); setLoading(false) })
  }, [user])

  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'40px 24px' }}>
      <div style={{ background:'#fff', borderRadius:'20px', padding:'36px', marginBottom:'24px', border:'1px solid #E5E7EB', display:'flex', gap:'24px', alignItems:'flex-start', flexWrap:'wrap' }}>
        <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:600, color:'#fff', flexShrink:0 }}>{initials}</div>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:'DM Serif Display, serif', fontSize:'28px', marginBottom:'8px', color:'#111827' }}>{name}</h1>
          <div style={{ fontSize:'13px', color:'#6B7280', marginBottom:'12px' }}>Gratis konto · Medlem siden 2025</div>
          <div style={{ display:'flex', gap:'24px' }}>
            {[['0','Bytter'],[properties.length,'Boliger'],['0','Anmeldelser']].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily:'DM Serif Display, serif', fontSize:'24px', color:'#111827' }}>{n}</div>
                <div style={{ fontSize:'11px', color:'#9CA3AF' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <button style={styles.btnOutline} onClick={onLogout}>Log ud</button>
      </div>

      <div style={{ display:'flex', borderBottom:'1px solid #E5E7EB', marginBottom:'24px' }}>
        {[['properties','Mine boliger'],['swaps','Bytter'],['account','Konto']].map(([id,label]) => (
          <div key={id} style={{ padding:'14px 20px', cursor:'pointer', fontSize:'14px', fontWeight:500, color: tab===id ? '#1B2A5E' : '#6B7280', borderBottom: tab===id ? '2px solid #1B2A5E' : '2px solid transparent' }} onClick={() => setTab(id)}>{label}</div>
        ))}
      </div>

      {tab === 'properties' && (
        loading ? <div style={{ textAlign:'center', padding:'48px', color:'#6B7280' }}>Henter boliger...</div>
        : properties.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🏠</div>
            <div style={{ fontSize:'16px', marginBottom:'24px', color:'#6B7280' }}>Du har ingen boliger endnu</div>
            <button style={styles.btnPrimary} onClick={() => { setEditProperty(null); setPage('create-property') }}>Tilføj din første bolig</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'20px' }}>
            {properties.map((p, i) => (
              <div key={p.id} style={{ background:'#fff', borderRadius:'16px', overflow:'hidden', border:'1px solid #E5E7EB' }}>
                <div style={{ height:'140px', background: gradients[i % gradients.length], display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em', color:'#6B7280', marginBottom:'3px' }}>{p.city}</div>
                  <div style={{ fontFamily:'DM Serif Display, serif', fontSize:'16px', color:'#111827', marginBottom:'6px' }}>{p.title}</div>
                  <div style={{ fontSize:'12px', color:'#6B7280', marginBottom:'10px' }}>{typeLabels[p.type] || p.type} · {p.bedrooms} sov. {p.sqm ? `· ${p.sqm} m²` : ''}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'11px', background:'#EEF0FB', color:'#1B2A5E', padding:'3px 10px', borderRadius:'100px', fontWeight:500 }}>Aktiv</span>
                    <button style={{ background:'none', border:'none', fontSize:'12px', color:'#6B7280', cursor:'pointer' }} onClick={() => { setEditProperty(p); setPage('create-property') }}>Rediger →</button>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ background:'#fff', borderRadius:'16px', border:'2px dashed #E5E7EB', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', padding:'40px', cursor:'pointer', minHeight:'220px' }}
              onClick={() => { setEditProperty(null); setPage('create-property') }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span style={{ fontSize:'14px', color:'#6B7280' }}>Tilføj endnu en bolig</span>
            </div>
          </div>
        )
      )}

      {tab === 'swaps' && (
        <div style={{ textAlign:'center', padding:'48px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🔄</div>
          <div style={{ fontSize:'16px', color:'#6B7280' }}>Ingen bytter endnu</div>
          <button style={{ ...styles.btnPrimary, marginTop:'24px', maxWidth:'240px' }} onClick={() => setPage('search')}>Søg boliger</button>
        </div>
      )}

      {tab === 'account' && (
        <div style={{ background:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid #E5E7EB' }}>
          <h3 style={{ fontSize:'15px', fontWeight:500, marginBottom:'16px', color:'#111827' }}>Kontooplysninger</h3>
          {[['Email', user?.email || ''],['Plan','Gratis'],['Konto oprettet','2025']].map(([label,value]) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #F3F4F6', fontSize:'14px' }}>
              <span style={{ color:'#374151' }}>{label}</span>
              <span style={{ color:'#6B7280' }}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CreatePropertyPage({ setPage, user, editProperty }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    type: editProperty?.type || 'house',
    title: editProperty?.title || '',
    city: editProperty?.city || '',
    description: editProperty?.description || '',
    bedrooms: editProperty?.bedrooms || 3,
    sqm: editProperty?.sqm || '',
    from: editProperty?.available_from || '',
    to: editProperty?.available_to || '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const isEditing = !!editProperty

  function update(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    if (!form.title || !form.city) { setMsg('Udfyld titel og by'); return }
    setSaving(true)
    const data = {
      title: form.title, city: form.city, type: form.type,
      description: form.description, bedrooms: parseInt(form.bedrooms),
      sqm: parseInt(form.sqm) || null,
      available_from: form.from || null,
      available_to: form.to || null,
    }
    const { error } = isEditing
      ? await supabase.from('properties').update(data).eq('id', editProperty.id)
      : await supabase.from('properties').insert({ ...data, owner_id: user.id })
    setSaving(false)
    if (error) setMsg('Noget gik galt: ' + error.message)
    else setStep(4)
  }

  return (
    <div style={{ maxWidth:'760px', margin:'0 auto', padding:'40px 24px 96px' }}>
      <div style={{ display:'flex', gap:'8px', marginBottom:'40px', alignItems:'center' }}>
        {[1,2,3].map(n => (
          <div key={n} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', background: n < step ? '#1B2A5E' : n === step ? '#3A7BFF' : '#E5E7EB', color: n <= step ? '#fff' : '#9CA3AF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:500 }}>{n < step ? '✓' : n}</div>
            <span style={{ fontSize:'12px', color: n <= step ? '#111827' : '#9CA3AF' }}>{['Din bolig','Tilgængelighed','Færdig'][n-1]}</span>
            {n < 3 && <div style={{ width:'32px', height:'1px', background:'#E5E7EB', margin:'0 4px' }}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div style={{ background:'#fff', borderRadius:'20px', padding:'36px', border:'1px solid #E5E7EB', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:'24px', marginBottom:'24px', color:'#111827' }}>{isEditing ? 'Rediger din bolig' : 'Om din bolig'}</h2>
            {msg && <div style={{ padding:'12px 16px', borderRadius:'10px', background:'#FEF0F0', color:'#EF4444', marginBottom:'16px', fontSize:'13px' }}>{msg}</div>}
            <div style={styles.field}><label style={styles.label}>Boligtype</label>
              <select style={styles.input} value={form.type} onChange={e => update('type', e.target.value)}>
                <option value="house">Villa / Hus</option><option value="apartment">Lejlighed</option>
                <option value="cottage">Sommerhus</option><option value="townhouse">Rækkehus</option>
              </select>
            </div>
            <div style={styles.field}><label style={styles.label}>Titel</label><input style={styles.input} placeholder="Fx: Lys villa med have" value={form.title} onChange={e => update('title', e.target.value)}/></div>
            <div style={styles.field}><label style={styles.label}>By</label><input style={styles.input} placeholder="Fx: Hellerup" value={form.city} onChange={e => update('city', e.target.value)}/></div>
            <div style={styles.fieldRow}>
              <div style={styles.field}><label style={styles.label}>Soveværelser</label>
                <select style={styles.input} value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)}>{[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}</select>
              </div>
              <div style={styles.field}><label style={styles.label}>Kvadratmeter</label><input style={styles.input} type="number" placeholder="130" value={form.sqm} onChange={e => update('sqm', e.target.value)}/></div>
            </div>
            <div style={styles.field}><label style={styles.label}>Beskrivelse</label><textarea style={{ ...styles.input, minHeight:'100px', resize:'vertical' }} placeholder="Beskriv din bolig..." value={form.description} onChange={e => update('description', e.target.value)}/></div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <button style={styles.btnOutline} onClick={() => setPage('profile')}>Annuller</button>
            <button style={styles.btnPrimary} onClick={() => { if(!form.title||!form.city){setMsg('Udfyld titel og by');return}; setMsg(''); setStep(2) }}>Næste →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ background:'#fff', borderRadius:'20px', padding:'36px', border:'1px solid #E5E7EB', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:'24px', marginBottom:'8px', color:'#111827' }}>Hvornår vil du bytte?</h2>
            <p style={{ color:'#374151', fontSize:'14px', marginBottom:'24px' }}>Din bolig vises kun i søgninger der matcher dine datoer.</p>
            <div style={styles.fieldRow}>
              <div style={styles.field}><label style={styles.label}>Fra dato</label><input style={styles.input} type="date" value={form.from} onChange={e => update('from', e.target.value)}/></div>
              <div style={styles.field}><label style={styles.label}>Til dato</label><input style={styles.input} type="date" value={form.to} onChange={e => update('to', e.target.value)}/></div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <button style={styles.btnOutline} onClick={() => setStep(1)}>← Tilbage</button>
            <button style={styles.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Gemmer...' : isEditing ? 'Gem ændringer ✓' : 'Gem bolig ✓'}</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ textAlign:'center', padding:'48px' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'#EEF0FB', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:'36px' }}>✓</div>
          <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:'36px', marginBottom:'12px', color:'#111827' }}>{isEditing ? 'Ændringer gemt!' : 'Din bolig er oprettet!'}</h2>
          <p style={{ color:'#6B7280', fontSize:'16px', marginBottom:'36px' }}>{isEditing ? 'Din bolig er opdateret.' : 'Din bolig er nu synlig for andre Homli-brugere.'}</p>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
            <button style={styles.btnPrimary} onClick={() => setPage('profile')}>Se min profil</button>
            <button style={styles.btnOutline} onClick={() => setPage('search')}>Søg boliger</button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 48px', background:'#fff', borderBottom:'1px solid #E5E7EB', position:'sticky', top:0, zIndex:100 },
  navLinks: { display:'flex', alignItems:'center', gap:'20px' },
  navLink: { background:'none', border:'none', fontSize:'14px', color:'#6B7280', cursor:'pointer', fontFamily:'Inter, sans-serif' },
  navCta: { background:'linear-gradient(135deg,#4ECDC4,#3A7BFF,#7B4DFF)', color:'#fff', border:'none', borderRadius:'100px', padding:'10px 20px', fontSize:'14px', fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif' },
  hamburger: { display:'none', flexDirection:'column', gap:'5px', cursor:'pointer', padding:'8px', background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', borderRadius:'8px', border:'none' },
  hamburgerLine: { display:'block', width:'22px', height:'2px', background:'#fff', borderRadius:'2px' },
  mobileMenu: { position:'fixed', inset:0, background:'#fff', zIndex:999, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'32px' },
  closeBtn: { position:'absolute', top:'24px', right:'24px', fontSize:'28px', cursor:'pointer', background:'none', border:'none', color:'#111827' },
  mobileMenuLink: { fontFamily:'DM Serif Display, serif', fontSize:'32px', color:'#111827', background:'none', border:'none', cursor:'pointer' },
  mobileMenuCta: { background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', color:'#fff', border:'none', borderRadius:'100px', padding:'14px 36px', fontSize:'20px', fontWeight:500, cursor:'pointer' },
  hero: { display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100vh - 77px)', alignItems:'stretch' },
  heroLeft: { padding:'72px 56px 72px 48px', display:'flex', flexDirection:'column', justifyContent:'center', background:'#fff' },
  heroRight: { background:'#1B2A5E', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', padding:'40px' },
  eyebrow: { display:'inline-flex', alignItems:'center', gap:'8px', fontSize:'11px', fontWeight:500, letterSpacing:'0.1em', color:'#1B2A5E', textTransform:'uppercase', marginBottom:'24px' },
  eyebrowDot: { width:'7px', height:'7px', borderRadius:'50%', background:'#3A7BFF', display:'inline-block' },
  h1: { fontFamily:'DM Serif Display, serif', fontSize:'52px', lineHeight:1.06, letterSpacing:'-0.02em', color:'#000', marginBottom:'24px' },
  h1Em: { fontStyle:'italic', color:'#1B2A5E' },
  heroSub: { fontSize:'16px', lineHeight:1.7, color:'#374151', maxWidth:'400px', marginBottom:'40px' },
  heroActions: { display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' },
  trustRow: { display:'flex', alignItems:'center', gap:'28px', marginTop:'52px', paddingTop:'28px', borderTop:'1px solid #E5E7EB' },
  trustStat: {},
  trustNum: { fontFamily:'DM Serif Display, serif', fontSize:'26px', color:'#111827' },
  trustLbl: { fontSize:'11px', color:'#6B7280', marginTop:'2px' },
  heroCard: { background:'#fff', borderRadius:'20px', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', width:'280px' },
  heroCardImg: { height:'160px', background:'linear-gradient(135deg,#4ECDC4,#3A7BFF)', width:'100%' },
  verifiedPill: { position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)', background:'#fff', borderRadius:'100px', padding:'10px 18px', display:'flex', alignItems:'center', gap:'8px', boxShadow:'0 4px 20px rgba(0,0,0,0.2)', whiteSpace:'nowrap', fontSize:'12px', fontWeight:500 },
  verifiedDot: { width:'8px', height:'8px', borderRadius:'50%', background:'#4ECDC4' },
  section: { padding:'80px 48px' },
  sectionLabel: { fontSize:'11px', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'#3A7BFF', marginBottom:'16px' },
  h2: { fontFamily:'DM Serif Display, serif', fontSize:'38px', lineHeight:1.1, letterSpacing:'-0.02em', color:'#111827', marginBottom:'40px' },
  stepsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'32px' },
  step: { padding:'24px', background:'#fff', borderRadius:'16px', border:'1px solid #E5E7EB' },
  stepNum: { fontFamily:'DM Serif Display, serif', fontSize:'40px', color:'#EEF0FB', marginBottom:'12px' },
  stepTitle: { fontFamily:'DM Serif Display, serif', fontSize:'18px', color:'#111827', marginBottom:'8px' },
  stepDesc: { fontSize:'14px', lineHeight:1.65, color:'#6B7280' },
  pricingGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' },
  priceCard: { borderRadius:'24px', padding:'36px', border:'1px solid #E5E7EB', background:'#fff' },
  priceBadgeFree: { display:'inline-block', fontSize:'11px', fontWeight:500, padding:'4px 12px', borderRadius:'100px', background:'#EEF0FB', color:'#1B2A5E', marginBottom:'20px' },
  priceBadgePlus: { display:'inline-block', fontSize:'11px', fontWeight:500, padding:'4px 12px', borderRadius:'100px', background:'rgba(255,255,255,0.15)', color:'#fff', marginBottom:'20px' },
  priceBadgeOnce: { display:'inline-block', fontSize:'11px', fontWeight:500, padding:'4px 12px', borderRadius:'100px', background:'#FEF3E2', color:'#7A4A0A', marginBottom:'20px' },
  priceName: { fontFamily:'DM Serif Display, serif', fontSize:'26px', color:'#111827', marginBottom:'8px' },
  priceAmount: { fontSize:'40px', fontWeight:500, color:'#111827', lineHeight:1, marginBottom:'4px' },
  pricePeriod: { fontSize:'13px', color:'#6B7280', marginBottom:'24px' },
  priceDivider: { border:'none', height:'1px', background:'#E5E7EB', margin:'0 0 24px' },
  priceFeature: { display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px', color:'#374151', marginBottom:'12px' },
  checkmark: { color:'#3A7BFF', fontWeight:700, flexShrink:0 },
  waitlist: { background:'#1B2A5E', padding:'80px 48px', textAlign:'center' },
  waitlistForm: { display:'flex', gap:'12px', maxWidth:'440px', margin:'0 auto', flexWrap:'wrap' },
  waitlistInput: { flex:1, padding:'15px 20px', borderRadius:'100px', border:'none', fontSize:'15px', color:'#111827', outline:'none', minWidth:'200px' },
  waitlistBtn: { background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', color:'#fff', padding:'15px 28px', borderRadius:'100px', fontSize:'15px', fontWeight:500, border:'none', cursor:'pointer' },
  loginPage: { display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100vh - 77px)' },
  loginLeft: { background:'#1B2A5E', display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px' },
  loginRight: { display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'60px 48px' },
  formBox: { width:'100%', maxWidth:'400px' },
  formTabs: { display:'flex', background:'#F3F4F6', borderRadius:'12px', padding:'4px', marginBottom:'32px' },
  formTab: { flex:1, padding:'10px', textAlign:'center', fontSize:'14px', fontWeight:500, color:'#6B7280', borderRadius:'9px', cursor:'pointer' },
  formTabActive: { background:'#fff', color:'#111827', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  msgBox: { padding:'12px 16px', borderRadius:'10px', fontSize:'13px', marginBottom:'16px', textAlign:'center' },
  formTitle: { fontFamily:'DM Serif Display, serif', fontSize:'32px', color:'#111827', marginBottom:'8px' },
  formSub: { fontSize:'14px', color:'#6B7280', marginBottom:'28px' },
  field: { marginBottom:'16px' },
  fieldRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
  label: { display:'block', fontSize:'13px', fontWeight:500, color:'#374151', marginBottom:'6px' },
  input: { width:'100%', padding:'13px 16px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'15px', color:'#111827', background:'#fff', outline:'none', fontFamily:'Inter, sans-serif', boxSizing:'border-box' },
  btnPrimary: { background:'linear-gradient(135deg,#4ECDC4,#3A7BFF,#7B4DFF)', color:'#fff', border:'none', borderRadius:'100px', padding:'14px 28px', fontSize:'15px', fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif', width:'100%' },
  btnOutline: { background:'none', border:'2px solid #1B2A5E', color:'#1B2A5E', borderRadius:'100px', padding:'13px 28px', fontSize:'14px', fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif', width:'100%' },
  btnGhost: { background:'none', border:'none', color:'#6B7280', fontSize:'14px', cursor:'pointer', fontFamily:'Inter, sans-serif', padding:0 },
  btnWhite: { background:'#fff', color:'#1B2A5E', border:'none', borderRadius:'100px', padding:'14px 28px', fontSize:'15px', fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif', width:'100%' },
  searchGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' },
  propCard: { background:'#fff', borderRadius:'16px', overflow:'hidden', border:'1px solid #E5E7EB', cursor:'pointer' },
  cardCity: { fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em', color:'#6B7280', marginBottom:'3px' },
  cardName: { fontFamily:'DM Serif Display, serif', fontSize:'17px', color:'#111827', marginBottom:'6px' },
  cardPill: { fontSize:'11px', background:'#EEF0FB', color:'#1B2A5E', padding:'3px 10px', borderRadius:'100px', fontWeight:500 },
}

export default function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [editProperty, setEditProperty] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function logout() { await supabase.auth.signOut(); setUser(null); setPage('home') }

  useEffect(() => {
    if (!user && ['profile','messages','create-property'].includes(page)) setPage('login')
  }, [page, user])

  return (
    <div style={{ fontFamily:'Inter, sans-serif', background:'#F8F9FF', minHeight:'100vh' }}>
      <Nav setPage={setPage} user={user} onLogout={logout}/>
      {page === 'home' && <HomePage setPage={setPage}/>}
      {page === 'login' && <LoginPage setPage={setPage} setUser={setUser}/>}
      {page === 'search' && <SearchPage setPage={setPage} setSelectedProperty={setSelectedProperty}/>}
      {page === 'property' && <PropertyPage setPage={setPage} property={selectedProperty} user={user}/>}
      {page === 'messages' && <MessagesPage/>}
      {page === 'profile' && <ProfilePage user={user} setPage={setPage} onLogout={logout} setEditProperty={setEditProperty}/>}
      {page === 'create-property' && <CreatePropertyPage setPage={setPage} user={user} editProperty={editProperty}/>}
    </div>
  )
}
