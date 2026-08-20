#!/usr/bin/env node
/**
 * Re-checks this dataset against its own internal invariants, from `data/` alone.
 *
 * No network, no dependencies, no access to the pipeline that produced the data. Every check below
 * is one an outside reader can repeat by hand on a single record; this script only repeats it
 * once per published record. A check that needs anything not published here does not belong in this file.
 *
 * Usage: node scripts/verify.mjs [--data <dir>] [--quiet]
 */

import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const dataDir = argv.includes('--data') ? resolve(argv[argv.indexOf('--data') + 1]) : resolve(join(HERE, '..', 'data'));
const quiet = argv.includes('--quiet');

const results = [];
let currentFailures = [];

function check(name, fn) {
  currentFailures = [];
  let detail = '';
  try {
    detail = fn() ?? '';
  } catch (err) {
    currentFailures.push(`threw: ${err.message}`);
  }
  results.push({ name, failures: currentFailures.slice(0, 8), count: currentFailures.length, detail });
}

function fail(message) {
  currentFailures.push(message);
}

function readJsonl(file) {
  const text = readFileSync(join(dataDir, file), 'utf8');
  if (text === '') return [];
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        throw new Error(`${file} line ${i + 1} is not valid JSON: ${err.message}`);
      }
    });
}

/** Exact money comparison on the venues' own decimal strings, with no float ever touching a strike. */
function cents(value) {
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) throw new Error(`not a 2dp decimal string: ${JSON.stringify(value)}`);
  const [, sign, whole, frac = ''] = match;
  const n = BigInt(whole) * 100n + BigInt((frac + '00').slice(0, 2));
  return sign === '-' ? -n : n;
}

const basis = readJsonl('basis-pairs.jsonl');
const related = readJsonl('related-pairs.jsonl');
const metadata = readJsonl('market-metadata.jsonl');
const ruleChanges = readJsonl('rule-changes.jsonl');
const series = JSON.parse(readFileSync(join(dataDir, 'series-status.json'), 'utf8'));
const all = [...basis, ...related];
const metaByKey = new Map(metadata.map((m) => [m.market_key, m]));
const legs = (record) => [
  ['polymarket', record.polymarket],
  ['kalshi', record.kalshi],
];

/**
 * The published evidence-token vocabulary. A token that is not in this table is not a witness this
 * script will accept, because an unrecognised token cannot support any label.
 */
const TOKEN_TO_INDEX = {
  'text:brti': 'cf-benchmarks-brti',
  'text:erti': 'cf-benchmarks-erti',
  'text:binance': 'binance',
  'url:binance.com': 'binance',
};

// ---------------------------------------------------------------------------------------------

check('files load and carry the published schema tag', () => {
  for (const [i, r] of all.entries()) {
    if (r.schema !== 't3.match.v1') fail(`record ${i} has schema ${r.schema}`);
  }
  for (const m of metadata) {
    if (m.schema !== 't3.market-metadata.v1') fail(`${m.market_key} has schema ${m.schema}`);
  }
  if (series.schema !== 't3.series-status.v1') fail(`series-status.json has schema ${series.schema}`);
  return `${basis.length} basis pairs, ${related.length} related pairs, ${metadata.length} market records`;
});

check('every record is in the class its file claims', () => {
  for (const r of basis) if (r.equivalence_class !== 'basis-pair') fail(`${r.pair_id} is ${r.equivalence_class}`);
  for (const r of related) if (r.equivalence_class !== 'related') fail(`${r.pair_id} is ${r.equivalence_class}`);
  return `${basis.length} + ${related.length} records`;
});

check('one run id across the whole book', () => {
  const ids = new Set(all.map((r) => r.run_id));
  if (ids.size !== 1) fail(`${ids.size} run ids: ${[...ids].join(', ')}`);
  return `run ${[...ids][0]}`;
});

