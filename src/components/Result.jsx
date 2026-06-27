export default function Result({ score, passScore, total, questions, answers, onReview, onHome }) {
  const passed = score >= passScore

  let correctCount = 0
  questions.forEach((q, i) => {
    const userAns = (answers[i] || []).slice().sort().join(',')
    const correctAns = (q.ca || []).slice().sort().join(',')
    if (userAns === correctAns) correctCount++
  })
  const wrongCount = total - correctCount

  return (
    <div className="result-page">
      <div className="result-card">
        <div className={`result-score-circle ${passed ? 'passed' : 'failed'}`}>
          <span className="score-num">{score}</span>
          <span className="score-total">/100</span>
        </div>
        <div className={`result-status ${passed ? 'passed' : 'failed'}`}>
          {passed ? '🎉 恭喜及格！' : '😞 未及格，继续加油！'}
        </div>
        <div className="result-stats">
          <div className="stat-item correct">
            <span className="stat-num">{correctCount}</span>
            <span className="stat-label">正确</span>
          </div>
          <div className="stat-item wrong">
            <span className="stat-num">{wrongCount}</span>
            <span className="stat-label">错误</span>
          </div>
          <div className="stat-item total">
            <span className="stat-num">{total}</span>
            <span className="stat-label">总题数</span>
          </div>
        </div>
        <div className="result-actions">
          <button className="btn btn-primary" onClick={onReview}>查看答题解析</button>
          <button className="btn btn-secondary" onClick={onHome}>返回首页</button>
        </div>
      </div>
    </div>
  )
}
