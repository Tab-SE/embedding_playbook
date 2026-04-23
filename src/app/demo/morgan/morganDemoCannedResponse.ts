import type { LangChainMessage } from "@assistant-ui/react-langgraph";

/** Keep in sync with Morgan `sample_questions` (floating assistant). */
export const MORGAN_DEMO_CANNED_QUESTION =
  "Who are the Expert Witnesses used in Successful outcomes of Slip and Fall Cases in the State of Georgia and what evidence did they use. List the names of the Expert Witnesses.";

function normalizeQuestion(s: string) {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function extractLastHumanText(messages: LangChainMessage[]): string {
  const humans = messages.filter((m): m is Extract<LangChainMessage, { type: "human" }> => m.type === "human");
  const last = humans[humans.length - 1];
  if (!last) return "";
  const { content } = last;
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof (p as { text?: string }).text === "string")
    .map((p) => p.text)
    .join("\n");
}

export function matchMorganDemoCannedQuestion(userText: string): boolean {
  if (!userText?.trim()) return false;
  return normalizeQuestion(userText) === normalizeQuestion(MORGAN_DEMO_CANNED_QUESTION);
}

export const MORGAN_DEMO_CANNED_MARKDOWN = `In Georgia, slip and fall (premises liability) cases often hinge on the expert’s ability to scientifically prove that a hazard was “unreasonably dangerous” or that the property owner violated specific safety codes.

The following experts have been utilized in successful outcomes or notable legal proceedings within the State of Georgia, along with the specific evidence they provided.

### 1. Biomechanics & Human Factors Experts

These experts explain how a fall occurred and why a “reasonable person” might not have seen the hazard (rebutting the “open and obvious” defense).

- **Expert Name:** Dr. Victoria Ballard, PE, CSP, CHFP  
  **Specialty:** Industrial and Systems Engineering / Human Factors.  
  **Evidence used:** Forensic analysis of human performance, environmental factors, and workplace safety standards to determine if a hazard was conspicuous enough for a pedestrian to avoid.

- **Expert Name:** Jared Firestone, J.D. (referenced in *Daugharty v. FDIC*)  
  **Specialty:** Biomechanics of falling and trip-and-fall accidents.  
  **Evidence used:** Studies on elevation changes in walkways. In *Daugharty*, testimony that a 3/4-inch change in concrete walkway elevation constituted a “substantial tripping hazard,” even after the defendant had attempted to grind the surface down.

### 2. Floor Safety & Tribometry Experts

These experts provide empirical data to prove a floor was too slippery for safe passage, often using specialized robotics.

- **Common firm / lead experts:** Robson Forensic (e.g., Andrea T. Baranyk, AIA and Peggy W. Liu, AIA)  
  **Specialty:** Architecture and floor safety.  
  **Evidence used:** Tribometry testing (Dynamic Coefficient of Friction / DCOF), often with the BOT-3000E, producing PDF reports vs. ANSI A326.3.

- **Expert Name:** Paul D. Tucker, SE, PE, CXLT  
  **Specialty:** Structural engineering and certified walkway litigation specialist.  
  **Evidence used:** Structural analysis combined with walkway safety testing for slip-to-fall mechanics on stairs and ramps.

### 3. Building Code & Property Management Experts

These experts establish breach of the standard of care via Georgia-adopted codes and industry-standard maintenance.

- **Expert Name:** Owen Ahearn  
  **Specialty:** Property management and maintenance.  
  **Evidence used:** Standard-of-care analysis; maintenance logs and property management records to show failure to perform reasonable inspections (constructive knowledge under Georgia law).

- **Expert Name:** Craig L. Moskowitz, PE  
  **Specialty:** Construction defects and premises liability.  
  **Evidence used:** Code compliance surveys—measurements of stair risers, treads, and handrail heights vs. the International Building Code (IBC), as adopted in Georgia.

### 4. Medical Causation Experts

In Georgia, a successful outcome often requires proving the fall—and not a pre-existing condition—caused the injury.

- **Evidence type:** Life care plans and orthopedic reports.  
- **Evidence used:** MRI/CT and surgical records; experts tie mechanism (e.g., twisting slip) to injury (e.g., meniscus tear or hip fracture).

### Key evidence tactics in Georgia successes

- **Photogrammetry:** High-resolution photos after the fall to build a 3D scene model.  
- **Constructive knowledge logs:** Surveillance and “sweep logs” to show a hazard persisted beyond common constructive-notice thresholds (often cited around 15–20 minutes in Georgia practice).  
- **Lighting meters:** Documenting stairwell illumination below code minima (e.g., ~1 foot-candle where codes require).

---

## Expert resources in Georgia (internal records)

Based on our internal records, here are **expert witnesses and office addresses in Georgia** we can call on—aligned with the specialties above: premises liability, biomechanics, floor safety and tribometry, building code and property standards, and medical causation—as each matter requires.

| # | Name | Location |
| --- | --- | --- |
| 1 | Jordan Ellis | 2700 West Broad St. STE 110, Athens, GA 30601 |
| 2 | Priya Nandakumar | 4501 Habersham St. and 45th St, Savannah, GA 31405 |
| 3 | Thomas Brennan | 13040 North Point Circle Ste B, Alpharetta, GA 30022 |
| 4 | Angela Ruiz | 222 West Harris St., Savannah, GA 31401 |
| 5 | Marcus Chen | 3275 Mall Blvd, Buford, GA 30519 |
| 6 | Sandra Okonkwo | 1777 S. Milledge Ave, Athens, GA 30605 |
| 7 | Leslie Harper | 3405 Piedmont Road NE #200, Atlanta, GA 30305 |
| 8 | David Whitfield | 215 West Belair Rd., Suite A-2, Augusta, GA 30907 |
| 9 | Renee Caldwell | 2700 Old Dawson Road Suite 1, Albany, GA 31707 |
| 10 | Omar Haddad | 855 Sunset Dr. #3, Athens, GA 30606 |
| 11 | Christine Boyd | 191 Peachtree St NW Ste 1000, Atlanta, GA 30303 |
| 12 | Kevin O’Malley | 541 Stephenson Ave., Savannah, GA 31405 |
| 13 | Natalie Brooks | 3344 Peachtree Road NE, Suite 1000, Atlanta, GA 30305 |
| 14 | William Park | 5671 Abernathy Rd NE Ste 100, Sandy Springs, GA 30328 |

**Try next:** “Which Georgia locations in our system had the most expert engagements last year?”`;

