import React, { useEffect, useMemo, useState } from 'react'
import Table from '../components/Table'
import SearchBar from '../components/SearchBar'

export default function Employees(){
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [dept, setDept] = useState('')
  const [cost, setCost] = useState(820)
  const [billable, setBillable] = useState(80)
  const [avail, setAvail] = useState(60)
  const [status, setStatus] = useState('Active')

  useEffect(()=>{
    setRows([
      {name:'Amit', role:'Frontend Engineer', dept:'Engineering', cost:820, billable:85, avail:40, status:'Active'},
      {name:'Neha', role:'Backend Engineer', dept:'Engineering', cost:840, billable:80, avail:30, status:'Active'},
      {name:'Ravi', role:'QA Analyst', dept:'Quality', cost:700, billable:60, avail:70, status:'Bench'}
    ])
  },[])

  function add(e){
    e.preventDefault()
    setRows(prev=> [{name, role, dept, cost:Number(cost||0), billable:Number(billable||0), avail:Number(avail||0), status}, ...prev])
    setName(''); setRole(''); setDept(''); setCost(820); setBillable(80); setAvail(60); setStatus('Active')
  }

  const filtered = useMemo(()=> rows.filter(r=> (`${r.name} ${r.role} ${r.dept} ${r.status}`).toLowerCase().includes(q.toLowerCase())),[rows,q])
  const columns = [
    { key:'name', label:'Name' },
    { key:'role', label:'Role' },
    { key:'dept', label:'Department' },
    { key:'cost', label:'Cost Rate' },
    { key:'billable', label:'Billable%', render:v=> <span className={`chip ${v>=80?'success':v>=60?'warning':'danger'}`}>{v}%</span> },
    { key:'avail', label:'Availability%', render:v=> <span className={`chip ${v<=30?'danger':v<=50?'warning':'success'}`}>{v}%</span> },
    { key:'status', label:'Status', render:v=> <span className={`chip ${v==='Active'?'success':v==='Bench'?'warning':'danger'}`}>{v}</span> }
  ]

  return (
    <div className="content">
      <h1 className="page-title">Employees</h1>
      <form onSubmit={add} className="toolbar">
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} />
        <input placeholder="Department" value={dept} onChange={e=>setDept(e.target.value)} />
        <input placeholder="Cost Rate" type="number" value={cost} onChange={e=>setCost(e.target.value)} />
        <input placeholder="Billable %" type="number" value={billable} onChange={e=>setBillable(e.target.value)} />
        <input placeholder="Availability %" type="number" value={avail} onChange={e=>setAvail(e.target.value)} />
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Active</option>
          <option>Bench</option>
          <option>On Leave</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <SearchBar value={q} onChange={setQ} placeholder="Search employees..." />
      <Table columns={columns} data={filtered} initialSort={{ key:'name', dir:'asc' }} />
    </div>
  )
}
