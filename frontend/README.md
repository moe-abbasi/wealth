# Wealth Asset Viewer

React app for viewing assets from GraphQL API

## Setup and Run

### Install stuff

```bash
npm install
```

### Start it

Make sure your graphql server is running on port 4000 first, then:

```bash
npm run dev
```

Go to http://localhost:3000

### Build for prod

```bash
npm run build
```

## Design decisions

**Why Material-UI?**
I used MUI because it had all the components i needed already made (tables, modals, tabs etc). Saved a lot of time not having to build everything from scratch. Also looks pretty professional out of the box.

**Table structure**
I made it hierarchical (Category > Subcategory > Asset) because thats how the data was structured in the JSON. Made sense to show it that way. The collapsing rows help keep it clean when theres lots of assets.

**Modal with 3 tabs**

- Overview: basic info someone would want to see right away
- Holdings: only shows up if the asset has holdings data. shows the breakdown of investments
- Details: everything else. organized by asset type (real estate shows address, crypto shows symbol, etc)

**TypeScript**
Used typescript everywhere for type safety. Helps catch bugs early and makes the code easier to understand.

**Apollo Client**
Standard choice for graphql. Has caching built in and handles loading/error states automatically.

## Trade-offs / Limitations

**Time constraints meant I didn't do:**

- No tests (would normally add jest + react testing library)
- No search/filter on the asset table
- No sorting options
- Mobile could be better (works but not optimized)
- No charts/visualizations for the holdings data
- Hardcoded the wid in App.tsx (would normally come from auth/context)
- No error boundaries
- Could use virtual scrolling if there were lots of assets
- Holdings tab could have charts instead of just tables

**Other stuff:**

The app expects your graphql server to have a `getAssets(wid: String!)` query. The wid is hardcoded to "ae0df17e-514e-4f52-a0b5-5bfb1adf84c9" in src/App.tsx right now.

CORS needs to be enabled on your server for localhost:3000

## Project structure

```
src/
  components/
    AssetTable.tsx    - the main table with collapsible rows
    AssetModal.tsx    - modal that opens when you click an asset
  graphql/
    queries.ts        - graphql queries
  types/
    index.ts         - typescript types
  utils/
    formatters.ts    - currency/date formatting functions
  App.tsx           - main app
  main.tsx          - apollo client setup
```

## Tech used

- React 18
- TypeScript
- Apollo Client (graphql)
- Material-UI
- Vite
