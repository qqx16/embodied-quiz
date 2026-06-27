export default function History({ history, total, passScore, onHome, onClearHistory, onDeleteEntry }) {
  // Filter display: exclude wrong-mode entries. Keep track of original index for delete.
  const displayWithIdx = history
    .map((r, origIdx) => ({ ...r, _origIdx: origIdx }))
    .filter(r => !r.isWrong)

  const displayHistory = displayWithIdx.map(r => {
    const { _origIdx, ...rest } = r
    return rest
  })

  const avg = displayHistory.length > 0
    ? Math.round(displayHistory.reduce((s, r) => s + r.score, 0) / displayHistory.length)
    : 0
  const passed = displayHistory.filter(r => r.score >= passScore).length

  // Chart dimensions
  const pad = { top: 20, right: 20, bottom: 40, left: 40 }
  const w = 600
  const h = 280
  const cw = w - pad.left - pad.right
  const ch = h - pad.top - pad.bottom

  const points = displayHistory.map((r, i) => ({
    x: pad.left + (displayHistory.length > 1 ? (i / (displayHistory.length - 1)) * cw : cw / 2),
    y: pad.top + ch - (r.score / 100) * ch,
    score: r.score,
    date: r.date
  }))

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaD = lineD.length > 0
    ? lineD + ` L${points[points.length - 1].x},${pad.top + ch} L${points[0].x},${pad.top + ch} Z`
    : ''

  // Y-axis ticks
  const yTicks = [0, 25, 50, 75, 100]
  const xTicks = displayHistory.length <= 10 ? displayHistory.map((_, i) => i + 1) : null

  return (
    <div className="history-page">
      <div className="history-header">
        <button className="btn btn-secondary" onClick={onHome}>← 返回首页</button>
        <h2>历史成绩（仅模拟考试）</h2>
        <div>
          {displayHistory.length > 0 && (
            <button className="btn btn-reset-wrong" onClick={onClearHistory} title="清空所有历史成绩">
              🗑️ 清空记录
            </button>
          )}
        </div>
      </div>

      <div className="history-content">
        {/* Stats summary */}
        <div className="history-summary animate-in">
          <div className="history-stat">
            <span className="history-stat-num">{displayHistory.length}</span>
            <span className="history-stat-label">考试次数</span>
          </div>
          <div className="history-stat">
            <span className="history-stat-num accent">{avg}</span>
            <span className="history-stat-label">平均分</span>
          </div>
          <div className="history-stat">
            <span className="history-stat-num green">{passed}</span>
            <span className="history-stat-label">及格次数</span>
          </div>
          <div className="history-stat">
            <span className="history-stat-num orange">{Math.round((displayHistory.length > 0 ? passed / displayHistory.length : 0) * 100)}%</span>
            <span className="history-stat-label">及格率</span>
          </div>
        </div>

        {/* Chart */}
        {displayHistory.length >= 2 && (
          <div className="history-chart animate-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="chart-title">成绩走势</h3>
            <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg">
              {/* Grid lines */}
              {yTicks.map(t => {
                const y = pad.top + ch - (t / 100) * ch
                return (
                  <g key={t}>
                    <line x1={pad.left} y1={y} x2={pad.left + cw} y2={y}
                      stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" />
                    <text x={pad.left - 8} y={y + 4} textAnchor="end"
                      fill="#94a3b8" fontSize="11">{t}</text>
                  </g>
                )
              })}
              {/* Pass line */}
              <line x1={pad.left} y1={pad.top + ch - (passScore / 100) * ch}
                x2={pad.left + cw} y2={pad.top + ch - (passScore / 100) * ch}
                stroke="#f59e0b" strokeWidth="1" strokeDasharray="6,3" />
              <text x={pad.left + cw + 4} y={pad.top + ch - (passScore / 100) * ch + 4}
                fill="#f59e0b" fontSize="10" fontWeight="600">及格({passScore})</text>

              {/* Area fill */}
              {areaD && <path d={areaD} fill="url(#scoreGrad)" opacity="0.5" />}
              {/* Line */}
              {lineD && <path d={lineD} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
              {/* Dots */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="var(--color-primary)" stroke="#fff" strokeWidth="2" />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fill="var(--color-text)" fontSize="12" fontWeight="600">
                    {p.score}
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* Table */}
        <div className="history-table-wrap animate-in" style={displayHistory.length >= 2 ? { animationDelay: '0.15s' } : {}}>
          <h3 className="chart-title">考试记录</h3>
          {displayHistory.length === 0 ? (
            <div className="history-empty">暂无考试记录，快去刷题吧！</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>日期</th>
                  <th>类型</th>
                  <th>题数</th>
                  <th>成绩</th>
                  <th>结果</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...displayWithIdx].reverse().map((r, i) => (
                  <tr key={r._origIdx} className={r.score >= passScore ? 'row-passed' : 'row-failed'}>
                    <td className="td-idx">{displayHistory.length - i}</td>
                    <td className="td-date">{r.date}</td>
                    <td>
                      <span className="history-type-tag tag-normal">模拟考试</span>
                    </td>
                    <td>{r.total}</td>
                    <td className="td-score">{r.score}分</td>
                    <td>
                      <span className={`history-result ${r.score >= passScore ? 'res-pass' : 'res-fail'}`}>
                        {r.score >= passScore ? '及格' : '不及格'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-delete-entry"
                        onClick={() => onDeleteEntry(r._origIdx)}
                        title="删除此条记录"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
