// Main application controller
import { AppState, generateId } from './state.js';
import { loadData, saveData, loadSettings, saveSettings, exportData, importData } from './storage.js';
import { validateRecord, validateImportData } from './validators.js';
import { compileRegex, searchRecords } from './search.js';
import { UIManager } from './ui.js';


class FinanceTrackerApp {
    constructor() {
        this.state = new AppState();
        this.ui = new UIManager(this.state);
        this.initializeApp();
        this.setupEventListeners();
    }
    
    async initializeApp() {
        // Load data from localStorage
        this.state.setRecords(loadData());
        this.state.setSettings(loadSettings());
        
        // If no data exists, create seed data
        if (this.state.records.length === 0) {
            await this.createSeedData();
        }
        
        // Initialize UI
        this.ui.showPage('dashboard');
        this.ui.updateSearchHelp();
    }
    
    async createSeedData() {
        const seedData = [
            {
                id: "txn_001",
                description: "Lunch at cafeteria",
                amount: "12.50",
                category: "Food",
                date: "2025-10-10",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_002",
                description: "Chemistry textbook",
                amount: "89.99",
                category: "Books",
                date: "2025-10-08",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_003",
                description: "Bus pass",
                amount: "45.00",
                category: "Transport",
                date: "2025-10-05",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_004",
                description: "Coffee with friends",
                amount: "8.75",
                category: "Entertainment",
                date: "2025-10-12",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_005",
                description: "Dinner at restaurant",
                amount: "25.30",
                category: "Food",
                date: "2025-10-14",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_006",
                description: "Library fees",
                amount: "15.00",
                category: "Fees",
                date: "2025-10-09",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_007",
                description: "Tea at campus cafe",
                amount: "4.50",
                category: "Food",
                date: "2025-10-13",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_008",
                description: "Movie tickets",
                amount: "18.00",
                category: "Entertainment",
                date: "2025-10-11",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_009",
                description: "Notebook and pens",
                amount: "12.99",
                category: "Books",
                date: "2025-10-07",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "txn_010",
                description: "Gym membership",
                amount: "35.00",
                category: "Other",
                date: "2025-10-06",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        this.state.setRecords(seedData);
        saveData(seedData);
    }
    
    setupEventListeners() {
        // Navigation - Direct approach like working version
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
            });
        });
        
        // Add Record Button
        const addRecordBtn = document.getElementById('addRecordBtn');
        if (addRecordBtn) {
            addRecordBtn.addEventListener('click', () => {
                this.state.editingId = null;
                this.ui.showForm('Add Transaction');
            });
        }
        
        // Cancel Button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.ui.hideForm();
                this.state.editingId = null;
            });
        }
        
        // Form Submission
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        // Search functionality
        this.setupSearchListeners();
        
        // Sorting
        this.setupSortListeners();
        
        // Import/Export
        this.setupImportExportListeners();
        
        // Settings
        this.setupSettingsListeners();
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.ui.hideForm();
                this.state.editingId = null;
            }
        });
        
        // Window resize listener for responsive view switching
        window.addEventListener('resize', () => {
            this.ui.toggleViewMode();
        });
        
        // State change listeners
        this.state.on('recordsChanged', () => {
            saveData(this.state.records);
        });
        
        this.state.on('settingsChanged', () => {
            saveSettings(this.state.settings);
        });
    }
    
    setupSearchListeners() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        const caseInsensitive = document.getElementById('caseInsensitive');
        const searchError = document.getElementById('searchError');
        
        if (!searchInput) return;
        
        searchInput.addEventListener('input', () => {
            const value = searchInput.value.trim();
            
            if (value) {
                if (clearSearch) clearSearch.classList.remove('hidden');
                
                const flags = caseInsensitive?.checked ? 'gi' : 'g';
                const regex = compileRegex(value, flags);
                
                if (regex) {
                    this.state.setSearchRegex(regex);
                    if (searchError) searchError.classList.add('hidden');
                    searchInput.classList.remove('error');
                } else {
                    this.state.setSearchRegex(null);
                    if (searchError) {
                        searchError.textContent = 'Invalid regex pattern';
                        searchError.classList.remove('hidden');
                    }
                    searchInput.classList.add('error');
                }
            } else {
                if (clearSearch) clearSearch.classList.add('hidden');
                this.state.setSearchRegex(null);
                if (searchError) searchError.classList.add('hidden');
                searchInput.classList.remove('error');
            }
        });
        
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.state.setSearchRegex(null);
                clearSearch.classList.add('hidden');
                if (searchError) searchError.classList.add('hidden');
                searchInput.classList.remove('error');
            });
        }
        
        if (caseInsensitive) {
            caseInsensitive.addEventListener('change', () => {
                if (searchInput.value.trim()) {
                    searchInput.dispatchEvent(new Event('input'));
                }
            });
        }
    }
    
    setupSortListeners() {
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.getAttribute('data-sort');
                const direction = this.state.sortColumn === column && this.state.sortDirection === 'asc' ? 'desc' : 'asc';
                this.state.setSorting(column, direction);
            });
            
            th.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    th.click();
                }
            });
        });
    }
    
    setupImportExportListeners() {
        const importBtn = document.getElementById('importBtn');
        const exportBtn = document.getElementById('exportBtn');
        const importFile = document.getElementById('importFile');
        
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => {
                importFile.click();
            });
        }
        
        if (importFile) {
            importFile.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                try {
                    const data = await importData(file);
                    const validation = validateImportData(data);
                    
                    if (!validation.isValid) {
                        this.ui.showStatus(`Import failed: ${validation.errors.join(', ')}`, 'error');
                        return;
                    }
                    
                    if (confirm(`Import ${validation.validRecords.length} valid records? This will replace existing data.`)) {
                        this.state.setRecords(validation.validRecords);
                        this.ui.showStatus(`Imported ${validation.validRecords.length} transactions successfully`);
                    }
                } catch (err) {
                    this.ui.showStatus(`Import failed: ${err.message}`, 'error');
                }
                
                importFile.value = '';
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportData(this.state.records);
                this.ui.showStatus('Data exported successfully');
            });
        }
    }
    
    setupSettingsListeners() {
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (!saveSettingsBtn) return;
        
        saveSettingsBtn.addEventListener('click', () => {
            const settings = {
                baseCurrency: document.getElementById('baseCurrency').value,
                rates: {
                    EUR: parseFloat(document.getElementById('eurRate').value) || 0.85,
                    GBP: parseFloat(document.getElementById('gbpRate').value) || 0.73
                },
                cap: parseFloat(document.getElementById('monthlyCap').value) || 1000
            };
            
            this.state.setSettings(settings);
            this.ui.showStatus('Settings saved successfully');
        });
    }
    
    handleFormSubmit() {
        const formData = {
            description: document.getElementById('description').value.trim(),
            amount: document.getElementById('amount').value.trim(),
            category: document.getElementById('category').value,
            date: document.getElementById('date').value.trim()
        };
        
        this.ui.clearFormErrors();
        
        const validation = validateRecord(formData);
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                const [field, message] = error.split(': ');
                this.ui.showFieldError(field, message);
            });
            this.ui.showStatus('Please fix the errors in the form', 'error');
            return;
        }
        
        const now = new Date().toISOString();
        
        if (this.state.editingId) {
            // Edit existing record
            this.state.updateRecord(this.state.editingId, {
                description: formData.description,
                amount: formData.amount,
                category: formData.category,
                date: formData.date
            });
            this.ui.showStatus('Transaction updated successfully');
        } else {
            // Add new record
            const newRecord = {
                id: generateId(),
                description: formData.description,
                amount: formData.amount,
                category: formData.category,
                date: formData.date,
                createdAt: now,
                updatedAt: now
            };
            this.state.addRecord(newRecord);
            this.ui.showStatus('Transaction added successfully');
        }
        
        this.ui.hideForm();
        this.state.editingId = null;
    }
    
    // Direct showPage method like working version
    showPage(page) {
        this.state.currentPage = page;
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Show/hide sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.add('hidden');
        });
        const targetSection = document.getElementById(`${page}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.focus();
        }
        
        // Update content based on page
        switch (page) {
            case 'dashboard':
                this.ui.updateDashboard();
                break;
            case 'records':
                this.ui.renderRecords();
                break;
            case 'settings':
                this.ui.loadSettingsForm();
                break;
        }
    }
    
    // Global functions for onclick handlers
    editRecord(id) {
        const record = this.state.records.find(r => r.id === id);
        if (!record) return;
        
        this.state.editingId = id;
        this.ui.showForm('Edit Transaction', record);
    }
    
    deleteRecord(id) {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        
        this.state.deleteRecord(id);
        this.ui.showStatus('Transaction deleted successfully');
    }
}

// Initialize the application when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new FinanceTrackerApp();
    
    // Make functions globally available for onclick handlers
    window.editRecord = (id) => app.editRecord(id);
    window.deleteRecord = (id) => app.deleteRecord(id);
});
