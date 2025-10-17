# Student Finance Tracker

A comprehensive, accessible, and responsive vanilla HTML/CSS/JavaScript application for tracking student expenses with advanced regex search capabilities and modern UI/UX.

## 🚀 Live Demo

https://youtu.be/oqNA59fkWl0

## 📋 Features

### Core Functionality

- **📊 Real-time Dashboard**: Live statistics including total spent, top category, and 7-day trends
- **💳 Transaction Management**: Add, edit, and delete transactions with full validation
- **🔍 Advanced Regex Search**: Powerful search with pattern matching and highlighting
- **💾 Data Persistence**: Automatic saving to localStorage with import/export capabilities
- **💰 Multi-currency Support**: Base currency with manual exchange rates
- **🎯 Spending Caps**: Monthly budget tracking with visual indicators and alerts

### Technical Features

- **📱 Responsive Design**: Mobile-first approach with card layout for small screens
- **♿ Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support
- **🎨 Modern UI**: Smooth animations, transitions, and hover effects
- **🧩 Modular Architecture**: Clean ES6 modules for maintainable code
- **✅ Comprehensive Testing**: Built-in test suite for validation and functionality

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: Modular ES6 modules
- **Storage**: localStorage for data persistence
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties
- **Testing**: Custom test suite with regex validation

## 📁 Project Structure

```
summative/
├── index.html              # Main application
├── tests.html              # Test suite
├── seed.json               # Sample data
├── README.md               # This file
├── styles/
│   └── main.css            # Main stylesheet
├── scripts/
│   ├── app.js              # Main application controller
│   ├── state.js            # State management
│   ├── storage.js          # localStorage operations
│   ├── ui.js               # UI management
│   ├── validators.js       # Form validation
│   └── search.js           # Search functionality
└── assets/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser with ES6 module support
- Local web server (for module loading)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/summative.git
   cd summative
   ```

2. **Start a local server**

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Running Tests

1. Open `tests.html` in your browser
2. Click "Run Regex Tests" to validate all patterns
3. Use the interactive tester to experiment with custom patterns
4. Run function tests to verify core functionality

## 🔍 Regex Patterns Catalog

### Form Validation Patterns

| Pattern                                            | Purpose                                             | Example                     |
| -------------------------------------------------- | --------------------------------------------------- | --------------------------- |
| `^\S(?:.*\S)?$`                                    | Description validation (no leading/trailing spaces) | `"Lunch at cafeteria"` ✅   |
| `^(0\|[1-9]\d*)(\.\d{1,2})?$`                      | Amount validation                                   | `"12.50"` ✅, `"012.50"` ❌ |
| `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | Date validation (YYYY-MM-DD)                        | `"2025-10-15"` ✅           |
| `^[A-Za-z]+(?:[ -][A-Za-z]+)*$`                    | Category validation                                 | `"Food & Drink"` ✅         |

### Advanced Search Patterns

| Pattern                 | Purpose                               | Example Match           |
| ----------------------- | ------------------------------------- | ----------------------- |
| `\.\d{2}\b`             | Find amounts with cents               | `"12.50"`, `"89.99"`    |
| `(coffee\|tea)`         | Find beverage expenses                | `"Coffee with friends"` |
| `\b(\w+)\s+\1\b`        | Find duplicate words (back-reference) | `"coffee coffee"`       |
| `^Food`                 | Transactions starting with "Food"     | `"Food expenses"`       |
| `\$\d+`                 | Find dollar amounts                   | `"$25.30"`              |
| `2025-10`               | Find October 2025 transactions        | `"2025-10-15"`          |
| `(Entertainment\|Food)` | Find entertainment or food            | `"Movie tickets"`       |
| `\b\d{2}\.\d{2}\b`      | Find decimal amounts                  | `"12.50"`               |

### Advanced Regex Features

1. **Back-references**: `\b(\w+)\s+\1\b` - Captures and references duplicate words
2. **Lookahead/Lookbehind**: Used in complex validation patterns
3. **Character classes**: `[A-Za-z]` for letter-only validation
4. **Quantifiers**: `{1,2}` for precise decimal places
5. **Anchors**: `^` and `$` for exact string matching

## ⌨️ Keyboard Navigation

| Key             | Action                                |
| --------------- | ------------------------------------- |
| `Tab`           | Navigate through interactive elements |
| `Enter`/`Space` | Activate buttons and links            |
| `Escape`        | Close forms and dialogs               |
| `Arrow Keys`    | Navigate within forms                 |
| `Ctrl+S`        | Save current form (planned)           |

## ♿ Accessibility Features

- **Semantic HTML**: Proper use of landmarks, headings, and roles
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Focus Management**: Visible focus indicators and logical tab order
- **Live Regions**: Dynamic content updates announced to screen readers
- **Skip Links**: Quick navigation to main content
- **Color Contrast**: WCAG AA compliant color schemes
- **Keyboard Only**: Full functionality without mouse

## 📱 Responsive Design

### Breakpoints

- **Mobile**: ≤ 767px (Card layout)
- **Tablet**: 768px - 1023px (2-column grid)
- **Desktop**: ≥ 1024px (4-column grid, table view)

### Mobile Features

- Card-based transaction display
- Touch-friendly buttons and inputs
- Optimized form layouts
- Swipe gestures (planned)

## 🧪 Testing

### Test Coverage

- **Regex Validation**: All form validation patterns
- **Function Testing**: Core application functions
- **Interactive Testing**: Custom regex pattern testing
- **Edge Cases**: Boundary conditions and error handling

### Running Tests

1. Open `tests.html`
2. Tests run automatically on page load
3. Use interactive tester for custom patterns
4. All tests show pass/fail status with details

## 📊 Data Model

### Transaction Record

```json
{
  "id": "txn_001",
  "description": "Lunch at cafeteria",
  "amount": "12.50",
  "category": "Food",
  "date": "2025-10-15",
  "createdAt": "2025-10-15T12:30:00.000Z",
  "updatedAt": "2025-10-15T12:30:00.000Z"
}
```

### Settings

```json
{
  "baseCurrency": "USD",
  "rates": {
    "EUR": 0.85,
    "GBP": 0.73
  },
  "cap": 1000
}
```

## 🔧 Configuration

### Default Categories

- Food
- Books
- Transport
- Entertainment
- Fees
- Other

### Currency Support

- USD (default)
- EUR
- GBP
- Custom exchange rates

## 🚀 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)
4. Access via `https://username.github.io/repository-name`

### Other Platforms

- **Netlify**: Drag and drop deployment
- **Vercel**: Git integration
- **Firebase Hosting**: CLI deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- ALU (African Leadership University) for the project requirements
- Modern web standards for accessibility guidelines
- The open-source community for inspiration and tools

## 📈 Future Enhancements

- [ ] Dark mode toggle
- [ ] CSV export functionality
- [ ] Data visualization charts
- [ ] Offline support with service workers
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Budget planning features
- [ ] Receipt photo upload
- [ ] Expense categorization AI
- [ ] Social sharing features

## 🐛 Known Issues

- Mobile card layout needs refinement on very small screens
- Regex help could be more interactive
- Import validation could be more robust
- Settings persistence needs error handling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/summative/issues) page
2. Create a new issue with detailed description
3. Contact: your.email@example.com

---

**Built with ❤️ for students managing their finances**
