import { useState, useCallback, useMemo } from 'react'
import Home from './components/Home'
import Exam from './components/Exam'
import Result from './components/Result'
import Review from './components/Review'
import ParticleEffect from './components/ParticleEffect'
import allQuestions from './data/questions.json'

const TOTAL_QUESTIONS = 100
const PASS_SCORE = 60

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function App() {
  const [page, setPage] = useState('home') // home | exam | result | review
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState(new Set())
  const [score, setScore] = useState(0)

  const total = useMemo(() => Math.min(questions.length, TOTAL_QUESTIONS), [questions])

  const startExam = useCallback(() => {
    const pool = allQuestions.length > TOTAL_QUESTIONS
      ? shuffle(allQuestions).slice(0, TOTAL_QUESTIONS)
      : shuffle(allQuestions)
    setQuestions(pool)
    setAnswers({})
    setMarked(new Set())
    setScore(0)
    setPage('exam')
  }, [])

  const submitExam = useCallback(() => {
    let correct = 0
    questions.forEach((q, i) => {
      const userAns = (answers[i] || []).slice().sort().join(',')
      const correctAns = (q.ca || []).slice().sort().join(',')
      if (userAns === correctAns) correct++
    })
    const totalQ = questions.length
    const raw = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0
    setScore(raw)
    setPage('result')
  }, [questions, answers])

  const goReview = useCallback(() => setPage('review'), [])

  const goHome = useCallback(() => setPage('home'), [])

  if (page === 'home') {
    return (<><ParticleEffect /><Home total={100} passScore={PASS_SCORE} onStart={startExam} /></>)
  }

  if (page === 'exam') {
    return (<>
      <ParticleEffect />
      <Exam
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        marked={marked}
        setMarked={setMarked}
        onSubmit={submitExam}
      />
    </>)
  }

  if (page === 'result') {
    return (<>
      <ParticleEffect />
      <Result
        score={score}
        passScore={PASS_SCORE}
        total={questions.length}
        questions={questions}
        answers={answers}
        onReview={goReview}
        onHome={goHome}
      />
    </>)
  }

  if (page === 'review') {
    return (<>
      <ParticleEffect />
      <Review
        questions={questions}
        answers={answers}
        onHome={goHome}
      />
    </>)
  }

  return null
}
