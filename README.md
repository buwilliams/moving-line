# The Moving Line

An interactive revenue simulation based on the thesis in *The Moving Line:
AI's Compression Frontier and the Speed of Identity*.

The primary view follows two lines through a continuous field of work:

- **AI can do** moves at research speed.
- **Clients hire us for** moves at the speed of client perception and firm
  identity.

The amber space between technical capability and AI Work is the **capability
gap**. The **interregnum** is instead the period in which the old revenue model
is dead and new demand has not yet materialized. During that period, incumbent
revenue falls while value moves to clients, entrants, and new identities.

The application opens with a complete ten-year scenario. Users can play or
scrub through time, change the four clock rates and starting revenue, and reset
to the baked defaults. The model uses a continuous work landscape rather than
assigning permanent AI or human status to named service categories.
All mechanisms run from the opening date; live economic conditions change the
emphasis without assigning artificial start dates to identity, absorption, or
frontier expansion. The interregnum appears as a derived interval on the
timeline.
New Work, including initiatives already visible at the opening date, expands
and rebases the current `100%`; work that becomes infrastructure or is replaced
retires from the viable-work field. Hover or focus any area to see its
definition and live quantity.

The app links directly to the source essay:
[The Moving Line](https://buddy-williams.com/writings/moving-line).

## Run

```bash
npm install
npm run dev
```

Vite prints the local URL when the development server starts.

## Verify

```bash
npm test
npm run build
```

## Deployment

Production: [moving-line.fly.dev](https://moving-line.fly.dev/)

The app is packaged as a static nginx container and deployed to Fly.io:

```bash
flyctl deploy
```

The product and model contract is documented in
[`simulation-spec.md`](./simulation-spec.md).

## Model status

This is a deterministic explanatory model, not an empirically estimated
forecast. Its defaults encode the essay's qualitative claims: AI capability
compresses roughly 95% of the opening contingent work within five years, the
problem frontier keeps expanding, organizational absorption takes years, and
client perception changes slowest.
