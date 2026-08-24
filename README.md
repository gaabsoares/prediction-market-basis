# Cross-venue prediction-market basis dataset

A matched book of Polymarket and Kalshi hourly crypto contracts, published with the evidence that
labels each pair, the resolution-rule change log the pairs are read against, and an honest statement
of how deep the price series behind them actually is.

The seed release ran as `97946cfda9a9` and emitted 72 basis pairs, 914 related pairs and 272 markets
with their verbatim resolution rules. Those counts are history: the dataset rolls forward daily, and
what you are downloading is described by the snapshot block below and by `data/series-status.json`.

<!-- BEGIN T3 CURRENT SNAPSHOT -->
## Current snapshot

Machine-written by the rollup that published these files, and re-checked by `scripts/verify.mjs`
against the data itself. The surrounding prose is the seed-release write-up and its counts are
historical: where the two disagree, this table describes the files you are downloading.

| field | value |
| --- | --- |
| run id | f7a99bbc21c5 |
| capture window | 2026-08-19T11:45:30.313Z to 2026-08-24T18:55:33.955Z, 6 UTC day(s) |
| window hours | 127.17 |
| basis pairs | 609 |
| related pairs | 31989 |
| markets with published rules | 4455 |
| rule changes logged | 0 |
| book snapshots | 690 |
| cross-venue price series | not available yet |
<!-- END T3 CURRENT SNAPSHOT -->

## The finding

**On this corpus there are zero cross-venue same-measurement-instant matches. Every
listed-close-aligned pair differs on three distinct bases at once.** That is the result, not a
failure to find one. The pairs are real, the alignment on entity, threshold and listed close is
exact, and they still are not the same bet.

The three bases, all present simultaneously on every emitted pair:

1. **Settlement index.** The Polymarket leg resolves off a single venue's order book (Binance). The
   Kalshi leg resolves off a multi-venue composite (CF Benchmarks' Real-Time Index, BRTI for
   Bitcoin and ERTI for Ethereum). Different observables of the same asset.
2. **Quote currency.** The Polymarket pairs are quoted in USDT, the Kalshi composite in USD. The peg
   is not a constant and it moves independently of the asset.
3. **Measurement window.** The Polymarket leg reads a single terminal print, the close of the 1-hour
   candle ending at the listed time. The Kalshi leg reads the **mean of the sixty seconds preceding
   that same listed time**. Different statistics over different windows, and the divergence is
   signed rather than mean-zero: in a trending or spiking final minute the mean sits systematically
   behind the terminal print.

A consumer pricing this book while seeing only the index difference would size for one basis while
holding three. **This is a book of basis trades, not arbitrage.** Every record carries all three
bases in its `caveats` array, plus a fourth naming the threshold relationship, so four caveats ride
with every pair.

The bases are not asserted from summary fields. Each is witnessed by a phrase in the venue's own
published rule text, which is republished here in `data/market-metadata.jsonl`, and
`scripts/verify.mjs` re-derives the labels on every published leg against that text, from `data/`
alone, on whatever book is current.

Rule text is the venues' published factual content, carried verbatim because the audit trail
depends on it; no copyright is claimed over it (see `data/LICENSE`). If a venue objects to
verbatim republication, the fallback is committed here in advance: the affected `rules_text`
fields would be replaced by their existing `rules_digest` plus the minimal excerpts the witness
checks require, and the verifier's text-derivation checks would be rescoped to those excerpts.
The dataset's claims survive that fallback; only the convenience of full-text auditing is lost.

## Posture

- **This is a research dataset, not a trading tool.** There is no order code, no signing, no wallet,
  no account and no execution path in this repository or in the pipeline that produced it. Every
  endpoint touched is a public unauthenticated read.
- **The dataset says nothing about arbitrage.** A price gap between two legs of a basis pair is
  divergence plus basis, and the two are not separable while the settlement functionals differ. Any
  number quoted from these records has to travel with its caveats.
