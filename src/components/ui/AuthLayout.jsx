function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="brand-icon-lg">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-white">MedMonstros</span>
    </div>
  )
}

export default function AuthLayout({ leftContent, children }) {
  return (
    <div className="flex min-h-screen">
      <div className="auth-panel-left hidden lg:flex lg:w-[48%] flex-col justify-between p-12">
        <div className="animate-slide-in-left">
          <Logo />
        </div>

        <div className="animate-fade-in">
          {leftContent}
        </div>

        <p className="text-xs text-slate-700">© 2025 MedMonstros</p>
      </div>

      <div className="auth-form-panel flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-10">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
