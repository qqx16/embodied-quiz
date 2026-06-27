import { useState, useCallback } from 'react'
import QuestionCard from './QuestionCard'
import AnswerSheet from './AnswerSheet'
import ConfirmModal from './ConfirmModal'

export default function Exam({ questions, answers, setAnswers, marked, setMarked, onSubmit }) {
  const [current, setCurrent] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const total = questions.length

  const goPrev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])
  const goNext = useCallback(() => setCurrent(c => Math.min(total - 1, c + 1)), [total])

  const handleSubmit = useCallback(() => {
    setShowConfirm(true)
  }, [])

  const confirmSubmit = useCallback(() => {
    setShowConfirm(false)
    onSubmit()
  }, [onSubmit])

  const cancelSubmit = useCallback(() => setShowConfirm(false), [])

  const answeredCount = Object.values(answers).filter(a => a && a.length > 0).length

  return (
    <div className="exam-page">
      {/* Top bar */}
      <div className="exam-topbar">
        <span className="exam-progress">{current + 1} / {total}</span>
        <span className="exam-stats">已答 {answeredCount} 题</span>
        <button
          className="btn btn-sheet-toggle"
          onClick={() => setSheetOpen(o => !o)}
        >
          {sheetOpen ? '隐藏答题卡' : '答题卡'}
        </button>
        <button className="btn btn-submit" onClick={handleSubmit}>交卷</button>
      </div>

      <div className="exam-body">
        {/* Side answer sheet (desktop) */}
        <aside className="exam-sidebar">
          <AnswerSheet
            total={total}
            answers={answers}
            marked={marked}
            currentIndex={current}
            onJump={setCurrent}
          />
        </aside>

        {/* Main question area */}
        <main className="exam-main">
          <QuestionCard
            question={questions[current]}
            index={current}
            answers={answers}
            setAnswers={setAnswers}
            marked={marked}
            setMarked={setMarked}
          />
          <div className="exam-nav">
            <button className="btn btn-nav" onClick={goPrev} disabled={current === 0}>
              ← 上一题
            </button>
            <span className="nav-indicator">{current + 1} / {total}</span>
            <button className="btn btn-nav" onClick={goNext} disabled={current === total - 1}>
              下一题 →
            </button>
          </div>
        </main>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <div className="sheet-overlay" onClick={() => setSheetOpen(false)}>
          <div className="sheet-popup" onClick={e => e.stopPropagation()}>
            <AnswerSheet
              total={total}
              answers={answers}
              marked={marked}
              currentIndex={current}
              onJump={(i) => { setCurrent(i); setSheetOpen(false) }}
            />
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message={`您已完成 ${answeredCount}/${total} 题，确定要交卷吗？交卷后将无法修改答案。`}
          onConfirm={confirmSubmit}
          onCancel={cancelSubmit}
        />
      )}
    </div>
  )
}
