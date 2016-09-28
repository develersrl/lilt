'use strict';


const questionsData = require('../../content/questions.json');


const getAnswersInitialState = () => {
  const result = {};
  for (let i = 0; i < questionsData.length; ++i)
    result[questionsData[i].targetField] = null;
  return result;
};


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
        questionsCount: questionsData.length,
        questionIndex: i,
        targetField: data.targetField,
      },
    };
  }

  return result;
};


module.exports = {
  getQuestionsRoutes,
  getAnswersInitialState,
};
