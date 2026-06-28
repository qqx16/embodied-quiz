import { useState, useCallback, useMemo, useEffect } from 'react'
import Home from './components/Home'
import Exam from './components/Exam'
import Result from './components/Result'
import Review from './components/Review'
import History from './components/History'
import Favorites from './components/Favorites'
import QuestionBank from './components/QuestionBank'
import Practice from './components/Practice'
import ParticleEffect from './components/ParticleEffect'
import allQuestions from './data/questions.json'

const EXAM_SIZE = 100
const PASS_SCORE = 60
const WRONG_STORAGE_KEY = 'exam_wrong_questions'
const HISTORY_STORAGE_KEY = 'exam_history'
const FAVORITES_STORAGE_KEY = 'exam_favorites'
const DONE_STORAGE_KEY = 'exam_done_questions'
const BANK_Q_KEY = 'exam_bank_q'
const BANK_A_KEY = 'exam_bank_a'
const BANK_I_KEY = 'exam_bank_i'

function normalizeAns(arr) {
  return [...new Set(arr || [])].sort().join(',')
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadWrongSet() {
  try { return new Set(JSON.parse(localStorage.getItem(WRONG_STORAGE_KEY) || '[]')) }
  catch { return new Set() }
}
function saveWrongSet(s) {
  localStorage.setItem(WRONG_STORAGE_KEY, JSON.stringify([...s]))
}

function loadFavoritesSet() {
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]')) }
  catch { return new Set() }
}
function saveFavoritesSet(s) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...s]))
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]') }
  catch { return [] }
}
function saveHistory(h) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(h))
}

function loadDoneSet() {
  try { return new Set(JSON.parse(localStorage.getItem(DONE_STORAGE_KEY) || '[]')) }
  catch { return new Set() }
}
function saveDoneSet(s) {
  localStorage.setItem(DONE_STORAGE_KEY, JSON.stringify([...s]))
}

function recordScore(history, score, total, isWrong) {
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const entry = { score, total, isWrong, date }
  return [...history, entry]
}

