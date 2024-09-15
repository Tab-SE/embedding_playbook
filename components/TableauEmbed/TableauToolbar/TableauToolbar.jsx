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
  const { src } = props;
  const [viz, setViz] = useState(null);
  // writing target src values
  const newVizId = uuidv4();
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE;
  const newVizDatasourceSrc = `${domain}/t/${site}/newWorkbook/${newVizId}`;

  const { status: session_status, data: session_data } = useSession({});

  // handles the forwarded ref
  useEffect(() => {
    if (ref.current) {
      setViz(ref.current);
    }
  }, [ref]);

  return (
    <Menubar className='mt-1 mb-3 inline-flex' >
      <MenubarMenu >
        <MenubarTrigger className='cursor-pointer'>
          <IconFile stroke={1} size={18} className='mr-1'/> File
        </MenubarTrigger>

        <MenubarContent >
          <MenubarItem className='cursor-pointer' onSelect={() => window.open(src, '_blank')} >
            <IconFileDescription stroke={1} size={18} className='mr-1'/> Open <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>

          <Dialog >
            <MenubarItem className='cursor-pointer' onSelect={handleSelect} >
              <DialogTrigger className='flex flex-row grow'>
                <IconFilePencil stroke={1} size={18} className='mr-1'/> Edit <MenubarShortcut>⌘E</MenubarShortcut>
              </DialogTrigger>
              <Explore
                title='Edit Viz'
                src={src}
              />
            </MenubarItem>
          </Dialog>

          <Dialog>
            <MenubarItem className='cursor-pointer' onSelect={handleSelect} >
                <DialogTrigger className='flex flex-row grow'>
                  <IconFilePlus stroke={1} size={18} className='mr-1'/> New <MenubarShortcut>⌘N</MenubarShortcut>
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
        <MenubarTrigger className='cursor-pointer'>
          <IconChartDots stroke={1} size={18} className='mr-1'/> View
        </MenubarTrigger>

        <MenubarContent>
          <MenubarItem className='cursor-pointer' onSelect={ async () => await undo(viz) }>
            <IconArrowBackUp stroke={1} size={18} className='mr-1'/> Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem className='cursor-pointer' onSelect={ async () => await redo(viz) }>
            <IconArrowForwardUp stroke={1} size={18} className='mr-1'/> Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem className='cursor-pointer' onSelect={ async () => await revert(viz) }>
            <IconRestore stroke={1} size={18} className='mr-1'/> Reset <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className='cursor-pointer' onSelect={ async () => await refreshData(viz) }>
            <IconRefresh stroke={1} size={18} className='mr-1'/> Refresh <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className='cursor-pointer'>
          <IconCloudDownload stroke={1} size={18} className='mr-1'/> Export
        </MenubarTrigger>

        <MenubarContent>
          <MenubarItem className='cursor-pointer' onSelect={ async () => await exportImage(viz) }>
            <IconPhoto stroke={1} size={18} className='mr-1' /> Image <MenubarShortcut>⇧⌘I</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className='cursor-pointer' onSelect={ async () => await exportData(viz) }>
            <IconDatabase stroke={1} size={18} className='mr-1'/> Data <MenubarShortcut>⇧⌘D</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className='cursor-pointer' onSelect={ async () => await exportCrossTab(viz) }>
            <IconTable stroke={1} size={18} className='mr-1'/> Crosstab <MenubarShortcut>⇧⌘C</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className='cursor-pointer' onSelect={ async () => await exportPDF(viz) }>
            <IconFileTypePdf stroke={1} size={18} className='mr-1'/> PDF <MenubarShortcut>⇧⌘P</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className='cursor-pointer' onSelect={ async () => await exportPPT(viz) }>
            <IconPresentation stroke={1} size={18} className='mr-1'/> Powerpoint <MenubarShortcut>⇧⌘X</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className='cursor-pointer' onSelect={ async () => await exportTWBX(viz) }>
            <IconReportAnalytics stroke={1} size={18} className='mr-1'/> Workbook <MenubarShortcut>⇧⌘W</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className='cursor-pointer' onSelect={ async () => await shareViz(viz) }>
            <IconShare stroke={1} size={18} className='mr-1'/> Share <MenubarShortcut>⇧⌘U</MenubarShortcut>
          </MenubarItem>

        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
})

const handleSelect = (e) => {
  e.preventDefault();
};
