## Skill-to-Project Mapping

### Swift / iOS
**Used heavily on:**
- **WaterLocks** – Main production iOS app featuring subscriptions, QR-based commerce, and Stripe-powered payments.
- **Gaming Wizards** – Independent iOS application.
- **Dental Practice Portal** – Patient-facing mobile app for payments and account management.
- **Hike Intel** – Internal company application.

**Types of work:**
- SwiftUI and UIKit UI development
- MVVM architecture with dependency injection
- Async/await networking and REST API integration
- Core Data persistence and local caching
- StoreKit subscriptions, free trials, and entitlement handling
- Push notifications (foreground/background behavior)
- Deep linking and app lifecycle management
- TestFlight builds, App Store submissions, and release support
- Debugging crashes, performance issues, and live production bugs

---

### Flutter / Dart
**Used on:**
- **LDS Taste Buds** – Entire cross-platform app built end-to-end in Flutter.

**Types of work:**
- Cross-platform UI and responsive layouts
- Onboarding flows and profile management
- Matching and discovery interfaces
- Ticket purchase and checkout flows
- Admin and management views
- State management and service abstraction
- API integration and error handling
- Production debugging and iterative feature updates

---

### Payments & Commerce (Stripe)
**WaterLocks:**
- Stripe Checkout and recurring subscriptions
- Stripe Connect Express onboarding and payouts
- Webhook-driven subscription and account state management
- Failed payment handling and account enforcement

**Recommenu:**
- Stripe Billing integrated via a dedicated FastAPI paywall microservice
- Dynamic pricing, upgrades, and billing-cycle alignment

**Dental Practice Portal:**
- Stripe Checkout for patient payments

**General experience:**
- Subscription lifecycles (create, upgrade, downgrade, cancel)
- Webhook idempotency and data consistency
- Apple Pay and Google Pay integration
- Secure handling of payment and customer data

---

### Firebase
**WaterLocks:**
- Firebase Auth, Firestore, Functions, Storage, App Check
- Backend-controlled access rules and webhook-driven updates
- Real-time data syncing and offline-friendly patterns

**LDS Taste Buds:**
- Firebase Auth and Firestore
- Cloud Functions for backend business logic
- Messaging and push notification delivery

**Freelance & internal projects:**
- Authentication and user identity flows
- Secure user data storage and access control
- Lightweight backend logic and automation