export default function App() {
  const [page, setPage] = useState('home')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState(new Set())
  const [score, setScore] = useState(0)
  const [wrongSet, setWrongSet] = useState(loadWrongSet)
  const [wrongQuestions, setWrongQuestions] = useState([])
  const [wrongAnswers, setWrongAnswers] = useState({})
  const [wrongScore, setWrongScore] = useState(0)
  const [examHistory, setExamHistory] = useState(loadHistory)
  const [favoritesSet, setFavoritesSet] = useState(loadFavoritesSet)
  // Favorites exam state
  const [favQuestions, setFavQuestions] = useState([])
  const [favAnswers, setFavAnswers] = useState({})
  const [favScore, setFavScore] = useState(0)
  // 已答题追踪
  const [doneSet, setDoneSet] = useState(loadDoneSet)
  // 是否是刷题库模式（不计入历史成绩）
  const [isBankMode, setIsBankMode] = useState(false)

  useEffect(() => { saveWrongSet(wrongSet) }, [wrongSet])
  useEffect(() => { saveHistory(examHistory) }, [examHistory])
  useEffect(() => { saveFavoritesSet(favoritesSet) }, [favoritesSet])
  useEffect(() => { saveDoneSet(doneSet) }, [doneSet])

  // Auto-save bank exam progress
  useEffect(() => {
    if (isBankMode && page === 'exam') {
      saveBankProgress(answers, 0)
    }
  }, [answers, isBankMode, page, saveBankProgress])

  const startExam = useCallback(() => {
    const singles = shuffle(allQuestions.filter(q => q.tp === '单选题')).slice(0, 50)
    const multis = shuffle(allQuestions.filter(q => q.tp === '多选题')).slice(0, 25)
    const judges = shuffle(allQuestions.filter(q => q.tp === '判断题')).slice(0, 25)
    const pool = shuffle([...singles, ...multis, ...judges])
    setQuestions(pool)
    setAnswers({})
    setMarked(new Set())
    setScore(0)
    setIsBankMode(false)
    setPage('exam')
  }, [])

  // 刷题库：全部题目（不计入历史成绩）
  const startBankExam = useCallback(() => {
    const pool = shuffle(allQuestions)
    localStorage.setItem(BANK_Q_KEY, JSON.stringify(pool))
    localStorage.setItem(BANK_A_KEY, JSON.stringify({}))
    localStorage.setItem(BANK_I_KEY, '0')
    setQuestions(pool)
    setAnswers({})
    setMarked(new Set())
    setScore(0)
    setIsBankMode(true)
    setPage('exam')
  }, [])

  // 继续刷题库
  const resumeBankExam = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(BANK_Q_KEY) || 'null')
      if (!saved || saved.length === 0) return false
      const savedA = JSON.parse(localStorage.getItem(BANK_A_KEY) || '{}')
      const savedI = parseInt(localStorage.getItem(BANK_I_KEY) || '0')
      setQuestions(saved)
      setAnswers(savedA)
      setMarked(new Set())
      setScore(0)
      setIsBankMode(true)
      setPage('exam')
      return true
    } catch { return false }
  }, [])

  // 保存刷题库进度
  const saveBankProgress = useCallback((ans, idx) => {
    localStorage.setItem(BANK_A_KEY, JSON.stringify(ans))
    localStorage.setItem(BANK_I_KEY, String(idx))
  }, [])

  const submitExam = useCallback(() => {
    let correct = 0
    const newWrongs = new Set(wrongSet)
    questions.forEach((q, i) => {
      const userAns = normalizeAns(answers[i])
      const correctAns = normalizeAns(q.ca || [])
      if (userAns === correctAns) {
        correct++
        newWrongs.delete(q.n) // remove from wrong set if now correct
      } else {
        newWrongs.add(q.n) // add to wrong set
      }
    })
    setWrongSet(newWrongs)
    // Mark all questions as done
    const newDone = new Set(doneSet)
    questions.forEach(q => newDone.add(q.n))
    setDoneSet(newDone)
    const totalQ = questions.length
    const raw = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0
    setScore(raw)
    if (!isBankMode) {
      setExamHistory(recordScore(examHistory, raw, totalQ, false))
    } else {
      // Clear bank progress on submit
      localStorage.removeItem(BANK_Q_KEY)
      localStorage.removeItem(BANK_A_KEY)
      localStorage.removeItem(BANK_I_KEY)
    }
    setPage('result')
  }, [questions, answers, wrongSet, doneSet, examHistory, isBankMode])

  // Start wrong-question exam
  const startWrongExam = useCallback(() => {
    const wrongNs = [...wrongSet]
    if (wrongNs.length === 0) return
    const pool = shuffle(allQuestions.filter(q => wrongNs.includes(q.n)))
    setWrongQuestions(pool)
    setWrongAnswers({})
    setWrongScore(0)
    setPage('wrongExam')
  }, [wrongSet])

  // Submit wrong exam
  const submitWrongExam = useCallback(() => {
    let correct = 0
    const newWrongs = new Set(wrongSet)
    wrongQuestions.forEach((q, i) => {
      const userAns = normalizeAns(wrongAnswers[i])
      const correctAns = normalizeAns(q.ca || [])
      if (userAns === correctAns) {
        correct++
        newWrongs.delete(q.n)
      }
    })
    setWrongSet(newWrongs)
    const totalQ = wrongQuestions.length
    const raw = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0
    setWrongScore(raw)
    // 错题训练成绩不计入历史成绩
    setPage('wrongResult')
  }, [wrongQuestions, wrongAnswers, wrongSet])

  const goReview = useCallback(() => setPage('review'), [])
  const goWrongReview = useCallback(() => setPage('wrongReview'), [])
  // 重置错题本
  const resetWrongSet = useCallback(() => {
    setWrongSet(new Set())
  }, [])

  // 切换收藏
  const toggleFavorite = useCallback((questionNumber) => {
    setFavoritesSet(prev => {
      const next = new Set(prev)
      if (next.has(questionNumber)) next.delete(questionNumber)
      else next.add(questionNumber)
      return next
    })
  }, [])

  // 清空历史成绩
  const clearHistory = useCallback(() => {
    setExamHistory([])
  }, [])

  // 删除单条历史成绩
  const deleteHistoryEntry = useCallback((index) => {
    setExamHistory(prev => prev.filter((_, i) => i !== index))
  }, [])

  // 刷题库进度
  const bankProgress = useMemo(() => {
    try {
      const q = localStorage.getItem(BANK_Q_KEY)
      if (!q) return { has: false, answered: 0, total: 0 }
      const a = localStorage.getItem(BANK_A_KEY)
      return { has: true, answered: a ? Object.keys(JSON.parse(a)).length : 0, total: JSON.parse(q).length }
    } catch { return { has: false, answered: 0, total: 0 } }
  }, [])

  // 过滤掉错题训练记录（兼容旧数据）
  const normalHistory = useMemo(() => examHistory.filter(r => !r.isWrong), [examHistory])

  // 收藏夹浏览
  const goFavorites = useCallback(() => setPage('favorites'), [])

  // 收藏夹开始答题
  const startFavExam = useCallback(() => {
    const favNs = [...favoritesSet]
    if (favNs.length === 0) return
    const pool = shuffle(allQuestions.filter(q => favNs.includes(q.n)))
    setFavQuestions(pool)
    setFavAnswers({})
    setFavScore(0)
    setPage('favExam')
  }, [favoritesSet])

  const submitFavExam = useCallback(() => {
    let correct = 0
    favQuestions.forEach((q, i) => {
      const userAns = normalizeAns(favAnswers[i])
      const correctAns = normalizeAns(q.ca || [])
      if (userAns === correctAns) correct++
    })
    const totalQ = favQuestions.length
    const raw = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0
    setFavScore(raw)
    setPage('favResult')
  }, [favQuestions, favAnswers])

  const goFavReview = useCallback(() => setPage('favReview'), [])

  const goHome = useCallback(() => setPage('home'), [])
  const goHistory = useCallback(() => setPage('history'), [])

  // 重置刷题进度
  const resetDoneSet = useCallback(() => {
    setDoneSet(new Set())
  }, [])

  // 导入数据：从 JSON 文件恢复所有 localStorage 数据
  const importData = useCallback((jsonStr) => {
    try {
      const data = JSON.parse(jsonStr)
      if (data.wrongSet && Array.isArray(data.wrongSet)) {
        setWrongSet(new Set(data.wrongSet))
      }
      if (data.favoritesSet && Array.isArray(data.favoritesSet)) {
        setFavoritesSet(new Set(data.favoritesSet))
      }
      if (data.examHistory && Array.isArray(data.examHistory)) {
        setExamHistory(data.examHistory)
      }
      return true
    } catch { return false }
  }, [])

  if (page === 'home') {
    return (<>
      <ParticleEffect />
      <Home
        total={allQuestions.length}
        doneCount={doneSet.size}
        historyCount={normalHistory.length}
        onPractice={() => setPage('practice')}
        onQuestionBank={() => setPage('questionBank')}
        onHistory={goHistory}
        onImportData={importData}
      />
    </>)
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
        onHome={goHome}
        isBankMode={isBankMode}
        favoritesSet={favoritesSet}
        onToggleFavorite={toggleFavorite}
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
        wrongCount={wrongSet.size}
        onReview={goReview}
        onHome={goHome}
        onWrongExam={startWrongExam}
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
        favoritesSet={favoritesSet}
        onToggleFavorite={toggleFavorite}
      />
    </>)
  }

  if (page === 'wrongExam') {
    return (<>
      <ParticleEffect />
      <Exam
        questions={wrongQuestions}
        answers={wrongAnswers}
        setAnswers={setWrongAnswers}
        marked={new Set()}
        setMarked={() => {}}
        onSubmit={submitWrongExam}
        isWrongMode={true}
        favoritesSet={favoritesSet}
        onToggleFavorite={toggleFavorite}
      />
    </>)
  }

  if (page === 'wrongResult') {
    return (<>
      <ParticleEffect />
      <Result
        score={wrongScore}
        passScore={PASS_SCORE}
        total={wrongQuestions.length}
        questions={wrongQuestions}
        answers={wrongAnswers}
        wrongCount={wrongSet.size}
        onReview={goWrongReview}
        onHome={goHome}
        onWrongExam={startWrongExam}
        isWrongResult={true}
      />
    </>)
  }

  if (page === 'wrongReview') {
    return (<>
      <ParticleEffect />
      <Review
        questions={wrongQuestions}
        answers={wrongAnswers}
        onHome={goHome}
        favoritesSet={favoritesSet}
        onToggleFavorite={toggleFavorite}
      />
    </>)
  }

  if (page === 'history') {
    return (<>
      <ParticleEffect />
      <History
        history={examHistory}
        total={allQuestions.length}
        passScore={PASS_SCORE}
        onHome={goHome}
        onClearHistory={clearHistory}
        onDeleteEntry={deleteHistoryEntry}
      />
    </>)
  }

  if (page === 'favorites') {
    return (<>
      <ParticleEffect />
      <Favorites
        favoritesSet={favoritesSet}
        allQuestions={allQuestions}
        onHome={goHome}
        onStartExam={startFavExam}
        onToggleFavorite={toggleFavorite}
      />
    </>)
  }

  if (page === 'favExam') {
    return (<>
      <ParticleEffect />
      <Exam
        questions={favQuestions}
        answers={favAnswers}
        setAnswers={setFavAnswers}
        marked={new Set()}
        setMarked={() => {}}
        onSubmit={submitFavExam}
        isFavMode={true}
        favoritesSet={favoritesSet}
        onToggleFavorite={toggleFavorite}
      />
    </>)
  }

  if (page === 'favResult') {
    return (<>
      <ParticleEffect />
      <Result
        score={favScore}
        passScore={PASS_SCORE}
        total={favQuestions.length}
        questions={favQuestions}
        answers={favAnswers}
        wrongCount={wrongSet.size}
        onReview={goFavReview}
        onHome={goHome}
        onWrongExam={startWrongExam}
        isFavResult={true}
      />
    </>)
  }

  if (page === 'favReview') {
    return (<>
      <ParticleEffect />
      <Review
        questions={favQuestions}
        answers={favAnswers}
        onHome={goHome}
        favoritesSet={favoritesSet}
        onToggleFavorite={toggleFavorite}
      />
    </>)
  }

  if (page === 'questionBank') {
    return (<>
      <ParticleEffect />
      <QuestionBank
        allQuestions={allQuestions}
        doneSet={doneSet}
        wrongSet={wrongSet}
        favoritesSet={favoritesSet}
        onHome={goHome}
        onToggleFavorite={toggleFavorite}
      />
    </>)
  }

  if (page === 'practice') {
    return (<>
      <ParticleEffect />
      <Practice
        total={allQuestions.length}
        examSize={EXAM_SIZE}
        wrongCount={wrongSet.size}
        favCount={favoritesSet.size}
        doneCount={doneSet.size}
        hasBankProgress={bankProgress.has}
        bankAnswered={bankProgress.answered}
        bankTotal={bankProgress.total}
        onStart={startExam}
        onBankExam={startBankExam}
        onResumeBank={resumeBankExam}
        onWrongExam={startWrongExam}
        onResetWrong={resetWrongSet}
        onResetDone={resetDoneSet}
        onFavorites={goFavorites}
        onHome={goHome}
      />
    </>)
  }

  return null
}
