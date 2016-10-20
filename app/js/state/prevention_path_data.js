'use strict';

import { AgeRange } from '../misc';
import paragraphs from './prevention_path_paragraphs';



/* eslint-disable quote-props */
const data = [
  // Question 1 -> Screening Mammografico
  {
    'SÌ': {
      [AgeRange.LESS_THAN_45]: paragraphs.screeningYesLessThan45,
      [AgeRange.FROM_45_TO_49]: paragraphs.screeningYesFrom45To49,
      [AgeRange.FROM_50_TO_69]: paragraphs.screeningYesFrom50To69,
      [AgeRange.FROM_70_TO_74]: paragraphs.screeningYesFrom70To74,
      [AgeRange.MORE_THAN_74]: paragraphs.screeningYesMoreThan74,
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: paragraphs.screeningNoLessThan45,
      [AgeRange.FROM_45_TO_49]: paragraphs.screeningNoFrom45To74,
      [AgeRange.FROM_50_TO_69]: paragraphs.screeningNoFrom45To74,
      [AgeRange.FROM_70_TO_74]: paragraphs.screeningNoFrom45To74,
      [AgeRange.MORE_THAN_74]: paragraphs.screeningNoMoreThan74,
    },
  },
  // Question 2 -> Mammografia
  {
    'SÌ': {
      [AgeRange.LESS_THAN_45]: paragraphs.mammografiaYesLessThan45,
      [AgeRange.FROM_45_TO_49]: paragraphs.mammografiaYesFrom45To49,
      [AgeRange.FROM_50_TO_69]: paragraphs.mammografiaYesFrom50To69,
      [AgeRange.FROM_70_TO_74]: paragraphs.mammografiaYesFrom70To74,
      [AgeRange.MORE_THAN_74]: paragraphs.mammografiaYesMoreThan74,
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: paragraphs.mammografiaNoLessThan45,
      [AgeRange.FROM_45_TO_49]: paragraphs.mammografiaNoFrom45To49,
      [AgeRange.FROM_50_TO_69]: paragraphs.mammografiaNoFrom50To74,
      [AgeRange.FROM_70_TO_74]: paragraphs.mammografiaNoFrom50To74,
      [AgeRange.MORE_THAN_74]: paragraphs.mammografiaNoMoreThan74,
    },
  },
  // Question 3 -> Tumore Mammella
  {
    'SÌ': {
      [AgeRange.LESS_THAN_45]: paragraphs.tumoreYes,
      [AgeRange.FROM_45_TO_49]: paragraphs.tumoreYes,
      [AgeRange.FROM_50_TO_69]: paragraphs.tumoreYes,
      [AgeRange.FROM_70_TO_74]: paragraphs.tumoreYes,
      [AgeRange.MORE_THAN_74]: paragraphs.tumoreYes,
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: paragraphs.tumoreNo,
      [AgeRange.FROM_45_TO_49]: paragraphs.tumoreNo,
      [AgeRange.FROM_50_TO_69]: paragraphs.tumoreNo,
      [AgeRange.FROM_70_TO_74]: paragraphs.tumoreNo,
      [AgeRange.MORE_THAN_74]: paragraphs.tumoreNo,
    },
  },
  // Question 4 -> Fumo
  {
    'SÌ': {
      [AgeRange.LESS_THAN_45]: paragraphs.fumoYes,
      [AgeRange.FROM_45_TO_49]: paragraphs.fumoYes,
      [AgeRange.FROM_50_TO_69]: paragraphs.fumoYes,
      [AgeRange.FROM_70_TO_74]: paragraphs.fumoYes,
      [AgeRange.MORE_THAN_74]: paragraphs.fumoYes,
    },
    'SÌ (in passato)': {
      [AgeRange.LESS_THAN_45]: paragraphs.fumoYesInThePast,
      [AgeRange.FROM_45_TO_49]: paragraphs.fumoYesInThePast,
      [AgeRange.FROM_50_TO_69]: paragraphs.fumoYesInThePast,
      [AgeRange.FROM_70_TO_74]: paragraphs.fumoYesInThePast,
      [AgeRange.MORE_THAN_74]: paragraphs.fumoYesInThePast,
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: paragraphs.fumoNo,
      [AgeRange.FROM_45_TO_49]: paragraphs.fumoNo,
      [AgeRange.FROM_50_TO_69]: paragraphs.fumoNo,
      [AgeRange.FROM_70_TO_74]: paragraphs.fumoNo,
      [AgeRange.MORE_THAN_74]: paragraphs.fumoNo,
    },
  },
  // Question 5 -> Alcool
  {
    'SÌ (< 1 unità/gg)': {
      [AgeRange.LESS_THAN_45]: paragraphs.alcoolYesLessThan1,
      [AgeRange.FROM_45_TO_49]: paragraphs.alcoolYesLessThan1,
      [AgeRange.FROM_50_TO_69]: paragraphs.alcoolYesLessThan1,
      [AgeRange.FROM_70_TO_74]: paragraphs.alcoolYesLessThan1,
      [AgeRange.MORE_THAN_74]: paragraphs.alcoolYesLessThan1,
    },
    'SÌ (> 1 unità/gg)': {
      [AgeRange.LESS_THAN_45]: paragraphs.alcoolYesMoreThan1,
      [AgeRange.FROM_45_TO_49]: paragraphs.alcoolYesMoreThan1,
      [AgeRange.FROM_50_TO_69]: paragraphs.alcoolYesMoreThan1,
      [AgeRange.FROM_70_TO_74]: paragraphs.alcoolYesMoreThan1,
      [AgeRange.MORE_THAN_74]: paragraphs.alcoolYesMoreThan1,
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: paragraphs.alcoolNo,
      [AgeRange.FROM_45_TO_49]: paragraphs.alcoolNo,
      [AgeRange.FROM_50_TO_69]: paragraphs.alcoolNo,
      [AgeRange.FROM_70_TO_74]: paragraphs.alcoolNo,
      [AgeRange.MORE_THAN_74]: paragraphs.alcoolNo,
    },
  },
  // Question 6 -> Attività Fisica
  {
    'SÌ (moderata)': {
      [AgeRange.LESS_THAN_45]: paragraphs.fitnessYesModerate,
      [AgeRange.FROM_45_TO_49]: paragraphs.fitnessYesModerate,
      [AgeRange.FROM_50_TO_69]: paragraphs.fitnessYesModerate,
      [AgeRange.FROM_70_TO_74]: paragraphs.fitnessYesModerate,
      [AgeRange.MORE_THAN_74]: paragraphs.fitnessYesModerate,
    },
    'SÌ (intensa)': {
      [AgeRange.LESS_THAN_45]: paragraphs.fitnessYesIntense,
      [AgeRange.FROM_45_TO_49]: paragraphs.fitnessYesIntense,
      [AgeRange.FROM_50_TO_69]: paragraphs.fitnessYesIntense,
      [AgeRange.FROM_70_TO_74]: paragraphs.fitnessYesIntense,
      [AgeRange.MORE_THAN_74]: paragraphs.fitnessYesIntense,
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: paragraphs.fitnessNo,
      [AgeRange.FROM_45_TO_49]: paragraphs.fitnessNo,
      [AgeRange.FROM_50_TO_69]: paragraphs.fitnessNo,
      [AgeRange.FROM_70_TO_74]: paragraphs.fitnessNo,
      [AgeRange.MORE_THAN_74]: paragraphs.fitnessNo,
    },
  },
];
/* eslint-enable quote-props */


const getParagraphFromUserAnswer = (questionIndex, answerValue, ageRange) => {
  console.log(questionIndex);
  console.log(answerValue);
  console.log(ageRange);
  return data[questionIndex][answerValue][ageRange];
};


module.exports = {
  getParagraphFromUserAnswer,
};
