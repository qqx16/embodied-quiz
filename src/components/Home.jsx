export default function Home({ total, passScore, onStart }) {
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
      </div>
    </div>
  )
}
