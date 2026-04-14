import logo from '../assets/lve-logo.png';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="w-full bg-[#00263e] text-white">
      <div className="px-[114px] pt-3 pb-5">
        <div className="flex items-center justify-between">
          <img src={logo} alt="LV= Logo" className="h-5" />
          <button className="h-7 px-3 text-white font-['Livvic'] text-xs rounded hover:bg-white/10 transition-colors">
            Logout
          </button>
        </div>
        <div className="h-px bg-slate-600/50 mt-2 mb-4" />
        <h1 className="font-['Livvic'] text-2xl font-normal tracking-tight text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}
