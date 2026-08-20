# T3 match adjudication, round 2

Adjudicator: independent adjudicator, round 2 (same rig, fresh session, no part in matcher
construction or round 1); not a domain-licensed reviewer.

Run id: `97946cfda9a9`  ·  seed: `1153758879`  ·  sample: 42 pairs across 5 strata
Sources read: `analysis/audit-sample.md`, `analysis/audit-sample.jsonl`, `analysis/matches.jsonl`,
`analysis/scored-pairs.jsonl`, `t3/ANALYSIS.md`, `t3/capture-meta-2026-08-19.json`.
Round 1's files were deliberately not opened until every verdict below was written; the comparison
addendum at the end was added afterwards.

## The standard I applied

The adjudication question is whether the same world-state resolves both legs the same way. Two
readings of that are defensible for this book, and the answer flips completely between them, so I
state both rather than quietly picking one.

- **Standard A (declared-class reading, used for the headline).** A pair is a TRUE_MATCH when the
  two legs share entity, measurement instant, relation and threshold (after correct bound
  normalisation), such that they resolve identically under every world-state except differences the
  artifact itself discloses in its `caveats` field. A FALSE_MATCH is an emitted pair that can
  resolve differently for a reason the artifact does not disclose.
- **Standard B (strict identity).** A pair is a TRUE_MATCH only when no world-state separates the
  legs at all, disclosed or not.

Every one of the 72 emitted pairs settles Polymarket off Binance and Kalshi off CF Benchmarks BRTI.
Under Standard B that alone makes all 72 non-equivalent and the false-match rate is 100 percent.
Under Standard A the caveat carries that risk honestly and the rate is 0 percent. The headline
below is Standard A; the Standard B sensitivity is printed beside it and is not optional reading.

## Verdict table (all 42)

