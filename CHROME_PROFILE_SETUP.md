# Chrome Persistent Profile Setup Guide

## Overview
This project is now configured to use a persistent Chrome user data directory. This means:
- ✅ Chrome browser will reuse the same profile across test runs
- ✅ No need to start a fresh browser instance each time
- ✅ User preferences, extensions, and cache persist
- ✅ Storage state (cookies, localStorage) is maintained

## How It Works

### Chrome User Data Directory
The configuration uses a persistent `chrome-user-data` directory stored locally:
```
project-root/
├── chrome-user-data/          # ← Persistent Chrome profile folder
│   ├── Default/
│   ├── Cache/
│   ├── Local Storage/
│   └── ... (Chrome profile data)
├── tests/
├── playwright.config.ts
└── ...
```

## Configuration Details

### File: `playwright.config.ts`
The Playwright configuration now includes:
```typescript
launchArgs: [
  `--user-data-dir=${path.join(process.cwd(), "chrome-user-data")}`,
],
```

This tells Playwright to:
1. Use the `chrome-user-data` directory as Chrome's user data directory
2. Reuse the same profile across test runs
3. Persist all browser data between test executions

## Running Tests

### First Run
```bash
npm test
```
- Chrome will create the user data directory
- Profile will be initialized with your test configuration
- StorageState will be applied from `Project_auth/storageState.json`

### Subsequent Runs
```bash
npm test
```
- Chrome will reuse the existing `chrome-user-data` directory
- All previous session data is preserved
- Tests run faster as profile is already initialized

## Important Notes

### 1. **Do NOT Commit `chrome-user-data` Folder**
The folder is already in `.gitignore`:
```
chrome-user-data/
```
This is local machine-specific and should not be version controlled.

### 2. **CI/CD Environment**
For CI/CD pipelines (GitHub Actions, Jenkins, etc.):
- The `chrome-user-data` directory will be created fresh on each run
- This is expected behavior for automated testing
- StorageState from `Project_auth/storageState.json` will be used instead

### 3. **Manual Profile Management**
To reset the Chrome profile:
```bash
rm -rf chrome-user-data/
```
Then run tests again to create a fresh profile.

### 4. **Viewing Chrome Profile Data**
To inspect what's stored in the profile:
```bash
# On macOS/Linux
open chrome-user-data/

# On Windows
explorer chrome-user-data\
```

You'll see Chrome's standard profile structure:
- `Default/` - Main profile data
- `Local Storage/` - Persistent local storage
- `Cookies` - Session cookies
- `Cache` - Cached files
- `Preferences` - Browser settings

## Troubleshooting

### Profile is Locked
**Issue:** "Chrome user data directory is locked" error
**Solution:**
```bash
# Kill any Chrome processes
pkill -f chrome

# Then run tests again
npm test
```

### Profile Corruption
**Issue:** Tests fail with "Profile error" or "Preferences error"
**Solution:**
```bash
# Delete the corrupted profile
rm -rf chrome-user-data/

# Run tests to create a fresh profile
npm test
```

### Tests Still Starting Fresh Browser
**Issue:** Chrome still launches as a new instance each time
**Solution:**
1. Check `playwright.config.ts` has the `launchArgs` setting
2. Verify `chrome-user-data` directory exists in project root
3. Ensure no conflicting options in your test code

## Best Practices

1. **Keep Profile Clean**
   - Periodically delete and recreate the profile to ensure consistency
   - Use `rm -rf chrome-user-data/` before major test runs

2. **Backup Your Profile**
   - If you need a specific profile state, copy the entire directory:
     ```bash
     cp -r chrome-user-data/ chrome-user-data-backup/
     ```

3. **Combined with StorageState**
   - The persistent profile works alongside `storageState.json`
   - Both mechanisms preserve authentication and session data

4. **Local Development vs CI**
   - Local: Profile persists for faster iteration
   - CI: Fresh profile each run for consistency

## Related Files
- `playwright.config.ts` - Main configuration
- `Project_auth/storageState.json` - Session state storage
- `.gitignore` - Excludes profile from version control

## Need Help?
For more details on Playwright configuration:
- [Playwright Browser Contexts](https://playwright.dev/docs/api/class-browsercontext)
- [Chrome User Data](https://chromium.googlesource.com/chromium/src/+/main/docs/user_data_dir.md)
