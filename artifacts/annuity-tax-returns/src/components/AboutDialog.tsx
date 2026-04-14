import { MdClose } from 'react-icons/md';
import logo from '../assets/lve-logo.png';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutDialog({ open, onClose }: AboutDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-md p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#3d3d3d] hover:text-[#006cf4] transition-colors"
        >
          <MdClose size={24} />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <img src={logo} alt="LV= Logo" className="h-10" />
          <h2 className="font-['Livvic'] text-2xl font-semibold text-[#00263e]">
            Annuity Tax Returns
          </h2>
          <div className="h-px w-full bg-slate-200" />
          <div className="font-['Mulish'] text-[14px] text-[#3d3d3d] space-y-2">
            <p className="font-semibold">Tax Return Generation Tool</p>
            <p>Version 2.0.0</p>
            <p className="text-slate-500 text-[12px] mt-4">
              Generates annual tax return data for annuity policies within
              a specified tax year period. Processes all active policies
              and produces detailed logs of any errors encountered.
            </p>
          </div>
          <div className="h-px w-full bg-slate-200" />
          <p className="font-['Mulish'] text-[10px] text-slate-400">
            Liverpool Victoria Financial Services Limited
          </p>
        </div>
      </div>
    </div>
  );
}