| # | pair | stratum | matcher class | verdict | justification |
| --- | --- | --- | --- | --- | --- |
| 1 | `polymarket:3720401|kalshi:KXBTCD-26AUG1910-T64499.99` | above-0.600 | related | **NOT_EQUIVALENT_BUT_RELATED** | Same asset and same measurement instant (both close_ms 1787148000000 = 2026-08-19T14:00Z = 10:00 ET, and the Kalshi ticker hour suffix 1910 agrees), but Polymarket asks x > 64,200 while Kalshi asks x >= 64,500 after correct bridging of exclusive floor 64,499.99 at a 0.01 tick. That is three Kalshi rungs on a 100 dollar ladder, so a 64,350 print resolves them oppositely. Correctly withheld on strike-tolerance. |
| 2 | `polymarket:3719549|kalshi:KXBTCD-26AUG1909-T65099.99` | above-0.600 | related | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree exactly (both 1787144400000 = 13:00Z = 09:00 ET, ticker suffix 1909 agrees), but the thresholds are x > 64,800 against x >= 65,100, a 300 dollar gap. Any settle in [64,800.01, 65,099.99] splits them. Correctly withheld. |
| 3 | `polymarket:3720410|kalshi:KXETHD-26AUG1910-T2009.99` | above-0.600 | related | **NOT_EQUIVALENT_BUT_RELATED** | Both sides are Ethereum at 14:00Z (10:00 EDT), corroborated on the Kalshi side by both the ticker suffix 1910 and the title text 'at 10am EDT'. Thresholds are x > 2,000 against x >= 2,010, two rungs on Kalshi's 5 dollar ETH ladder. Not the same claim. |
| 4 | `polymarket:3720407|kalshi:KXBTCD-26AUG1910-T62699.99` | above-0.600 | related | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree (both 14:00Z, suffix 1910), thresholds do not: x > 63,000 against x >= 62,700, a 300 dollar gap in the opposite direction from row 1. Correctly withheld. |
| 5 | `polymarket:3720403|kalshi:KXBTCD-26AUG1909-T64099.99` | above-0.600 | related | **NOT_EQUIVALENT_BUT_RELATED** | Two independent defects: the Polymarket market measures at 14:00Z (10:00 ET) and the Kalshi one at 13:00Z (09:00 ET, suffix 1909), a recorded close_delta of 3,600,000 ms, and the thresholds are 300 dollars apart (x > 63,800 against x >= 64,100). Both failed gates are recorded. |
| 6 | `polymarket:3719572|kalshi:KXETHD-26AUG1909-T1879.99` | above-0.600 | related | **NOT_EQUIVALENT_BUT_RELATED** | Same instant on both sides (13:00Z, confirmed by ticker suffix 1909 and the title's '9am EDT'), thresholds x > 1,870 against x >= 1,880. Two rungs apart on the 5 dollar ETH ladder. |
| 7 | `polymarket:3719573|kalshi:KXETHD-26AUG1909-T1869.99` | above-0.600 | related | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree at 13:00Z; thresholds are x > 1,860 against x >= 1,870, a 10 dollar gap. A 1,865 print pays Polymarket YES and Kalshi NO. |
| 8 | `polymarket:3720417|kalshi:KXETHD-26AUG1909-T1929.99` | above-0.600 | related | **NOT_EQUIVALENT_BUT_RELATED** | Instants differ by one hour (Polymarket 14:00Z, Kalshi 13:00Z per suffix 1909 and title '9am EDT') and thresholds differ by 10 dollars (x > 1,920 against x >= 1,930). Correctly withheld on both gates. |
| 9 | `polymarket:3720392|kalshi:KXBTCD-26AUG1910-T66399.99` | above-0.649 | related | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree exactly at 14:00Z (suffix 1910), thresholds are x > 66,200 against x >= 66,400. Two rungs on the 100 dollar Kalshi BTC ladder. The 0.693 score reflects strike proximity, not equivalence. |
| 10 | `polymarket:3720399|kalshi:KXBTCD-26AUG1910-T64399.99` | above-0.649 | related | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree at 14:00Z. Thresholds x > 64,600 against x >= 64,400, a 200 dollar gap with the Kalshi rung below the Polymarket one. Not the same claim. |
| 11 | `polymarket:3720416|kalshi:KXETHD-26AUG1909-T1944.99` | above-0.649 | related | **NOT_EQUIVALENT_BUT_RELATED** | Polymarket measures at 14:00Z, Kalshi at 13:00Z (suffix 1909 and title '9am EDT' both agree), a full hour apart, and the thresholds differ by 5 dollars (x > 1,940 against x >= 1,945). This is one Kalshi ETH rung, the tightest strike gap in the withheld set, and it was still correctly withheld. |
| 12 | `polymarket:3719565|kalshi:KXETHD-26AUG1910-T1944.99` | above-0.649 | related | **NOT_EQUIVALENT_BUT_RELATED** | Mirror of row 11: Polymarket at 13:00Z, Kalshi at 14:00Z (suffix 1910, title '10am EDT'), thresholds x > 1,950 against x >= 1,945. One hour and one rung apart. |
| 13 | `polymarket:3720420|kalshi:KXETHD-26AUG1909-T1894.99` | above-0.649 | related | **NOT_EQUIVALENT_BUT_RELATED** | One hour apart (14:00Z against 13:00Z, ticker and title agree on the Kalshi side) and one ETH rung apart (x > 1,890 against x >= 1,895). Correctly withheld. |
| 14 | `polymarket:3720391|kalshi:KXBTCD-26AUG1909-T66199.99` | above-0.649 | related | **NOT_EQUIVALENT_BUT_RELATED** | Polymarket 14:00Z against Kalshi 13:00Z (suffix 1909), plus a 200 dollar threshold gap (x > 66,400 against x >= 66,200). Two independent reasons these do not co-resolve. |
| 15 | `polymarket:3719573|kalshi:KXETHD-26AUG1910-T1854.99` | above-0.649 | related | **NOT_EQUIVALENT_BUT_RELATED** | Polymarket 13:00Z against Kalshi 14:00Z, and x > 1,860 against x >= 1,855. Note the same Polymarket market 3719573 also appears at row 7 against a different Kalshi rung, and both instances were withheld, which is the laddering behaviour one wants. |
| 16 | `polymarket:3720404|kalshi:KXBTCD-26AUG1917-T63749.99` | above-0.649 | related | **NOT_EQUIVALENT_BUT_RELATED** | The Kalshi leg is the 17:00 ET series (suffix 1917, close_ms 1787173200000 = 21:00Z), seven hours after the Polymarket leg's 14:00Z, and the thresholds differ by 150 dollars. The recorded close_delta of 25,200,000 ms decodes exactly to those seven hours. |
| 17 | `polymarket:3719543|kalshi:KXBTCD-26AUG1909-T66099.99` | above-0.698 | related | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree exactly at 13:00Z and the relation matches, but the thresholds are one Kalshi rung apart (x > 66,000 against x >= 66,100). This is the same Polymarket market that is emitted at row 25 against the 65,999.99 rung, so the matcher picked the exact rung and withheld its neighbour: correct laddering. |
| 18 | `polymarket:3719550|kalshi:KXBTCD-26AUG1909-T64299.99` | above-0.698 | related | **NOT_EQUIVALENT_BUT_RELATED** | Same instant (13:00Z), thresholds x > 64,400 against x >= 64,300, one rung apart. A 64,350 settle splits them. Correctly withheld. |
| 19 | `polymarket:3720389|kalshi:KXBTCD-26AUG1909-T66899.99` | above-0.698 | related | **NOT_EQUIVALENT_BUT_RELATED** | One hour apart (14:00Z against 13:00Z) and one rung apart (x > 66,800 against x >= 66,900). Correctly withheld on both gates. |
| 20 | `polymarket:3720393|kalshi:KXBTCD-26AUG1909-T66099.99` | above-0.698 | related | **NOT_EQUIVALENT_BUT_RELATED** | Polymarket 14:00Z against Kalshi 13:00Z, thresholds x > 66,000 against x >= 66,100. Same shape as row 17 with an added hour of drift. |
| 21 | `polymarket:3720406|kalshi:KXBTCD-26AUG1909-T63299.99` | above-0.698 | related | **NOT_EQUIVALENT_BUT_RELATED** | One hour apart and one rung apart (x > 63,200 against x >= 63,300). Correctly withheld. |
| 22 | `polymarket:3719557|kalshi:KXBTCD-26AUG1910-T63099.99` | above-0.698 | related | **NOT_EQUIVALENT_BUT_RELATED** | Polymarket 13:00Z against Kalshi 14:00Z (suffix 1910), thresholds x > 63,000 against x >= 63,100. Correctly withheld. |
| 23 | `polymarket:3720424|kalshi:KXETHD-26AUG1910-T1844.99` | above-0.698 | related | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree exactly at 14:00Z, corroborated by ticker suffix 1910 and the title '10am EDT', and the thresholds are one Kalshi ETH rung apart (x > 1,850 against x >= 1,845). At 0.27 percent relative this is the tightest strike gap the matcher rejected at a matched instant anywhere in the emitted book's neighbourhood, and the rejection is correct. |
| 24 | `polymarket:3720403|kalshi:KXBTCD-26AUG1917-T63749.99` | above-0.698 | related | **NOT_EQUIVALENT_BUT_RELATED** | Seven hours apart (14:00Z against the 17:00 ET series at 21:00Z) with a 50 dollar threshold gap (x > 63,800 against x >= 63,750). Worth flagging: at 0.000784 relative this pair PASSED the strike-tolerance gate and was withheld by close-time alone, so the recorded failed_gates is ['close-time'] only and the strike gap is invisible in that field. |
| 25 | `polymarket:3719543|kalshi:KXBTCD-26AUG1909-T65999.99` | above-0.747 | near-equivalent | **TRUE_MATCH** | Same asset, same measurement instant (both 1787144400000 = 13:00Z = 09:00 ET, ticker suffix 1909 agrees), same relation, and the thresholds coincide once Kalshi's exclusive floor 65,999.99 is bridged to inclusive 66,000 at the recorded 0.01 tick, which I re-derived by hand. The sole divergence is the disclosed settlement basis (Binance against CF Benchmarks BRTI), plus an undisclosed one-tick difference at exactly 66,000.00 where Polymarket's exclusive 'above' says NO and Kalshi's 'or above' says YES. |
| 26 | `polymarket:3719547|kalshi:KXBTCD-26AUG1909-T65199.99` | above-0.747 | near-equivalent | **TRUE_MATCH** | Instants agree exactly at 13:00Z and the bridging is exact: Kalshi exclusive 65,199.99 at a 0.01 tick is inclusive 65,200, matching Polymarket's 65,200. Same relation, no cap on either side, one-to-one with no competing rung. Equivalent up to the disclosed index-basis caveat. |
| 27 | `polymarket:3720397|kalshi:KXBTCD-26AUG1910-T65199.99` | above-0.747 | near-equivalent | **TRUE_MATCH** | The 10:00 ET twin of row 26: both legs at 1787148000000 = 14:00Z, ticker suffix 1910 agrees, and the same 65,200 threshold after exact bridging. Equivalent up to the disclosed index-basis caveat. |
| 28 | `polymarket:3719554|kalshi:KXBTCD-26AUG1909-T63599.99` | above-0.747 | near-equivalent | **TRUE_MATCH** | Both legs measure at 13:00Z and both thresholds are 63,600 after bridging Kalshi's exclusive 63,599.99 at 0.01. Relation, cap and entity all agree. Equivalent up to the disclosed index-basis caveat. |
| 29 | `polymarket:3719558|kalshi:KXBTCD-26AUG1909-T62799.99` | above-0.747 | near-equivalent | **TRUE_MATCH** | Both legs at 13:00Z, both thresholds 62,800 after exact bridging. No competing Kalshi rung is emitted against this Polymarket market. Equivalent up to the disclosed index-basis caveat. |
| 30 | `polymarket:3719575|kalshi:KXETHD-26AUG1909-T1839.99` | above-0.747 | near-equivalent | **TRUE_MATCH** | The only Ethereum pair in the emitted sample: both legs at 13:00Z, corroborated on the Kalshi side by ticker suffix 1909 and the title '9am EDT', and both thresholds are 1,840 after bridging exclusive 1,839.99 at 0.01. Its strike_distance of 5e-06 rather than 0 is just the 0.01 tick expressed relative to 1,840, not a real gap. Equivalent up to the disclosed index-basis caveat. |
| 31 | `polymarket:3719553|kalshi:KXBTCD-26AUG1910-T63799.99` | above-0.747 | related | **NOT_EQUIVALENT_BUT_RELATED** | The thresholds are identical (63,800 on both sides after bridging) but the measurement instants are not: Polymarket at 13:00Z, Kalshi at 14:00Z per suffix 1910. An hour of Bitcoin tape is more than enough to flip a near-the-money digital, so these are different claims and the close-time gate correctly withheld the pair despite a 0.787 score. |
| 32 | `polymarket:3719568|kalshi:KXETHD-26AUG1910-T1909.99` | above-0.747 | related | **NOT_EQUIVALENT_BUT_RELATED** | Identical 1,910 threshold after bridging, but Polymarket measures at 13:00Z and Kalshi at 14:00Z, confirmed by both the ticker suffix and the title text '10am EDT'. Correctly withheld on close-time. |
| 33 | `polymarket:3719561|kalshi:KXETHD-26AUG1909-T1559.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree at 13:00Z but the thresholds are 430 dollars apart (x > 1,990 against x >= 1,560), a 21.6 percent relative gap. No recall miss: this is a far out-of-the-money rung against a near-the-money one. |
| 34 | `polymarket:3719563|kalshi:KXETHD-26AUG1909-T2564.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | Same instant, thresholds x > 1,970 against x >= 2,565, a 595 dollar gap. Plainly different claims, correctly rejected. |
| 35 | `polymarket:3719570|kalshi:KXETHD-26AUG1909-T2004.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | Same instant at 13:00Z, thresholds x > 1,890 against x >= 2,005, a 115 dollar gap of 23 ETH rungs. Correctly rejected, no recall miss. |
| 36 | `polymarket:3720392|kalshi:KXBTCD-26AUG1910-T71099.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | Instants agree at 14:00Z but the thresholds are 4,900 dollars apart (x > 66,200 against x >= 71,100). Correctly rejected. |
| 37 | `polymarket:3719540|kalshi:KXBTCD-26AUG1910-T72699.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | One hour apart and 6,100 dollars apart in threshold. Correctly rejected. |
| 38 | `polymarket:3719571|kalshi:KXETHD-26AUG1910-T1924.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | The closest call in the below-threshold draw: one hour apart (13:00Z against 14:00Z) and 45 dollars apart in threshold (x > 1,880 against x >= 1,925), which is nine ETH rungs. Still clearly not the same claim, so no recall miss. |
| 39 | `polymarket:3719575|kalshi:KXETHD-26AUG1910-T1419.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | One hour apart and 420 dollars apart. Note this is the same Polymarket market that is correctly emitted at row 30 against its exact rung, so the matcher is not confusing the two. |
| 40 | `polymarket:3720399|kalshi:KXBTCD-26AUG1909-T67799.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | One hour apart (14:00Z against 13:00Z) and 3,200 dollars apart in threshold. Correctly rejected. |
| 41 | `polymarket:3720403|kalshi:KXBTCD-26AUG1909-T68699.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | One hour apart and 4,900 dollars apart. Correctly rejected. |
| 42 | `polymarket:3720420|kalshi:KXETHD-26AUG1909-T1494.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | One hour apart (14:00Z against 13:00Z) and 395 dollars apart in threshold. Correctly rejected, and no genuine match anywhere in the below-threshold draw was missed. |

## Per-stratum tallies

| stratum | n | TRUE_MATCH | FALSE_MATCH | NOT_EQUIVALENT_BUT_RELATED | INSUFFICIENT_EVIDENCE |
| --- | --- | --- | --- | --- | --- |
| above-0.600 | 8 | 0 | 0 | 8 | 0 |
| above-0.649 | 8 | 0 | 0 | 8 | 0 |
| above-0.698 | 8 | 0 | 0 | 8 | 0 |
| above-0.747 | 8 | 6 | 0 | 2 | 0 |
| below-threshold | 10 | 0 | 0 | 10 | 0 |
| **total** | **42** | **6** | **0** | **36** | **0** |

By matcher class rather than by score band:

| matcher class | n sampled | population | TRUE_MATCH | FALSE_MATCH | NOT_EQUIVALENT_BUT_RELATED |
| --- | --- | --- | --- | --- | --- |
| near-equivalent (emitted) | 6 | 72 | 6 | 0 | 0 |
| related (withheld, kept for context) | 26 | 914 | 0 | 0 | 26 |
| rejected (below threshold) | 10 | 33,608 | 0 | 0 | 10 |

Recall: zero genuine matches were found among the 10 below-threshold rows and the 26 related rows.
Every withheld pair I checked differs in threshold, in measurement instant, or in both, and in each
case I re-derived the difference by hand from the recorded floors, ticker suffixes and close_ms
values rather than trusting the score.

## False-match rate for the emitted (near-equivalent) stratum

The emitted class is `near-equivalent`. The sample frame does not stratify on it, so the emitted
rows arrive only incidentally through the top score band: 6 of the 8 rows drawn from `above-0.747`
are near-equivalent, and the other 2 are `related`. The rate is therefore computed on n = 6, not on
n = 8 and not on n = 42.

Wilson score interval, 95 percent, z = 1.959964:

```
centre     = (p_hat + z^2/(2n)) / (1 + z^2/n)
half-width = (z / (1 + z^2/n)) * sqrt( p_hat(1 - p_hat)/n + z^2/(4n^2) )
```

**Standard A (headline).** x = 0 false matches, n = 6, p_hat = 0.
```
z^2 = 3.841459 ;  z^2/(2n) = 0.3201216 ;  1 + z^2/n = 1.6402432
centre     = 0.3201216 / 1.6402432                                  = 0.195167
half-width = (1.959964 / 1.6402432) * sqrt(0 + 3.841459/144)
           = 1.194925 * 0.1633303                                   = 0.195167
```
**False-match rate 0.0 percent (0/6), Wilson 95 percent interval [0.000, 0.390].**

**Standard B (sensitivity).** x = 6, n = 6, p_hat = 1.
```
centre     = (1 + 0.3201216) / 1.6402432                            = 0.804833
half-width = 1.194925 * sqrt(0 + 3.841459/144)                      = 0.195167
```
**False-match rate 100 percent (6/6), Wilson 95 percent interval [0.610, 1.000].**

The upper bound under Standard A is 39 percent. That is the number to quote if any number is
quoted at all: a 6-row sample cannot establish a low false-match rate for a 72-row book, whatever
the point estimate says. For reference, adjudicating all 72 emitted pairs at 0 false matches would
give [0.000, 0.051].

## Audit of the audit: does the frame match the book?

Every frame number reproduces exactly against the underlying files.

| claim in `audit-sample.md` / header | recomputed | verdict |
| --- | --- | --- |
| scored pairs retained 34,594 | 34,594 records in `scored-pairs.jsonl` | exact |
| above-0.600 population 336 | 336 in [0.600, 0.648863) | exact |
| above-0.649 population 258 | 258 in [0.648863, 0.697725) | exact |
| above-0.698 population 248 | 248 in [0.697725, 0.746588) | exact |
| above-0.747 population 144 | 144 in [0.746588, 0.795450] | exact |
| below-threshold population 33,608 | 33,608 with score < 0.600 | exact |
| strata sum | 336 + 258 + 248 + 144 = 986 = records in `matches.jsonl` | exact |
| `attainable_ceiling` 0.795450 | equals the observed maximum score in the book | exact |

The 42 drawn ids are distinct, each falls inside its stated band, all 32 above-threshold ids are
present in `matches.jsonl`, and none of the 10 below-threshold ids appears there. The four upper
strata are equal-width partitions of [0.600, 0.795450] to within floating point.

Two things the frame does not say. First, there is no ceiling **note** anywhere: `attainable_ceiling`
exists only as a machine field in the JSONL header and is never explained in the Markdown. It is
also not a structural bound on equivalence. Reconstructing the scorer from the recorded components
(reproducing all 986 totals to within 7e-07) gives weights close_time 0.20, relation 0.25,
settlement 0.15, strike 0.30, title 0.10, and 0.795450 = 0.45 + 0.30 + 0.10 x 0.454545. The ceiling
therefore bakes in the maximum *observed title Jaccard* for this venue pair alongside the permanent
settlement zero, which makes it descriptive of this run rather than derived. Second, `ANALYSIS.md`
reports 231,903 pairs scored while the audit universe is the 34,594 retained at or above 0.45, so
197,309 scored pairs sit outside the frame entirely. The Markdown's own wording ("scored pairs
retained") is honest about this, but the recall arm of the audit is narrower than it looks.

## Evidence quality

The recorded evidence was sufficient to reach a verdict on all 42 rows without a single
INSUFFICIENT_EVIDENCE, and on the questions I was asked to hunt hardest it is genuinely good. Every
one of the 42 rows is internally consistent on measurement instant: the Polymarket title hour, the
Kalshi ticker hour suffix, both `close_ms` values and the recorded `close_delta_ms` agree in all 42
cases, and I decoded the epochs independently (1787144400000 = 2026-08-19T13:00Z = 09:00 ET,
1787148000000 = 14:00Z = 10:00 ET, 1787173200000 = 21:00Z = 17:00 ET, all EDT at UTC-4). The
Kalshi bound bridging carries an explicit derivation in the evidence string and is arithmetically
correct every time I checked it by hand; across the whole emitted book the Polymarket floor equals
the Kalshi floor plus exactly 0.01 in all 72 pairs, with no exceptions. The settlement-basis caveat
is attached to all 72 emitted pairs and states the failure mode in plain words.

Five gaps count against it. (1) The Polymarket bound is asserted as `exclusive` with confidence
`parsed` on the strength of the word "above" in the title; no rule text is quoted, so the one
input that decides whether the emitted pairs are exactly identical or differ by one tick is the one
input with no primary evidence behind it. (2) The Polymarket unit is recorded as "comma-grouped
magnitude" with no currency symbol, so the two legs' units are established by different and
asymmetric means. (3) There is no settlement-observation-time field distinct from `close_ms`; the
artifact treats close time as the measurement instant without recording evidence that either venue
observes at close rather than over a window. (4) There is no relation-shape dimension at all: the
`relation` vocabulary is directional only, so a one-touch leg paired against a digital leg would be
scored as relation-equal and would not be caught. In this book every pair is above-against-above
with a null cap, so the risk is latent rather than realised, but the matcher has no instrument for
it. (5) `failed_gates` is not the complete set of failed gates. Row 24 fails strike-exact and
settlement-index as well, yet records only `['close-time']`, and the below-threshold rows record
only `['candidate-threshold']` despite enormous strike gaps. A reader cannot reconstruct a class
from that field. Separately, the Markdown's Kalshi title column reads "Bitcoin price on Aug 19,
2026?" for every BTC row, which states no hour at all; a human skimming the table has no way to see
the measurement instant without decoding the ticker suffix, and the Ethereum rows do carry the hour
in the title, so the presentation is inconsistent in exactly the column an adjudicator leans on.

## Three sharpest observations

**1. Nothing in the emitted book is index-identical, so the book contains no risk-free pair, and
the false-match rate is undefined until the artifact declares which standard it publishes against.**
All 986 scored records, emitted and withheld alike, have `settlement_agreement: different` and a
settlement component of exactly 0; all 72 emitted pairs are Binance against CF Benchmarks BRTI.
Binance BTCUSDT and BRTI (a multi-venue USD composite) differ routinely by tens of dollars once the
USDT peg and venue spread are counted, against Kalshi rungs 100 dollars apart and Polymarket rungs
200 dollars apart. Near the money that is a materially non-zero chance the two indices sit on
opposite sides of the same strike. The artifact discloses this in every caveat, which is why my
headline is 0/6 rather than 6/6, but the honest summary is that the emitted book is a book of
basis trades, not arbitrage, and one number cannot express that.

**2. The audit does not stratify on the thing it is measuring.** The claim under test concerns 72
emitted pairs; the sample frame is five score bands, so the emitted class is reached only
incidentally and yields n = 6, a Wilson upper bound of 0.390, and no publishable rate. Meanwhile 10
of the 42 rows were spent on a below-threshold stratum where a genuine match is arithmetically
impossible: with the reconstructed weights, a pair agreeing on close time, relation and strike
scores at least 0.45 + 0.30 = 0.75, so nothing equivalent can score under 0.60 once both legs
parsed. I confirmed this empirically, finding zero pairs anywhere below 0.60 with matched instant,
matched relation and strike distance under 5e-04. The below-threshold stratum can only detect
scoring-model recall failures, which cannot exist, and is blind to the recall failures that can:
`ANALYSIS.md` records 3,893 Polymarket and 4,000 Kalshi markets dropped before scoring as
unknown-entity and 471 Polymarket markets eligible to score against only 72 that reach the retained
set. Spending the sample budget on `equivalence_class` strata plus a parse-failure stratum drawn
from the dropped and sub-0.45 populations would put the same 42 rows where the real uncertainty is.

**3. The score is doing much less work than the strata imply, and the near-equivalent boundary is
untested by this run.** Relation contributes a flat 0.25 to all 986 records (every pair is
above-against-above) and settlement a flat 0 to all 986, so 40 percent of the weight is constant:
every pair starts at 0.25 regardless of merit, and a pair whose strikes are 21.6 percent apart
still scores 0.483 (row 33). Class is assigned by gates, not by score, and the gates leave a hole.
At equal close times the book contains near-equivalent pairs up to strike distance 5e-06 and
related pairs from 1.495e-03, with nothing in between, so the boundary is unexercised. The 16 pairs
that did pass strike-tolerance carrying a real 50 dollar strike gap were every one of them the
17:00 ET Kalshi series, withheld by close-time rather than by strike (row 24 is the sampled
example). If a same-hour Kalshi rung 50 dollars from a Polymarket strike ever lists, this run gives
no evidence about which class it would land in, and the strike-tolerance gate on its own would let
it through.

## Human-escalation rows

- **The 6 emitted rows as a block (rows 25 to 30, and by extension all 72).** Not because any
  individual pair is wrong, but because the Standard A against Standard B choice moves the
  published rate from 0 percent to 100 percent and is a judgement about what the artifact is
  claiming, not a finding. A human owner should fix the standard in writing before any rate ships.
- **Row 24, `polymarket:3720403|kalshi:KXBTCD-26AUG1917-T63749.99`.** The only sampled pair with a
  real strike gap that passed strike-tolerance. It is correctly withheld here, but it is the probe
  showing the gate ordering, and its `failed_gates` under-reports why.
- **Row 23, `polymarket:3720424|kalshi:KXETHD-26AUG1910-T1844.99`.** The tightest same-instant
  rejection in the sample (one 5 dollar ETH rung). Worth a human eye purely as confirmation that
  the tolerance is set where the owner intends.

## Addendum: comparison against round 1 (written only after the verdicts above)

Round 1 (`adjudication-2026-08-19.md`) adjudicated a different book: 34 pairs, 1,160 records,
144 emitted, ceiling 0.8330. This round covers 42 pairs, 986 records, 72 emitted, ceiling 0.795450.
The two rounds are therefore a before-and-after on the same rig, not a replication, and the rates
are not directly comparable as estimates of one population.

**Round 1's central finding is refuted by census, and the fix it prescribed is the fix that landed.**
Round 1 found 5 of 8 emitted pairs false (rate 0.625, Wilson [0.306, 0.863]) and corroborated it by
census: 144 emitted pairs of which 72 carried a one-hour instant mismatch, with every one of the 72
distinct Polymarket markets emitted against exactly 2 Kalshi contracts (degree distribution {2: 72}).
I checked the same two properties on the regenerated book before reading any of that, and both are
gone. All 72 emitted pairs have `close_delta_ms` of exactly 0. The emitted book is one-to-one: 72
distinct Polymarket markets against 72 distinct Kalshi markets, no market on either side appearing
twice. The wrong-hour twin defect is eliminated at 100 percent, not reduced, and the book shrank
from 144 to 72 by dropping exactly the twins.

**What changed is the gate, not the score.** Round 1 recommended "a hard equality constraint on the
measurement instant, not a smooth penalty". The scoring function is byte-identical between rounds:
I recovered close_time 0.20, strike 0.30, relation 0.25, settlement 0.15, title 0.10 with
`close_time = 1 - |delta|/24h`, matching round 1's least-squares recovery exactly, and a one-hour
miss still costs only 0.008333 of score. Rows 31 and 32 of my sample are the proof that the gate
now binds independently of the score: identical strikes after bridging, one hour apart, scoring
0.787 and 0.775, and both withheld as `related` with `close-time` in `failed_gates`. Under round 1's
book those two would have been emitted. This is the cleaner outcome, since it fixes the defect
without pretending the smooth close-time term was ever a sensible instrument.

**Round 1's second and third findings also landed, one fully and one partly.** The 2-to-1 mapping is
resolved (degree {1: 72}). The canonicalizer bug is resolved: round 1 reported `settlement_index`
`unknown` on the Kalshi side of all 1,160 records despite the evidence tokens naming CF Benchmarks
and BRTI, and every Kalshi record in this book now reads `cf-benchmarks-brti` with
`settlement_agreement: different` and the component scoring 0 rather than a spurious 0.25. The
ceiling critique landed only partly. Round 1 objected that the frame advertised an unreachable
`above-0.90` stratum; the frame is now four equal-width bands over [0.600, `attainable_ceiling`],
with the ceiling recorded, which is a real improvement. But the ceiling is still never explained in
the Markdown, and it now equals 0.45 + 0.30 + 0.10 x 0.454545, meaning it bakes in the maximum
*observed* title Jaccard as well as the settlement zero. It is descriptive of this run rather than
derived, and a reader still cannot tell that from the artifact.

**Where I diverge from round 1.** On the settlement basis we independently reached the same posture:
round 1 recorded it as "residual risk on the three true matches rather than grounds to fail them",
which is my Standard A. Two adjudicators converging on the same reading is mild evidence it is the
natural one, but neither of us was told which standard the artifact publishes against, and I have
promoted that to the top escalation rather than leaving it implicit. I also raise five things round 1
did not: that `failed_gates` is not the complete set of failed gates and therefore cannot be used to
reconstruct a class; that the matcher has no relation-shape dimension, so a one-touch leg paired
against a digital leg would score as relation-equal; that the below-threshold stratum is
arithmetically incapable of surfacing a recall miss, since any pair agreeing on instant, relation and
strike scores at least 0.75; that the near-equivalent gate boundary is unexercised, with no
same-close-time pair anywhere between strike distance 5e-06 and 1.495e-03; and that the audit's own
sample frame has got weaker for the quantity it measures even as the book improved. That last point
is the one I would put in front of a human alongside the good news: round 1 drew n = 8 emitted pairs
because its top stratum happened to be entirely `near-equivalent`, whereas this round's top stratum
is half `related`, so only n = 6 emitted pairs were drawn from a 72-pair population. The book got
better and the instrument measuring it got blunter.

**Conclusion of the comparison.** Round 1's refutation was correct, specific and actionable, and the
regenerated book fixes every defect it named, verified here by census rather than by sample. I find
no false match in the emitted stratum under the artifact's own declared semantics. That is a genuine
improvement and should be reported as one. It is not, however, a licence to publish a low
false-match rate: 0/6 supports only [0.000, 0.390], the remaining non-equivalence (Binance against
CF Benchmarks BRTI) is real rather than theoretical and is present in all 72 emitted pairs, and the
gate that now does all the work has an untested boundary. The right next step is to adjudicate the
full 72-pair emitted book, which is small enough to census, instead of sampling 6 of it.


---

# CENSUS EXTENSION: all 72 emitted pairs

Added after the 42-row sample above, on the same artifact version (run `97946cfda9a9`, book unchanged),
at the orchestrator's instruction and under the orchestrator's Standard A ruling: the dataset claims
same underlying, same threshold (cent-normalized), same measurement instant, different settlement
observables, with the caveat mandatory on every quoted match. A FALSE_MATCH is therefore an emitted
pair that can resolve differently for a reason the artifact does not disclose.

## Headline

**72 of 72 emitted pairs are FALSE_MATCH. Census rate 1.000, Wilson 95 percent interval [0.949, 1.000].**

This reverses the sample result above, and it reverses it on evidence the sample could not see. The
reversal is not caused by the matcher choosing wrong markets. On every mechanical and selection test
the book is flawless. It is caused by the venues' own resolution rules, which live in the committed
corpus and which the match records do not carry.

## What the census verified first (all clean)

Fourteen book-wide invariants recomputed over `matches.jsonl`, all holding for all 72: `close_delta_ms`
is 0 and both legs' `close_ms` are equal; the Polymarket floor equals the Kalshi floor plus exactly
0.01; both bounds exclusive; both relations `above`; both caps null; `relation_equal` true; exactly one
caveat, the settlement-basis one; `settlement_agreement` `different`; indices `binance` and
`cf-benchmarks-brti`; entity resolved on both legs; one-to-one on both sides; `failed_gates` uniformly
`['strike-exact', 'settlement-index']`.

Eight independent cross-field checks per row, 576 checks in total, **zero inconsistencies**: Polymarket
title strike against parsed floor; title asset against entity; title hour against `close_ms` decoded to
ET; the Polymarket URL slug as a third independent source for strike, asset, hour and day; the Kalshi
ticker decoded for asset, strike, date and hour against `close_ms`; the Kalshi subtitle against both
floor plus 0.01 and the Polymarket strike; the Kalshi Ethereum title hour against ticker and against
the Polymarket hour; and both legs' evidence strings against their own recorded numbers.

Selection quality, checked against the full same-instant candidate space (189 to 301 Kalshi candidates
per Polymarket market): **every one of the 72 is the mutual nearest match at its instant, with no ties
in either direction.** The nearest runner-up is 5 dollars away on Ethereum and 100 dollars on Bitcoin,
against an emitted gap of one cent. The emitted book is a complete regular lattice: Bitcoin 20 strikes
at 09:00 ET and 20 at 10:00 ET on a 200 dollar grid, Ethereum 16 and 16 on a 10 dollar grid.

Recall on this family is **100 percent**. The captured Polymarket corpus contains exactly 72 hourly
"above" markets for 2026-08-19 (20/20/16/16, matching the emitted split), and all 72 are matched. I had
noticed each of the four ladders was missing exactly one rung and hypothesised those were the four
`ambiguous-entity` drops that `ANALYSIS.md` reports; that hypothesis is **refuted**, the rungs are simply
not in the capture. No genuine match was missed.

## What the census found

`markets/polymarket/2026-08-19.jsonl` and `markets/kalshi/2026-08-19.jsonl` carry full
`resolution.rules_text` for every market, with digests. Uniform across all 72 pairs (2 distinct
Polymarket rule digests, one per asset; 72 distinct Kalshi digests differing only in strike and hour):

> **Polymarket:** "This market will resolve to \"Yes\" if the \"Close\" price for the BTC/USDT 1 hour
> candle that ends on the time and date specified in the title is **higher than** the price specified in
> the title." Resolution source Binance BTC/USDT (ETH/USDT for the Ethereum ladder), explicitly "not
> according to other exchanges or trading pairs".

> **Kalshi:** "If the **simple average of the sixty seconds** of CF Benchmarks' Bitcoin Real-Time Index
> (BRTI) **before 9 AM EDT** is above 62599.99 at 9 AM EDT on Aug 19, 2026, then the market resolves to
> Yes." Secondary: "At the last minute before expiration, 60 RTI prices are collected. The official and
> final value is the average of these prices."

**The two legs do not measure the same thing at the same moment. Polymarket takes a single point, the
last trade price of the one-hour candle ending at the stated hour. Kalshi takes a 60-second arithmetic
mean over the minute preceding that hour.** These are different functionals over different windows.
Even if the two indices were byte-identical, the pair could resolve oppositely whenever the final minute
moves, and the divergence is signed rather than mean-zero: in a trending or spiking last minute the
mean of the preceding sixty seconds sits systematically behind the terminal print. For Bitcoin near
65,000 dollars, one minute of movement is routinely tens of dollars against Kalshi rungs 100 dollars
apart, so this is comparable in magnitude to the index basis that is disclosed, and it stacks with it.

The artifact's caveat reads: "settlement basis differs (binance vs cf-benchmarks-brti): these are
different observables of the same asset, and near the strike they can resolve oppositely". That names
the index difference. It does not name the window difference, and a consumer pricing this book would
size for index basis while holding an additional, undisclosed timing exposure. Under the ruled standard,
which requires **same measurement instant** and discloses only settlement observables, all 72 fail.

This is the same axis on which round 1 refuted the previous book, and the same class of defect in a
subtler form. The round-2 fix made `close_delta_ms == 0` a hard gate, which is correct and necessary,
but `close_ms` equality is a statement about listed close timestamps, not about measurement instants.
The gate that now does all the work is enforcing the wrong quantity, and it cannot see the difference
because the field it would need was never carried into the match record.

## Secondary findings

**The evidence was available and was discarded.** My round-2 evidence-quality note said the Polymarket
bound was asserted from the title word "above" with no rule text quoted. The rule text exists in the
committed corpus, under `resolution.rules_text` with a `rules_digest` and `source_urls`, and the matcher
reduced it to `settlement_evidence: ["text:binance", "url:binance.com"]`. This is the same failure mode
round 1 found in the canonicalizer, which was dropping the CF Benchmarks and BRTI tokens the extractor
had already found. Propagating a rule digest plus the settlement functional into `t3.match.v1` would
have surfaced this defect automatically instead of requiring an adjudicator to open the corpus.

**The Polymarket bound is confirmed exclusive, so the one-tick divergence is now evidenced rather than
inferred.** "Higher than the price specified in the title" is strict, against Kalshi's "or above". My
sample-section flag on that point stands and is no longer speculative.

**The cent-bridging note is not valid on the Kalshi side.** The evidence string asserts "exclusive floor
62599.99 == inclusive 62600 at 0.01". That holds only if the settled value lies on a 0.01 grid. Kalshi's
settled value is the mean of sixty prints, so it lies on a grid of one sixtieth of a cent, and the
interval (62599.99, 62600.00) is not empty for Kalshi. The economic weight of this is negligible; the
point is that the artifact states a bridging identity more confidently than its own source rules
support.

**Denomination.** Polymarket settles in USDT on a single venue and explicitly excludes other pairs and
exchanges; Kalshi settles on a USD composite. The caveat names both indices, so this is arguably within
what is disclosed, but "different observables of the same asset" understates a quote-currency difference.

**Checked and clean:** Kalshi's `expected_expiration_ms` is uniformly `close_ms` plus 300000 (five
minutes). That is settlement lag after the measurement, not a second measurement time, and the
artifact's use of `close_ms` as the time reference is right on that point.

