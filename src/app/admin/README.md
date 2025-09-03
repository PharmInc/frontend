# Admin Panel - Institute Onboarding

## Overview

This admin panel provides a comprehensive interface for onboarding new medical institutions to the PharmInc platform. The panel is designed with security in mind and is hidden from search engines.

## Features

### 🔒 Security & SEO Protection
- **No Search Engine Indexing**: Multiple layers of protection including:
  - `robots.txt` directives in metadata
  - `noindex, nofollow, noarchive, nosnippet` meta tags
  - X-Robots-Tag headers
  - No sitemap inclusion

### 🏥 Institution Onboarding
- **Admin Account Creation**: Create admin accounts for institutions
- **Institution Profile Setup**: Comprehensive institution information collection
- **Image Upload System**: Support for:
  - Institution logos
  - Banner images  
  - Certificate/license documents
- **Data Validation**: Client-side validation with error handling
- **Auto-verification**: Admin-created institutions are pre-verified

### 📋 Form Fields

#### Admin Details
- First Name (Required)
- Last Name (Required)
- Email (Required)
- Password (Required, min 6 chars)

#### Institution Information
- Institution Name (Required)
- Location (Required)
- Institution Type (Required)
- Description
- Website
- Phone Number
- Established Year
- License Number
- Accreditation
- Specializations (Multiple)

#### Media Uploads
- Logo Upload
- Banner Upload
- Certificate Upload

## File Structure

```
/admin/
├── layout.tsx                    # Main admin layout with SEO protection
├── page.tsx                     # Admin dashboard with navigation
└── 5d7076d5-8936-4d03-9007-b0ea9c20425d/
    ├── layout.tsx               # Onboarding layout
    └── page.tsx                 # Institute onboarding form
```

## Usage

### Accessing the Admin Panel
1. Navigate to `/admin` for the main dashboard
2. Click "Start Onboarding" to access the institute onboarding form
3. Direct access: `/admin/5d7076d5-8936-4d03-9007-b0ea9c20425d`

### Onboarding Process
1. **Fill Admin Details**: Create the admin user account
2. **Institution Information**: Add all institution details
3. **Specializations**: Add multiple specialization tags
4. **Upload Images**: Add logo, banner, and certificates
5. **Submit**: Creates account, institution, and uploads all data
6. **Auto-redirect**: Redirects to the new institution profile

## Technical Details

### Image Upload Flow
1. Get presigned URL from `/api/presigned-url`
2. Upload directly to MinIO storage
3. Confirm upload via `/api/confirm-upload`
4. Store URLs in institution profile

### API Integration
- Uses existing auth system for account creation
- Leverages institution API for profile creation
- Integrates with image upload infrastructure
- Auto-fetches institution data after creation

### Error Handling
- Client-side form validation
- Real-time error display
- Upload progress indicators
- Success/failure notifications

## Security Considerations

⚠️ **Important Security Notes:**
- This admin panel should only be accessible to authorized personnel
- The URL contains a UUID to prevent easy discovery
- Multiple SEO protection layers prevent search engine indexing
- All uploads go through secure presigned URL system
- Admin-created institutions are automatically verified

## Future Enhancements

- [ ] Admin authentication/authorization
- [ ] User management interface
- [ ] Content moderation tools
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] Institution management tools
