# The Moving Line: Explanatory Simulation Specification

Status: Implemented
Revised: 2026-07-13

## 1. Purpose

The Moving Line is an interactive explanation of the economic model in the
essay "The Moving Line: AI's Compression Frontier and the Speed of Identity."

It is not a forecast for a particular agency and it does not claim that named
disciplines are permanently human or machine work. Its purpose is to make the
essay's causal path visible:

1. AI capability, absorption, distribution, and identity are all moving from
   the opening moment, at different rates.
2. Prices respond before organizations absorb the capability.
3. The lag creates an interregnum in which incumbent revenue falls.
4. Work below the cost of external exchange moves client-side or evaporates.
5. Residual value accrues to clients, entrants, and genuinely new identities.
6. What clients hire the incumbent for changes more slowly than AI capability.
7. New capability opens initiatives and problems beyond today's work, while
   absorption and distribution govern how quickly they produce economic value.

## 2. Experience Principles

### Complete on arrival

The application opens with a baked ten-year scenario. Play is the first
meaningful action. The user does not define offers, categories, or events.

### One current moment

The dated timeline contains one playhead and is itself the scrubber. Clicking,
dragging, or using arrow keys on the rail changes the date. Every other reading
describes the work and economics at that date.

### Rates, not task labels

The simulation models positions and rates. It never assigns a permanent
compression date to implementation, verification, workflow redesign, or any
other named discipline. Those labels expire as models improve.

### Capability is not adoption

Work an AI system can perform is distinct from work the market has converted
into AI Work. Preserving this distinction reveals a capability gap. That gap
can contribute to the interregnum, but it is not the interregnum itself.

### The denominator moves

The visible field always represents `100%` of currently viable work. New Work
expands that total. Work that becomes infrastructure, is made economically
irrelevant, or is replaced by a new technological system retires from it. AI
therefore advances through a moving field rather than completing a fixed list.

### Identity governs permission

Identity is not a kind of work. It is the external and internal boundary that
determines what buyers permit a firm to sell and what its selection function is
capable of delivering.

## 3. Primary View

The first viewport contains:

- A header link to the source essay
- Current annualized agency revenue and change from baseline
- One condition-driven emphasis and one causal sentence
- One cinematic work field
- A dated timeline with one current-moment dot
- Play, pause, step, and rate controls attached to the dated timeline

There are no offer categories, category editors, category compression dates,
strategy rankings, employee recommendations, persistent value-capture cards,
or clock progress meters.

## 4. Work Landscape

The current work field is a continuous conceptual gradient. Its left edge is
more specifiable, bounded, and verifiable. Its right edge is more contextual,
relational, and constitutive. The full width is always the current `100%`, even
as the absolute amount and composition of viable work change.

At any date the field is divided into:

1. **AI Work**: work handled with AI anywhere in the market, whether by client
   organizations, AI-native entrants, or protected new identities.
2. **Capability gap**: technically reachable work that the market has not yet
   converted into AI Work because of workflows, verification, trust, politics,
   deployment, accountability, or distribution.
3. **Human-held contingent work**: work the frontier has not reached yet, but
   which the model does not claim is permanently human.
4. **Constitutive core**: trust, liability, accountability, and institutional
   legitimacy. The obligations persist even if their associated labor or
   revenue changes.
5. **New Work**: initiatives and problems opened by new capability, including
   work already visible at the opening date. It expands the total field while
   its economic realization still waits on absorption and distribution. It is
   not a permanent safe harbor.

The first four regions partition current viable work. New Work is a green
overlay showing work opened by recent capability, including `4` points already
visible at the opening date. Each area names itself and shows its live share of
the current field.
Hovering or focusing an area reveals its definition, current share, and
absolute quantity in work-index points.

The field also reports turnover. The opening field has a work index of `100`.
New Work adds index points; retired work removes index points. Retirement covers
work that became infrastructure or ceased to be viable because a replacement
technology changed the problem, as fission generation can replace fossil-fuel
generation rather than merely automate it.

## 5. The Two Lines

Two prominent vertical lines move across the work field:

| Boundary | Meaning | Default behavior |
| --- | --- | --- |
| **AI can do** | Work current AI can technically perform | Compresses roughly 95% of the opening contingent work within five years, but remains below 100% of the expanding current field |
| **Clients hire us for** | Work buyers believe the incumbent agency is for | Moves slowest |

The opening position places what clients hire the agency for narrowly ahead of
AI capability. The capability line passes it early. The red **AI Work** fill
combines slow client absorption with faster market entry by entrants and new
identities; it is not a third thesis line. The amber **Capability gap** between
**AI Work** and the **AI can do** line widens early, peaks, and then contracts
as new actors operationalize the capability.

The interregnum is temporal and economic: **the period in which the old revenue
model is dead and the new demand has not yet materialized**. It is shown as an
amber interval on the timeline, not mislabeled as a region of work.

## 6. The Four Clocks

| Clock | Meaning | Baked rate |
| --- | --- | --- |
| Capability | Advance of technical reach | `8x` |
| Absorption | Operational adoption inside clients | `0.5x` |
| Distribution | Economy-wide spread and demand realization | Derived from absorption at `2x` demand response |
| Identity | Redraw of buyer belief and organizational selection | `0.125x` |

The default rates are intentionally asymmetric. Capability approaches the
contingent limit during the ten-year path, absorption remains materially
behind, distribution cannot outrun absorption, and identity remains the slowest
clock. These differences are communicated by the two lines, the changing
operational fill, and value movement rather than four persistent progress bars.

