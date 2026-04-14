import { useState, useRef, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LveButton } from '../components/LveButton';
import YearSelector from '../components/YearSelector';
import AboutDialog from '../components/AboutDialog';
import { MdPlayArrow, MdErrorOutline, MdInfoOutline } from 'react-icons/md';

type Status = 'READY' | 'RUNNING' | 'COMPLETE' | 'ERROR';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'error' | 'success';
  message: string;
}

function getStartDate(year: number): string {
  return `06 APR ${year}`;
}

function getEndDate(year: number): string {
  return `05 APR ${year + 1}`;
}

export default function TaxReturnGeneration() {
  const [year, setYear] = useState(2025);
  const [status, setStatus] = useState<Status>('READY');
  const [policyCount, setPolicyCount] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs(prev => [...prev, { timestamp, type, message }]);
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  const handleRun = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setStatus('RUNNING');
    setLogs([]);
    setPolicyCount(0);
    setProgress(0);

    const startDate = getStartDate(year);
    const endDate = getEndDate(year);

    addLog('info', `Tax Return Generation started`);
    addLog('info', `Period: ${startDate} - ${endDate}`);
    addLog('info', `Initialising policy scan...`);

    const totalPolicies = Math.floor(Math.random() * 500) + 200;
    const batchSize = Math.floor(totalPolicies / 10);

    await new Promise(r => setTimeout(r, 800));
    addLog('info', `Found ${totalPolicies} active policies`);

    let processed = 0;
    let errors = 0;

    for (let batch = 0; batch < 10; batch++) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
      const count = batch === 9 ? totalPolicies - processed : batchSize;
      processed += count;

      if (Math.random() < 0.15) {
        const errorPolicy = `POL${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
        errors++;
        addLog('error', `Policy ${errorPolicy}: Missing annuity payment record`);
      }

      setPolicyCount(processed);
      setProgress(Math.round((processed / totalPolicies) * 100));
      addLog('info', `Processed ${processed} of ${totalPolicies} policies`);
    }

    await new Promise(r => setTimeout(r, 500));

    if (errors > 0) {
      addLog('info', `Generation complete with ${errors} error(s)`);
      addLog('success', `Successfully processed ${totalPolicies - errors} policies`);
    } else {
      addLog('success', `All ${totalPolicies} policies processed successfully`);
    }

    addLog('info', `Tax return files generated for period ${startDate} - ${endDate}`);
    setStatus(errors > 0 ? 'ERROR' : 'COMPLETE');
    runningRef.current = false;
  }, [year, addLog]);

  const handlePrintErrorLog = useCallback(() => {
    const errorLogs = logs.filter(l => l.type === 'error');
    if (errorLogs.length === 0) {
      addLog('info', 'No errors to report');
      return;
    }

    addLog('info', '--- ERROR LOG REPORT ---');
    errorLogs.forEach(log => {
      addLog('info', `[${log.timestamp}] ${log.message}`);
    });
    addLog('info', `--- END OF REPORT (${errorLogs.length} error(s)) ---`);
  }, [logs, addLog]);

  const statusColor = {
    READY: 'text-[#178830]',
    RUNNING: 'text-[#006cf4]',
    COMPLETE: 'text-[#178830]',
    ERROR: 'text-[#d72714]',
  }[status];

  const isRunning = status === 'RUNNING';

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]">
      <Header title="Annuity Tax Returns" />

      <main className="flex-1 px-[142px] py-8">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white rounded-[12px] shadow-md p-8">
            <h2 className="font-['Livvic'] text-xl font-semibold text-[#00263e] mb-6">
              Tax Return Generation
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-['Livvic'] text-sm font-medium text-[#3d3d3d] mb-2">
                  Tax Year Start
                </label>
                <div className="flex items-center gap-3">
                  <span className="font-['Mulish'] text-[16px] text-[#3d3d3d]">
                    {getStartDate(year)}
                  </span>
                  <YearSelector value={year} onChange={setYear} disabled={isRunning} />
                </div>
              </div>

              <div>
                <label className="block font-['Livvic'] text-sm font-medium text-[#3d3d3d] mb-2">
                  Tax Year End
                </label>
                <span className="font-['Mulish'] text-[16px] text-[#3d3d3d] h-[44px] flex items-center">
                  {getEndDate(year)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <LveButton
                onClick={handleRun}
                disabled={isRunning}
                className="min-w-[160px]"
              >
                <MdPlayArrow className="mr-2" size={20} />
                {isRunning ? 'Running...' : 'Run'}
              </LveButton>
            </div>

            {isRunning && (
              <div className="mb-6">
                <div className="flex justify-between font-['Mulish'] text-sm text-[#3d3d3d] mb-1">
                  <span>Processing policies...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#eaf5f8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006cf4] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="font-['Livvic'] text-sm font-medium text-[#3d3d3d]">Status:</span>
                  <span className={`font-['Livvic'] text-lg font-bold ${statusColor}`}>
                    {status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-['Livvic'] text-sm font-medium text-[#3d3d3d]">Policies:</span>
                  <span className="font-['Mulish'] text-[16px] text-[#3d3d3d] font-semibold">
                    {String(policyCount).padStart(5, '0')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <LveButton variant="secondary" size="sm" onClick={handlePrintErrorLog} disabled={isRunning}>
                <MdErrorOutline className="mr-2" size={16} />
                Print Error Log
              </LveButton>
              <LveButton variant="secondary" size="sm" onClick={() => setAboutOpen(true)}>
                <MdInfoOutline className="mr-2" size={16} />
                About
              </LveButton>
            </div>

            <div
              ref={logContainerRef}
              className="h-[280px] bg-[#00263e] rounded-[8px] p-4 overflow-y-auto font-mono text-[13px] leading-relaxed"
            >
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-slate-500 font-['Mulish'] text-sm">
                    Output log will appear here when you run the process
                  </span>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span
                      className={
                        log.type === 'error'
                          ? 'text-[#d72714]'
                          : log.type === 'success'
                          ? 'text-[#178830]'
                          : 'text-slate-300'
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
