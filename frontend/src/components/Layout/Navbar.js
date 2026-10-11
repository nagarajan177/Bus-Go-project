import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bus, User, LogOut, Ticket, Settings, ChevronDown, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  ['/', 'Home'],
  ['/search', 'Search'],
  ['/offers', 'Offers'],
  ['/track', 'Track Bus'],
  ['/help', 'Help'],
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close the mobile drawer and the dropdown whenever the page changes
  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  const isActive = p => location.pathname === p;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="nav-main" style={{ position:'fixed',top:0,left:0,right:0,zIndex:1000,padding:'14px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',
      background:scrolled||mobileOpen?'rgba(10,15,30,0.98)':'rgba(10,15,30,0.75)',backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(249,115,22,0.2)',transition:'all .3s' }}>
      <Link to="/" style={{display:'flex',alignItems:'center',gap:'10px'}}>
        <Bus color="#f97316" size={26}/>
        <span style={{fontFamily:'Syne',fontSize:'22px',fontWeight:800,color:'#f97316'}}>Bus<span style={{color:'#f1f5f9'}}>Go</span></span>
      </Link>

      {/* Desktop links */}
      <div className="nav-links" style={{display:'flex',gap:'28px',alignItems:'center'}}>
        {NAV_LINKS.map(([path,label]) => (
          <Link key={path} to={path} style={{ color:isActive(path)?'#f97316':'#94a3b8', fontSize:'14px', fontWeight:500, transition:'color .2s' }}
            onMouseOver={e=>e.currentTarget.style.color='#f97316'} onMouseOut={e=>e.currentTarget.style.color=isActive(path)?'#f97316':'#94a3b8'}>
            {label}
          </Link>
        ))}
        {user?.role === 'admin' && (
          <Link to="/admin" style={{color:'#fbbf24',fontSize:'14px',fontWeight:700}}>⚙ Admin</Link>
        )}
      </div>

      {/* Desktop user area */}
      <div className="nav-actions" style={{display:'flex',alignItems:'center',gap:'14px'}}>
        {user ? (
          <div style={{position:'relative'}}>
            <button onClick={() => setDropOpen(!dropOpen)} style={{ display:'flex',alignItems:'center',gap:'8px',background:'rgba(30,45,80,0.9)',
              border:'1px solid rgba(249,115,22,0.3)',borderRadius:'50px',padding:'8px 16px',color:'#f1f5f9',cursor:'pointer',fontSize:'14px' }}>
              <User size={15} color="#f97316"/>
              <span>{user.name.split(' ')[0]}</span>
              <ChevronDown size={13} color="#64748b"/>
            </button>
            {dropOpen && (
              <div onClick={() => setDropOpen(false)} style={{ position:'absolute',right:0,marginTop:'8px',
                background:'#1e2d50',border:'1px solid rgba(249,115,22,0.2)',borderRadius:'12px',padding:'8px',minWidth:'190px',
                boxShadow:'0 20px 60px rgba(0,0,0,0.5)',zIndex:10 }}>
                {[
                  ['/my-bookings','My Bookings','Ticket'],
                  ['/profile','Profile','Settings'],
                ].map(([path,label,Icon]) => (
                  <Link key={path} to={path} style={{ display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',borderRadius:'8px',color:'#e2e8f0',fontSize:'14px' }}
                    onMouseOver={e=>e.currentTarget.style.background='rgba(249,115,22,0.1)'}
                    onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                    {Icon === 'Ticket' ? <Ticket size={15} color="#f97316"/> : <Settings size={15} color="#f97316"/>}
                    {label}
                  </Link>
                ))}
                <hr style={{border:'none',borderTop:'1px solid rgba(148,163,184,0.1)',margin:'4px 0'}}/>
                <button onClick={handleLogout} style={{ display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',
                  borderRadius:'8px',color:'#ef4444',fontSize:'14px',background:'transparent',border:'none',width:'100%',cursor:'pointer' }}>
                  <LogOut size={15}/> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" style={{color:'#94a3b8',fontSize:'14px',fontWeight:500}}>Login</Link>
            <Link to="/register" style={{background:'#f97316',color:'#fff',padding:'9px 22px',borderRadius:'50px',fontSize:'14px',fontWeight:600}}>Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile hamburger (hidden on desktop by CSS below) */}
      <button className="nav-burger" onClick={() => setMobileOpen(o => !o)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
        {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="nav-drawer">
          {NAV_LINKS.map(([path,label]) => (
            <Link key={path} to={path} className="nav-drawer-link"
              style={{ color:isActive(path)?'#f97316':'#e2e8f0', fontWeight:isActive(path)?700:500 }}>
              {label}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-drawer-link" style={{color:'#fbbf24',fontWeight:700}}>⚙ Admin</Link>
          )}

          <div style={{height:1,background:'rgba(148,163,184,0.15)',margin:'8px 0'}}/>

          {user ? (
            <>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 4px',color:'#94a3b8',fontSize:13}}>
                <User size={15} color="#f97316"/> Signed in as <b style={{color:'#f1f5f9'}}>{user.name.split(' ')[0]}</b>
              </div>
              <Link to="/my-bookings" className="nav-drawer-link" style={{color:'#e2e8f0'}}>
                <Ticket size={16} color="#f97316"/> My Bookings
              </Link>
              <Link to="/profile" className="nav-drawer-link" style={{color:'#e2e8f0'}}>
                <Settings size={16} color="#f97316"/> Profile
              </Link>
              <button onClick={handleLogout} className="nav-drawer-link"
                style={{color:'#ef4444',background:'transparent',border:'none',width:'100%',textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}>
                <LogOut size={16}/> Logout
              </button>
            </>
          ) : (
            <div style={{display:'flex',gap:10,padding:'8px 0'}}>
              <Link to="/login" style={{flex:1,textAlign:'center',padding:'12px',borderRadius:12,border:'1px solid rgba(249,115,22,0.4)',color:'#f97316',fontSize:14,fontWeight:600}}>
                Login
              </Link>
              <Link to="/register" style={{flex:1,textAlign:'center',padding:'12px',borderRadius:12,background:'#f97316',color:'#fff',fontSize:14,fontWeight:600}}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .nav-burger {
          display: none;
          width: 40px; height: 40px;
          align-items: center; justify-content: center;
          background: rgba(30,45,80,0.9);
          border: 1px solid rgba(249,115,22,0.3);
          border-radius: 10px;
          color: #f97316; cursor: pointer;
        }
        .nav-drawer {
          position: fixed; top: 64px; left: 0; right: 0;
          max-height: calc(100vh - 64px); overflow-y: auto;
          background: rgba(10,15,30,0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(249,115,22,0.2);
          padding: 8px 16px 20px;
          box-shadow: 0 24px 40px rgba(0,0,0,0.45);
        }
        .nav-drawer-link {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 4px; font-size: 15px;
          border-bottom: 1px solid rgba(148,163,184,0.08);
        }
        @media (max-width: 900px) {
          .nav-main { padding: 12px 16px !important; }
          .nav-links, .nav-actions { display: none !important; }
          .nav-burger { display: flex; }
        }
        @media (min-width: 901px) {
          .nav-drawer { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
export default Navbar;