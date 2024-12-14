'use client';
import { useState, useCallback } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  DropdownMenuContent,
} from '../../ui';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { rgbToHex } from '../../../utils';

export const OptionsFontsTab = ({ contextOptions, updateContextOption }) => {
  // State to manage which tooltip is shown
  const [activeTooltip, setActiveTooltip] = useState<null | string>(null);

  const applyWorkbookFormatting = useCallback(() => {
    if (!updateContextOption) {
      console.log('Props are not yet available.');
      return;
    }

    const formattingSheets = tableau.extensions.environment.workbookFormatting.formattingSheets;

    const worksheet = formattingSheets.find(
      (sheet: any) => sheet.classNameKey === 'tableau-worksheet'
    ).cssProperties;
    const worksheetTitle = formattingSheets.find(
      (sheet: any) => sheet.classNameKey === 'tableau-worksheet-title'
    ).cssProperties;
    const dashboardTitle = formattingSheets.find(
      (sheet: any) => sheet.classNameKey === 'tableau-dashboard-title'
    ).cssProperties;

    if (worksheet && worksheetTitle && dashboardTitle) {
      updateContextOption('cardTitleText', {
        fontFamily: dashboardTitle.fontFamily,
        fontSize: dashboardTitle.fontSize,
        color: rgbToHex(dashboardTitle.color),
      });
      updateContextOption('cardBANText', {
        fontFamily: worksheetTitle.fontFamily,
        fontSize: worksheetTitle.fontSize,
        color: rgbToHex(worksheetTitle.color),
      });
      updateContextOption('cardText', {
        fontFamily: worksheet.fontFamily,
        fontSize: worksheet.fontSize,
        color: rgbToHex(worksheet.color),
      });
    } else {
      console.log('Workbook formatting is not available.');
    }
  }, [updateContextOption]);

  const applyCarouselFormatting = useCallback(() => {
    updateContextOption('cardTitleText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '1.17rem',
      color: '#78716c',
    });
    updateContextOption('cardBANText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '1.5rem',
      color: '#0c0a09',
    });
    updateContextOption('cardText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '0.75rem',
      color: '#0c0a09',
    });
  }, [updateContextOption]);

  const applySinglePaneFormatting = useCallback(() => {
    updateContextOption('cardTitleText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '16px',
      color: '#003f72',
    });
    updateContextOption('cardBANText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '30px',
      color: '#003a6a',
    });
    updateContextOption('cardText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '0.7rem',
      color: '#6b7280',
    });
  }, [updateContextOption]);
  const applySalesforceFormatting = useCallback(() => {
    updateContextOption('cardTitleText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '1.5rem',
      color: '#232323',
    });
    updateContextOption('cardBANText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '30px',
      color: '#232323',
    });
    updateContextOption('cardText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '16px',
      color: '#232323',
    });
  }, [updateContextOption]);
  const applyTableauFormatting = useCallback(() => {
    updateContextOption('cardTitleText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '1.125rem',
      color: '#6b7280',
    });
    updateContextOption('cardBANText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '2.625rem',
      color: '#232323',
    });
    updateContextOption('cardText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '16px',
      color: '#232323',
    });
  }, [updateContextOption]);

  return (
    <div>
      <div>
        <span className="text-2xl font-extrabold">Fonts</span>
        <div className="flex items-center">
          <Button variant="outline" className={'rounded-r-none'} onClick={applyWorkbookFormatting}>
            Apply Tableau Dashboard Workbook Formatting
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={'rounded-l-none border-l-0 px-2'}>
                <CaretDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dropdown-menu-content">
              <DropdownMenuItem onClick={applyCarouselFormatting}>
                Apply default Carousel Formatting
              </DropdownMenuItem>
              <DropdownMenuItem onClick={applySinglePaneFormatting}>
                Apply default Single Pane Formatting
              </DropdownMenuItem>
              <DropdownMenuItem onClick={applySalesforceFormatting}>
                Apply default Salesforce Formatting
              </DropdownMenuItem>
              <DropdownMenuItem onClick={applyTableauFormatting}>
                Apply default Tableau Formatting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-4 rounded-lg border border-gray-300">
          <h2 className="text-xl font-bold mb-4">Google Font <span className='text-sm'>(optional)</span></h2>
          <div className="flex space-x-4">
            <div>
              <label htmlFor="googleFontName">Google Font Name:</label>
              <Input
                type="text"
                id="googleFontName"
                value={contextOptions.googleFont?.fontFamily ?? ''}
                onChange={(e) =>
                  updateContextOption('googleFont', {
                    ...contextOptions.googleFont,
                    fontFamily: e.target.value.replace(/\s+/g, '+'),
                  })
                }
                placeholder="Enter Google Font Name"
              />
            </div>
            <div>
              <label htmlFor="googleFontWeight">Google Font Weight:</label>
              <Input
                type="text"
                id="googleFontWeight"
                value={contextOptions.googleFont?.fontWeight ?? ''}
                onChange={(e) =>
                  updateContextOption('googleFont', {
                    ...contextOptions.googleFont,
                    fontWeight: e.target.value,
                  })
                }
                placeholder="Enter Google Font Weight"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Card Title Font</h2>
        <div className="flex space-x-4">
          <div>
            <label htmlFor="cardTitleFontFamily">Font Family:</label>
            <Input
              type="text"
              id="cardTitleFontFamily"
              value={contextOptions.cardTitleText.fontFamily}
              onChange={(e) =>
                updateContextOption('cardTitleText', {
                  ...contextOptions.cardTitleText,
                  fontFamily: e.target.value,
                })
              }
              placeholder="Enter Card Title Font Family"
            />
          </div>
          <div>
            <label htmlFor="fontSize">Font Size:</label>
            <Input
              type="text"
              id="cardTitleFontSize"
              value={contextOptions.cardTitleText.fontSize}
              onChange={(e) =>
                updateContextOption('cardTitleText', {
                  ...contextOptions.cardTitleText,
                  fontSize: e.target.value,
                })
              }
              onBlur={(e) => {
                const value = e.target.value;
                const validFontSizePattern = /^(?:[1-9]\d*|0)?(?:\.\d+)?(?:px|em|rem|pt|%)$/;
                if (!validFontSizePattern.test(value)) {
                  console.error('Invalid font size');
                  e.target.style.borderColor = 'red';
                } else {
                  e.target.style.borderColor = '';
                }
              }}
              placeholder="Enter Card Title Font Size (e.g., 16px, 1em)"
            />
          </div>
          <div>
            <label htmlFor="cardTitleColor">Font Color:</label>
            <Input
              type="color"
              id="cardTitleColor"
              value={contextOptions.cardTitleText.color}
              onChange={(e) =>
                updateContextOption('cardTitleText', {
                  ...contextOptions.cardTitleText,
                  color: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Card BAN</h2>
        <div className="flex space-x-4">
          <div>
            <label htmlFor="cardBANFontFamily">Font Family:</label>
            <Input
              type="text"
              id="cardBANFontFamily"
              value={contextOptions.cardBANText.fontFamily}
              onChange={(e) =>
                updateContextOption('cardBANText', {
                  ...contextOptions.cardBANText,
                  fontFamily: e.target.value,
                })
              }
              placeholder="Enter Card BAN Font Family"
            />
          </div>
          <div>
            <label htmlFor="cardBANFontSize">Font Size:</label>
            <Input
              type="text"
              id="cardBANFontSize"
              value={contextOptions.cardBANText.fontSize}
              onChange={(e) =>
                updateContextOption('cardBANText', {
                  ...contextOptions.cardBANText,
                  fontSize: e.target.value,
                })
              }
              onBlur={(e) => {
                const value = e.target.value;
                const validFontSizePattern = /^(?:[1-9]\d*|0)?(?:\.\d+)?(?:px|em|rem|pt|%)$/;
                if (!validFontSizePattern.test(value)) {
                  console.error('Invalid font size');
                  e.target.style.borderColor = 'red';
                } else {
                  e.target.style.borderColor = '';
                }
              }}
              placeholder="Enter Card BAN Font Size (e.g., 16px, 1em)"
            />
          </div>
          <div>
            <label htmlFor="cardBANColor">Font Color:</label>
            <Input
              type="color"
              id="cardBANColor"
              value={contextOptions.cardBANText.color}
              onChange={(e) =>
                updateContextOption('cardBANText', {
                  ...contextOptions.cardBANText,
                  color: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Card Text</h2>
        <div className="flex space-x-4">
          <div>
            <label htmlFor="cardTextFontFamily">Font Family:</label>
            <Input
              type="text"
              id="cardTextFontFamily"
              value={contextOptions.cardText.fontFamily}
              onChange={(e) =>
                updateContextOption('cardText', {
                  ...contextOptions.cardText,
                  fontFamily: e.target.value,
                })
              }
              placeholder="Enter Card Text Font Family"
            />
          </div>
          <div>
            <label htmlFor="cardTextFontSize">Font Size:</label>
            <Input
              type="text"
              id="cardTextFontSize"
              value={contextOptions.cardText.fontSize}
              onChange={(e) =>
                updateContextOption('cardText', {
                  ...contextOptions.cardText,
                  fontSize: e.target.value,
                })
              }
              onBlur={(e) => {
                const value = e.target.value;
                const validFontSizePattern = /^(?:[1-9]\d*|0)?(?:\.\d+)?(?:px|em|rem|pt|%)$/;
                const inputElement = e.target;
                if (!validFontSizePattern.test(value)) {
                  console.error('Invalid font size');
                  inputElement.style.borderColor = 'red';
                } else {
                  inputElement.style.borderColor = '';
                }
              }}
              placeholder="Enter Card Text Font Size (e.g., 16px, 1em)"
            />
          </div>
          <div>
            <label htmlFor="cardTextColor">Font Color:</label>
            <Input
              type="color"
              id="cardTextColor"
              value={contextOptions.cardText.color}
              onChange={(e) =>
                updateContextOption('cardText', {
                  ...contextOptions.cardText,
                  color: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
