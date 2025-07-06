/**
 * 
 * What this helper do:
 * - Map timezone to region (for Vercel)
 * - Map region to timezone (for Vercel)
 * 
 * How to use it:
 * import { regionTZ, tzRegion } from './tz-map';
 * - const getTimezone = regionTZ['us-east-1'] // America/New_York
 * - const getRegion = tzRegion['America/New_York'] // us-east-1
 */

export const regionToTZ = {
  'us-east-1':      'America/New_York',
  'us-west-2':      'America/Los_Angeles',
  'eu-west-1':      'Europe/Dublin',
  'eu-central-1':   'Europe/Berlin',
  'ap-southeast-1': 'Asia/Singapore',
  'ap-southeast-2': 'Australia/Sydney',
  'ap-northeast-1': 'Asia/Tokyo',
  'sa-east-1':      'America/Sao_Paulo'
};

export const tzToRegion = {
  'America/New_York':      'us-east-1',
  'America/Los_Angeles':   'us-west-2',
  'Europe/Dublin':         'eu-west-1',
  'Europe/Berlin':         'eu-central-1',
  'Asia/Singapore':        'ap-southeast-1',
  'Australia/Sydney':      'ap-southeast-2',
  'Asia/Tokyo':            'ap-northeast-1',
  'America/Sao_Paulo':     'sa-east-1'
};
