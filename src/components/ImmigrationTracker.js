import React, { useState, useEffect } from 'react';
import './ImmigrationTracker.css';

const ImmigrationTracker = () => {
  const initialDocuments = [
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

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('hungaryDocuments');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  useEffect(() => {
    localStorage.setItem('hungaryDocuments', JSON.stringify(documents));
  }, [documents]);

  const toggleDocument = (id) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, completed: !doc.completed } : doc
    ));
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      setDocuments(initialDocuments);
    }
  };

  const calculateProgress = () => {
    const completed = documents.filter(doc => doc.completed).length;
    return Math.round((completed / documents.length) * 100);
  };

  const groupedDocuments = documents.reduce((groups, doc) => {
    const category = doc.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(doc);
    return groups;
  }, {});

  const progress = calculateProgress();

  return (
    <div className="tracker-container">
      <header className="tracker-header">
        <h1>Hungarian Immigration Document Tracker</h1>
        <p className="subtitle">
          Track your progress for the Enter Hungary portal
        </p>
      </header>

      <div className="progress-section">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          >
            <span className="progress-text">{progress}%</span>
          </div>
        </div>
        <p className="progress-info">
          {documents.filter(d => d.completed).length} of {documents.length} documents completed
        </p>
      </div>

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
                    />
                    <div className="document-content">
                      <h3 className="document-title">{doc.title}</h3>
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
        <button onClick={resetProgress} className="reset-button">
          Reset Progress
        </button>
      </div>

      <footer className="tracker-footer">
        <p>
          Built with React | Your progress is saved automatically in your browser
        </p>
      </footer>
    </div>
  );
};

export default ImmigrationTracker;
