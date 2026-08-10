export function formatTime(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function normalizeAnswer(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/** @param {Exam} exam @param {StudentSubmission} submission @returns {ExamResult} */
export function gradeExam(exam, submission) {
  const results = exam.questions.map((question) => {
    const given = submission.answers[question.id]
    let correct = false
    let givenAnswer = null
    let correctAnswer = ''

    if (question.type === 'mcq' || question.type === 'true-false') {
      correctAnswer = question.options[question.correctIndex]
      correct = given === question.correctIndex
      givenAnswer = given == null ? null : question.options[given]
    } else {
      correctAnswer = question.acceptableAnswers[0]
      correct = question.acceptableAnswers.some(
        (answer) => normalizeAnswer(answer) === normalizeAnswer(given),
      )
      givenAnswer = given == null || given === '' ? null : String(given)
    }

    return {
      questionId: question.id,
      prompt: question.prompt,
      image: question.image,
      type: question.type,
      givenAnswer,
      correctAnswer,
      correct,
    }
  })

  const score = results.filter((result) => result.correct).length
  return {
    score,
    total: results.length,
    percentage: Math.round((score / results.length) * 100),
    timeTakenSeconds: submission.timeTakenSeconds,
    results,
  }
}
