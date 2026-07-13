# The Moving Line

An interactive revenue simulation based on the thesis in *The Moving Line:
AI's Compression Frontier and the Speed of Identity*.

The primary view follows two lines through a continuous field of work:

- **AI can do** moves at research speed.
- **Clients hire us for** moves at the speed of client perception and firm
  identity.

The space between technical capability and operational use is the
**interregnum**. During that lag, prices compress before organizations can
absorb the new capability, incumbent revenue falls, value moves to clients and
new entrants, and capability opens a growing frontier of new problems.

The application opens with a complete ten-year scenario. Users can play or
scrub through time, change the four clock rates and starting revenue, and reset
to the baked defaults. The model uses a continuous work landscape rather than
assigning permanent AI or human status to named service categories.

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

The product and model contract is documented in
[`simulation-spec.md`](./simulation-spec.md).

## Model status

This is a deterministic explanatory model, not an empirically estimated
forecast. Its defaults encode the essay's qualitative claims: AI capability
approaches 95% of the modeled work field within five years, organizational
absorption takes years, and client perception changes slowest.
