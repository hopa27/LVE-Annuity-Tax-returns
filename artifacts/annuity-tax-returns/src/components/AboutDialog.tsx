import { useState } from 'react';
import { MdClose, MdContentCopy, MdEmail, MdCheck, MdInfo } from 'react-icons/md';
import { LveButton } from './LveButton';
import logo from '../assets/lve-logo.png';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const aboutInfo = {
  product: 'Tax Returns',
  version: '1.0.0.43',
  executable: '\\\\whynvap13\\UAT\\Tax_Returns\\Exe\\TaxReturns.exe',
  workingDirectory: 'H:\\',
  environment: 'BDE is not used',
  user: 'UAT3',
  workstation: 'WHYNVCX16',
  system: 'Windows NT 5.2 (Build 3790: Service Pack 2)',
  memory: '2,097,152 KB',
};

export default function AboutDialog({ open, onClose }: AboutDialogProps) {
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailError, setEmailError] = useState(false);

  if (!open) return null;

  const handleCopy = async () => {
    const text = Object.entries(aboutInfo)
      .map(([k, v]) => {
        const label = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1');
        return `${label}: ${v}`;
      })
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleEmail = () => {
    setEmailOpen(true);
  };

  const handleEmailConfirm = () => {
    if (!emailSubject.trim()) {
      setEmailError(true);
      return;
    }
    const bodyLines = [
      'Hi IT Help Desk,',
      '',
      'Please see the About Box information for the Tax Returns application below:',
      '',
      ...Object.entries(aboutInfo).map(([k, v]) => {
        const label = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1');
        return `${label}: ${v}`;
      }),
      '',
      'Thanks,',
    ];
    const mailto = `mailto:it-helpdesk@lv.co.uk?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(bodyLines.join('\r\n'))}`;

    const a = document.createElement('a');
    a.href = mailto;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setEmailOpen(false);
    setEmailSubject('');
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-baseline gap-2 text-[12px] font-['Mulish']">
      <span className="text-[#3d3d3d] font-semibold min-w-[120px] text-right shrink-0">
        {label}:
      </span>
      <span className="text-[#3d3d3d] break-all">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-[10px] shadow-2xl w-full max-w-[520px] z-10 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between bg-[#00263e] px-4 py-2.5">
          <h2 className="font-['Livvic'] text-sm font-semibold text-white">About</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-5 mb-5">
            <div className="shrink-0 bg-[#eaf5f8] rounded-[8px] p-3 flex items-center justify-center">
              <img src={logo} alt="LV= Logo" className="h-8" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-['Livvic'] text-xl font-semibold text-[#00263e] leading-tight">
                {aboutInfo.product}
              </h3>
              <p className="font-['Mulish'] text-[13px] text-[#3d3d3d] mt-1">
                Version {aboutInfo.version}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            <InfoRow label="Executable" value={aboutInfo.executable} />
            <InfoRow label="Working directory" value={aboutInfo.workingDirectory} />
            <InfoRow label="Environment" value={aboutInfo.environment} />
            <InfoRow label="User" value={aboutInfo.user} />
            <InfoRow label="Workstation" value={aboutInfo.workstation} />
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-1.5 mb-6">
            <p className="font-['Mulish'] text-[12px] text-[#3d3d3d]">{aboutInfo.system}</p>
            <p className="font-['Mulish'] text-[12px] text-[#3d3d3d]">
              Memory available to Windows: {aboutInfo.memory}
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <LveButton variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <MdCheck className="mr-1.5" size={13} />
                  Copied
                </>
              ) : (
                <>
                  <MdContentCopy className="mr-1.5" size={13} />
                  Copy To Clip
                </>
              )}
            </LveButton>
            <LveButton variant="secondary" size="sm" onClick={handleEmail}>
              <MdEmail className="mr-1.5" size={13} />
              Email
            </LveButton>
            <LveButton size="sm" onClick={onClose}>
              OK
            </LveButton>
          </div>
        </div>
      </div>

      {emailError && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEmailError(false)}
          />
          <div className="relative bg-white rounded-[10px] shadow-2xl w-full max-w-[380px] z-10 overflow-hidden">
            <div className="flex items-center justify-between bg-[#00263e] px-4 py-2.5">
              <h3 className="font-['Livvic'] text-sm font-semibold text-white">
                Information
              </h3>
              <button
                onClick={() => setEmailError(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <MdClose size={18} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3 mb-5">
                <MdInfo size={32} className="text-[#006cf4] shrink-0" />
                <div className="font-['Mulish'] text-[12px] text-[#3d3d3d] leading-relaxed">
                  Sorry, your email could not be sent due to the following error:
                  <br />
                  <span className="font-semibold">You did not type a subject.</span>
                </div>
              </div>
              <div className="flex justify-end border-t border-slate-200 pt-4">
                <LveButton size="sm" onClick={() => setEmailError(false)} autoFocus>
                  OK
                </LveButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {emailOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEmailOpen(false)}
          />
          <div className="relative bg-white rounded-[10px] shadow-2xl w-full max-w-[400px] z-10 overflow-hidden">
            <div className="flex items-center justify-between bg-[#00263e] px-4 py-2.5">
              <h3 className="font-['Livvic'] text-sm font-semibold text-white">
                Email About Box contents to IT
              </h3>
              <button
                onClick={() => setEmailOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <MdClose size={18} />
              </button>
            </div>

            <div className="p-5">
              <label className="block font-['Mulish'] text-[12px] font-semibold text-[#3d3d3d] mb-1.5">
                Subject:
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => {
                  setEmailSubject(e.target.value);
                  if (emailError) setEmailError(false);
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEmailConfirm();
                  if (e.key === 'Escape') setEmailOpen(false);
                }}
                placeholder="Press cancel to abort."
                className="w-full px-2.5 py-1.5 text-[12px] font-['Mulish'] text-[#3d3d3d] bg-white border border-slate-300 rounded-[8px] focus:outline-none focus:border-[#006cf4] focus:ring-1 focus:ring-[#006cf4] placeholder:text-slate-400"
              />

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 mt-5">
                <LveButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setEmailOpen(false)}
                >
                  Cancel
                </LveButton>
                <LveButton size="sm" onClick={handleEmailConfirm}>
                  OK
                </LveButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
