export default function Practice({ total, examSize, wrongCount, favCount, doneCount, onStart, onWrongExam, onResetWrong, onFavorites, onQuestionBank, onHome }) {
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
          <button className="btn btn-qbank" onClick={onQuestionBank}>
            📚 刷题库
          </button>
          <button className="btn btn-wrong" onClick={onWrongExam} disabled={wrongCount === 0}>
            🔄 错题重练（{wrongCount} 题）
          </button>
          <button className="btn btn-fav-exam" onClick={onFavorites} disabled={favCount === 0}>
            ⭐ 收藏夹（{favCount} 题）
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={onHome} style={{ width: '100%' }}>
            ← 返回首页
          </button>
        </div>

        {wrongCount > 0 && (
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <button className="btn btn-reset-wrong" onClick={onResetWrong} title="清空所有错题记录">
              🗑️ 重置错题
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
