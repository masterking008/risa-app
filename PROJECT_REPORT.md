# RISA LABS - AI Research Platform
## Comprehensive Project Report

---

## Executive Summary

**RISA LABS** is an AI-powered research platform built with Next.js 16 that enables researchers to organize, analyze, and synthesize academic materials through intelligent workspaces. The application leverages Google's Gemini 2.5 Flash AI model to provide advanced document analysis, comparative studies, and interactive chat capabilities for research materials.

**Project Type:** Web Application (Next.js)  
**Version:** 0.1.0  
**Status:** Development/Prototype  
**Primary Technology Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS, Google Gemini AI

---

## 1. Project Architecture

### 1.1 Technology Stack

#### Frontend Framework
- **Next.js 16.0.5** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development

#### UI Components & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Dialog, Scroll Area, Separator, Slot components
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional styling utilities

#### AI Integration
- **@google/generative-ai** (v0.24.1) - Gemini AI SDK
- Model: `gemini-2.5-flash`

#### Content Rendering
- **react-markdown** (v10.1.0) - Markdown rendering
- **remark-math** (v6.0.0) - Math notation support
- **rehype-katex** (v7.0.1) - LaTeX rendering
- **katex** (v0.16.25) - Math typesetting

#### Development Tools
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing
- **@tailwindcss/typography** - Prose styling

### 1.2 Project Structure