check('witness bijection: every settlement label is supported by a token in its own evidence', () => {
  const mapping = new Map();
  const inverse = new Map();
  for (const r of all) {
    for (const [side, leg] of legs(r)) {
      if (leg.settlement_index === 'unknown') continue;
      const witness = leg.settlement_index_witness;
      if (witness === null || witness === undefined) {
        fail(`${r.pair_id} ${side}: index ${leg.settlement_index} names no witness`);
        continue;
      }
      if (!leg.settlement_evidence.includes(witness)) {
        fail(`${r.pair_id} ${side}: witness ${witness} is absent from settlement_evidence`);
        continue;
      }
      const supported = TOKEN_TO_INDEX[witness];
      if (supported === undefined) {
        fail(`${r.pair_id} ${side}: witness ${witness} is outside the published token vocabulary`);
        continue;
      }
      if (supported !== leg.settlement_index) {
        fail(`${r.pair_id} ${side}: witness ${witness} supports ${supported}, not ${leg.settlement_index}`);
        continue;
      }
      mapping.set(witness, leg.settlement_index);
      const seen = inverse.get(leg.settlement_index);
      if (seen !== undefined && seen !== witness) {
        fail(`index ${leg.settlement_index} is witnessed by both ${seen} and ${witness}`);
      }
      inverse.set(leg.settlement_index, witness);
    }
  }
  return `${mapping.size} witness tokens map one-to-one onto ${inverse.size} settlement indices`;
});

check('witness bijection: no label outruns its own rule text', () => {
  let checked = 0;
  for (const r of all) {
    for (const [side, leg] of legs(r)) {
      const meta = metaByKey.get(`${side}:${leg.venue_market_id}`);
      if (!meta) {
        fail(`${r.pair_id} ${side}: no market-metadata record for ${leg.venue_market_id}`);
        continue;
      }
      const rules = (meta.rules_text ?? '').toLowerCase();
      const witness = leg.settlement_index_witness;
      if (witness && witness.startsWith('text:') && !rules.includes(witness.slice(5).toLowerCase())) {
        fail(`${r.pair_id} ${side}: witness ${witness} does not appear in the venue rule text`);
      }
      const phrase = leg.settlement_functional.evidence;
      if (phrase && !rules.includes(phrase.toLowerCase())) {
        fail(`${r.pair_id} ${side}: functional phrase ${JSON.stringify(phrase)} is not in the venue rule text`);
      }
      if (leg.settlement_functional.rules_digest !== meta.rules_digest) {
        fail(`${r.pair_id} ${side}: rules_digest disagrees with the market-metadata snapshot`);
      }
      checked += 1;
    }
  }
  return `${checked} legs re-derived against the venues' own published rule text`;
});

check('witness bijection: functional, quote and unit labels each name their evidence', () => {
  for (const r of all) {
    for (const [side, leg] of legs(r)) {
      const f = leg.settlement_functional;
      if (f.kind !== 'unknown' && !(f.evidence ?? '').trim()) fail(`${r.pair_id} ${side}: kind ${f.kind} has no phrase`);
      if (f.quote_currency !== 'unknown' && !(f.quote_witness ?? '')) fail(`${r.pair_id} ${side}: quote ${f.quote_currency} has no witness`);
      if (leg.strike.unit !== 'unknown' && !/\bunit(?:-source)?:/.test(leg.strike.evidence)) {
        fail(`${r.pair_id} ${side}: strike unit ${leg.strike.unit} records no unit basis`);
      }
    }
  }
  return 'all four witnessed label families checked on both legs';
});

check('close delta is exactly zero on every basis pair', () => {
  for (const r of basis) {
    if (r.close_delta_ms !== 0) fail(`${r.pair_id}: close_delta_ms ${r.close_delta_ms}`);
    if (r.polymarket.close_ms !== r.kalshi.close_ms) fail(`${r.pair_id}: close_ms differs between legs`);
  }
  const closes = new Set(basis.map((r) => r.kalshi.close_ms));
  return `${basis.length} pairs on ${closes.size} distinct listed closes`;
});

