# LiveImpact CRM — Comprehensive Test Case Suite

**Application Under Test:** LiveImpact CRM (`staging.liveimpacts.com`)
**Org context:** Children's Zone (OrgID 11946)
**Test Framework:** Playwright + TypeScript (existing POM: `BasePage`, `LoginPage`, `PageManager`)
**Source material reviewed:** `playwright.config.ts`, `pages/*`, `tests/*.spec.ts`, `tests/login.setup.ts`, recorded `.playwright-mcp/*.yml` page snapshots, `liveimpactap-admin-dashboard.plan.md`, `utils/swapper.ts` (`Handle_PageLoad`), `utils/testData.json`

> This suite extends the existing `liveimpactap-admin-dashboard.plan.md` and the two implemented spec files (`activities.spec.ts`, `forms-feature.spec.ts`). It keeps the same ID/file conventions but adds full coverage for modules that currently only have placeholder/smoke checks (Records CRUD, Payments, Events, Settings drill-down, Forms create/edit/delete, cross-cutting negative & accessibility cases).

---

## 0. Coverage Gap Summary (why these cases were added)

| Module | Existing coverage | Gap addressed here |
|---|---|---|
| Login/Auth | `login.setup.ts` (happy path only) | Invalid creds, empty fields, session expiry, logout |
| Dashboard | Smoke widget checks | Data accuracy, BETA badge links, responsive collapse |
| Records | Menu enumeration only | Add/Edit/Delete record, search, role dropdown (incl. special-char roles), grid pagination |
| Activities | Strong (22 TCs in `activities.spec.ts`) | Full activity CRUD lifecycle, validation |
| Payments | Not covered | Date range filter, totals, grid view, search hints |
| Events | Not covered | Create Event wizard, Archived Events |
| Forms | Good UI coverage in `forms-feature.spec.ts` | Field-level builder, Clone/Archive/Delete actions, Form Data submission flow |
| Settings | Module enumeration only | Drill-down into representative settings pages |
| Cross-cutting | — | Negative testing, security headers, broken links, performance |

---

## 1. Authentication & Session

**Seed:** none (these precede `login.setup.ts`)
**File:** `tests/auth/login.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-AUTH-001 | Successful login with valid credentials | 1. Navigate to base URL 2. Enter valid username/password 3. Click Sign In | Redirected to `/admindash/admin`; Dashboard widgets render |
| TC-AUTH-002 | Login fails with invalid password | Enter valid username + wrong password, submit | Inline error shown; user remains on login page; no redirect |
| TC-AUTH-003 | Login fails with invalid/unregistered username | Enter unregistered email, any password, submit | Generic "invalid credentials" message (no user enumeration) |
| TC-AUTH-004 | Login blocked with empty username | Leave username blank, submit | Field-level required validation; no network call to auth endpoint |
| TC-AUTH-005 | Login blocked with empty password | Leave password blank, submit | Field-level required validation |
| TC-AUTH-006 | Password field masks input | Type in password field | Characters rendered as dots/asterisks, `type="password"` |
| TC-AUTH-007 | Session persists across page reload | Log in, reload `/admindash/admin` | User remains authenticated, dashboard still loads |
| TC-AUTH-008 | Direct deep-link without session redirects to login | Clear storage state, navigate directly to a protected URL (e.g., Records grid URL) | Redirected to login page |
| TC-AUTH-009 | Logout (if control present) clears session | Trigger logout, then revisit dashboard URL | Redirected to login; back button does not restore authenticated view |
| TC-AUTH-010 | SQL/script injection in login fields is rejected safely | Enter `' OR 1=1--` / `<script>alert(1)</script>` in username | No auth bypass; input sanitized/escaped; no JS executed |
| TC-AUTH-011 | Multiple rapid failed logins (rate limiting) | Submit wrong password 5+ times quickly | Account lock/CAPTCHA/delay observed, or documented as gap if absent |

---

## 2. Dashboard

