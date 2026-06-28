export default function Practice({ total, examSize, wrongCount, favCount, doneCount, hasBankProgress, bankAnswered, bankTotal, onStart, onBankExam, onResumeBank, onWrongExam, onResetWrong, onResetDone, onFavorites, onHome }) {
  return (
    <div className="home-page">
      <div className="home-card">
        <h1 className="home-title">赛道二 具身智能数据采集与处理</h1>
        <p className="home-subtitle">刷题训练</p>

        <div className="home-section">
          <div className="home-bank-info">
            <span>题库 {total} 题</span>
            <span className="home-bank-progress">已刷 {doneCount}/{total}</span>
          </div>
          <button className="btn btn-primary btn-start" onClick={onStart}>
            📝 模拟答题（{examSize}题随机）
          </button>
          <button className="btn btn-bank" onClick={onBankExam}>
            📚 刷题库（{total}题）
          </button>
          {hasBankProgress && (
            <button className="btn btn-bank" onClick={onResumeBank} style={{ background: '#e9c46a', color: '#1a1a1a', boxShadow: '4px 4px 0 #b8960b' }}>
              ▶ 继续刷题（已答{bankAnswered}/{bankTotal}）
            </button>
          )}
          <button className="btn btn-wrong" onClick={onWrongExam} disabled={wrongCount === 0}>
            🔄 错题重练（{wrongCount} 题）
          </button>
          <button className="btn btn-fav-exam" onClick={onFavorites} disabled={favCount === 0}>
            ⭐ 收藏夹（{favCount} 题）
          </button>
        </div>

        <button className="btn btn-secondary" onClick={onHome}>
          ← 返回首页
        </button>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {wrongCount > 0 && (
            <button className="btn btn-reset-wrong" onClick={onResetWrong} title="清空所有错题记录" style={{ flex: 1 }}>
              🗑️ 重置错题
            </button>
          )}
          {doneCount > 0 && (
            <button className="btn btn-reset-wrong" onClick={onResetDone} title="清空刷题进度" style={{ flex: 1 }}>
              🔄 重置进度
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
