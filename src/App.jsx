import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { DashboardPage } from './components/DashboardPage';
import { ApplicationsPage } from './components/ApplicationsPage';
import { ResourcesPage } from './components/ResourcesPage';
import { COMPANY_PROFILES } from './constants';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        // Sync user profile
        const userRef = doc(db, 'users', currentUser.uid);
        setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          role: 'user'
        }, { merge: true }).catch(err => console.error("Error syncing user profile:", err));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setApplications([]);
      return;
    }

    const q = query(collection(db, 'applications'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setApplications(apps);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
    });

    return () => unsubscribe();
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('landing');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const addApplication = async (newApp) => {
    if (!user) return;
    try {
      // Automatic data enrichment from mock profiles
      const profile = COMPANY_PROFILES[newApp.company] || {};

      await addDoc(collection(db, 'applications'), {
        ...profile,
        ...newApp,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      setCurrentPage('dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'applications');
    }
  };

  const updateApplication = async (updatedApp) => {
    if (!user) return;
    try {
      const { id, ...data } = updatedApp;
      const appRef = doc(db, 'applications', id);
      await updateDoc(appRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${updatedApp.id}`);
    }
  };

  const deleteApplication = async (id) => {
    if (!user) return;
    try {
      const appRef = doc(db, 'applications', id);
      await deleteDoc(appRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `applications/${id}`);
    }
  };

  const reminderCount = (() => {
    if (!applications.length) return 0;
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    let count = 0;
    applications.forEach(app => {
      if (app.activities && Array.isArray(app.activities)) {
        app.activities.forEach(activity => {
          if (activity.date) {
            const [day, month, year] = activity.date.split('/').map(Number);
            const [hours, minutes] = (activity.time || '00:00').split(':').map(Number);
            const activityDate = new Date(year, month - 1, day, hours, minutes);
            if (activityDate > now && activityDate <= threeDaysFromNow) {
              count++;
            }
          }
        });
      }
    });
    return count;
  })();

  const renderPage = () => {
    if (!isAuthReady) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={user ? () => setCurrentPage('dashboard') : login} />;
      case 'dashboard':
        return <DashboardPage 
          applications={applications} 
          searchQuery={searchQuery}
          onAddClick={() => setCurrentPage('applications')} 
          onUpdate={updateApplication}
          onDelete={deleteApplication}
        />;
      case 'applications':
        return <ApplicationsPage onAdd={addApplication} />;
      case 'resources':
        return <ResourcesPage applications={applications} onUpdate={updateApplication} />;
      default:
        return <LandingPage onStart={user ? () => setCurrentPage('dashboard') : login} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary/20">
      <Navbar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        user={user} 
        onLogin={login} 
        onLogout={logout} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        reminderCount={reminderCount}
      />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
