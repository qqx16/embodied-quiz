export default function Home({ total, passScore, wrongCount, favCount, historyCount, onStart, onWrongExam, onResetWrong, onHistory, onFavorites }) {
  return (
    <div className="home-page">
      <div className="home-card">
        <h1 className="home-title">赛道二 具身智能数据采集与处理</h1>
        <p className="home-subtitle">刷题训练</p>
        <div className="home-info">
          <div className="info-item">
            <span className="info-icon">📝</span>
            <span>共 {total} 题（随机抽取）</span>
          </div>
          <div className="info-item">
            <span className="info-icon">💯</span>
            <span>满分 100 分</span>
          </div>
          <div className="info-item">
            <span className="info-icon">✅</span>
            <span>及格 {passScore} 分</span>
          </div>
        </div>
        <button className="btn btn-primary btn-start" onClick={onStart}>
          开始答题
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
      </div>
    </div>
  )
}
