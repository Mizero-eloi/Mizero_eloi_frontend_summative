// Storage module for localStorage operations
export const STORAGE_KEY = 'financeTracker:data';
export const SETTINGS_KEY = 'financeTracker:settings';

export function loadData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

export function saveData(records) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

export function loadSettings() {
    try {
        const settings = localStorage.getItem(SETTINGS_KEY);
        return settings ? JSON.parse(settings) : {
            baseCurrency: 'USD',
            rates: { EUR: 0.85, GBP: 0.73 },
            cap: 1000
        };
    } catch (error) {
        console.error('Error loading settings:', error);
        return {
            baseCurrency: 'USD',
            rates: { EUR: 0.85, GBP: 0.73 },
            cap: 1000
        };
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

export function exportData(records) {
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-tracker-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

export function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                if (!Array.isArray(data)) {
                    throw new Error('Invalid format: must be an array');
                }
                resolve(data);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}
