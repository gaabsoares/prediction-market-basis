# T3 basis-pair book: independent adjudication, round 3

Adjudicator identity: independent adjudicator, round 3 (same rig, fresh session, no part in
construction or prior rounds); not a domain-licensed reviewer.

Target: `audits/audit-sample.md` + `.jsonl`, 54 rows, run id
`97946cfda9a9`, seed `1153758879`. Adjudicated against the standard published in
`ANALYSIS.md`, not against any earlier version of the book and not against the question of
whether basis pairs are matches, which the artifact no longer claims.

Method: every row was re-derived from `analysis/matches.jsonl` and `analysis/scored-pairs.jsonl`,
and every basis-pair row was checked back to the venues' own `resolution.rules_text` in
`markets/kalshi/2026-08-19.jsonl` and `markets/polymarket/2026-08-19.jsonl`. Where a summary field
and the source rule text disagree, the rule text wins. The prior rounds' lesson, that an audit
restricted to an artifact's summary fields cannot see a defect those fields omit, was taken as
binding: the settlement fields were re-derived from source for all 72 emitted records, not only
for the 12 drawn.

## Headline

The artifact's central structural claims hold. There are zero same-measurement-instant matches on
this corpus, the 72 emitted records are genuine basis pairs on entity, cent-bridged threshold and
listed close, the measurement-window basis is real and correctly described, no basis pair was
missed, and every demotion and rejection in the sample is correct.

Two claims do not hold. **The index-basis caveat, one of the three the artifact says rides on
every emitted record, names the wrong index on every Ethereum row**: the Kalshi leg settles off
CF Benchmarks' Ethereum Real-Time Index (ERTI) and is published as `cf-benchmarks-brti`, the
Bitcoin index. This is a census result, not a sample estimate: 32 of 72 emitted basis pairs and
328 of 986 emitted records carry it. **And the published sampling frame's `above-0.747` population
is not reproducible**: the table says 132, the corpus says 144, and the six strata sum to 60 more
pairs than exist.

## Verdict table

`sd` is `strike_distance` as recorded. `bridge` means the Kalshi floor plus one cent equals the
Polymarket floor exactly. `rules idx` is the index named in the Kalshi leg's own rule text.

