# 5x5 Image Generator and API

A system for generating, analyzing, and serving 5x5 black and white images with
tagging and filtering.

## Overview

This project consists of 3 main components:

1. **Rust Generator** - Analyzes all possible 5x5 black and white images (33+
   million combinations), categorizes them with tags based on visual properties,
   and stores them in a PostgreSQL database
2. **TypeScript API** - Serves the generated images with filtering capabilities
   by tags and pixel density
3. **Web UI** _(Coming Soon)_ - Interactive frontend for browsing and
   visualizing the generated 5x5 images

## Live Demo

A hosted demo is available:
[5x5 Live Demo](https://5x5-production-73ff.up.railway.app/)

Note: The demo dataset is currently limited to pixel density in the range 16–25.

## Prerequisites

- [Rust](https://rustup.rs/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Setup

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Build Rust generator (optional, will be built automatically when running)
npm run build:rust
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=3000
DENSITY_MIN=0
DENSITY_MAX=25
```

Notes:

- `DENSITY_MIN` and `DENSITY_MAX` limit generated patterns to a pixel density
  range. Valid range is 0–25 and must satisfy
  `0 <= DENSITY_MIN <= DENSITY_MAX <= 25`. If unset, defaults are 0 and 25.

### 3. Setup Database

Create a PostgreSQL database and ensure the `DATABASE_URL` points to it. The
generator will automatically create the required tables.

## Usage

### Generate Images (Required First Step)

Run the Rust generator to analyze and populate the database:

```bash
# Development mode (slower, with debug info)
npm run gen:dev

# Production mode (optimized, faster)
npm run gen:run
```

⚠️ **Important**: This process analyzes 33+ million images and may take time to
complete. It only needs to be run once.

### Start the API Server

After generation is complete, start the API server:

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3000` with Swagger documentation
at `http://localhost:3000/documentation`.

## Available Scripts

```bash
# Development
npm run dev          # Start API in development mode
npm run gen:dev      # Run generator in development mode

# Production
npm run build        # Build TypeScript
npm start           # Start API in production mode
npm run gen:run     # Run generator in production mode

# Utilities
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm run clean       # Clean Rust build artifacts
```

## Database Schema

The generator creates a `bw25` table with:

- `img_bits` - 32-bit representation of the 5x5 image
- `tag_bits` - Bitmask of applied tags
- `black_cnt` - Number of black pixels (0-25)

## Tags System

Images are automatically tagged based on visual analysis including:

- Border patterns
- Center configurations
- General shapes
- Symmetry properties
- And more...

The tag definitions are managed in `generator/tags.yaml`. During the Rust build
process, `build.rs` automatically generates:

- `shared/tags.ts` - TypeScript tag definitions for the API
- `generator/src/tagbits.rs` - Rust bitflag definitions for the generator

See the API documentation and previously mentioned tag files for available tag
names and filtering options.
