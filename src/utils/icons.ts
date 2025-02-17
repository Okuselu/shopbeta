interface Feather {
  replace: () => void;
}

declare global {
  interface Window {
    feather: Feather;
  }
}

export const refreshIcons = () => {
  if (typeof window.feather !== 'undefined') {
    window.feather.replace();
  }
};