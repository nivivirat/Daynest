# Daynest product and UX plan

Planning draft · 3 October 2026

## Product promise

**Know what you have, see what needs attention, and get on with your day.**

Daynest starts as a household kitchen companion. It can expand into personal routines and medicine tracking after the kitchen workflows are dependable. Its success depends on reducing the work of keeping records, not on adding more dashboards.

Initial audience: an individual or couple buying groceries, cooking at home, and forgetting what is already stocked. Shared households and caregivers are later audiences with different permissions and coordination needs.

## Jobs to support

1. Before shopping: check what is available and what needs replenishment.
2. After shopping: put purchases into inventory quickly.
3. Before cooking: find ingredients that need attention and update what was used.
4. During a busy day: record a change without searching through settings.
5. Later: keep a confirmed medicine schedule and record taken/skipped doses independently of food inventory.

## Current foundation and UX gaps

The app already provides inventory editing, quantities, locations, expiry filters, a shopping list, device persistence, and a manually synchronized Neon-compatible API. It has no AI workflow, notification scheduling, account login, receipt scanning, or medicine module yet.

The next iteration should address these gaps:

- The overview has large introductory content; frequent users need useful actions first.
- Subtracting one unit is awkward for ingredients measured in grams or kilograms.
- Dates require typing; a date picker and an explicit unknown-date option are easier.
- Sample data is available, but setup should help users add their actual essentials.
- Purchased shopping items do not enter inventory through a review flow.
- Cloud setup exposes an API URL and token. Keep this behind a development setting until account-based sync is implemented.
- Status messages need to distinguish saved on device, syncing, synced, and failed.
- The interface lacks an activity history and undo for accidental changes.

## Navigation and screen hierarchy

Ship three primary destinations first: **Today, Kitchen, Lists**. Place Profile in the header. Add an **Ask Daynest** action when the assistant works; it initially opens a sheet over the current screen so the user keeps their context.

Do not show empty future-feature destinations. When the Health module ships, let the user enable it explicitly and expose it as its own destination. Revisit navigation through usability testing once both modules have real users.

### Today

The opening screen answers: what needs my attention now?

Order:

1. Household/profile header and a compact Add action.
2. Items due soon, sorted by date, with clear dated labels.
3. Low-stock items with Add to list actions.
4. Shopping-list preview.
5. Recently updated items and activity access.

Hide empty attention sections. Show a calm all-clear state and a useful next action when nothing needs attention. Avoid a marketing hero, arbitrary scores, decorative charts, and permanent alert banners.

An expiry date is a user-entered or confirmed record, not a food-safety determination. Distinguish past-date items from upcoming dates with words and icons, not only color.

### Kitchen

Search and location filters remain easy to reach: All, Fridge, Pantry, Freezer. Secondary filters: Use soon, Low stock, Out of stock. Past-date items remain discoverable.

Rows show name, remaining quantity, location, and the nearest relevant date. Tapping opens item details. Details provide **Used some**, **Restock**, **Add to list**, **Edit**, and **Remove**.

Use a list for precise inventory scanning. Optional category artwork can add recognition without turning inventory into a grid of decorative cards.

For an item bought on different dates, retain separate batches with their own quantities and dates. Show total quantity on the list; disclose batches on details. Do not replace an older expiry date when restocking.

### Lists

Start with one grocery list. Support adding, checking, editing, and removing an item. Grouping by shopping category is optional and must not prevent manual ordering.

**Finish shopping** opens a review of checked items: quantity, unit, storage location, and optional expiry. Saving creates inventory batches and archives those purchased entries. Unchecked entries stay on the list. Checking a box alone never changes inventory.

### Profile

Household name, data/sync status, notification preferences, accessibility/theme options, export, and later module settings. Development API configuration is hidden under Advanced during the prototype and removed from the normal setup flow when verified accounts ship.

## Main flows

### First use