```
risa-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── workspace/[id]/       # Dynamic workspace pages
│   │   │   └── page.tsx          # Individual workspace view
│   │   ├── favicon.ico
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── AddItemDialog.tsx     # Add links/PDFs dialog
│   │   ├── AISummaryPanel.tsx    # AI summary panel (legacy)
│   │   ├── ChatBox.tsx           # AI chat interface
│   │   ├── ComparePanel.tsx      # Document comparison
│   │   ├── Header.tsx            # App header
│   │   ├── ItemCard.tsx          # Document card component
│   │   ├── SummarizePanel.tsx    # Document summarization
│   │   └── WorkspaceCard.tsx     # Workspace card
│   │
│   └── lib/                      # Utilities & logic
│       ├── mockAI.ts             # AI integration (Gemini)
│       ├── mockData.ts           # Seed data
│       ├── store.ts              # LocalStorage state management
│       ├── types.ts              # TypeScript interfaces
│       └── utils.ts              # Helper functions
│
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .env                          # Environment variables
├── .env.local                    # Local environment (API keys)
├── .gitignore
├── components.json               # shadcn/ui config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

---

## 2. Core Features & Functionality

### 2.1 Workspace Management

**Purpose:** Organize research materials into dedicated workspaces

**Key Components:**
- `src/app/page.tsx` - Workspace listing and creation
- `src/components/WorkspaceCard.tsx` - Individual workspace cards
- `src/lib/store.ts` - Workspace CRUD operations

**Features:**
- Create multiple workspaces with custom names
- View all workspaces in a responsive grid layout
- Track workspace metadata (creation date, item count)
- Delete and rename workspaces
- LocalStorage persistence

**Data Model:**
```typescript
interface Workspace {
  id: string;
  name: string;
  items: Item[];
  createdAt: string;
  summary?: string;
  lastSummaryAt?: string;
}
```

### 2.2 Document Management

**Purpose:** Add and manage research materials (links and PDFs)

**Key Components:**
- `src/components/AddItemDialog.tsx` - Add items interface
- `src/components/ItemCard.tsx` - Display individual items

**Features:**
- **Dual Input Methods:**
  - URL/Link addition with automatic metadata extraction
  - PDF file upload with local blob URL creation
- **Item Metadata:**
  - Title, URL, domain, type (link/pdf)
  - Addition timestamp
  - Content extraction placeholder
- **Item Management:**
  - Delete items from workspace
  - Visual distinction between links and PDFs

**Data Model:**
```typescript
interface Item {
  id: string;
  type: 'link' | 'pdf';
  title: string;
  url: string;
  domain: string;
  addedAt: string;
  content?: string;
}
```

### 2.3 AI Chat Interface

**Purpose:** Interactive Q&A with AI about research materials

**Key Component:** `src/components/ChatBox.tsx`

**Features:**
- **Real-time Chat:** Send questions and receive AI-generated responses
- **Context-Aware:** AI has access to all workspace items
- **Message History:** Persistent conversation within session
- **Text Highlighting:** Select and highlight important text in responses
- **Markdown Support:** Rich text rendering with LaTeX math support
- **Streaming Responses:** Loading indicators during AI processing

**Technical Implementation:**
- Uses Google Gemini 2.5 Flash model
- Custom prompt engineering to prevent table formatting
- ReactMarkdown with remark-math and rehype-katex plugins
- Highlight persistence per message

**AI Prompt Constraint:**
```javascript
const prompt = `${input}\n\nCRITICAL INSTRUCTION: Never create tables, 
comparison tables, structured tables, or any tabular format...`;
```

### 2.4 Document Summarization

**Purpose:** Generate comprehensive AI summaries of selected documents

**Key Component:** `src/components/SummarizePanel.tsx`

**Features:**
- **Multi-Document Selection:** Choose specific items to summarize
- **Advanced Prompt Engineering:** Uses "Senior Computational Synthesizer" prompt
- **Structured Output:** Generates summaries with:
  - Executive synthesis
  - Methodological categorization
  - Mathematical deconstruction (with LaTeX)
  - Critique and limitation analysis
  - Research gaps identification
- **Chat Integration:** Results appear in chat interface
- **Workspace Persistence:** Summaries saved to workspace

**Prompt Structure:**
1. Mission Statement
2. Core Research Synthesis
3. Mathematical/Algorithmic Deconstruction
4. Critique and Limitation Analysis

### 2.5 Document Comparison

**Purpose:** Comparative analysis of multiple research documents

**Key Component:** `src/components/ComparePanel.tsx`

**Features:**
- **Multi-Select Interface:** Choose 2+ documents to compare
- **Dialectical Analysis:** Identifies convergence and divergence
- **Structured Comparison:**
  - Core points of convergence
  - Core points of divergence
  - Theoretical framework analysis
  - Strengths and weaknesses assessment
  - Synthesis and scholarly judgment
- **Chat Integration:** Results displayed in chat

**Comparison Prompt Focus:**
- Comparative scholarship approach
- Analytical relationships between texts
- Theoretical lens identification
- Academic rigor and depth

---

## 3. State Management & Data Flow

### 3.1 Storage Architecture

**Primary Storage:** Browser LocalStorage  
**Storage Key:** `risa_workspaces_v1`

**Store Functions** (`src/lib/store.ts`):
- `getWorkspaces()` - Retrieve all workspaces
- `saveWorkspaces()` - Persist workspaces to localStorage
- `getWorkspace(id)` - Get single workspace by ID
- `createWorkspace(name)` - Create new workspace
- `addItemToWorkspace(id, url, file?)` - Add item to workspace
- `updateWorkspaceSummary(id, summary)` - Update workspace summary
- `deleteItem(workspaceId, itemId)` - Remove item
- `renameWorkspace(id, newName)` - Rename workspace
- `deleteWorkspace(id)` - Delete workspace

### 3.2 Data Persistence

**Initialization:**
- On first load, seed data from `mockData.ts` is loaded
- Subsequent loads retrieve from localStorage
- Server-side rendering returns seed data (no window object)

**Update Pattern:**
1. User action triggers state update
2. Component state updates immediately (optimistic UI)
3. Store function called to persist to localStorage
4. No backend synchronization (client-only app)

### 3.3 Component Communication

**Parent-Child Props:**
- Workspace data flows down from page components
- Callback functions passed for state updates

**Ref-Based Communication:**
- ChatBox uses `forwardRef` and `useImperativeHandle`
- SummarizePanel and ComparePanel can inject messages into ChatBox
- Enables cross-component AI result display

---

## 4. AI Integration Details

### 4.1 Google Gemini Configuration

**API Setup:**
```typescript
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
```

### 4.2 AI Features Implementation

#### Chat (ChatBox.tsx)
- Direct user input to Gemini
- Custom prompt to prevent table formatting
- Markdown rendering with math support

#### Summarization (mockAI.ts)
- Complex multi-part prompt (Senior Computational Synthesizer)
- Context includes all selected item metadata
- Structured academic output format

#### Comparison (ComparePanel.tsx)
- Comparative Scholar prompt
- Dialectical analysis framework
- Structured comparison output

### 4.3 Prompt Engineering Strategy

**Key Principles:**
1. **Role-Based Prompts:** AI assumes expert personas (Synthesizer, Scholar)
2. **Structured Output:** Explicit section requirements
3. **Format Constraints:** Prevent unwanted formatting (tables)
4. **Academic Rigor:** Emphasis on citations, methodology, critique
5. **Mathematical Support:** LaTeX notation for formulas

---

## 5. User Interface & Experience

### 5.1 Design System

**Color Palette:**
- Primary: `#002669` (Deep Blue)
- Hover: `#001a4d` (Darker Blue)
- Background: White/Slate variations
- Text: Slate-900, Slate-600, Slate-500

