// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';

export const exportImage = async (viz) => {
  viz.exportImageAsync();
}

export const exportPDF = async (viz) => {
  viz.displayDialogAsync(tab_embed.TableauDialogType.ExportPDF);
}

export const exportCrossTab = async (viz) => {
   viz.displayDialogAsync(tab_embed.TableauDialogType.ExportCrossTab);
}

export const exportData = async (viz) => {
  viz.displayDialogAsync(tab_embed.TableauDialogType.ExportData);
}

export const exportPPT = async (viz) => {
  viz.displayDialogAsync(tab_embed.TableauDialogType.ExportPowerPoint);
}

export const exportTWBX = async (viz) => {
  viz.displayDialogAsync(tab_embed.TableauDialogType.ExportWorkbook);
}

export const shareViz = async (viz) => {
  viz.displayDialogAsync(tab_embed.TableauDialogType.Share);
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
