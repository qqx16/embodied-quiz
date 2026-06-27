import { useState, useMemo } from 'react'

const typeLabel = { '单选题': '单选', '多选题': '多选', '判断题': '判断' }
const typeClass = { '单选题': 'tag-single', '多选题': 'tag-multi', '判断题': 'tag-judge' }

export default function QuestionBank({ allQuestions, doneSet, wrongSet, favoritesSet, onHome, onToggleFavorite }) {
  const [filter, setFilter] = useState('all') // all | done | undone | wrong

  const filtered = useMemo(() => {
    switch (filter) {
      case 'done': return allQuestions.filter(q => doneSet.has(q.n))
      case 'undone': return allQuestions.filter(q => !doneSet.has(q.n))
      case 'wrong': return allQuestions.filter(q => wrongSet.has(q.n))
      default: return allQuestions
    }
  }, [allQuestions, doneSet, wrongSet, filter])

  const doneCount = doneSet.size
  const totalCount = allQuestions.length
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  return (
    <div className="qb-page">
      <div className="qb-header">
        <button className="btn btn-secondary" onClick={onHome}>← 返回首页</button>
        <h2>📚 题库浏览</h2>
        <div></div>
      </div>

      {/* Progress bar */}
      <div className="qb-progress animate-in">
        <div className="qb-progress-info">
          <span>刷题进度</span>
          <span className="qb-progress-num">{doneCount} / {totalCount}（{pct}%）</span>
        </div>
        <div className="qb-progress-bar">
          <div className="qb-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="qb-tabs animate-in" style={{ animationDelay: '0.05s' }}>
        {[
          { key: 'all', label: `全部（${totalCount}）` },
          { key: 'undone', label: `未做（${totalCount - doneCount}）` },
          { key: 'done', label: `已做（${doneCount}）` },
          { key: 'wrong', label: `错题（${wrongSet.size}）` }
        ].map(t => (
          <button
            key={t.key}
            className={`qb-tab ${filter === t.key ? 'qb-tab-active' : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Question list */}
      <div className="qb-list">
        {filtered.map((q, i) => {
          const isDone = doneSet.has(q.n)
          const isWrong = wrongSet.has(q.n)
          const isFav = favoritesSet.has(q.n)
          return (
            <div key={q.n} className={`qb-item animate-in ${isDone ? 'qb-done' : ''} ${isWrong ? 'qb-wrong' : ''}`} style={{ animationDelay: `${0.02 * (i % 20)}s` }}>
              <div className="qb-item-header">
                <span className={`qb-type-tag ${typeClass[q.tp] || ''}`}>{typeLabel[q.tp] || q.tp}</span>
                <span className="qb-num">第 {q.n} 题</span>
                <span className="qb-status">
                  {isWrong ? '❌' : isDone ? '✅' : '⬜'}
                </span>
                <button
                  className={`btn-fav ${isFav ? 'fav-active' : ''}`}
                  onClick={() => onToggleFavorite(q.n)}
                  title={isFav ? '取消收藏' : '收藏此题'}
                  style={{ marginLeft: 'auto' }}
                >
                  {isFav ? '⭐' : '☆'}
                </button>
              </div>
              <div className="qb-question">{q.q}</div>
              <div className="qb-options">
                {q.o.map(opt => (
                  <div key={opt.l} className={`qb-opt ${q.ca.includes(opt.l) ? 'qb-opt-correct' : ''}`}>
                    <span className="qb-opt-label">{opt.l}</span>
                    <span>{opt.t}</span>
                  </div>
                ))}
              </div>
              {q.e && <div className="qb-explanation">💡 {q.e}</div>}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="qb-empty">没有匹配的题目</div>
        )}
      </div>
    </div>
  )
}
