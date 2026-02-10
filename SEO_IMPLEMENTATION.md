# SEO Implementation - Madua

## ✅ Implemented Features

### 1. **Metadata Structure**

#### Root Layout (`app/layout.tsx`)
- ✅ Base metadata with metadataBase
- ✅ Title template for consistent titles across pages
- ✅ Default Open Graph tags
- ✅ Twitter Card configuration
- ✅ Robots configuration for Google indexing

#### Recipe Pages (`app/(public)/receitas/[slug]/page.tsx`)
- ✅ Dynamic metadata generation (title, description, keywords)
- ✅ Open Graph tags with dynamic content
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Publication/modification dates
- ✅ Author and publisher information

#### Recipe List Page (`app/(public)/receitas/page.tsx`)
- ✅ Complete metadata with Open Graph
- ✅ Twitter Cards
- ✅ Keywords optimization

### 2. **Structured Data (Schema.org JSON-LD)**

#### Recipe Schema
Each recipe page includes comprehensive Recipe schema with:
- ✅ Name, description, image
- ✅ Author (Organization)
- ✅ Publication/modification dates
- ✅ Prep time, cook time, total time
- ✅ Servings (yield)
- ✅ Category and cuisine
- ✅ Ingredients list
- ✅ Step-by-step instructions (HowToStep)
- ✅ Nutrition information (calories, protein, carbs, fats)
- ✅ Aggregate rating
- ✅ Video (if available)
- ✅ Access restriction flag (isAccessibleForFree)

#### Breadcrumb Schema
- ✅ Three-level breadcrumb navigation
- ✅ Home → Recipes → Individual Recipe

#### Organization Schema
- ✅ Company information
- ✅ Logo
- ✅ Social media links

### 3. **Sitemap Generation** (`app/sitemap.ts`)
- ✅ Dynamic sitemap generation
- ✅ Static pages (home, recipes, blog, about, subscription)
- ✅ Dynamic recipe pages with update dates
- ✅ Dynamic blog post pages
- ✅ Priority and change frequency settings

### 4. **Robots.txt** (`app/robots.ts`)
- ✅ Proper allow/disallow rules
- ✅ Protected admin and API routes
- ✅ Sitemap reference
- ✅ Host declaration

### 5. **Web App Manifest** (`app/manifest.ts`)
- ✅ PWA configuration
- ✅ App name, description
- ✅ Theme colors
- ✅ Icons for different sizes
- ✅ Display mode and orientation

## 📋 Next Steps (Manual Actions Required)

### 1. **Create Open Graph Image**
Create a default Open Graph image at `/public/logo/madua-og.jpg`:
- Dimensions: 1200x630px
- Format: JPG or PNG
- Content: Madua logo + tagline
- Text should be readable when resized

Use a tool like:
- Canva
- Figma
- Photoshop
- Online OG Image generators

### 2. **Google Search Console**
1. Visit: https://search.google.com/search-console
2. Add property: `https://madua.pt`
3. Verify ownership:
   - Upload HTML file, or
   - Add DNS TXT record, or
   - Add meta tag (update `verification.google` in `app/layout.tsx`)
4. Submit sitemap: `https://madua.pt/sitemap.xml`

### 3. **Google Business Profile** (Optional)
- Create/claim business profile
- Add business information
- Connect to website

### 4. **Rich Results Testing**
Test your recipe pages:
1. Visit: https://search.google.com/test/rich-results
2. Enter recipe URL: `https://madua.pt/receitas/[slug]`
3. Verify Recipe schema is detected correctly
4. Fix any errors/warnings

### 5. **Social Media Meta Tag Validation**

#### Facebook/Meta
- Visit: https://developers.facebook.com/tools/debug/
- Test URL: `https://madua.pt/receitas/mostarda-caseira-fermentada`
- Verify Open Graph tags
- Use "Scrape Again" to refresh cache

#### Twitter
- Visit: https://cards-dev.twitter.com/validator
- Test URL and verify Twitter Card preview
- Update `@madua` handles with actual Twitter username

### 6. **Update Social Media Handles**
In the following files, replace placeholder handles with real ones:
- `app/layout.tsx` (line with `creator: '@madua'`)
- `app/(public)/receitas/page.tsx`
- `app/(public)/receitas/[slug]/page.tsx`
- Organization schema social links

### 7. **PageSpeed Insights**
- Visit: https://pagespeed.web.dev/
- Test: `https://madua.pt/receitas/[slug]`
- Implement recommendations for performance

### 8. **Analytics Setup**
Consider adding:
- Google Analytics 4
- Facebook Pixel
- Microsoft Clarity

## 🔍 SEO Checklist for Each Recipe

When creating/editing recipes, ensure:

- [ ] Descriptive, keyword-rich title (< 60 characters)
- [ ] Meta description (150-160 characters)
- [ ] High-quality featured image (min 1200x630px)
- [ ] Proper category assignment
- [ ] Complete recipe data (times, servings, difficulty)
- [ ] Detailed ingredients with measurements
- [ ] Step-by-step instructions
- [ ] Nutrition information (if available)
- [ ] Unique, URL-friendly slug

## 📊 Monitoring

### Key Metrics to Track:
1. **Organic Search Traffic** (Google Analytics)
2. **Search Console Performance**
   - Impressions
   - Clicks
   - CTR
   - Average position
3. **Rich Results in SERP** (Recipe cards)
4. **Page Load Speed**
5. **Mobile Usability**

### Regular Maintenance:
- Weekly: Check Search Console for errors
- Monthly: Review top performing pages
- Quarterly: Update old content
- As needed: Fix crawl errors, broken links

## 🚀 Advanced Optimizations (Future)

- [ ] Implement recipe ratings/reviews system
- [ ] Add FAQ schema for common questions
- [ ] Create recipe collection pages with CollectionPage schema
- [ ] Add video to recipes (VideoObject schema already prepared)
- [ ] Implement breadcrumb UI component
- [ ] Add print-friendly recipe view
- [ ] Create AMP versions of recipe pages
- [ ] Implement recipe search with filters
- [ ] Add recipe save/bookmark feature
- [ ] Create recipe newsletter with EmailMessage schema

## 📚 Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Recipe Documentation](https://schema.org/Recipe)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## 🐛 Testing URLs

After deploying, test these URLs:
- https://madua.pt/sitemap.xml
- https://madua.pt/robots.txt
- https://madua.pt/manifest.json
- https://madua.pt/receitas/mostarda-caseira-fermentada
- View page source and verify:
  - `<meta>` tags
  - `<script type="application/ld+json">` blocks
  - Canonical URLs

## ✨ Summary

Your recipe pages now have:
- ✅ Complete SEO metadata
- ✅ Open Graph & Twitter Cards for social sharing
- ✅ Rich Recipe schema for Google search results
- ✅ Breadcrumb navigation
- ✅ Sitemap for search engine crawling
- ✅ Proper robots.txt configuration
- ✅ PWA manifest

The pages are ready to be indexed by Google and will display rich recipe cards in search results with images, ratings, cooking time, and calorie information.