- **Polymarket and Kalshi are geoblocked in Brazil, and this project does not evade geoblocks.**
  CMN Resolution 5,298 (April 2026) classified non-economic prediction contracts as illegal
  gambling, and Anatel ordered ISP blocks covering both venues. The block is implemented as DNS
  refusal at the ISP resolver. All acquisition therefore runs on US-based GitHub Actions runners
  reading public APIs, which is where a US-facing dataset should be read from anyway. No alternate
  resolver, no VPN, no proxy, no accounts. The block is trivially defeatable and defeating it stays
  out of scope regardless.

## How deep this actually is

Stated up front, because the three artifacts here are at very different maturities.

| artifact | state |
| --- | --- |
| basis-pair book | mature. Every label witnessed, three independent adjudication rounds against it. Its size is the `basis pairs` row of the snapshot block |
| resolution-rule change log | mature in method. How much it holds is the `rule changes logged` row of the snapshot block, and which markets moved is `rules_digests_observed` in the metadata |
| divergence series | **the youngest artifact here, and shallow.** Its depth is `book_snapshots` over `analysis_window.hours` in `data/series-status.json`, and while `basis_pairs_with_books_on_both_venues` is zero there is no cross-venue price series at all |

The divergence series accrues with every capture cycle and is the artifact that gets better with
time. Book selection is currently liquidity-ranked per venue, which is not a match and should not be
read as one: until `basis_pairs_with_books_on_both_venues` in `data/series-status.json` is above
zero, the raw snapshot count says nothing about cross-venue divergence.

The rest of what this dataset cannot say:

- **The strike-tolerance boundary is unexercised.** At equal listed closes the corpus holds pairs one
  cent apart and then nothing until well past the tolerance, so no evidence exists about how a
  genuine mid-tolerance gap would be classified.
- **Relation shape is only ever exercised as above-against-above.** Every scored pair is a threshold
  market on both legs; the touch-versus-terminal and range-versus-threshold paths are covered by
  the source pipeline's tests and not by this data.
- **The one-tick threshold gap resolves the emitted pairs oppositely inside a narrow band.** Both
  legs are strictly-above, one quotation tick apart, so any settled value in the half-open interval
  between the two thresholds, upper endpoint included, splits them. Each record names its own
  interval. The band is narrower than the settled value's own precision only if that value lands on
  the quotation grid, which a mean of sixty prints need not do.
- **Nothing about rule-churn frequency.** Every count in the change log is a lower bound: a
  six-hourly crawl cannot see a rule that changes and reverts inside one window.
- **No false-match rate is claimed,** because the published book claims no matches. See the audit
  section.

## Methodology

### Capture

Scheduled every six hours on GitHub-hosted US runners, tool version 0.1.0. Market records are
appended **only when a market's content digest changes**, which makes the committed history a change
log rather than a daily full dump and makes "the resolution rule changed on this date" a query
rather than a diff of two large snapshots. Book snapshots are bounded at 10 levels a side with
`depth_truncated` flagged, so a capped book is never misread as a thin one. The exact cycles behind
this release, the endpoints, and the runner are in `data/series-status.json`; the cycles include
manual reruns and so are not evenly spaced.

### The standard this dataset publishes against

Quoted verbatim from the source analysis:

> A match class asserts the two contracts are the SAME BET: same underlying, **cent-bridged
> thresholds** (which where both bounds are exclusive means one quotation tick apart, not
> identical), **same measurement instant**, and every residual difference disclosed. A pair that
> can resolve differently for a reason the artifact does not disclose is a false match, not a near
> miss. Under that standard a differing settlement FUNCTIONAL cannot sit inside a match class,
> because it is an undisclosed timing exposure rather than a disclosed basis.
>
> The threshold wording is deliberately not "same threshold". Bridging an exclusive floor to an
> inclusive one is a NOTATION correction, and it leaves a genuine one-tick gap that the per-match
> caveat states outright.

Class membership is decided by hard gates, not by the score. The score only orders pairs.

| class | requires |
| --- | --- |
| identical | same entity, same relation, strike equal to the cent, same bound strictness, close times within 60s, and BOTH settlement indices known and equal |
| near-equivalent | same entity and relation, strikes within 0.1% of each other, close times within 60s, AND the same settlement functional. A differing settlement INDEX is what puts a pair here rather than in identical |
| basis-pair | everything near-equivalent demands EXCEPT that the two legs read the same statistic over the same window. Not the same bet, but a measurable basis, which is the product this dataset is for |
| related | same entity, close times within 24h, different question shape. Context only, excluded from the headline |
| rejected | anything else |

