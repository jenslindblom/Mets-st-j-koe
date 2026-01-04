
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { getDeepExplanation } from '../services/geminiService';

interface Props {
  question: Question;
  selectedAnswer: number;
  onNext: () => void;
  onClose: () => void;
  isLast: boolean;
}

const FeedbackModal: React.FC<Props> = ({ question, selectedAnswer, onNext, onClose, isLast }) => {
  const isCorrect = selectedAnswer === question.correctIndex;
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchAiExplanation = async () => {
      setLoadingAi(true);
      const text = await getDeepExplanation(
        question.question,
        question.options[selectedAnswer],
        question.options[question.correctIndex],
        question.explanation // Lähetetään lajitieto mukaan
      );
      setAiExplanation(text);
      setLoadingAi(false);
    };

    fetchAiExplanation();
  }, [question, selectedAnswer]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden transform transition-all animate-scale-up">
        <div className={`p-6 text-center ${isCorrect ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            {isCorrect ? (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isCorrect ? 'Oikein!' : 'Väärin meni'}
          </h2>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Oikea vastaus oli:</h4>
            <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {question.options[question.correctIndex]}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Perustelu:</h4>
            <p className="text-gray-700 leading-relaxed">
              {question.explanation}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <h4 className="text-sm font-bold text-amber-700 uppercase tracking-widest">Kouluttajan vinkki:</h4>
            </div>
            {loadingAi ? (
              <div className="flex items-center space-x-3 text-gray-400 italic text-sm">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-amber-600 rounded-full animate-spin"></div>
                <span>Kysytään vinkkiä asiantuntijalta...</span>
              </div>
            ) : (
              <p className="text-sm text-stone-600 italic bg-amber-50 p-4 rounded-xl border border-amber-100 leading-relaxed">
                "{aiExplanation}"
              </p>
            )}
          </div>

          <div className="flex space-x-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              Tarkastele
            </button>
            <button
              onClick={onNext}
              className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] ${
                isCorrect ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isLast ? 'Katso tulokset' : 'Seuraava kysymys'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