Welcome → choose Add essentials or Explore sample pantry → add a few items → Today.

Local use does not require an account. Offer account creation when the user wants backup or sharing. Sample data must be clearly labeled and removable without deleting real entries. Skip setup is available.

### Add an item

Add → name/autocomplete → quantity and unit → Save.

Default the storage location from the current filter. Category, low-stock threshold, and expiry are optional details that can be expanded. Preserve user-entered values after errors. Offer Add another after saving.

For receipt or barcode intake, explain what will be added before saving. A barcode can identify a product; it does not establish how much the user bought or its expiry date.

### Use an ingredient

Item → Used some → choose amount → preview remaining quantity → Confirm → Undo toast.

Offer appropriate amounts for the item's unit. Support approximate tracking for users who prefer Half left, Low, and Empty. Keep approximate amounts visibly distinct from exact counts; never invent exact quantities from an estimate. Begin with exact quantities and custom consumption amounts before adding approximation.

### Restock

Item → Restock → amount and optional date → Save new batch.

Keep previous batches. Undo the restock as one action. Unit changes require an explicit supported conversion or confirmation; do not silently combine incompatible units.

### Ask Daynest (later)

Request → clarify if needed → action preview → confirm → result with Undo.

Example: “We used 200 grams of rice.” Resolve the correct inventory item and supported unit conversion, show the new amount, and apply an authorized structured action. Ask which item when several match. Retrying a confirmed action must not apply it twice.

Separate answering from changing records: “What is running low?” reads data; “Add those to my list” proposes a change. Preserve explicit household and module scope.

## Feature priorities

| Stage                   | Features                                                                                                                                               | Exit condition                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1: Kitchen UX           | Spotify-inspired visual system, Today/Kitchen/Lists navigation, quick add, consumption amounts, undo, item details, purchase review, accessible states | A new user can add, use, and replenish an item without explanation; data survives restart                                                |
| 2: Dependable daily use | Verified accounts, authorized household membership, automatic sync, local-first queue, conflict handling, activity records, date reminders             | Offline edits and retries preserve data; reminders reschedule after edits and cancellation                                               |
| 3: Applied AI           | Receipt extraction with review, structured natural-language actions, ingredient-grounded meal suggestions                                              | Measured extraction/action correctness, honest uncertainty, no duplicate mutations                                                       |
| 4: Optional Health      | Medicine inventory, explicitly confirmed schedules, taken/skipped history, refill reminders, separate privacy controls                                 | Inventory and dose history agree; time zones and schedule changes are tested; notification delivery is not confused with dose completion |
| 5: Everyday extension   | Household supplies, recurring tasks, additional lists, opt-in shared workflows                                                                         | Each extension solves an observed repeated need and fits existing navigation                                                             |

Delay recipe feeds, social features, automatic shopping purchases, broad autonomous agents, and model training until there is a concrete need.

## Medicine UX boundaries

Keep medicine batches, schedule versions, and dose events as distinct records. A notification being delivered or opened does not mean a dose was taken. Recording a dose updates stock once and supports correcting mistakes.

Only store a schedule the user enters or explicitly confirms. AI extraction of a label is a draft requiring review, especially medicine name and schedule fields. Do not generate dose changes, treatment recommendations, or missed-dose instructions as part of this tracker.

Use neutral statuses such as Scheduled, Recorded as taken, Skipped, and Not recorded. Let the user control whether notification previews expose medicine names. Grocery-sharing permission must not imply access to health records; caregiver access is explicit and scoped.

## Spotify-inspired visual direction

Reference: `DESIGN.md`, installed with `npx getdesign@latest add spotify`.

Use near-black page backgrounds (`#121212`), layered charcoal surfaces (`#181818`, `#252525`), white primary text, silver secondary text, green (`#1ED760`) for primary actions and selected states, pill controls, and rounded sheets. Orange marks dated attention; red marks destructive actions or errors. Green is functional, not a decorative background wash.