**Typography:**
- Primary Font: Inter (Google Fonts)
- Monospace: JetBrains Mono (for code)
- Font Loading: `display: 'swap'` for performance

**Component Library:**
- Custom components built on Radix UI primitives
- Consistent styling with Tailwind CSS
- Responsive design with mobile-first approach

### 5.2 Responsive Design

**Breakpoints:**
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px
- Desktop: > 1024px (lg)

**Layout Adaptations:**

**Home Page:**
- Mobile: Single column workspace cards
- Tablet: 2-column grid
- Desktop: 3-column grid

**Workspace Page:**
- Mobile: Stacked vertical layout (Sources → Chat → Tools)
- Desktop: 3-panel horizontal layout (Sources | Chat | Tools)

### 5.3 Animations

**CSS Animations:**
- `animate-fade-in` - Smooth element appearance
- `animate-scale-in` - Dialog entrance
- `animate-pulse` - Loading indicators
- `animate-spin` - Loading spinners

**Staggered Animations:**
- Workspace cards animate with delay: `animationDelay: ${index * 0.1}s`

---

## 6. Key Technical Implementations

### 6.1 Dynamic Routing

**Workspace Pages:**
- Route: `/workspace/[id]`
- Dynamic parameter extraction: `useParams()`
- 404 handling: Redirect to home if workspace not found

### 6.2 File Upload Handling

**PDF Upload Flow:**
1. User selects PDF via file input
2. File validation (PDF only)
3. Blob URL creation: `URL.createObjectURL(file)`
4. Item created with type 'pdf' and blob URL
5. Stored in workspace items array

**Limitations:**
- No actual PDF text extraction (placeholder content)
- Blob URLs are session-specific
- No backend storage

### 6.3 Markdown & Math Rendering

**Libraries:**
- `react-markdown` - Core markdown parsing
- `remark-math` - Math notation detection
- `rehype-katex` - LaTeX rendering
- `katex` - Math typesetting engine

**Implementation:**
```tsx
<ReactMarkdown 
  remarkPlugins={[remarkMath]} 
  rehypePlugins={[rehypeKatex]}
>
  {content}
</ReactMarkdown>
```

**Styling:**
- Custom prose classes for markdown content
- Different styles for user vs bot messages
- Syntax highlighting for code blocks

### 6.4 Text Highlighting Feature

**Implementation:**
1. User selects text in chat message
2. `window.getSelection()` captures selected text
3. Highlight button appears
4. Click toggles highlight state
5. Highlighted text wrapped in `<mark>` tags
6. Highlights persisted per message ID

---

## 7. Current Limitations & Known Issues

### 7.1 Data Persistence
- **No Backend:** All data stored in browser localStorage
- **No Sync:** Data not synchronized across devices
- **Data Loss Risk:** Clearing browser data deletes all workspaces
- **No User Authentication:** Single-user application

