#!/bin/bash
# SEO Deployment Script for ultimaitech.com
# This script helps verify and prepare your SEO optimizations for deployment

echo "================================================="
echo "  ultimAItech.com SEO Deployment Verification"
echo "================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "sitemap.xml" ]; then
    echo -e "${RED}❌ Error: sitemap.xml not found. Are you in the website root directory?${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found sitemap.xml${NC}"

# Check for robots.txt
if [ -f "robots.txt" ]; then
    echo -e "${GREEN}✓ Found robots.txt${NC}"
else
    echo -e "${RED}❌ Missing robots.txt${NC}"
fi

# Check for updated HTML files
echo ""
echo "Checking HTML files for SEO updates..."
files=("index.html" "services.html" "technology.html" "pricing.html" "about.html" "contact.html")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        # Check for canonical tag
        if grep -q 'rel="canonical"' "$file"; then
            echo -e "${GREEN}✓ $file has canonical tag${NC}"
        else
            echo -e "${YELLOW}⚠ $file missing canonical tag${NC}"
        fi
        
        # Check for structured data
        if grep -q 'application/ld+json' "$file"; then
            echo -e "${GREEN}✓ $file has structured data${NC}"
        else
            echo -e "${YELLOW}⚠ $file missing structured data${NC}"
        fi
        
        # Check for Open Graph tags
        if grep -q 'og:title' "$file"; then
            echo -e "${GREEN}✓ $file has Open Graph tags${NC}"
        else
            echo -e "${YELLOW}⚠ $file missing Open Graph tags${NC}"
        fi
        
        # Check for analytics
        if grep -q 'plausible.io' "$file"; then
            echo -e "${GREEN}✓ $file has analytics script${NC}"
        else
            echo -e "${YELLOW}⚠ $file missing analytics${NC}"
        fi
    else
        echo -e "${RED}❌ $file not found${NC}"
    fi
    echo ""
done

# Check .htaccess
if [ -f ".htaccess" ]; then
    if grep -q 'RewriteEngine On' ".htaccess"; then
        echo -e "${GREEN}✓ .htaccess has rewrite rules${NC}"
    else
        echo -e "${YELLOW}⚠ .htaccess exists but may be incomplete${NC}"
    fi
else
    echo -e "${YELLOW}⚠ .htaccess not found (may not be needed for your server)${NC}"
fi

echo ""
echo "================================================="
echo "  Pre-Deployment Checklist"
echo "================================================="
echo ""
echo "Before deploying to ultimaitech.com, ensure:"
echo ""
echo "[ ] 1. All files backed up"
echo "[ ] 2. Tested changes locally"
echo "[ ] 3. Ready to submit sitemap to Google Search Console"
echo "[ ] 4. Ready to activate Plausible Analytics (or GA4)"
echo "[ ] 5. Social media profiles created (LinkedIn, Twitter)"
echo ""
echo "================================================="
echo "  Files Ready for Deployment"
echo "================================================="
echo ""
echo "Modified/New files:"
echo "  • sitemap.xml (new)"
echo "  • robots.txt (new)"
echo "  • .htaccess (updated)"
echo "  • index.html (updated)"
echo "  • services.html (updated)"
echo "  • technology.html (updated)"
echo "  • pricing.html (updated)"
echo "  • about.html (updated)"
echo "  • contact.html (updated)"
echo ""
echo "Reference documents:"
echo "  • SEO_NEXT_STEPS.md (post-deployment actions)"
echo "  • .gemini/antigravity/brain/.../walkthrough.md (full documentation)"
echo ""
echo -e "${GREEN}✓ Verification complete!${NC}"
echo ""
echo "To deploy: Upload all modified files to your production server"
echo "Then follow the steps in SEO_NEXT_STEPS.md"
echo ""
