import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRACTICE_QUIZZES } from '../../data/sampleData';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Award, 
  ArrowRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const PracticeQuizModal: React.FC = () => {
  const { isQuizModalOpen, closeQuizModal, recordQuizResult, targetCareer } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isQuizModalOpen) return null;

  const currentQ = PRACTICE_QUIZZES[currentIndex];
  const totalQuestions = PRACTICE_QUIZZES.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      let score = 0;
      PRACTICE_QUIZZES.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer) {
          score += 1;
        }
      });
      // Include current question if submitted
      if (selectedOption === currentQ.correctAnswer) {
        score += 1;
      }

      setQuizFinished(true);
      recordQuizResult({
        date: 'Today',
        title: `${targetCareer.title} Skill Readiness Check`,
        score,
        total: totalQuestions,
        passed: score >= 4,
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizFinished(false);
  };

  const calculateFinalScore = () => {
    let score = 0;
    PRACTICE_QUIZZES.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Quick Practice Quiz
            </h3>
          </div>
          <button
            onClick={closeQuizModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {quizFinished ? (
          /* Finished Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Quiz Finished!</h4>
              <p className="text-sm text-slate-500 mt-1">
                Your score has been saved in your progress tracking records.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 max-w-xs mx-auto">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Your Score</p>
              <p className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums my-1">
                {calculateFinalScore()} / {totalQuestions}
              </p>
              <p className="text-xs font-medium text-slate-600">
                {calculateFinalScore() >= 4
                  ? 'Great job! You have a solid grasp of these concepts.'
                  : 'Good try! Keep learning and reviewing to strengthen your skills.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Try Again
              </button>
              <button
                onClick={closeQuizModal}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Quiz Question View */
          <div className="p-6 space-y-6">
            {/* Progress Bar & Index */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span className="font-semibold text-indigo-600">{currentQ.skillCategory}</span>
                <span className="font-mono tabular-nums">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';

                if (isAnswerSubmitted) {
                  if (idx === currentQ.correctAnswer) {
                    optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-500';
                  } else if (isSelected && idx !== currentQ.correctAnswer) {
                    optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-500';
                  } else {
                    optionStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${optionStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono font-bold shrink-0 text-[10px]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation when submitted */}
            {isAnswerSubmitted && (
              <div className={`p-4 rounded-xl text-xs leading-relaxed ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {selectedOption === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Correct!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      Not quite
                    </>
                  )}
                </div>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                No time limit • Learn at your own pace
              </span>
              <div>
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleCheckAnswer}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    {currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Results'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