Two constraints are hard equalities rather than similarity scores, both because an independent
adjudication found the smooth version failing:

- **The measurement instant.** For a market that reads a price at a stated hour, the instant is the
  claim: BTC at 9am and BTC at 10am are different random variables, and one hour of variation is
  comparable to the whole strike spacing. Scored smoothly on a 24-hour scale, a full one-hour miss
  cost under one percent of score, and 72 of 144 emitted matches were wrong-hour twins.
- **One counterpart per market.** Two contracts on the same venue are separately tradeable and can
  resolve differently, so at most one can be the same bet as a given market on the other venue. A
  pair is emitted only as the unique best from both sides, and ties emit neither.

The measurement instant is deliberately not the listed close. `listed-close` compares the timestamps
the venues publish; `measurement-instant` compares what is actually observed at that timestamp,
which statistic over which window. A pair can agree perfectly on the first and disagree completely
on the second, which is exactly how a whole book once passed while one leg read a terminal print and
the other a sixty-second mean.

### The evidence-witness invariant

Every derived label a record carries must be supported by a token or phrase in the evidence stored
beside it, and the emit path fails closed: a record whose label cannot be witnessed raises an
internal defect and is never written. Five things are checked per leg: the settlement index (against
`settlement_evidence`, with `settlement_index_witness` naming the exact deciding token), the
operative clause that token was read out of (`settlement_index_clause`, the venue's own words
verbatim), the functional kind (against the phrase read from the rules, which has to state the window
length and the position preposition itself), the quote currency (against a trading pair in the rules
or the named index), and the strike unit (against the unit basis recorded in the strike
evidence). `unknown` never needs a witness, because it claims nothing.

The clause is what makes the POLARITY checkable. A token proves a source was named, never that it was
endorsed: "the proprietary exchange feed, not Binance, determines the result" yields the same
`text:binance` as a rule that settles off Binance, and the old token-only witness read that rejection
as an endorsement. Re-running the non-endorsing strip over the stored clause answers it from the
record alone, which is why the clause is published beside the token rather than left in the corpus.

This exists because all three defects independent adjudication found reduce to the same shape: a
label asserted more confidently than its own evidence supported. Each was found by a human reading
the corpus, and each is mechanically detectable from the record alone. Because the witness token is
written into every record, that check does not need the source pipeline, and it is what
`scripts/verify.mjs` repeats here from `data/` by itself.

### The false-match audit protocol

Three independent adversarial adjudication rounds, each in a fresh session with no part in
construction or in the previous rounds, adjudicating against the published standard. The full
documents and machine-readable verdicts are in `audits/`. The protocol has three standing rules:

- **A census supersedes a sample drawn from the same book.** Round 2's sample verdicts were
  overturned by its own census of all 72 emitted pairs, and the census result stands.
- **An audit restricted to an artifact's summary fields cannot see a defect those fields omit.**
  Round 2's decisive evidence was in the captured rule text the whole time; the match records had
  reduced it to index tokens and discarded the functional. Round 3 was therefore required to
  re-derive every settlement field from source rule text rather than from the artifact.
- **Rates are published only with Wilson score intervals,** and never as "zero observed" standing in
  for "low". Zero false matches out of ten still leaves a 95% Wilson upper bound of 27.8%.

What each round found and what happened to it:

| round | scope | finding | disposition |
| --- | --- | --- | --- |
| 1 | 34-row stratified sample | 72 of 144 emitted matches were wrong-hour twins; a smooth 24-hour close-time score charged under 1% for a full hour of error | fixed: listed-close agreement became a hard equality, and one counterpart per market became a gate |
| 2 | 42-row sample, then a census of all 72 emitted pairs | mechanically flawless (14 invariants, 576 cross-field checks, mutual-nearest 72 of 72, 100% recall) and still 72 of 72 FALSE_MATCH, census rate 1.000, Wilson 95% CI [0.949, 1.000]: the settlement functional differed and was not carried into the records | fixed by reclassification, not by filtering: the book stopped claiming matches, the basis-pair class was introduced, and the functional now rides on every record |
| 3 | 54-row sample plus a census of all 72 Kalshi legs against source rule text | structural claims hold, but the index caveat named BRTI on every Ethereum row (census 32 of 72, 44.4%, exhaustive), and the published sampling frame's `above-0.747` population was not reproducible | both fixed, then independently re-verified in the round-3 verification addendum and final confirmation |

