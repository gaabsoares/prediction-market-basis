# T3 match audit: independent adjudication

Run id: `97946cfda9a9`  ·  seed: `1153758879`  ·  sample: 34 pairs across 4 populated strata  ·  adjudicated 2026-08-19

Adjudicator: **independent adjudicator agent (same rig, different session, no part in matcher
construction); not a domain-licensed reviewer.** Verdicts are formed only from the evidence recorded
in `analysis/audit-sample.jsonl` (titles, subtitles, parsed strikes with bound/confidence/evidence
strings, close timestamps, settlement evidence tokens, resolvers) plus arithmetic over those fields.
No venue rule text, no price history, and no external lookup was used or available.

## Method notes (what I verified before judging)

Three checks were run over all 34 rows before any verdict was assigned, because every verdict below
turns on them:

1. **Close semantics are the measurement instant on both venues, not a trading artifact.** For all 34
   Polymarket rows the hour stated in the title ("9AM ET" / "10AM ET", and 2026-08-19 is EDT = UTC-4)
   equals `close_ms` exactly: 0 mismatches. For all 34 Kalshi rows the two-digit hour suffix in the
   ticker (`-26AUG19{09,10,17}-`) equals `close_ms` exactly: 0 mismatches. The 13 Kalshi ETH rows state
   the hour in the title itself ("at 9am EDT", "at 10am EDT", "at 5pm EDT") and agree with both, which
   independently validates reading the suffix as the hour on the BTC rows, whose titles omit it.
2. **The inclusive/exclusive bridge is arithmetically sound.** For all 34 Kalshi rows,
   `floor + 0.01` equals the dollar figure in the venue's own subtitle and every subtitle reads
   "or above": `T64399.99` -> `$64,400 or above`. The normalization `exclusive 64399.99 == inclusive
   64400 at 0.01` is therefore self-consistent with the venue's own words, and no pair in the sample
   fails or is rescued by it. It is not the failure mode here.
3. **Units are the same kind of quantity.** All 34 pairs are same-entity (BTC-BTC or ETH-ETH, verified
   against the ticker), all are USD-denominated levels, all are digital "level at an instant" claims.
   No one-touch ("reach X by") phrasing appears anywhere in the sample, so the one-touch-versus-digital
   failure mode is not exercised by these 34 rows.

## Verdicts

