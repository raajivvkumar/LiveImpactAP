# LiveImpactAP Admin Dashboard - Comprehensive Test Plan

## Application Overview

The LiveImpactAP Admin Dashboard is a comprehensive CRM management system with multiple modules including Records, Activities, Payments, Events, Forms, and Settings. This test plan covers functional testing across all major sections including navigation, CRUD operations, data filtering, form interactions, and error handling.

## Test Scenarios

### 1. Navigation and Dashboard

**Seed:** `tests/login.setup.ts`

#### 1.1. Verify Dashboard loads with analytics widgets

**File:** `tests/dashboard/load-dashboard.spec.ts`

**Steps:**
  1. -
    - expect: Dashboard page loads successfully
    - expect: Record Graph YoY widget is displayed
    - expect: Record Stats widget shows 6,438 total records
    - expect: Payment Graph YoY widget is displayed
    - expect: Payment Stats widget is displayed
  2. -
    - expect: All widgets display data correctly

#### 1.2. Navigate between main menu sections

**File:** `tests/navigation/menu-navigation.spec.ts`

**Steps:**
  1. -
    - expect: Dashboard menu item is visible and clickable
  2. -
    - expect: Records section expands showing sub-categories
    - expect: Activities, Payments, Events, Forms, Settings menu items are visible
  3. -
    - expect: Each menu item navigates to correct section

#### 1.3. Access Dashboard from different sections

**File:** `tests/navigation/dashboard-access.spec.ts`

**Steps:**
  1. -
    - expect: Dashboard link is accessible from all sections
  2. -
    - expect: Dashboard navigates correctly from Activities section
  3. -
    - expect: Dashboard navigates correctly from Payments section

### 2. Records Management

**Seed:** `tests/login.setup.ts`

#### 2.1. Expand Records menu and view all record types

**File:** `tests/records/view-record-types.spec.ts`

**Steps:**
  1. -
    - expect: Records menu expands
    - expect: All Records link is visible
    - expect: Multiple record type categories are listed
    - expect: At least 25 record types are displayed including: Clients, Donors, Board Members, Volunteers

#### 2.2. Navigate to All Records view

**File:** `tests/records/navigate-all-records.spec.ts`

**Steps:**
  1. -
    - expect: All Records link is clickable
    - expect: Records management page loads
    - expect: Records grid/table is displayed

#### 2.3. Navigate to specific record type

**File:** `tests/records/view-specific-record-type.spec.ts`

**Steps:**
  1. -
    - expect: Donors record type link is clickable
    - expect: Donors list page loads and displays donor records
  2. -
    - expect: Clients record type navigates correctly
  3. -
    - expect: Prospects record type navigates correctly

#### 2.4. Search for record using search box

**File:** `tests/records/search-records.spec.ts`

**Steps:**
  1. -
    - expect: Search Records textbox is visible in header
    - expect: User can type in search box
  2. -
    - expect: GO TO RECORD DASHBOARD button is visible
    - expect: Button is clickable

### 3. Activities Management

**Seed:** `tests/login.setup.ts`

#### 3.1. Access Activities section

**File:** `tests/activities/access-activities.spec.ts`

**Steps:**
  1. -
    - expect: Activities menu item is clickable
    - expect: Activities page loads
    - expect: Activities section title is displayed

#### 3.2. View Activity dashboard with statistics

**File:** `tests/activities/view-activity-dashboard.spec.ts`

**Steps:**
  1. -
    - expect: Total Activities widget displays
    - expect: Total Unique Records widget displays
    - expect: Activity Entry Date Range filter is visible
  2. -
    - expect: Grid View dropdown is available
    - expect: Clear filter button is visible

#### 3.3. Click Add Activity button

**File:** `tests/activities/add-activity-button.spec.ts`

**Steps:**
  1. -
    - expect: Add Activity button is visible and clickable

#### 3.4. Filter activities by date range

**File:** `tests/activities/filter-activities-date.spec.ts`

**Steps:**
  1. -
    - expect: Activity Entry Date Range filter shows date inputs
    - expect: Start date and end date fields are present
  2. -
    - expect: Fetch button is clickable
  3. -
    - expect: Fetching activities by date range works

#### 3.5. View Activity grid with multiple columns

**File:** `tests/activities/view-activity-grid.spec.ts`

**Steps:**
  1. -
    - expect: Activity grid displays with headers: Record ID, First Name, Last Name, Record Tags
    - expect: Activity Role, Type, Status, Due Date, Completed Date columns are visible
  2. -
    - expect: Select All checkbox is present
  3. -
    - expect: View Activity Details button is available

#### 3.6. Clear activity filters

**File:** `tests/activities/clear-activity-filters.spec.ts`

**Steps:**
  1. -
    - expect: Clear filter button is visible
  2. -
    - expect: Clicking Clear filter resets all filters

