rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() { return request.auth != null; }
    function isOwner(uid) { return request.auth.uid == uid; }
    function isAdmin() { 
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'; 
    }

    // Users: Can read/write own data. Admins see all.
    match /users/{uid} {
      allow read: if isSignedIn() && (isOwner(uid) || isAdmin());
      allow create: if isSignedIn() && isOwner(uid) && request.resource.data.role == 'user';
      allow update: if isSignedIn() && (isOwner(uid) || isAdmin()) && 
                    (request.resource.data.role == resource.data.role || isAdmin()); // Prevent self-promotion
    }

    // Transactions: Read-only for users, no direct deletes.
    match /transactions/{txId} {
      allow read: if isSignedIn() && (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if false; // Only via Server-side / WriteBatches in App logic
      allow write: if isAdmin();
    }

    // Withdrawal Codes: User can read own, but only system/admin updates.
    match /codes/{codeId} {
      allow read: if isSignedIn() && (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
    }

    // Withdrawals & KYC: User creates, Admin approves.
    match /withdrawals/{id} {
      allow read: if isSignedIn() && (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
    }

    match /kyc/{uid} {
      allow read: if isSignedIn() && (isOwner(uid) || isAdmin());
      allow create: if isSignedIn() && isOwner(uid);
      allow update: if isAdmin();
    }

    // Support: Threads shared between user and admin
    match /support/{threadId} {
      allow read, write: if isSignedIn() && (threadId == request.auth.uid || isAdmin());
    }
    
    match /notifications/{id} {
      allow read: if isSignedIn() && resource.data.uid == request.auth.uid;
      allow update: if isSignedIn() && resource.data.uid == request.auth.uid;
      allow create: if isAdmin();
    }
  }
}