**The verdicts in `audits/` are historical.** Every round adjudicated the book as it stood at that
moment, each finding was fixed, and each fix was independently re-verified before the cycle closed.
The data published here is the post-fix book. The round-3 final confirmation re-ran eleven checks
over the seed release and reported the witness mapping as a clean bijection across all 986 records it
then held, which `scripts/verify.mjs` reproduces here, on whatever book is current, without access to
the pipeline.

**No false-match rate is claimed for the published book,** and that is not the same as claiming
zero. The current book asserts no matches, so "false match" has no denominator in it; what a reader
can check instead is whether every label is witnessed, which is what the verifier does. The source
pipeline's automated rate field reads "unmeasured" because the adjudication verdicts were produced
as documents rather than fed back into the generator as input.

## Verify it

```
node scripts/verify.mjs
```

Node 22, no dependencies, no network, no access to the pipeline that produced the data. Twenty-nine
checks over `data/` alone:

- every record parses, carries its schema tag, sits in the class its file claims, and names one
  shared run id
- the witness bijection: every settlement label is supported by a token in its own evidence, the
  witness-to-index mapping is one-to-one, and every witness token and functional phrase appears
  verbatim in that leg's published rule text
- every settlement index is witnessed by an operative clause that ENDORSES it rather than rejecting
  it, and that clause is quotable verbatim back out of the venue's own rule text
- every unit label is one its own recorded basis can establish: a comma-grouped magnitude says the
  number is at least a thousand, not that it is dollars
- every functional label is re-read from the phrase stored beside it, including the window length and
  the position preposition, so "before", "after" and "centered on" cannot share one record
- `close_delta_ms` is exactly zero and both legs agree on `close_ms`, on every basis pair
- the cent bridge is exact: the Kalshi floor plus one cent is the Polymarket floor, compared as
  integers so no float touches a strike
- degree 1: no market appears in two basis pairs, so the book is a perfect matching
- the basis-pair class means what it says: every pair fails the measurement-instant gate and no
  other, and the two legs never read the same statistic
- four caveats on every record in the published order, each naming the labels it describes
- the knife-edge caveat fires on exactly the one-tick records and nowhere else
- no `identical` or `near-equivalent` record exists anywhere, which is the headline finding
- market metadata covers every published leg, all with rule text, each naming a current digest that
  is among the ones it records having observed
- every digest this dataset publishes, in any of the four files, is 64 lowercase hexadecimal
  characters
- every rule digest is re-derived by hashing the rule text published beside it, so swapping two
  markets' digests is detectable from `data/` alone. The superseded digests in
  `rules_digests_observed` are NOT re-derivable, because only the current text of each rule is
  published, and the check says so rather than passing quietly
- every rule-change record carries the full published change schema, field by field and type by type,
  down to the shape of each diff operation
- every change window runs forward, and its stated length is exactly the distance between the two
  instants it names
- each market's changes are logged in chronological, non-overlapping order, so two changes cannot
  claim to have been observed inside each other
- every logged change is a genuine digest transition rather than a record of nothing moving
- every change's diff, `fields_changed` and `material` flag agree with its own classification: a
  record cannot claim a threshold moved while showing a diff in which nothing did
- the rule-change log and the metadata tell the same story market by market: an unbroken walk through
  the digests the metadata observed, ending on the digest the market carries now. This is a
  consistency check and deliberately not a stability check, because a moved rule is the event this
  dataset exists to catch
- `series-status.json` counts sum to the book and its availability flag matches its own counts
- `data/` holds exactly the published manifest, so nothing can sit in the published tree with nothing
  ever opening it, and a superseded file left beside its replacement is named and refused
- the current-snapshot block's headline values are re-read out of the block and re-derived from the
  data they describe, so a landing page that misdescribes its own download fails the gate
- the CSV render agrees with the JSONL book row for row on every shared field

