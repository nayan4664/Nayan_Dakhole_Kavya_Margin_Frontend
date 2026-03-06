import React, { useEffect, useState } from 'react'
import api from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import Forecast from '../components/Forecast'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const [metrics, setMetrics] = useState(null)

  useEffect(()=>{
    api.get('/api/metrics')
      .then(r=> setMetrics(r.data))
      .catch(console.error)
  },[])

  const stats = metrics ? metrics.stats : {}
  const [range, setRange] = useState('30d')

  const [display, setDisplay] = useState({
    mrrSeries: [{mrr:800},{mrr:900},{mrr:980},{mrr:1020}],
    revenueSplit: [{name:'Products', value:40},{name:'Services', value:35},{name:'Retainer', value:25}],
    riskSplit: [{name:'Low', value:60},{name:'Medium', value:30},{name:'High', value:10}]
  })
  const COLORS = ['var(--primary)', 'var(--accent)', 'var(--warning)', 'var(--success)', 'var(--danger)']
  const navigate = useNavigate()

  function onRevenueSliceClick(name){
    if(name==='Products'){ navigate('/projects?q=product') }
    else if(name==='Services'){ navigate('/projects?q=service') }
    else if(name==='Retainer'){ navigate('/employees?q=retainer') }
  }

  // recompute display data when metrics or range changes
  useEffect(()=>{
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30

    // derive mrrSeries: prefer backend data, otherwise generate fallback
    let mrrSeries = metrics?.mrrSeries || null
    if(Array.isArray(mrrSeries) && mrrSeries.length){
      // take last `days` points if available
      mrrSeries = mrrSeries.slice(-Math.min(days, mrrSeries.length))
    }else{
      // generate synthetic series for the selected range
      const len = Math.min(Math.max(Math.floor(days/7), 4), 20)
      mrrSeries = Array.from({length: len}).map((_,i)=>({ day: `P${i+1}`, mrr: Math.round(800 + (i * (range==='90d'?6:2)) + (Math.sin(i)*50)) }))
    }

    // compute splits (normalize to percentages)
    const norm = arr => {
      const a = Array.isArray(arr) && arr.length ? arr : []
      const sum = a.reduce((s,x)=> s + (x.value||0), 0) || 1
      return a.map(x=> ({ name: x.name, value: Math.round((x.value||0) / sum * 100) }))
    }

    const revenueSplit = metrics?.revenueSplit ? norm(metrics.revenueSplit) : norm([{name:'Products', value:40},{name:'Services', value:35},{name:'Retainer', value:25}])
    const riskSplit = metrics?.riskSplit ? norm(metrics.riskSplit) : norm([{name:'Low', value:60},{name:'Medium', value:30},{name:'High', value:10}])

    setDisplay({ mrrSeries, revenueSplit, riskSplit })
  }, [metrics, range])

  function downloadCsv(rows, filename){
    const headers = Object.keys(rows[0]||{name:'',value:''})
    const csv = [headers.join(','), ...rows.map(r=> headers.map(h=> r[h]).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="content">
      <h1 className="page-title">Dashboard</h1>
      <div className="toolbar">
        <select value={range} onChange={e=>setRange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
      <div className="grid cols-2">
        <div>
          <div className="card">
            <h3>Activations vs Net Cancellations</h3>
            <div style={{height:260}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{name:'A', activations:30, cancellations:12},{name:'B', activations:12, cancellations:20}]}> 
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="activations" stroke="var(--primary)" />
                  <Line type="monotone" dataKey="cancellations" stroke="var(--warning)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="stats-grid" style={{marginTop:12}}>
            <div className="stat">
              <div>Signups</div>
              <div className="value">{stats ? stats.signups : '-'}</div>
            </div>
            <div className="stat">
              <div>Activations</div>
              <div className="value">{stats ? stats.activeSubs : '-'}</div>
            </div>
            <div className="stat">
              <div>Active Customers</div>
              <div className="value">{stats ? stats.customersCount : '-'}</div>
            </div>
          </div>

          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', marginTop:12}}>
            <div className="card">
              <h3>Revenue Split</h3>
              <div className="toolbar">
                <button className="ghost" onClick={()=>downloadCsv(display.revenueSplit,'revenue-split.csv')}>Export CSV</button>
              </div>
              <div style={{height:240}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={display.revenueSplit} dataKey="value" nameKey="name" outerRadius={90} labelLine={false} label={({payload})=> `${payload.name}: ${payload.value}%`}>
                      {display.revenueSplit.map((e,i)=> <Cell key={i} fill={COLORS[i%COLORS.length]} onClick={()=>onRevenueSliceClick(e.name)} />)}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value)=> `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3>Risk Distribution</h3>
              <div className="toolbar">
                <button className="ghost" onClick={()=>downloadCsv(display.riskSplit,'risk-distribution.csv')}>Export CSV</button>
              </div>
              <div style={{height:240}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={display.riskSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} labelLine={false} label={({payload})=> `${payload.name}: ${payload.value}%`}>
                      {display.riskSplit.map((e,i)=> <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value)=> `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{marginBottom:12}}>
            <h4>Pending Invoices</h4>
            <div className="value">4</div>
          </div>
          <div className="card" style={{marginBottom:12}}>
            <h4>Net Revenue</h4>
            <div className="value">{stats ? `₹${stats.totalMRR}` : '-'}</div>
            <div style={{height:60}}>
                <ResponsiveContainer width="100%" height={60}>
                <BarChart data={[{v:10},{v:30},{v:20}]}> <Bar dataKey="v" fill="var(--success)" /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="stats-grid" style={{marginBottom:12}}>
            <div className="stat">
              <div>Gross Margin</div>
              <div className="value">{stats && stats.grossMargin!=null ? `${stats.grossMargin}%` : '32%'}</div>
            </div>
            <div className="stat">
              <div>Utilization</div>
              <div className="value">{stats && stats.utilization!=null ? `${stats.utilization}%` : '76%'}</div>
            </div>
            <div className="stat">
              <div>Bench Cost</div>
              <div className="value">{stats && stats.benchCost!=null ? `₹${stats.benchCost}` : '₹24,000'}</div>
            </div>
          </div>
          <Forecast series={display.mrrSeries || (metrics?.mrrSeries) || [{mrr:800},{mrr:900},{mrr:980},{mrr:1020}]} />
        </div>
      </div>
    </div>
  )
}
