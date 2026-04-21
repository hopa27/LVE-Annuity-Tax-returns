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

function getStartDate(_year: number): string {
  return `06 APR `;
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

      <main className="flex-1 w-full px-[142px] py-6">
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
          <div
            className="relative bg-[#f0f0f0] border border-[#a0a0a0] shadow-2xl w-full max-w-[640px] z-10 overflow-hidden"
            style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif' }}
          >
            {/* Windows title bar */}
            <div className="flex items-center justify-between bg-[#f0f0f0] border-b border-[#d0d0d0] px-3 py-1.5">
              <span className="text-[12px] text-[#000]">Save Print Output As</span>
              <div className="flex gap-0">
                <button className="w-7 h-5 hover:bg-[#e0e0e0] text-[#000] text-[11px] flex items-center justify-center">
                  &minus;
                </button>
                <button className="w-7 h-5 hover:bg-[#e0e0e0] text-[#000] text-[10px] flex items-center justify-center">
                  ▢
                </button>
                <button
                  onClick={() => setSaveDialogOpen(false)}
                  className="w-7 h-5 hover:bg-[#e81123] hover:text-white text-[#000] text-[12px] flex items-center justify-center"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Address bar row */}
            <div className="flex items-center gap-2 px-2 py-1.5 bg-[#f0f0f0] border-b border-[#d0d0d0]">
              <button className="px-1 text-[#606060] hover:bg-[#e0e0e0] rounded text-[14px]">←</button>
              <button className="px-1 text-[#606060] hover:bg-[#e0e0e0] rounded text-[14px]">→</button>
              <button className="px-1 text-[#606060] hover:bg-[#e0e0e0] rounded text-[14px]">↑</button>
              <div className="flex-1 flex items-center bg-white border border-[#a0a0a0] h-6 px-1 text-[11px] text-[#000]">
                <span>📁</span>
                <span className="mx-1">›</span>
                <span>This PC</span>
                <span className="mx-1">›</span>
                <span>Documents</span>
              </div>
              <div className="flex items-center bg-white border border-[#a0a0a0] h-6 px-2 text-[11px] text-[#606060] w-[140px]">
                <span>🔍</span>
                <span className="ml-1">Search Documents</span>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-3 py-1 bg-[#f0f0f0] border-b border-[#d0d0d0] text-[11px] text-[#000]">
              <span className="hover:bg-[#e0e0e0] px-1 cursor-default">Organize ▾</span>
              <span className="hover:bg-[#e0e0e0] px-1 cursor-default">New folder</span>
            </div>

            {/* Body: sidebar + file list */}
            <div className="flex bg-white border-b border-[#d0d0d0]" style={{ height: 220 }}>
              {/* Sidebar */}
              <div className="w-[160px] border-r border-[#d0d0d0] overflow-y-auto text-[11px] text-[#000] py-1">
                {[
                  { i: '💻', n: 'This PC', bold: true },
                  { i: '🖥️', n: '3D Objects' },
                  { i: '🖥️', n: 'Desktop' },
                  { i: '📄', n: 'Documents', selected: true },
                  { i: '⬇', n: 'Downloads' },
                  { i: '🎵', n: 'Music' },
                  { i: '🖼', n: 'Pictures' },
                  { i: '🎬', n: 'Videos' },
                  { i: '💾', n: 'Global (G:)' },
                  { i: '💾', n: 'Home (H:)' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 px-2 py-0.5 cursor-default ${
                      item.selected ? 'bg-[#cce8ff] border border-[#99d1ff]' : 'hover:bg-[#e5f3ff]'
                    } ${item.bold ? 'font-semibold' : ''}`}
                  >
                    <span>{item.i}</span>
                    <span className="truncate">{item.n}</span>
                  </div>
                ))}
              </div>

              {/* File list */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[1fr_120px_120px] bg-[#f5f5f5] border-b border-[#d0d0d0] text-[11px] text-[#000] sticky top-0">
                  <div className="px-2 py-1 border-r border-[#d0d0d0]">Name</div>
                  <div className="px-2 py-1 border-r border-[#d0d0d0]">Date modified</div>
                  <div className="px-2 py-1">Type</div>
                </div>
                {[
                  { i: '📁', n: 'Completion and Annual Statements', d: '6/19/2025 1:56 PM', t: 'File folder' },
                  { i: '📁', n: 'Custom Office Templates', d: '1/31/2025 7:46 AM', t: 'File folder' },
                  { i: '📁', n: 'OneNote Notebooks', d: '9/5/2025 1:04 PM', t: 'File folder' },
                  { i: '📁', n: 'SQL Server Management Studio', d: '12/8/2025 6:10 AM', t: 'File folder' },
                  { i: '📁', n: 'Visual Studio 2017', d: '12/8/2025 6:09 AM', t: 'File folder' },
                  { i: '📕', n: 'Clanad Policies.pdf', d: '2/18/2026 3:28 PM', t: 'Microsoft Edge' },
                  { i: '📕', n: 'Error list.pdf', d: '2/10/2026 1:51 PM', t: 'Microsoft Edge' },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_120px_120px] hover:bg-[#e5f3ff] text-[11px] text-[#000] cursor-default"
                  >
                    <div className="px-2 py-0.5 truncate flex items-center gap-1">
                      <span>{f.i}</span>
                      <span className="truncate">{f.n}</span>
                    </div>
                    <div className="px-2 py-0.5 truncate">{f.d}</div>
                    <div className="px-2 py-0.5 truncate">{f.t}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* File name + type */}
            <div className="bg-[#f0f0f0] px-3 py-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-[#000] w-[80px] shrink-0">File name:</label>
                <input
                  type="text"
                  value={saveFilename}
                  onChange={(e) => setSaveFilename(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSavePrintOutput();
                    if (e.key === 'Escape') setSaveDialogOpen(false);
                  }}
                  className="flex-1 px-1.5 py-0.5 h-6 text-[11px] text-[#000] bg-white border border-[#7a7a7a] focus:outline-none focus:border-[#0078d7]"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-[#000] w-[80px] shrink-0">Save as type:</label>
                <select
                  value={saveType}
                  onChange={(e) => setSaveType(e.target.value as 'FADV' | 'PDF' | 'TXT')}
                  className="flex-1 px-1 py-0.5 h-6 text-[11px] text-[#000] bg-white border border-[#7a7a7a] focus:outline-none focus:border-[#0078d7]"
                >
                  <option value="FADV">FADV Document (*.FADV)</option>
                  <option value="PDF">PDF Document (*.pdf)</option>
                  <option value="TXT">Text Document (*.txt)</option>
                </select>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-[#f0f0f0] px-3 py-2 flex items-center justify-between border-t border-[#d0d0d0]">
              <button className="text-[11px] text-[#000] hover:underline">▲ Hide Folders</button>
              <div className="flex gap-1.5">
                <button
                  onClick={handleSavePrintOutput}
                  className="min-w-[75px] h-6 px-3 text-[11px] text-[#000] bg-[#e1e1e1] border border-[#adadad] hover:bg-[#e5f1fb] hover:border-[#0078d7]"
                >
                  Save
                </button>
                <button
                  onClick={() => setSaveDialogOpen(false)}
                  className="min-w-[75px] h-6 px-3 text-[11px] text-[#000] bg-[#e1e1e1] border border-[#adadad] hover:bg-[#e5f1fb] hover:border-[#0078d7]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
