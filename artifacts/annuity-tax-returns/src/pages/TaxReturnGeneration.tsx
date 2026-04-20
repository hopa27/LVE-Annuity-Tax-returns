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
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveFilename, setSaveFilename] = useState('');
  const [saveType, setSaveType] = useState<'FADV' | 'PDF' | 'TXT'>('FADV');
  const [pendingReportText, setPendingReportText] = useState('');
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
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const stamp = `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;

    const separator = '='.repeat(60);
    const header = `*** ERROR LOG FOR ${stamp} ***`;
    const ts = `${hh}:${mi}:${ss}`;

    setLogs(prev => {
      const errorLogs = prev.filter(l => l.type === 'error');
      const lines: LogEntry[] = [
        { timestamp: ts, type: 'info', message: header },
        { timestamp: ts, type: 'info', message: separator },
      ];
      if (errorLogs.length === 0) {
        for (let i = 0; i < 6; i++) {
          lines.push({ timestamp: ts, type: 'info', message: separator });
        }
      } else {
        errorLogs.forEach(log => {
          lines.push({ timestamp: ts, type: 'error', message: `[${log.timestamp}] ${log.message}` });
          lines.push({ timestamp: ts, type: 'info', message: separator });
        });
      }

      const reportText = lines.map(l => l.message).join('\n');
      const fileStamp = `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;

      setPendingReportText(reportText);
      setSaveFilename(`ErrorLog_${fileStamp}`);
      setSaveType('FADV');

      setTimeout(() => {
        addLog('info', 'Attempting to print...');
        addLog('error', 'No printer connected. Opening Save Print Output dialog.');
        setSaveDialogOpen(true);
      }, 300);

      return lines;
    });
  }, [addLog]);

  const handleSavePrintOutput = useCallback(() => {
    const name = saveFilename.trim();
    if (!name) return;
    const ext = `.${saveType}`;
    const filename = name.toLowerCase().endsWith(ext.toLowerCase()) ? name : `${name}${ext}`;

    const mime =
      saveType === 'PDF'
        ? 'application/pdf'
        : saveType === 'TXT'
        ? 'text/plain'
        : 'application/octet-stream';

    const blob = new Blob([pendingReportText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setSaveDialogOpen(false);
    addLog('success', `Print output saved to ${filename}`);
  }, [saveFilename, saveType, pendingReportText, addLog]);

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

      <main className="flex-1 px-[114px] py-6">
        <div className="max-w-[640px] mx-auto">
          <div className="bg-white rounded-[10px] shadow-md p-6">
            <h2 className="font-['Livvic'] text-base font-semibold text-[#00263e] mb-5">
              Tax Return Generation
            </h2>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block font-['Livvic'] text-xs font-medium text-[#3d3d3d] mb-1.5">
                  Tax Year Start
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-['Mulish'] text-[13px] text-[#3d3d3d]">
                    {getStartDate(year)}
                  </span>
                  <YearSelector value={year} onChange={setYear} disabled={isRunning} />
                </div>
              </div>

              <div>
                <label className="block font-['Livvic'] text-xs font-medium text-[#3d3d3d] mb-1.5">
                  Tax Year End
                </label>
                <span className="font-['Mulish'] text-[13px] text-[#3d3d3d] h-[35px] flex items-center">
                  {getEndDate(year)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <LveButton
                onClick={handleRun}
                disabled={isRunning}
                className="min-w-[128px]"
              >
                <MdPlayArrow className="mr-1.5" size={16} />
                {isRunning ? 'Running...' : 'Run'}
              </LveButton>
            </div>

            {isRunning && (
              <div className="mb-5">
                <div className="flex justify-between font-['Mulish'] text-xs text-[#3d3d3d] mb-1">
                  <span>Processing policies...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#eaf5f8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006cf4] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <span className="font-['Livvic'] text-xs font-medium text-[#3d3d3d]">Status:</span>
                  <span className={`font-['Livvic'] text-sm font-bold ${statusColor}`}>
                    {status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Livvic'] text-xs font-medium text-[#3d3d3d]">Policies:</span>
                  <span className="font-['Mulish'] text-[13px] text-[#3d3d3d] font-semibold">
                    {String(policyCount).padStart(5, '0')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <LveButton variant="secondary" size="sm" onClick={handlePrintErrorLog} disabled={isRunning}>
                <MdErrorOutline className="mr-1.5" size={13} />
                Print Error Log
              </LveButton>
              <LveButton variant="secondary" size="sm" onClick={() => setAboutOpen(true)}>
                <MdInfoOutline className="mr-1.5" size={13} />
                About
              </LveButton>
            </div>

            <div
              ref={logContainerRef}
              className="h-[224px] bg-[#00263e] rounded-[6px] p-3 overflow-y-auto font-mono text-[11px] leading-relaxed"
            >
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-slate-500 font-['Mulish'] text-xs">
                    Output log will appear here when you run the process
                  </span>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-1.5">
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

      {saveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSaveDialogOpen(false)}
          />
          <div className="relative bg-white rounded-[10px] shadow-2xl w-full max-w-[560px] z-10 overflow-hidden">
            <div className="flex items-center justify-between bg-[#00263e] px-4 py-2.5">
              <h3 className="font-['Livvic'] text-sm font-semibold text-white">
                Save Print Output As
              </h3>
              <button
                onClick={() => setSaveDialogOpen(false)}
                className="text-white/80 hover:text-white text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-3 text-[12px] font-['Mulish'] text-[#3d3d3d]">
                <span className="font-semibold">Location:</span>
                <span className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-[6px]">
                  This PC › Documents
                </span>
              </div>

              <div className="border border-slate-300 rounded-[6px] bg-white max-h-[200px] overflow-y-auto mb-4">
                <table className="w-full text-[12px] font-['Mulish']">
                  <thead className="bg-slate-100 text-[#3d3d3d] sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-1.5 font-semibold">Name</th>
                      <th className="text-left px-3 py-1.5 font-semibold">Date modified</th>
                      <th className="text-left px-3 py-1.5 font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#3d3d3d]">
                    {[
                      { n: 'Completion and Annual Statements', d: '6/19/2025', t: 'File folder' },
                      { n: 'Custom Office Templates', d: '1/31/2025', t: 'File folder' },
                      { n: 'Tax Returns Archive', d: '12/8/2025', t: 'File folder' },
                      { n: 'Clanad Policies.pdf', d: '2/18/2026', t: 'PDF Document' },
                      { n: 'Error list.pdf', d: '2/10/2026', t: 'PDF Document' },
                    ].map((f, i) => (
                      <tr key={i} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-3 py-1 truncate">{f.n}</td>
                        <td className="px-3 py-1">{f.d}</td>
                        <td className="px-3 py-1">{f.t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <label className="font-['Mulish'] text-[12px] font-semibold text-[#3d3d3d] w-[90px] shrink-0">
                    File name:
                  </label>
                  <input
                    type="text"
                    value={saveFilename}
                    onChange={(e) => setSaveFilename(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSavePrintOutput();
                      if (e.key === 'Escape') setSaveDialogOpen(false);
                    }}
                    className="flex-1 px-2.5 py-1.5 text-[12px] font-['Mulish'] text-[#3d3d3d] bg-white border border-slate-300 rounded-[8px] focus:outline-none focus:border-[#006cf4] focus:ring-1 focus:ring-[#006cf4]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-['Mulish'] text-[12px] font-semibold text-[#3d3d3d] w-[90px] shrink-0">
                    Save as type:
                  </label>
                  <select
                    value={saveType}
                    onChange={(e) => setSaveType(e.target.value as 'FADV' | 'PDF' | 'TXT')}
                    className="flex-1 px-2.5 py-1.5 text-[12px] font-['Mulish'] text-[#3d3d3d] bg-white border border-slate-300 rounded-[8px] focus:outline-none focus:border-[#006cf4] focus:ring-1 focus:ring-[#006cf4]"
                  >
                    <option value="FADV">FADV Document (*.FADV)</option>
                    <option value="PDF">PDF Document (*.pdf)</option>
                    <option value="TXT">Text Document (*.txt)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                <LveButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setSaveDialogOpen(false)}
                >
                  Cancel
                </LveButton>
                <LveButton size="sm" onClick={handleSavePrintOutput}>
                  Save
                </LveButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