The verifier is checked against mutation: reintroducing the round-3 index defect, breaking the cent
bridge, duplicating a market across two pairs, moving a close time, dropping a caveat and
reclassifying a pair as a match each fail at least one check, by name.

Full regeneration from raw capture is not in this repository. Regeneration lives in the source
pipeline, which holds the crawler, the matcher and the 115MB scored-candidate set; what is published
here is the emitted book plus everything needed to audit it from the outside.

## What is in here

```
data/            the dataset (CC BY 4.0)
  current-snapshot.md    what this release actually holds, machine-written on every rollup
  related-pairs.jsonl.gz gzipped: the related book is past GitHub's 100MB file limit
audits/          three independent adjudication rounds, verbatim
scripts/         verify.mjs, the self-audit (MIT)
charts/          strike-ladder.svg
```

### `data/basis-pairs.jsonl` (`t3.match.v1`)

The emitted book, one JSON object per line, verbatim from the analysis run. Its line count is the
`basis pairs` row of `data/current-snapshot.md`. Top-level fields:

| field | meaning |
| --- | --- |
| `pair_id` | `polymarket:<id>\|kalshi:<ticker>`, unique per pair |
| `schema` | `t3.match.v1` |
| `run_id` | the analysis run that emitted the record; identical across the whole book |
| `equivalence_class` | `basis-pair` in this file |
| `entity`, `entity_label` | normalized underlying (`crypto:btc`) and its display form |
| `polymarket`, `kalshi` | the two legs, described below |
| `close_delta_ms` | difference between the legs' listed close timestamps; 0 on every basis pair |
| `strike_distance` | relative strike distance as scored |
| `strike_exact` | whether the strikes are equal to the cent before bridging |
| `relation_equal` | whether both legs express the same relation (above, below, between) |
| `settlement_agreement` | `same`, `different` or `unknown` for the settlement index |
| `functional_agreement` | the same, for the settlement functional. `different` on every basis pair |
| `failed_gates` | which hard gates the pair failed. `["measurement-instant"]` on every basis pair |
| `score_total`, `score_components` | the ordering score and its decomposition (close_time, relation, settlement, strike, title). The score orders pairs; it does not decide class |
| `title_jaccard`, `shared_tokens` | title overlap and the tokens behind it |
| `caveats` | four strings, in order: index basis, quote-currency basis, measurement-window basis, threshold relationship |

Each leg (`polymarket`, `kalshi`) carries:

| field | meaning |
| --- | --- |
| `venue_market_id`, `ticker` | the venue's own identifiers; `venue_market_id` joins to `data/market-metadata.jsonl` |
| `title`, `subtitle` | the venue's own question text |
| `close_ms` | listed close, epoch milliseconds |
| `resolver` | the adjudication mechanism (`uma-optimistic-oracle`, `exchange-operator`). Not the data feed, and deliberately not gated on: it differs across these venues by construction |
| `settlement_index` | the data feed the outcome is read off (`binance`, `cf-benchmarks-brti`, `cf-benchmarks-erti`) |
| `settlement_evidence` | every evidence token found, as `text:<token>` or `url:<host>` |
| `settlement_index_witness` | the exact token that decided `settlement_index`. Always a member of `settlement_evidence` |
| `settlement_index_clause` | the verbatim clause of the venue's text the witness was read out of, which is what carries the polarity a bare token does not |
| `settlement_basis` | which field decided it (`primary-rules`, `settlement-url`, `secondary-rules`, ambiguous variants) |
| `settlement_functional` | how the outcome is measured: `kind` (`point-close`, `window-mean`), `window_ms`, `window_position` (`ends-at-close`, `precedes-close`), `quote_currency`, `quote_witness`, `rules_digest`, and `evidence`, the verbatim phrase from the rule text |
| `strike` | `floor`, `cap`, `relation`, `bound` (`exclusive` or `inclusive`), `unit`, `confidence` (`parsed` or `structural`), and `evidence`, the text the strike was read from including the bridging note |

### `data/basis-pairs.csv` (37 columns)

