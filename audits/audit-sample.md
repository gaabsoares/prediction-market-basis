# T3 match audit sample

Run id: `97946cfda9a9`  ·  seed: `1153758879`  ·  scored pairs retained: 34594

Adjudicate the CLASS COLUMN FIRST, from the two markets' rule text, close times and settlement
sources, before looking at the score columns. The sample is reproducible: the same run id and the
same scored pairs redraw exactly these rows.

Record verdicts in `analysis/adjudications.jsonl` as `t3.match-adjudication.v1` records
(`run_id`, `pair_id`, `adjudicator`, `equivalence_class`, `reason`). Until that file exists the
published false-match rate is "no adjudicated sample", which is the honest state, not a zero.

## Sampling frame

The strata PARTITION the retained set: every retained pair is counted in exactly one, and the
populations below sum to the retained total. `class:` strata hold the emitted book; the score
bands hold everything else above the threshold and therefore EXCLUDE the emitted classes
entirely, not merely the rows drawn from them.

| stratum | score band | population | drawn |
| --- | --- | --- | --- |
| class:basis-pair | [0.00, 1.00] | 72 | 12 |
| above-0.600 | [0.60, 0.65) | 336 | 8 |
| above-0.649 | [0.65, 0.70) | 258 | 8 |
| above-0.698 | [0.70, 0.75) | 248 | 8 |
| above-0.747 | [0.75, 0.80) | 72 | 8 |
| below-threshold | [0.45, 0.60) | 33608 | 10 |

## class:basis-pair

