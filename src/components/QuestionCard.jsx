const typeLabel = { '单选题': '单选', '多选题': '多选', '判断题': '判断' }
const typeClass = { '单选题': 'tag-single', '多选题': 'tag-multi', '判断题': 'tag-judge' }

export default function QuestionCard({ question, index, answers, setAnswers, marked, setMarked, favoritesSet, onToggleFavorite }) {
  const q = question
  const selected = answers[index] || []
  const isMulti = q.tp === '多选题'

  const toggleOption = (letter) => {
    setAnswers(prev => {
      const cur = [...(prev[index] || [])]
      if (cur.includes(letter)) {
        return { ...prev, [index]: cur.filter(l => l !== letter) }
      }
      if (isMulti) {
        return { ...prev, [index]: [...cur, letter] }
      }
      return { ...prev, [index]: [letter] }
    })
  }

  const toggleMark = () => {
    setMarked(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className={`type-tag ${typeClass[q.tp]}`}>{typeLabel[q.tp]}</span>
        <span className="question-num">第 {index + 1} 题</span>
        {onToggleFavorite && (
          <button
            className={`btn-fav ${favoritesSet && favoritesSet.has(q.n) ? 'fav-active' : ''}`}
            onClick={() => onToggleFavorite(q.n)}
            title={favoritesSet && favoritesSet.has(q.n) ? '取消收藏' : '收藏此题'}
          >
            {favoritesSet && favoritesSet.has(q.n) ? '⭐' : '☆'}
          </button>
        )}
        <button
          className={`btn-mark ${marked.has(index) ? 'marked' : ''}`}
          onClick={toggleMark}
          title="标记此题"
        >
          {marked.has(index) ? '🏴' : '🚩'}
        </button>
      </div>
      <div className="question-text">{q.q}</div>
      <div className="options-list">
        {q.o.map(opt => {
          const isSelected = selected.includes(opt.l)
          return (
            <div
              key={opt.l}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleOption(opt.l)}
            >
              <span className={`option-radio ${isMulti ? 'checkbox' : 'radio'} ${isSelected ? 'checked' : ''}`}>
                {isSelected ? (isMulti ? '☑' : '●') : (isMulti ? '☐' : '○')}
              </span>
              <span className="option-letter">{opt.l}.</span>
              <span className="option-text">{opt.t}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
