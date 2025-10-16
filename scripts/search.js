// Search functionality with regex compilation and highlighting
export function compileRegex(input, flags = 'i') {
    if (!input || typeof input !== 'string') return null;
    
    try {
        return new RegExp(input.trim(), flags);
    } catch (error) {
        console.warn('Invalid regex pattern:', input, error.message);
        return null;
    }
}

export function highlightText(text, regex) {
    if (!regex || !text) return String(text);
    
    const textStr = String(text);
    return textStr.replace(regex, function(match) {
        return '<mark>' + match + '</mark>';
    });
}

export function searchRecords(records, searchRegex) {
    if (!searchRegex) return records;
    
    return records.filter(function(record) {
        return searchRegex.test(record.description) ||
               searchRegex.test(record.category) ||
               searchRegex.test(record.amount.toString()) ||
               searchRegex.test(record.date);
    });
}

export function getSearchSuggestions() {
    return [
        { pattern: '\\.\\d{2}\\b', description: 'Find amounts with cents' },
        { pattern: '(coffee|tea)', description: 'Find beverage expenses' },
        { pattern: '\\b(\\w+)\\s+\\1\\b', description: 'Find duplicate words' },
        { pattern: '^Food', description: 'Transactions starting with "Food"' },
        { pattern: '\\$\\d+', description: 'Find dollar amounts' },
        { pattern: '2025-10', description: 'Find October 2025 transactions' },
        { pattern: '(Entertainment|Food)', description: 'Find entertainment or food' },
        { pattern: '\\b\\d{2}\\.\\d{2}\\b', description: 'Find decimal amounts' }
    ];
}

export function createSearchHelp() {
    const suggestions = getSearchSuggestions();
    return suggestions.map(s => 
        `<div class="search-suggestion">
            <code>${s.pattern}</code> - ${s.description}
        </div>`
    ).join('');
}
