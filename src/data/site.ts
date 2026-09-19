export const site = {
  name: 'Vince Benitez',
  role: 'Graduate Games Programmer',
  email: 'benitez.vinceaaron@gmail.com',
  location: '[REPLACE: City, United Kingdom]',
  introduction: 'Computer Games Programming graduate focused on gameplay systems, player engagement and interactive experiences.',
  github: '[REPLACE: Full GitHub profile URL]',
  linkedin: '[REPLACE: Full LinkedIn profile URL]',
  cv: '/cv/vince-benitez-cv.pdf',
} as const;

export const isRealUrl = (value?: string): value is string =>
  Boolean(value && /^https:\/\/[^\s]+$/i.test(value) && !value.includes('[REPLACE'));

export const isRealMediaPath = (value?: string): value is string =>
  Boolean(value && value.startsWith('/') && !value.includes('[REPLACE'));
