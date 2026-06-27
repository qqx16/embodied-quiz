export default function Home({ total, examSize, passScore, wrongCount, favCount, doneCount, historyCount, onStart, onWrongExam, onResetWrong, onHistory, onFavorites, onQuestionBank, onImportData }) {
  // 导出数据
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

  // 导入数据
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
    e.target.value = '' // reset input
  }

  return (
    <div className="home-page">
      <div className="home-card">
        <h1 className="home-title">赛道二 具身智能数据采集与处理</h1>
        <p className="home-subtitle">刷题训练</p>
        <div className="home-info">
          <div className="info-item">
            <span className="info-icon">📝</span>
            <span>题库共 {total} 题（抽 {examSize} 题）</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <span>已刷 {doneCount}/{total} 题</span>
          </div>
          <div className="info-item">
            <span className="info-icon">💯</span>
            <span>满分 100 分 · 及格 {passScore}</span>
          </div>
        </div>
        <button className="btn btn-primary btn-start" onClick={onStart}>
          开始答题（{examSize}题）
        </button>
        <button className="btn btn-qbank" onClick={onQuestionBank} style={{ marginTop: 12 }}>
          📚 题库浏览
        </button>
        {wrongCount > 0 && (
          <button className="btn btn-wrong" onClick={onWrongExam} style={{ marginTop: 12 }}>
            🔄 错题重练（{wrongCount} 题）
          </button>
        )}
        {favCount > 0 && (
          <button className="btn btn-fav-exam" onClick={onFavorites} style={{ marginTop: 12 }}>
            ⭐ 收藏夹（{favCount} 题）
          </button>
        )}
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={onHistory} style={{ flex: 1 }}>
            📊 历史成绩{historyCount > 0 ? `（${historyCount}次）` : ''}
          </button>
          {wrongCount > 0 && (
            <button className="btn btn-reset-wrong" onClick={onResetWrong} title="清空所有错题记录">
              🗑️ 重置错题
            </button>
          )}
        </div>
        {/* 数据导入导出 */}
        <div className="home-data-mgmt">
          <button className="btn-data" onClick={handleExport}>
            📥 导出数据
          </button>
          <label className="btn-data">
            📤 导入数据
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </div>
  )
}
