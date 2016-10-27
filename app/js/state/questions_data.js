'use strict';


const questionsData = require('../../content/questions.json');


const getAnswersInitialState = () => {
  const result = {};
  for (let i = 0; i < questionsData.length; ++i)
    result[questionsData[i].targetField] = null;
  return result;
};


const getQuestionData = (questionIndex) => questionsData[questionIndex];
const getQuestionsCount = () => questionsData.length;


const getQuestionsRoutes = (pages) => {
  const result = {};

  for (let i = 0; i < questionsData.length; ++i) {
    const routeId = '__question' + i + '__';
    const data = questionsData[i];
    result[routeId] = {
      title: 'DOMANDA ' + (i + 1),
      component: pages.custom.Question,
      props: {
        questionText: data.question,
        answers: data.answers,
        notes: data.notes,
        questionsCount: questionsData.length,
        questionIndex: i,
        targetField: data.targetField,
      },
    };
  }

  return result;
};


const getAnswersTranslations = () => {
  const translations = {};
  for (let i = 0; i < questionsData.length; ++i) {
    const data = questionsData[i];
    translations[data.targetField] = data.fieldTranslation;
  }
  return translations;
};


module.exports = {
  getQuestionsRoutes,
  getAnswersInitialState,
  getAnswersTranslations,
  getQuestionData,
  getQuestionsCount,
};
