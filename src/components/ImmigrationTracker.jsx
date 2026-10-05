import React, { useState, useEffect, useMemo, useRef } from 'react';
import './ImmigrationTracker.css';

import { readProgress, saveProgress, exportProgress, importProgress, MAX_BACKUP_BYTES } from '../lib/progress';

const INITIAL_DOCUMENTS = [
  {
    id: 1,
    title: 'Valid Passport',
    description: 'Passport with at least 6 months validity remaining',
    category: 'Essential Documents',
    completed: false
  },
  {
    id: 2,
    title: 'Proof of Accommodation',
    description: 'Lease agreement or property ownership documents',
    category: 'Essential Documents',
    completed: false
  },
  {
    id: 3,
    title: 'Bank Statements',
    description: 'Last 3-6 months showing sufficient funds',
    category: 'Financial Documents',
    completed: false
  },
  {
    id: 4,
    title: 'Employment Contract',
    description: 'Signed employment contract from Hungarian employer',
    category: 'Employment Documents',
    completed: false
  },
  {
    id: 5,
    title: 'Health Insurance',
    description: 'Valid health insurance coverage for Hungary',
    category: 'Essential Documents',
    completed: false
  },
  {
    id: 6,
    title: 'Birth Certificate',
    description: 'Apostilled birth certificate with Hungarian translation',
    category: 'Personal Documents',
    completed: false
  },
  {
    id: 7,
    title: 'Criminal Background Check',
    description: 'Recent criminal background check from home country',
    category: 'Personal Documents',
    completed: false
  },
  {
    id: 8,
    title: 'Passport Photos',
    description: 'Recent passport-sized photos (biometric)',
    category: 'Essential Documents',
    completed: false
  },
  {
    id: 9,
    title: 'Marriage Certificate',
    description: 'If applicable, apostilled with Hungarian translation',
    category: 'Personal Documents',
    completed: false
  },
  {
    id: 10,
    title: 'Tax Registration',
    description: 'Hungarian tax ID number (adószám)',
    category: 'Administrative',
    completed: false
  }
];

const ImmigrationTracker = () => {
  const [documents, setDocuments] = useState(() => {
    // Accessing the storage property itself can throw in restricted browsers.
    try { return readProgress(INITIAL_DOCUMENTS, window.localStorage); }
    catch { return INITIAL_DOCUMENTS; }
  });
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [backupMessage, setBackupMessage] = useState('');
  const fileInput = useRef(null);

  useEffect(() => {
    try { setStorageAvailable(saveProgress(documents, window.localStorage)); }
    catch { setStorageAvailable(false); }
  }, [documents]);

  const downloadBackup = () => {
    const url = URL.createObjectURL(new Blob([exportProgress(documents)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hungary-tracker-progress.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const restoreBackup = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Backup is too large.');
      const restored = importProgress(INITIAL_DOCUMENTS, await file.text());
      if (!window.confirm('Replace your current progress with this backup?')) return;
      setDocuments(restored);
      setBackupMessage('Progress restored.');
    } catch {
      setBackupMessage('Could not restore. Choose a valid Hungary Tracker JSON backup under 16 KiB.');
    }
  };

  const toggleDocument = (id) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id ? { ...doc, completed: !doc.completed } : doc
    ));
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      setDocuments(INITIAL_DOCUMENTS);
    }
  };

  const progress = useMemo(() => {
    const completed = documents.filter(doc => doc.completed).length;
    return Math.round((completed / documents.length) * 100);
  }, [documents]);

  const groupedDocuments = useMemo(() => {
    return documents.reduce((groups, doc) => {
      const category = doc.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(doc);
      return groups;
    }, {});
  }, [documents]);

  return (
    <div className="tracker-container">
      <header className="tracker-header">
        <h1>Hungarian Immigration Document Tracker</h1>
        <p className="subtitle">
          Track your progress for the Enter Hungary portal
        </p>
      </header>

      <div className="progress-section">
        <div className="progress-bar-container" role="progressbar" aria-label="Document completion"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
          <span className="progress-text">{progress}%</span>
        </div>
        <p className="progress-info">
          {documents.filter(d => d.completed).length} of {documents.length} documents completed
        </p>
      </div>

      {!storageAvailable && (
        <p className="storage-warning" role="alert">
          Your browser could not save progress. Download a backup before closing this page.
        </p>
      )}

      <div className="documents-section">
        {Object.keys(groupedDocuments).map(category => (
          <div key={category} className="category-group">
            <h2 className="category-title">{category}</h2>
            <div className="documents-list">
              {groupedDocuments[category].map(doc => (
                <div
                  key={doc.id}
                  className={`document-item ${doc.completed ? 'completed' : ''}`}
                >
                  <label className="document-label">
                    <input
                      type="checkbox"
                      checked={doc.completed}
                      onChange={() => toggleDocument(doc.id)}
                      className="document-checkbox"
                      aria-labelledby={`document-title-${doc.id}`}
                    />
                    <div className="document-content">
                      <h3
                        id={`document-title-${doc.id}`}
                        className="document-title"
                      >
                        {doc.title}
                      </h3>
                      <p className="document-description">{doc.description}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="actions-section">
        <button className="backup-button" onClick={downloadBackup}>Download backup</button>
        <button className="backup-button" onClick={() => fileInput.current?.click()}>Restore backup</button>
        <input ref={fileInput} type="file" accept=".json,application/json" hidden
          aria-label="Progress backup" onChange={restoreBackup} />
        <button onClick={resetProgress} className="reset-button">
          Reset Progress
        </button>
      </div>

      <p className="backup-status" role="status">{backupMessage}</p>

      <footer className="tracker-footer">
        <p>
          Progress stays in this browser. Backups let you transfer it to another device.
        </p>
        <p>This is an organizational checklist. Verify requirements for your permit with the Hungarian immigration authority.</p>
      </footer>
    </div>
  );
};

export default ImmigrationTracker;
