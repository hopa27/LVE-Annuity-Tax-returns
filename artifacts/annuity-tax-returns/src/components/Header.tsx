import logo from '../assets/lve-logo.png';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="w-full bg-[#00263e] text-white">
      <div className="px-[142px] pt-4 pb-6">
        <div className="flex items-center justify-between">
          <img src={logo} alt="LV= Logo" className="h-6" />
          <button className="h-8 px-4 text-white font-['Livvic'] text-sm rounded hover:bg-white/10 transition-colors">
            Logout
          </button>
        </div>
        <div className="h-px bg-slate-600/50 mt-3 mb-6" />
        <h1 className="font-['Livvic'] text-3xl font-normal tracking-tight text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}
