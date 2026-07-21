# CNVRT legal launch confirmations

Status: substantive website policies implemented on 17 July 2026. The items below need owner or professional confirmation before the legal pages are treated as final legal advice.

## Required business details

Confirm the exact operator of `cnvrtdigital.co.uk`:

- legal entity or sole-trader name;
- whether CNVRT is a trading name;
- registered company number, if applicable;
- registered office address and country of registration, if a limited company; and
- an address for privacy correspondence if different.

Limited companies must display their registered number, registered office address, country of registration and full limited-company name on their website. Do not use details for another business with a similar CNVRT name.

## Required service confirmations

Before public launch:

- confirm the production Supabase project region and current subprocessors;
- confirm that the 24-month unsuccessful-enquiry retention period and six-year client-record period match actual practice;
- verify whether Netlify or another host is the production provider;
- add every analytics, advertising, embedded-booking or session-replay technology before enabling it;
- implement prior consent for any non-essential analytics or advertising technology; and
- obtain professional review of the privacy policy, cookie policy and website terms if legal assurance is required.

## Current cookie position

The code audit found:

- one secure `cnvrt_preview` cookie lasting 24 hours while the private preview gate is active;
- restricted Supabase administrator authentication storage;
- no active public Google Analytics, advertising pixel or session-replay script; and
- server-side form protection without a visitor-tracking cookie.

The cookie inventory and consent interface must be revisited whenever that position changes.
