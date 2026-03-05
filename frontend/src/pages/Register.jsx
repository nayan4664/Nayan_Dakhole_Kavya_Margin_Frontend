import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register(){
  const { login } = useAuth()
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [admin, setAdmin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e){
    e.preventDefault()
    try{
      if(!company || !admin) throw new Error('Enter company and admin')
      login(email.trim(), password.trim())
      navigate('/', { replace: true })
    }catch(err){
      setError(String(err?.message || err || 'Register failed'))
    }
  }

  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'calc(100vh - 48px)'}}>
      <div className="card" style={{width:'100%', maxWidth:460}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
          <img src="/logo.png" alt="Kavya Margin" style={{height:42}} onError={(e)=>{ e.currentTarget.style.display='none' }} />
          <h2 style={{margin:0}}>Create Account</h2>
        </div>
        <p className="desc">Set up your organization</p>
        <form onSubmit={onSubmit} style={{display:'grid',gap:10}}>
          <input placeholder="Company Name" value={company} onChange={e=>setCompany(e.target.value)} required />
          <input placeholder="Admin Name" value={admin} onChange={e=>setAdmin(e.target.value)} required />
          <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error ? <div style={{color:'var(--danger)'}}>{error}</div> : null}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}
