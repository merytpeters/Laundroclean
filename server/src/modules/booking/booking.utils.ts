import prisma from '../../config/prisma.js';
import { Prisma } from '@prisma/client';

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



const geocodeAddress = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        format: 'json',
        q: address,
        limit: '1',
    })}`;

    const res = await fetch(url, {
        headers: {
            'User-Agent': 'LaundroClean/1.0',
        },
    });

    if (!res.ok) {
        const errorText = await res.text();

        throw new Error(
            `Geocoding API error (${res.status}): ${errorText}`
        );
    }

    const data = await res.json();

    if (!data || data.length === 0) {
        throw new Error(`Unable to geocode address: ${address}`);
    }

    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
    };
};


/**
 * Calculate distance between two coordinates in kilometers
 */
const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Find nearest active pickup point to given coordinates
 */
const nearestDropOffPoint = async (lat: number, lng: number, tx: Prisma.TransactionClient) => {
  // Fetch all active pickup points with coordinates
  const points = await tx.dropOffPoint.findMany({
    where: {
      isActive: true,
      lat: { not: null },
      lng: { not: null },
    },
  });

  if (!points.length) return null;

  // Find the nearest one
  let nearest = points[0]!;
  let minDistance = haversineDistance(lat, lng, nearest.lat!, nearest.lng!);

  for (const p of points.slice(1)) {
    const dist = haversineDistance(lat, lng, p.lat!, p.lng!);
    if (dist < minDistance) {
      nearest = p;
      minDistance = dist;
    }
  }

  return nearest;
};

const enforceMinPickup = async (
  pickupTime: Date | null,
  tx: Prisma.TransactionClient
): Promise<Date> => {
  const setting = await tx.bookingSettings.findUnique({ where: { id: 1 } });
  const minDays = setting?.minPickupDays ?? 3;

  const now = new Date();
  const minPickupDate = new Date();
  minPickupDate.setDate(now.getDate() + minDays);

  if (!pickupTime || pickupTime < minPickupDate) {
    return minPickupDate;
  }
  return pickupTime;
};



export default {
  randomEmail,
  randomPassword,
  generateCustomBookingId,
  geocodeAddress,
  nearestDropOffPoint,
  enforceMinPickup
};