check('cent bridge is exact: the Kalshi floor plus one cent is the Polymarket floor', () => {
  for (const r of basis) {
    const k = cents(r.kalshi.strike.floor);
    const p = cents(r.polymarket.strike.floor);
    if (p - k !== 1n) fail(`${r.pair_id}: gap is ${Number(p - k)} cents, not 1`);
    if (r.kalshi.strike.bound !== 'exclusive' || r.polymarket.strike.bound !== 'exclusive') {
      fail(`${r.pair_id}: a bound is not exclusive (${r.polymarket.strike.bound} / ${r.kalshi.strike.bound})`);
    }
    if (r.polymarket.strike.relation !== r.kalshi.strike.relation) fail(`${r.pair_id}: relations differ`);
    if (r.relation_equal !== true) fail(`${r.pair_id}: relation_equal is not true`);
  }
  return `${basis.length} pairs, every one exactly one quotation tick apart on a 0.01 grid`;
});

check('degree 1: no market appears in two basis pairs', () => {
  const seen = new Map();
  for (const r of basis) {
    for (const [side, leg] of legs(r)) {
      const key = `${side}:${leg.venue_market_id}`;
      if (seen.has(key)) fail(`${key} appears in ${seen.get(key)} and ${r.pair_id}`);
      seen.set(key, r.pair_id);
    }
  }
  return `${seen.size} distinct markets across ${basis.length} pairs, a perfect matching`;
});

check('the basis-pair class means what it says', () => {
  for (const r of basis) {
    if (r.functional_agreement !== 'different') fail(`${r.pair_id}: functional_agreement ${r.functional_agreement}`);
    if (JSON.stringify(r.failed_gates) !== JSON.stringify(['measurement-instant'])) {
      fail(`${r.pair_id}: failed_gates ${JSON.stringify(r.failed_gates)}`);
    }
    const p = r.polymarket.settlement_functional;
    const k = r.kalshi.settlement_functional;
    if (p.kind === k.kind && p.window_ms === k.window_ms && p.window_position === k.window_position) {
      fail(`${r.pair_id}: both legs read the same statistic, so it is not a basis pair`);
    }
  }
  return 'every pair fails the measurement-instant gate and no other';
});

check('four caveats ride on every record, in the published order', () => {
  const heads = ['index basis', 'quote-currency basis', 'measurement-window basis'];
  for (const r of all) {
    if (r.caveats.length !== 4) {
      fail(`${r.pair_id}: ${r.caveats.length} caveats`);
      continue;
    }
    heads.forEach((head, i) => {
      if (!r.caveats[i].startsWith(`${head}:`)) fail(`${r.pair_id}: caveat ${i + 1} is not the ${head}`);
    });
    const fourth = r.caveats[3];
    if (!/^(threshold knife-edge:|thresholds differ by )/.test(fourth)) {
      fail(`${r.pair_id}: the fourth caveat names no threshold relationship`);
    }
    for (const [, leg] of legs(r)) {
      if (leg.settlement_index !== 'unknown' && !r.caveats[0].includes(leg.settlement_index)) {
        fail(`${r.pair_id}: the index caveat does not name ${leg.settlement_index}`);
      }
      if (leg.settlement_functional.quote_currency !== 'unknown' && !r.caveats[1].includes(leg.settlement_functional.quote_currency)) {
        fail(`${r.pair_id}: the quote caveat does not name ${leg.settlement_functional.quote_currency}`);
      }
    }
  }
  return `${all.length} records, 4 caveats each`;
});

check('the knife-edge caveat fires on exactly the one-tick records', () => {
  let knife = 0;
  for (const r of all) {
    if (r.caveats.length !== 4) {
      fail(`${r.pair_id}: ${r.caveats.length} caveats, so there is no threshold caveat to check`);
      continue;
    }
    const isKnife = r.caveats[3].startsWith('threshold knife-edge:');
    const gap = cents(r.polymarket.strike.floor) - cents(r.kalshi.strike.floor);
    const oneTick = gap === 1n || gap === -1n;
    if (isKnife !== oneTick) fail(`${r.pair_id}: knife-edge=${isKnife} but the measured gap is ${Number(gap)} cents`);
    if (isKnife) knife += 1;
  }
  return `${knife} of ${all.length} records are one tick apart and carry knife-edge wording`;
});

