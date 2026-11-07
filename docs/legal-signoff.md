# DPDP website: legal sign-off sheet

**Prepared:** 6 November 2026
**For:** the reviewer signing off the legal content
**Status:** not yet signed off. Please do not publish the website changes until sections 1 and 2 are done.

## What we need from you

1. Check each statement in section 1 against the official text, and mark it correct or give the right wording.
2. Answer the open questions in section 2.
3. Review the wider wording in section 3.
4. Fill in section 6 when you are done.

**How far these corrections were checked:** the official MeitY PDF of the Rules could not be opened when this was prepared (it returned a 403 error). The corrections come from law-firm notes and DPDP reference sites, listed in section 5, plus the drafter's memory of the Act. None was checked against the Gazette, and the drafter is not a lawyer. Confidence below means how well the sources agree. It does not mean the statement has been verified.

## 1. Legal statements that changed

| # | Topic | Old website | New website | Source to check | Confidence | Reviewer |
|---|---|---|---|---|---|---|
| 1 | Date the Rules were published | 3 January 2025 | 13 November 2025, G.S.R. 846(E). Definitions and the provisions setting up the Data Protection Board start then | G.S.R. 843(E), G.S.R. 846(E) | High, see Q1 | ☐ |
| 2 | Consent manager stage | Not shown | 13 November 2026: consent manager rules start | Rules, rule 1(3) | High, see Q1 | ☐ |
| 3 | Main duties and penalties | 1 May 2027, citing Section 33 | 13 May 2027: most business duties start, and penalties can apply from this stage | Rules, rule 1(4); G.S.R. 843(E) | High, see Q1 | ☐ |
| 4 | Removal of Difficulties Order | 14 March 2026, described as an SDF clarification with extended timelines for some sectors | Removed from the site. Sources describe an order dated 5 October 2026 that only makes a narrow wording fix | The order itself | Medium | ☐ |
| 5 | Headline penalty | "Up to ₹250 crore per violation" | The highest maximum is ₹250 crore, for not taking reasonable security safeguards. Other failures have lower maximums | Schedule | High | ☐ |
| 6 | Penalty table | Not shown in full | s8(5) ₹250 crore; s8(6) ₹200 crore; s9 ₹200 crore; s10 ₹150 crore; everything else, including notice and consent, ₹50 crore; s32 undertaking, up to the maximum for the original breach; s15 ₹10,000 | Schedule | High, see Q5 | ☐ |
| 7 | How penalties are decided | Penalty calculator and a "₹750 crore" exposure figure | Both removed. New wording: amounts are legal maximums, and the Board decides after an inquiry, looking at factors such as seriousness and steps taken to reduce harm | s33, Schedule | High | ☐ |
| 8 | Breach reporting | A single "72 hours" deadline | Three steps: tell affected people without delay; give the Board a first description without delay; give the Board a detailed update within 72 hours, unless the Board allows longer | Rules, rule 7 | High | ☐ |
| 9 | Who the Act covers | "Personal data of Indian citizens" | Digital personal data handled in India, including paper records later digitised, and handling outside India connected with offering goods or services to people in India. "Citizenship is not the test" | s3 | High | ☐ |
| 10 | Exclusions | Not stated | Personal or household use; data the person made public, or that was made public under a legal duty. Section 17 has further exemptions | s3(c), s17 | High, see Q4 | ☐ |
| 11 | Data Protection Officer | s10(2)(b) | s10(2)(a) | s10(2) | Medium, from memory | ☐ |
| 12 | Algorithm due diligence | Presented as a general duty | Only for Significant Data Fiduciaries | Rules, rule 13(3) | High | ☐ |
| 13 | SDF duties | Scattered | Named by the government; Data Protection Officer based in India; independent data auditor; impact assessment and audit every 12 months; checking technical tools, including algorithmic software | s10, rule 13 | High | ☐ |

**Where these appear:** `src/lib/dpdp-timeline.ts` (1 to 4), `src/lib/dpdp-facts.ts` (5 to 10, 13), `src/lib/dpdp-faqs.ts`, and the What is DPDP, compliance guide, services, and solutions pages. Changing the two `lib` files updates most pages, but rows 11 and 12 also sit in page text.

## 2. Open questions

