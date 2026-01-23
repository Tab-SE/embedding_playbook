export const exportImage = async (viz) => {
  viz.exportImageAsync();
}

export const exportPDF = async (viz) => {
  // Access TableauDialogType from the global tableau object (loaded via CDN script)
  if (typeof window !== 'undefined' && window.tableau) {
    viz.displayDialogAsync(window.tableau.TableauDialogType.ExportPDF);
  }
}

export const exportCrossTab = async (viz) => {
  if (typeof window !== 'undefined' && window.tableau) {
    viz.displayDialogAsync(window.tableau.TableauDialogType.ExportCrossTab);
  }
}

export const exportData = async (viz) => {
  if (typeof window !== 'undefined' && window.tableau) {
    viz.displayDialogAsync(window.tableau.TableauDialogType.ExportData);
  }
}

export const exportPPT = async (viz) => {
  if (typeof window !== 'undefined' && window.tableau) {
    viz.displayDialogAsync(window.tableau.TableauDialogType.ExportPowerPoint);
  }
}

export const exportTWBX = async (viz) => {
  if (typeof window !== 'undefined' && window.tableau) {
    viz.displayDialogAsync(window.tableau.TableauDialogType.ExportWorkbook);
  }
}

export const shareViz = async (viz) => {
  if (typeof window !== 'undefined' && window.tableau) {
    viz.displayDialogAsync(window.tableau.TableauDialogType.Share);
  }
}

export const refreshData = async (viz) => {
  viz.refreshDataAsync();
}

export const revert = async (viz) => {
  viz.revertAllAsync();
}

export const undo = async (viz) => {
  viz.undoAsync();
}

export const redo = async (viz) => {
  viz.redoAsync();
}
