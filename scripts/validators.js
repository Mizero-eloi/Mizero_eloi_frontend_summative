// Enhanced validators with advanced regex patterns
export const validators = {
    description: {
        pattern: /^\S(?:.*\S)?$/,
        test: function(val) {
            if (!val || typeof val !== 'string') return false;
            const trimmed = val.trim();
            
            // No leading/trailing spaces
            if (!this.pattern.test(trimmed)) return false;
            
            // No double spaces
            if (/\s{2,}/.test(trimmed)) return false;
            
            // No duplicate words (advanced back-reference)
            if (/\b(\w+)\s+\1\b/i.test(trimmed)) return false;
            
            // Minimum length
            if (trimmed.length < 2) return false;
            
            return true;
        },
        message: 'Description must be 2+ characters, no leading/trailing/double spaces, and no duplicate words'
    },
    
    amount: {
        pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
        test: function(val) {
            if (!val || typeof val !== 'string') return false;
            const trimmed = val.trim();
            
            if (!this.pattern.test(trimmed)) return false;
            
            const num = parseFloat(trimmed);
            return !isNaN(num) && num >= 0 && num <= 999999.99;
        },
        message: 'Valid amount required (0-999999.99, e.g., 12.50)'
    },
    
    date: {
        pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        test: function(val) {
            if (!val || typeof val !== 'string') return false;
            const trimmed = val.trim();
            
            if (!this.pattern.test(trimmed)) return false;
            
            const date = new Date(trimmed);
            const today = new Date();
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            
            return date >= oneYearAgo && date <= today;
        },
        message: 'Date must be YYYY-MM-DD format, within the last year'
    },
    
    category: {
        pattern: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
        test: function(val) {
            if (!val || typeof val !== 'string') return false;
            const trimmed = val.trim();
            
            if (!this.pattern.test(trimmed)) return false;
            
            return trimmed.length >= 2 && trimmed.length <= 50;
        },
        message: 'Category must be 2-50 characters, letters, spaces, and hyphens only'
    },
    
    // Advanced regex patterns for search
    searchPatterns: {
        cents: /\.\d{2}\b/,
        beverage: /(coffee|tea|juice|soda|water)/i,
        duplicateWords: /\b(\w+)\s+\1\b/,
        startsWith: function(word) { return new RegExp('^' + word, 'i'); },
        containsAmount: /\$\d+(?:\.\d{2})?/,
        timePattern: /\b\d{1,2}:\d{2}\b/,
        emailPattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
        phonePattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/
    }
};

export function validateRecord(record) {
    const errors = [];
    
    if (!validators.description.test(record.description)) {
        errors.push('description: ' + validators.description.message);
    }
    
    if (!validators.amount.test(record.amount.toString())) {
        errors.push('amount: ' + validators.amount.message);
    }
    
    if (!validators.date.test(record.date)) {
        errors.push('date: ' + validators.date.message);
    }
    
    if (!validators.category.test(record.category)) {
        errors.push('category: ' + validators.category.message);
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

export function validateImportData(data) {
    if (!Array.isArray(data)) {
        return { isValid: false, errors: ['Data must be an array'] };
    }
    
    const validRecords = [];
    const errors = [];
    
    data.forEach((record, index) => {
        if (!record.id || !record.description || !record.amount || !record.category || !record.date) {
            errors.push(`Record ${index + 1}: Missing required fields`);
            return;
        }
        
        const validation = validateRecord(record);
        if (validation.isValid) {
            validRecords.push(record);
        } else {
            errors.push(`Record ${index + 1}: ${validation.errors.join(', ')}`);
        }
    });
    
    return {
        isValid: validRecords.length > 0,
        validRecords: validRecords,
        errors: errors
    };
}
