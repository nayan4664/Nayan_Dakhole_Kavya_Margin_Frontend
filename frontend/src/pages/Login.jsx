import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await login(email.trim(), password.trim());

      navigate('/dashboard');

    } catch (err) {
      setError(
        err.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'calc(100vh - 48px)'}}>
      <div className="card" style={{width:'100%', maxWidth:460}}>

        <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:8}}>
          <img src="/logo.png" alt="Kavya Margin" style={{height:42}}
          onError={(e)=>{ e.currentTarget.style.display='none' }} />
          <h2 style={{margin:0}}>Sign in with Kavya Margin Pvt Ltd</h2>
        </div>

        <p className="desc">Sign in to continue</p>

        <form onSubmit={onSubmit} style={{display:'grid', gap:10}}>

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />

          <div style={{position:'relative'}}>
            <input
              placeholder="Password"
              type={showPass ? 'text':'password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
              style={{paddingRight:84, width: '100%', boxSizing: 'border-box'}}
            />

            <button
              type="button"
              className="action-btn"
              onClick={()=> setShowPass(v=>!v)}
              style={{position:'absolute', right:8, top:8}}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <label style={{display:'flex', alignItems:'center', gap:8}}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e=>setRemember(e.target.checked)}
                style={{width:'auto'}}
              />
              Remember Me
            </label>

            <Link to="/forgot" className="desc">
              Forgot Password
            </Link>
          </div>

          {error ? <div style={{color:'red'}}>{error}</div> : null}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <div style={{marginTop:10}} className="desc">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>

      </div>
    </div>
  );
}