import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const events = (await getCollection('events'))
    .filter((e) => !e.data.draft && e.data.date >= new Date())
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Southern Navigators//Club Events//EN',
    'CALSCALE:GREGORIAN',
  ];

  for (const event of events) {
    const start = event.data.date.toISOString().replace(/[-:]/g, '').slice(0, 15);
    const end = new Date(event.data.date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').slice(0, 15);
    const title = event.data.title.replace(/[,;\\]/g, '\\$&');
    const desc = (event.data.summary ?? '').replace(/[,;\\]/g, '\\$&');
    const url = `https://www.southernnavigators.com/events/${event.slug}/`;
    lines.push(
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      desc ? `DESCRIPTION:${desc}` : '',
      `URL:${url}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');

  return new Response(lines.filter(Boolean).join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"',
    },
  });
};
