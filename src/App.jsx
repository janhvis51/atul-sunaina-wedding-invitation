
import React, { useEffect, useMemo, useRef, useState } from "react";

import { motion, useScroll, useSpring } from "framer-motion";

import {
  Volume2,
  VolumeX,
  CalendarDays,
  Clock3,
  ArrowDown,
  Sparkles,
  Music2,
  Flower2,
  PartyPopper,
  MapPin,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";

import { wedding } from "./data";

/* REPLACE WITH THE FAMILY'S WHATSAPP NUMBER */
const WHATSAPP_NUMBER = "917021379712";

/* =========================
   COUNTDOWN
========================= */

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const difference = Math.max(
      0,
      new Date(target).getTime() - now
    );

    return {
      days: Math.floor(difference / 86400000),
      hours: Math.floor((difference % 86400000) / 3600000),
      minutes: Math.floor((difference % 3600000) / 60000),
      seconds: Math.floor((difference % 60000) / 1000),
    };
  }, [target, now]);
}

/* =========================
   GOLDEN CURSOR
========================= */

function GoldenCursor() {
  const [position, setPosition] = useState({
    x: -100,
    y: -100,
  });

  const [bursts, setBursts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());

  useEffect(() => {
    const handleMove = (event) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleClick = (event) => {
      const id = ++nextId.current;

      setBursts((previous) => [
        ...previous,
        {
          id,
          x: event.clientX,
          y: event.clientY,
        },
      ]);

      const timer = setTimeout(() => {
        setBursts((previous) =>
          previous.filter((burst) => burst.id !== id)
        );

        timers.current.delete(id);
      }, 800);

      timers.current.set(id, timer);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);

      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, []);

  return (
    <div className="golden-cursor-layer" aria-hidden="true">
      <div
        className="golden-cursor"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />

      {bursts.map((burst) => (
        <div
          className="gold-burst"
          key={burst.id}
          style={{
            left: burst.x,
            top: burst.y,
          }}
        >
          {Array.from({ length: 14 }, (_, index) => (
            <span
              key={index}
              style={{
                "--angle": `${index * (360 / 14)}deg`,
                "--distance": `${30 + (index % 3) * 12}px`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* =========================
   OPENING ENVELOPE
========================= */

function Envelope({ onOpen }) {
  const [opening, setOpening] = useState(false);

  function handleOpen() {
    if (opening) return;

    setOpening(true);
    setTimeout(onOpen, 950);
  }

  return (
    <motion.div
      className="envelope-screen"
      exit={{ opacity: 0 }}
    >
      <img
        src="/ganesh-ladoo-watermark.gif"
        alt=""
        aria-hidden="true"
        className="ganesh-watermark"
      />

      <div className="envelope-copy">
        <span className="eyebrow">
          A GROOM-SIDE INVITATION
        </span>

        <h1>A celebration awaits</h1>

        <p>
          With the blessings of our elders, we invite you
          to celebrate.
        </p>
      </div>

      <motion.button
        type="button"
        className={`envelope ${opening ? "opened" : ""}`}
        onClick={handleOpen}
        whileTap={{ scale: 0.97 }}
        disabled={opening}
        aria-label="Open wedding invitation"
      >
        <span className="envelope-inner" />
        <span className="flap" />

        <span className="seal">
          A <i>&</i> S
        </span>

        <span className="tap-hint">
          {opening
            ? "Opening your invitation…"
            : "Tap to open"}
        </span>
      </motion.button>

      <span className="tiny-note">
        ATUL & SUNAINA · DECEMBER 2026
      </span>
    </motion.div>
  );
}

/* =========================
   REVEAL ANIMATION
========================= */

function Reveal({ children, className = "", id }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-55px" }}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.section>
  );
}

/* =========================
   RSVP FORM
========================= */

function RSVPForm() {
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState("Joyfully accept");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !WHATSAPP_NUMBER ||
      WHATSAPP_NUMBER.includes("X")
    ) {
      alert(
        "Please add the family's WhatsApp number in App.jsx first."
      );
      return;
    }

    const whatsappMessage = `
💌 WEDDING RSVP
Atul & Sunaina | December 2026

Guest Name: ${guestName}
Attendance: ${attendance}

Personal Message:
${message || "Looking forward to celebrating with you!"}

Thank you!
    `.trim();

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(whatsappMessage);

    window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="rsvp-inline">
      <div className="rsvp-heading">
        <Heart
          size={22}
          className="rsvp-heading-heart"
        />

        <span className="eyebrow">
          KINDLY RESPOND
        </span>

        <h3>
          Will you <i>join us?</i>
        </h3>

        <p>
          Your presence would mean the world to us.
          Please let us know if you can celebrate with us.
        </p>
      </div>

      <form
        className="rsvp-form-inline"
        onSubmit={handleSubmit}
      >
        <label htmlFor="rsvp-name">
          YOUR NAME
        </label>

        <input
          id="rsvp-name"
          type="text"
          placeholder="Enter your full name"
          value={guestName}
          onChange={(event) =>
            setGuestName(event.target.value)
          }
          required
        />

        <label htmlFor="rsvp-attendance">
          WILL YOU BE ATTENDING?
        </label>

        <select
          id="rsvp-attendance"
          value={attendance}
          onChange={(event) =>
            setAttendance(event.target.value)
          }
        >
          <option value="Joyfully accept">
            Joyfully accept
          </option>

          <option value="Regretfully decline">
            Regretfully decline
          </option>
        </select>

        <label htmlFor="rsvp-message">
          PERSONAL MESSAGE (OPTIONAL)
        </label>

        <textarea
          id="rsvp-message"
          rows="3"
          placeholder="Write a lovely message for the couple..."
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
        />

        <button
          type="submit"
          className="rsvp-gold-button"
        >
          <MessageCircle size={17} />
          CONFIRM YOUR RSVP
          <Send size={15} />
        </button>
      </form>

      <p className="rsvp-note">
        Thank you for being part of our happiness.
      </p>
    </div>
  );
}

/* =========================
   MAIN APP
========================= */

export default function App() {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(true);
  const audio = useRef(null);

  const countdown = useCountdown(wedding.dateISO);
  const { scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  async function startMusic() {
    if (!audio.current) return;

    audio.current.volume = 0.25;
    audio.current.muted = false;

    try {
      await audio.current.play();
      setMuted(false);
    } catch {
      setMuted(true);
    }
  }

  async function toggleMusic() {
    if (!audio.current) return;

    if (muted) {
      try {
        audio.current.volume = 0.25;
        audio.current.muted = false;
        await audio.current.play();
        setMuted(false);
      } catch {
        setMuted(true);
      }
    } else {
      audio.current.muted = true;
      setMuted(true);
    }
  }

  const icons = [
    <Sparkles key="1" />,
    <Flower2 key="2" />,
    <Music2 key="3" />,
    <PartyPopper key="4" />,
    <Sparkles key="5" />,
  ];

  return (
    <>
      <GoldenCursor />

      <motion.div
        className="scroll-progress"
        style={{ scaleY: progress }}
      />

      <audio
        ref={audio}
        src={wedding.music}
        loop
        preload="none"
      />

      {!opened ? (
        <Envelope
          onOpen={() => {
            setOpened(true);
            startMusic();
          }}
        />
      ) : (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          {/* HERO SECTION */}

          <header className="hero">
            <div
              className="couple-watermark"
              aria-hidden="true"
            >
              <img
                src="/couple-watermark.jpeg"
                alt=""
              />
            </div>

            <div className="hero-overlay" />

            <div
              className="rose-decoration"
              aria-hidden="true"
            />

            <div
              className="rose-decoration-right"
              aria-hidden="true"
            />

            <div className="arch arch-one" />
            <div className="arch arch-two" />

            <div className="hero-top">
              <span>✦</span>
              <span>
                THE GROOM'S FAMILY CORDIALLY INVITES YOU
              </span>
              <span>✦</span>
            </div>

            <div className="hero-center">
              <div className="ganesh">ॐ</div>

              <p className="script-intro">
                With the blessings of our elders
              </p>

              <h1>{wedding.groom}</h1>

              <span className="with">with</span>

              <h2>{wedding.bride}</h2>

              <div className="gold-rule">✧</div>

              <p className="hero-date">
                WEDDING CELEBRATIONS · DECEMBER 2026
              </p>

              <p className="hero-tagline">
                {wedding.intro}
              </p>
            </div>

            <a className="scroll-cue" href="#welcome">
              <span>SCROLL TO EXPLORE</span>
              <ArrowDown size={15} />
            </a>

            <div className="corner left">❧</div>
            <div className="corner right">❧</div>
          </header>

          {/* WELCOME SECTION */}

          <Reveal
            className="welcome section"
            id="welcome"
          >
            <span className="eyebrow">
              A JOYOUS FAMILY CELEBRATION
            </span>

            <h2>
              Celebrating <i>togetherness</i>
            </h2>

            <p>{wedding.story}</p>

            <div className="ornament">❦</div>
          </Reveal>

          {/* COUNTDOWN */}

          <Reveal className="countdown-section section">
            <span className="eyebrow">
              THE WEDDING DAY COUNTDOWN
            </span>

            <h2>
              Until the <i>baraat</i>
            </h2>

            <div className="countdown">
              {Object.entries(countdown).map(
                ([unit, value]) => (
                  <div className="time-unit" key={unit}>
                    <strong>
                      {String(value).padStart(2, "0")}
                    </strong>
                    <span>{unit}</span>
                  </div>
                )
              )}
            </div>

            <p className="count-date">
              <CalendarDays size={15} />
              Friday · 11 December 2026 · 9:00 PM
            </p>
          </Reveal>

          {/* WEDDING EVENTS */}

          <Reveal className="events-section section">
            <span className="eyebrow">
              SAVE THE DATES
            </span>

            <h2>
              Wedding <i>festivities</i>
            </h2>

            <p className="subcopy">
              Traditions, music, laughter and memories.
            </p>

            <div className="event-list">
              {wedding.events.map((event, index) => {
                return (
                  <motion.article
                    className="event-card"
                    key={event.name}
                    whileHover={{ y: -4 }}
                    style={{
                      "--event-accent": event.accent,
                    }}
                  >
                    <div className="event-index">
                      0{index + 1}
                    </div>

                    <div className="event-content">
                      <span className="eyebrow">
                        {event.label}
                      </span>

                      <h3>{event.name}</h3>

                      <div className="event-detail">
                        <CalendarDays size={15} />
                        {event.date}
                      </div>

                      <div className="event-detail">
                        {event.name === "Baraat" && (
                          <Clock3 size={15} />
                        )}
                        {event.time}
                      </div>

                      <div className="venue-location">
                        {event.from && (
                          <p className="venue">
                            <MapPin size={15} />
                            <span>
                              <strong>From:</strong> {event.from}
                            </span>
                          </p>
                        )}

                        {event.to && (
                          <p className="venue">
                            <MapPin size={15} />
                            <span>
                              <strong>To:</strong> {event.to}
                            </span>
                          </p>
                        )}

                        {!event.from && !event.to && event.venue && (
                          <p className="venue">
                            <MapPin size={15} />
                            <span>{event.venue}</span>
                          </p>
                        )}

                        {event.mapLink && (
                          <a
                            className="view-location"
                            href={event.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin size={14} />
                            {event.from && event.to
                              ? "View Route on Google Maps"
                              : "View Location"}
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="event-flower">
                      {icons[index]}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </Reveal>

          {/* CLOSING SECTION + RSVP */}

          <Reveal className="closing-section section">
            <Sparkles
              size={22}
              className="sparkle"
            />

            <span className="eyebrow">
              YOUR PRESENCE WILL MAKE IT SPECIAL
            </span>

            <h2>
              We look forward to celebrating{" "}
              <i>with you</i>
            </h2>

            <p>
              With love and warm regards, Atul's family
            </p>

            <div className="signature">
              Atul <span>&</span> Sunaina
            </div>

            <div className="footer-date">
              DECEMBER 2026 · WITH LOVE
            </div>

            {/* RSVP appears on this same closing page */}
            <RSVPForm />
          </Reveal>

          {/* MUSIC BUTTON */}

          <button
            className="music-button"
            onClick={toggleMusic}
            aria-label={
              muted ? "Play music" : "Mute music"
            }
          >
            {muted ? (
              <VolumeX size={18} />
            ) : (
              <Volume2 size={18} />
            )}

            <span>
              {muted ? "MUSIC OFF" : "MUSIC ON"}
            </span>
          </button>

        </motion.main>
      )}
    </>
  );
}
