export default function Result({ score, passScore, total, questions, answers, wrongCount, onReview, onHome, onWrongExam, isWrongResult, isFavResult }) {
  const passed = score >= passScore

  let correctCount = 0
  questions.forEach((q, i) => {
    const userAns = (answers[i] || []).slice().sort().join(',')
    const correctAns = (q.ca || []).slice().sort().join(',')
    if (userAns === correctAns) correctCount++
  })
  const wrongCountThis = total - correctCount

  return (
    <div className="result-page">
      <div className="result-card">
        <div className={`result-score-circle ${passed ? 'passed' : 'failed'}`}>
          <span className="score-num">{score}</span>
          <span className="score-total">/100</span>
        </div>
        <div className={`result-status ${passed ? 'passed' : 'failed'}`}>
          {isWrongResult
            ? (passed ? '🎉 错题全部攻克！' : '继续加油，消灭错题！')
            : isFavResult
            ? (passed ? '🎉 收藏题目挑战成功！' : '继续加油，收藏题目再练！')
            : (passed ? '🎉 恭喜及格！' : '😞 未及格，继续加油！')
          }
        </div>
        <div className="result-stats">
          <div className="stat-item correct">
            <span className="stat-num">{correctCount}</span>
            <span className="stat-label">正确</span>
          </div>
          <div className="stat-item wrong">
            <span className="stat-num">{wrongCountThis}</span>
            <span className="stat-label">错误</span>
          </div>
          <div className="stat-item total">
            <span className="stat-num">{total}</span>
            <span className="stat-label">总题数</span>
          </div>
        </div>
        <div className="result-actions">
          {!isWrongResult && !isFavResult && (
            <button className="btn btn-primary" onClick={onReview}>查看答题解析</button>
          )}
          {isWrongResult && (
            <button className="btn btn-primary" onClick={onReview}>查看错题解析</button>
          )}
          {isFavResult && (
            <button className="btn btn-primary" onClick={onReview}>查看收藏题目解析</button>
          )}
          {wrongCount > 0 && (
            <button className="btn btn-wrong" onClick={onWrongExam}>
              🔄 错题重练（{wrongCount} 题）
            </button>
          )}
          <button className="btn btn-secondary" onClick={onHome}>返回首页</button>
        </div>
      </div>
    </div>
  )
}
