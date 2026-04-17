import { useId } from "react";

export const LotusLogo = ({ className = "h-9 w-9" }) => {
  const iconId = useId().replace(/:/g, "");
  const petalGradientId = `lotus-petal-${iconId}`;
  const petalGlowId = `lotus-glow-${iconId}`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Aarvika lotus logo"
    >
      <defs>
        <linearGradient id={petalGradientId} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4F46E5" />
          <stop offset="0.55" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        <radialGradient id={petalGlowId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 31) rotate(90) scale(16 18)">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d="M24 7.5C20.3 11.5 19.5 16.8 24 22C28.5 16.8 27.7 11.5 24 7.5Z" fill={`url(#${petalGradientId})`} />
      <path d="M15.8 12.6C13.1 16.1 13.3 20.3 17.5 23.4C20.3 19.8 19.7 15.7 15.8 12.6Z" fill={`url(#${petalGradientId})`} opacity="0.94" />
      <path d="M32.2 12.6C28.3 15.7 27.7 19.8 30.5 23.4C34.7 20.3 34.9 16.1 32.2 12.6Z" fill={`url(#${petalGradientId})`} opacity="0.94" />
      <path d="M11 21C8.8 24.7 9.7 28.6 14.6 31C17.1 27.5 16.5 23.3 11 21Z" fill={`url(#${petalGradientId})`} opacity="0.82" />
      <path d="M37 21C31.5 23.3 30.9 27.5 33.4 31C38.3 28.6 39.2 24.7 37 21Z" fill={`url(#${petalGradientId})`} opacity="0.82" />
      <path d="M12.6 30.2C15.9 34.5 20 36.5 24 36.5C28 36.5 32.1 34.5 35.4 30.2C28 31.7 20 31.7 12.6 30.2Z" fill={`url(#${petalGradientId})`} />
      <circle cx="24" cy="25.2" r="2" fill="#F59E0B" />
      <ellipse cx="24" cy="30.8" rx="11" ry="8" fill={`url(#${petalGlowId})`} />
    </svg>
  );
};
