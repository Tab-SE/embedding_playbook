"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children, demo = 'servicedesk' }) => {
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Demo-specific translations
  const demoTranslations = {
    servicedesk: {
      en: {
        title: "Service Excellence Dashboard",
        subtitle: "Real-time insights to build trust, drive renewals, and showcase premium service",
        executiveSummary: "Service Overview",
        executiveSummaryDesc: "Real-time customer service metrics and case management",
        complianceCenter: "Case Management",
        complianceCenterDesc: "Track open, closed cases and response times",
        insuranceStatus: "Case Status",
        all: "All",
        active: "Open",
        expired: "Closed",
        pending: "In Progress",
        sendExpirationNotice: "Share Case Update",
        filterByInsuranceStatus: "Filter by Case Status",
        showAllInsuranceStatuses: "Show all case statuses",
        currentlyActiveInsurance: "Currently open cases",
        expiredInsurancePolicies: "Closed cases",
        pendingInsuranceVerification: "Cases in progress",
        insuranceExpirationNotices: "Case Updates",
        previous: "Previous",
        next: "Next",
        email: "Email",
        of: "of",
        to: "To",
        subject: "Subject",
        message: "Message",
        close: "Close",
        sendThisEmail: "Send This Update",
        sendAll: "Send All",
        demoMode: "Demo Mode",
        noActualEmails: "No actual messages will be sent. You have",
        notificationsReady: "update(s) ready to send.",
        urgentInsuranceStatusExpired: "Case Update - Action Required",
        dearContractor: "Dear",
        urgentNotification: "This is an update regarding your service case.",
        recordsIndicate: "Our records indicate the following case details:",
        selectedRecordDetails: "Case Information",
        pleaseTakeActions: "Please take the following actions:",
        reviewPolicy: "1. Review the case details above",
        renewCoverage: "2. Update the case status as needed",
        submitDocumentation: "3. Contact support if additional assistance is required",
        failureWarning: "Timely response helps us maintain excellent service quality.",
        questionsContact: "If you have any questions or need assistance, please contact our support team.",
        bestRegards: "Best regards,",
        complianceTeam: "Service Excellence Team",
        demoEmailGenerated: "This is a demo message generated from Tableau mark selection.",
        metrics: {
          "Total Cases": "Total Cases",
          "Open Cases": "Open Cases",
          "Closed Cases": "Closed Cases",
          "Response Time": "Response Time",
          "Customer Satisfaction": "Customer Satisfaction",
          "Uptime": "Uptime",
          "Training Completion": "Training Completion",
          "Active Users": "Active Users",
          "Resolved": "Resolved",
          "In Progress": "In Progress",
          "Pending": "Pending",
          "High Priority": "High Priority",
          "Medium Priority": "Medium Priority",
          "Low Priority": "Low Priority",
          "Critical": "Critical",
          "Warning": "Warning",
          "Info": "Information",
          "Success": "Success",
          "Error": "Error"
        }
      },
      es: {
        title: "Panel de Excelencia en el Servicio",
        subtitle: "Información en tiempo real para generar confianza, impulsar renovaciones y mostrar un servicio premium",
        executiveSummary: "Resumen del Servicio",
        executiveSummaryDesc: "Métricas de servicio al cliente en tiempo real y gestión de casos",
        complianceCenter: "Gestión de Casos",
        complianceCenterDesc: "Seguimiento de casos abiertos, cerrados y tiempos de respuesta",
        metrics: {
          "Total Cases": "Casos Totales",
          "Open Cases": "Casos Abiertos",
          "Closed Cases": "Casos Cerrados"
        }
      },
      fr: {
        title: "Tableau d'Excellence de Service",
        subtitle: "Aperçus en temps réel pour établir la confiance, stimuler les renouvellements et présenter un service premium",
        executiveSummary: "Aperçu du Service",
        executiveSummaryDesc: "Métriques de service client en temps réel et gestion des cas",
        complianceCenter: "Gestion des Cas",
        complianceCenterDesc: "Suivi des cas ouverts, fermés et des temps de réponse",
        metrics: {
          "Total Cases": "Cas Totaux",
          "Open Cases": "Cas Ouverts",
          "Closed Cases": "Cas Fermés"
        }
      }
    }
  };

  // Get translations for current demo and language
  const translations = demoTranslations[demo] || demoTranslations.servicedesk;
  const t = translations[language];

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown && !event.target.closest('.language-selector')) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageDropdown]);

  const value = {
    language,
    setLanguage,
    showLanguageDropdown,
    setShowLanguageDropdown,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