| # | pair | stratum | artifact class | ent | poly / kalshi strike | bridge | close delta ms | sd | rules idx | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `polymarket:3719542|kalshi:KXBTCD-26AUG1909-T66199.99` | class:basis-pair | basis-pair | Bit | 66200 / 66199.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 2 | `polymarket:3720397|kalshi:KXBTCD-26AUG1910-T65199.99` | class:basis-pair | basis-pair | Bit | 65200 / 65199.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 3 | `polymarket:3720401|kalshi:KXBTCD-26AUG1910-T64199.99` | class:basis-pair | basis-pair | Bit | 64200 / 64199.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 4 | `polymarket:3719554|kalshi:KXBTCD-26AUG1909-T63599.99` | class:basis-pair | basis-pair | Bit | 63600 / 63599.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 5 | `polymarket:3720405|kalshi:KXBTCD-26AUG1910-T63399.99` | class:basis-pair | basis-pair | Bit | 63400 / 63399.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 6 | `polymarket:3719557|kalshi:KXBTCD-26AUG1909-T62999.99` | class:basis-pair | basis-pair | Bit | 63000 / 62999.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 7 | `polymarket:3719558|kalshi:KXBTCD-26AUG1909-T62799.99` | class:basis-pair | basis-pair | Bit | 62800 / 62799.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 8 | `polymarket:3719562|kalshi:KXETHD-26AUG1909-T1979.99` | class:basis-pair | basis-pair | Eth | 1980 / 1979.99 | yes | 0 | 0.000005 | ERTI | **MISLABELED** |
| 9 | `polymarket:3719564|kalshi:KXETHD-26AUG1909-T1959.99` | class:basis-pair | basis-pair | Eth | 1960 / 1959.99 | yes | 0 | 0.000005 | ERTI | **MISLABELED** |
| 10 | `polymarket:3719570|kalshi:KXETHD-26AUG1909-T1889.99` | class:basis-pair | basis-pair | Eth | 1890 / 1889.99 | yes | 0 | 0.000005 | ERTI | **MISLABELED** |
| 11 | `polymarket:3719572|kalshi:KXETHD-26AUG1909-T1869.99` | class:basis-pair | basis-pair | Eth | 1870 / 1869.99 | yes | 0 | 0.000005 | ERTI | **MISLABELED** |
| 12 | `polymarket:3720422|kalshi:KXETHD-26AUG1910-T1869.99` | class:basis-pair | basis-pair | Eth | 1870 / 1869.99 | yes | 0 | 0.000005 | ERTI | **MISLABELED** |
| 13 | `polymarket:3719544|kalshi:KXBTCD-26AUG1909-T66099.99` | above-0.600 | related | Bit | 65800 / 66099.99 | no | 0 | 0.004538 | BRTI | CORRECTLY_LABELED |
| 14 | `polymarket:3720399|kalshi:KXBTCD-26AUG1909-T64299.99` | above-0.600 | related | Bit | 64600 / 64299.99 | no | 3600000 | 0.004644 | BRTI | CORRECTLY_LABELED |
| 15 | `polymarket:3720417|kalshi:KXETHD-26AUG1910-T1909.99` | above-0.600 | related | Eth | 1920 / 1909.99 | no | 0 | 0.005214 | ERTI | CORRECTLY_LABELED |
| 16 | `polymarket:3720397|kalshi:KXBTCD-26AUG1909-T64899.99` | above-0.600 | related | Bit | 65200 / 64899.99 | no | 3600000 | 0.004601 | BRTI | CORRECTLY_LABELED |
| 17 | `polymarket:3719562|kalshi:KXETHD-26AUG1910-T1969.99` | above-0.600 | related | Eth | 1980 / 1969.99 | no | 3600000 | 0.005056 | ERTI | CORRECTLY_LABELED |
| 18 | `polymarket:3720421|kalshi:KXETHD-26AUG1909-T1869.99` | above-0.600 | related | Eth | 1880 / 1869.99 | no | 3600000 | 0.005324 | ERTI | CORRECTLY_LABELED |
| 19 | `polymarket:3719573|kalshi:KXETHD-26AUG1910-T1849.99` | above-0.600 | related | Eth | 1860 / 1849.99 | no | 3600000 | 0.005382 | ERTI | CORRECTLY_LABELED |
| 20 | `polymarket:3720395|kalshi:KXBTCD-26AUG1910-T65199.99` | above-0.600 | related | Bit | 65600 / 65199.99 | no | 0 | 0.006098 | BRTI | CORRECTLY_LABELED |
| 21 | `polymarket:3720410|kalshi:KXETHD-26AUG1909-T1994.99` | above-0.649 | related | Eth | 2000 / 1994.99 | no | 3600000 | 0.002505 | ERTI | CORRECTLY_LABELED |
| 22 | `polymarket:3719554|kalshi:KXBTCD-26AUG1909-T63799.99` | above-0.649 | related | Bit | 63600 / 63799.99 | no | 0 | 0.003135 | BRTI | CORRECTLY_LABELED |
| 23 | `polymarket:3720404|kalshi:KXBTCD-26AUG1910-T63799.99` | above-0.649 | related | Bit | 63600 / 63799.99 | no | 0 | 0.003135 | BRTI | CORRECTLY_LABELED |
| 24 | `polymarket:3720406|kalshi:KXBTCD-26AUG1910-T63399.99` | above-0.649 | related | Bit | 63200 / 63399.99 | no | 0 | 0.003154 | BRTI | CORRECTLY_LABELED |
| 25 | `polymarket:3720391|kalshi:KXBTCD-26AUG1909-T66199.99` | above-0.649 | related | Bit | 66400 / 66199.99 | no | 3600000 | 0.003012 | BRTI | CORRECTLY_LABELED |
| 26 | `polymarket:3720407|kalshi:KXBTCD-26AUG1909-T63199.99` | above-0.649 | related | Bit | 63000 / 63199.99 | no | 3600000 | 0.003164 | BRTI | CORRECTLY_LABELED |
| 27 | `polymarket:3720408|kalshi:KXBTCD-26AUG1909-T62599.99` | above-0.649 | related | Bit | 62800 / 62599.99 | no | 3600000 | 0.003185 | BRTI | CORRECTLY_LABELED |
| 28 | `polymarket:3720405|kalshi:KXBTCD-26AUG1917-T63249.99` | above-0.649 | related | Bit | 63400 / 63249.99 | no | 25200000 | 0.002366 | BRTI | CORRECTLY_LABELED |
| 29 | `polymarket:3720402|kalshi:KXBTCD-26AUG1910-T64099.99` | above-0.698 | related | Bit | 64000 / 64099.99 | no | 0 | 0.001560 | BRTI | CORRECTLY_LABELED |
| 30 | `polymarket:3719558|kalshi:KXBTCD-26AUG1909-T62699.99` | above-0.698 | related | Bit | 62800 / 62699.99 | no | 0 | 0.001593 | BRTI | CORRECTLY_LABELED |
| 31 | `polymarket:3719545|kalshi:KXBTCD-26AUG1910-T65699.99` | above-0.698 | related | Bit | 65600 / 65699.99 | no | 3600000 | 0.001522 | BRTI | CORRECTLY_LABELED |
| 32 | `polymarket:3719547|kalshi:KXBTCD-26AUG1910-T65099.99` | above-0.698 | related | Bit | 65200 / 65099.99 | no | 3600000 | 0.001534 | BRTI | CORRECTLY_LABELED |
| 33 | `polymarket:3719558|kalshi:KXBTCD-26AUG1910-T62899.99` | above-0.698 | related | Bit | 62800 / 62899.99 | no | 3600000 | 0.001590 | BRTI | CORRECTLY_LABELED |
| 34 | `polymarket:3719548|kalshi:KXBTCD-26AUG1909-T64899.99` | above-0.698 | related | Bit | 65000 / 64899.99 | no | 0 | 0.001539 | BRTI | CORRECTLY_LABELED |
| 35 | `polymarket:3720420|kalshi:KXETHD-26AUG1910-T1884.99` | above-0.698 | related | Eth | 1890 / 1884.99 | no | 0 | 0.002651 | ERTI | CORRECTLY_LABELED |
| 36 | `polymarket:3719572|kalshi:KXETHD-26AUG1909-T1874.99` | above-0.698 | related | Eth | 1870 / 1874.99 | no | 0 | 0.002661 | ERTI | CORRECTLY_LABELED |
| 37 | `polymarket:3719540|kalshi:KXBTCD-26AUG1909-T66599.99` | above-0.747 | basis-pair | Bit | 66600 / 66599.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 38 | `polymarket:3719545|kalshi:KXBTCD-26AUG1909-T65599.99` | above-0.747 | basis-pair | Bit | 65600 / 65599.99 | yes | 0 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 39 | `polymarket:3720419|kalshi:KXETHD-26AUG1910-T1899.99` | above-0.747 | basis-pair | Eth | 1900 / 1899.99 | yes | 0 | 0.000005 | ERTI | **MISLABELED** |
| 40 | `polymarket:3719573|kalshi:KXETHD-26AUG1909-T1859.99` | above-0.747 | basis-pair | Eth | 1860 / 1859.99 | yes | 0 | 0.000005 | ERTI | **MISLABELED** |
| 41 | `polymarket:3719545|kalshi:KXBTCD-26AUG1910-T65599.99` | above-0.747 | related | Bit | 65600 / 65599.99 | yes | 3600000 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 42 | `polymarket:3719546|kalshi:KXBTCD-26AUG1910-T65399.99` | above-0.747 | related | Bit | 65400 / 65399.99 | yes | 3600000 | 0.000000 | BRTI | CORRECTLY_LABELED |
| 43 | `polymarket:3720412|kalshi:KXETHD-26AUG1909-T1979.99` | above-0.747 | related | Eth | 1980 / 1979.99 | yes | 3600000 | 0.000005 | ERTI | CORRECTLY_LABELED |
| 44 | `polymarket:3720424|kalshi:KXETHD-26AUG1909-T1849.99` | above-0.747 | related | Eth | 1850 / 1849.99 | yes | 3600000 | 0.000005 | ERTI | CORRECTLY_LABELED |
| 45 | `polymarket:3720424|kalshi:KXETHD-26AUG1910-T2379.99` | below-threshold | rejected | Eth | 1850 / 2379.99 | no | 0 | 0.222686 | ERTI | CORRECTLY_LABELED |
| 46 | `polymarket:3719550|kalshi:KXBTCD-26AUG1910-T60399.99` | below-threshold | rejected | Bit | 64400 / 60399.99 | no | 3600000 | 0.062112 | BRTI | CORRECTLY_LABELED |
| 47 | `polymarket:3719554|kalshi:KXBTCD-26AUG1909-T72499.99` | below-threshold | rejected | Bit | 63600 / 72499.99 | no | 0 | 0.122758 | BRTI | CORRECTLY_LABELED |
| 48 | `polymarket:3720403|kalshi:KXBTCD-26AUG1910-T72699.99` | below-threshold | rejected | Bit | 63800 / 72699.99 | no | 0 | 0.122421 | BRTI | CORRECTLY_LABELED |
| 49 | `polymarket:3719552|kalshi:KXBTCD-26AUG1910-T69699.99` | below-threshold | rejected | Bit | 64000 / 69699.99 | no | 3600000 | 0.081779 | BRTI | CORRECTLY_LABELED |
| 50 | `polymarket:3719574|kalshi:KXETHD-26AUG1910-T1174.99` | below-threshold | rejected | Eth | 1850 / 1174.99 | no | 3600000 | 0.364870 | ERTI | CORRECTLY_LABELED |
| 51 | `polymarket:3720401|kalshi:KXBTCD-26AUG1909-T62699.99` | below-threshold | rejected | Bit | 64200 / 62699.99 | no | 3600000 | 0.023365 | BRTI | CORRECTLY_LABELED |
| 52 | `polymarket:3720404|kalshi:KXBTCD-26AUG1909-T61699.99` | below-threshold | rejected | Bit | 63600 / 61699.99 | no | 3600000 | 0.029874 | BRTI | CORRECTLY_LABELED |
| 53 | `polymarket:3720416|kalshi:KXETHD-26AUG1909-T1974.99` | below-threshold | rejected | Eth | 1940 / 1974.99 | no | 3600000 | 0.017717 | ERTI | CORRECTLY_LABELED |
| 54 | `polymarket:3720417|kalshi:KXETHD-26AUG1909-T1569.99` | below-threshold | rejected | Eth | 1920 / 1569.99 | no | 3600000 | 0.182297 | ERTI | CORRECTLY_LABELED |

