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
        <div className="home-section">
          <div className="home-section-title">📝 刷题训练</div>
          <button className="btn btn-primary btn-start" onClick={onStart}>
            开始答题（{examSize}题随机）
          </button>
          <button className="btn btn-wrong" onClick={onWrongExam} disabled={wrongCount === 0}>
            🔄 错题重练（{wrongCount} 题）
          </button>
          <button className="btn btn-fav-exam" onClick={onFavorites} disabled={favCount === 0}>
            ⭐ 收藏夹（{favCount} 题）
          </button>
        </div>

        <div className="home-section">
          <div className="home-section-title">📚 题库浏览</div>
          <div className="home-bank-info">
            <span>题库共 {total} 题</span>
            <span className="home-bank-progress">已刷 {doneCount}/{total}</span>
          </div>
          <button className="btn btn-qbank" onClick={onQuestionBank}>
            浏览全部题目
          </button>
        </div>

        <div className="home-section">
          <div className="home-section-title">📊 记录</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onHistory} style={{ flex: 1 }}>
              历史成绩{historyCount > 0 ? `（${historyCount}次）` : ''}
            </button>
            <button className="btn btn-reset-wrong" onClick={onResetWrong} title="清空所有错题记录" disabled={wrongCount === 0}>
              🗑️ 重置错题
            </button>
          </div>
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