| verdict | pair | polymarket | kalshi | strike (poly / kalshi) | close (poly / kalshi) | settlement | matcher class | score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _____ | `polymarket:3719542|kalshi:KXBTCD-26AUG1909-T66199.99` | Bitcoin above 66,200 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 66200) [parsed] / above (floor 66199.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | basis-pair | 0.795 |
| _____ | `polymarket:3720397|kalshi:KXBTCD-26AUG1910-T65199.99` | Bitcoin above 65,200 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65200) [parsed] / above (floor 65199.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | basis-pair | 0.795 |
| _____ | `polymarket:3720401|kalshi:KXBTCD-26AUG1910-T64199.99` | Bitcoin above 64,200 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 64200) [parsed] / above (floor 64199.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | basis-pair | 0.795 |
| _____ | `polymarket:3719554|kalshi:KXBTCD-26AUG1909-T63599.99` | Bitcoin above 63,600 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63600) [parsed] / above (floor 63599.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | basis-pair | 0.795 |
| _____ | `polymarket:3720405|kalshi:KXBTCD-26AUG1910-T63399.99` | Bitcoin above 63,400 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63400) [parsed] / above (floor 63399.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | basis-pair | 0.795 |
| _____ | `polymarket:3719557|kalshi:KXBTCD-26AUG1909-T62999.99` | Bitcoin above 63,000 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63000) [parsed] / above (floor 62999.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | basis-pair | 0.795 |
| _____ | `polymarket:3719558|kalshi:KXBTCD-26AUG1909-T62799.99` | Bitcoin above 62,800 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 62800) [parsed] / above (floor 62799.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | basis-pair | 0.795 |
| _____ | `polymarket:3719562|kalshi:KXETHD-26AUG1909-T1979.99` | Ethereum above 1,980 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1980) [parsed] / above (floor 1979.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | basis-pair | 0.795 |
| _____ | `polymarket:3719564|kalshi:KXETHD-26AUG1909-T1959.99` | Ethereum above 1,960 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1960) [parsed] / above (floor 1959.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | basis-pair | 0.795 |
| _____ | `polymarket:3719570|kalshi:KXETHD-26AUG1909-T1889.99` | Ethereum above 1,890 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1890) [parsed] / above (floor 1889.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | basis-pair | 0.795 |
| _____ | `polymarket:3719572|kalshi:KXETHD-26AUG1909-T1869.99` | Ethereum above 1,870 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1870) [parsed] / above (floor 1869.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | basis-pair | 0.795 |
| _____ | `polymarket:3720422|kalshi:KXETHD-26AUG1910-T1869.99` | Ethereum above 1,870 on August 19, 10AM ET? | Ethereum price at Aug 19, 2026 at 10am EDT? | above (floor 1870) [parsed] / above (floor 1869.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-erti | basis-pair | 0.795 |

## above-0.600

| verdict | pair | polymarket | kalshi | strike (poly / kalshi) | close (poly / kalshi) | settlement | matcher class | score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _____ | `polymarket:3719544|kalshi:KXBTCD-26AUG1909-T66099.99` | Bitcoin above 65,800 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65800) [parsed] / above (floor 66099.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.637 |
| _____ | `polymarket:3720399|kalshi:KXBTCD-26AUG1909-T64299.99` | Bitcoin above 64,600 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 64600) [parsed] / above (floor 64299.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.636 |
| _____ | `polymarket:3720417|kalshi:KXETHD-26AUG1910-T1909.99` | Ethereum above 1,920 on August 19, 10AM ET? | Ethereum price at Aug 19, 2026 at 10am EDT? | above (floor 1920) [parsed] / above (floor 1909.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-erti | related | 0.627 |
| _____ | `polymarket:3720397|kalshi:KXBTCD-26AUG1909-T64899.99` | Bitcoin above 65,200 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65200) [parsed] / above (floor 64899.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.627 |
| _____ | `polymarket:3719562|kalshi:KXETHD-26AUG1910-T1969.99` | Ethereum above 1,980 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 10am EDT? | above (floor 1980) [parsed] / above (floor 1969.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-erti | related | 0.613 |
| _____ | `polymarket:3720421|kalshi:KXETHD-26AUG1909-T1869.99` | Ethereum above 1,880 on August 19, 10AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1880) [parsed] / above (floor 1869.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | related | 0.605 |
| _____ | `polymarket:3719573|kalshi:KXETHD-26AUG1910-T1849.99` | Ethereum above 1,860 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 10am EDT? | above (floor 1860) [parsed] / above (floor 1849.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-erti | related | 0.603 |
| _____ | `polymarket:3720395|kalshi:KXBTCD-26AUG1910-T65199.99` | Bitcoin above 65,600 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65600) [parsed] / above (floor 65199.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.600 |

## above-0.649

| verdict | pair | polymarket | kalshi | strike (poly / kalshi) | close (poly / kalshi) | settlement | matcher class | score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _____ | `polymarket:3720410|kalshi:KXETHD-26AUG1909-T1994.99` | Ethereum above 2,000 on August 19, 10AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 2000) [parsed] / above (floor 1994.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | related | 0.690 |
| _____ | `polymarket:3719554|kalshi:KXBTCD-26AUG1909-T63799.99` | Bitcoin above 63,600 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63600) [parsed] / above (floor 63799.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.689 |
| _____ | `polymarket:3720404|kalshi:KXBTCD-26AUG1910-T63799.99` | Bitcoin above 63,600 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63600) [parsed] / above (floor 63799.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.689 |
| _____ | `polymarket:3720406|kalshi:KXBTCD-26AUG1910-T63399.99` | Bitcoin above 63,200 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63200) [parsed] / above (floor 63399.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.689 |
| _____ | `polymarket:3720391|kalshi:KXBTCD-26AUG1909-T66199.99` | Bitcoin above 66,400 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 66400) [parsed] / above (floor 66199.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.685 |
| _____ | `polymarket:3720407|kalshi:KXBTCD-26AUG1909-T63199.99` | Bitcoin above 63,000 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63000) [parsed] / above (floor 63199.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.680 |
| _____ | `polymarket:3720408|kalshi:KXBTCD-26AUG1909-T62599.99` | Bitcoin above 62,800 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 62800) [parsed] / above (floor 62599.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.679 |
| _____ | `polymarket:3720405|kalshi:KXBTCD-26AUG1917-T63249.99` | Bitcoin above 63,400 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63400) [parsed] / above (floor 63249.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T21:00:00.000Z | binance / cf-benchmarks-brti | related | 0.654 |

## above-0.698

| verdict | pair | polymarket | kalshi | strike (poly / kalshi) | close (poly / kalshi) | settlement | matcher class | score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _____ | `polymarket:3720402|kalshi:KXBTCD-26AUG1910-T64099.99` | Bitcoin above 64,000 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 64000) [parsed] / above (floor 64099.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.737 |
| _____ | `polymarket:3719558|kalshi:KXBTCD-26AUG1909-T62699.99` | Bitcoin above 62,800 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 62800) [parsed] / above (floor 62699.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.736 |
| _____ | `polymarket:3719545|kalshi:KXBTCD-26AUG1910-T65699.99` | Bitcoin above 65,600 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65600) [parsed] / above (floor 65699.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.729 |
| _____ | `polymarket:3719547|kalshi:KXBTCD-26AUG1910-T65099.99` | Bitcoin above 65,200 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65200) [parsed] / above (floor 65099.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.729 |
| _____ | `polymarket:3719558|kalshi:KXBTCD-26AUG1910-T62899.99` | Bitcoin above 62,800 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 62800) [parsed] / above (floor 62899.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.727 |
| _____ | `polymarket:3719548|kalshi:KXBTCD-26AUG1909-T64899.99` | Bitcoin above 65,000 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65000) [parsed] / above (floor 64899.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.727 |
| _____ | `polymarket:3720420|kalshi:KXETHD-26AUG1910-T1884.99` | Ethereum above 1,890 on August 19, 10AM ET? | Ethereum price at Aug 19, 2026 at 10am EDT? | above (floor 1890) [parsed] / above (floor 1884.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-erti | related | 0.704 |
| _____ | `polymarket:3719572|kalshi:KXETHD-26AUG1909-T1874.99` | Ethereum above 1,870 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1870) [parsed] / above (floor 1874.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | related | 0.703 |

## above-0.747

| verdict | pair | polymarket | kalshi | strike (poly / kalshi) | close (poly / kalshi) | settlement | matcher class | score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _____ | `polymarket:3719546|kalshi:KXBTCD-26AUG1910-T65399.99` | Bitcoin above 65,400 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65400) [parsed] / above (floor 65399.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.787 |
| _____ | `polymarket:3720402|kalshi:KXBTCD-26AUG1909-T63999.99` | Bitcoin above 64,000 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 64000) [parsed] / above (floor 63999.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.787 |
| _____ | `polymarket:3720407|kalshi:KXBTCD-26AUG1909-T62999.99` | Bitcoin above 63,000 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63000) [parsed] / above (floor 62999.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | related | 0.787 |
| _____ | `polymarket:3719558|kalshi:KXBTCD-26AUG1910-T62799.99` | Bitcoin above 62,800 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 62800) [parsed] / above (floor 62799.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | related | 0.787 |
| _____ | `polymarket:3720409|kalshi:KXETHD-26AUG1909-T2009.99` | Ethereum above 2,010 on August 19, 10AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 2010) [parsed] / above (floor 2009.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | related | 0.775 |
| _____ | `polymarket:3719565|kalshi:KXETHD-26AUG1910-T1949.99` | Ethereum above 1,950 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 10am EDT? | above (floor 1950) [parsed] / above (floor 1949.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-erti | related | 0.775 |
| _____ | `polymarket:3719566|kalshi:KXETHD-26AUG1910-T1939.99` | Ethereum above 1,940 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 10am EDT? | above (floor 1940) [parsed] / above (floor 1939.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-erti | related | 0.775 |
| _____ | `polymarket:3719575|kalshi:KXETHD-26AUG1910-T1839.99` | Ethereum above 1,840 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 10am EDT? | above (floor 1840) [parsed] / above (floor 1839.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-erti | related | 0.775 |

## below-threshold

| verdict | pair | polymarket | kalshi | strike (poly / kalshi) | close (poly / kalshi) | settlement | matcher class | score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _____ | `polymarket:3719564|kalshi:KXETHD-26AUG1909-T1529.99` | Ethereum above 1,960 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1960) [parsed] / above (floor 1529.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | rejected | 0.483 |
| _____ | `polymarket:3719570|kalshi:KXETHD-26AUG1909-T1824.99` | Ethereum above 1,890 on August 19, 9AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1890) [parsed] / above (floor 1824.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | rejected | 0.483 |
| _____ | `polymarket:3719552|kalshi:KXBTCD-26AUG1910-T54999.99` | Bitcoin above 64,000 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 64000) [parsed] / above (floor 54999.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | rejected | 0.475 |
| _____ | `polymarket:3719542|kalshi:KXBTCD-26AUG1909-T59399.99` | Bitcoin above 66,200 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 66200) [parsed] / above (floor 59399.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | rejected | 0.473 |
| _____ | `polymarket:3719547|kalshi:KXBTCD-26AUG1909-T69999.99` | Bitcoin above 65,200 on August 19, 9AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 65200) [parsed] / above (floor 69999.99) [structural] | 2026-08-19T13:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | rejected | 0.473 |
| _____ | `polymarket:3720401|kalshi:KXBTCD-26AUG1910-T58999.99` | Bitcoin above 64,200 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 64200) [parsed] / above (floor 58999.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T14:00:00.000Z | binance / cf-benchmarks-brti | rejected | 0.473 |
| _____ | `polymarket:3720391|kalshi:KXBTCD-26AUG1909-T60299.99` | Bitcoin above 66,400 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 66400) [parsed] / above (floor 60299.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | rejected | 0.465 |
| _____ | `polymarket:3720403|kalshi:KXBTCD-26AUG1909-T68599.99` | Bitcoin above 63,800 on August 19, 10AM ET? | Bitcoin price on Aug 19, 2026? | above (floor 63800) [parsed] / above (floor 68599.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-brti | rejected | 0.465 |
| _____ | `polymarket:3720411|kalshi:KXETHD-26AUG1909-T2444.99` | Ethereum above 1,990 on August 19, 10AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1990) [parsed] / above (floor 2444.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | rejected | 0.465 |
| _____ | `polymarket:3720420|kalshi:KXETHD-26AUG1909-T1649.99` | Ethereum above 1,890 on August 19, 10AM ET? | Ethereum price at Aug 19, 2026 at 9am EDT? | above (floor 1890) [parsed] / above (floor 1649.99) [structural] | 2026-08-19T14:00:00.000Z / 2026-08-19T13:00:00.000Z | binance / cf-benchmarks-erti | rejected | 0.465 |