/**
 * Yields stream events @assistant-ui/react-langgraph consumes (`messages/partial`, `messages/complete`).
 * `noop` events are ignored by the library but advance progress wrappers.
 */
export async function* createMorganCannedMessageStream(
  content: string = MORGAN_DEMO_CANNED_MARKDOWN,
): AsyncGenerator<{ event: string; data: LangChainMessage[] }> {
  const id = crypto.randomUUID();
  await new Promise((r) => setTimeout(r, 200));
  yield { event: "noop", data: [] as unknown as LangChainMessage[] };
  yield { event: "noop", data: [] as unknown as LangChainMessage[] };
  const partialLen = Math.min(160, Math.max(40, Math.floor(content.length * 0.25)));
  yield {
    event: "messages/partial",
    data: [{ id, type: "ai", content: content.slice(0, partialLen) }],
  };
  await new Promise((r) => setTimeout(r, 180));
  yield {
    event: "messages/partial",
    data: [{ id, type: "ai", content }],
  };
  yield {
    event: "messages/complete",
    data: [{ id, type: "ai", content }],
  };
}

export function buildMorganCannedStreamIntercept(): (
  messages: LangChainMessage[],
) => AsyncGenerator<{ event: string; data: LangChainMessage[] }> | null {
  return (messages) => {
    const text = extractLastHumanText(messages);
    if (!matchMorganDemoCannedQuestion(text)) return null;
    return createMorganCannedMessageStream();
  };
}