### 7.2 Content Extraction
- **No Real Extraction:** URL and PDF content not actually extracted
- **Placeholder Content:** Mock content used for AI context
- **Limited AI Context:** AI doesn't have access to actual document content

### 7.3 File Handling
- **PDF Limitations:** No text extraction from uploaded PDFs
- **Blob URLs:** Session-specific, not persistent
- **No File Storage:** Files not stored on server

### 7.4 AI Integration
- **API Key Exposure:** API key in `.env.local` (should be server-side)
- **No Rate Limiting:** Unlimited API calls possible
- **Error Handling:** Basic error messages, no retry logic
- **No Streaming:** Responses not streamed (all-or-nothing)

### 7.5 Scalability
- **LocalStorage Limits:** ~5-10MB storage limit
- **Performance:** Large workspaces may cause slowdowns
- **No Pagination:** All items loaded at once

---

## 8. Security Considerations

### 8.1 Current Security Issues

**Critical:**
- ⚠️ **Exposed API Key:** Gemini API key in client-side code
- ⚠️ **No Authentication:** Anyone can access the application
- ⚠️ **No Authorization:** No user-level permissions

**Medium:**
- ⚠️ **XSS Risk:** User input rendered as markdown (mitigated by react-markdown)
- ⚠️ **No Input Validation:** Limited validation on user inputs
- ⚠️ **CORS:** No CORS configuration (client-only app)

### 8.2 Recommended Security Improvements

1. **Move API Key to Backend:**
   - Create API routes in Next.js
   - Store API key in server environment variables
   - Proxy AI requests through backend

2. **Add Authentication:**
   - Implement user authentication (NextAuth.js, Clerk, etc.)
   - User-specific workspaces

3. **Input Sanitization:**
   - Validate all user inputs
   - Sanitize markdown content
   - Rate limiting on AI requests

4. **Data Encryption:**
   - Encrypt sensitive data in localStorage
   - Use secure storage solutions

---

## 9. Performance Analysis

### 9.1 Bundle Size
- Next.js 16 with App Router (optimized)
- React 19 (latest)
- Large dependencies: KaTeX (~500KB), Gemini SDK

### 9.2 Optimization Opportunities

**Code Splitting:**
- Lazy load AI components
- Dynamic imports for heavy libraries
- Route-based code splitting (already implemented)

**Asset Optimization:**
- Image optimization (Next.js Image component)
- Font optimization (already using `display: 'swap'`)
- SVG optimization

**Caching:**
- Cache AI responses
- Implement service worker for offline support
- Cache workspace data

---

## 10. Future Enhancement Recommendations

### 10.1 Backend Integration
- **Database:** PostgreSQL/MongoDB for workspace storage
- **Authentication:** User accounts and authentication
- **API Layer:** RESTful or GraphQL API
- **File Storage:** S3/Cloud Storage for PDFs

### 10.2 Content Extraction
- **URL Scraping:** Implement web scraping for link content
- **PDF Parsing:** Use pdf.js or similar for PDF text extraction
- **OCR:** Optical character recognition for scanned documents
- **Metadata Extraction:** Automatic title, author, date extraction

### 10.3 Advanced AI Features
- **RAG (Retrieval Augmented Generation):** Vector database for document embeddings
- **Citation Tracking:** Track which documents AI references
- **Multi-Model Support:** Support for other AI models (GPT-4, Claude)
- **Custom Fine-Tuning:** Domain-specific model training

### 10.4 Collaboration Features
- **Shared Workspaces:** Multi-user collaboration
- **Comments & Annotations:** Collaborative note-taking
- **Version History:** Track workspace changes
- **Export Options:** PDF, Word, LaTeX export

### 10.5 Enhanced UI/UX
- **Dark Mode:** Theme switching
- **Keyboard Shortcuts:** Power user features
- **Drag & Drop:** Reorder items, organize workspaces
- **Search & Filter:** Advanced search across workspaces
- **Tags & Categories:** Organize items with tags

