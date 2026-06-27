const typeLabel = { '单选题': '单选', '多选题': '多选', '判断题': '判断' }
const typeClass = { '单选题': 'tag-single', '多选题': 'tag-multi', '判断题': 'tag-judge' }

export default function Favorites({ favoritesSet, allQuestions, onHome, onStartExam, onToggleFavorite }) {
  const favQuestions = allQuestions.filter(q => favoritesSet.has(q.n))

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <button className="btn btn-secondary" onClick={onHome}>← 返回首页</button>
        <h2>⭐ 收藏夹</h2>
        <div>
          {favQuestions.length > 0 && (
            <button className="btn btn-fav-exam" onClick={onStartExam}>
              📝 收藏题目答题（{favQuestions.length} 题）
            </button>
          )}
        </div>
      </div>

      <div className="favorites-content">
        {favQuestions.length === 0 ? (
          <div className="favorites-empty">
            <div className="empty-icon">⭐</div>
            <p>收藏夹为空</p>
            <p className="empty-hint">在答题或查看解析时点击 ☆ 即可收藏题目</p>
          </div>
        ) : (
          <div className="favorites-list">
            {favQuestions.map((q, i) => (
              <div key={q.n} className="fav-item">
                <div className="fav-item-header">
                  <span className={`type-tag ${typeClass[q.tp]}`}>{typeLabel[q.tp]}</span>
                  <span className="fav-num">#{q.n}</span>
                  <span className="fav-index">第 {i + 1} 题</span>
                  <button
                    className={`btn-fav fav-active`}
                    onClick={() => onToggleFavorite(q.n)}
                    title="取消收藏"
                    style={{ marginLeft: 'auto', fontSize: '1.2rem' }}
                  >
                    ⭐
                  </button>
                </div>
                <div className="fav-question">{q.q}</div>
                <div className="fav-options">
                  {q.o.map(opt => {
                    const isCorrectAns = (q.ca || []).includes(opt.l)
                    return (
                      <div key={opt.l} className={`fav-option ${isCorrectAns ? 'opt-correct' : ''}`}>
                        <span className="option-letter">{opt.l}.</span>
                        <span className="option-text">{opt.t}</span>
                        {isCorrectAns && <span className="opt-mark correct-mark">✓</span>}
                      </div>
                    )
                  })}
                </div>
                {q.e && <div className="fav-explanation">💡 {q.e}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