Market entry is a derived path rather than a fifth user-controlled clock. It
responds to demand faster than incumbent absorption because entrants and
protected new identities can begin with a boundary drawn near current
capability instead of redrawing an inherited identity.

## 7. Value Capture

AI-native entrant capture, protected new-identity capture, and client capture
are calculated from the opening date. Their visual prominence follows their
live value rather than a scheduled reveal:

- A protected new identity
- An AI-native entrant
- Client organizations through in-housing

Their size and opacity grow with modeled capture and each shows its live annual
value. Incumbent revenue is represented separately by a shrinking ribbon with
its live annual value.

The model also calculates value that has no captor during the interregnum. This
supports the Coasean-floor mechanism without presenting evaporation as revenue
earned by an actor.

## 8. Concurrent Mechanisms

The essay's sections are logical parts of one system, not chronological stages.
Capability, repricing, absorption, evaporation, identity, market entry, and
frontier expansion all begin in motion. The app never assigns any of them an
artificial onset date.

The headline instead emphasizes a condition supported by the current values:

1. **Identity already decides who follows** while legacy revenue remains viable
   and replacement demand remains smaller.
2. **The interregnum is active** while the old revenue model is below the
   viability threshold and replacement demand remains smaller than it.
3. **New demand is materializing** after replacement demand overtakes the
   remaining legacy model.

These are changes of emphasis, not the start or end of the underlying clocks.

## 9. User Controls

The user can change:

- Starting annual agency revenue from `$100,000` to `$100,000,000` in
  `$100,000` increments
- AI capability pace
- Client absorption pace
- Demand response
- Client perception pace

The four rate controls use logarithmic `1/32x` to `32x` ranges. Reset restores
the baked rates, `$2.9M` revenue, and the opening date. Playback rates are Day,
Week, Month, Quarter, and Year per second. The default is Month, so the complete
ten-year argument plays in roughly two minutes.

## 10. Model Mapping

The scenario begins with a work index of `100`, an existing frontier at `22%`
of that field, AI Work at `8%`, a constitutive core of `5%`, New Work at `4%`,
and a client-hiring line at `26%`.

Clock progress uses continuous exponential curves. Every clock is already
running at the opening date; their different speeds create the lag. Positions
are derived as:

```text
legacy frontier = initial frontier + capability progress * remaining opening contingent work
client absorption = initial AI Work + absorption progress * reachable legacy work
market entry = demand-driven founding progress
legacy AI Work = initial AI Work + combined client absorption and market entry * reachable legacy work
added work = capability-driven creation + continuing problem growth
retired work = a share of handled legacy work that becomes infrastructure or is replaced
current work index = opening work - retired work + added work
displayed share = active work quantity / current work index
```

Capability opens possible new work immediately:

```text
New Work = existing New Work + added work
realized New Work = New Work * client distribution and market-entry realization
```

The opening state includes `4` New Work index points to represent initiatives,
products, and roles already visible on the ground. New Work is included inside
the current `100%` overlay. Its absolute quantity can grow even when its share
changes, and the total work index can grow despite simultaneous retirement.
Its economic realization comes through slower client absorption plus faster
entry by organizations founded around the capability.

The timeline derives the interregnum from the selected clocks. The old model is
treated as dead after legacy revenue falls below `50%` of its opening level; new
demand is treated as materialized when annual replacement demand overtakes the
remaining legacy revenue. The `50%` viability threshold is an explicit
explanatory assumption, not an empirical constant. If no crossover occurs
inside the horizon, the interval continues beyond the model.

Incumbent revenue declines with frontier advance. Constitutive relationships
provide a limited residual, and identity progress permits limited participation
in new demand. Entrants benefit from the gap between capability and identity;
clients benefit as absorbed capability moves work inside the firm.

The formulas are deterministic explanatory relationships, not empirically
estimated forecasts.

## 11. Visual Direction

- Neutral-black presentation canvas
- Red AI capability, amber capability gap, blue client perception, green New Work
- One continuous work field rather than a dashboard or named service cards
- Two plain-language moving-line labels: **AI can do** and **Clients hire us for**
- A shrinking revenue ribbon rather than a revenue chart
- Capture destinations visible in proportion to their live modeled value
- A green New Work overlay that expands within the rebased current `100%`
- Hover and keyboard-focus details for definitions and live quantities
- Desktop presentation fits within the first viewport
- Mobile presentation preserves the complete field and timeline without
  page-level overflow

## 12. Acceptance Criteria

1. A first-time user can press Play without configuring anything.
2. No named offer or discipline is modeled as a permanent work category.
3. AI-capable work is visibly divided into **AI Work** and the **Capability gap**.
4. The **AI can do** line outruns both operational usage and **Clients hire us
   for** by default.
5. The interregnum is defined as the period in which the old revenue model is
   dead and the new demand has not yet materialized; it is not presented as a
   work category.
6. The work field preserves a visible constitutive core without claiming its
   economic size is permanent.
7. Capture shifts from the incumbent toward clients and entrants.
8. A protected new identity remains distinct from the incumbent identity.
9. New Work is visible at the opening date, expands the current work index, and
   remains part of the visible `100%`.
10. No mechanism receives an artificial start date; changes in emphasis are
    derived from live economic conditions.
11. Revenue and clock controls produce materially different paths.
12. Reset restores the baked model and opening date.
13. Engine tests, the production build, and desktop/mobile browser checks pass
    without console errors or page-level horizontal overflow.
14. Hover and keyboard focus expose definitions, shares, and work-index
    quantities without permanently increasing visual load.
15. The header links to the source essay at
    `https://buddy-williams.com/writings/moving-line`.