| # | pair | stratum | matcher | verdict | justification |
| --- | --- | --- | --- | --- | --- |
| 1 | `polymarket:3720395\|kalshi:KXBTCD-26AUG1910-T65899.99` | above-0.60 | related | **NOT_EQUIVALENT_BUT_RELATED** | Both sides measure at 2026-08-19T14:00Z, but Polymarket asks BTC > 65,600 while the Kalshi subtitle is '$65,900 or above'. A $300 gap is an order of magnitude wider than any plausible index basis, so a 65,700 print resolves Polymarket YES and Kalshi NO. |
| 2 | `polymarket:3719546\|kalshi:KXBTCD-26AUG1909-T65699.99` | above-0.60 | related | **NOT_EQUIVALENT_BUT_RELATED** | Same instant (both 13:00Z) and same direction, but the strikes are $300 apart: poly > 65,400 against Kalshi '$65,700 or above'. Not the same claim. |
| 3 | `polymarket:3720391\|kalshi:KXBTCD-26AUG1909-T66099.99` | above-0.60 | related | **NOT_EQUIVALENT_BUT_RELATED** | Two independent grounds: the strikes differ by $300 (poly > 66,400 vs Kalshi >= 66,100) and the measurement instants differ by an hour (poly 14:00Z, Kalshi ticker suffix 1909 closing 13:00Z). |
| 4 | `polymarket:3719571\|kalshi:KXETHD-26AUG1909-T1869.99` | above-0.60 | related | **NOT_EQUIVALENT_BUT_RELATED** | Same instant 13:00Z, but poly > 1,880 against Kalshi '$1,870 or above' is a $10 gap on ETH, roughly 0.5% of the level and wide enough to split resolution routinely. |
| 5 | `polymarket:3719564\|kalshi:KXETHD-26AUG1910-T1969.99` | above-0.60 | related | **NOT_EQUIVALENT_BUT_RELATED** | Strike differs by $10 and the hour differs: the Kalshi title itself says '10am EDT' (14:00Z) against Polymarket's '9AM ET' (13:00Z). |
| 6 | `polymarket:3720393\|kalshi:KXBTCD-26AUG1917-T65749.99` | above-0.60 | related | **NOT_EQUIVALENT_BUT_RELATED** | A $250 strike gap (poly > 66,000 vs Kalshi >= 65,750) plus a seven-hour horizon gap (14:00Z vs the 5pm EDT contract at 21:00Z). |
| 7 | `polymarket:3720403\|kalshi:KXBTCD-26AUG1909-T63399.99` | above-0.60 | related | **NOT_EQUIVALENT_BUT_RELATED** | A $400 strike gap (poly > 63,800 vs Kalshi >= 63,400) and a one-hour instant gap (14:00Z vs 13:00Z). |
| 8 | `polymarket:3720404\|kalshi:KXBTCD-26AUG1909-T63199.99` | above-0.60 | related | **NOT_EQUIVALENT_BUT_RELATED** | A $400 strike gap (poly > 63,600 vs Kalshi >= 63,200) and a one-hour instant gap (14:00Z vs 13:00Z). |
| 9 | `polymarket:3720407\|kalshi:KXBTCD-26AUG1910-T63099.99` | above-0.70 | related | **NOT_EQUIVALENT_BUT_RELATED** | Same instant 14:00Z and same direction, but poly > 63,000 against Kalshi '$63,100 or above' leaves the whole band [63,000.01, 63,100) resolving them oppositely. |
| 10 | `polymarket:3719558\|kalshi:KXBTCD-26AUG1909-T62899.99` | above-0.70 | related | **NOT_EQUIVALENT_BUT_RELATED** | Same instant 13:00Z; a $100 strike gap (poly > 62,800 vs Kalshi >= 62,900) is enough to break equivalence. |
| 11 | `polymarket:3719551\|kalshi:KXBTCD-26AUG1910-T64299.99` | above-0.70 | related | **NOT_EQUIVALENT_BUT_RELATED** | A $100 strike gap plus a one-hour instant gap (poly 13:00Z, Kalshi ticker 1910 at 14:00Z). |
| 12 | `polymarket:3719559\|kalshi:KXBTCD-26AUG1910-T62699.99` | above-0.70 | related | **NOT_EQUIVALENT_BUT_RELATED** | A $100 strike gap plus a one-hour instant gap (poly 13:00Z, Kalshi ticker 1910 at 14:00Z). |
| 13 | `polymarket:3720420\|kalshi:KXETHD-26AUG1917-T1889.99` | above-0.70 | related | **NOT_EQUIVALENT_BUT_RELATED** | The strikes are identical after bridging (poly > 1,890; Kalshi floor 1,889.99 = '$1,890 or above'), but the Kalshi title states 5pm EDT (21:00Z) against Polymarket's 10AM ET (14:00Z). Correctly withheld, though note it was withheld only because seven hours cost 0.058 of score; the identical defect at one hour costs 0.008 and is emitted at rows 20 to 24. |
| 14 | `polymarket:3719545\|kalshi:KXBTCD-26AUG1909-T65799.99` | above-0.70 | related | **NOT_EQUIVALENT_BUT_RELATED** | Same instant 13:00Z, $200 strike gap (poly > 65,600 vs Kalshi >= 65,800). |
| 15 | `polymarket:3719572\|kalshi:KXETHD-26AUG1910-T1874.99` | above-0.70 | related | **NOT_EQUIVALENT_BUT_RELATED** | A $5 ETH strike gap (poly > 1,870 vs Kalshi '$1,875 or above') plus a one-hour instant gap, the Kalshi title reading '10am EDT' against Polymarket's 9AM ET. |
| 16 | `polymarket:3720407\|kalshi:KXBTCD-26AUG1909-T63199.99` | above-0.70 | related | **NOT_EQUIVALENT_BUT_RELATED** | A $200 strike gap plus a one-hour instant gap. The same Polymarket market 3720407 also appears at row 9 against the 10AM Kalshi contract, so at most one of the two pairings could ever be equivalent. |
| 17 | `polymarket:3719550\|kalshi:KXBTCD-26AUG1909-T64399.99` | above-0.80 | near-equivalent | **TRUE_MATCH** | Same asset, same instant (both 13:00Z; Kalshi ticker suffix 1909 = 9am EDT), same direction, and the strikes coincide after bridging: poly > 64,400 against Kalshi floor 64,399.99 whose own subtitle reads '$64,400 or above'. Residual risk is settlement basis (Polymarket on Binance BTCUSDT vs Kalshi evidence naming CF Benchmarks BRTI and Coinbase) and the knife-edge at exactly 64,400.00 where Polymarket's strict '>' and Kalshi's '>=' disagree. |
| 18 | `polymarket:3720416\|kalshi:KXETHD-26AUG1910-T1939.99` | above-0.80 | near-equivalent | **TRUE_MATCH** | Both titles state 10am on 2026-08-19 and both close at 14:00Z; poly > 1,940 and Kalshi floor 1,939.99 = '$1,940 or above' are the same threshold at cent quantum. Equivalent up to the index basis (Binance ETHUSDT vs CF Benchmarks/Coinbase), which the matcher records as settlement_agreement 'unknown'. |
| 19 | `polymarket:3720418\|kalshi:KXETHD-26AUG1910-T1909.99` | above-0.80 | near-equivalent | **TRUE_MATCH** | Both at 14:00Z with both titles agreeing on 10am, poly > 1,910 against Kalshi '$1,910 or above'. Same claim up to the settlement-index basis and the strict-versus-inclusive knife edge at 1,910.00. |
| 20 | `polymarket:3720389\|kalshi:KXBTCD-26AUG1909-T66799.99` | above-0.80 | near-equivalent | **FALSE_MATCH** | The strike agrees exactly ($66,800), but Polymarket measures at 10AM ET (14:00Z) while this Kalshi contract is the 9am one (ticker suffix 1909, close 13:00Z). BTC at 9am and BTC at 10am are different random variables, and one hour of BTC variation is comparable to the $200 Polymarket strike spacing, so the same world-state resolves these differently a large fraction of the time near the money. |
| 21 | `polymarket:3719541\|kalshi:KXBTCD-26AUG1910-T66399.99` | above-0.80 | near-equivalent | **FALSE_MATCH** | Strike $66,400 agrees, but Polymarket is the 9AM ET contract (13:00Z) and Kalshi is the 10 contract (14:00Z). The matcher itself listed 'close-time' in failed_gates and emitted the pair as near-equivalent anyway. |
| 22 | `polymarket:3719549\|kalshi:KXBTCD-26AUG1910-T64799.99` | above-0.80 | near-equivalent | **FALSE_MATCH** | Same defect: strike $64,800 agrees, instants are 13:00Z (Polymarket 9AM ET) against 14:00Z (Kalshi ticker 1910). Different measurement instants means different claims. |
| 23 | `polymarket:3720401\|kalshi:KXBTCD-26AUG1909-T64199.99` | above-0.80 | near-equivalent | **FALSE_MATCH** | Strike $64,200 agrees, instants are 14:00Z (Polymarket 10AM ET) against 13:00Z (Kalshi ticker 1909). Not the same claim. |
| 24 | `polymarket:3720419\|kalshi:KXETHD-26AUG1909-T1899.99` | above-0.80 | near-equivalent | **FALSE_MATCH** | The cleanest case in the sample: the two recorded titles state different hours outright, Polymarket 'Ethereum above 1,900 on August 19, 10AM ET' (14:00Z) against Kalshi 'Ethereum price at Aug 19, 2026 at 9am EDT' (13:00Z). No inference from ticker suffixes is needed, and the pair was still emitted as near-equivalent at 0.812. |
| 25 | `polymarket:3719563\|kalshi:KXETHD-26AUG1909-T1234.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 1,970 against Kalshi >= 1,235 at the same 13:00Z instant, a $735 gap. Correctly rejected; no recall miss. |
| 26 | `polymarket:3719568\|kalshi:KXETHD-26AUG1909-T2474.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 1,910 against Kalshi >= 2,475 at the same instant, a $565 gap. Correctly rejected. |
| 27 | `polymarket:3719575\|kalshi:KXETHD-26AUG1909-T2179.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 1,840 against Kalshi >= 2,180 at the same instant, a $340 gap. Correctly rejected. |
| 28 | `polymarket:3720415\|kalshi:KXETHD-26AUG1910-T2134.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 1,950 against Kalshi >= 2,135 at 14:00Z, a $185 gap. Correctly rejected. |
| 29 | `polymarket:3720420\|kalshi:KXETHD-26AUG1910-T1519.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 1,890 against Kalshi >= 1,520 at 14:00Z, a $370 gap. Correctly rejected. The same Polymarket market appears at row 13 paired to a correctly struck but wrong-hour contract. |
| 30 | `polymarket:3720390\|kalshi:KXBTCD-26AUG1909-T58599.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 66,600 at 14:00Z against Kalshi >= 58,600 at 13:00Z: an $8,000 strike gap and an hour gap. Correctly rejected. |
| 31 | `polymarket:3719550\|kalshi:KXBTCD-26AUG1909-T72699.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 64,400 against Kalshi >= 72,700 at the same 13:00Z instant, an $8,300 gap. Correctly rejected. The correctly struck counterpart of this Polymarket market is row 17, which I judged a true match. |
| 32 | `polymarket:3720406\|kalshi:KXBTCD-26AUG1910-T66799.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 63,200 against Kalshi >= 66,800 at 14:00Z, a $3,600 gap. Correctly rejected. |
| 33 | `polymarket:3720424\|kalshi:KXETHD-26AUG1909-T1104.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 1,850 at 14:00Z against Kalshi >= 1,105 at 13:00Z: a $745 gap plus an hour gap. Correctly rejected. |
| 34 | `polymarket:3720390\|kalshi:KXBTCD-26AUG1917-T57749.99` | below-threshold | rejected | **NOT_EQUIVALENT_BUT_RELATED** | poly > 66,600 at 14:00Z against Kalshi >= 57,750 at 21:00Z: an $8,850 gap and a seven-hour gap. Correctly rejected. |

## Per-stratum tallies

| stratum | matcher class | TRUE_MATCH | FALSE_MATCH | NOT_EQUIV_BUT_RELATED | INSUFFICIENT_EVIDENCE | n |
| --- | --- | --- | --- | --- | --- | --- |
| above-0.60 | related | 0 | 0 | 8 | 0 | 8 |
| above-0.70 | related | 0 | 0 | 8 | 0 | 8 |
| above-0.80 | near-equivalent | 3 | 5 | 0 | 0 | 8 |
| below-threshold | rejected | 0 | 0 | 10 | 0 | 10 |
| **all** |  | **3** | **5** | **26** | **0** | **34** |

Agreement with the matcher, read stratum by stratum:

- **above-0.60 and above-0.70 (16 pairs, all classed `related`):** I agree with all 16. None is a
  genuine equivalence the matcher under-called, so there is no evidence of lost recall in the
  candidate bands. Every one fails on strike, on instant, or on both.
- **above-0.80 (8 pairs, all classed `near-equivalent`, the emitted book):** 3 upheld, **5 false**.
- **below-threshold (10 pairs, all `rejected`):** all 10 rejections upheld. Strike gaps run from $185
  to $8,850 against levels of roughly $1,900 (ETH) and $64,000 (BTC). **No recall miss found.**

## False-match rate, emitted (near-equivalent) stratum

Denominator is the emitted-match class only. `related` pairs are not claims of equivalence, so a
`related` pair that is genuinely non-equivalent is a correct call, not a false match.

```
x  = 5 false matches   (rows 20, 21, 22, 23, 24)
n  = 8 adjudicated near-equivalent pairs
p  = x/n = 0.6250
z  = 1.96          z^2 = 3.8416     z^2/n = 0.4802     z^2/2n = 0.2401