check('no cross-venue same-measurement-instant match is claimed anywhere', () => {
  for (const r of all) {
    if (r.equivalence_class === 'identical' || r.equivalence_class === 'near-equivalent') {
      fail(`${r.pair_id} is published as ${r.equivalence_class}`);
    }
  }
  return 'zero identical and zero near-equivalent records, which is the headline finding';
});

check('market metadata covers every published leg', () => {
  const needed = new Set();
  for (const r of all) for (const [side, leg] of legs(r)) needed.add(`${side}:${leg.venue_market_id}`);
  for (const key of needed) if (!metaByKey.has(key)) fail(`no metadata for ${key}`);
  for (const m of metadata) {
    if (!needed.has(m.market_key)) fail(`metadata for ${m.market_key} belongs to no published pair`);
    if (!(m.rules_text ?? '').trim()) fail(`${m.market_key} carries no rule text`);
    if (m.rules_digests_observed.length < 1) fail(`${m.market_key} records no rule digest at all`);
    if (!m.rules_digests_observed.includes(m.rules_digest)) {
      fail(`${m.market_key} names a current digest it never lists among the ones it observed`);
    }
    if (m.first_seen > m.last_seen) fail(`${m.market_key} was first seen after it was last seen`);
  }
  const stable = metadata.filter((m) => m.rules_digests_observed.length === 1).length;
  return `${metadata.length} markets, all with rule text; ${stable} on one rule digest, ${metadata.length - stable} whose rule moved`;
});

/**
 * A market whose resolution rule MOVED is the single most valuable thing this dataset can catch, so
 * the check on it has to be a consistency check and not a stability check. An earlier version of this
 * file required every market to sit on exactly one digest, which would have rejected the dataset the
 * first time it recorded the event it exists to record.
 *
 * What is actually checkable from these two files alone: for each published market, the changes
 * logged against it must form an unbroken walk through the digests its metadata says it was seen
 * carrying, and that walk must end on the digest it carries now. Reverts are allowed - a venue may
 * undo an edit, and the walk simply returns to a digest it already visited.
 */
check('the rule-change log and the metadata tell the same story, market by market', () => {
  const byMarket = new Map();
  for (const c of ruleChanges) {
    const key = `${c.venue}:${c.venue_market_id}`;
    if (!byMarket.has(key)) byMarket.set(key, []);
    byMarket.get(key).push(c);
  }

  const short = (digest) => String(digest).slice(0, 12);
  let logged = 0;

  for (const m of metadata) {
    const walk = byMarket.get(m.market_key) ?? [];
    const observed = new Set(m.rules_digests_observed);
    logged += walk.length;

    if (walk.length === 0) {
      if (observed.size > 1) {
        fail(
          `${m.market_key} was seen carrying ${observed.size} rule digests but the log records no change for it, so the evidence chain is broken (a capture whose rule text was unreadable does this)`,
        );
      }
      continue;
    }

    walk.forEach((c, i) => {
      for (const digest of [c.previous_digest, c.current_digest]) {
        if (!observed.has(digest)) fail(`${m.market_key}: the log names digest ${short(digest)}, which the metadata never observed`);
      }
      const next = walk[i + 1];
      if (next && next.previous_digest !== c.current_digest) {
        fail(`${m.market_key}: the log leaves ${short(c.current_digest)} and resumes at ${short(next.previous_digest)}, with no change accounting for the step between them`);
      }
    });

    const named = new Set(walk.flatMap((c) => [c.previous_digest, c.current_digest]));
    for (const digest of observed) {
      if (!named.has(digest)) fail(`${m.market_key}: the metadata observed digest ${short(digest)} that no logged change accounts for`);
    }

    const last = walk[walk.length - 1];
    if (last.current_digest !== m.rules_digest) {
      fail(`${m.market_key}: the log ends at ${short(last.current_digest)} but the market's current rule digest is ${short(m.rules_digest)}`);
    }
  }

  const moved = metadata.filter((m) => m.rules_digests_observed.length > 1).length;
  return `${ruleChanges.length} change(s) logged over the whole capture corpus, ${logged} of them on the ${moved} published market(s) whose rule moved`;
});