### 4. Forms Management

**Seed:** `tests/login.setup.ts`

#### 4.1. Access Forms section and view submenus

**File:** `tests/forms/access-forms.spec.ts`

**Steps:**
  1. -
    - expect: Forms menu expands
    - expect: Form Design submenu is visible
    - expect: Form Data submenu is visible

#### 4.2. Navigate to Form Design

**File:** `tests/forms/navigate-form-design.spec.ts`

**Steps:**
  1. -
    - expect: Form Design link is clickable
    - expect: Form Design page loads
    - expect: Form Design interface is displayed

#### 4.3. Navigate to Form Data

**File:** `tests/forms/navigate-form-data.spec.ts`

**Steps:**
  1. -
    - expect: Form Data link is clickable

### 5. Events Management

**Seed:** `tests/login.setup.ts`

#### 5.1. Access Events section

**File:** `tests/events/access-events.spec.ts`

**Steps:**
  1. -
    - expect: Events menu item is clickable
    - expect: Events page loads
    - expect: Events interface is displayed

#### 5.2. Verify Events page functionality

**File:** `tests/events/events-page-elements.spec.ts`

**Steps:**
  1. -
    - expect: Events page title is displayed

### 6. Payments Management

**Seed:** `tests/login.setup.ts`

#### 6.1. Access Payments section

**File:** `tests/payments/access-payments.spec.ts`

**Steps:**
  1. -
    - expect: Payments menu item is clickable
    - expect: Payments page loads

### 7. Settings Configuration

**Seed:** `tests/login.setup.ts`

#### 7.1. Access Settings section and view all modules

**File:** `tests/settings/access-settings.spec.ts`

**Steps:**
  1. -
    - expect: Settings menu item is clickable
    - expect: Settings page loads
    - expect: Settings modules grid is displayed

#### 7.2. Verify all Settings modules are visible

**File:** `tests/settings/verify-settings-modules.spec.ts`

**Steps:**
  1. -
    - expect: Org Settings module is visible and clickable
    - expect: Org Structure module is visible and clickable
    - expect: Access module is visible and clickable
  2. -
    - expect: Dashboard Creator is available
    - expect: Relationship settings available
    - expect: Activity Types settings available
  3. -
    - expect: Payment Details settings available
    - expect: Record Grid View settings available
    - expect: Global Values settings available
  4. -
    - expect: Tags settings available
    - expect: Badges settings available
    - expect: Custom Record Types available
  5. -
    - expect: At least 30 settings modules are displayed

#### 7.3. Navigate to Org Settings

**File:** `tests/settings/org-settings.spec.ts`

**Steps:**
  1. -
    - expect: Org Settings module is clickable

#### 7.4. Navigate to Access settings

**File:** `tests/settings/access-settings-module.spec.ts`

**Steps:**
  1. -
    - expect: Access settings module is clickable

#### 7.5. Navigate to Activity Types settings

**File:** `tests/settings/activity-types-settings.spec.ts`

**Steps:**
  1. -
    - expect: Activity Types settings module is clickable

### 8. UI Elements and Interactions

**Seed:** `tests/login.setup.ts`

#### 8.1. Verify header navigation controls

**File:** `tests/ui/header-controls.spec.ts`

**Steps:**
  1. -
    - expect: Organization/Logo is displayed in header
    - expect: Dashboard toggle button is visible
  2. -
    - expect: Breadcrumb navigation is visible
  3. -
    - expect: ADD / EDIT button is visible in header

#### 8.2. Verify sidebar navigation is persistent

**File:** `tests/ui/sidebar-persistent.spec.ts`

**Steps:**
  1. -
    - expect: Left sidebar remains visible when navigating
    - expect: Menu structure stays consistent

#### 8.3. Verify footer elements

**File:** `tests/ui/footer-elements.spec.ts`

**Steps:**
  1. -
    - expect: Footer displays copyright information
    - expect: About, Terms and Conditions, Contact Us links are visible
  2. -
    - expect: Social media links are present

#### 8.4. Verify help resources are accessible

**File:** `tests/ui/help-resources.spec.ts`

**Steps:**
  1. -
    - expect: Crash Course link is visible and clickable
    - expect: Tutorials link is visible and clickable

#### 8.5. Verify responsive menu toggle

**File:** `tests/ui/menu-toggle.spec.ts`

**Steps:**
  1. -
    - expect: Menu toggle button is present in mobile view
    - expect: Clicking toggle expands/collapses menu

### 9. Data Filtering and Search

**Seed:** `tests/login.setup.ts`

#### 9.1. Search Records using global search

**File:** `tests/search/global-search.spec.ts`

**Steps:**
  1. -
    - expect: Search Records input accepts text
    - expect: Placeholder text shows Search Records

