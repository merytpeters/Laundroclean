import prisma from '../../config/prisma.js';

const randomEmail = (): string => {
  const email = `user_${crypto.randomUUID().slice(0, 8)}@temporaryuser.com`;
  return email;
};

const randomPassword = (): string => {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const special = '!@#$%^&*';
  const all = lower + upper;

  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const randomPart = Array.from(bytes)
    .map(b => all[b % all.length])
    .join('');

  const upperChar = upper[Math.floor(Math.random() * upper.length)];
  const specialChar = special[Math.floor(Math.random() * special.length)];

  const passwordArray = (upperChar + randomPart + specialChar).split('');

  const shuffled = passwordArray
    .sort(() => Math.random() - 0.5)
    .join('');

  return shuffled;
};

const generateCustomBookingId = async (): Promise<string> => {
  const lastBooking = await prisma.booking.findFirst({
    orderBy: { customBookingId: 'desc' },
    select: { customBookingId: true }
  });

  const lastNumber = lastBooking?.customBookingId
    ? parseInt(lastBooking.customBookingId.split('-')[1] ?? '0', 10)
    : 0;

  const nextNumber = lastNumber + 1;

  return `BKG-${String(nextNumber).padStart(6, '0')}`;
};


export default {
  randomEmail,
  randomPassword,
  generateCustomBookingId
};
