"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleHelp, MapPinned, Menu, MessageCircle, ShieldCheck, Users, X } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <Link className="brand" href="/" onClick={closeMenu}>
        <img className="brand-logo" src="/supertour-logo.jpg" alt="SuperTour logo" />
        <span className="brand-text">
          <strong>SuperTour</strong>
          <small>Travel Agency</small>
        </span>
      </Link>

      <button
        aria-controls="main-menu"
        aria-expanded={open}
        aria-label={open ? "Menu yopish" : "Menu ochish"}
        className="menu-toggle"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main navigation" id="main-menu">
        <Link href="/" onClick={closeMenu}>
          Bosh sahifa
        </Link>
        <Link href="/destinations" onClick={closeMenu}>
          Yo'nalishlar
        </Link>
        <Link href="/#tours" onClick={closeMenu}>
          Turlar
        </Link>
        <Link href="/#faq" onClick={closeMenu}>
          <CircleHelp size={15} />
          FAQ
        </Link>
        <Link href="/about" onClick={closeMenu}>
          Biz haqimizda
        </Link>
        <Link href="/#trust" onClick={closeMenu}>
          <ShieldCheck size={15} />
          Ishonch
        </Link>
        <Link href="/contact" onClick={closeMenu}>
          Kontakt
        </Link>
      </nav>

      <div className={`nav-tools ${open ? "open" : ""}`}>
        <span className="nav-chip">
          <Users size={15} />
          Individual
        </span>
        <span className="nav-chip">
          <MapPinned size={15} />
          10+ yo'nalish
        </span>
        <Link className="nav-action" href="/contact" onClick={closeMenu}>
          <MessageCircle size={18} />
          So'rov
        </Link>
      </div>
    </header>
  );
}
