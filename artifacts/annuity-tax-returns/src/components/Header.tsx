import logo from '../assets/lve-logo.png';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="w-full bg-[#00263e] text-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-3 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="LV= Logo" className="h-5" />
            <h1 className="font-['Livvic'] text-2xl font-normal tracking-tight text-white">
              {title}
            </h1>
          </div>
          <button className="h-7 px-3 text-white font-['Livvic'] text-xs rounded hover:bg-white/10 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
