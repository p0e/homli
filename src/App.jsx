import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://dgsgugorolenijuqkajq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnc2d1Z29yb2xlbmlqdXFrYWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyOTUyMTAsImV4cCI6MjA5Nzg3MTIxMH0.DqPez8m-c637a2B6T8UhROk9Qec-7Fz4jezzs22nZXY'
)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function Logo({ small }) {
  return (
    <svg width={small ? 120 : 160} height={small ? 40 : 53} viewBox="0 0 480 160" fill="none">
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
  const isMobile = useIsMobile()
  return (
    <>
      <nav style={s.nav}>
        <div style={{ cursor:'pointer', display:'flex', alignItems:'center' }} onClick={() => { setPage('home'); setMenuOpen(false) }}>
          <Logo small/>
        </div>
        <div style={{ ...s.navLinks, display: isMobile ? 'none' : 'flex' }}>
          <button style={s.navLink} onClick={() => setPage('search')}>Søg boliger</button>
          {user ? (
            <>
              <button style={s.navLink} onClick={() => setPage('messages')}>Beskeder</button>
              <button style={s.navLink} onClick={() => setPage('profile')}>Min profil</button>
              <button style={s.navCta} onClick={onLogout}>Log ud</button>
            </>
          ) : (
            <>
              <button style={s.navLink} onClick={() => setPage('login')}>Log ind</button>
              <button style={s.navCta} onClick={() => setPage('login')}>Kom i gang</button>
            </>
          )}
        </div>
        <button style={{ ...s.hamburger, display: isMobile ? 'flex' : 'none' }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={{ ...s.hLine, transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }}></span>
          <span style={{ ...s.hLine, opacity: menuOpen ? 0 : 1 }}></span>
          <span style={{ ...s.hLine, transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }}></span>
        </button>
      </nav>
      {menuOpen && (
        <div style={s.mobileMenu}>
          {[['home','🏠 Forside'],['search','🔍 Søg boliger'],['messages','💬 Beskeder'],['profile','👤 Min profil']].map(([p,l]) => (
            <button key={p} style={s.mobileMenuLink} onClick={() => { setPage(p); setMenuOpen(false) }}>{l}</button>
          ))}
          <div style={{ width:'100%', height:'1px', background:'#E5E7EB', margin:'8px 0' }}></div>
          {user
            ? <button style={{ ...s.mobileMenuLink, color:'#EF4444' }} onClick={() => { onLogout(); setMenuOpen(false) }}>Log ud</button>
            : <button style={{ ...s.mobileMenuCta }} onClick={() => { setPage('login'); setMenuOpen(false) }}>Log ind / Opret konto</button>
          }
        </div>
      )}
    </>
  )
}

function HomePage({ setPage }) {
  const isMobile = useIsMobile()
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
      {/* Hero */}
      <div style={{ ...s.hero, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', minHeight: isMobile ? 'auto' : 'calc(100vh - 65px)' }}>
        <div style={{ ...s.heroLeft, padding: isMobile ? '40px 20px' : '60px 48px' }}>
          <div style={s.eyebrow}><span style={s.eyebrowDot}></span>Boligbytte uden besvær</div>
          <h1 style={s.h1}>Dit hjem er <em style={s.h1Em}>dit</em> rejsebudget</h1>
          <p style={s.heroSub}>Byt bolig med familier der vil derhen, du vil hjem fra. Ingen penge. Ingen mellemled.</p>
          <div style={s.heroActions}>
            <button style={s.btnPrimary} onClick={() => setPage('login')}>Opret din bolig gratis</button>
            <button style={s.btnGhost} onClick={() => setPage('search')}>Se boliger →</button>
          </div>
          <div style={s.trustRow}>
            {[['100%','Gratis at bytte'],['0 kr.','Ingen gebyrer'],['ID ✓','Verificerede']].map(([num,lbl]) => (
              <div key={lbl}>
                <div style={s.trustNum}>{num}</div>
                <div style={s.trustLbl}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...s.heroRight, display: isMobile ? 'none' : 'flex' }}>
          <div style={s.heroCard}>
            <div style={{ height:'160px', background:'linear-gradient(135deg,#4ECDC4,#3A7BFF)' }}></div>
            <div style={{ padding:'16px' }}>
              <div style={s.cardCity}>Hellerup, København</div>
              <div style={s.cardName}>Lys villa med have og terrasse</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'8px' }}>
                <span style={s.cardPill}>1–14 jul.</span>
                <span style={{ color:'#F59E0B' }}>★★★★★</span>
              </div>
            </div>
          </div>
          <div style={s.verifiedPill}><div style={s.verifiedDot}></div>ID-verificeret bruger</div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ ...s.section, padding: isMobile ? '48px 20px' : '60px 48px' }}>
        <div style={s.sectionLabel}>Sådan virker det</div>
        <h2 style={s.h2}>Fra sofa til Barcelona i fire trin</h2>
        <div style={{ ...s.stepsGrid, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)' }}>
          {[
            ['01','Opret din bolig','Tilføj billeder og datoer. Gratis og under 10 minutter.'],
            ['02','Søg på datoer','Find boliger ledige præcis når du vil rejse.'],
            ['03','Skriv sammen','Send forespørgsel og koordiner i chatten.'],
            ['04','Byt og rejs','Anmeld hinanden og opbyg troværdighed.'],
          ].map(([num,title,desc]) => (
            <div key={num} style={s.step}>
              <div style={s.stepNum}>{num}</div>
              <h3 style={s.stepTitle}>{title}</h3>
              <p style={s.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ ...s.section, background:'#F0F2FF', padding:'60px 24px' }}>
        <div style={s.sectionLabel}>Priser</div>
        <h2 style={s.h2}>Byt gratis. Betal kun for mere.</h2>
        <div style={{ ...s.pricingGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)' }}>
          {[
            { badge:'Gratis', badgeStyle:{ background:'#EEF0FB', color:'#1B2A5E' }, name:'Basis', amount:'0 kr.', period:'for altid', features:['En bolig med op til 5 billeder','Søg på datoer og område','Op til 3 aktive samtaler','Anmeldelser efter bytte'], btnStyle:s.btnOutline, btnLabel:'Kom i gang gratis' },
            { badge:'Mest populær', badgeStyle:{ background:'rgba(255,255,255,0.2)', color:'#fff' }, name:'Plus', amount:'79 kr.', period:'per måned · eller 599 kr./år', features:['Alt i Basis','Ubegrænsede samtaler','Op til 3 boliger','Op til 15 billeder','Avancerede filtre'], featured:true, btnStyle:s.btnWhite, btnLabel:'Prøv Plus' },
            { badge:'Livstid', badgeStyle:{ background:'#FEF3E2', color:'#7A4A0A' }, name:'Livstid', amount:'999 kr.', period:'betal én gang for altid', features:['Alt i Plus — for evigt','Ingen løbende betaling','Fremhævet i søgning'], btnStyle:s.btnOutline, btnLabel:'Køb livstidsadgang' },
          ].map((plan) => (
            <div key={plan.name} style={{ ...s.priceCard, ...(plan.featured ? { background:'#1B2A5E', border:'none' } : {}) }}>
              <div style={{ ...s.priceBadge, ...plan.badgeStyle }}>{plan.badge}</div>
              <div style={{ ...s.priceName, ...(plan.featured ? { color:'#fff' } : {}) }}>{plan.name}</div>
              <div style={{ ...s.priceAmount, ...(plan.featured ? { color:'#fff' } : {}) }}>{plan.amount}</div>
              <div style={{ ...s.pricePeriod, ...(plan.featured ? { color:'rgba(255,255,255,0.5)' } : {}) }}>{plan.period}</div>
              <hr style={{ ...s.priceDivider, ...(plan.featured ? { background:'rgba(255,255,255,0.15)' } : {}) }}/>
              {plan.features.map(f => (
                <div key={f} style={{ ...s.priceFeature, ...(plan.featured ? { color:'rgba(255,255,255,0.85)' } : {}) }}>
                  <span style={{ ...s.checkmark, ...(plan.featured ? { color:'#4ECDC4' } : {}) }}>✓</span>{f}
                </div>
              ))}
              <button style={{ ...plan.btnStyle, marginTop:'16px' }} onClick={() => setPage('login')}>{plan.btnLabel}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlist */}
      <div style={s.waitlist}>
        <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:'clamp(28px,5vw,42px)', color:'#fff', marginBottom:'12px' }}>Klar til at bytte?</h2>
        <p style={{ color:'rgba(255,255,255,0.65)', marginBottom:'32px', fontSize:'16px' }}>Skriv dig op og vær blandt de første til at prøve Homli.</p>
        <div style={s.waitlistForm}>
          <input style={s.waitlistInput} type="email" placeholder="din@email.dk" value={email} onChange={e => setEmail(e.target.value)}/>
          <button style={s.waitlistBtn} onClick={joinWaitlist}>Skriv mig op</button>
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
    if (form.password.length < 6) { setMsg({ text:'Mindst 6 tegn', ok:false }); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { first_name: form.firstName, last_name: form.lastName } }
    })
    setLoading(false)
    if (error) setMsg({ text: error.message, ok:false })
    else { setMsg({ text:'Konto oprettet!', ok:true }); setUser(data.user); setTimeout(() => setPage('create-property'), 1200) }
  }

  return (
    <div style={{ minHeight:'calc(100vh - 65px)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'32px 20px', background:'#F8F9FF' }}>
      <div style={{ width:'100%', maxWidth:'420px', background:'#fff', borderRadius:'20px', padding:'36px', border:'1px solid #E5E7EB', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={s.formTabs}>
          <div style={{ ...s.formTab, ...(tab==='login' ? s.formTabActive : {}) }} onClick={() => setTab('login')}>Log ind</div>
          <div style={{ ...s.formTab, ...(tab==='signup' ? s.formTabActive : {}) }} onClick={() => setTab('signup')}>Opret konto</div>
        </div>
        {msg.text && <div style={{ padding:'12px', borderRadius:'10px', background: msg.ok ? '#EEF0FB' : '#FEF0F0', color: msg.ok ? '#1B2A5E' : '#EF4444', fontSize:'13px', marginBottom:'16px', textAlign:'center' }}>{msg.text}</div>}
        {tab === 'login' ? (
          <>
            <h1 style={{ fontFamily:'DM Serif Display, serif', fontSize:'28px', marginBottom:'6px' }}>Velkommen tilbage</h1>
            <p style={{ fontSize:'14px', color:'#6B7280', marginBottom:'24px' }}>Log ind for at se dine bytter</p>
            <div style={s.field}><label style={s.label}>Email</label><input style={s.input} type="email" placeholder="din@email.dk" value={form.email} onChange={e => update('email', e.target.value)}/></div>
            <div style={s.field}><label style={s.label}>Adgangskode</label><input style={s.input} type="password" placeholder="Adgangskode" value={form.password} onChange={e => update('password', e.target.value)} onKeyDown={e => e.key==='Enter' && login()}/></div>
            <button style={s.btnPrimary} onClick={login} disabled={loading}>{loading ? 'Logger ind...' : 'Log ind'}</button>
            <p style={{ textAlign:'center', fontSize:'13px', color:'#6B7280', marginTop:'16px' }}>Ny bruger? <span style={{ color:'#1B2A5E', cursor:'pointer', fontWeight:500 }} onClick={() => setTab('signup')}>Opret gratis konto</span></p>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily:'DM Serif Display, serif', fontSize:'28px', marginBottom:'6px' }}>Opret konto</h1>
            <p style={{ fontSize:'14px', color:'#6B7280', marginBottom:'24px' }}>Gratis — ingen kreditkort kræves</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div style={s.field}><label style={s.label}>Fornavn</label><input style={s.input} placeholder="Magnus" value={form.firstName} onChange={e => update('firstName', e.target.value)}/></div>
              <div style={s.field}><label style={s.label}>Efternavn</label><input style={s.input} placeholder="Jensen" value={form.lastName} onChange={e => update('lastName', e.target.value)}/></div>
            </div>
            <div style={s.field}><label style={s.label}>Email</label><input style={s.input} type="email" placeholder="din@email.dk" value={form.email} onChange={e => update('email', e.target.value)}/></div>
            <div style={s.field}><label style={s.label}>Adgangskode</label><input style={s.input} type="password" placeholder="Mindst 6 tegn" value={form.password} onChange={e => update('password', e.target.value)}/></div>
            <div style={s.field}><label style={s.label}>Gentag</label><input style={s.input} type="password" placeholder="Gentag adgangskode" value={form.password2} onChange={e => update('password2', e.target.value)}/></div>
            <button style={s.btnPrimary} onClick={signup} disabled={loading}>{loading ? 'Opretter...' : 'Opret konto gratis'}</button>
            <p style={{ textAlign:'center', fontSize:'13px', color:'#6B7280', marginTop:'16px' }}>Har du en konto? <span style={{ color:'#1B2A5E', cursor:'pointer', fontWeight:500 }} onClick={() => setTab('login')}>Log ind</span></p>
          </>
        )}
      </div>
    </div>
  )
}

function SearchPage({ setPage, setSelectedProperty }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const colors = ['linear-gradient(135deg,#4ECDC4,#3A7BFF)','linear-gradient(135deg,#3A7BFF,#7B4DFF)','linear-gradient(135deg,#7B4DFF,#4ECDC4)','linear-gradient(135deg,#00B4DB,#4ECDC4)']
  const typeLabels = { house:'Villa / Hus', apartment:'Lejlighed', cottage:'Sommerhus', townhouse:'Rækkehus' }

  useEffect(() => { fetchProperties('') }, [])

  async function fetchProperties(term) {
    setLoading(true)
    let q = supabase.from('properties').select('*').eq('is_active', true)
    if (term) q = q.or(`city.ilike.%${term}%,title.ilike.%${term}%`)
    const { data } = await q.order('created_at', { ascending:false })
    setProperties(data || [])
    setLoading(false)
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('da-DK', { day:'numeric', month:'short' }) : null

  return (
    <div style={{ padding:'24px 20px', maxWidth:'1200px', margin:'0 auto' }}>
      <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
        <input style={{ ...s.input, flex:1 }} placeholder="🔍  By eller område..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && fetchProperties(search)}/>
        <button style={{ ...s.btnPrimary, width:'auto', padding:'13px 20px', flexShrink:0 }} onClick={() => fetchProperties(search)}>Søg</button>
      </div>
      {loading ? (
        <div style={{ textAlign:'center', padding:'60px', color:'#6B7280' }}>Henter boliger...</div>
      ) : properties.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🏠</div>
          <p style={{ color:'#6B7280', marginBottom:'20px' }}>Ingen boliger fundet</p>
          <button style={{ ...s.btnPrimary, maxWidth:'200px' }} onClick={() => fetchProperties('')}>Vis alle</button>
        </div>
      ) : (
        <>
          <p style={{ fontSize:'14px', color:'#6B7280', marginBottom:'16px' }}>{properties.length} {properties.length===1?'bolig':'boliger'} fundet</p>
          <div style={s.searchGrid}>
            {properties.map((p,i) => (
              <div key={p.id} style={s.propCard} onClick={() => { setSelectedProperty(p); setPage('property') }}>
                <div style={{ height:'180px', background:colors[i%colors.length], overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {p.images?.[0] ? <img src={p.images[0]} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                </div>
                <div style={{ padding:'14px' }}>
                  <div style={s.cardCity}>{p.city}</div>
                  <div style={s.cardName}>{p.title}</div>
                  <div style={{ fontSize:'12px', color:'#6B7280', marginBottom:'10px' }}>{typeLabels[p.type]} · {p.bedrooms} sov. {p.sqm?`· ${p.sqm} m²`:''}</div>
                  <span style={s.cardPill}>{fmt(p.available_from) ? `${fmt(p.available_from)}${fmt(p.available_to)?` – ${fmt(p.available_to)}`:''}` : 'Fleksibelt'}</span>
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
  const fmt = (d) => d ? new Date(d).toLocaleDateString('da-DK', { day:'numeric', month:'long' }) : null

  if (!property) return (
    <div style={{ textAlign:'center', padding:'80px 20px' }}>
      <p style={{ color:'#6B7280', marginBottom:'20px' }}>Ingen bolig valgt</p>
      <button style={{ ...s.btnPrimary, maxWidth:'200px' }} onClick={() => setPage('search')}>Gå til søgning</button>
    </div>
  )

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'24px 20px 60px' }}>
      <button style={s.btnGhost} onClick={() => setPage('search')}>← Tilbage til søgning</button>
      <div style={{ marginTop:'20px', display:'grid', gridTemplateColumns:'1fr', gap:'24px' }}>
        {/* Images */}
        <div style={{ borderRadius:'16px', overflow:'hidden', height:'280px', background:'linear-gradient(135deg,#4ECDC4,#3A7BFF)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {property.images?.[0] ? <img src={property.images[0]} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
        </div>
        {property.images?.length > 1 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
            {property.images.slice(1,5).map((img,i) => (
              <div key={i} style={{ height:'70px', borderRadius:'8px', overflow:'hidden' }}>
                <img src={img} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              </div>
            ))}
          </div>
        )}
        {/* Info */}
        <div>
          <h1 style={{ fontFamily:'DM Serif Display, serif', fontSize:'clamp(22px,4vw,32px)', marginBottom:'8px' }}>{property.title}</h1>
          <p style={{ color:'#6B7280', fontSize:'14px', marginBottom:'16px' }}>{property.city} · {typeLabels[property.type]} · {property.bedrooms} sov. {property.sqm?`· ${property.sqm} m²`:''}</p>
          {property.description && <p style={{ fontSize:'15px', lineHeight:1.75, color:'#374151', marginBottom:'20px' }}>{property.description}</p>}
          {fmt(property.available_from) && (
            <p style={{ fontSize:'14px', color:'#374151' }}>
              <strong>Tilgængelig: </strong>{fmt(property.available_from)}{fmt(property.available_to)?` – ${fmt(property.available_to)}`:''}
            </p>
          )}
        </div>
        {/* Booking card */}
        <div style={{ background:'#fff', border:'1.5px solid #E5E7EB', borderRadius:'16px', padding:'24px' }}>
          <h3 style={{ fontFamily:'DM Serif Display, serif', fontSize:'20px', marginBottom:'16px' }}>Send bytteforespørgsel</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'16px' }}>
            <input style={s.input} type="date"/>
            <input style={s.input} type="date"/>
          </div>
          <button style={{ ...s.btnPrimary, marginBottom:'10px' }} onClick={() => setPage('messages')}>Send bytteforespørgsel</button>
          <button style={s.btnOutline} onClick={() => setPage('messages')}>Skriv en besked først</button>
          <p style={{ fontSize:'11px', color:'#9CA3AF', textAlign:'center', marginTop:'12px' }}>Ingen betaling involveret.</p>
        </div>
      </div>
    </div>
  )
}

function MessagesPage() {
  const isMobile = useIsMobile()
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState([
    { mine:false, text:'Hej! Vi er interesserede i jeres bolig i juli 🙂', time:'10:14' },
    { mine:true, text:'Hej! Det lyder spændende. Hvilke datoer?', time:'10:22' },
    { mine:false, text:'Vi tænker 1.–14. juli. Familie med to børn.', time:'10:31' },
    { mine:true, text:'Super! Har I kæledyr?', time:'10:45' },
    { mine:false, text:'Ingen kæledyr 🙂 Vi har byttet to gange med 5 stjerner.', time:'10:52' },
  ])
  const bottomRef = useRef(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  function send() {
    if (!msg.trim()) return
    setMessages(m => [...m, { mine:true, text:msg, time:'Nu' }])
    setMsg('')
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', height:'calc(100vh - 65px)' }}>
      <div style={{ borderRight:'1px solid #E5E7EB', background:'#fff', overflowY:'auto', display: isMobile ? 'none' : 'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px', borderBottom:'1px solid #E5E7EB', fontWeight:600, fontSize:'16px' }}>Beskeder</div>
        {[['MH','Mette og Henrik','Hellerup → Aarhus',true],['TN','Thomas og Nina','Aarhus → Amsterdam',false]].map(([init,name,sub,active]) => (
          <div key={name} style={{ display:'flex', gap:'10px', padding:'14px 16px', borderBottom:'1px solid #E5E7EB', background:active?'#EEF0FB':'#fff', cursor:'pointer' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'13px', fontWeight:600, flexShrink:0 }}>{init}</div>
            <div><div style={{ fontSize:'14px', fontWeight:500 }}>{name}</div><div style={{ fontSize:'12px', color:'#6B7280' }}>{sub}</div></div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:600, fontSize:'12px' }}>MH</div>
          <div><div style={{ fontWeight:500 }}>Mette og Henrik</div><div style={{ fontSize:'12px', color:'#6B7280' }}>Hellerup · Verificeret</div></div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
          {messages.map((m,i) => (
            <div key={i} style={{ display:'flex', justifyContent:m.mine?'flex-end':'flex-start' }}>
              <div style={{ maxWidth:'72%', padding:'10px 14px', borderRadius:m.mine?'16px 4px 16px 16px':'4px 16px 16px 16px', background:m.mine?'#1B2A5E':'#F3F4F6', color:m.mine?'#fff':'#111827', fontSize:'14px', lineHeight:1.5 }}>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div style={{ padding:'14px 20px', borderTop:'1px solid #E5E7EB', display:'flex', gap:'10px', flexShrink:0 }}>
          <input style={{ ...s.input, flex:1 }} placeholder="Skriv en besked..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}/>
          <button style={{ ...s.btnPrimary, width:'auto', padding:'12px 18px' }} onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}

function ProfilePage({ user, setPage, onLogout, setEditProperty }) {
  const [tab, setTab] = useState('properties')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const name = user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : user?.email || 'Bruger'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
  const gradients = ['linear-gradient(135deg,#4ECDC4,#3A7BFF)','linear-gradient(135deg,#3A7BFF,#7B4DFF)','linear-gradient(135deg,#7B4DFF,#4ECDC4)']
  const typeLabels = { house:'Villa / Hus', apartment:'Lejlighed', cottage:'Sommerhus', townhouse:'Rækkehus' }

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('avatar_url').eq('id', user.id).single()
      .then(({ data }) => { if (data?.avatar_url) setAvatarUrl(data.avatar_url) })
    supabase.from('properties').select('*').eq('owner_id', user.id).order('created_at', { ascending:false })
      .then(({ data }) => { setProperties(data || []); setLoading(false) })
  }, [user])

  async function uploadAvatar(e) {
    const file = e.target.files[0]
    if (!file) return
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert:true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id)
      setAvatarUrl(data.publicUrl + '?t=' + Date.now())
    }
  }

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'24px 20px 60px' }}>
      {/* Header card */}
      <div style={{ background:'#fff', borderRadius:'20px', padding:'28px', marginBottom:'20px', border:'1px solid #E5E7EB' }}>
        <div style={{ display:'flex', gap:'20px', alignItems:'flex-start', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', fontWeight:600, color:'#fff', overflow:'hidden', cursor:'pointer' }}
              onClick={() => document.getElementById('avatar-upload').click()}>
              {avatarUrl ? <img src={avatarUrl} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : initials}
            </div>
            <div style={{ position:'absolute', bottom:0, right:0, width:'24px', height:'24px', background:'#3A7BFF', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:'16px', lineHeight:1 }}
              onClick={() => document.getElementById('avatar-upload').click()}>+</div>
            <input id="avatar-upload" type="file" accept="image/*" style={{ display:'none' }} onChange={uploadAvatar}/>
          </div>
          <div style={{ flex:1, minWidth:'180px' }}>
            <h1 style={{ fontFamily:'DM Serif Display, serif', fontSize:'26px', marginBottom:'4px' }}>{name}</h1>
            <div style={{ fontSize:'13px', color:'#6B7280', marginBottom:'12px' }}>Gratis konto · Medlem siden 2025</div>
            <div style={{ display:'flex', gap:'20px' }}>
              {[['0','Bytter'],[properties.length,'Boliger'],['0','Anmeldelser']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:'DM Serif Display, serif', fontSize:'22px' }}>{n}</div>
                  <div style={{ fontSize:'11px', color:'#9CA3AF' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <button style={{ ...s.btnOutline, width:'auto', padding:'10px 20px', flexShrink:0 }} onClick={onLogout}>Log ud</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid #E5E7EB', marginBottom:'20px', overflowX:'auto' }}>
        {[['properties','Mine boliger'],['swaps','Bytter'],['account','Konto']].map(([id,label]) => (
          <div key={id} style={{ padding:'12px 20px', cursor:'pointer', fontSize:'14px', fontWeight:500, color:tab===id?'#1B2A5E':'#6B7280', borderBottom:tab===id?'2px solid #1B2A5E':'2px solid transparent', whiteSpace:'nowrap' }} onClick={() => setTab(id)}>{label}</div>
        ))}
      </div>

      {tab === 'properties' && (
        loading ? <div style={{ textAlign:'center', padding:'40px', color:'#6B7280' }}>Henter boliger...</div>
        : properties.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🏠</div>
            <p style={{ color:'#6B7280', marginBottom:'20px' }}>Du har ingen boliger endnu</p>
            <button style={{ ...s.btnPrimary, maxWidth:'260px' }} onClick={() => { setEditProperty(null); setPage('create-property') }}>Tilføj din første bolig</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'16px' }}>
            {properties.map((p,i) => (
              <div key={p.id} style={{ background:'#fff', borderRadius:'16px', overflow:'hidden', border:'1px solid #E5E7EB' }}>
                <div style={{ height:'140px', background:gradients[i%gradients.length], overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {p.images?.[0] ? <img src={p.images[0]} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                </div>
                <div style={{ padding:'14px' }}>
                  <div style={{ fontSize:'10px', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'2px' }}>{p.city}</div>
                  <div style={{ fontFamily:'DM Serif Display, serif', fontSize:'16px', marginBottom:'6px' }}>{p.title}</div>
                  <div style={{ fontSize:'12px', color:'#6B7280', marginBottom:'10px' }}>{typeLabels[p.type]} · {p.bedrooms} sov. {p.sqm?`· ${p.sqm} m²`:''}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'11px', background:'#EEF0FB', color:'#1B2A5E', padding:'3px 10px', borderRadius:'100px', fontWeight:500 }}>Aktiv</span>
                    <button style={{ background:'none', border:'none', fontSize:'12px', color:'#6B7280', cursor:'pointer' }} onClick={() => { setEditProperty(p); setPage('create-property') }}>Rediger →</button>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ background:'#fff', borderRadius:'16px', border:'2px dashed #E5E7EB', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', padding:'32px', cursor:'pointer', minHeight:'200px' }}
              onClick={() => { setEditProperty(null); setPage('create-property') }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span style={{ fontSize:'13px', color:'#6B7280' }}>Tilføj bolig</span>
            </div>
          </div>
        )
      )}

      {tab === 'swaps' && (
        <div style={{ textAlign:'center', padding:'40px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🔄</div>
          <p style={{ color:'#6B7280', marginBottom:'20px' }}>Ingen bytter endnu</p>
          <button style={{ ...s.btnPrimary, maxWidth:'200px' }} onClick={() => setPage('search')}>Søg boliger</button>
        </div>
      )}

      {tab === 'account' && (
        <div style={{ background:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid #E5E7EB' }}>
          <h3 style={{ fontSize:'15px', fontWeight:600, marginBottom:'16px' }}>Kontooplysninger</h3>
          {[['Email', user?.email||''],['Plan','Gratis'],['Oprettet','2025']].map(([l,v]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #F3F4F6', fontSize:'14px' }}>
              <span style={{ color:'#374151' }}>{l}</span><span style={{ color:'#6B7280' }}>{v}</span>
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
  const [images, setImages] = useState(editProperty?.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const isEditing = !!editProperty

  function update(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function uploadImages(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const urls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('property-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('property-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    setImages(imgs => [...imgs, ...urls].slice(0, 5))
    setUploading(false)
  }

  async function save() {
    if (!form.title || !form.city) { setMsg('Udfyld titel og by'); return }
    setSaving(true)
    const data = {
      title: form.title, city: form.city, type: form.type,
      description: form.description, bedrooms: parseInt(form.bedrooms),
      sqm: parseInt(form.sqm) || null,
      available_from: form.from || null,
      available_to: form.to || null,
      images: images,
    }
    const { error } = isEditing
      ? await supabase.from('properties').update(data).eq('id', editProperty.id)
      : await supabase.from('properties').insert({ ...data, owner_id: user.id })
    setSaving(false)
    if (error) setMsg('Noget gik galt: ' + error.message)
    else setStep(4)
  }

  return (
    <div style={{ maxWidth:'680px', margin:'0 auto', padding:'32px 20px 80px' }}>
      {/* Progress */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'32px', overflowX:'auto', paddingBottom:'4px' }}>
        {[1,2,3].map(n => (
          <div key={n} style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
            <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:n<step?'#1B2A5E':n===step?'#3A7BFF':'#E5E7EB', color:n<=step?'#fff':'#9CA3AF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600 }}>{n<step?'✓':n}</div>
            <span style={{ fontSize:'12px', color:n<=step?'#111827':'#9CA3AF' }}>{['Din bolig','Datoer','Færdig'][n-1]}</span>
            {n<3 && <div style={{ width:'24px', height:'1px', background:'#E5E7EB' }}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div style={{ background:'#fff', borderRadius:'16px', padding:'28px', border:'1px solid #E5E7EB', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:'22px', marginBottom:'20px' }}>{isEditing?'Rediger din bolig':'Om din bolig'}</h2>
            {msg && <div style={{ padding:'10px 14px', borderRadius:'8px', background:'#FEF0F0', color:'#EF4444', marginBottom:'14px', fontSize:'13px' }}>{msg}</div>}
            <div style={s.field}><label style={s.label}>Boligtype</label>
              <select style={s.input} value={form.type} onChange={e => update('type', e.target.value)}>
                <option value="house">Villa / Hus</option><option value="apartment">Lejlighed</option>
                <option value="cottage">Sommerhus</option><option value="townhouse">Rækkehus</option>
              </select>
            </div>
            <div style={s.field}><label style={s.label}>Titel</label><input style={s.input} placeholder="Fx: Lys villa med have" value={form.title} onChange={e => update('title', e.target.value)}/></div>
            <div style={s.field}><label style={s.label}>By</label><input style={s.input} placeholder="Fx: Hellerup" value={form.city} onChange={e => update('city', e.target.value)}/></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div style={s.field}><label style={s.label}>Soveværelser</label>
                <select style={s.input} value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select>
              </div>
              <div style={s.field}><label style={s.label}>M²</label><input style={s.input} type="number" placeholder="130" value={form.sqm} onChange={e => update('sqm', e.target.value)}/></div>
            </div>
            <div style={s.field}><label style={s.label}>Beskrivelse</label><textarea style={{ ...s.input, minHeight:'90px', resize:'vertical' }} placeholder="Beskriv din bolig..." value={form.description} onChange={e => update('description', e.target.value)}/></div>

            {/* Image upload */}
            <div style={s.field}>
              <label style={s.label}>Billeder (op til 5)</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
                {images.map((img,i) => (
                  <div key={i} style={{ aspectRatio:'4/3', borderRadius:'10px', overflow:'hidden', position:'relative' }}>
                    <img src={img} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    <button onClick={() => setImages(imgs => imgs.filter((_,j)=>j!==i))}
                      style={{ position:'absolute', top:'4px', right:'4px', background:'rgba(0,0,0,0.6)', color:'#fff', border:'none', borderRadius:'50%', width:'22px', height:'22px', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>×</button>
                  </div>
                ))}
                {images.length < 5 && (
                  <div style={{ aspectRatio:'4/3', borderRadius:'10px', border:'2px dashed #E5E7EB', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', gap:'4px', background:'#F9FAFB' }}
                    onClick={() => document.getElementById('prop-img').click()}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span style={{ fontSize:'10px', color:'#9CA3AF' }}>{uploading ? 'Uploader...' : 'Tilføj'}</span>
                  </div>
                )}
              </div>
              <input id="prop-img" type="file" accept="image/*" multiple style={{ display:'none' }} onChange={uploadImages}/>
              <p style={{ fontSize:'11px', color:'#9CA3AF', marginTop:'6px' }}>📱 På mobil kan du tage billeder med kameraet</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <button style={{ ...s.btnOutline, flex:1 }} onClick={() => setPage('profile')}>Annuller</button>
            <button style={{ ...s.btnPrimary, flex:2 }} onClick={() => { if(!form.title||!form.city){setMsg('Udfyld titel og by');return}; setMsg(''); setStep(2) }}>Næste →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ background:'#fff', borderRadius:'16px', padding:'28px', border:'1px solid #E5E7EB', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:'22px', marginBottom:'6px' }}>Hvornår vil du bytte?</h2>
            <p style={{ color:'#374151', fontSize:'14px', marginBottom:'20px' }}>Din bolig vises kun i søgninger der matcher dine datoer.</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div style={s.field}><label style={s.label}>Fra dato</label><input style={s.input} type="date" value={form.from} onChange={e => update('from', e.target.value)}/></div>
              <div style={s.field}><label style={s.label}>Til dato</label><input style={s.input} type="date" value={form.to} onChange={e => update('to', e.target.value)}/></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <button style={{ ...s.btnOutline, flex:1 }} onClick={() => setStep(1)}>← Tilbage</button>
            <button style={{ ...s.btnPrimary, flex:2 }} onClick={save} disabled={saving||uploading}>{uploading?'Uploader...':saving?'Gemmer...':isEditing?'Gem ændringer ✓':'Gem bolig ✓'}</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ textAlign:'center', padding:'48px 20px' }}>
          <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'#EEF0FB', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'32px' }}>✓</div>
          <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:'32px', marginBottom:'10px' }}>{isEditing?'Ændringer gemt!':'Din bolig er oprettet!'}</h2>
          <p style={{ color:'#6B7280', fontSize:'15px', marginBottom:'32px' }}>{isEditing?'Din bolig er opdateret.':'Din bolig er nu synlig for andre Homli-brugere.'}</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
            <button style={{ ...s.btnPrimary, maxWidth:'200px' }} onClick={() => setPage('profile')}>Se min profil</button>
            <button style={{ ...s.btnOutline, maxWidth:'200px' }} onClick={() => setPage('search')}>Søg boliger</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── STYLES ────────────────────────────────────────────────────────
const s = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 24px', background:'#fff', borderBottom:'1px solid #E5E7EB', position:'sticky', top:0, zIndex:100, gap:'12px' },
  navLinks: { display:'flex', alignItems:'center', gap:'16px', '@media(max-width:768px)':{ display:'none' } },
  navLink: { background:'none', border:'none', fontSize:'14px', color:'#6B7280', cursor:'pointer', fontFamily:'Inter, sans-serif', whiteSpace:'nowrap' },
  navCta: { background:'linear-gradient(135deg,#4ECDC4,#3A7BFF,#7B4DFF)', color:'#fff', border:'none', borderRadius:'100px', padding:'9px 18px', fontSize:'14px', fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif', whiteSpace:'nowrap' },
  hamburger: { display:'none', flexDirection:'column', gap:'4px', cursor:'pointer', padding:'8px', background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', borderRadius:'8px', border:'none' },
  hLine: { display:'block', width:'20px', height:'2px', background:'#fff', borderRadius:'2px', transition:'all 0.3s' },
  mobileMenu: { position:'fixed', top:'65px', left:0, right:0, bottom:0, background:'#fff', zIndex:99, display:'flex', flexDirection:'column', padding:'20px', gap:'4px', overflowY:'auto' },
  mobileMenuLink: { background:'none', border:'none', fontSize:'18px', color:'#111827', cursor:'pointer', fontFamily:'Inter, sans-serif', padding:'14px 16px', textAlign:'left', borderRadius:'10px', fontWeight:500 },
  mobileMenuCta: { background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', color:'#fff', border:'none', borderRadius:'12px', padding:'16px', fontSize:'16px', fontWeight:500, cursor:'pointer', marginTop:'8px' },
  hero: { display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100vh - 65px)', alignItems:'stretch' },
  heroLeft: { padding:'60px 48px', display:'flex', flexDirection:'column', justifyContent:'center', background:'#fff' },
  heroRight: { background:'#1B2A5E', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', padding:'40px' },
  eyebrow: { display:'inline-flex', alignItems:'center', gap:'8px', fontSize:'11px', fontWeight:500, letterSpacing:'0.1em', color:'#1B2A5E', textTransform:'uppercase', marginBottom:'20px' },
  eyebrowDot: { width:'6px', height:'6px', borderRadius:'50%', background:'#3A7BFF', display:'inline-block' },
  h1: { fontFamily:'DM Serif Display, serif', fontSize:'clamp(32px,4vw,52px)', lineHeight:1.06, color:'#000', marginBottom:'20px' },
  h1Em: { fontStyle:'italic', color:'#1B2A5E' },
  heroSub: { fontSize:'16px', lineHeight:1.7, color:'#374151', maxWidth:'400px', marginBottom:'32px' },
  heroActions: { display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' },
  trustRow: { display:'flex', alignItems:'center', gap:'24px', marginTop:'40px', paddingTop:'24px', borderTop:'1px solid #E5E7EB' },
  trustNum: { fontFamily:'DM Serif Display, serif', fontSize:'22px', color:'#111827', whiteSpace:'nowrap' },
  trustLbl: { fontSize:'11px', color:'#6B7280', marginTop:'2px' },
  heroCard: { background:'#fff', borderRadius:'16px', overflow:'hidden', boxShadow:'0 16px 48px rgba(0,0,0,0.3)', width:'260px' },
  verifiedPill: { position:'absolute', bottom:'24px', left:'50%', transform:'translateX(-50%)', background:'#fff', borderRadius:'100px', padding:'8px 16px', display:'flex', alignItems:'center', gap:'8px', boxShadow:'0 4px 20px rgba(0,0,0,0.2)', whiteSpace:'nowrap', fontSize:'12px', fontWeight:500 },
  verifiedDot: { width:'7px', height:'7px', borderRadius:'50%', background:'#4ECDC4' },
  section: { padding:'60px 48px' },
  sectionLabel: { fontSize:'11px', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'#3A7BFF', marginBottom:'12px' },
  h2: { fontFamily:'DM Serif Display, serif', fontSize:'clamp(28px,4vw,38px)', lineHeight:1.1, color:'#111827', marginBottom:'36px' },
  stepsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' },
  step: { padding:'20px', background:'#fff', borderRadius:'14px', border:'1px solid #E5E7EB' },
  stepNum: { fontFamily:'DM Serif Display, serif', fontSize:'36px', color:'#EEF0FB', marginBottom:'10px' },
  stepTitle: { fontFamily:'DM Serif Display, serif', fontSize:'17px', color:'#111827', marginBottom:'6px' },
  stepDesc: { fontSize:'13px', lineHeight:1.6, color:'#6B7280' },
  pricingGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' },
  priceCard: { borderRadius:'20px', padding:'28px', border:'1px solid #E5E7EB', background:'#fff' },
  priceBadge: { display:'inline-block', fontSize:'11px', fontWeight:500, padding:'4px 12px', borderRadius:'100px', marginBottom:'16px' },
  priceName: { fontFamily:'DM Serif Display, serif', fontSize:'24px', color:'#111827', marginBottom:'6px' },
  priceAmount: { fontSize:'36px', fontWeight:500, color:'#111827', lineHeight:1, marginBottom:'4px' },
  pricePeriod: { fontSize:'12px', color:'#6B7280', marginBottom:'20px' },
  priceDivider: { border:'none', height:'1px', background:'#E5E7EB', margin:'0 0 20px' },
  priceFeature: { display:'flex', alignItems:'flex-start', gap:'8px', fontSize:'13px', color:'#374151', marginBottom:'10px' },
  checkmark: { color:'#3A7BFF', fontWeight:700, flexShrink:0 },
  waitlist: { background:'#1B2A5E', padding:'70px 24px', textAlign:'center' },
  waitlistForm: { display:'flex', gap:'10px', maxWidth:'420px', margin:'0 auto', flexWrap:'wrap' },
  waitlistInput: { flex:1, padding:'14px 18px', borderRadius:'100px', border:'none', fontSize:'15px', color:'#111827', outline:'none', minWidth:'180px' },
  waitlistBtn: { background:'linear-gradient(135deg,#4ECDC4,#7B4DFF)', color:'#fff', padding:'14px 24px', borderRadius:'100px', fontSize:'15px', fontWeight:500, border:'none', cursor:'pointer' },
  formTabs: { display:'flex', background:'#F3F4F6', borderRadius:'10px', padding:'4px', marginBottom:'24px' },
  formTab: { flex:1, padding:'10px', textAlign:'center', fontSize:'14px', fontWeight:500, color:'#6B7280', borderRadius:'8px', cursor:'pointer' },
  formTabActive: { background:'#fff', color:'#111827', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  field: { marginBottom:'14px' },
  label: { display:'block', fontSize:'13px', fontWeight:500, color:'#374151', marginBottom:'5px' },
  input: { width:'100%', padding:'12px 14px', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'15px', color:'#111827', background:'#fff', outline:'none', fontFamily:'Inter, sans-serif', boxSizing:'border-box' },
  btnPrimary: { background:'linear-gradient(135deg,#4ECDC4,#3A7BFF,#7B4DFF)', color:'#fff', border:'none', borderRadius:'100px', padding:'14px 24px', fontSize:'15px', fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif', width:'100%', boxSizing:'border-box' },
  btnOutline: { background:'none', border:'2px solid #1B2A5E', color:'#1B2A5E', borderRadius:'100px', padding:'12px 24px', fontSize:'14px', fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif', width:'100%', boxSizing:'border-box' },
  btnGhost: { background:'none', border:'none', color:'#6B7280', fontSize:'14px', cursor:'pointer', fontFamily:'Inter, sans-serif', padding:0 },
  btnWhite: { background:'#fff', color:'#1B2A5E', border:'none', borderRadius:'100px', padding:'14px 24px', fontSize:'15px', fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif', width:'100%', boxSizing:'border-box' },
  searchGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'16px' },
  propCard: { background:'#fff', borderRadius:'14px', overflow:'hidden', border:'1px solid #E5E7EB', cursor:'pointer', transition:'box-shadow 0.15s' },
  cardCity: { fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em', color:'#6B7280', marginBottom:'2px' },
  cardName: { fontFamily:'DM Serif Display, serif', fontSize:'16px', color:'#111827', marginBottom:'4px' },
  cardPill: { fontSize:'11px', background:'#EEF0FB', color:'#1B2A5E', padding:'3px 10px', borderRadius:'100px', fontWeight:500, display:'inline-block' },
}

export default function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [editProperty, setEditProperty] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function logout() { await supabase.auth.signOut(); setUser(null); setPage('home') }

  useEffect(() => {
    if (!user && ['profile','messages','create-property'].includes(page)) setPage('login')
  }, [page, user])

  // Responsive nav visibility via CSS
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @media (max-width: 768px) {
        .desktop-nav { display: none !important; }
        .hamburger-btn { display: flex !important; }
        .hero-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
        .hero-right { display: none !important; }
        .hero-left { padding: 40px 20px !important; }
        .steps-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
        .pricing-grid { grid-template-columns: 1fr !important; }
        .section-pad { padding: 48px 20px !important; }
        .messages-grid { grid-template-columns: 1fr !important; }
        .messages-sidebar { display: none !important; }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

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
