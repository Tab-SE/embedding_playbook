"use client";
import { useState, useEffect, forwardRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useSession } from "next-auth/react";

import {
  IconFilePlus,
  IconFilePencil,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconRestore,
  IconRefresh,
  IconPhoto,
  IconDatabase,
  IconTable,
  IconFileTypePdf,
  IconPresentation,
  IconReportAnalytics,
  IconFile,
  IconChartDots,
  IconCloudDownload,
  IconFileDescription,
  IconShare
} from '@tabler/icons-react';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "components/ui";

import { Dialog, DialogTrigger } from "components/ui";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui";

import { Explore } from 'components';
import {
  exportImage,
  exportPDF,
  exportCrossTab,
  exportData,
  exportPPT,
  exportTWBX,
  refreshData,
  undo,
  revert,
  redo,
  shareViz
 } from "./actions";

// forwardRef HOC receives ref from parent and sets placeholder
export const TableauToolbar = forwardRef(function TableauToolbar(props, ref) {
  const { src, demo = 'default' } = props;
  const [viz, setViz] = useState(null);
  // writing target src values
  const newVizId = uuidv4();
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE;
  const newVizDatasourceSrc = `${domain}/t/${site}/newWorkbook/${newVizId}`;

  const { status: session_status, data: session_data } = useSession({});

  // Conditional styling based on demo
  const isServicedesk = demo === 'servicedesk';
  const toolbarClasses = isServicedesk
    ? 'mt-1 mb-3 inline-flex bg-slate-800 border-slate-700'
    : 'mt-1 mb-3 inline-flex bg-white border-gray-200';

  const triggerClasses = isServicedesk
    ? 'cursor-pointer px-1 text-white hover:bg-slate-700 hover:text-white group hover:text-white'
    : 'cursor-pointer px-1 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group hover:text-gray-900';

  const contentClasses = isServicedesk
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-gray-200';

  const itemClasses = isServicedesk
    ? 'cursor-pointer text-white hover:bg-slate-700 hover:text-white group'
    : 'cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 group';

  const iconClasses = isServicedesk
    ? 'mr-1 text-white group-hover:text-white group-focus:text-slate-900 group-active:text-slate-900 group-data-[state=open]:text-slate-900'
    : 'mr-1 text-gray-700 group-hover:text-gray-900 group-focus:text-gray-900 group-active:text-gray-900 group-data-[state=open]:text-gray-900';

  // handles the forwarded ref
  useEffect(() => {
    if (ref.current) {
      setViz(ref.current);
    }
  }, [ref]);

  return (
    <Menubar className={toolbarClasses} >
      <MenubarMenu >
        <MenubarTrigger className={triggerClasses}>
          <IconFile stroke={1} size={18} className={iconClasses}/> File
        </MenubarTrigger>

        <MenubarContent className={contentClasses}>
          <MenubarItem className={itemClasses} onSelect={() => window.open(src, '_blank')} >
            <IconFileDescription stroke={1} size={18} className={iconClasses}/> Open <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>

          <Dialog >
            <MenubarItem className={itemClasses} onSelect={handleSelect} >
              <DialogTrigger className='flex flex-row grow'>
                <IconFilePencil stroke={1} size={18} className={iconClasses}/> Edit <MenubarShortcut>⌘E</MenubarShortcut>
              </DialogTrigger>
              <Explore
                title='Edit Viz'
                src={src}
              />
            </MenubarItem>
          </Dialog>

          <Dialog>
            <MenubarItem className={itemClasses} onSelect={handleSelect} >
                <DialogTrigger className='flex flex-row grow'>
                  <IconFilePlus stroke={1} size={18} className={iconClasses}/> New <MenubarShortcut>⌘N</MenubarShortcut>
                </DialogTrigger>
                <Explore
                  title='New Viz'
                  src={newVizDatasourceSrc}
                />
              </MenubarItem>
          </Dialog>

        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className={triggerClasses}>
          <IconChartDots stroke={1} size={18} className={iconClasses}/> View
        </MenubarTrigger>

        <MenubarContent className={contentClasses}>
          <MenubarItem className={itemClasses} onSelect={ async () => await undo(viz) }>
            <IconArrowBackUp stroke={1} size={18} className={iconClasses}/> Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem className={itemClasses} onSelect={ async () => await redo(viz) }>
            <IconArrowForwardUp stroke={1} size={18} className={iconClasses}/> Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem className={itemClasses} onSelect={ async () => await revert(viz) }>
            <IconRestore stroke={1} size={18} className={iconClasses}/> Reset <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className={itemClasses} onSelect={ async () => await refreshData(viz) }>
            <IconRefresh stroke={1} size={18} className={iconClasses}/> Refresh <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className={triggerClasses}>
          <IconCloudDownload stroke={1} size={18} className={iconClasses}/> Export
        </MenubarTrigger>

        <MenubarContent className={contentClasses}>
          <MenubarItem className={itemClasses} onSelect={ async () => await exportImage(viz) }>
            <IconPhoto stroke={1} size={18} className={iconClasses} /> Image <MenubarShortcut>⇧⌘I</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className={itemClasses} onSelect={ async () => await exportData(viz) }>
            <IconDatabase stroke={1} size={18} className={iconClasses}/> Data <MenubarShortcut>⇧⌘D</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className={itemClasses} onSelect={ async () => await exportCrossTab(viz) }>
            <IconTable stroke={1} size={18} className={iconClasses}/> Crosstab <MenubarShortcut>⇧⌘C</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className={itemClasses} onSelect={ async () => await exportPDF(viz) }>
            <IconFileTypePdf stroke={1} size={18} className={iconClasses}/> PDF <MenubarShortcut>⇧⌘P</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className={itemClasses} onSelect={ async () => await exportPPT(viz) }>
            <IconPresentation stroke={1} size={18} className={iconClasses}/> Powerpoint <MenubarShortcut>⇧⌘X</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className={itemClasses} onSelect={ async () => await exportTWBX(viz) }>
            <IconReportAnalytics stroke={1} size={18} className={iconClasses}/> Workbook <MenubarShortcut>⇧⌘W</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className={itemClasses} onSelect={ async () => await shareViz(viz) }>
            <IconShare stroke={1} size={18} className={iconClasses}/> Share <MenubarShortcut>⇧⌘U</MenubarShortcut>
          </MenubarItem>

        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
})

const handleSelect = (e) => {
  e.preventDefault();
};
