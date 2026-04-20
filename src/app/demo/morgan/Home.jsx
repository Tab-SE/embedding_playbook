"use client";

import Image from 'next/image';
import { useState, useEffect, useMemo, useRef } from 'react';
import { CreditCard, X, Lock, Scale } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Metrics, TableauEmbed, Transactions, RecentSales } from '@/components';

import { settings } from './config';

const EXPERT_VIZ_SRC =
  process.env.NEXT_PUBLIC_MORGAN_EXPERT_VIZ_URL ||
  'https://us-west-2b.online.tableau.com/t/eacloud/views/ExpertFinder/ExpertFinder';

export const description = "Morgan & Morgan expert witness overview with embedded analytics and payment flow.";

function formatMarkSummary(marks) {
  if (!marks?.length) return '';
  return marks.map((mark, index) =>
    `Selection ${index + 1}:\n${Object.entries(mark).map(([k, v]) => `  • ${k}: ${v}`).join('\n')}`
  ).join('\n\n');
}

/** Tableau returns one DataTable per marks.data[i]; only reading [0] misses selections on some vizzes. */
function parseMarksCollection(marks) {
  const marksData = [];
  if (!marks?.data?.length) return marksData;
  for (let ti = 0; ti < marks.data.length; ti++) {
    const table = marks.data[ti];
    if (!table?.columns?.length || !table?.data?.length) continue;
    for (let markIndex = 0; markIndex < table.data.length; markIndex++) {
      const obj = {};
      for (let colIndex = 0; colIndex < table.columns.length; colIndex++) {
        const col = table.columns[colIndex];
        const cell = table.data[markIndex]?.[colIndex];
        obj[col.fieldName] = cell?.formattedValue ?? cell?.value ?? '';
      }
      marksData.push(obj);
    }
  }
  return marksData;
}

