import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Table from '../components/Table'
import SearchBar from '../components/SearchBar'

export default function Projects(){
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [budget, setBudget] = useState(100000)
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [owner, setOwner] = useState('')

  useEffect(()=>{
    setProjects([
      {name:'KM-Frontend', owner:'Amit', status:'Active', budget:120000, burn:62, margin:28},
      {name:'KM-API', owner:'Neha', status:'Active', budget:150000, burn:48, margin:32},
      {name:'Internal R&D', owner:'Ravi', status:'On Hold', budget:80000, burn:15, margin:12}
    ])
  },[])

  function add(e){
    e.preventDefault()
    setProjects(prev=> [{name, owner: owner || 'Owner', status:'Active', budget:Number(budget||0), burn:0, margin:0}, ...prev])
    setName(''); setBudget(100000); setOwner('')
  }

  const filtered = useMemo(()=> projects
    .filter(p=> (`${p.name} ${p.status}`).toLowerCase().includes(q.toLowerCase()))
    .filter(p=> statusFilter==='All' ? true : p.status===statusFilter)
  ,[projects,q,statusFilter])
  const columns = [
    { key:'name', label:'Project' },
    { key:'owner', label:'Owner' },
    { key:'status', label:'Status', render:v=> <span className={`chip ${v==='Active'?'success':v==='On Hold'?'warning':'danger'}`}>{v}</span> },
    { key:'budget', label:'Budget' },
    { key:'burn', label:'Burn%', render:v=> <span className={`chip ${v>=80?'danger':v>=60?'warning':'success'}`}>{v}%</span> },
    { key:'margin', label:'Margin%', render:v=> <span className={`chip ${v>=30?'success':v>=20?'warning':'danger'}`}>{v}%</span> }
  ]

  return (
    <div className="content">
      <h1 className="page-title">Projects</h1>
      <form onSubmit={add} className="toolbar">
        <input placeholder="Project Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Budget" type="number" value={budget} onChange={e=>setBudget(e.target.value)} />
        <input placeholder="Owner" value={owner} onChange={e=>setOwner(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <div className="toolbar">
        <SearchBar value={q} onChange={setQ} placeholder="Search projects..." />
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{maxWidth:180}}>
          <option>All</option>
          <option>Active</option>
          <option>On Hold</option>
          <option>Completed</option>
        </select>
      </div>
      <Table columns={columns} data={filtered} initialSort={{ key:'name', dir:'asc' }} />
    </div>
  )
}