### 10.6 Mobile Application
- **React Native:** Native mobile app
- **Progressive Web App:** Offline support, installable
- **Mobile-Optimized UI:** Touch-friendly interface

---

## 11. Development Workflow

### 11.1 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### 11.2 Development Server
- **Port:** 3000
- **Hot Reload:** Enabled
- **Turbopack:** Next.js 16 uses Turbopack for faster builds

### 11.3 Environment Setup

**Required Environment Variables:**
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Installation:**
```bash
npm install
npm run dev
```

---

## 12. Dependencies Analysis

### 12.1 Production Dependencies (17)

**Core Framework:**
- `next@16.0.5` - React framework
- `react@19.2.0` - UI library
- `react-dom@19.2.0` - React DOM renderer

**AI Integration:**
- `@google/generative-ai@0.24.1` - Gemini AI SDK

**UI Components:**
- `@radix-ui/react-dialog@1.1.15`
- `@radix-ui/react-scroll-area@1.2.10`
- `@radix-ui/react-separator@1.1.8`
- `@radix-ui/react-slot@1.2.4`

**Styling:**
- `tailwind-merge@3.4.0` - Merge Tailwind classes
- `class-variance-authority@0.7.1` - Component variants
- `clsx@2.1.1` - Conditional classes

**Content Rendering:**
- `react-markdown@10.1.0` - Markdown parser
- `remark-math@6.0.0` - Math notation
- `rehype-katex@7.0.1` - LaTeX rendering
- `katex@0.16.25` - Math typesetting
- `react-katex@3.1.0` - React KaTeX wrapper

**Icons:**
- `lucide-react@0.555.0` - Icon library

### 12.2 Development Dependencies (10)

- `@tailwindcss/postcss@4`
- `@tailwindcss/typography@0.5.19`
- `@types/node@20`
- `@types/react@19`
- `@types/react-dom@19`
- `eslint@9`
- `eslint-config-next@16.0.5`
- `tailwindcss@4`
- `tw-animate-css@1.4.0`
- `typescript@5`

---

## 13. Code Quality & Best Practices

### 13.1 Strengths

✅ **TypeScript Usage:** Full type safety across the application  
✅ **Component Modularity:** Well-organized component structure  
✅ **Responsive Design:** Mobile-first approach  
✅ **Modern React:** Uses latest React 19 features  
✅ **Accessibility:** Radix UI provides accessible primitives  
✅ **Code Organization:** Clear separation of concerns  

### 13.2 Areas for Improvement

⚠️ **Error Handling:** Limited error boundaries and fallbacks  
⚠️ **Testing:** No test suite (Jest, React Testing Library)  
⚠️ **Documentation:** Limited inline code documentation  
⚠️ **Type Coverage:** Some `any` types used (e.g., chatBoxRef)  
⚠️ **API Key Management:** Client-side API key exposure  
⚠️ **State Management:** Could benefit from Context API or Zustand  

---

## 14. Deployment Considerations

### 14.1 Recommended Platforms

**Vercel (Recommended):**
- Native Next.js support
- Automatic deployments from Git
- Edge functions for API routes
- Free tier available

**Alternatives:**
- Netlify
- AWS Amplify
- Railway
- Render

### 14.2 Pre-Deployment Checklist

- [ ] Move API key to server-side environment variables
- [ ] Implement API routes for Gemini calls
- [ ] Add error boundaries
- [ ] Optimize bundle size
- [ ] Add analytics (Google Analytics, Vercel Analytics)
- [ ] Set up monitoring (Sentry)
- [ ] Configure custom domain
- [ ] Add SEO metadata
- [ ] Implement rate limiting
- [ ] Add terms of service and privacy policy

### 14.3 Environment Variables for Production