export const Home = () => {
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState('2500.00');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const expertSummary = useMemo(() => formatMarkSummary(selectedMarks), [selectedMarks]);

  /**
   * TableauEmbed renders one <tableau-viz> per breakpoint; only the phone layout keeps id="overviewViz".
   * Desktop/tablet use id="tableauViz", so listening only on getElementById("overviewViz") misses the visible viz.
   * We attach to every tableau-viz and re-try while the JWT remounts the web component.
   */
  const markHandlerByVizRef = useRef(new Map());

  useEffect(() => {
    const markHandlerByViz = markHandlerByVizRef.current;

    const handleMarkSelectionChanged = (markSelectionChangedEvent) => {
      markSelectionChangedEvent.detail.getMarksAsync().then((marks) => {
        const marksData = parseMarksCollection(marks);
        if (marksData.length === 0) {
          setSelectedMarks([]);
          return;
        }
        setSelectedMarks(marksData);
      }).catch(() => {
        setSelectedMarks([
          { Note: 'Expert witness (selection registered — details unavailable; you can still proceed)' },
        ]);
      });
    };

    const tryBindViz = (viz) => {
      if (markHandlerByViz.has(viz)) return;

      const onMark = (e) => handleMarkSelectionChanged(e);

      const bind = () => {
        if (markHandlerByViz.has(viz)) return;
        viz.addEventListener('markselectionchanged', onMark);
        markHandlerByViz.set(viz, onMark);
      };

      const interactive =
        viz.getIsInteractive?.() === true ||
        viz.isInteractive === true;

      if (interactive) {
        bind();
      } else {
        const onFirst = () => bind();
        viz.addEventListener('firstinteractive', onFirst, { once: true });
      }
    };

    const scanAndBind = () => {
      document.querySelectorAll('tableau-viz').forEach(tryBindViz);
    };

    scanAndBind();
    const interval = setInterval(scanAndBind, 400);
    const delayed = setTimeout(scanAndBind, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(delayed);
      markHandlerByViz.forEach((onMark, viz) => {
        viz.removeEventListener('markselectionchanged', onMark);
      });
      markHandlerByViz.clear();
    };
  }, []);

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const submitDemoPayment = () => {
    const num = parseFloat(amount);
    if (Number.isNaN(num) || num <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }
    alert(
      `Demo: Payment submitted\nAmount: $${num.toFixed(2)}\n\nExpert details:\n${expertSummary || '(none)'}`
    );
    setShowPaymentModal(false);
    setSelectedMarks([]);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Metrics
          basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
        />

        {selectedMarks.length > 0 && !showPaymentModal && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-sm text-muted-foreground">
              Expert selected on the dashboard — continue to payment when ready.
            </p>
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 px-8 py-3.5 text-base bg-primary text-primary-foreground rounded-lg transition-colors shadow-lg hover:opacity-95 font-semibold"
            >
              <CreditCard className="h-5 w-5" />
              <span>Pay this expert witness</span>
              {selectedMarks.length > 1 ? (
                <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-medium">
                  {selectedMarks.length} selected
                </span>
              ) : null}
            </button>
          </div>
        )}

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card className="shadow-xl border-border/80 bg-card">
              <CardHeader>
                <CardTitle>Expert witness navigator</CardTitle>
                <CardDescription>
                  Select an expert on the dashboard to open the secure payment portal for retainers and fees
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <TableauEmbed
                  id="overviewViz"
                  src={EXPERT_VIZ_SRC}
                  hideTabs={true}
                  toolbar='hidden'
                  className='
                  min-w-[300px] min-h-[1430px]
                  sm:min-w-[510px] sm:min-h-[1430px]
                  md:min-w-[600px] md:min-h-[1080px]
                  lg:min-w-[400px] lg:min-h-[1440px]
                  xl:min-w-[720px] xl:min-h-[1180px]
                  2xl:min-w-[860px] 2xl:min-h-[1180px]
                  '
                  layouts={{
                    'xs': { 'device': 'phone' },
                    'sm': { 'device': 'phone' },
                    'md': { 'device': 'default' },
                    'lg': { 'device': 'phone' },
                    'xl': { 'device': 'tablet' },
                    'xl2': { 'device': 'desktop' },
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <RecentSales
              title="Recent expert payments"
              description="Retainers and fees routed to expert witnesses from this workspace."
            />
            <Transactions
              title="Payment activity"
              description="Recent retainer and expert-fee transfers."
            />
          </div>
        </div>
      </main>

      {showPaymentModal && selectedMarks.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(218_48%_10%)]/75 p-4 backdrop-blur-[2px]"
          onClick={closePaymentModal}
          role="presentation"
        >
          <div
            className="morgan-payment-portal w-full max-w-lg overflow-hidden rounded-2xl border border-[hsl(218_30%_88%)] bg-card shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="morgan-payment-title"
          >
            <div className="border-t-[5px] border-primary bg-navBackground px-6 pb-5 pt-6 text-white shadow-inner">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Image
                    src={settings.app_logo}
                    alt="Morgan & Morgan"
                    width={320}
                    height={120}
                    className="h-auto max-h-24 w-auto max-w-[min(100%,18rem)] object-contain md:max-h-28"
                    priority
                  />
                  <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#fceb09]/90">
                    For The People
                  </p>
                  <div className="mt-4 flex items-center gap-2 border-t border-white/20 pt-4">
                    <Scale className="h-5 w-5 shrink-0 text-[#fceb09]" aria-hidden />
                    <div>
                      <h2 id="morgan-payment-title" className="text-base font-semibold tracking-tight text-white">
                        Expert witness payment
                      </h2>
                      <p className="text-sm text-white/75">
                        Retainers and fees for the expert selected in your navigator
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="shrink-0 rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto bg-[hsl(40_25%_97%)] px-6 py-6">
              <div className="rounded-lg border border-[hsl(218_25%_88%)] bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218_35%_35%)]">
                  Selected expert (from dashboard)
                </p>
                <pre className="max-h-36 overflow-auto rounded-md border border-dashed border-[hsl(218_20%_85%)] bg-[hsl(220_14%_98%)] p-3 font-mono text-xs leading-relaxed text-[hsl(222_47%_14%)]">
                  {expertSummary}
                </pre>
              </div>

              <div className="grid gap-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(218_35%_35%)]">
                  Payment details
                </p>
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-foreground">Amount (USD)</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-lg border border-input bg-white py-2.5 pl-8 pr-3 text-sm font-medium shadow-sm ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-foreground">Name on card</span>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    autoComplete="cc-name"
                    className="rounded-lg border border-input bg-white px-3 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="Name as it appears on the card"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-foreground">Card number</span>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19))}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className="rounded-lg border border-input bg-white px-3 py-2.5 font-mono text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="4242 4242 4242 4242"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-foreground">Expiry</span>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      autoComplete="cc-exp"
                      className="rounded-lg border border-input bg-white px-3 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      placeholder="MM / YY"
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-foreground">CVC</span>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      className="rounded-lg border border-input bg-white px-3 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      placeholder="123"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-[hsl(218_25%_90%)] bg-white/80 px-3 py-2.5 text-xs text-muted-foreground">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>
                  Demo environment — payment details are not transmitted. Connect your processor to accept live
                  transactions.
                </span>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-[hsl(218_20%_90%)] pt-5">
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="rounded-lg border border-[hsl(218_25%_85%)] bg-white px-4 py-2.5 text-sm font-medium text-[hsl(218_48%_25%)] shadow-sm transition-colors hover:bg-[hsl(220_14%_97%)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitDemoPayment}
                  className="inline-flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition-opacity hover:opacity-95"
                >
                  <CreditCard className="h-4 w-4" />
                  Submit payment
                </button>
              </div>

              <p className="text-center font-serif text-sm font-semibold tracking-wide text-[#da9e86]">
                For The People
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
