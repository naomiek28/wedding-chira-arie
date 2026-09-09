const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxylv2YUyPssrzcc2WemS0XBZmtP3du4qBtdVrAQEsfMiL6b8NMiiKK2JP81KxG7jxeoQ/exec";
const weddingDate = new Date("2026-11-15T18:00:00+02:00");

const translations = {
  he: {
    days: "ימים", hours: "שעות", minutes: "דקות", seconds: "שניות",
    groomFamily: "משפחת החתן", brideFamily: "משפחת הכלה",
    invite: "מתוך הודיה לה׳ ובשמחה גדולה אנו מתכבדים להזמינכם לשמחת נישואי ילדינו ונכדינו",
    presence: "ונשמח לראותכם עמנו ביום", date: "יום ראשון, ה׳ בכסלו תשפ״ז",
    civilDate: "15 בנובמבר 2026", reception: "קבלת פנים בשעה 18:00", houppa: "חופה בשעה 19:00",
    city: "מודיעין, ישראל", venueLabel: "מקום האירוע", venueName: "הרמוזו גן אירועים", waze: "פתיחה ב-Waze", calendar: "הוספה ליומן Google",
    replyLabel: "אישור הגעה", replyText: "נשמח לקבל את אישור הגעתכם.", sidePlaceholder: "הוזמנתם מצד:",
    sideChira: "שירה", sideArie: "אריה לייב", name: "שם מלא", yes: "כן, נגיע בשמחה", no: "לצערנו לא נוכל להגיע",
    message: "ברכה לזוג", send: "שליחה", guestCountPlaceholder: "כמה אנשים יהיו?", peopleOne: "אורח אחד", peopleMany: "אורחים", sending: "שולח...",
    sent: "תודה, תשובתכם התקבלה.", error: "אירעה שגיאה. אנא נסו שוב.", credit: "הזמנה דיגיטלית בעיצוב נעמי קרסנטי"
  },
  fr: {
    days: "JOURS", hours: "HEURES", minutes: "MIN", seconds: "SEC",
    groomFamily: "Famille du ‘hatan", brideFamily: "Famille de la kala",
    invite: "C’est avec une immense reconnaissance envers Hachem que nous avons la joie de vous faire part du mariage de nos enfants et petits-enfants",
    presence: "Et serions honorés de votre présence le", date: "15 novembre 2026", civilDate: "5 Kislev 5787",
    reception: "Kabalat Panim à 18h00", houppa: "Houppa à 19h00", city: "Modi’in, Israël", venueLabel: "Lieu de réception", venueName: "Hermozo",
    waze: "Ouvrir Waze", calendar: "Ajouter à Google Calendar", replyLabel: "Réponse souhaitée", replyText: "Merci de nous confirmer votre présence.",
    sidePlaceholder: "Vous êtes invité(e) par :", sideChira: "Chira", sideArie: "Arié Leib", name: "Nom complet",
    yes: "Oui, je viens", no: "Non, je ne pourrai pas venir", message: "Un mot pour les mariés", send: "Envoyer",
    guestCountPlaceholder: "Combien de personnes seront présentes ?", peopleOne: "1 personne", peopleMany: "personnes", sending: "Envoi...", sent: "Merci, votre réponse a bien été envoyée.",
    error: "Une erreur est survenue. Merci de réessayer.", credit: "Faire-part digital réalisé par Naomie Karsenty"
  }
};

let currentLang = "he";
const music = document.getElementById("weddingMusic");

function updateGuestCount() {
  const select = document.getElementById("guestCount");
  const t = translations[currentLang];
  const value = select.value;
  const options = Array.from({length: 8}, (_, i) => {
    const n = i + 1;
    const label = n === 1 ? t.peopleOne : `${n} ${t.peopleMany}`;
    return `<option value="${n}">${label}</option>`;
  }).join("");
  select.innerHTML = `<option value="" disabled${value ? "" : " selected"}>${t.guestCountPlaceholder}</option>${options}`;
  if (value) select.value = value;
}

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  document.body.classList.toggle("lang-fr", lang === "fr");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t[el.dataset.i18nPlaceholder] || "";
  });
  document.querySelectorAll(".lang-button").forEach(button => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
  updateGuestCount();
}

function updateCountdown() {
  const remaining = Math.max(0, weddingDate.getTime() - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60)
  };
  document.querySelectorAll("[data-countdown]").forEach(clock => {
    Object.entries(values).forEach(([key, value]) => {
      const field = clock.querySelector(`[data-${key}]`);
      if (field) field.textContent = String(value).padStart(2, "0");
    });
  });
}

function setupCalendar() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Mariage Chira & Arié Leib | חתונת אריה לייב ושירה",
    dates: "20261115T160000Z/20261115T210000Z",
    details: "Kabalat Panim 18h00 · Houppa 19h00",
    location: "Hermozo, Modi'in, Israël"
  });
  document.getElementById("calendarLink").href = `https://calendar.google.com/calendar/render?${params}`;
}

document.querySelectorAll(".lang-button").forEach(button => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

document.body.classList.add("reveal-ready");
const revealTargets = Array.from(document.querySelectorAll(".reveal-on-scroll, .luxury-reveal"));
const firstPageRevealTargets = revealTargets.filter(element => element.closest(".first-page"));

firstPageRevealTargets.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${240 + index * 105}ms`);
});

revealTargets
  .filter(element => !element.closest(".first-page"))
  .forEach(element => element.classList.add("is-visible"));

function revealFirstPage() {
  firstPageRevealTargets.forEach(element => element.classList.add("is-visible"));
}

document.getElementById("openEnvelope").addEventListener("click", async () => {
  const opening = document.getElementById("opening");
  const invitation = document.getElementById("invitation");
  invitation.hidden = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      invitation.classList.add("is-visible");
      opening.classList.add("is-closing");
      revealFirstPage();
    });
  });
  setTimeout(() => {
    opening.hidden = true;
    window.scrollTo({top: 0, behavior: "auto"});
  }, 1300);
  try { await music.play(); } catch (_) {}
});

document.getElementById("musicToggle").addEventListener("click", async event => {
  if (music.paused) { try { await music.play(); } catch (_) {} }
  else music.pause();
  event.currentTarget.classList.toggle("is-playing", !music.paused);
});

document.getElementById("rsvpForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("formStatus");
  const submit = form.querySelector("button[type=submit]");
  const t = translations[currentLang];
  const payload = {
    guestSide: document.getElementById("guestSide").value,
    guestName: document.getElementById("guestName").value.trim(),
    attendance: form.querySelector("input[name=attendance]:checked").value,
    guestCount: document.getElementById("guestCount").value,
    guestMessage: document.getElementById("guestMessage").value.trim(),
    language: currentLang,
    wedding: "Chira & Arié Leib"
  };
  submit.disabled = true;
  submit.textContent = t.sending;
  status.textContent = "";
  try {
    await fetch(googleScriptUrl, {method: "POST", mode: "no-cors", body: JSON.stringify(payload), headers: {"Content-Type": "text/plain;charset=utf-8"}});
    status.textContent = t.sent;
    form.reset();
    updateGuestCount();
  } catch (_) {
    status.textContent = t.error;
  } finally {
    submit.disabled = false;
    submit.textContent = t.send;
  }
});

window.addEventListener("load", () => {
  setupCalendar();
  setLanguage("he");
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setTimeout(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("loader-finished");
  }, 1800);
});
