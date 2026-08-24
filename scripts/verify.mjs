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

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const dataDir = argv.includes('--data') ? resolve(argv[argv.indexOf('--data') + 1]) : resolve(join(HERE, '..', 'data'));
const quiet = argv.includes('--quiet');

/**
 * Credential shapes that must never be echoed back out of this script.
 *
 * This file prints its failures into CI logs and into other people's terminals, and everything it
 * reads is data it did not produce. A check that quotes the bytes it just rejected is how a
 * credential that reached the dataset also reaches the log, so every message is filtered on its way
 * out. What a failure may name: the check, the file and line the record came from, published
 * identifiers, vocabulary labels, counts and instants. What it may never name: the venue rule text
 * and the phrases read out of it, and the value of any field that failed its own type check.
 *
 * Mirrored from the publication guard's table in src/publish/guard.ts, and pinned to it by a test in
 * that repository so the two cannot drift.
 */
const SECRET_PATTERNS = [
  { name: 'github personal access token', re: /\bghp_[A-Za-z0-9]{20,}/g },
  { name: 'github fine-grained token', re: /\bgithub_pat_[A-Za-z0-9_]{20,}/g },
  { name: 'github app or oauth token', re: /\bgh[ousr]_[A-Za-z0-9]{20,}/g },
  { name: 'private key block', re: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/g },
  { name: 'putty or sshcom private key', re: /(?:PuTTY-User-Key-File|BEGIN SSH2 ENCRYPTED PRIVATE KEY)/g },
  { name: 'aws access key id', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { name: 'aws secret access key assignment', re: /aws_secret_access_key\s*[=:]/gi },
  { name: 'slack token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}/g },
  { name: 'stripe live key', re: /\b[rs]k_live_[A-Za-z0-9]{16,}/g },
  { name: 'google api key', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { name: 'anthropic api key', re: /\bsk-ant-[A-Za-z0-9_-]{16,}/g },
  { name: 'generic sk- api key', re: /\bsk-[A-Za-z0-9]{32,}\b/g },
  { name: 'npm access token', re: /\bnpm_[A-Za-z0-9]{30,}/g },
  { name: 'json web token', re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./g },
  { name: 'credential assignment', re: /\b(?:api[_-]?key|secret|password|passwd|passphrase|access[_-]?token|auth[_-]?token)\s*[=:]\s*["'][^"']{8,}["']/gi },
  { name: 'authorization header', re: /\bAuthorization\s*:\s*(?:Basic|Bearer)\s+\S{8,}/gi },
  { name: 'credentials embedded in a url', re: /\bhttps?:\/\/[^/\s:@]+:[^/\s@]+@/g },
  { name: 'private ipv4 host', re: /\b(?:10|127)\.\d{1,3}\.\d{1,3}\.\d{1,3}\b|\b192\.168\.\d{1,3}\.\d{1,3}\b|\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/g },
  { name: 'loopback or internal hostname', re: /\bhttps?:\/\/(?:localhost|[^/\s]*\.(?:internal|local|corp|intranet|lan))\b/gi },
  { name: 'developer home directory path', re: /(?:\/Users\/[A-Za-z0-9._-]+\/|\/home\/[A-Za-z0-9._-]+\/|[A-Z]:\\Users\\)/g },
  { name: 'ci runner temp path', re: /\$?\{?RUNNER_TEMP\}?|\/home\/runner\/work\//gi },
  { name: 'this project deploy secret', re: /T3_PUBLISH_DEPLOY_KEY|GIT_SSH_COMMAND/g },
];

function redact(message) {
  let out = String(message);
  for (const pattern of SECRET_PATTERNS) out = out.replace(pattern.re, `[redacted ${pattern.name}]`);
  return out;
}

/** Says what a field IS without quoting it; only numbers and booleans, which cannot carry text, are printed as themselves. */
function describe(value) {
  if (value === undefined) return 'absent';
  if (value === null) return 'null';
  if (Array.isArray(value)) return `an array of ${value.length}`;
  const kind = typeof value;
  if (kind === 'number' || kind === 'boolean') return String(value);
  if (kind === 'string') return `a ${value.length}-character string`;
  if (kind === 'object') return `an object with ${Object.keys(value).length} key(s)`;
  return `a ${kind}`;
}

const results = [];
let currentFailures = [];

function check(name, fn) {
  currentFailures = [];
  let detail = '';
  try {
    detail = fn() ?? '';
  } catch (err) {
    currentFailures.push(redact(`threw: ${err.message}`));
  }
  results.push({ name, failures: currentFailures.slice(0, 8), count: currentFailures.length, detail: redact(detail) });
}

function fail(message) {
  currentFailures.push(redact(message));
}

const SOURCE = new WeakMap();

/** Where a record came from, so a failure can name a location instead of quoting the bytes it rejected. */
function at(record) {
  if (record === null || typeof record !== 'object') return 'a non-object record';
  return SOURCE.get(record) ?? 'an unpublished record';
}

function readJsonl(file) {
  const text = readFileSync(join(dataDir, file), 'utf8');
  if (text === '') return [];
  return text
    .split('\n')
    .map((line, i) => ({ line, number: i + 1 }))
    .filter((entry) => entry.line.trim() !== '')
    .map((entry) => {
      let record;
      try {
        record = JSON.parse(entry.line);
      } catch {
        // the parser's own message quotes the offending bytes, so the location is the whole report
        throw new Error(`${file} line ${entry.number} is not valid JSON`);
      }
      if (record !== null && typeof record === 'object') SOURCE.set(record, `${file} line ${entry.number}`);
      return record;
    });
}

/** Exact money comparison on the venues' own decimal strings, with no float ever touching a strike. */
function cents(value) {
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) throw new Error(`not a 2dp decimal string, but ${describe(value)}`);
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

const HEX_64 = /^[0-9a-f]{64}$/;
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
const VENUES = ['polymarket', 'kalshi'];
const RULE_CHANGE_SCHEMA = 't3.rule-change.v1';

/**
 * The published rule-change vocabulary, and the dimension each class is named after.
 *
 * `cosmetic` is the one class that is not material: it means the venue moved words without moving a
 * single tracked term. Every other class is named after a dimension that must therefore appear in
 * the record's own `fields_changed`, which is what makes the label checkable instead of decorative.
 */
const CLASSIFICATION_FIELD = {
  cosmetic: null,
  'threshold-change': 'numbers',
  'source-change': 'settlement_source',
  'timing-change': 'dates_or_times',
  'scope-change': 'relation_or_scope_wording',
  unclassified: 'content_words',
};

/** Dimensions that are read out of the rule text alone, so an empty text diff cannot report them. */
const TEXT_ONLY_FIELDS = ['numbers', 'relation_or_scope_wording', 'content_words'];

const short = (digest) => String(digest).slice(0, 12);

/**
 * The producer's canonicalisation, re-implemented so a digest can be recomputed from the text
 * published next to it rather than merely compared to another copy of itself.
 *
 * Two published records can agree on a digest and still both be wrong; only re-deriving the hash
 * from the venue's own republished words binds the digest to a document a reader can read.
 */
function normalizeRuleText(text) {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    // must run AFTER the per-line trim, or a blank line padded with a space is not seen as blank
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function ruleDigest(parts) {
  const joined = parts
    .filter((part) => typeof part === 'string' && part.trim() !== '')
    .map((part) => normalizeRuleText(part))
    .join('\n---\n');
  return joined === '' ? null : createHash('sha256').update(joined, 'utf8').digest('hex');
}

const changeLabel = (change, index) => {
  const named = change !== null && typeof change === 'object';
  const venue = named && typeof change.venue === 'string' ? change.venue : '?';
  const id = named && typeof change.venue_market_id === 'string' ? change.venue_market_id : '?';
  return `${named ? at(change) : `rule-changes.jsonl record ${index + 1}`} (${venue}:${id})`;
};

/** Bounded diff width, mirrored from the producer so the rendered log can be rebuilt from the rows. */
const MAX_DIFF_OPS = 20;

/**
 * The producer's rule-change log renderer, re-implemented so the published markdown can be rebuilt
 * from the machine-readable rows and metadata and compared byte for byte. Any drift between the prose
 * a reader sees and the rows a machine reads is then a publish-gate failure, not the reader's problem.
 */
function renderRuleChangeLog(changes, marketsWithHistory) {
  const lines = ['# T3 resolution-rule change log', ''];
  const material = changes.filter((change) => change.material);
  lines.push(
    `Markets with more than one capture: ${marketsWithHistory}`,
    `Rule-digest movements detected: ${changes.length} (${material.length} material, ${changes.length - material.length} cosmetic)`,
    '',
    'Every count here is a LOWER BOUND. The crawl runs every six hours, so a rule that changed and',
    'reverted inside one window leaves no trace, and each entry names the window it happened inside',
    'rather than an instant it happened at.',
    '',
  );

  if (changes.length === 0) {
    lines.push(
      'No rule change has been observed yet. That requires the same market captured at least twice',
      'with a moved rule digest, which needs more than one capture cycle in the committed history.',
      '',
    );
    return `${lines.join('\n')}\n`;
  }

  for (const change of changes) {
    lines.push(
      `## ${change.venue} \`${change.ticker}\``,
      '',
      `- window: ${change.observed_from} to ${change.observed_to} (${Math.round(change.observed_window_ms / 60000)} minutes)`,
      `- classification: **${change.classification}**${change.material ? '' : ' (not reported as a rule change in the headline)'}`,
      `- fields changed: ${change.fields_changed.length === 0 ? 'none' : change.fields_changed.join(', ')}`,
      `- digest: \`${change.previous_digest.slice(0, 12)}\` to \`${change.current_digest.slice(0, 12)}\``,
      '',
    );
    for (const op of change.diff) {
      if (op.op === 'replace') {
        lines.push(`  - replace:`, `    - before: ${op.before}`, `    - after: ${op.after}`);
      } else if (op.op === 'delete') {
        lines.push(`  - delete: ${op.before}`);
      } else {
        lines.push(`  - insert: ${op.after}`);
      }
    }
    if (change.diff_truncated) lines.push(`  - (diff truncated at ${MAX_DIFF_OPS} operations)`);
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

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
        fail(`${at(r)} ${r.pair_id} ${side}: the functional phrase (${phrase.length} characters) is not in the venue rule text`);
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

/**
 * A token is not a witness. "The proprietary exchange feed, not Binance, determines the result"
 * contains the token `binance` and rejects the source in the same breath, and a check that reads the
 * token without its clause publishes a rejected feed as an endorsed one. The clause travels with the
 * record for exactly this reason, so the polarity is checkable here without the pipeline.
 */
const NON_ENDORSING = [
  /\bwhile\s+(?:checking|consulting|looking at)\b[^.]*?\bmay\s+(?:help|be)\b[^.]*?(?=,)/gi,
  /\bnot\s+according\s+to\b[^.]*/gi,
  /,\s*not\s+[^,.;:]{1,80}/gi,
  /\bnot\s+[^,.;:]{1,80}/gi,
  /\b(?:instead\s+of|rather\s+than|other\s+than|excluding|except\s+for)\s+[^,.;:]{1,80}/gi,
  /\bdoes\s+not\s+(?:use|rely\s+on|reference|determine|include)\s+[^,.;:]{1,80}/gi,
];

function endorsingPartOf(clause) {
  let kept = clause;
  for (const pattern of NON_ENDORSING) {
    pattern.lastIndex = 0;
    kept = kept.replace(pattern, (hit) => ' '.repeat(hit.length));
  }
  return kept;
}

check('every settlement source is witnessed by a clause that endorses it', () => {
  let checked = 0;
  for (const r of all) {
    for (const [side, leg] of legs(r)) {
      if (leg.settlement_index === 'unknown') continue;
      const clause = leg.settlement_index_clause;
      const witness = leg.settlement_index_witness;
      if (typeof clause !== 'string' || clause.trim() === '') {
        fail(`${r.pair_id} ${side}: index ${leg.settlement_index} names no operative clause`);
        continue;
      }
      const body = String(witness).replace(/^(?:text|url):/, '').toLowerCase();
      const lower = clause.toLowerCase();
      if (!lower.includes(body)) {
        fail(`${r.pair_id} ${side}: the clause does not contain its own witness ${witness}`);
        continue;
      }
      if (!endorsingPartOf(lower).includes(body)) {
        fail(`${at(r)} ${r.pair_id} ${side}: the clause (${clause.length} characters) REJECTS ${witness} rather than endorsing it`);
        continue;
      }
      const meta = metaByKey.get(`${side}:${leg.venue_market_id}`);
      const source = `${meta?.rules_text ?? ''}\n${meta?.rules_secondary ?? ''}`.toLowerCase();
      if (!source.includes(lower)) {
        fail(`${r.pair_id} ${side}: the clause is not quotable back to the venue's own rule text`);
        continue;
      }
      checked += 1;
    }
  }
  return `${checked} settlement labels carry an endorsing clause found verbatim in the venue's rule text`;
});

/**
 * The unit basis vocabulary, and what each basis can actually establish. A comma-grouped magnitude
 * says the number is at least a thousand; it says nothing about whether they are dollars, and the
 * earlier check accepted any unit as long as the string "unit:" appeared somewhere beside it.
 */
const UNIT_FROM_BASIS = {
  'currency symbol': 'usd',
  'magnitude suffix': 'usd',
  'percent sign': 'percent',
  'count noun': 'count',
};

check('every unit label is one its own recorded basis can establish', () => {
  let checked = 0;
  for (const r of all) {
    for (const [side, leg] of legs(r)) {
      if (leg.strike.unit === 'unknown') continue;
      const hit = /\bunit(?:-source)?:\s*([^|]+)/.exec(leg.strike.evidence);
      if (!hit) {
        fail(`${r.pair_id} ${side}: strike unit ${leg.strike.unit} records no unit basis`);
        continue;
      }
      const basis = hit[1].trim().toLowerCase();
      const supported = Object.entries(UNIT_FROM_BASIS).find(([name]) => basis.startsWith(name));
      if (!supported) {
        fail(`${at(r)} ${r.pair_id} ${side}: the recorded unit basis (${basis.length} characters) establishes no unit at all, yet the leg claims ${leg.strike.unit}`);
        continue;
      }
      if (supported[1] !== leg.strike.unit) {
        fail(`${at(r)} ${r.pair_id} ${side}: the recorded unit basis establishes ${supported[1]}, not the ${leg.strike.unit} the leg claims`);
        continue;
      }
      checked += 1;
    }
  }
  return `${checked} unit labels each traced to a basis that can establish them`;
});

const NUMBER_WORDS = { ten: 10, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60 };
const UNIT_MS = { second: 1000, minute: 60_000, hour: 3_600_000 };
const POSITION_WORDS = {
  'precedes-close': /\b(?:before|preceding|prior to|up to|leading up to)\b/i,
  'ends-at-close': /\b(?:ends?|ending|ended)\s+(?:on|at)\b/i,
  'follows-close': /\b(?:after|following)\b/i,
  'centered-on-close': /\bcent(?:e|re|er)ed\s+(?:on|at)\b/i,
};

/**
 * "the sixty seconds before", "after" and "centered on" are three different observations and were
 * three identical records, because the stored phrase stopped at the interval and the position was
 * asserted beside it. A label whose own phrase does not state it is not auditable from the artifact,
 * which is the whole promise this dataset makes about its evidence.
 */
check('every functional label states the window and position its own phrase names', () => {
  let checked = 0;
  for (const r of all) {
    for (const [side, leg] of legs(r)) {
      const f = leg.settlement_functional;
      if (f.kind === 'unknown') continue;
      const phrase = String(f.evidence ?? '');
      const wording = POSITION_WORDS[f.window_position];
      if (!wording) {
        fail(`${r.pair_id} ${side}: window_position ${f.window_position} is outside the published vocabulary`);
        continue;
      }
      if (!wording.test(phrase)) {
        fail(`${at(r)} ${r.pair_id} ${side}: the stored phrase (${phrase.length} characters) does not state the position ${f.window_position}`);
        continue;
      }
      for (const [position, other] of Object.entries(POSITION_WORDS)) {
        if (position !== f.window_position && other.test(phrase)) {
          fail(`${r.pair_id} ${side}: the phrase also states ${position}, so ${f.window_position} is not the reading it supports`);
        }
      }
      if (f.kind === 'point-close' && f.window_ms !== 0) {
        fail(`${r.pair_id} ${side}: a point observation carries a ${f.window_ms} ms window`);
        continue;
      }
      if (f.kind === 'window-mean') {
        const hit = /\b(\d+|ten|fifteen|twenty|thirty|forty|fifty|sixty)?\s*(second|minute|hour)s?\b/i.exec(phrase);
        if (!hit) {
          fail(`${r.pair_id} ${side}: the phrase names no interval, yet the leg claims a ${f.window_ms} ms window`);
          continue;
        }
        const count = hit[1] === undefined ? 1 : (NUMBER_WORDS[hit[1].toLowerCase()] ?? Number(hit[1]));
        const stated = count * UNIT_MS[hit[2].toLowerCase()];
        if (stated !== f.window_ms) {
          fail(`${r.pair_id} ${side}: the phrase names ${stated} ms but the leg claims ${f.window_ms} ms`);
          continue;
        }
      }
      checked += 1;
    }
  }
  return `${checked} functional labels re-read from the phrase stored beside them`;
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
      fail(`${at(r)} ${r.pair_id}: failed_gates is ${describe(r.failed_gates)}, not the single published measurement-instant gate`);
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

check('every digest this dataset publishes is a well-formed sha-256', () => {
  let seen = 0;
  const hex = (where, digest) => {
    seen += 1;
    if (typeof digest !== 'string' || !HEX_64.test(digest)) {
      fail(`${where}: the digest is ${describe(digest)}, not 64 lowercase hexadecimal characters`);
    }
  };

  for (const m of metadata) {
    hex(`${m.market_key} rules_digest`, m.rules_digest);
    if (!Array.isArray(m.rules_digests_observed)) {
      fail(`${m.market_key}: rules_digests_observed is not an array`);
      continue;
    }
    m.rules_digests_observed.forEach((digest, i) => hex(`${m.market_key} rules_digests_observed[${i}]`, digest));
  }
  for (const r of all) {
    for (const [side, leg] of legs(r)) {
      hex(`${r.pair_id} ${side} settlement_functional.rules_digest`, leg.settlement_functional.rules_digest);
    }
  }
  for (const [i, c] of ruleChanges.entries()) {
    hex(`${changeLabel(c, i)} previous_digest`, c.previous_digest);
    hex(`${changeLabel(c, i)} current_digest`, c.current_digest);
  }
  return `${seen} digest fields across all four files, every one 64 lowercase hexadecimal characters`;
});

/**
 * String equality between two published copies of a digest proves only that the two copies agree.
 * Recomputing the hash from the venue's own republished words is what binds a digest to a document
 * a reader can actually read, and it is the one thing that makes swapping two markets' digests
 * detectable from `data/` alone.
 */
check('every rule digest is the sha-256 of the rule text published beside it', () => {
  const rederived = new Map();
  for (const m of metadata) {
    const derived = ruleDigest([m.rules_text, m.rules_secondary]);
    if (derived === null) {
      fail(`${m.market_key} publishes no rule text to hash, so its digest binds to nothing`);
      continue;
    }
    if (derived !== m.rules_digest) {
      fail(`${m.market_key}: rules_digest ${short(m.rules_digest)} is not the digest of its own published text, which hashes to ${short(derived)}`);
      continue;
    }
    rederived.set(m.market_key, derived);
  }

  for (const r of all) {
    for (const [side, leg] of legs(r)) {
      const key = `${side}:${leg.venue_market_id}`;
      const meta = metaByKey.get(key);
      if (meta === undefined) continue;
      if (leg.settlement_functional.rules_digest !== meta.rules_digest) {
        fail(`${r.pair_id} ${side}: the leg was matched under ${short(leg.settlement_functional.rules_digest)} but ${key} publishes ${short(meta.rules_digest)}`);
        continue;
      }
      if (rederived.get(key) !== leg.settlement_functional.rules_digest) {
        fail(`${r.pair_id} ${side}: the digest this leg was matched under does not hash the rule text published for ${key}`);
      }
    }
  }

  const historical = metadata.reduce(
    (n, m) => n + (Array.isArray(m.rules_digests_observed) ? m.rules_digests_observed.filter((d) => d !== m.rules_digest).length : 0),
    0,
  );
  return `${rederived.size} of ${metadata.length} rule texts hash to the digest published with them, and every leg joins a digest re-derived here; the ${historical} superseded digest(s) in rules_digests_observed are NOT re-derivable, because the dataset publishes only the current text of each rule`;
});

check('every rule-change record carries the full published rule-change schema', () => {
  const str = (v) => typeof v === 'string';
  const filled = (v) => str(v) && v.trim() !== '';
  const instant = (v) => str(v) && ISO_INSTANT.test(v) && Number.isFinite(Date.parse(v));
  const wellFormedOp = (op) => {
    if (op === null || typeof op !== 'object' || Array.isArray(op)) return false;
    const keys = Object.keys(op).sort().join(',');
    if (op.op === 'insert') return keys === 'after,op' && str(op.after);
    if (op.op === 'delete') return keys === 'before,op' && str(op.before);
    if (op.op === 'replace') return keys === 'after,before,op' && str(op.before) && str(op.after);
    return false;
  };

  for (const [i, c] of ruleChanges.entries()) {
    const where = changeLabel(c, i);
    if (c === null || typeof c !== 'object' || Array.isArray(c)) {
      fail(`rule-changes line ${i + 1} is not a JSON object`);
      continue;
    }
    if (c.schema !== RULE_CHANGE_SCHEMA) fail(`${where}: schema is ${describe(c.schema)}, not ${RULE_CHANGE_SCHEMA}`);
    if (!VENUES.includes(c.venue)) fail(`${where}: venue is ${describe(c.venue)}, outside the published venue set`);
    for (const field of ['venue_market_id', 'ticker', 'title']) {
      if (!filled(c[field])) fail(`${where}: ${field} is ${describe(c[field])}, not a non-empty string`);
    }
    for (const field of ['previous_digest', 'current_digest']) {
      if (!str(c[field])) fail(`${where}: ${field} is ${describe(c[field])}, not a string`);
    }
    for (const field of ['observed_from', 'observed_to']) {
      if (!instant(c[field])) fail(`${where}: ${field} is ${describe(c[field])}, not an ISO-8601 instant`);
    }
    if (typeof c.observed_window_ms !== 'number' || !Number.isFinite(c.observed_window_ms)) {
      fail(`${where}: observed_window_ms is ${describe(c.observed_window_ms)}, not a number`);
    }
    if (!Object.prototype.hasOwnProperty.call(CLASSIFICATION_FIELD, c.classification)) {
      fail(`${where}: classification is ${describe(c.classification)}, outside the published vocabulary`);
    }
    if (!Array.isArray(c.fields_changed) || c.fields_changed.some((f) => !filled(f))) {
      fail(`${where}: fields_changed is ${describe(c.fields_changed)}, not an array of non-empty strings`);
    }
    if (!Array.isArray(c.diff)) fail(`${where}: diff is ${describe(c.diff)}, not an array`);
    else {
      c.diff.forEach((op, index) => {
        if (!wellFormedOp(op)) fail(`${where}: diff[${index}] is ${describe(op)} and is not an insert, delete or replace operation`);
      });
    }
    for (const field of ['diff_truncated', 'material']) {
      if (typeof c[field] !== 'boolean') fail(`${where}: ${field} is ${describe(c[field])}, not a boolean`);
    }
    if (c.notes !== null && !str(c.notes)) fail(`${where}: notes is ${describe(c.notes)}, neither a string nor null`);
  }
  return `${ruleChanges.length} rule-change record(s), every field present and of the published type`;
});

/**
 * The crawl runs on a fixed cadence, so a change record names the WINDOW an edit happened inside.
 * A window that ends before it starts, or whose stated length is not the distance between the two
 * instants it names, describes an observation that could not have been made.
 */
check('every rule-change window runs forward and measures itself', () => {
  let measured = 0;
  for (const [i, c] of ruleChanges.entries()) {
    const where = changeLabel(c, i);
    const from = Date.parse(c.observed_from);
    const to = Date.parse(c.observed_to);
    if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
    if (to <= from) {
      fail(`${where}: the window closes at ${c.observed_to}, at or before it opens at ${c.observed_from}`);
      continue;
    }
    if (c.observed_window_ms !== to - from) {
      fail(`${where}: observed_window_ms is ${describe(c.observed_window_ms)}, not the ${to - from} ms between the instants it names`);
      continue;
    }
    measured += 1;
  }
  return `${measured} of ${ruleChanges.length} window(s) open before they close and state their own length exactly`;
});

check("each market's rule changes are logged in chronological, non-overlapping order", () => {
  const byMarket = new Map();
  for (const [i, c] of ruleChanges.entries()) {
    const key = `${c.venue}:${c.venue_market_id}`;
    if (!byMarket.has(key)) byMarket.set(key, []);
    byMarket.get(key).push({ change: c, index: i });
  }

  for (const [key, entries] of byMarket) {
    for (let i = 1; i < entries.length; i += 1) {
      const previous = entries[i - 1].change;
      const current = entries[i].change;
      const previousFrom = Date.parse(previous.observed_from);
      const previousTo = Date.parse(previous.observed_to);
      const currentFrom = Date.parse(current.observed_from);
      if (![previousFrom, previousTo, currentFrom].every((ms) => Number.isFinite(ms))) continue;
      if (currentFrom < previousFrom) {
        fail(`${key}: the log steps backwards, from a window opening at ${previous.observed_from} to one opening at ${current.observed_from}`);
      } else if (currentFrom < previousTo) {
        fail(`${key}: the window opening at ${current.observed_from} overlaps the one still open until ${previous.observed_to}, so the two changes cannot both have been observed as logged`);
      }
    }
  }
  return `${byMarket.size} market(s) carry a logged change, each one's windows in order and none overlapping`;
});

check('every logged rule change moves the digest it claims to move', () => {
  for (const [i, c] of ruleChanges.entries()) {
    if (c.previous_digest === c.current_digest) {
      fail(`${changeLabel(c, i)}: previous_digest and current_digest are both ${short(c.current_digest)}, so the record logs a change that changed nothing`);
    }
  }
  return `${ruleChanges.length} change(s), every one a genuine digest transition`;
});

/**
 * `material` is not an opinion: the producer derives it from the classification, and `cosmetic` is
 * the only class that is not material. The rest of this check binds the label to the evidence
 * published beside it, so a record cannot claim a threshold moved while showing a diff in which no
 * number did.
 */
check("every rule change's diff, fields and materiality agree with its classification", () => {
  for (const [i, c] of ruleChanges.entries()) {
    const where = changeLabel(c, i);
    if (!Object.prototype.hasOwnProperty.call(CLASSIFICATION_FIELD, c.classification)) continue;
    if (!Array.isArray(c.fields_changed) || !Array.isArray(c.diff)) continue;
    if (typeof c.material !== 'boolean' || typeof c.diff_truncated !== 'boolean') continue;

    const named = CLASSIFICATION_FIELD[c.classification];
    const cosmetic = named === null;

    if (c.material === cosmetic) {
      fail(`${where}: classification ${c.classification} is ${cosmetic ? 'not material' : 'material'} by definition, but the record says material is ${c.material}`);
    }
    if (cosmetic && c.fields_changed.length > 0) {
      fail(`${where}: a cosmetic change moved no tracked term, yet fields_changed is ${describe(c.fields_changed)}`);
    }
    if (!cosmetic) {
      if (c.fields_changed.length === 0) fail(`${where}: classification ${c.classification} claims a change but names no changed field`);
      else if (!c.fields_changed.includes(named)) {
        fail(`${where}: classification ${c.classification} is named after ${named}, which its own fields_changed does not list`);
      }
    }
    if (c.diff.length === 0 && c.diff_truncated === false) {
      const unsupported = c.fields_changed.filter((f) => TEXT_ONLY_FIELDS.includes(f));
      if (unsupported.length > 0) {
        fail(`${where}: the diff is empty and untruncated, so no sentence moved, yet the record reports ${unsupported.join(', ')}`);
      }
      if (TEXT_ONLY_FIELDS.includes(named)) {
        fail(`${where}: the diff is empty and untruncated, so no sentence moved, yet the record is classified ${c.classification}`);
      }
    }
  }
  return `${ruleChanges.length} change(s), each label carried by the diff and fields published with it`;
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
  return `${ruleChanges.length} change(s) in the published log, ${logged} of them on the ${moved} published market(s) whose rule moved`;
});

/**
 * A rule-change row for a market this dataset does not otherwise publish binds to no rule text a
 * reader can open, and no other check ever looks at it, so a fabricated row could ride along unread.
 * Every published change must name a market that appears in market-metadata.
 */
check('every rule-change row names a market this dataset publishes', () => {
  for (const [i, c] of ruleChanges.entries()) {
    const key = `${c.venue}:${c.venue_market_id}`;
    if (!metaByKey.has(key)) {
      fail(`${changeLabel(c, i)}: names ${key}, which this dataset does not publish in market-metadata`);
    }
  }
  return `${ruleChanges.length} logged change(s), every one on a market published in market-metadata`;
});

/**
 * The human-readable log is republished prose; nothing checked that it still says what the rows say.
 * Rebuild it from the machine-readable rows and metadata and compare byte for byte, so a reader and a
 * machine cannot be told two different stories from the same download.
 */
check('the rule-change log markdown states the machine-readable change rows', () => {
  const md = readFileSync(join(dataDir, 'rule-changes.md'), 'utf8');
  const marketsWithHistory = metadata.filter((m) => Number(m.capture_count) > 1).length;
  let expected;
  try {
    expected = renderRuleChangeLog(ruleChanges, marketsWithHistory);
  } catch {
    return 'the rows are not well-formed enough to render; the rule-change schema check owns that';
  }
  if (md !== expected) {
    const seen = md.split('\n');
    const want = expected.split('\n');
    const width = Math.max(seen.length, want.length);
    let at = -1;
    for (let i = 0; i < width; i += 1) {
      if (seen[i] !== want[i]) {
        at = i;
        break;
      }
    }
    fail(`rule-changes.md does not match rule-changes.jsonl and market-metadata; first divergence at line ${at + 1}`);
  }
  return `${ruleChanges.length} rendered change section(s) rebuilt from the rows and matched to the published markdown`;
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

/**
 * The published `data/` directory is a manifest, not a folder. The rollup job replaced named files
 * and this script read named files, so anything else that ever landed here - a superseded dataset, a
 * stray note - would sit in the published repository indefinitely with nothing ever opening it.
 */
const DERIVED_DATA_FILES = [
  'basis-pairs.csv',
  'basis-pairs.jsonl',
  'current-snapshot.md',
  'market-metadata.jsonl',
  'related-pairs.jsonl',
  'rule-changes.jsonl',
  'rule-changes.md',
  'series-status.json',
];
/** Hand-authored, so its absence from a bare derivation is not a defect; its presence is expected in the repository. */
const PUBLISHED_DATA_FILES = [...DERIVED_DATA_FILES, 'LICENSE'];

check('the data directory holds exactly the files this dataset publishes', () => {
  const present = readdirSync(dataDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  for (const name of DERIVED_DATA_FILES) {
    if (!present.includes(name)) fail(`the manifest names ${name}, which is not published here`);
  }
  for (const name of present) {
    if (!PUBLISHED_DATA_FILES.includes(name)) fail(`${name} is published here but is in no manifest, so nothing checks it`);
  }
  return `${present.length} files, exactly the published manifest`;
});

/**
 * The landing page used to describe the seed release while the files underneath it had rolled
 * forward: 72 basis pairs and 272 markets in the prose against 108 and 180 in the data. The counts
 * that move now live in a generated block that is part of the dataset and is re-read here, so a
 * README that misdescribes its own download fails the publish gate rather than the reader.
 */
check('the current-snapshot block states the book it is published with', () => {
  const text = readFileSync(join(dataDir, 'current-snapshot.md'), 'utf8');
  const row = (label) => {
    const hit = new RegExp(`^\\|\\s*${label.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\|\\s*(.*?)\\s*\\|\\s*$`, 'm').exec(text);
    return hit === null ? null : hit[1];
  };
  const window = series.analysis_window;
  const expected = {
    'run id': series.run_id,
    'capture window': `${window.start} to ${window.end}, ${window.utc_days} UTC day(s)`,
    'window hours': String(window.hours),
    'basis pairs': String(basis.length),
    'related pairs': String(related.length),
    'markets with published rules': String(metadata.length),
    'rule changes logged': String(ruleChanges.length),
    'book snapshots': String(series.book_snapshots),
    'cross-venue price series': series.divergence_series.cross_venue_price_series_available ? 'available' : 'not available yet',
  };
  for (const [label, value] of Object.entries(expected)) {
    const stated = row(label);
    if (stated === null) fail(`the block states no "${label}" row`);
    else if (stated !== value) fail(`the block says ${label} is ${JSON.stringify(stated)}; the data says ${JSON.stringify(value)}`);
  }
  return `${Object.keys(expected).length} published headline values re-derived from the data they describe`;
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
      if (col(row, name) !== expected) fail(`${at(r)} ${id}: CSV ${name} is ${describe(col(row, name))} and disagrees with the JSONL record, which holds ${describe(expected)}`);
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
