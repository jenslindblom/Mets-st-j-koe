
import React from 'react';
import { Question, QuestionType } from '../types';
import SafeImage from './SafeImage';

interface Props {
  question: Question;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showFeedback?: boolean;
}

const QuestionDisplay: React.FC<Props> = ({ question, selectedAnswer, onSelect, showFeedback }) => {
  const getBadgeColor = (type: QuestionType) => {
    switch (type) {
      case QuestionType.IDENTIFICATION: return 'bg-blue-100 text-blue-800';
      case QuestionType.SAFETY: return 'bg-red-100 text-red-800';
      case QuestionType.REGULATION: return 'bg-purple-100 text-purple-800';
      case QuestionType.ETHICS: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getBadgeColor(question.type)}`}>
          {question.type}
        </span>
        <span className="text-sm text-gray-500 italic">Vaikeustaso: {question.difficulty}</span>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-tight">
        {question.question}
      </h2>

      {question.imageUrl && (
        <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
          <SafeImage 
            src={question.imageUrl} 
            fallback={question.fallbackImageUrl}
            alt="Lajitunnistus" 
            className="w-full h-64 md:h-96"
          />
          {question.imageCaption && (
            <div className="p-3 bg-gray-800 text-white text-sm italic">
              {question.imageCaption}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {question.options.map((option, index) => {
          let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ";
          
          if (showFeedback) {
            if (index === question.correctIndex) {
              buttonClass += "border-green-500 bg-green-50 text-green-900";
            } else if (index === selectedAnswer) {
              buttonClass += "border-red-500 bg-red-50 text-red-900";
            } else {
              buttonClass += "border-gray-200 text-gray-400 opacity-60";
            }
          } else {
            if (index === selectedAnswer) {
              buttonClass += "border-amber-600 bg-amber-50 text-amber-900 shadow-sm";
            } else {
              buttonClass += "border-gray-200 hover:border-amber-300 hover:bg-gray-50 text-gray-700";
            }
          }

          return (
            <button
              key={index}
              disabled={showFeedback}
              onClick={() => onSelect(index)}
              className={buttonClass}
            >
              <span className="flex-1">{option}</span>
              {showFeedback && index === question.correctIndex && (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {showFeedback && index === selectedAnswer && index !== question.correctIndex && (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-1">Miksi näin?</h4>
          <p className="text-amber-800">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
