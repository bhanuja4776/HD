import { LotusLogo } from "../branding/LotusLogo";

const platformLinks = ["About", "Features", "Community"];
const learningLinks = ["Financial basics", "Investment guides", "Resources"];
const supportLinks = ["Help center", "Privacy", "Terms"];

const FooterColumn = ({ title, links }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold text-slate-700 dark:text-[#CBD5F5]">{title}</h3>
    <ul className="space-y-2 text-sm text-slate-600 dark:text-[#CBD5F5]/80">
      {links.map((item) => (
        <li key={item}>
          <button
            type="button"
            className="transition-colors duration-200 hover:text-primary-purple dark:hover:text-white"
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  return (
    <footer className="relative mt-14 overflow-hidden border-t border-slate-200/80 bg-white text-[#334155] dark:border-primary-violet/30 dark:bg-[#020617] dark:text-[#CBD5F5]">
      <div className="pointer-events-none absolute -top-16 -left-20 h-48 w-48 rounded-full bg-primary-pink/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-primary-purple/18 blur-3xl" />

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 lg:pr-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-purple/18 bg-white shadow-[0_10px_24px_-16px_rgba(79,70,229,0.7)] dark:border-primary-violet/38 dark:bg-[#1E293B] dark:shadow-[0_16px_30px_-22px_rgba(2,6,23,0.92)]">
                <LotusLogo className="h-7 w-7" />
              </div>
              <h2 className="font-display text-xl text-slate-800 dark:text-[#F1F5F9]">Aarvika</h2>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-[#CBD5F5]/75">
              She who grows wealth with wisdom.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-[#CBD5F5]/82">
              A digital financial mentor helping women learn, save, and invest
              with confidence.
            </p>
          </div>

          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Learning" links={learningLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        <div className="surface-card flex flex-col gap-3 bg-brand-background/60 p-4 dark:bg-[#1E293B]/85 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-[#F1F5F9]">Join the Aarvika newsletter</p>
            <p className="text-xs text-slate-600 dark:text-[#CBD5F5]/78">
              Practical money tips, investing explainers, and monthly planning guides.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field h-10 flex-1 rounded-full px-4"
            />
            <button type="submit" className="btn-primary h-10 px-5 text-xs">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};