## Census rate and interval

Denominator is the full emitted book, so this is a census and the interval reflects only the residual
uncertainty of treating these 72 as a draw. Wilson score interval, 95 percent, z = 1.959964:

```
n = 72 ;  z^2 = 3.841459 ;  z^2/n = 0.05335360 ;  z^2/(2n) = 0.02667680
1 + z^2/n = 1.05335360   ;  z^2/(4n^2) = 0.000185256 ;  sqrt(...) = 0.01361086

RULED STANDARD A (headline):  x = 72, p_hat = 1
  centre     = (1 + 0.02667680) / 1.05335360                        = 0.974674
  half-width = (1.959964 / 1.05335360) * 0.01361086                 = 0.025326
  false-match rate = 1.000,  Wilson 95% CI = [0.949, 1.000]

ALTERNATIVE READING (if "different observables" is held to cover the 60-second mean):
  x = 0, p_hat = 0  ->  rate = 0.000,  Wilson 95% CI = [0.000, 0.051]
```

The alternative reading is recorded because it is the only way the book publishes at 0 percent, and the
orchestrator, not the adjudicator, owns that call. My judgement is that it does not survive contact
with the rule text: a caveat that names two indices and attributes divergence to their difference does
not put a reader on notice that one venue averages the preceding minute.

