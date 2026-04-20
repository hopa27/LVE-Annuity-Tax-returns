import { useState } from 'react';
import { MdClose, MdContentCopy, MdEmail, MdCheck } from 'react-icons/md';
import { LveButton } from './LveButton';
import logo from '../assets/lve-logo.png';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const aboutInfo = {
  product: 'Annuity Tax Returns',
  version: '2.0.0',
  executable: 'https://annuity-tax-returns.lv.co.uk/app',
  workingDirectory: '/var/www/tax-returns',
  environment: 'Web (Static Deployment)',
  user: 'web-session',
  workstation: typeof navigator !== 'undefined' ? navigator.platform : 'Browser',
  system: typeof navigator !== 'undefined' ? navigator.userAgent.split(') ')[0] + ')' : 'Web Browser',
};

export default function AboutDialog({ open, onClose }: AboutDialogProps) {
  const [copied, setCopied] = useState(false);

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
    const subject = encodeURIComponent('Annuity Tax Returns - System Information');
    const body = encodeURIComponent(
      Object.entries(aboutInfo)
        .map(([k, v]) => {
          const label = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1');
          return `${label}: ${v}`;
        })
        .join('\n')
    );
    window.location.href = `mailto:support@lv.com?subject=${subject}&body=${body}`;
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
            <p className="font-['Mulish'] text-[12px] text-[#3d3d3d]">
              <span className="font-semibold">System:</span> {aboutInfo.system}
            </p>
            <p className="font-['Mulish'] text-[12px] text-[#3d3d3d]">
              <span className="font-semibold">Memory available:</span>{' '}
              {typeof performance !== 'undefined' && (performance as any).memory
                ? `${Math.round((performance as any).memory.jsHeapSizeLimit / 1024).toLocaleString()} KB`
                : 'Browser-managed'}
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
    </div>
  );
}
