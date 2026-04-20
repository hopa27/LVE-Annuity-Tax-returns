import logo from '../assets/lve-logo.png';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto shrink-0">
      <div className="w-full max-w-[1200px] mx-auto py-3 px-6 flex items-center justify-between">
        <img src={logo} alt="LV= Logo" className="h-5" />
        <div className="text-right text-[8px] font-medium text-slate-400 leading-tight">
          <p>Liverpool Victoria Financial Services Limited</p>
          <p>County Gates, Bournemouth BH1 2NF</p>
        </div>
      </div>
    </footer>
  );
}
