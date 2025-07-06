/**
 * - Map timezone to region
 * - Map region to timezone
 * - Convert date to different time zones
 */

import { Temporal } from '@js-temporal/polyfill';

export const regionToTZ = {
  'us-east-1': 'America/New_York',
  'us-west-2': 'America/Los_Angeles',
  'eu-west-1': 'Europe/Dublin',
  'eu-central-1': 'Europe/Berlin',
  'ap-southeast-1': 'Asia/Singapore',
  'ap-southeast-2': 'Australia/Sydney',
  'ap-northeast-1': 'Asia/Tokyo',
  'sa-east-1': 'America/Sao_Paulo'
};

export const tzToRegion = {
  'America/New_York': 'us-east-1',
  'America/Los_Angeles': 'us-west-2',
  'Europe/Dublin': 'eu-west-1',
  'Europe/Berlin': 'eu-central-1',
  'Asia/Singapore': 'ap-southeast-1',
  'Australia/Sydney': 'ap-southeast-2',
  'Asia/Tokyo': 'ap-northeast-1',
  'America/Sao_Paulo': 'sa-east-1'
};

const ZONES = {
  utc: 'UTC',
  br: 'America/Sao_Paulo',
  ie: 'Europe/Dublin',
  us1: 'America/New_York',
  us2: 'America/Chicago',
  us3: 'America/Denver',
  us4: 'America/Los_Angeles',
};

export function convertTZ(date, tz, prop) {
  const instant = Temporal.Instant.from(date.toString()); // fast path
  const zdt = instant.toZonedDateTimeISO(ZONES[tz]);
  return buildProps(zdt)[prop];
}

function buildProps(zdt) {
  return {
    full: zdt.toString({ timeZoneName: 'never' }),
    noTZ: zdt.toPlainDateTime().toString(),
    date: zdt.toPlainDate().toString(),
    time: zdt.toPlainTime().toString(),
    timeNoSec: zdt.minute === 0 ? `${zdt.hour}h` : zdt.toPlainTime().toString({ smallestUnit: 'minute' }),
    hour: zdt.hour,
    minute: String(zdt.minute).padStart(2, '0')
  };
}
