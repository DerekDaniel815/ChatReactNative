export function formatChatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  // Helpers
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // domingo
  startOfWeek.setHours(0, 0, 0, 0);

  // Hoy → hora 12h
  if (isSameDay(date, now)) {
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Ayer
  if (isSameDay(date, yesterday)) {
    return 'Ayer';
  }

  // Esta semana → día
  if (date >= startOfWeek) {
    return date.toLocaleDateString('es-PE', { weekday: 'long' });
  }

  // Mas antiguo → DD/MM/YYYY
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
