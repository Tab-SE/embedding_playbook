// TableauLogo.jsx

import React from 'react';

const TableauLogo = () => {
  return (
    <>
        <div className="flex items-center">
            <img src="/svg/tableau.svg" alt="Tableau Logo" className="w-15 h-auto mr-2" />
        <span className="hidden md:inline">Tableau</span>
        </div>
    </>
  );
};

export default TableauLogo;