Adapt the reference for household tasks:

- Use system fonts initially; do not depend on Spotify's proprietary fonts.
- Body text starts at 16, metadata at 14, with support for device text scaling.
- Touch targets are at least 44 points, preferably 48.
- Keep sentence-case action labels readable. The reference's uppercase and dense typography are adapted where they hurt clarity.
- Use an 8-point spacing scale and enough space between adjacent actions.
- Represent collections with useful imagery, but keep critical quantities and dates visible as text.
- Use a persistent mobile bottom bar and a desktop sidebar; action sheets become centered dialogs on larger screens.
- Include pressed, focused, disabled, loading, error, and empty states. Respect reduced-motion preferences.

## Reliability is part of UX

- Save locally before displaying success. Label pending cloud changes honestly.
- Offline mode retains edits; reconnection does not discard them or repeat actions.
- Conflict resolution shows what changed and preserves both versions until a choice is made.
- Remove operations offer Undo and retain enough history to recover within the offered period.
- Notification permission is requested after a user enables a reminder, with an explanation and a fallback when denied.
- Reminders are user-configured and grouped to avoid repeated low-value prompts.
- Sensitive changes and uncertain AI interpretations have visible review steps.
- Screen-reader names describe actions and item names. Status labels work without color. Test large text, keyboard focus on web, and narrow mobile layouts.

## Data and engineering implications

Extend the existing relational model with item batches, inventory movements, shopping purchase records, and household membership. Keep Health tables and permissions separate. Introduce schema versions and explicit migrations for persisted device data so existing inventories survive the redesign.

Replace full-snapshot cloud writes with idempotent per-action mutations before automatic sync and sharing. Track operation IDs and authoritative server versions. Keep cloud credentials and model keys on the backend. The existing prototype token configuration remains development-only until a verified session flow replaces it.

## Validation and product signals

Test these tasks with representative users:

1. Add three real purchases, including an unknown expiry date.
2. Record using a fractional ingredient amount and undo it.
3. Find an item that needs attention and put it on the list.
4. Finish shopping and verify updated inventory.
5. Make an offline change and understand its sync status.

Measure task completion without help, time to add an item, quantity mistakes, undo recovery, and whether inventory is still updated after repeated use. Initial targets are hypotheses: median manual add below 20 seconds and at least 90% unassisted completion for the core tasks. Revisit them using observed user behavior.

For AI, maintain separate evaluation sets for receipt fields, item resolution, unit handling, ambiguous requests, unauthorized actions, and duplicate retries. Report incorrect mutations as well as successful actions.

## Next implementation slice

1. Create shared dark-theme tokens and accessible components using DESIGN.md.
2. Replace the introduction-heavy overview with Today and actionable sections.
3. Add item details, custom consumption amounts, and Undo.
4. Simplify Add into essential fields plus optional details.
5. Add purchase review and batch-aware restocking.
6. Verify persistence migration, core flows, text scaling, and platform bundles.

This slice improves the existing kitchen product. Subsequent stages depend on its usability and reliability rather than a fixed delivery date.

## Indian kitchen implementation — first slice

Implemented dark Spotify-inspired surfaces, Today / Kitchen / Lists navigation, sixteen optional Indian ingredient shortcuts with Hindi and Tamil transliteration aliases, metric usage conversion, Indian date entry, and item-scoped undo. Existing category and storage identifiers remain compatible with saved local data and the backend.

Checked shopping items can be reviewed individually before adding them to the kitchen. Each purchase becomes a separate inventory row with its own quantity and optional package date; existing stock is not overwritten. This is an initial purchase workflow, not a grouped product/batch model or bulk checkout.

No shelf-life dates are inferred for real ingredients, and household measures such as katori are not converted to grams. Demo dates are illustrative. Authentication, automatic cloud sync, notifications, AI, category expansion and grouped batch details remain subsequent work.
