# Adjudication record

Three independent adversarial adjudications of the matched book, each written in a fresh session by
an adjudicator with no part in construction and no access to the earlier rounds' files until after
its own verdicts were fixed. They are published because the pedigree of a dataset is the record of
what was found wrong with it, not the record of what passed.

| file | what it is |
| --- | --- |
| `round-1-adjudication.md` / `round-1-verdicts.jsonl` | 34-row stratified sample. Found the wrong-hour twins |
| `round-2-adjudication.md` / `round-2-verdicts.jsonl` | 42-row sample, then a census of all 72 emitted pairs which superseded it. Found the settlement functional |
| `round-3-adjudication.md` / `round-3-verdicts.jsonl` | 54-row sample plus a census of all 72 Kalshi legs against source rule text. Found the ERTI mislabel and a non-reproducible frame population. Ends with a verification addendum and a final confirmation, both written after the fixes landed |
| `audit-sample.md` / `audit-sample.jsonl` | the pre-registered sampling frame: strata, populations, draw counts, and the seed derived from the run id so the draw reproduces |

## These verdicts are historical

Each round adjudicated the book **as it stood at that moment**. Every finding was fixed, and every
fix was independently re-verified before the cycle closed. The data in `data/` is the post-fix book,
so the verdict tables here do not describe it:

- Round 1's 144-record emitted book no longer exists. The hard instant gate demoted its wrong-hour
  half to `related`, where those records are published.
- Round 2's census returned 72 of 72 FALSE_MATCH against the claim that those pairs were matches.
  The response was to stop claiming they were: the basis-pair class exists because of this finding,
  and the record's central assertion is now the basis, not the match.
- Round 3's 44.4% mislabel census refers to the index caveat naming BRTI on Ethereum rows. That is
  fixed in the published data, where 32 of 72 basis pairs carry `cf-benchmarks-erti` witnessed by
  `text:erti`. The round-3 final confirmation re-derived the witness mapping as a clean bijection
  over all 986 records, and `scripts/verify.mjs` reproduces that check from `data/` alone.

Read the verdict tables as a change log, and run the verifier for the current state.

## Reproduction fidelity

The documents are reproduced verbatim, with two disclosed edits and no others. No verdict, tally,
rate, interval or argument was changed.

| file | edit |
| --- | --- |
| `round-1-adjudication.md` | in the escalation section, a first-name reference to the project owner replaced with "the project owner" |
| `round-3-adjudication.md` | its target path rewritten from the source pipeline's layout to `audits/audit-sample.md` |

## Files the documents reference

The adjudications cite the source pipeline's filenames. Where the same content is published here it
is under a different name, and some of it is not published at all.

| referenced as | published here as |
| --- | --- |
| `analysis/matches.jsonl` | `data/basis-pairs.jsonl` plus `data/related-pairs.jsonl`, which together are that file |
| `analysis/audit-sample.md` / `.jsonl` | `audits/audit-sample.md` / `.jsonl` |
| `analysis/adjudication3-2026-08-19.jsonl` | `audits/round-3-verdicts.jsonl` |
| `markets/kalshi/2026-08-19.jsonl`, `markets/polymarket/2026-08-19.jsonl` | `data/market-metadata.jsonl`, for the 272 markets in the published book. The full capture of 11,673 markets is not published here |
| `ANALYSIS.md` | the methodology section of the top-level `README.md`, which quotes its standard and gates verbatim |
| `analysis/scored-pairs.jsonl` | not published. It is the 115MB set of all 34,594 retained candidates, including everything the gates rejected |
| `analysis/adjudications.jsonl` | does not exist. It is the input file the pipeline would read verdicts back from, and the reason its automated false-match-rate field reads "unmeasured" |
| `t3/capture-meta-2026-08-19.json` | the `acquisition` block of `data/series-status.json` |
