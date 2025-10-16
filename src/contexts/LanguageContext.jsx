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

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Language translations
  const translations = {
    en: {
      title: "Veriforce Contractor Risk Management",
      subtitle: "Comprehensive safety and compliance tracking dashboard with real-time alerts and self-service analytics",
      executiveSummary: "Executive Summary",
      executiveSummaryDesc: "Real-time compliance tracking across all contractors and safety metrics",
      complianceCenter: "Compliance Center",
      complianceCenterDesc: "Contractor Compliance and Certification Status Overview",
      insuranceStatus: "Insurance Status",
      all: "All",
      active: "Active",
      expired: "Expired",
      pending: "Pending",
      sendExpirationNotice: "Send Expiration Notice",
      filterByInsuranceStatus: "Filter by Insurance Status",
      showAllInsuranceStatuses: "Show all insurance statuses",
      currentlyActiveInsurance: "Currently active insurance",
      expiredInsurancePolicies: "Expired insurance policies",
      pendingInsuranceVerification: "Pending insurance verification",
      insuranceExpirationNotices: "Insurance Expiration Notices",
      previous: "Previous",
      next: "Next",
      email: "Email",
      of: "of",
      to: "To",
      subject: "Subject",
      message: "Message",
      close: "Close",
      sendThisEmail: "Send This Email",
      sendAll: "Send All",
      demoMode: "Demo Mode",
      noActualEmails: "No actual emails will be sent. You have",
      notificationsReady: "notification(s) ready to send.",
      urgentInsuranceStatusExpired: "URGENT: Insurance Status Expired - Action Required",
      dearContractor: "Dear",
      urgentNotification: "This is an urgent notification regarding your insurance status.",
      recordsIndicate: "Our records indicate that your insurance coverage has EXPIRED. This requires immediate attention to maintain compliance with our contractor requirements.",
      selectedRecordDetails: "Selected Record Details",
      pleaseTakeActions: "Please take the following actions immediately:",
      reviewPolicy: "1. Review your current insurance policy",
      renewCoverage: "2. Renew or update your insurance coverage",
      submitDocumentation: "3. Submit updated documentation to our compliance team",
      failureWarning: "Failure to address this issue may result in suspension of contractor privileges.",
      questionsContact: "If you have any questions or need assistance, please contact our compliance department.",
      bestRegards: "Best regards,",
      complianceTeam: "Veriforce Compliance Team",
      demoEmailGenerated: "This is a demo email generated from Tableau mark selection.",
      // Metrics translations
      metrics: {
        // Common metric names that might come from Tableau
        "Total Contractors": "Total Contractors",
        "Active Projects": "Active Projects",
        "Safety Incidents": "Safety Incidents",
        "Compliance Rate": "Compliance Rate",
        "Insurance Expired": "Insurance Expired",
        "Training Completed": "Training Completed",
        "Risk Score": "Risk Score",
        "Certifications": "Certifications",
        "Violations": "Violations",
        "Inspections": "Inspections",
        "Renewals": "Renewals",
        "Approvals": "Approvals",
        "Rejections": "Rejections",
        "Pending": "Pending",
        "Overdue": "Overdue",
        "Completed": "Completed",
        "In Progress": "In Progress",
        "Not Started": "Not Started",
        "High Risk": "High Risk",
        "Medium Risk": "Medium Risk",
        "Low Risk": "Low Risk",
        "Critical": "Critical",
        "Warning": "Warning",
        "Info": "Info",
        "Success": "Success",
        "Error": "Error"
      }
    },
    es: {
      title: "Gestión de Riesgos de Contratistas Veriforce",
      subtitle: "Panel de seguimiento integral de seguridad y cumplimiento con alertas en tiempo real y análisis de autoservicio",
      executiveSummary: "Resumen Ejecutivo",
      executiveSummaryDesc: "Seguimiento de cumplimiento en tiempo real en todos los contratistas y métricas de seguridad",
      complianceCenter: "Centro de Cumplimiento",
      complianceCenterDesc: "Resumen del Estado de Cumplimiento y Certificación de Contratistas",
      insuranceStatus: "Estado del Seguro",
      all: "Todos",
      active: "Activo",
      expired: "Vencido",
      pending: "Pendiente",
      sendExpirationNotice: "Enviar Aviso de Vencimiento",
      filterByInsuranceStatus: "Filtrar por Estado del Seguro",
      showAllInsuranceStatuses: "Mostrar todos los estados del seguro",
      currentlyActiveInsurance: "Seguro actualmente activo",
      expiredInsurancePolicies: "Pólizas de seguro vencidas",
      pendingInsuranceVerification: "Verificación de seguro pendiente",
      insuranceExpirationNotices: "Avisos de Vencimiento de Seguro",
      previous: "Anterior",
      next: "Siguiente",
      email: "Correo",
      of: "de",
      to: "Para",
      subject: "Asunto",
      message: "Mensaje",
      close: "Cerrar",
      sendThisEmail: "Enviar Este Correo",
      sendAll: "Enviar Todos",
      demoMode: "Modo Demo",
      noActualEmails: "No se enviarán correos reales. Tienes",
      notificationsReady: "notificación(es) lista(s) para enviar.",
      urgentInsuranceStatusExpired: "URGENTE: Estado del Seguro Vencido - Acción Requerida",
      dearContractor: "Estimado",
      urgentNotification: "Esta es una notificación urgente sobre el estado de su seguro.",
      recordsIndicate: "Nuestros registros indican que su cobertura de seguro ha VENCIDO. Esto requiere atención inmediata para mantener el cumplimiento con nuestros requisitos de contratistas.",
      selectedRecordDetails: "Detalles del Registro Seleccionado",
      pleaseTakeActions: "Por favor tome las siguientes acciones inmediatamente:",
      reviewPolicy: "1. Revise su póliza de seguro actual",
      renewCoverage: "2. Renueve o actualice su cobertura de seguro",
      submitDocumentation: "3. Envíe documentación actualizada a nuestro equipo de cumplimiento",
      failureWarning: "La falta de atención a este problema puede resultar en la suspensión de los privilegios de contratista.",
      questionsContact: "Si tiene alguna pregunta o necesita asistencia, por favor contacte a nuestro departamento de cumplimiento.",
      bestRegards: "Saludos cordiales,",
      complianceTeam: "Equipo de Cumplimiento Veriforce",
      demoEmailGenerated: "Este es un correo de demostración generado desde la selección de marcas de Tableau.",
      // Metrics translations
      metrics: {
        "Total Contractors": "Total de Contratistas",
        "Active Projects": "Proyectos Activos",
        "Safety Incidents": "Incidentes de Seguridad",
        "Compliance Rate": "Tasa de Cumplimiento",
        "Insurance Expired": "Seguro Vencido",
        "Training Completed": "Capacitación Completada",
        "Risk Score": "Puntuación de Riesgo",
        "Certifications": "Certificaciones",
        "Violations": "Violaciones",
        "Inspections": "Inspecciones",
        "Renewals": "Renovaciones",
        "Approvals": "Aprobaciones",
        "Rejections": "Rechazos",
        "Pending": "Pendiente",
        "Overdue": "Vencido",
        "Completed": "Completado",
        "In Progress": "En Progreso",
        "Not Started": "No Iniciado",
        "High Risk": "Alto Riesgo",
        "Medium Risk": "Riesgo Medio",
        "Low Risk": "Bajo Riesgo",
        "Critical": "Crítico",
        "Warning": "Advertencia",
        "Info": "Información",
        "Success": "Éxito",
        "Error": "Error"
      }
    },
    fr: {
      title: "Gestion des Risques Contractuels Veriforce",
      subtitle: "Tableau de bord de suivi complet de la sécurité et de la conformité avec alertes en temps réel et analyses en libre-service",
      executiveSummary: "Résumé Exécutif",
      executiveSummaryDesc: "Suivi de conformité en temps réel sur tous les entrepreneurs et métriques de sécurité",
      complianceCenter: "Centre de Conformité",
      complianceCenterDesc: "Aperçu du Statut de Conformité et de Certification des Entrepreneurs",
      insuranceStatus: "Statut d'Assurance",
      all: "Tous",
      active: "Actif",
      expired: "Expiré",
      pending: "En Attente",
      sendExpirationNotice: "Envoyer Avis d'Expiration",
      filterByInsuranceStatus: "Filtrer par Statut d'Assurance",
      showAllInsuranceStatuses: "Afficher tous les statuts d'assurance",
      currentlyActiveInsurance: "Assurance actuellement active",
      expiredInsurancePolicies: "Polices d'assurance expirées",
      pendingInsuranceVerification: "Vérification d'assurance en attente",
      insuranceExpirationNotices: "Avis d'Expiration d'Assurance",
      previous: "Précédent",
      next: "Suivant",
      email: "Email",
      of: "de",
      to: "À",
      subject: "Sujet",
      message: "Message",
      close: "Fermer",
      sendThisEmail: "Envoyer Cet Email",
      sendAll: "Tout Envoyer",
      demoMode: "Mode Démo",
      noActualEmails: "Aucun email réel ne sera envoyé. Vous avez",
      notificationsReady: "notification(s) prête(s) à envoyer.",
      urgentInsuranceStatusExpired: "URGENT: Statut d'Assurance Expiré - Action Requise",
      dearContractor: "Cher",
      urgentNotification: "Ceci est une notification urgente concernant votre statut d'assurance.",
      recordsIndicate: "Nos dossiers indiquent que votre couverture d'assurance a EXPIRÉ. Cela nécessite une attention immédiate pour maintenir la conformité avec nos exigences contractuelles.",
      selectedRecordDetails: "Détails du Registre Sélectionné",
      pleaseTakeActions: "Veuillez prendre les mesures suivantes immédiatement:",
      reviewPolicy: "1. Examinez votre police d'assurance actuelle",
      renewCoverage: "2. Renouvelez ou mettez à jour votre couverture d'assurance",
      submitDocumentation: "3. Soumettez la documentation mise à jour à notre équipe de conformité",
      failureWarning: "Le fait de ne pas résoudre ce problème peut entraîner la suspension des privilèges contractuels.",
      questionsContact: "Si vous avez des questions ou avez besoin d'assistance, veuillez contacter notre département de conformité.",
      bestRegards: "Cordialement,",
      complianceTeam: "Équipe de Conformité Veriforce",
      demoEmailGenerated: "Ceci est un email de démonstration généré à partir de la sélection de marques Tableau.",
      // Metrics translations
      metrics: {
        "Total Contractors": "Total des Entrepreneurs",
        "Active Projects": "Projets Actifs",
        "Safety Incidents": "Incidents de Sécurité",
        "Compliance Rate": "Taux de Conformité",
        "Insurance Expired": "Assurance Expirée",
        "Training Completed": "Formation Terminée",
        "Risk Score": "Score de Risque",
        "Certifications": "Certifications",
        "Violations": "Violations",
        "Inspections": "Inspections",
        "Renewals": "Renouvellements",
        "Approvals": "Approbations",
        "Rejections": "Rejets",
        "Pending": "En Attente",
        "Overdue": "En Retard",
        "Completed": "Terminé",
        "In Progress": "En Cours",
        "Not Started": "Non Commencé",
        "High Risk": "Risque Élevé",
        "Medium Risk": "Risque Moyen",
        "Low Risk": "Faible Risque",
        "Critical": "Critique",
        "Warning": "Avertissement",
        "Info": "Information",
        "Success": "Succès",
        "Error": "Erreur"
      }
    }
  };

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