check('series status matches the data it describes', () => {
  const d = series.divergence_series;
  const total = d.basis_pairs_with_books_on_both_venues + d.basis_pairs_with_a_book_on_one_venue_only + d.basis_pairs_with_no_book_at_all;
  if (total !== basis.length) fail(`the divergence counts sum to ${total}, not ${basis.length}`);
  if (d.cross_venue_price_series_available !== (d.basis_pairs_with_books_on_both_venues > 0)) {
    fail('the availability flag contradicts the both-venues count');
  }
  if (series.run_id !== basis[0].run_id) fail(`series run id ${series.run_id} is not the book's run id`);
  return `${series.book_snapshots} book snapshots, ${d.basis_pairs_with_books_on_both_venues} pairs booked on both venues`;
});

check('the CSV render agrees with the JSONL book row for row', () => {
  const text = readFileSync(join(dataDir, 'basis-pairs.csv'), 'utf8');
  const rows = parseCsv(text);
  const header = rows.shift();
  if (rows.length !== basis.length) fail(`${rows.length} CSV rows against ${basis.length} JSONL records`);
  const col = (row, name) => row[header.indexOf(name)];
  const byId = new Map(basis.map((r) => [r.pair_id, r]));
  for (const row of rows) {
    const id = col(row, 'pair_id');
    const r = byId.get(id);
    if (!r) {
      fail(`CSV row ${id} has no JSONL record`);
      continue;
    }
    const pairs = [
      ['kalshi_strike_floor', r.kalshi.strike.floor],
      ['polymarket_strike_floor', r.polymarket.strike.floor],
      ['close_ms', String(r.kalshi.close_ms)],
      ['close_delta_ms', String(r.close_delta_ms)],
      ['kalshi_settlement_index', r.kalshi.settlement_index],
      ['polymarket_settlement_index', r.polymarket.settlement_index],
      ['kalshi_functional_kind', r.kalshi.settlement_functional.kind],
      ['polymarket_functional_kind', r.polymarket.settlement_functional.kind],
      ['caveat_index_basis', r.caveats[0]],
      ['caveat_quote_currency_basis', r.caveats[1]],
      ['caveat_measurement_window_basis', r.caveats[2]],
      ['caveat_threshold', r.caveats[3]],
    ];
    for (const [name, expected] of pairs) {
      if (col(row, name) !== expected) fail(`${id}: CSV ${name} is ${JSON.stringify(col(row, name))}, JSONL says ${JSON.stringify(expected)}`);
    }
  }
  return `${rows.length} CSV rows, ${header.length} columns, every field traced back to the record`;
});

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------

const failed = results.filter((r) => r.count > 0);
for (const r of results) {
  if (r.count === 0) {
    if (!quiet) console.log(`PASS  ${r.name}${r.detail ? `\n        ${r.detail}` : ''}`);
  } else {
    console.log(`FAIL  ${r.name}  (${r.count} problem${r.count === 1 ? '' : 's'})`);
    for (const f of r.failures) console.log(`        ${f}`);
    if (r.count > r.failures.length) console.log(`        ... and ${r.count - r.failures.length} more`);
  }
}
console.log(`\n${results.length - failed.length}/${results.length} checks passed over ${basis.length} basis pairs and ${related.length} related pairs.`);
process.exit(failed.length === 0 ? 0 : 1);
