import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Forgot(){
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  function onSubmit(e){
    e.preventDefault()
    setSent(true)
  }
  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'calc(100vh - 48px)'}}>
      <div className="card" style={{width:'100%', maxWidth:420}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
          <img src="/logo.png" alt="Kavya Margin" style={{height:42}} onError={(e)=>{ e.currentTarget.style.display='none' }} />
          <h2 style={{margin:0}}>Reset Password</h2>
        </div>
        <p className="desc">Enter your email to receive reset instructions</p>
        <form onSubmit={onSubmit} style={{display:'grid',gap:10}}>
          <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <button type="submit">Send Reset Link</button>
        </form>
        {sent && <div className="desc" style={{marginTop:10}}>If the email exists, a reset link has been sent.</div>}
        <div style={{marginTop:10}} className="desc"><Link to="/login">Back to Login</Link></div>
      </div>
    </div>
  )
}