Wilson score interval
  center = (p + z^2/2n) / (1 + z^2/n)
         = (0.6250 + 0.2401) / 1.4802
         = 0.5844
  half   = z/(1 + z^2/n) * sqrt( p(1-p)/n + z^2/4n^2 )
         = 1.9600/1.4802 * sqrt( 0.029297 + 0.015006 )
         = 1.3241 * 0.210483
         = 0.2787

  false-match rate = 0.625,  Wilson 95% CI = [0.306, 0.863]
```

The stratum sample is 8 of a 144-pair emitted population, so the finite-population correction
(f = 8/144 = 5.6%) is negligible and is not applied.

### Census corroboration (this rate is not a sampling artifact)

The interval above is wide because n is 8. It does not need to be. The same defect is directly
countable in `analysis/matches.jsonl`, which holds the whole emitted book:

- `near-equivalent` emitted: **144** pairs (plus 1016 `related`).
- Their `close_delta_ms` takes exactly two values: **0 h for 72 pairs and 1 h for 72 pairs**.
  That is **50.0% of the emitted book carrying a one-hour instant mismatch**, by census.
- The emitted book contains **72 distinct Polymarket markets** and every single one of them is emitted
  against **exactly 2** Kalshi markets (degree distribution: {2: 72}): the same strike at the right hour,
  and the same strike one hour off. Example, poly `3720389` ("Bitcoin above 66,800 on August 19, 10AM
  ET") is emitted against both `KXBTCD-26AUG1910-T66799.99` (delta 0 h, score 0.833) and
  `KXBTCD-26AUG1909-T66799.99` (delta 1 h, score 0.825).

So the sampled 5/8 = 0.625 and the census 72/144 = 0.500 are the same finding, and 0.500 sits well
inside the Wilson interval. **The emitted book is exactly 2x inflated: every genuine match ships with
a wrong-hour twin.** I report the commissioned sample-based rate as the headline because that is what
was adjudicated pair by pair, but the census is the tighter and more useful number.

## Matcher evidence quality

The recorded evidence was sufficient to adjudicate every one of the 34 pairs; I did not need a single
INSUFFICIENT_EVIDENCE verdict, and that is a real credit to the artifact. The decisive fields were
machine-checkable and mutually corroborating: `close_ms` on both sides, the Kalshi ticker hour suffix,
the Kalshi `subtitle` carrying the venue's own words for the threshold ("$64,400 or above"), and the
strike `evidence` strings that show the parse and the bridging arithmetic inline rather than asserting
a result. Recording both the raw floor and the derivation (`strike_type=greater floor=65899.99 ... |
exclusive floor 65899.99 == inclusive 65900 at 0.01`) is what let me re-verify the bridge by hand on
all 34 rows in one pass instead of trusting it. Keeping `failed_gates` on emitted rows is likewise
honest: the matcher wrote down that `close-time` failed on the very pairs I am calling false, so the
artifact indicts itself, which is exactly what an audit trail should do.

Three gaps are worth fixing. First, **no rule text is captured anywhere in the sample** (no
`rules_primary`, no resolution-source sentence), so `settlement_evidence` is a bag of matched tokens
(`text:brti`, `text:cf benchmarks`, `text:coinbase`, `url:binance.com`) rather than a statement of how
each market resolves. That is enough to see that the two indices differ but not enough to adjudicate
the sub-minute question, namely whether Polymarket reads a Binance one-minute candle close while Kalshi
reads a spot index at the top of the hour. I flagged that as residual risk on the three true matches
rather than as grounds to fail them, but with rule text it would be a decidable question instead of a
caveat. Second, **`settlement_index` is `unknown` for the Kalshi side on all 1,160 records in the run**
even though the evidence tokens name CF Benchmarks and BRTI explicitly; the canonicalizer is dropping
information the extractor already found. Third, the Kalshi BTC titles ("Bitcoin price on Aug 19,
2026?") omit the hour that the ETH titles state, so on BTC rows the instant lives only in the ticker
and `close_ms`. Those agree, so nothing is lost here, but a reviewer skimming titles alone would
mis-adjudicate every BTC row in the sample.

## Three sharpest observations

### 1. The close-time similarity is scored on a 24-hour scale for markets whose entire life is one hour

Least squares over the 34 rows recovers the scorer exactly (max residual 6e-7):

```
score = 0.20*close_time + 0.30*strike + 0.25*relation + 0.15*settlement + 0.10*title
close_time = 1 - |delta| / 24h      ->  1 h apart scores 0.958333, 7 h apart scores 0.708333
```

A full one-hour miss on a market that measures an instantaneous price at a stated hour therefore costs
**0.0083 of score**, under one percent. That is the entire mechanism behind the 72 bad emissions: a
wrong-hour pair scores 0.825 and a perfect pair scores 0.833, so both land in the same
`near-equivalent` band. The 7-hour pairs (rows 13 and 6) were withheld only because 0.058 happened to
be enough to drop them under 0.80, which is luck, not a gate. The matcher already computes
`close_delta_ms` and already writes `close-time` into `failed_gates`; it simply does not let that gate
gate. For intraday instant-settled markets the correct treatment is a hard equality constraint on the
measurement instant, not a smooth penalty, and the fix removes 100% of the false matches in this run.

### 2. The matcher emits a 2-to-1 mapping it could have detected as self-inconsistent with no domain knowledge

Every one of the 72 distinct Polymarket markets in the emitted book is matched to exactly 2 Kalshi
markets. Those two Kalshi contracts are distinct tradeable markets that can and do resolve differently
from each other, so at most one can be equivalent to the Polymarket leg. No price data, no rule text
and no venue expertise is needed to see this: it is a pure consistency property of the output, and a
one-line argmax-per-Polymarket-market (or a mutual-best-match constraint) would have caught all 72.
This matters beyond the rate itself: a downstream consumer that sizes on the emitted book would double
count every opportunity and would take the wrong leg roughly half the time it picked one.

### 3. The empty `above-0.90` stratum is unreachable by construction, and reads as reassurance it has not earned

With `relation` pinned at 1.0 and `settlement` pinned at 0.25 for all 1,160 records, 0.2875 of every
score is a constant that carries no discriminating information. The arithmetic ceiling is
`0.20 + 0.30 + 0.25 + 0.15*0.25 + 0.10 = 0.8875` with a perfect title, and since the best title
Jaccard observed anywhere is 0.4545 (the venues word their titles differently by design), the
attainable ceiling is **0.8330**. The highest score in the whole 36,858-pair run is 0.8329. So the
sampling frame's "above-0.90: population 0, drawn 0" is not the finding it appears to be; that band
cannot be occupied, and a reader is invited to conclude "no near-certain matches exist" when the truth
is "the scale stops at 0.833". The same constant offset also inflates every score toward the 0.60 and
0.80 cutoffs, so the thresholds are not calibrated to what they look like: an effective 0.80 cut is a
0.5125 cut on the 0.60-weight discriminating portion. Publish the reachable range next to the frame,
and drop or fix the two dead dimensions.

## Escalation to a human

**Escalate row 24, `polymarket:3720419|kalshi:KXETHD-26AUG1909-T1899.99`.** It is the one pair where no
inference is required to see the defect: the two recorded titles state different hours in plain
language ("August 19, 10AM ET" against "Aug 19, 2026 at 9am EDT"), and it was still emitted as
near-equivalent at 0.812. If a human wants one artifact to decide whether the emitted book is fit for
any downstream use, that row is it, and it can be checked in ten seconds without reading this file.

**Also escalate the disposition question the census raises,** which is a judgment call above an
adjudicator's remit: 72 of 144 emitted matches are wrong-hour twins, so the emitted book should be
treated as unusable until the instant gate is hard, rather than filtered after the fact. Whether the pipeline
re-runs before anything consumes it is the project owner's call.
