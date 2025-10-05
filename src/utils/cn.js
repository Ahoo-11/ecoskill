export function cn(...classes) {
  return classes
    .flatMap((cls) => {
      if (typeof cls === 'string') {
        return cls.trim();
      }
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key.trim());
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}