A flat render of the same records for spreadsheet and dataframe use, one row per basis pair, sorted
by entity, then close, then strike. Columns are the JSONL fields with the leg prefixed: `pair_id`,
`entity`, `entity_label`, `polymarket_market_id`, `polymarket_ticker`, `polymarket_title`,
`kalshi_ticker`, `kalshi_title`, `kalshi_subtitle`, `polymarket_strike_floor`,
`polymarket_strike_bound`, `polymarket_relation`, `kalshi_strike_floor`, `kalshi_strike_bound`,
`kalshi_relation`, `strike_gap` (Polymarket floor minus Kalshi floor, in quote units, 0.01 on every
row), `close_time_utc`, `close_ms`, `close_delta_ms`, `polymarket_settlement_index`,
`kalshi_settlement_index`, `polymarket_quote_currency`, `kalshi_quote_currency`,
`polymarket_functional_kind`, `polymarket_window_ms`, `polymarket_window_position`,
`kalshi_functional_kind`, `kalshi_window_ms`, `kalshi_window_position`, `polymarket_resolver`,
`kalshi_resolver`, `score_total`, `failed_gates`, `caveat_index_basis`,
`caveat_quote_currency_basis`, `caveat_measurement_window_basis`, `caveat_threshold`. The four
caveats are carried in full so a row cannot be quoted without them.

### `data/related-pairs.jsonl.gz` (`t3.match.v1`)

