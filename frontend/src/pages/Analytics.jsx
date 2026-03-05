import React, { useRef, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'

export default function Analytics(){
  const [period, setPeriod] = useState('monthly')
  const COLORS = ['#22d3ee','#a78bfa','#f59e0b','#22c55e','#ef4444']
  const line = period==='monthly'
    ? [{m:'Jan', v:900},{m:'Feb', v:940},{m:'Mar', v:980},{m:'Apr', v:1010},{m:'May', v:1050},{m:'Jun', v:1090}]
    : [{m:'W1', v:210},{m:'W2', v:230},{m:'W3', v:260},{m:'W4', v:280}]
  const bars = [{n:'Revenue', v:1200},{n:'Cost', v:860},{n:'Profit', v:340}]
  const split = [{name:'Products',value:40},{name:'Services',value:35},{name:'Retainer',value:25}]
  const lineRef = useRef(null)
  const barRef = useRef(null)
  const pieRef = useRef(null)

  function exportCardPng(ref, filename){
    const svg = ref.current?.querySelector('svg')
    if(!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = function(){
      const rect = svg.getBoundingClientRect()
      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(rect.width)
      canvas.height = Math.ceil(rect.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const png = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = png; a.download = filename; a.click()
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  return (
    <div className="content">
      <h1 className="page-title">Analytics</h1>
      <div className="toolbar">
        <select value={period} onChange={e=>setPeriod(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="grid" style={{gridTemplateColumns:'2fr 1fr'}}>
        <div className="card" ref={lineRef}>
          <h3>Revenue Trend</h3>
          <div className="toolbar"><button className="ghost" onClick={()=>exportCardPng(lineRef,'revenue-trend.png')}>Export PNG</button></div>
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={line}>
                <XAxis dataKey="m" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="v" stroke="#22d3ee" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" ref={barRef}>
          <h3>Summary</h3>
          <div className="toolbar"><button className="ghost" onClick={()=>exportCardPng(barRef,'summary.png')}>Export PNG</button></div>
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars}>
                <XAxis dataKey="n" /><YAxis /><Tooltip />
                <Bar dataKey="v" fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', marginTop:12}}>
        <div className="card" ref={pieRef}>
          <h3>Revenue Split</h3>
          <div className="toolbar"><button className="ghost" onClick={()=>exportCardPng(pieRef,'revenue-split.png')}>Export PNG</button></div>
          <div style={{height:240}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={split} dataKey="value" nameKey="name" outerRadius={90}>
                  {split.map((e,i)=> <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Legend /><Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3>KPIs</h3>
          <div className="stats-grid">
            <div className="stat"><div>Gross Margin</div><div className="value">32%</div></div>
            <div className="stat"><div>Utilization</div><div className="value">76%</div></div>
            <div className="stat"><div>Bench Cost</div><div className="value">₹24,000</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
