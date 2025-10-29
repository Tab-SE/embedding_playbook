# Tableau Cloud Configuration

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Tableau Cloud Configuration
NEXT_PUBLIC_TABLEAU_BASE_URL=https://prod-useast-b.online.tableau.com
NEXT_PUBLIC_TABLEAU_SITE_ID=embeddingplaybook
```

## Current Configuration

The system is currently configured to use:
- **Base URL**: `https://prod-useast-b.online.tableau.com`
- **Site ID**: `embeddingplaybook`

## Authentication

The navigation system uses Tableau's REST API for authentication. Users will need to provide their Tableau Cloud credentials to access their dashboards.

## Features

- ✅ Real Tableau Cloud authentication
- ✅ Dynamic dashboard loading
- ✅ Folder-based organization
- ✅ Search functionality
- ✅ Responsive design
- ✅ Dark mode optimized

## Testing

To test the system:
1. Navigate to the Safety Dashboard page
2. Click "Sign In to Tableau" in the navigation panel
3. Enter your Tableau Cloud credentials
4. Browse and select dashboards from your site
