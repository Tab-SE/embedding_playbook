"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import {
  translateTableauData,
  translateTableauMetric,
  translateTableauDashboard,
  translateTableauWorksheet,
  translateTableauFilter,
  translateTableauMarks
} from '@/services/tableauTranslationService';

/**
 * Custom hook for translating Tableau data
 * @returns {object} - Translation functions and utilities
 */
export const useTableauTranslation = () => {
  const { t, language } = useLanguage();

  /**
   * Translate any Tableau data object
   * @param {object} data - The data to translate
   * @param {string} dataType - Type of data ('metric', 'dashboard', 'worksheet', 'filter', 'marks')
   * @returns {object} - Translated data
   */
  const translateData = (data, dataType = 'metric') => {
    return translateTableauData(data, t, dataType);
  };

  /**
   * Translate Tableau metric data
   * @param {object} metricData - The metric data to translate
   * @returns {object} - Translated metric data
   */
  const translateMetric = (metricData) => {
    return translateTableauMetric(metricData, t);
  };

  /**
   * Translate Tableau dashboard data
   * @param {object} dashboardData - The dashboard data to translate
   * @returns {object} - Translated dashboard data
   */
  const translateDashboard = (dashboardData) => {
    return translateTableauDashboard(dashboardData, t);
  };

  /**
   * Translate Tableau worksheet data
   * @param {object} worksheetData - The worksheet data to translate
   * @returns {object} - Translated worksheet data
   */
  const translateWorksheet = (worksheetData) => {
    return translateTableauWorksheet(worksheetData, t);
  };

  /**
   * Translate Tableau filter data
   * @param {object} filterData - The filter data to translate
   * @returns {object} - Translated filter data
   */
  const translateFilter = (filterData) => {
    return translateTableauFilter(filterData, t);
  };

  /**
   * Translate Tableau mark selection data
   * @param {object} markData - The mark data to translate
   * @returns {object} - Translated mark data
   */
  const translateMarks = (markData) => {
    return translateTableauMarks(markData, t);
  };

  /**
   * Translate an array of Tableau data objects
   * @param {Array} dataArray - Array of data objects to translate
   * @param {string} dataType - Type of data for all objects
   * @returns {Array} - Array of translated data objects
   */
  const translateDataArray = (dataArray, dataType = 'metric') => {
    if (!Array.isArray(dataArray)) {
      return dataArray;
    }
    return dataArray.map(data => translateData(data, dataType));
  };

  /**
   * Get the current language code
   * @returns {string} - Current language code ('en', 'es', 'fr')
   */
  const getCurrentLanguage = () => {
    return language;
  };

  /**
   * Check if a specific text has a translation
   * @param {string} text - The text to check
   * @returns {boolean} - True if translation exists
   */
  const hasTranslation = (text) => {
    return !!(t?.metrics && t.metrics[text]);
  };

  return {
    // Translation functions
    translateData,
    translateMetric,
    translateDashboard,
    translateWorksheet,
    translateFilter,
    translateMarks,
    translateDataArray,

    // Utility functions
    getCurrentLanguage,
    hasTranslation,

    // Direct access to translations
    translations: t,
    language
  };
};
