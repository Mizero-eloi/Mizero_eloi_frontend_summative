// State management for the application
export class AppState {
    constructor() {
        this.records = [];
        this.settings = {
            baseCurrency: 'USD',
            rates: { EUR: 0.85, GBP: 0.73 },
            cap: 1000
        };
        this.currentPage = 'dashboard';
        this.editingId = null;
        this.sortColumn = 'date';
        this.sortDirection = 'desc';
        this.searchRegex = null;
        this.listeners = new Map();
    }
    
    // Event system
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
    
    // State updates
    setRecords(records) {
        this.records = records;
        this.emit('recordsChanged', records);
    }
    
    addRecord(record) {
        this.records.push(record);
        this.emit('recordAdded', record);
        this.emit('recordsChanged', this.records);
    }
    
    updateRecord(id, updates) {
        const index = this.records.findIndex(r => r.id === id);
        if (index !== -1) {
            this.records[index] = { ...this.records[index], ...updates, updatedAt: new Date().toISOString() };
            this.emit('recordUpdated', this.records[index]);
            this.emit('recordsChanged', this.records);
        }
    }
    
    deleteRecord(id) {
        const index = this.records.findIndex(r => r.id === id);
        if (index !== -1) {
            const deleted = this.records.splice(index, 1)[0];
            this.emit('recordDeleted', deleted);
            this.emit('recordsChanged', this.records);
        }
    }
    
    setSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.emit('settingsChanged', this.settings);
    }
    
    setCurrentPage(page) {
        this.currentPage = page;
        this.emit('pageChanged', page);
    }
    
    setSorting(column, direction) {
        this.sortColumn = column;
        this.sortDirection = direction;
        this.emit('sortChanged', { column, direction });
    }
    
    setSearchRegex(regex) {
        this.searchRegex = regex;
        this.emit('searchChanged', regex);
    }
    
    // Computed properties
    getTotalSpent() {
        return this.records.reduce((sum, record) => sum + parseFloat(record.amount), 0);
    }
    
    getTopCategory() {
        const categories = {};
        this.records.forEach(record => {
            categories[record.category] = (categories[record.category] || 0) + parseFloat(record.amount);
        });
        
        const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : '-';
    }
    
    getLast7DaysSpending() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        return this.records
            .filter(record => new Date(record.date) >= sevenDaysAgo)
            .reduce((sum, record) => sum + parseFloat(record.amount), 0);
    }
    
    getCapStatus() {
        const totalSpent = this.getTotalSpent();
        const cap = this.settings.cap;
        const percentage = (totalSpent / cap) * 100;
        
        return {
            totalSpent,
            cap,
            percentage,
            isOverCap: percentage >= 100,
            isNearCap: percentage >= 80
        };
    }
    
    getFilteredRecords() {
        let records = [...this.records];
        
        // Apply search filter
        if (this.searchRegex) {
            records = records.filter(record => 
                this.searchRegex.test(record.description) ||
                this.searchRegex.test(record.category) ||
                this.searchRegex.test(record.amount.toString())
            );
        }
        
        // Apply sorting
        records.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];
            
            if (this.sortColumn === 'amount') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        return records;
    }
}

// Utility functions
export function generateId() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export function formatCurrency(amount, currency = 'USD') {
    const symbols = { USD: '$', EUR: '€', GBP: '£' };
    const symbol = symbols[currency] || '$';
    return symbol + parseFloat(amount).toFixed(2);
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
