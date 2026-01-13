import { useEffect } from 'react';

export const useClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  onOutsideClick: () => void
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, onOutsideClick]);
};

export const userIconColors = [
  '#E53935', // deep red
  '#8E24AA', // rich purple
  '#3949AB', // deep indigo
  '#1E88E5', // strong blue
  '#00897B', // teal green
  '#43A047', // forest green
  '#FB8C00', // vivid orange
  '#F4511E', // warm orange-red
];

export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % userIconColors.length;
  return userIconColors[index];
};

export const generateLetterAvatar = (name: string) => {
  const firstLetter = name?.charAt(0)?.toUpperCase() || '?';
  const bgColor = stringToColor(name || 'User');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100%" height="100%" fill="${bgColor}" />
      <text x="50%" y="55%" font-size="50" text-anchor="middle" fill="white" font-family="Arial" dy=".3em">${firstLetter}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