Per-row justifications, one to three sentences each, are in
`analysis/adjudication3-2026-08-19.jsonl` keyed by `pair_id`.

## Per-stratum tallies

| stratum | drawn | CORRECTLY_LABELED | MISLABELED | INSUFFICIENT_EVIDENCE |
| --- | --- | --- | --- | --- |
| class:basis-pair | 12 | 7 | 5 | 0 |
| above-0.600 | 8 | 8 | 0 | 0 |
| above-0.649 | 8 | 8 | 0 | 0 |
| above-0.698 | 8 | 8 | 0 | 0 |
| above-0.747 | 8 | 6 | 2 | 0 |
| below-threshold | 10 | 10 | 0 | 0 |
| **total** | **54** | **47** | **7** | **0** |

No row was returned INSUFFICIENT_EVIDENCE. The corpus stores complete primary rule text for both
legs of all 54 rows, so every question this adjudication asked was answerable from committed data.

Cutting the same 54 rows by artifact class rather than by stratum, because the emitted class
appears in two strata:

| artifact class | rows in sample | correct | mislabelled |
| --- | --- | --- | --- |
| basis-pair | 16 | 9 | 7 |
| related | 28 | 28 | 0 |
| rejected | 10 | 10 | 0 |

## Mislabel rate, emitted stratum

