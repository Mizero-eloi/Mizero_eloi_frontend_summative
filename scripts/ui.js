// UI management and DOM manipulation
import { formatCurrency, formatDate } from './state.js';
import { highlightText } from './search.js';

export class UIManager {
    constructor(state) {
        this.state = state;
        this.statusTimeout = null;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Listen to state changes
        this.state.on('recordsChanged', () => this.updateDashboard());
        this.state.on('recordsChanged', () => this.renderRecords());
        this.state.on('pageChanged', (page) => this.showPage(page));
        this.state.on('sortChanged', () => this.updateSortIndicators());
        this.state.on('searchChanged', () => this.renderRecords());
    }
    
    showStatus(message, type = 'success', duration = 5000) {
        const statusEl = document.getElementById('statusMessage');
        if (!statusEl) return;
        
        statusEl.textContent = message;
        statusEl.className = 'status-message ' + type;
        statusEl.classList.remove('hidden');
        
        if (this.statusTimeout) {
            clearTimeout(this.statusTimeout);
        }
        
        this.statusTimeout = setTimeout(() => {
            statusEl.classList.add('hidden');
        }, duration);
    }
    
    showPage(page) {
        // Update navigation

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.state.setCurrentPage(page);
                
                // Scroll to the section
                const section = document.getElementById(`${page}-section`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

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
                this.updateDashboard();
                break;
            case 'records':
                this.renderRecords();
                break;
            case 'settings':
                this.loadSettingsForm();
                break;
        }
    }
    
    updateDashboard() {
        const totalRecords = this.state.records.length;
        const totalSpent = this.state.getTotalSpent();
        const topCategory = this.state.getTopCategory();
        const last7Days = this.state.getLast7DaysSpending();
        
        // Update UI elements
        this.updateElement('totalRecords', totalRecords);
        this.updateElement('totalSpent', formatCurrency(totalSpent));
        this.updateElement('topCategory', topCategory);
        this.updateElement('last7Days', formatCurrency(last7Days));
        
        this.updateCapIndicator();
    }
    
    updateCapIndicator() {
        const capStatus = this.state.getCapStatus();
        const capFill = document.getElementById('capFill');
        const capStatusText = document.getElementById('capStatus');
        const capAlert = document.getElementById('capAlert');
        
        if (!capFill || !capStatusText || !capAlert) return;
        
        capStatusText.textContent = `${formatCurrency(capStatus.totalSpent)} / ${formatCurrency(capStatus.cap)}`;
        capFill.style.width = `${Math.min(capStatus.percentage, 100)}%`;
        
        // Reset classes
        capFill.className = 'cap-fill';
        
        if (capStatus.isOverCap) {
            capFill.classList.add('danger');
            capAlert.textContent = `⚠️ You have exceeded your monthly cap by ${formatCurrency(capStatus.totalSpent - capStatus.cap)}!`;
            capAlert.classList.remove('hidden');
        } else if (capStatus.isNearCap) {
            capFill.classList.add('warning');
            capAlert.textContent = `⚠️ You are at ${capStatus.percentage.toFixed(0)}% of your monthly cap.`;
            capAlert.classList.remove('hidden');
        } else {
            capAlert.classList.add('hidden');
        }
    }
    
    renderRecords() {
        const records = this.state.getFilteredRecords();
        const tbody = document.getElementById('recordsTable');
        const cardsContainer = document.getElementById('recordsCards');
        
        if (!tbody || !cardsContainer) return;
        
        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No records found</td></tr>';
            cardsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">No records found</div>';
            return;
        }
        