| # | Question | Why it matters | Answer |
|---|---|---|---|
| Q1 | Do the stages run from **13 November** (notification date) or **14 November** (publication date)? The site says 13 November 2026 and 13 May 2027. | Sources differ, and these are the site's most visible dates. | |
| Q2 | Has a shorter compliance timeline been notified? Sources described a proposal to shorten the period, but as of October 2026 they did not report it as notified. | If it was notified, the main date on the site is wrong. **Please check this last, just before publishing.** | |
| Q3 | Are the commencement references right: G.S.R. 843(E) for the Act, and rule 1(2), 1(3), 1(4) for the stages? | The sub-rule numbers are cited on the site. | |
| Q4 | Is the Section 17 sentence in row 10 a fair summary? | It is deliberately short. | |
| Q5 | Is "Schedule, item 7" the right label for the ₹50 crore residual penalty? | It is shown in the penalty table. | |
| Q6 | Is this correct: "they should have the option of English or a language listed in the Eighth Schedule"? | Stated in the FAQ on notices (`dpdp-faqs.ts`). | |
| Q7 | "Outside the specific legitimate uses in Section 7, you generally need notice and consent", and the comparison with GDPR's legitimate interest basis. Is this fair? | A simplified comparison in the FAQ. | |

## 3. Plain-language wording to review

The site now uses everyday words, so please check that nothing became wrong by being simplified:

- "Details" or "people's details" often stands in for "personal data", and "business" or "organisation" for "Data Fiduciary".
- "If you hold people's details, it probably does [apply]" is on the home page, with a list of signs. "Being a small organisation does not by itself take you out of scope" is also there.
- "Saying no is as easy as saying yes" is in the home page example. Section 6 speaks of withdrawing consent being comparable to giving it, so please check this example.
- "Keep the proof ready if the regulator asks" and "Records of who agreed to what and when" are on the home page.
- Section references on the solutions page: s6, s8(2), s8(5), s8(6), s8(7), s9, s10, s16, rule 13.

## 4. Business claims for the company to confirm

These are not legal points, but the website states them as fact. Someone at the company should confirm each one.

| Claim | Where | Note |
|---|---|---|
| "An advisory board comprising former regulators" | About page | Left unchanged. Remove it if it cannot be backed up |
| "24/7 help coordinating a breach response" | Services page | Needs a real on-call process |
| "3 to 6 months", "2 to 4 weeks", "3 to 9 months" | FAQ | Guide figures. Two FAQ answers give different ranges, so choose one |
| "We aim to reply within one working day" | Contact page, final call to action | Changed from "within 24 hours". Needs someone to meet it |
| All systems and features listed as supported, including ones not built yet | Product pages, home page | Business decision. Contracts and sales answers need to state what actually exists on the delivery date |
| Self-hosted or "your data stays with you" | Home page, pricing | Confirm it is true for each product sold |

## 5. Sources used (secondary, none is the Gazette)

- Timeline and commencement: dpdp.myndsolution.com/wiki/timeline, dpdp.myndsolution.com/wiki/guides/key-dates-and-commencement, amlegalsdpdpa.com/insights/dpdp-rules-gsr-846e-india-operations
- Penalties: dpdpa.com/theschedule.html, dpdp.myndsolution.com/wiki/act/schedule, amlegals.com/penalties-under-the-digital-personal-data-protection-act2023
- Rule 13: dpdp.myndsolution.com/wiki/rules/rule-13-additional-obligations-of-significant-data-fiduciary
- Removal of Difficulties Order: cyberpeace.org/resources/blogs/small-words-big-consequences-reading-the-dpdp-removal-of-difficulties-order-2026, dpdpactindia.in/blog/dpdp-removal-of-difficulties-order-2026, dpdpguard.ai/blog/removal-of-difficulties-order-dpdp-act-section-9-section-10-amended
- Shorter timeline proposal: chambers.com/articles/meity-plans-to-cut-short-dpdp-compliance-timeline-and-notify-cross-border-restrictions-for-sdfs, dpdprules.org/blog/dpdp-18-months-to-12-months-proposal
- Compliance roadmap: KPMG India, DPDP Act and Rules compliance roadmap (December 2025)

## 6. Sign-off

- Reviewer name:
- Legally qualified? (yes or no, and qualification):
- Date reviewed:
- Corrections needed:
- Approved for publishing: ☐ Yes ☐ Yes, after the corrections above ☐ No

**When a legal fact changes later:** update `src/lib/dpdp-facts.ts` or `src/lib/dpdp-timeline.ts`, run the tests, and add the change here.