Inputs, stated so the arithmetic can be rechecked:

- Stratum: `class:basis-pair`, the emitted-class draw. Population 72, drawn n = 12.
- Mislabelled x = 5. All five are the Ethereum rows (#8 to #12); all seven Bitcoin rows pass.
- p-hat = 5 / 12 = 0.4167.
- Wilson score interval, two-sided 95%, z = 1.959964, no continuity correction.

**Mislabel rate: 41.7%, Wilson 95% CI [19.3%, 68.0%] (x = 5, n = 12).**

Two further readings of the same defect, both worth more than the n = 12 figure:

- All emitted-class rows drawn anywhere in the sample: x = 7, n = 16, rate 43.8%, Wilson 95% CI [23.1%, 66.8%].
  The extra four rows are basis pairs drawn inside the `above-0.747` stratum, which overlaps the emitted class.
- **Census of the whole emitted basis-pair book: 32 of 72 = 44.4% exactly.** Every one of the 72 Kalshi
  legs was checked against its stored rule text, so this is exhaustive and needs no interval. The Wilson
  interval [33.5%, 55.9%] is shown only for comparability and should not be quoted: a census supersedes
  a sample drawn from the same book, which is the artifact's own stated rule from round 2.

The defect is deterministic rather than random. It fires on exactly the Ethereum contracts and on
none of the Bitcoin contracts, so the rate is a property of the entity mix in the book (32 of 72
emitted pairs are Ethereum), not a sampling quantity. Any future run whose entity mix shifts will
move this rate without anything about the matcher changing.

## What was verified and holds

Stated explicitly, because a refutation-seeking audit that reports only its hits is not an audit.

- **Zero same-measurement-instant matches.** `matches.jsonl` contains 986 records, 72 `basis-pair`
  and 914 `related`, and no `identical` or `near-equivalent` record exists. The headline is exact.
- **Measurement-window basis is real and correctly described.** Every Polymarket leg's rule text
  reads the "Close" price of the 1 hour candle "that ends on the time and date specified in the
  title"; every Kalshi leg reads the "simple average of the sixty seconds ... before" that hour.
  The window ends at the listed time on both venues, so the pairing is not an hour off. All 72
  records carry `point-close`/0 ms/`ends-at-close` against `window-mean`/60000 ms/`precedes-close`,
  and all 72 name `measurement-instant` in `failed_gates`.
- **Cent bridge is exact on all 72.** Kalshi floor plus 0.01 equals the Polymarket floor to within
  1e-9 for every emitted pair, with no exceptions.
- **Listed-close equality is exact on all 72.** `close_delta_ms` is 0 for every emitted pair.
- **Caveat count and topics.** All 986 emitted records carry exactly three caveats with the topics
  index basis, quote-currency basis and measurement-window basis. Presence is complete; accuracy is
  where it fails.
- **No missed basis pair.** Across all 34594 retained pairs, exactly 72 satisfy the conjunction
  (close_delta_ms = 0, Kalshi floor + 0.01 = Polymarket floor, relation equal), and all 72 are
  classed `basis-pair`. Recall on the artifact's own definition is complete, and no row in this
  sample is a basis pair or better that the artifact missed.
- **One counterpart per market holds.** The 72 emitted pairs use 72 distinct Polymarket legs and 72
  distinct Kalshi legs; no market appears twice.
- **The unexercised-strike-boundary caveat is true.** Among same-close, same-relation pairs the
  distinct strike distances are 0, then 5e-06, then nothing until 0.001495. The 0.1% near-equivalent
  tolerance genuinely sits in an empty region, so the artifact is right that the boundary is
  unevidenced by this run.
- **Corpus-level counts reproduce.** 4368 Polymarket and 7305 Kalshi distinct markets, 5034 markets
  captured more than once (3296 plus 1738), 120 book snapshots over 4 capture cycles, 10 booked
  markets per venue, 0 emitted pairs with books on both venues, 0 markets with a moved rules digest.
  The `capture-meta` file's `book_snapshots: 30` and `cycles: 1` describe the final cycle only and
  are consistent with the totals rather than contradicting them.

## Evidence quality

The evidence base is the strongest of the three rounds and is now sufficient to settle every
question this adjudication asked, which is why no row came back INSUFFICIENT_EVIDENCE. Each emitted
record carries per-leg `settlement_functional` with `kind`, `window_ms`, `window_position`,
`quote_currency`, a quoted `evidence` fragment and a `rules_digest`, and the corpus stores the full
primary `rules_text` those digests cover, so a reader can go from a published caveat to the venue's
own sentence in one hop. That is precisely the capability round 2 found missing, and building it is
what makes the ERTI defect findable at all. The rule text is also unusually clean: two Polymarket
templates and one Kalshi template generate every leg in the sample, both stating the threshold
relation and the measurement window in unambiguous words, so the functional extraction can be
checked by reading rather than inferred.

The weakness is that the derived summary fields are still not constrained by the evidence sitting
next to them. `kalshi.settlement_index` is `cf-benchmarks-brti` on all 986 records, including 328
whose rule text names ERTI, and on those records `settlement_evidence` contains no `text:brti`
token at all. The artifact therefore stores, in the same object, an evidence array that does not
support the label and a label asserted anyway. A single cross-field invariant, that the index label
must be witnessed by a token in its own evidence array, would have caught this before publication,
and its absence is the same failure mode as round 2 rather than a new one. A second, smaller
instance: `settlement_evidence` lists `text:coinbase` on every Kalshi leg, drawn from a secondary
sentence whose actual content is that Coinbase is NOT the settlement source ("While checking a
source like Google or Coinbase may help guide your decision, the price used to determine this
market is based on CF Benchmarks' corresponding Real Time Index"). The token extractor is reading
a disclaimer as an endorsement. Neither instance changes any class assignment, and both are
statements about the artifact's disclosures rather than about its gates.

## Three sharpest observations

**1. The index-basis caveat is wrong on every Ethereum record, and it is wrong in the one field the
artifact insists must travel with any quoted number.** `ANALYSIS.md` states that the settlement-basis
caveat "rides on every match record in `analysis/matches.jsonl` under `caveats` and must travel with
any number quoted from them." On all 32 Ethereum basis pairs that caveat reads "index basis: binance
vs cf-benchmarks-brti", naming the Bitcoin Real-Time Index on an Ethereum contract whose rule text
says "CF Benchmarks' Ethereum Real-Time Index (ERTI)". The economic shape of the caveat survives,
since the two legs do read different indices either way, but a consumer who follows the caveat to
its named source is sent to the wrong index, and a consumer computing an ETH basis against BRTI is
computing a cross-asset spread. This is the round-2 defect class exactly: a summary field that does
not faithfully represent the venue's own words, sitting on top of captured evidence that contradicts
it. It is narrower than round 2's finding, because it corrupts a disclosure rather than a gate and
leaves all 72 class assignments standing, but it is the same failure to constrain a derived label by
its own source.

**2. The published sampling frame does not reproduce, and the emitted class is over-represented
rather than represented.** Five of the six stratum populations reproduce exactly from
`scored-pairs.jsonl`. The sixth does not: `above-0.747` is published as 132, and the true count of
pairs scoring in [0.7465875, 0.7954501) is 144, of which 72 are `basis-pair` and 72 are `related`.
The published 132 equals 144 minus the 12 already drawn into the `class:basis-pair` stratum, so the
frame decremented the band by the draw instead of by the class. The consequence is that the strata
are not disjoint: all 72 basis pairs live inside the `above-0.747` band, the six published
populations sum to 34654 against 34594 retained pairs, an excess of exactly 60, and the `above-0.747`
draw pulled four more basis pairs on top of the 12. The 54-row sample therefore contains 16
emitted-class rows, not the 12 the frame advertises. The direction of the error is benign, the
emitted class got more scrutiny rather than less, but a frame whose populations do not reproduce
cannot support a rate computed from it, and the pre-registration is what the rate's credibility
rests on.

**3. After the artifact's own cent-normalization the two thresholds still differ by one tick, and
the `bound` fields hide it.** Kalshi's rule is "above 66199.99" and Polymarket's is "higher than"
66200, so both legs are recorded, correctly, as `bound: exclusive`. The artifact then normalizes,
in its own strike evidence, that "exclusive floor 66199.99 bridges to inclusive 66200 on the 0.01
quotation grid". Carry that through and the pair reads inclusive-66200 against exclusive-66200: a
settled value of exactly 66200.00 resolves Kalshi Yes and Polymarket No, with no fine granularity
needed. `ANALYSIS.md` does carry a knife-edge caveat, but it is scoped to "where one side is
strictly above a threshold and the other is at-or-above it", a condition the record's own matching
`exclusive`/`exclusive` bound fields say is not met here. The flag is therefore suppressed for
precisely the population it describes. The record does disclose the bridge in `strike.evidence` and
records `strike_exact: false` on all 72, which is why this is logged as a reservation rather than
scored against the Bitcoin rows, but the disclosure is in a free-text evidence string rather than in
the `caveats` array the artifact promises is complete. Worth noting that the Kalshi leg settles on a
mean of sixty index prints, which does not live on a 0.01 grid at all, so the "quotation grid"
premise of the bridge is itself shaky on the Kalshi side.

## Escalations

1. **Blocking for publication of any per-record number:** correct `settlement_index` derivation for
   ERTI, regenerate the 328 affected records, and add the cross-field invariant that an index label
   must be witnessed by a token in its own `settlement_evidence`.
2. **Blocking for any rate quoted against the frame:** correct the `above-0.747` population to 144,
   state whether the score-band strata are meant to exclude the emitted class, and make the six
   populations sum to the retained count.
3. **Non-blocking, should be fixed:** stop reading the Coinbase disclaimer sentence as settlement
   evidence; move the one-tick bound residual from `strike.evidence` into `caveats`; and correct the
   `ANALYSIS.md` sentence "Polymarket's crypto families settle off Chainlink", which is contradicted
   by the artifact's own headline and by the corpus. Chainlink appears in 700 Polymarket rule texts
   overall but in zero of the 144 Polymarket legs in this book, all of which name Binance.



## Addendum: comparison against rounds 1 and 2

Written only after every verdict, tally and observation above was fixed. Rounds 1 and 2 were not
opened until that point.

### Both prior refutations were real, and both fixes hold under independent re-derivation

Round 1 refuted the book on wrong-hour twins: a smooth 24-hour close-time score charged under one
percent for a full hour of error and 72 of 144 emitted matches paired a 9am contract with a 10am
one. That fix holds, and this sample contains its sharpest possible test. Rows 41 to 44 are pairs
whose strikes bridge exactly on the cent, so on strike alone they read as twins, and all four are
demoted to `related` with `listed-close` named in `failed_gates` because their closes are an hour
apart. The failure mode round 1 found is now caught by the gate that replaced the score.

Round 2 refuted the book on the settlement functional: Polymarket reads a terminal candle print,
Kalshi a 60-second mean, and the match records had reduced the venues' rule text to index tokens
and discarded the functional. That fix holds too, and it is the artifact's largest single
improvement. `settlement_functional` is now carried per leg with `kind`, `window_ms`,
`window_position`, `quote_currency`, a quoted evidence fragment and a `rules_digest`; I re-derived
all 72 against the stored rule text and every field is faithful. The consequence is the headline
itself: the artifact now says zero same-measurement-instant matches exist and emits the 72 as basis
pairs with `measurement-instant` in `failed_gates`, which is the honest labelling round 2 demanded.
Round 2's other escalation, that a human should fix in writing which standard the book publishes
against before any rate ships, has also been met: `ANALYSIS.md` now carries an explicit
"standard this artifact publishes against" section, so the Standard A against Standard B ambiguity
that moved round 2's rate from 0 percent to 100 percent no longer exists.

### Where this round diverges

**The ERTI defect is new, and round 2's census is the specific reason it survived.** Neither prior
file mentions ERTI or the Ethereum Real-Time Index anywhere. Round 2 quoted the Kalshi template as
"CF Benchmarks' Bitcoin Real-Time Index (BRTI)" and characterised the corpus as "72 distinct
Kalshi digests differing only in strike and hour". They differ in one more thing: the index name.
Round 2 read one Kalshi rule text and generalised to 72. Its own stated lesson was that an audit
restricted to an artifact's summary fields cannot see a defect those fields omit, and the same
shape of error then occurred one level down, in a census that sampled the source. The corrective
this round applied, and the reason the defect surfaced, was to re-derive the settlement fields from
source for all 72 records rather than for the 12 drawn.

**The frame finding is a regression against round 2, not a standing defect.** Round 2 audited the
frame explicitly and recorded `above-0.747` population 144 as "exact", with the four bands summing
to 336 + 258 + 248 + 144 = 986, the size of the emitted book. The regenerated frame publishes 132
for that band and adds a `class:basis-pair` stratum of 72. The band was decremented by the 12 rows
drawn into the new stratum rather than by the 72 members of the class, so a number round 2 verified
as exact is now wrong, the strata no longer partition, and the six populations sum to 34654 against
34594 retained pairs. The new stratum is itself the right response to round 2's observation 2,
which argued the audit should stratify on the thing it is measuring instead of reaching the emitted
class incidentally at n = 6. The idea was adopted; the bookkeeping was not.

**My third observation is not new, and round 1 deserves the credit.** Round 1 already named the
one-tick residual, flagging on its TRUE_MATCH rows "the knife-edge at exactly 64,400.00 where
Polymarket's strict '>' and Kalshi's '>=' disagree". What has changed since is the direction of
travel: that residual was an explicit per-row reservation in round 1, and in the current book it
appears only inside a free-text `strike.evidence` string while the `caveats` array, which the
artifact says carries everything that must travel with a quoted number, omits it. A disclosure
moved from a more visible place to a less visible one.

**Round 2's unexercised-boundary finding reproduces exactly.** Same-close, same-relation pairs run
to strike distance 5e-06 and then resume at 1.495e-03, with nothing in the 0.1% tolerance band
between. `ANALYSIS.md` now states this in "what this analysis cannot say", which is round 2's
observation 3 correctly absorbed into the artifact.

### Conclusion

The trajectory is strongly favourable and the severity is collapsing. Round 1 found half the book
was a different bet. Round 2 found all of it carried an undisclosed timing exposure. This round
finds no wrong class assignment anywhere in 54 rows, complete recall on the artifact's own
definition, and a headline that is exact: 47 of 54 rows are correctly labelled, and the 7 that are
not are correctly classed pairs carrying one factually wrong field.

That is a different kind of finding from the first two, and it should not be read as a third
refutation of the same magnitude. The artifact's central claims survive this round. What does not
survive is the completeness of its disclosure layer, on a class of markets that is 44 percent of
the emitted book, plus a frame whose populations no longer reproduce. Both are mechanical and both
are cheap to fix. The pattern worth naming for whoever owns the next regeneration is that all three
rounds found the same underlying failure: a derived summary field asserted without being
constrained by the source evidence stored beside it. Round 1's was the close-time score, round 2's
was the settlement functional, round 3's is the settlement index. Each was fixed individually. The
invariant that would have caught all three at once, that every derived field must be witnessed by
evidence in its own record, still does not exist.

---

# VERIFICATION ADDENDUM (2026-08-19, appended after the corrections)

Scope: a verification pass on the SAME book (run id `97946cfda9a9`, same corpus, same 986 emitted
records) after the builder's corrections to the six findings above. This is not a fresh
adjudication round and no sample was redrawn by me. **The 54 verdicts, tallies, rates and
observations above are UNCHANGED and are preserved as the record of what the book looked like
when it was adjudicated.** What follows is only whether each finding is now fixed.

## Per-finding result

| # | finding | result |
| --- | --- | --- |
| 1 | ERTI index label | **FIXED** |
| 2 | sampling frame does not reproduce | **FIXED** |
| 3 | Coinbase disclaimer read as settlement evidence | **FIXED** |
| 4 | knife-edge caveat absent on the one-tick population | **FIXED, two residuals** |
| 5 | Chainlink sentence | **FIXED** |
| 6 | settlement_index token witnesses | **NOT IMPLEMENTED as a checkable field** |

### 1. ERTI: fixed

Re-derived the index label from `resolution.rules_text` for every emitted record, not a sample.
Zero mismatches in 986. The basis-pair split is 40 Bitcoin legs on `cf-benchmarks-brti` and 32
Ethereum legs on `cf-benchmarks-erti`, which reproduces the recount at the gate exactly; across
all 986 emitted records the split is 658 to 328. The index-basis caveat now carries the correct
index per entity: Ethereum records read "index basis: binance vs cf-benchmarks-erti". Both
`ANALYSIS.md` and `audit-sample.md` render the corrected label.

### 2. Frame: fixed, and fixed on the stronger of the two available readings

`above-0.747` moved from 132 to 72, which is the band with the emitted class removed rather than
the band with the drawn rows removed. The frame now states the semantics in words: the score bands
"EXCLUDE the emitted classes entirely, not merely the rows drawn from them". Recomputed against
`scored-pairs.jsonl`, all six populations reproduce exactly (72, 336, 258, 248, 72, 33608), they
sum to 34594 which equals the retained set with delta 0, and every one of the 34594 retained pairs
falls into exactly one stratum. The 54 drawn ids are distinct and the sample now contains exactly
12 basis-pair rows rather than the 16 it contained when I adjudicated it.

### 3. Coinbase tokens: fixed, with one thing worth recording

Zero `coinbase` tokens remain in `settlement_evidence` on either leg of any record. The Kalshi
evidence array is now exactly `('text:brti',)` or `('text:erti',)`; Polymarket keeps
`('text:binance', 'url:binance.com')`. Note that `text:cf benchmarks` was dropped alongside the
disclaimer token, and that one was a genuine endorsement. No substance is lost, because the
surviving token is strictly more discriminating and is the one that actually witnesses the label:
`text:cf benchmarks` cannot tell BRTI from ERTI, which is precisely how the original defect
survived a census. The evidence array is now single-token, which is thinner than before but
correct, and I would not ask for the ambiguous token back.

### 4. Knife-edge caveat: fixed on the population I raised, with two residuals

All 72 basis pairs now carry a fourth caveat, `threshold knife-edge`, and it names the actual
thresholds per record: "the legs do not denote the identical threshold (exclusive 66800 vs
exclusive 66799.99), so a settled value between them resolves them oppositely". That is the
disclosure I said was missing from the `caveats` array, it fires on the exclusive/exclusive
one-tick population, and on the emitted class it is correctly scoped: all 72 basis pairs have a
gap of exactly 0.01. Two residuals, neither blocking.

**Residual (a): the caveat fires on all 986 emitted records, including 826 whose strikes are not
one tick apart.** The widest carry it verbatim: `polymarket:3719545|kalshi:KXBTCD-26AUG1909-T65199.99`
has a 400.01 dollar gap and is disclosed as a "threshold knife-edge ... a settled value between
them resolves them oppositely". That sentence is literally true and the class is still correctly
`related`, but calling a 400 dollar gap on a 65,000 dollar asset a knife-edge misdescribes the
magnitude by roughly four orders of magnitude, and it inverts the caveat's purpose: the whole band
[65200.00, 65600.00] separates those legs, which is not a boundary artifact but a different bet.
Gap distribution among the 986 records carrying the caveat: 160 at exactly 0.01, and 826 above it,
running 4.99, 99.99, 100.01, 199.99, 200.01, 299.99, 300.01 and up. The scoping should key on the
one-tick condition, or the wide-gap case should get its own wording.

**Residual (b): "a settled value between them" excludes the one endpoint that needs no fine
granularity.** The set that resolves the legs oppositely is the half-open interval (66799.99,
66800], because Kalshi pays on x > 66799.99 and Polymarket on x > 66800. "Between them" reads as
the open interval and drops 66800.00 itself. That endpoint is the case I raised originally: a
Binance close of exactly 66800.00 is an ordinary print on a 0.01 grid, needs no finer-grained
source, and splits the pair. A word ("at or between", or naming the interval as half-open) closes
it.

### 5. Chainlink: fixed, and the replacement is accurate

The sentence now reads that in this corpus every Kalshi crypto leg settles off a CF Benchmarks
real-time index per asset (BRTI for Bitcoin, ERTI for Ethereum) and every Polymarket crypto leg
settles off Binance, and that no Polymarket leg in this book names Chainlink "though it appears in
other Polymarket families in the wider capture". That matches what I measured: Chainlink appears in
700 Polymarket rule texts corpus-wide and in zero of the emitted Polymarket legs.

### 6. Witness fields: the effect is there, the checkable artifact is not

There is no witness field on either leg. The record keys are unchanged from the version I
adjudicated, and the string "witness" does not appear anywhere in `ANALYSIS.md`. What exists is the
outcome rather than the mechanism: `settlement_evidence` now happens to contain exactly the token
that supports the label, so the invariant holds on this run by construction. My escalation asked for
the invariant itself, that an index label must be witnessed by a token in its own evidence array,
because the original defect was not a wrong constant but an unconstrained derivation. Nothing in the
regenerated artifact would fail if a future run reintroduced an unwitnessed label. This is the one
item I would not mark closed.

## What the corrections did not break

Ten structural checks re-run over the regenerated book, all passing: `close_delta_ms` is 0 on all
72; Kalshi floor plus 0.01 equals the Polymarket floor on all 72; `failed_gates` is exactly
`[measurement-instant]` on all 72; both legs' `settlement_functional` fields are unchanged and still
verbatim-supported by the stored rule text; mutual-best still holds with 72 distinct legs per side;
recall is still complete with exactly 72 pairs in the whole retained set satisfying the basis-pair
conjunction and all 72 so classed; bounds are still exclusive on both legs; entity still agrees with
the Polymarket trading pair on all 72. Class counts are unchanged at 72 and 914, and the score range
is unchanged. No verdict in the table above would move on the regenerated data except through the
disclosure fields, which is the intended effect.

## What the corrections did not carry: the prose layer

The fixes landed in the data layer and `ANALYSIS.md` was not fully brought along, which leaves three
statements that are now wrong or in tension with the records they describe.

1. **"Every emitted record carries all three in its `caveats` array."** Records now carry four. The
   headline section describes three bases and never mentions the threshold knife-edge, so the
   artifact's summary of its own disclosure is now an undercount of it.
2. **The knife-edge bullet in "what this analysis cannot say" was not updated.** It still scopes the
   risk to "where one side is strictly above a threshold and the other is at-or-above it", a
   bound-mismatch condition that the records' own `exclusive`/`exclusive` bound fields say never
   occurs, and it still says "the probability mass at an exact cent is tiny". It now describes the
   same phenomenon as the new per-record caveat in incompatible terms.
3. **A new tension with the published standard.** The standard requires "same threshold after
   cent-normalization", while the new caveat asserts on every emitted record that "the legs do not
   denote the identical threshold". Both are now published. Either cent-normalization makes these
   the same threshold, in which case the caveat overstates, or it does not, in which case the
   standard's phrasing needs to say so. I read the caveat as the more honest of the two and would
   change the standard, not the caveat.

None of these is a data defect and none moves a verdict. They are the reason a corrections pass
should re-read the prose that quantifies the fields it changed.

---

# FINAL CONFIRMATION (2026-08-19, appended after the final polish)

Spot-check of the final polish on the same book. Verdicts, tallies and rates above remain
unchanged. **All four items CONFIRMED. This closes the adjudication cycle.**

**1. Witness invariant: CONFIRMED, and it now satisfies the standard I set.** `settlement_index_witness`
exists on both legs of all 986 records. I re-derived the label from `matches.jsonl` alone, with no
access to the corpus, and the mapping is a clean bijection: `text:brti` to `cf-benchmarks-brti`,
`text:erti` to `cf-benchmarks-erti`, `text:binance` to `binance`. Zero records carry a witness token
absent from their own `settlement_evidence`. This is the checkable artifact I said I would not mark
closed, and it is now closed: a future run that reintroduced an unwitnessed label would fail this
check from the published record alone.

**2. Knife-edge scoping and interval wording: CONFIRMED.** The knife-edge caveat now fires on exactly
160 records, every one at a measured gap of 0.01 (72 basis pairs, 88 related). No record with a gap
other than one tick carries knife-edge wording. The interval is stated correctly and explicitly:
"any settled value in (66799.99, 66800] resolves them oppositely, the closed endpoint included",
which closes residual (b) exactly. It also adds "the settled value need not land on that grid",
which is the Kalshi sixty-print-mean point. The 826 wide-gap records get their own wording naming
the actual distance and levels, and calling it "a different level, not a rounding convention", which
closes residual (a). 160 plus 826 is 986.

**3. Prose: CONFIRMED on all three sub-points.** The count now reads "four caveats ride with every
pair in this book". The limitations bullet is rescoped: the old bound-mismatch condition is gone and
replaced by "BOTH legs are strictly-above, one quotation tick apart ... any settled value in the
half-open interval between the two thresholds, the upper endpoint included, splits them", with the
grid caveat carried through. And the standard/caveat tension is resolved in the caveat's favour, the
direction I recommended: the standard now requires "cent-bridged thresholds (which where both bounds
are exclusive means one quotation tick apart, not identical)" and states outright that "the
threshold wording is deliberately not 'same threshold' ... The standard now says what the caveats
have been saying rather than claiming an exactness the artifact itself disclaims."

**4. Nothing broken.** Eleven checks re-run and all passing: class counts 72 and 914, retained 34594,
`close_delta_ms` 0 on all 72, cent bridge exact on all 72, `failed_gates` exactly
`[measurement-instant]`, both functionals intact and still verbatim-supported by the stored rule
text, mutual-best intact, recall complete, index labels matching rules text on all 986, four caveats
on all 986, bounds exclusive on both legs, score range unchanged, and the frame still summing to the
retained total.

One cosmetic residual, not worth a further pass: the headline sentence describes the fourth caveat as
"naming the one-tick threshold gap", which is what it names on 160 records; on the other 826 it
names a wide level difference instead. The claim is exact for the emitted basis-pair class the
headline is about and loose only if read across the whole book.

Adjudication cycle closed. Three rounds of findings raised, all fixed and independently verified
against source.
