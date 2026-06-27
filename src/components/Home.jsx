export default function Home({ total, doneCount, historyCount, onPractice, onQuestionBank, onHistory, onImportData }) {
  const handleExport = () => {
    const data = {
      wrongSet: [...new Set(JSON.parse(localStorage.getItem('exam_wrong_questions') || '[]'))],
      favoritesSet: [...new Set(JSON.parse(localStorage.getItem('exam_favorites') || '[]'))],
      examHistory: JSON.parse(localStorage.getItem('exam_history') || '[]'),
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `exam-data-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const ok = onImportData(ev.target.result)
      if (ok) alert('数据导入成功！')
      else alert('导入失败：文件格式不正确')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-motd">★ KEEP GOING! ★</div>
        <h1 className="home-title">赛道二 · 具身智能数据采集与处理</h1>
        <div className="home-badge-row">
          <span className="home-badge">📚 {total} 题题库</span>
          <span className="home-badge">✅ 已刷 {doneCount}</span>
          <span className="home-badge">🏆 满分100</span>
        </div>
        <button className="btn btn-primary btn-start" onClick={onPractice}>
          ▶ 刷题训练
        </button>
        <button className="btn btn-bank" onClick={onQuestionBank}>
          🔍 浏览题库
        </button>
        <button className="btn btn-secondary" onClick={onHistory}>
          📊 历史成绩{historyCount > 0 ? ` · ${historyCount}次` : ''}
        </button>
        <div className="home-data-mgmt">
          <button className="btn-data" onClick={handleExport}>📥 导出</button>
          <label className="btn-data">
            📤 导入
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </div>
  )
}