        // Render desktop table
        tbody.innerHTML = records.map(record => {
            const desc = this.state.searchRegex ? highlightText(record.description, this.state.searchRegex) : record.description;
            const cat = this.state.searchRegex ? highlightText(record.category, this.state.searchRegex) : record.category;
            const amt = this.state.searchRegex ? highlightText(record.amount.toString(), this.state.searchRegex) : record.amount;
            
            return `
                <tr>
                    <td>${record.date}</td>
                    <td>${desc}</td>
                    <td>${formatCurrency(amt)}</td>
                    <td>${cat}</td>
                    <td>
                        <div class="record-actions">
                            <button class="icon-btn edit" onclick="window.editRecord('${record.id}')" aria-label="Edit transaction">✏️</button>
                            <button class="icon-btn delete" onclick="window.deleteRecord('${record.id}')" aria-label="Delete transaction">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Render mobile cards
        cardsContainer.innerHTML = records.map(record => {
            const desc = this.state.searchRegex ? highlightText(record.description, this.state.searchRegex) : record.description;
            const cat = this.state.searchRegex ? highlightText(record.category, this.state.searchRegex) : record.category;
            const amt = this.state.searchRegex ? highlightText(record.amount.toString(), this.state.searchRegex) : record.amount;
            
            return `
                <div class="record-card" role="listitem">
                    <div class="record-header">
                        <div class="record-amount">${formatCurrency(amt)}</div>
                        <div class="record-category">${cat}</div>
                    </div>
                    <div class="record-description">${desc}</div>
                    <div class="record-date">${record.date}</div>
                    <div class="record-actions-mobile">
                        <button class="icon-btn edit" onclick="window.editRecord('${record.id}')" aria-label="Edit transaction">✏️</button>
                        <button class="icon-btn delete" onclick="window.deleteRecord('${record.id}')" aria-label="Delete transaction">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
        
        this.updateSortIndicators();
        this.toggleViewMode();
    }
    
    toggleViewMode() {
        const tableContainer = document.querySelector('.table-container');
        const cardsContainer = document.getElementById('recordsCards');
        
        if (!tableContainer || !cardsContainer) return;
        
        // Check if we're on mobile (768px breakpoint)
        if (window.innerWidth <= 767) {
            tableContainer.classList.add('hidden');
            cardsContainer.classList.remove('hidden');
        } else {
            tableContainer.classList.remove('hidden');
            cardsContainer.classList.add('hidden');
        }
    }
    
    updateSortIndicators() {
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            th.setAttribute('aria-sort', 'none');
            
            if (th.getAttribute('data-sort') === this.state.sortColumn) {
                th.classList.add(`sort-${this.state.sortDirection}`);
                th.setAttribute('aria-sort', this.state.sortDirection === 'asc' ? 'ascending' : 'descending');
            }
        });
    }
    
    loadSettingsForm() {
        const settings = this.state.settings;
        this.updateElement('baseCurrency', settings.baseCurrency);
        this.updateElement('eurRate', settings.rates.EUR);
        this.updateElement('gbpRate', settings.rates.GBP);
        this.updateElement('monthlyCap', settings.cap);
    }
    
    showForm(title, record = null) {
        const form = document.getElementById('recordForm');
        const formTitle = document.getElementById('formTitle');
        
        if (!form || !formTitle) return;
        
        formTitle.textContent = title;
        form.classList.remove('hidden');
        
        if (record) {
            this.populateForm(record);
        } else {
            this.clearForm();
        }
        
        document.getElementById('description').focus();
    }
    
    hideForm() {
        const form = document.getElementById('recordForm');
        if (form) {
            form.classList.add('hidden');
        }
        this.clearFormErrors();
    }
    
    populateForm(record) {
        this.updateElement('description', record.description);
        this.updateElement('amount', record.amount);
        this.updateElement('category', record.category);
        this.updateElement('date', record.date);
    }
    
    clearForm() {
        const form = document.getElementById('transactionForm');
        if (form) {
            form.reset();
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
        }
        this.clearFormErrors();
    }
    
    showFieldError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);
        
        if (input) input.classList.add('error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }
    
    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
        });
        document.querySelectorAll('input, select').forEach(el => {
            el.classList.remove('error');
        });
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateSearchHelp() {
        const helpContainer = document.getElementById('searchHelp');
        if (helpContainer) {
            helpContainer.innerHTML = `
                <h4>Regex Search Examples:</h4>
                <div class="search-help-content">
                    <div class="search-suggestion">
                        <code>\\.\\d{2}\\b</code> - Find amounts with cents
                    </div>
                    <div class="search-suggestion">
                        <code>(coffee|tea)</code> - Find beverage expenses
                    </div>
                    <div class="search-suggestion">
                        <code>\\b(\\w+)\\s+\\1\\b</code> - Find duplicate words
                    </div>
                    <div class="search-suggestion">
                        <code>^Food</code> - Transactions starting with "Food"
                    </div>
                </div>
            `;
        }
    }
}
