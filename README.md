# BMN Workspace

This workspace contains multiple projects organized for clarity and maintainability.

## Projects

### 📁 wordpress/
Complete WordPress installation for the BMN website.

**Contents:**
- WordPress core files
- Themes and plugins
- Media uploads
- Configuration files

### 📁 invoice-generator/
Automated invoice generation system for Global Ginger Traders.

**Features:**
- HTML-based invoice templates
- PDF generation capability
- QR code integration for payments (UPI, Razorpay)
- Email campaign performance reports

**Quick Start:**
```bash
cd invoice-generator
npm install
node src/scripts/generate.js
```

See [invoice-generator/README.md](invoice-generator/README.md) for detailed documentation.

### 📁 archive/
Backup and legacy files preserved for reference.

## Directory Structure

```
BMN/
├── wordpress/              # WordPress site
├── invoice-generator/     # Invoice generation project
│   ├── src/
│   │   ├── templates/    # HTML templates
│   │   └── scripts/      # Generation scripts
│   ├── assets/           # QR codes and images
│   ├── output/           # Generated PDFs
│   └── package.json
├── archive/              # Backups and legacy files
└── README.md
```

## Last Updated
February 5, 2026
