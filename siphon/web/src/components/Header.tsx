import { Logo } from './Logo';

export function Header() {
  return (
    <header className="header">
      <div className="shell header-inner">
        <a className="brand" href="/" aria-label="Vessel home">
          <Logo />
          <span className="brand-name">vessel</span>
        </a>
        <nav className="header-nav" aria-label="Primary">
          <a href="#how-it-works">How it works</a>
          <a href="#platforms">Platforms</a>
          <a href="https://github.com/theabidchaudhary/pixxelpulse" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
