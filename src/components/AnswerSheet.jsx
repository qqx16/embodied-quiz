export default function AnswerSheet({ total, answers, marked, currentIndex, onJump }) {
  return (
    <div className="answer-sheet">
      <div className="sheet-title">答题卡</div>
      <div className="sheet-legend">
        <span><span className="dot answered"></span> 已答</span>
        <span><span className="dot unanswered"></span> 未答</span>
        <span><span className="dot flagged"></span> 标记</span>
        <span><span className="dot current"></span> 当前</span>
      </div>
      <div className="sheet-grid">
        {Array.from({ length: total }, (_, i) => {
          const answered = answers[i] && answers[i].length > 0
          const isMarked = marked.has(i)
          const isCurrent = i === currentIndex
          let cls = 'sheet-num'
          if (isCurrent) cls += ' current'
          else if (isMarked) cls += ' flagged'
          else if (answered) cls += ' answered'
          return (
            <button key={i} className={cls} onClick={() => onJump(i)}>
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
