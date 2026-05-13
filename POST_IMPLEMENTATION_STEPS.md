# RENTX Marketplace: Post-Implementation Setup Guide

Follow these steps to ensure the marketplace infrastructure is fully operational, secure, and integrated with your Firebase and Solana environments.

## 1. Firebase Firestore Security Rules

Ensure your Firestore rules are configured to protect user data and enforce administrative access. Copy and adapt the following rules into your Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper to check if user is admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User Profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // Services
    match /services/{serviceId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.providerId || isAdmin();
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.clientId || 
        request.auth.uid == resource.data.providerId || 
        isAdmin()
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.clientId || 
        request.auth.uid == resource.data.providerId || 
        isAdmin()
      );
    }
    
    // Withdrawals (Treasury)
    match /withdrawals/{id} {
      allow read: if request.auth != null && (request.auth.uid == resource.data.userId || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }
    
    // Notifications
    match /notifications/{id} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Payment Logs
    match /payments/{id} {
      allow read: if request.auth != null && (request.auth.uid == resource.data.payerId || isAdmin());
      allow create: if request.auth != null;
    }
  }
}
```

## 2. Firestore Indexes

Several marketplace dashboards require composite indexes for complex filtering and ordering. These have been added to `firestore.indexes.json`. To deploy them manually if needed, use:

```bash
npm run deploy:firestore-indexes
```

The following indexes are required:
- **notifications**: `userId` (ASC), `createdAt` (DESC)
- **bookings**: `clientId` (ASC), `createdAt` (DESC)
- **bookings**: `providerId` (ASC), `createdAt` (DESC)
- **payments**: `providerId` (ASC), `createdAt` (DESC)
- **availability**: `providerId` (ASC), `date` (ASC)
- **reviews**: `serviceId` (ASC), `createdAt` (DESC)
- **withdrawals**: `providerId` (ASC), `createdAt` (DESC)

## 3. Environment Variables (.env.local)

Ensure the following variables are set in your `.env.local` file. These are required for Firebase and Solana Pay integration.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_TREASURY_WALLET_ADDRESS=your_admin_treasury_wallet_address
NEXT_PUBLIC_SOLANA_TOKEN_MINT=your_rentx_token_mint_address
```

## 3. Administrative Setup

To access the `/marketplace/admin` panel, you must manually set your user role to `admin` in the Firestore `users` collection:
1. Go to Firebase Console > Firestore.
2. Find your user document in the `users` collection (look for your UID).
3. Change the `role` field from `client` to `admin`.
4. Refresh the marketplace dashboard.

## 4. Treasury Execution (Manual Step)

Currently, the withdrawal execution is **informative**. When you click "Execute Payout" in the Admin Dashboard:
1. The status updates to `completed` in Firestore.
2. A notification is sent to the provider.
3. **CRITICAL**: You must manually transfer the RENTX tokens from your treasury wallet to the provider's `solanaWallet` using your preferred wallet (e.g., Phantom, Solflare) or a CLI.

## 5. Deployment Considerations

- **Build Command**: `npm run build`
- **Output**: Ensure `next.config.js` is set for your hosting provider (e.g., Vercel, Firebase Hosting).
- **Scale**: For high-volume transaction tracking, consider implementing a backend cron job (Firebase Function) to verify transaction signatures instead of relying solely on client-side confirmation.

---
*RENTX Technical Implementation Guide*
