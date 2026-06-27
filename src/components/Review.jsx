const typeLabel = { '单选题': '单选', '多选题': '多选', '判断题': '判断' }
const typeClass = { '单选题': 'tag-single', '多选题': 'tag-multi', '判断题': 'tag-judge' }

export default function Review({ questions, answers, onHome }) {
  return (
    <div className="review-page">
      <div className="review-header">
        <h2>答题解析</h2>
        <button className="btn btn-secondary" onClick={onHome}>返回首页</button>
      </div>
      <div className="review-list">
        {questions.map((q, i) => {
          const userAns = answers[i] || []
          const correctAns = q.ca || []
          const isCorrect =
            userAns.slice().sort().join(',') === correctAns.slice().sort().join(',')

          return (
            <div key={i} className={`review-item ${isCorrect ? 'correct' : 'wrong'}`}>
              <div className="review-item-header">
                <span className={`type-tag ${typeClass[q.tp]}`}>{typeLabel[q.tp]}</span>
                <span className="review-num">第 {i + 1} 题</span>
                <span className={`review-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                  {isCorrect ? '✓ 正确' : '✗ 错误'}
                </span>
              </div>
              <div className="review-question">{q.q}</div>
              <div className="review-options">
                {q.o.map(opt => {
                  const isUser = userAns.includes(opt.l)
                  const isCorrectAns = correctAns.includes(opt.l)

                  let optClass = ''
                  if (isCorrectAns) optClass = 'opt-correct'
                  else if (isUser && !isCorrectAns) optClass = 'opt-user-wrong'

                  return (
                    <div key={opt.l} className={`review-option ${optClass}`}>
                      <span className="option-letter">{opt.l}.</span>
                      <span className="option-text">{opt.t}</span>
                      {isCorrectAns && <span className="opt-mark correct-mark">✓</span>}
                      {isUser && !isCorrectAns && <span className="opt-mark wrong-mark">✗</span>}
                    </div>
                  )
                })}
              </div>
              {q.e && <div className="review-explanation">💡 {q.e}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
