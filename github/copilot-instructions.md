-   This project is Web App for crytocurrency on Solana blockchain. Using Lazorkit Wallet Adapter to connect wallet.
-   This project is designed for mobile first, but also work on desktop.
-   This project builded by Next.js
-   This project is using Tailwind CSS for styling, shadcn/ui for UI components. Cấu hình style css globals và các thành phần liên quan nằm trong src/styles
-   This project have dark mode and light mode. Dark mode is default.
-   This project using Jotai for state management.

-   Backend code placement convention: All API routes, backend-only types, libs, and DB helpers live under the Route Group `(backend)`. When adding or modifying anything related to backend, put it inside `src/app/(backend)` (use private folders like `_lib`, `_types` as appropriate). Do not place backend internals outside this Route Group.
