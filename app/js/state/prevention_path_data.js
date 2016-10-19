'use strict';

import { AgeRange } from '../misc';

/* eslint-disable quote-props */
const data = [
  // Question 1 -> Screening Mammografico
  {
    'SÌ': {
      [AgeRange.LESS_THAN_45]: "Screening YES LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Screening YES FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Screening YES FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Screening YES FROM_70_TO_74",
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: "Screening NO LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Screening NO FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Screening NO FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Screening NO FROM_70_TO_74",
    },
  },
  // Question 2 -> Mammografia
  {
    'SÌ': {
      [AgeRange.LESS_THAN_45]: "Mammografia YES LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Mammografia YES FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Mammografia YES FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Mammografia YES FROM_70_TO_74",
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: "Mammografia NO LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Mammografia NO FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Mammografia NO FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Mammografia NO FROM_70_TO_74",
    },
  },
  // Question 3 -> Tumore Mammella
  {
    'SÌ': {
      [AgeRange.LESS_THAN_45]: "Tumore YES LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Tumore YES FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Tumore YES FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Tumore YES FROM_70_TO_74",
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: "Tumore NO LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Tumore NO FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Tumore NO FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Tumore NO FROM_70_TO_74",
    },
  },
  // Question 4 -> Fumo
  {
    'SÌ': {
      [AgeRange.LESS_THAN_45]: "Fumo YES LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Fumo YES FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Fumo YES FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Fumo YES FROM_70_TO_74",
    },
    'SÌ (in passato)': {
      [AgeRange.LESS_THAN_45]: "Fumo YES (PAST) LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Fumo YES (PAST) FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Fumo YES (PAST) FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Fumo YES (PAST) FROM_70_TO_74",
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: "Fumo NO LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Fumo NO FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Fumo NO FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Fumo NO FROM_70_TO_74",
    },
  },
  // Question 5 -> Alcool
  {
    'SÌ (< 1 unità/gg)': {
      [AgeRange.LESS_THAN_45]: "Alcool YES (< 1) LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Alcool YES (< 1) FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Alcool YES (< 1) FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Alcool YES (< 1) FROM_70_TO_74",
    },
    'SÌ (> 1 unità/gg)': {
      [AgeRange.LESS_THAN_45]: "Alcool YES (> 1) LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Alcool YES (> 1) FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Alcool YES (> 1) FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Alcool YES (> 1) FROM_70_TO_74",
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: "Alcool NO LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Alcool NO FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Alcool NO FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Alcool NO FROM_70_TO_74",
    },
  },
  // Question 6 -> Attività Fisica
  {
    'SÌ (moderata)': {
      [AgeRange.LESS_THAN_45]: "Fitness YES (MODERATE) LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Fitness YES (MODERATE) FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Fitness YES (MODERATE) FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Fitness YES (MODERATE) FROM_70_TO_74",
    },
    'SÌ (intensa)': {
      [AgeRange.LESS_THAN_45]: "Fitness YES (INTENSE) LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Fitness YES (INTENSE) FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Fitness YES (INTENSE) FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Fitness YES (INTENSE) FROM_70_TO_74",
    },
    'NO': {
      [AgeRange.LESS_THAN_45]: "Fitness NO LESS_THAN_45",
      [AgeRange.FROM_45_TO_49]: "Fitness NO FROM_45_TO_49",
      [AgeRange.FROM_50_TO_69]: "Fitness NO FROM_50_TO_69",
      [AgeRange.FROM_70_TO_74]: "Fitness NO FROM_70_TO_74",
    },
  },
];
/* eslint-enable quote-props */