```env
# Server-side only
GEMINI_API_KEY=your_api_key_here

# Public (if needed)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 15. Conclusion

### 15.1 Project Summary

RISA LABS is a well-architected prototype demonstrating the potential of AI-powered research tools. The application successfully integrates modern web technologies with advanced AI capabilities to create an intuitive research workspace platform.

**Key Achievements:**
- Clean, modular codebase with TypeScript
- Responsive, accessible UI with Radix UI and Tailwind
- Advanced AI integration with Google Gemini
- Sophisticated prompt engineering for academic use cases
- Rich content rendering with markdown and LaTeX support

### 15.2 Production Readiness Assessment

**Current Status:** Prototype/MVP  
**Production Ready:** ❌ No (requires backend, security improvements)

**Critical Blockers:**
1. No backend infrastructure
2. Exposed API keys
3. No user authentication
4. Limited error handling
5. No content extraction

**Estimated Work to Production:**
- Backend setup: 2-3 weeks
- Security hardening: 1 week
- Content extraction: 2-3 weeks
- Testing & QA: 1-2 weeks
- **Total:** 6-9 weeks

### 15.3 Recommended Next Steps

**Immediate (Week 1-2):**
1. Move API key to backend API routes
2. Implement basic error boundaries
3. Add input validation
4. Set up basic analytics

**Short-term (Month 1):**
1. Implement backend with database
2. Add user authentication
3. Implement content extraction
4. Add comprehensive testing

**Long-term (Month 2-3):**
1. Implement RAG for better AI context
2. Add collaboration features
3. Mobile app development
4. Advanced analytics and insights

---

## 16. Technical Specifications

### 16.1 System Requirements

**Development:**
- Node.js 18+ (recommended: 20+)
- npm 9+ or yarn 1.22+
- 4GB RAM minimum
- Modern browser (Chrome, Firefox, Safari, Edge)

**Production:**
- Node.js 18+ runtime
- 512MB RAM minimum (serverless)
- CDN for static assets
- SSL certificate

### 16.2 Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Requiring Modern Browsers:**
- LocalStorage API
- ES6+ JavaScript
- CSS Grid & Flexbox
- Web Fonts

### 16.3 API Rate Limits

**Google Gemini API:**
- Free tier: 60 requests per minute
- Paid tier: Higher limits available
- Current implementation: No rate limiting

---

## 17. Glossary

**RAG:** Retrieval Augmented Generation - AI technique combining retrieval and generation  
**Blob URL:** Temporary URL for local file access in browser  
**LocalStorage:** Browser storage API for persistent data  
**Radix UI:** Unstyled, accessible component library  
**Tailwind CSS:** Utility-first CSS framework  
**KaTeX:** Fast math typesetting library  
**Gemini:** Google's large language model  
**Next.js App Router:** File-system based routing in Next.js 13+  
**Server Components:** React components that render on server  
**Client Components:** React components that render in browser  

---

## 18. Contact & Support

**Project Name:** RISA LABS  
**Developer:** Bhavesh Tanan  
**Email:** bhaveshtanan@gmail.com  
**Repository:** [Add GitHub URL]  
**Documentation:** This report  

---

## Appendix A: File Inventory

### Source Files (TypeScript/TSX)
- `src/app/page.tsx` (118 lines)
- `src/app/layout.tsx` (35 lines)
- `src/app/workspace/[id]/page.tsx` (207 lines)
- `src/components/AddItemDialog.tsx` (137 lines)
- `src/components/AISummaryPanel.tsx` (87 lines)
- `src/components/ChatBox.tsx` (280+ lines)
- `src/components/ComparePanel.tsx` (150+ lines)
- `src/components/SummarizePanel.tsx` (130+ lines)
- `src/components/Header.tsx` (35 lines)
- `src/components/ItemCard.tsx` (estimated 50-80 lines)
- `src/components/WorkspaceCard.tsx` (estimated 80-100 lines)
- `src/lib/mockAI.ts` (100+ lines)
- `src/lib/store.ts` (120 lines)
- `src/lib/types.ts` (16 lines)
- `src/lib/utils.ts` (estimated 20-30 lines)
- `src/lib/mockData.ts` (estimated 50-100 lines)

### Configuration Files
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.js`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `components.json`

### Total Estimated Lines of Code: ~2,000-2,500 lines

---

**Report Generated:** January 2025  
**Version:** 1.0  
**Status:** Complete
