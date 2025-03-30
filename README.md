# Instant Tiptap

A real-time collaborative text editor built with React, TypeScript, Tiptap, and InstantDB. This project demonstrates how to build a collaborative editing experience with multiple users working on the same document simultaneously.

## Features

- Real-time collaborative editing using InstantDB
- Rich text editing powered by Tiptap
- Multiple editor instances can edit the same document
- Automatic conflict resolution
- Debounced updates to prevent excessive writes
- TypeScript for type safety
- Modern React with hooks

## Tech Stack

- React 18
- TypeScript
- Tiptap (rich text editor)
- InstantDB (real-time database)
- Vite (build tool)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

## Development

The project uses Vite for development and supports both local and hosted InstantDB modes.

### Available Scripts

#### Development Server
- `pnpm dev` - Start development server with hot reload

#### InstantDB Local Development Mode
- `pnpm local` - Set up local environment configuration
- `pnpm pulllocal` - Pull database schema in local mode
- `pnpm pushlocal` - Push database schema in local mode

#### InstantDB Hosted Mode
- `pnpm hosted` - Set up hosted environment configuration
- `pnpm pullhosted` - Pull database schema from hosted environment
- `pnpm pushhosted` - Push database schema to hosted environment

#### Authentication
- `pnpm instant-login` - Log in to InstantDB

### Environment Setup

The project supports two deployment modes:

1. **Local Mode**
   - Uses a local InstantDB server
   - Set up using `pnpm local`
   - Server runs at `http://localhost:8888`

2. **Hosted Mode**
   - Uses InstantDB's hosted service
   - Set up using `pnpm hosted`

Both require valid InstantDB App ID in the respective InstantDB context.

Env switching is handled with a symbolic link
1. Copy `env.template.hosted` to `.off.env.local` and `.off.env.hosted`
2. Set `VITE_INSTANT_MODE` to `local` or `hosted` appropriately
3. Set `VITE_INSTANT_APP_ID` to your InstantDB App ID local or hosted
4. Run the appropriate environment setup command (`pnpm local` or `pnpm hosted`)

## Push and Pull InstantDB Schema

Local:
`pnpm run pushlocal`
`pnpm run pulllocal`

Hosted:
`pnpm run pushhosted`
`pnpm run pullhosted`


## Project Structure

- `src/InstantTiptapEditor.tsx` - Main editor component with Tiptap integration
- `src/database.ts` - Database wrapper around InstantDB
- `src/config.ts` - Project configuration
- `instant.schema.ts` - InstantDB schema definition
- `instant.perms.ts` - InstantDB permissions definition

## How It Works

The editor uses Tiptap for rich text editing and InstantDB for real-time synchronization. When multiple users edit the same document:

1. Each editor instance maintains its own local state
2. Changes are debounced and sent to InstantDB
3. Remote updates are received and applied to the editor
4. Conflict resolution is handled automatically

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details