#### 9.2. Apply and clear filters in Activities

**File:** `tests/filters/activities-filters.spec.ts`

**Steps:**
  1. -
    - expect: Date range filters are applied
    - expect: Activities grid updates based on filters
  2. -
    - expect: Clear filter button removes all active filters

#### 9.3. Use Grid View dropdown

**File:** `tests/filters/grid-view-dropdown.spec.ts`

**Steps:**
  1. -
    - expect: Grid View dropdown displays available views
    - expect: ActivityGridView1 is a default option
    - expect: All Roles option is available

#### 9.4. Search Hints functionality

**File:** `tests/filters/search-hints.spec.ts`

**Steps:**
  1. -
    - expect: Search Hints button is clickable
    - expect: Hints popup or panel appears

### 10. Dashboard Analytics

**Seed:** `tests/login.setup.ts`

#### 10.1. Verify Record Graph YoY displays correctly

**File:** `tests/analytics/record-graph-yoy.spec.ts`

**Steps:**
  1. -
    - expect: Record Graph YoY widget is visible
    - expect: Chart displays months from Jun to May
    - expect: Cumulative and New Record Count data is shown
  2. -
    - expect: Y-axis shows values from 0 to 8k

#### 10.2. Verify Record Stats widget

**File:** `tests/analytics/record-stats.spec.ts`

**Steps:**
  1. -
    - expect: Total Records stat shows 6,438
    - expect: New Records (Last 7 Days) shows 52
  2. -
    - expect: New Records (Current Month) shows 52
    - expect: New Records (Current FY) shows 398
  3. -
    - expect: Percent changes are calculated and displayed

#### 10.3. Verify Payment Graph YoY

**File:** `tests/analytics/payment-graph-yoy.spec.ts`

**Steps:**
  1. -
    - expect: Payment Graph YoY widget displays
    - expect: Chart shows Payment Amount and # Payments data

#### 10.4. Verify Payment Stats widget

**File:** `tests/analytics/payment-stats.spec.ts`

**Steps:**
  1. -
    - expect: Last 7 Days Amount shows $112
    - expect: Last 7 Days Count shows (1)
    - expect: Last 7 Days Average shows $112.0
  2. -
    - expect: Current Month Amount shows $7,849
    - expect: Current FY Amount shows $107,393
  3. -
    - expect: Donor Retention FY shows 89 with +15.6% change
  4. -
    - expect: New Donor FY shows 270

#### 10.5. Access help links on analytics widgets

**File:** `tests/analytics/widget-help-links.spec.ts`

**Steps:**
  1. -
    - expect: Help link icon is visible on each widget
    - expect: Clicking help link opens external documentation

#### 10.6. Access beta version badges

**File:** `tests/analytics/beta-badges.spec.ts`

**Steps:**
  1. -
    - expect: BETA VERSION badges are visible on analytics widgets

### 11. Error Handling and Edge Cases

**Seed:** `tests/login.setup.ts`

#### 11.1. Handle invalid date range in Activities filter

**File:** `tests/error-handling/invalid-date-range.spec.ts`

**Steps:**
  1. -
    - expect: System handles end date before start date gracefully
    - expect: Error message displayed if applicable

#### 11.2. Handle empty search results

**File:** `tests/error-handling/empty-search-results.spec.ts`

**Steps:**
  1. -
    - expect: Searching for non-existent record displays appropriate message
    - expect: No results message is clear

#### 11.3. Handle slow page loading

**File:** `tests/error-handling/page-loading.spec.ts`

**Steps:**
  1. -
    - expect: Loading indicators appear when navigating between sections

#### 11.4. Verify console errors are logged

**File:** `tests/error-handling/console-errors.spec.ts`

**Steps:**
  1. -
    - expect: Application logs errors appropriately to console
    - expect: No critical errors prevent functionality

### 12. Cross-Section Navigation

**Seed:** `tests/login.setup.ts`

#### 12.1. Navigate from Dashboard to Records

**File:** `tests/navigation/dashboard-to-records.spec.ts`

**Steps:**
  1. -
    - expect: User can navigate from Dashboard to Records
    - expect: Records page loads correctly

#### 12.2. Navigate from Activities to Forms

**File:** `tests/navigation/activities-to-forms.spec.ts`

**Steps:**
  1. -
    - expect: User can navigate from Activities to Forms
    - expect: Forms section expands and loads

#### 12.3. Navigate from Settings back to Dashboard

**File:** `tests/navigation/settings-to-dashboard.spec.ts`

**Steps:**
  1. -
    - expect: User can navigate from Settings back to Dashboard

#### 12.4. Verify breadcrumb navigation

**File:** `tests/navigation/breadcrumb.spec.ts`

**Steps:**
  1. -
    - expect: Breadcrumb shows current page location