Gzip-compressed, because the related book is larger than GitHub's 100MB per-file limit. `zcat
data/related-pairs.jsonl.gz`, `gunzip -c`, or any gzip-aware reader gives the plain JSONL, and
`scripts/verify.mjs` decompresses it in place. Every other published file is plain text.

Same schema, `equivalence_class` of `related`: same entity, close times within 24 hours, different
question shape. **Context only, and excluded from the headline.** It is published because it is where
the gates show their work: the records sitting at exactly one hour of close delta are the
wrong-hour-twin family that round 1 caught being emitted as matches and that the hard instant gate
now demotes. A reader checking whether the gates do anything should read this file. Nothing here is
a match, and the records in it that carry knife-edge threshold wording are still not matches.

### `data/market-metadata.jsonl` (`t3.market-metadata.v1`)

One record per market appearing anywhere in the two pair files, which is what makes the pair records
auditable against source rather than against their own summary fields.

| field | meaning |
| --- | --- |
| `market_key` | `<venue>:<venue_market_id>`, the join key |
| `venue`, `venue_market_id`, `ticker` | venue identifiers |
| `title`, `subtitle`, `status` | the venue's own question text and market state at last capture |
| `close_ms`, `close_utc` | listed close |
| `resolver` | adjudication mechanism |
| `rules_digest` | digest of the rule text at last capture; equals `settlement_functional.rules_digest` on the pair records |
| `rules_digests_observed` | every distinct rule digest seen across this market's captures. Length above 1 is a market whose rule moved, and the change log accounts for every step of that walk |
| `rules_text` | the venue's operative resolution rule, verbatim |
| `rules_secondary` | the venue's explanatory text, verbatim. Kept because it routinely names sources it is telling you not to use, and reading it as an endorsement is a live failure mode |
| `source_urls` | resolution source URLs published by the venue |
| `first_seen`, `last_seen`, `capture_count` | capture history within this release's window |
| `in_basis_pairs`, `in_related_pairs` | which published file this market appears in |
| `rules_text_provenance` | a fixed provenance string, see licensing |

### `data/rule-changes.jsonl` and `data/rule-changes.md`

The resolution-rule change log. How much it holds is the `rule changes logged` row of
`data/current-snapshot.md`, and which published markets moved is `rules_digests_observed` in the
metadata; an empty log alongside single-digest metadata means no rule moved, not that nothing was
watched. The `.md` states the method and why every count is a lower bound. A detected change carries
the normalized text diff, a material-versus-cosmetic classification, and the capture window it
happened inside rather than an instant it happened at.

### `data/series-status.json` (`t3.series-status.v1`)

The divergence series' depth, stated honestly rather than implied by a snapshot count. Holds the
analysis window, the per-cycle market and book capture counts, the acquisition endpoints and runner,
the book depth stored per side, the distinct markets with a book per venue, and the divergence block:
how many basis pairs have books on both venues, one venue, or neither, plus
`cross_venue_price_series_available`, which is true only once that both-venues count is above zero.

### `data/current-snapshot.md`

The counts that move, machine-written by the rollup that published these files and spliced into this
README between two comment markers. It names the run, the capture window and its length, the size of
each published file, how many rule changes are logged, the book-snapshot count and whether a
cross-venue price series exists yet. It is published as a data file rather than left as a README edit
so it is part of the verified dataset: `scripts/verify.mjs` re-reads every row out of it and
re-derives the value from the data it describes. Where the prose here and that block disagree, the
block is what you downloaded.

### `audits/`

`round-1-adjudication.md`, `round-2-adjudication.md`, `round-3-adjudication.md` with their
`round-N-verdicts.jsonl`, plus `audit-sample.md` and `audit-sample.jsonl`, the pre-registered
sampling frame that reproduces the drawn rows from the run id's seed. See `audits/README.md` for
what was reproduced verbatim and the two disclosed edits.

### `charts/strike-ladder.svg`

Strike-ladder coverage of the emitted book: one panel per asset and listed close, one rung per
emitted pair with both legs' floors marked. The chart's own header states how many pairs it drew and
its footer how many closes and assets that was.

The dashed rungs are worth reading. A dashed rung is a strike the venues' own ladder spacing implies
but which this capture emitted no pair for, which is the difference between "the venues do not list
this" and "this tool did not pair it": a row count cannot tell those two apart. Where the same strike
does exist on the other venue at a different listed close, the hard measurement-instant gate refuses
to pair the two and demotes them to `related`, which is precisely the failure round 1 found being
emitted as matches, and the gate's effect is visible as a hole in the ladder.

How far away that counterpart sits is measured, per rung, from the related book, and never asserted.
Each dashed rung carries an SVG `<title>` naming its own nearest same-strike counterpart distance, or
saying there is no such counterpart anywhere in this capture, and the footer prints the distribution
of the distances actually observed. An earlier version of this page claimed the counterpart was
always one hour away. That was true of the four holes in the seed release and had never been derived
from anything; on the grown book the measured distances run to many hours.

It is deliberately the only chart here. Any chart of the divergence series would be drawing the
one-sided book snapshots `data/series-status.json` counts, and while no basis pair has a book on both
venues there is nothing honest to plot yet.

## Licensing

Dual-licensed, because the code and the data are different things.

- **`scripts/` is MIT.** See `LICENSE`.
- **`data/`, `audits/` and `charts/` are CC BY 4.0.** See `data/LICENSE`. Attribution: gaabsoares,
  cross-venue prediction-market basis dataset, citing the `run_id` in `data/series-status.json` for
  the release you used.

**One carve-out.** The `rules_text` and `rules_secondary` fields in `data/market-metadata.jsonl`, and
the `title`, `subtitle` and rule-derived `evidence` strings quoted inside the pair records, are
reproduced verbatim from Polymarket's and Kalshi's public market pages and APIs. That text is the
venues' own published content, not this project's, and no license over it is claimed or granted here.
It is republished because the dataset's central finding is a claim about what those rules say, and a
reader who cannot see the rule text cannot check the claim. The CC BY 4.0 grant covers the
compilation, the derived fields, the analysis and the audit documents.

## Provenance

Every record here is a pure function of a committed capture corpus: no clock, no network, no
hand-entered numbers at analysis time. Rerunning the analysis over an unchanged corpus produces
identical bytes, so any diff means the data moved. The published files are the emitted book verbatim
plus renders of it.

The daily rollup writes the derived files and nothing else, and the set it may write is an exact
manifest: a file staged under `data/` or `charts/` that is in neither the derived manifest nor the
hand-authored list stops the publish rather than being deleted, and the verifier re-checks that same
manifest from the published tree. The one part of this page the job touches is the snapshot block,
which it rewrites between the two markers and refuses to write at all if the splice would have moved
a byte of hand-authored prose.

The counts in this README that `scripts/verify.mjs` can reach from `data/` alone are re-derived on
every push. The ones it cannot, notably the size of the capture corpus behind the change log and the
retained-candidate set the matcher scored, come from parts of the corpus that are not published here
and are reported rather than reproduced.