## Supersession of the sample verdicts

The six emitted rows in the 42-row sample (rows 25 to 30) were adjudicated TRUE_MATCH on the evidence
recorded in the match records, which is the discipline the sample brief specified. The census brief
directed me to flag anomalies, which took me into the corpus, where the resolution rules overturn that
reading. **Those six verdicts are superseded by the census FALSE_MATCH verdicts for the same pair ids**
(`polymarket:3719543|kalshi:KXBTCD-26AUG1909-T65999.99`,
`polymarket:3719547|kalshi:KXBTCD-26AUG1909-T65199.99`,
`polymarket:3720397|kalshi:KXBTCD-26AUG1910-T65199.99`,
`polymarket:3719554|kalshi:KXBTCD-26AUG1909-T63599.99`,
`polymarket:3719558|kalshi:KXBTCD-26AUG1909-T62799.99`,
`polymarket:3719575|kalshi:KXETHD-26AUG1909-T1839.99`). The sample rows are left in place unedited so
the change of evidence base is legible rather than tidied away. The 36 non-emitted verdicts are
unaffected: every one of them fails on threshold or on listed instant before the settlement functional
is even reached.

The lesson is not that the sample was adjudicated carelessly. It is that **an audit restricted to the
artifact's own summary fields cannot detect a defect the summary fields omit.** The round-2 sample was
scoped to the match records, and within that scope its verdicts were correct. The defect was one level
down, in a file the sample brief did not point at.

## What would fix it

1. Carry the settlement functional into `t3.match.v1` as a first-class field (point-close against
   window-mean, with the window length), alongside a rule digest for each leg, and gate on it.
2. Rename or re-specify the close-time gate. `close_delta_ms == 0` should be understood as agreement of
   listed close timestamps, and a separate measurement-instant gate should compare functionals and
   windows.
3. Amend the caveat so it states the actual divergence mechanisms: different index, different quote
   currency, and different measurement window. The orchestrator's own framing sentence, that this is a
   book of basis trades and not arbitrage, is right and should be kept; it simply needs to name all
   three bases rather than one.
4. Until then, no false-match rate should be published for this book, and the emitted pairs should not
   be described as sharing a measurement instant.