**Seed:** `tests/login.setup.ts`
**File:** `tests/dashboard/dashboard.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-DASH-001 | Dashboard loads all four analytics widgets | Log in | Record Graph YoY, Record Stats, Payment Graph YoY, Payment Stats all render without error |
| TC-DASH-002 | Record Stats values are internally consistent | Inspect Record Stats card | Total Records ≥ New Records (Current FY) ≥ New Records (Current Month) ≥ New Records (Last 7 Days); all are non-negative integers |
| TC-DASH-003 | Percent-change indicators render with correct sign/format | Inspect % change badges (Week/Month/Year over Year) | Format matches `+NN.N%` or `-NN.N%`; color coding (green/red) matches sign |
| TC-DASH-004 | Record Graph YoY x-axis covers rolling 12 months | Inspect chart labels | 12 month abbreviations shown in chronological rolling order (e.g., Jun→May) |
| TC-DASH-005 | Payment Stats currency values format correctly | Inspect Last 7 Days / Current Month / Current FY amounts | Values prefixed with `$`, thousands separator present, 1 decimal in averages |
| TC-DASH-006 | BETA VERSION badge present on all 4 widgets | Inspect each widget header | Badge visible and consistently labeled |
| TC-DASH-007 | Widget help icon opens external documentation | Click help (?) icon on a widget | New tab opens to `help.liveimpact.org` with relevant article; original tab unaffected |
| TC-DASH-008 | Widget overflow/options menu (⋮) is functional | Click the kebab/options icon on a widget | Menu opens with expected actions (e.g., refresh/expand/export) |
| TC-DASH-009 | Dashboard re-fetches data on navigation back | Navigate away to Activities, then back to Dashboard | Widgets reload without stale/blank state |
| TC-DASH-010 | Dashboard handles zero-data state gracefully | (If a fresh/test org with no records is available) Load dashboard | Widgets show "0"/empty-state rather than erroring |
| TC-DASH-011 | New Donors section displays Current Month and Current FY | Inspect "New Donors" sub-section of Payment Stats | Both values present and numeric |

---

## 3. Records Management

**Seed:** `tests/login.setup.ts`
**File:** `tests/records/*.spec.ts`

### 3.1 Navigation & Listing — `tests/records/navigation.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-REC-001 | Records menu expands to show all record types | Click "Records" in sidebar | Submenu expands showing "All Records" + 20+ record-type links (Donors, Board Members, CL-Client, Client, Corporate Volunteers, etc.) |
| TC-REC-002 | "All Records" navigates to consolidated grid | Click "All Records" | URL contains `/manage/0/0/0`; grid loads with Total Records count matching dashboard stat |
| TC-REC-003 | Navigating to a specific record type filters the grid | Click "Donors" under Records | URL changes to that role's manage path; grid header shows "Donors"; rows shown belong to Donors role only |
| TC-REC-004 | Record type with special characters in name renders correctly | Navigate to `Dept1_F'A"T#T$e%s@t!^i&n*g`-scoped role (e.g., Hipaa_SamePin (Dept1...)) | Role name renders without breaking HTML/encoding; no console errors |
| TC-REC-005 | Records grid pagination works | On "All Records" with 6,500+ rows, scroll/paginate | Subsequent pages load distinct records; no duplicate rows across pages |
| TC-REC-006 | Records grid column headers match spec | Inspect grid header row | Columns: Name, ID, Email ID, Role, Record Tags, Entry Date, Update Date (per Form Data view) / equivalent for Records grid |
| TC-REC-007 | Clicking a record name opens record detail/edit view | Click a record's name link (e.g., "Cindy Stroessner") | Record detail or inline edit view opens with that record's data |

### 3.2 Search — `tests/records/search.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-REC-008 | Global "Search Records" returns matching results | Type a known record name in header search box, trigger search | Matching record(s) shown / "GO TO RECORD DASHBOARD" becomes actionable |
| TC-REC-009 | Search with no matches shows empty state | Search a nonsense string (e.g., `zzzqqqxx123`) | "No results" / empty grid message, not an error or stale data |
| TC-REC-010 | Column-level filters narrow grid results | Enter a value in a column filter textbox (e.g., Role filter `= Donors`) | Grid updates to only matching rows |
| TC-REC-011 | "Clear filter" resets all applied filters | Apply a filter, click "Clear filter" | Grid returns to unfiltered full result set; filter inputs reset to empty |
| TC-REC-012 | Search query syntax hints are documented | Click "Search Hints" button | Hints panel/tooltip explains operators (e.g., `=` exact match, `-` exclude, `+` multi-value) |

### 3.3 Create / Edit / Delete — `tests/records/crud.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-REC-013 | "ADD / EDIT" opens Add Record modal | Click "ADD / EDIT" in header | Modal titled "Add Record" appears with Existing/Create New toggle |
| TC-REC-014 | Add Record requires a Role selection | Open Add Record modal, leave Role as "Select Role", click submit | Validation error; record not created |
| TC-REC-015 | Add Record succeeds with required fields | Open modal, fill First/Last Name, Email, select a valid Role, submit | Success confirmation; new record appears in the relevant grid |
| TC-REC-016 | Add Record validates email format | Enter invalid email (e.g., `notanemail`) in Email Address field | Inline validation error; submission blocked |
| TC-REC-017 | "Existing Record" tab allows linking to an existing person | Switch to "Existing Record" tab in modal, search/select a record | Existing record selected without duplicate creation |
| TC-REC-018 | Closing modal via "×" discards unsaved input | Fill partial data, click "×" | Modal closes; no record created; reopening modal shows blank form |
| TC-REC-019 | Edit an existing record's fields | Open a record, modify a field (e.g., phone/email), save | Update Date refreshes; new value persists after page reload |
| TC-REC-020 | Delete a record (where permitted) with confirmation | Trigger delete on a test record | Confirmation dialog appears; confirming removes record from grid; canceling leaves it intact |
| TC-REC-021 | Bulk select via "Select/Deselect All" checkbox | Click header checkbox in grid | All visible row checkboxes toggle accordingly |
| TC-REC-022 | Role dropdown lists roles grouped by department | Open Role dropdown in Add Record modal | Each role shows `RoleName (Department)` format; long list scrollable |

---

## 4. Activities

> Existing `tests/activities.spec.ts` already covers TC-ACT-001 through TC-ACT-022 (navigation, table display, filters, add-activity modal, actions, view options, page elements). The cases below **extend** that file — do not duplicate.

**Seed:** `tests/login.setup.ts`
**File:** `tests/activities/activities-extended.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-ACT-023 | Add Activity end-to-end creates a visible activity | Click Add Activity, select existing record, fill Activity Type/Title/Status/Due Date, submit | New row appears in Activities grid with matching values; Total Activities count increments |
| TC-ACT-024 | Activity Due Date cannot be set to invalid format | Enter free text into Due Date instead of using date picker | Validation blocks save / date picker enforces format |
| TC-ACT-025 | Activity Status dropdown only allows defined values | Inspect Status field options | Matches configured statuses (no blank/duplicate entries) |
| TC-ACT-026 | Editing an activity updates "Update Date" | Edit Title of an existing activity, save | Update Date column reflects today's date; original Entry Date unchanged |
| TC-ACT-027 | Deleting an activity removes it and decrements Total Activities | Delete a test activity | Row removed from grid; Total Activities count decreases by 1 |
| TC-ACT-028 | Activity date-range filter excludes out-of-range activities | Set a narrow date range excluding a known activity's date, click Fetch | That activity is not shown; Total Activities count reflects filtered set |
| TC-ACT-029 | Activity grid "Reference"/"Payment Reference" links navigate correctly | Click a Reference field link on an activity tied to a payment | Navigates to/opens the linked payment record |
| TC-ACT-030 | Multi-select activity rows enables bulk action (if available) | Select 2+ activity checkboxes | Bulk action control (e.g., bulk delete/export) becomes enabled |

---

## 5. Payments

**Seed:** `tests/login.setup.ts`
**File:** `tests/payments/*.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-PAY-001 | Navigate to Payments section | Click "Payments" in sidebar | Payments page loads; URL/title reflects Payments |
| TC-PAY-002 | Payment summary cards render (Total Rows, Total Amount, Amount Pending) | Load Payments page | All three summary tiles show numeric/currency values |
| TC-PAY-003 | Default Payment Entry Date Range is pre-populated (last 365 days) | Inspect Start Date / End Date inputs on load | Start Date = today−1yr, End Date = today (per observed `06/09/2025`–`06/09/2026` pattern) |
| TC-PAY-004 | "Fetch" applies the selected date range | Change Start/End Date, click Fetch | Total Rows count updates to reflect only payments within range |
| TC-PAY-005 | "Clear Filter" resets date range and totals | Apply a custom range, click Clear Filter | Date inputs and totals revert to default state |
| TC-PAY-006 | Add Payment opens payment creation flow | Click "Add Payment" | Payment creation modal/page opens with required fields (Amount, Record, Payment Method, Date) |
| TC-PAY-007 | Add Payment validates required Amount field | Submit Add Payment with Amount blank or 0 | Validation error; payment not created |
| TC-PAY-008 | Add Payment validates Amount is numeric and positive | Enter negative or non-numeric Amount | Validation error blocks submission |
| TC-PAY-009 | Successful payment creation reflects in Total Amount | Create a payment of known amount, reload summary | Total Amount increases by that amount; Total Rows increments by 1 |
| Tc-PAY-010 | Grid View toggle switches payment display mode | Click "Grid View" control | Layout changes (e.g., list vs. card view) without data loss |
| TC-PAY-011 | "Search Hints" on Payments documents query syntax | Click Search Hints | Hint panel appears, consistent with Records/Activities hint format |
| TC-PAY-012 | Payment status filter (COMPLETED/PENDING/PROCESSING/etc.) filters totals | Filter by a specific status if control exists | Total Amount/Amount Pending recalculates for that status only |
| TC-PAY-013 | "MULTI LINK GIFT and MULTI TRANSACTION" indicator is informative | Hover/click the multi-transaction icon | Tooltip or modal explains multi-transaction handling |
| TC-PAY-014 | Fraud/CAPTCHA settings banner is visible and links resolve | On Events page (cross-reference), verify Braintree Fraud Settings and CAPTCHA Threshold Limit links | Both links navigate to correct `help.liveimpact.org` articles in new tab |

---

## 6. Events

**Seed:** `tests/login.setup.ts`
**File:** `tests/events/*.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-EVT-001 | Navigate to Events section | Click "Events" in sidebar | Events page loads with "Create Event" and "Archived Events" buttons visible |
| TC-EVT-002 | Important Note banner about fraud settings is displayed | Load Events page | Banner text and both embedded links render correctly |
| TC-EVT-003 | Event search/filter controls render | Inspect filter row | Event Name, Created By text inputs; Sort By, Type (Events/RSVP/etc.), Status (Active/Inactive/Both) dropdowns present |
| TC-EVT-004 | Filtering by Event Name narrows list | Type a known event's (partial) name, apply | Only matching events shown |
| TC-EVT-005 | Filtering by Type = "RSVP" shows only RSVP events | Select "RSVP" in Type dropdown | List filtered accordingly; "Events"/other types excluded |
| TC-EVT-006 | Filtering by Status = "Inactive" shows only inactive events | Select "Inactive" | Only inactive events listed; default "Active" view excluded |
| TC-EVT-007 | "Create Event" opens event creation wizard | Click "Create Event" | Event creation form/wizard opens (Name, Date, Location, Description, etc.) |
| TC-EVT-008 | Create Event requires Event Name | Submit creation form with Name blank | Validation error; event not created |
| TC-EVT-009 | Successful event creation appears in active events list | Complete required fields, save | New event visible in default (Active) list with correct name |
| TC-EVT-010 | "Archived Events" toggle shows archived-only events | Click "Archived Events" | List switches to archived events; active events hidden |
| TC-EVT-011 | Archiving an active event moves it to Archived list | Archive a test event | Event disappears from Active view, appears under Archived |
| TC-EVT-012 | Deprecated event types are visually marked | Inspect Type dropdown | "Non Ticketing (deprecated)" and "Participant Fundraiser (deprecated)" labeled as deprecated |

---

## 7. Forms

> Existing `tests/forms-feature.spec.ts` covers navigation, Form Design listing, Create Form modal/type-selection, and structural/permission checks (TC-FRM-001 through TC-FRM-050, non-contiguous). The cases below close remaining functional gaps: actual field-level form building, Clone/Archive/Delete actions on existing forms, and the Form Data submission/listing flow.

**Seed:** `tests/login.setup.ts`
**File:** `tests/forms/forms-extended.spec.ts`

### 7.1 Form Design — Field Building & Type Selection

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-FRM-051 | Choose-form-type modal lists all 5 types with descriptions | Click Create Form | BASIC, RECORD, TABULAR, RECORD ROLE DASHBOARD, PAYMENT radio options shown, each with example/description text |
| TC-FRM-052 | BASIC is the default selected type | Open type modal | BASIC radio is pre-checked |
| TC-FRM-053 | Selecting RECORD type and clicking Next proceeds to field builder | Select RECORD, click Next | Field/canvas builder view opens for a Record-associated form |
| TC-FRM-054 | New form requires a Name before save | In field builder, attempt Save with form name blank | Validation error; form not persisted |
| TC-FRM-055 | New form can be saved with name + at least one field | Set form name, add a text field, Save | Form appears in Form Design list with correct Name, Type = "Record", Access shown |
| TC-FRM-056 | Form list search by name filters correctly | Type a known form name into "Search Form Name", click Show Forms | Only matching forms shown |
| TC-FRM-057 | Form list "Select type" filter narrows by type | Select "Payment" in type filter | Only Payment-type forms (e.g., names prefixed `PF_`) shown |
| TC-FRM-058 | Form list "Sort by" options reorder correctly | Select "Created Date (newest)" | List re-sorts; most recently created form (e.g., `RF_LabelField_Testing`, 06/08/2026) appears first |
| TC-FRM-059 | "Show all forms" checkbox toggles full list inclusive of all creation levels | Toggle checkbox | List includes forms across all department/division creation levels |

### 7.2 Form Design — Existing Form Actions

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-FRM-060 | EDIT icon opens existing form in the field builder | Click EDIT on a known form (e.g., `TEST RECORD FORM`) | Builder opens pre-populated with that form's existing fields/settings |
| TC-FRM-061 | CLONE creates a duplicate form with new ID | Click CLONE on a form | New form entry created with same/similar name (e.g., "Copy of ...") and a distinct LID |
| TC-FRM-062 | DELETE removes a form with confirmation | Click DELETE on a disposable test form | Confirmation prompt appears; confirming removes it from the list |
| TC-FRM-063 | DELETE is blocked/warned for forms with existing submissions | Attempt delete on a form known to have Form Data entries | System warns about data loss or blocks deletion outright |
| TC-FRM-064 | ARCHIVE moves form to Archived Forms list | Click ARCHIVE on a test form | Form disappears from default list; appears under "Archived Forms" |
| TC-FRM-065 | Archived form can be restored/unarchived | From Archived Forms, restore a form | Form reappears in main Form Design list |
| TC-FRM-066 | Form "Creation Level" badge reflects correct org hierarchy | Inspect forms created at different levels (e.g., `Dept1_F'A"T#T$e%s@t!^i&n*g` vs "Children's Zone") | Badge text matches the level the form was created at, special characters render safely |

### 7.3 Form Data — Submission & Listing

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-FRM-067 | Form Data page lists submitted entries with correct columns | Navigate to Forms → Form Data | Columns: Name, Type, Form ID, Form Design Update Date, Visibility, Form Creation Level, Fields |
| TC-FRM-068 | Form Data search-by-name filter (`=` exact match) works as documented | Use `=` prefix in Name filter per the inline hint | Only an exact-name match is returned |
| TC-FRM-069 | Form Data status filter (`-` exclude) works as documented | Use `-` prefix per inline hint (e.g., `- Registration`) | Entries matching the excluded term are hidden |
| TC-FRM-070 | "Show Record Role Dashboards" checkbox toggles RRD entries in list | Toggle checkbox | RRD-type forms appear/disappear from Form Data list accordingly |
| TC-FRM-071 | "Archived Forms" view is also accessible from Form Data tab | Click Archived Forms from Form Data page | Archived form designs listed consistently with Form Design's archived view |
| TC-FRM-072 | Submitting a live BASIC form externally creates a Form Data entry | (If a public form URL is testable) Submit a BASIC form | New row appears in Form Data grid tied to that form |

---

## 8. Settings

**Seed:** `tests/login.setup.ts`
**File:** `tests/settings/*.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-SET-001 | Settings page loads full module grid | Navigate to Settings | 30+ module tiles render, each with icon + label (Org Settings, Org Structure, Access, Dashboard Creator, Relationship, Activity Types, Google Authenticator, Payment Details, Embed Paypal, Record Grid View, Payment Grid View, Process Settings, Data Quality, Import from CSV, Tags, Global Values, Create Stat, Global Values Criteria, Badges, SMTP Server, Global Record Fields, Custom Payment Fields, Mailing List, User Dashboard, Profile Plus, Custom Record Types, Global Mail Merge Tags, Reports Mail Merge Tags, Dashboard Widgets, Quickbooks, Contact Portal, Point Of Sale, Esign, Download Connect, External Email Integration, Dashboard Metrics, Text Messaging, PayPal Standalone) |
| TC-SET-002 | Org Settings module opens correctly | Click "Org Settings" tile | Org-level configuration page loads (org name, address, branding, etc.) |
| TC-SET-003 | Org Structure module opens correctly | Click "Org Structure" tile | Department/Division hierarchy view loads |
| TC-SET-004 | Access module opens correctly | Click "Access" tile | User/role access control list loads |
| TC-SET-005 | Activity Types module allows viewing configured types | Click "Activity Types" | List of activity types (matching those used in Activities module, e.g., values seen in Activity Type dropdown) loads |
| TC-SET-006 | Import from CSV module accepts a file upload | Click "Import from CSV", choose a valid CSV | File staged/uploaded; mapping step or confirmation appears |
| TC-SET-007 | Import from CSV rejects non-CSV files | Attempt to upload a `.txt`/`.png` file | Validation error; upload rejected |
| TC-SET-008 | Tags module allows creating a new tag | Click "Tags", add a new tag name, save | Tag appears in tag list and becomes available in Record Tags elsewhere |
| TC-SET-009 | Global Values module lists existing global value sets | Click "Global Values" | Global value groups (referenced in Activity grid as "Global Value Name/Dropdown/Multiselect") are listed |
| TC-SET-010 | SMTP Server settings validate required connection fields | Click "SMTP Server", attempt save with Host blank | Validation error; settings not saved |
| TC-SET-011 | Custom Record Types module allows adding a record type | Click "Custom Record Types", create new type | New type becomes selectable in relevant record-creation flows |
| TC-SET-012 | Badges module displays configured badges | Click "Badges" | Badge list with icons/criteria loads |
| TC-SET-013 | Settings tiles are keyboard-navigable | Tab through Settings grid | Focus ring visible on each tile in logical order; Enter/Space activates |
| TC-SET-014 | Unauthorized user does not see/cannot access Settings | (If a lower-privilege test account is available) Log in as non-admin, check sidebar | "Settings" menu item is hidden or access is blocked with an appropriate message |

---

## 9. Global UI / Navigation / Footer

**Seed:** `tests/login.setup.ts`
**File:** `tests/ui/*.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-UI-001 | Sidebar remains visible and consistent across all sections | Navigate through Dashboard → Records → Activities → Payments → Events → Forms → Settings | Sidebar items and order unchanged on every page; current section indicated as active |
| TC-UI-002 | Sub-menus (Records, Forms, Outreach, Resources, Operations, Reports, Foundation) expand/collapse independently | Click each expandable parent menu item | Only the clicked menu expands; others remain collapsed; re-clicking collapses it |
| TC-UI-003 | Breadcrumb in header reflects current page | Navigate to any section | Header breadcrumb (e.g., "Dashboard / Form Design") matches the active page |
| TC-UI-004 | "Crash Course" and "Tutorials" links open correct external docs | Click each top-bar link | New tab opens to the correct `help.liveimpact.org` page |
| TC-UI-005 | Footer is present and consistent on every page | Scroll to footer on multiple pages | "©2026 LiveImpact", About, Terms and Conditions, Contact Us links all present and correctly targeted |
| TC-UI-006 | Footer social links open in new tabs | Click Facebook/Twitter/LinkedIn icons | Each opens the correct social profile in a new tab; main app tab remains on current page |
| TC-UI-007 | "Terms and Conditions" link points to internal page (not help subdomain) | Click link, inspect URL | Resolves to `/LiveImpactTerms-and-Conditions.htm` |
| TC-UI-008 | No broken links across primary navigation | Crawl all top-level + sub-menu links | All return 200 (no 404 like the one observed at `.playwright-mcp/page-2026-06-09T18-31-26-133Z.yml`) |
| TC-UI-009 | Page does not regress to 404 on internal navigation | Navigate rapidly between sections (stress nav) | No "404 / We're Sorry / The page you are looking for could not be found" page is ever shown for valid internal routes |
| TC-UI-010 | Page title updates per section | Navigate to Form Design, Activities, etc. | `<title>` reflects current section (e.g., "Form Design") |
| TC-UI-011 | Loading indicators appear and clear during navigation | Navigate to a data-heavy page (e.g., All Records) | Loader (`#dashLoading` / `.pace-progress`) appears then disappears within timeout; content fully rendered after |
| TC-UI-012 | No unhandled console errors on core navigation paths | Open DevTools console, navigate through all main sections | Zero uncaught exceptions logged |

---

## 10. Negative, Security & Edge-Case Testing

**Seed:** `tests/login.setup.ts` (except where noted)
**File:** `tests/security/*.spec.ts`, `tests/edge-cases/*.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-NEG-001 | XSS payload in a free-text field is escaped, not executed | Enter `<img src=x onerror=alert(1)>` into a Note/Description field, save, reload | Payload rendered as inert text, not executed as script |
| TC-NEG-002 | Direct URL manipulation to another org's record ID is blocked | Modify a record-detail URL's ID to one outside current org scope | Access denied / not found, not another org's data |
| TC-NEG-003 | CSRF protection on state-changing actions (add/delete) | Inspect network requests for anti-CSRF token on Add Record/Delete | Token present and validated server-side |
| TC-NEG-004 | Session timeout redirects to login | Leave session idle past configured timeout, attempt an action | Redirected to login with a "session expired" indication |
| TC-NEG-005 | Form field max-length is enforced | Paste a 10,000-character string into a short text field (e.g., Tag name) | Input truncated or validation error; no server error |
| TC-NEG-006 | Date filters reject end-date-before-start-date | In Activities/Payments date range, set End Date earlier than Start Date, click Fetch | Validation message; no malformed/empty result silently returned |
| TC-NEG-007 | Concurrent edits to the same record are handled | Open same record in two tabs, edit and save in both | Second save either merges, warns of conflict, or overwrites predictably (documented behavior, not silent data loss) |
| TC-NEG-008 | File upload (CSV import, logo upload forms) rejects oversized files | Upload a file exceeding documented size limit | Clear size-limit error; no server crash |
| TC-NEG-009 | API/network failure during fetch shows graceful error, not blank screen | Throttle/block network mid-fetch (e.g., Payments Fetch call) | User-facing error/retry state shown instead of indefinite spinner or blank panel |
| TC-NEG-010 | Browser back/forward through CRM sections doesn't duplicate data submissions | Submit Add Activity, click Back, click Forward, resubmit unintentionally | No duplicate record created from cached form resubmission |
| TC-NEG-011 | HIPAA/PIN-protected record roles enforce field-level masking | View a record under a Hipaa_SamePin/Hipaa_MultiPin role as a non-privileged user | Protected fields masked/hidden per configuration |
| TC-NEG-012 | Special characters in org/department names don't break rendering elsewhere | Verify all UI surfaces referencing `Dept1_F'A"T#T$e%s@t!^i&n*g` (Role dropdowns, Form Creation Level badges) | Name renders literally and safely everywhere it appears, no truncation/encoding bugs |

---

## 11. Performance & Accessibility (smoke-level)

**Seed:** `tests/login.setup.ts`
**File:** `tests/perf-a11y/*.spec.ts`

| ID | Title | Steps | Expected Result |
|---|---|---|---|
| TC-PERF-001 | Dashboard initial load completes within budget | Measure time from navigation to widgets rendered | Within an agreed SLA (e.g., < 5s on staging) |
| TC-PERF-002 | All Records grid (6,500+ rows) renders without freezing UI | Load All Records | Page remains responsive; virtualization/pagination evident, not a single unbounded DOM render |
| TC-A11Y-001 | Primary nav is screen-reader accessible | Run automated a11y scan (e.g., axe) on Dashboard/Records/Activities | No critical violations on landmark roles, link names, form labels |
| TC-A11Y-002 | Form inputs have associated labels/placeholders for assistive tech | Inspect Add Record / Add Activity modals | Every input has accessible name (label, aria-label, or placeholder at minimum) |
| TC-A11Y-003 | Color contrast on key status indicators (% change badges) meets WCAG AA | Run contrast check on green/red percentage badges | Contrast ratio ≥ 4.5:1 for text |

---

## Appendix A — File/ID Naming Convention (for implementation)

Follow the pattern already established in this repo:
```
tests/<module>/<feature>.spec.ts
```
e.g. `tests/payments/payment-filters.spec.ts`, `tests/events/create-event.spec.ts`

Test IDs use prefix per module: `AUTH`, `DASH`, `REC`, `ACT` (continues existing numbering from `activities.spec.ts`), `PAY`, `EVT`, `FRM` (continues existing numbering from `forms-feature.spec.ts`), `SET`, `UI`, `NEG`, `PERF`, `A11Y`.

## Appendix B — Suggested `PageManager` extensions

To implement these cases cleanly, extend `pages/PageManager.ts` with new page objects mirroring `LoginPage`'s pattern:
- `DashboardPage`
- `RecordsPage`
- `PaymentsPage`
- `EventsPage`
- `FormsPage` (Form Design + Form Data)
- `SettingsPage`

Each should extend `BasePage` and reuse `utils/swapper.ts`'s `Handle_PageLoad(page)` after every navigation, consistent with current conventions (`Handle_PageLoad` waits on `#dashLoading`, `.pace-progress`, and network idle).

## Appendix C — Test Data Notes

- Current `utils/testData.json` points at a single staging org (`11946` / Children's Zone) with a real-looking dataset (6,438+ records). **Destructive test cases (Delete/Archive in REC, FRM, EVT sections) should target dedicated disposable test fixtures**, not production-like seed data such as `Donors`, `Board Members`, etc.
- Consider adding a `testData.fixtures.json` with IDs of safe-to-mutate records/forms (e.g., forms already named `*_Testing`, `RF_Reproduce_Issue`) so destructive specs are deterministic and idempotent on rerun.
