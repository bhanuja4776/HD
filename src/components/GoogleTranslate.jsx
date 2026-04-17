import { useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "gu", label: "Gujarati" },
  { code: "mr", label: "Marathi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "pa", label: "Punjabi" }
];

export const GoogleTranslate = () => {

  useEffect(() => {

    const addScript = () => {

      if (document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");

      script.id = "google-translate-script";

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false
        },
        "google_translate_element"
      );

    };

    addScript();

  }, []);
  
  // remove google translate banner if injected
  const removeBanner = () => {
    const banner = document.querySelector(".goog-te-banner-frame");
    if (banner) {
      banner.remove();
    }

    document.body.style.top = "0px";
  };

  setInterval(removeBanner, 500);
  const changeLanguage = (lang) => {

    const interval = setInterval(() => {

      const select = document.querySelector(".goog-te-combo");

      if (select) {

        select.value = lang;

        select.dispatchEvent(new Event("change"));

        clearInterval(interval);

      }

    }, 300);

  };

  return (

    <div className="flex items-center gap-2">

      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">🌐</span>

      <select
        onChange={(e) => changeLanguage(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 transition-colors duration-200 hover:border-indigo-300 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300"
      >

        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}

      </select>

      {/* hidden google container */}
      <div id="google_translate_element" className="hidden"></div>

    </div>

  );

};