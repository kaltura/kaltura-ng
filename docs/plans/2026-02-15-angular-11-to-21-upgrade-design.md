# Angular 11 to 21 Upgrade Design

**Date:** 2026-02-15
**Status:** Approved
**Timeline:** 3-4 weeks (moderate)

## Overview

This document outlines the strategy for upgrading the kaltura-ng monorepo from Angular 11 to Angular 21, spanning 10 major versions. The project is a library monorepo publishing 5 Angular packages built on PrimeNG, consumed by 1-2 applications under our control.

### Project Context

- **Project Type:** Monorepo of Angular libraries
- **Current State:** Angular 11.1.1, Node 12, PrimeNG 11.2.0
- **Target State:** Angular 21.x, Node 20, PrimeNG 21.x
- **Codebase:** 176 TypeScript files across 5 library packages
- **Consumers:** 1-2 applications (under our control)
- **Goal:** Active maintenance with Angular 21 compatibility

### Library Packages

1. `@kaltura-ng/kaltura-logger` - Logging utilities (no dependencies)
2. `@kaltura-ng/kaltura-common` - Common utilities (no dependencies)
3. `@kaltura-ng/kaltura-ui` - UI components (depends on common)
4. `@kaltura-ng/kaltura-primeng-ui` - PrimeNG components (depends on common, ui)
5. `@kaltura-ng/mc-shared` - Shared module (depends on common, ui)

---

## 1. Overall Architecture & Strategy

### Three-Phase Upgrade Path

We will upgrade through three milestone versions to validate breaking changes incrementally:

**Phase 1: Angular 11 → 14**
- **Node:** 12 → 14 (required for Angular 14)
- **PrimeNG:** 11.2.0 → 14.x
- **Timeline:** ~1 week
- **Key Changes:**
  - View Engine removal (v13) - Ivy compilation mandatory
  - Strictly typed forms
  - Remove deprecated @angular/http package
  - ViewChild/ContentChild static flags

**Phase 2: Angular 14 → 17**
- **Node:** 14 → 18 (required for Angular 17)
- **PrimeNG:** 14.x → 17.x
- **Timeline:** ~1 week
- **Key Changes:**
  - Standalone components available
  - Signals introduced (v16)
  - RxJS 7.x upgrade (breaking changes)
  - Router guard changes
  - Improved TypeScript support

**Phase 3: Angular 17 → 21**
- **Node:** 18 → 20 (required for Angular 21)
- **PrimeNG:** 17.x → 21.x
- **Timeline:** ~1-2 weeks
- **Key Changes:**
  - New control flow syntax (@if/@for) available
  - Zoneless change detection preparation
  - Latest TypeScript improvements
  - Modern build optimizations

### Why These Milestone Versions?

- **v14:** Last version before standalone components become prominent, gets us past View Engine removal (v13) and includes strictly-typed forms
- **v17:** Major stabilization point with Signals (v16), modern development features
- **v21:** Target version with latest features and performance improvements

### Branch Strategy

Each phase gets its own feature branch:
```
master
├── feature/upgrade-to-angular-14
├── feature/upgrade-to-angular-17
└── feature/upgrade-to-angular-21
```

Merge to master after successfully testing each phase. This provides stable checkpoints for rollback.

### Library Build Order

Due to internal dependencies (visible in tsconfig paths), libraries must be upgraded and built in this order:

1. `@kaltura-ng/kaltura-logger` (no dependencies)
2. `@kaltura-ng/kaltura-common` (no dependencies)
3. `@kaltura-ng/kaltura-ui` (depends on common)
4. `@kaltura-ng/kaltura-primeng-ui` (depends on common, ui)
5. `@kaltura-ng/mc-shared` (depends on common, ui)

---

## 2. Migration Process & Tooling

### Angular Update Process (Per Phase)

Each phase follows this standard workflow:

#### 1. Update Angular CLI & Core Packages

```bash
# Phase 1 Example
ng update @angular/cli@14 @angular/core@14

# Phase 2 Example
ng update @angular/cli@17 @angular/core@17

# Phase 3 Example
ng update @angular/cli@21 @angular/core@21
```

Angular's update schematics will automatically:
- Modify package.json
- Run migrations for breaking changes
- Update configuration files (angular.json, tsconfig.json)

#### 2. Update PrimeNG

```bash
# PrimeNG major version always matches Angular major version
npm install primeng@14.x --save  # Phase 1
npm install primeng@17.x --save  # Phase 2
npm install primeng@21.x --save  # Phase 3
```

#### 3. Update Supporting Libraries

- **RxJS:** Stays at v6 until Angular 17+, then upgrade to v7
- **TypeScript:** Each Angular version has specific TS requirements
- **@ngx-translate:** Check compatibility with new Angular version
- **Angular CDK:** Must match PrimeNG requirements (same major version)

#### 4. Update Node.js

- Install required Node version using nvm/volta
- Update `engines` field in all package.json files (root + 5 libraries)
- Update CI/CD environment if applicable

#### 5. Update package-lock.json

```bash
npm install  # Regenerate lock file with new dependencies
```

### Key Breaking Changes to Address

#### Phase 1 (11→14): Critical Fixes

1. **View Engine Removed (v13)**
   - All packages must use Ivy compilation
   - Already default in v11, but verify no View Engine flags

2. **@angular/http Removal**
   - Currently using deprecated `@angular/http` v7.2.15
   - Must be completely removed from dependencies
   - Search codebase for `import { Http }` and replace with `HttpClient`

3. **Strictly Typed Forms**
   - FormControl, FormGroup, FormArray now require type parameters
   - May need to add type annotations: `FormControl<string>`

4. **ViewChild/ContentChild Static Queries**
   - All queries must have explicit `static` flag
   - Found usage in auto-complete.component.ts and other files
   ```typescript
   // Before
   @ViewChild('panel') panelEL: ElementRef;

   // After
   @ViewChild('panel', { static: false }) panelEL: ElementRef;
   ```

5. **Remove rxjs-compat**
   - Currently using `rxjs-compat` 6.5.3
   - Remove and ensure all RxJS imports use proper v6 paths

6. **Update Library peerDependencies**
   - All 5 library package.json files have outdated peerDependencies
   - Example: kaltura-primeng-ui lists `@angular/core: ^8.2.6`
   - Must update to match Angular 14 at end of Phase 1

#### Phase 2 (14→17): RxJS & Router Changes

1. **RxJS 7.x Breaking Changes**
   - `toPromise()` removed → use `firstValueFrom()` or `lastValueFrom()`
   - Some operator behaviors changed (scan, combineLatest, zip)
   - Stricter TypeScript types for observables
   - Review all observable chains

2. **Router Guard Migration**
   - Class-based guards (CanActivate, CanDeactivate) deprecated
   - Still work in v17 but prepare for removal
   - Document for future migration to functional guards

3. **TypeScript Strictness**
   - Newer TypeScript may catch previously hidden errors
   - Fix type errors or temporarily relax strictness

#### Phase 3 (17→21): Optional Modernizations

1. **Control Flow Syntax (Optional)**
   - Can migrate `*ngIf/*ngFor` to `@if/@for`
   - Angular CLI provides migration: `ng generate @angular/core:control-flow`
   - **Recommendation:** Keep old syntax for library stability unless team wants modernization

2. **Standalone Components (Optional)**
   - Can optionally convert NgModules to standalone
   - Not required - modules still fully supported
   - **Recommendation:** Keep modular architecture for library consumers

3. **Zoneless Change Detection (Preparation)**
   - Angular 21 prepares for zoneless mode
   - No action required now, but be aware for future

### Testing Strategy

After each phase, run these tests before proceeding:

#### 1. Build All Libraries

```bash
npm run clean
npm run setup
npm run build
```

Verify:
- All 5 libraries build successfully in dependency order
- No TypeScript compilation errors
- Build output size is reasonable (check for unexpected bloat)

#### 2. Unit Tests

```bash
npm test
```

Verify:
- All existing tests pass
- No skipped/disabled tests
- Test coverage maintained at previous levels

#### 3. Integration Testing

- Build consuming application(s) with new library versions
- Run consuming apps and verify no console errors
- Test core user flows

#### 4. Visual/Manual Testing

- Check PrimeNG components render correctly
- Test interactions (dropdowns, data tables, forms, menus)
- Verify styles and themes remain intact
- Pay special attention to:
  - Auto-complete component (has custom code)
  - Data tables with custom templates
  - Form controls
  - Menu components

---

## 3. Dependency Version Matrix

### Phase 1: Angular 11 → 14

**Core Dependencies:**
```json
{
  "@angular/animations": "^14.3.0",
  "@angular/common": "^14.3.0",
  "@angular/compiler": "^14.3.0",
  "@angular/core": "^14.3.0",
  "@angular/forms": "^14.3.0",
  "@angular/platform-browser": "^14.3.0",
  "@angular/platform-browser-dynamic": "^14.3.0",
  "@angular/router": "^14.3.0",
  "@angular/cdk": "^14.2.7",
  "primeng": "^14.2.0",
  "rxjs": "^6.6.7",
  "tslib": "^2.3.1",
  "zone.js": "~0.11.4",
  "@ngx-translate/core": "^14.0.0",
  "@ngx-translate/http-loader": "^7.0.0"
}
```

**Removals:**
```json
// DELETE these from package.json
"@angular/http": "^7.2.15",  // DEPRECATED
"rxjs-compat": "^6.5.3"      // NO LONGER NEEDED
```

**Dev Dependencies:**
```json
{
  "@angular/cli": "^14.3.0",
  "@angular-devkit/build-angular": "^14.3.0",
  "@angular/compiler-cli": "^14.3.0",
  "ng-packagr": "^14.3.0",
  "typescript": "~4.6.4",
  "karma": "~6.4.0",
  "jasmine-core": "~4.0.0"
}
```

**Node & npm:**
```json
{
  "engines": {
    "node": ">=14.15.0",
    "npm": ">= 6.0.0"
  }
}
```

### Phase 2: Angular 14 → 17

**Core Dependencies:**
```json
{
  "@angular/animations": "^17.3.0",
  "@angular/common": "^17.3.0",
  "@angular/compiler": "^17.3.0",
  "@angular/core": "^17.3.0",
  "@angular/forms": "^17.3.0",
  "@angular/platform-browser": "^17.3.0",
  "@angular/platform-browser-dynamic": "^17.3.0",
  "@angular/router": "^17.3.0",
  "@angular/cdk": "^17.3.0",
  "primeng": "^17.18.0",
  "rxjs": "^7.8.0",
  "tslib": "^2.6.0",
  "zone.js": "~0.14.0",
  "@ngx-translate/core": "^15.0.0",
  "@ngx-translate/http-loader": "^8.0.0"
}
```

**Dev Dependencies:**
```json
{
  "@angular/cli": "^17.3.0",
  "@angular-devkit/build-angular": "^17.3.0",
  "@angular/compiler-cli": "^17.3.0",
  "ng-packagr": "^17.3.0",
  "typescript": "~5.2.2",
  "karma": "~6.4.0",
  "jasmine-core": "~4.6.0"
}
```

**Node & npm:**
```json
{
  "engines": {
    "node": ">=18.13.0",
    "npm": ">= 9.0.0"
  }
}
```

### Phase 3: Angular 17 → 21

**Core Dependencies:**
```json
{
  "@angular/animations": "^21.0.0",
  "@angular/common": "^21.0.0",
  "@angular/compiler": "^21.0.0",
  "@angular/core": "^21.0.0",
  "@angular/forms": "^21.0.0",
  "@angular/platform-browser": "^21.0.0",
  "@angular/platform-browser-dynamic": "^21.0.0",
  "@angular/router": "^21.0.0",
  "@angular/cdk": "^21.0.0",
  "primeng": "^21.0.0",
  "rxjs": "^7.8.0",
  "tslib": "^2.8.0",
  "zone.js": "~0.15.0",
  "@ngx-translate/core": "^16.0.0",
  "@ngx-translate/http-loader": "^9.0.0"
}
```

**Dev Dependencies:**
```json
{
  "@angular/cli": "^21.0.0",
  "@angular-devkit/build-angular": "^21.0.0",
  "@angular/compiler-cli": "^21.0.0",
  "ng-packagr": "^21.0.0",
  "typescript": "~5.7.0",
  "karma": "~6.4.0",
  "jasmine-core": "~5.0.0"
}
```

**Node & npm:**
```json
{
  "engines": {
    "node": ">=20.11.0",
    "npm": ">= 10.0.0"
  }
}
```

### Other Dependencies to Update

**Throughout all phases:**
- `moment`: 2.30.1 → Keep updated or consider migrating to date-fns
- `jquery`: 3.5.1 → 3.7.x (or remove if PrimeNG no longer requires it)
- `core-js`: Check if still needed in newer Angular versions
- `normalize.css`: 7.0.0 → Consider updating or modern alternative

**Note:** Exact version numbers may vary based on latest stable releases at time of upgrade. Always check official Angular, PrimeNG, and dependency documentation.

---

## 4. Code Changes & Migration Patterns

### Configuration File Updates

#### angular.json Changes

**Phase 1 (v11→14):**
- TSLint builder removed in v12 - migrate to ESLint or remove linting from angular.json
```json
// REMOVE this from all projects:
"lint": {
  "builder": "@angular-devkit/build-angular:tslint",
  ...
}
```

- ng-packagr builder configuration may need updates for Ivy

**Phase 2 & 3:**
- Verify builder versions match Angular version
- Check for new optimization options

#### tsconfig.json Changes

Update root and library-specific tsconfig files:

```json
{
  "compilerOptions": {
    "target": "es2022",           // Update from "es5"
    "module": "es2020",            // Keep
    "lib": ["es2022", "dom"],      // Update from ["es2017", "dom"]
    "useDefineForClassFields": false,  // ADD for PrimeNG compatibility
    "strict": true,                // Consider enabling for better type safety
    "esModuleInterop": true,       // ADD for better module compatibility
    "skipLibCheck": true           // ADD to skip type checking of declaration files
  }
}
```

#### karma.conf.js Changes

**Phase 1:**
- Update for Karma 6.x compatibility
- May need to update browser launchers

**Phase 3:**
- Consider migrating to alternative test runners (Jest, Web Test Runner)
- Or keep Karma if working well

### PrimeNG Component API Changes

Monitor PrimeNG migration guides at each version for:

1. **Component Input/Output Changes**
   - Property names may change
   - Event names may change
   - Check PrimeNG changelog for each major version

2. **Breaking CSS Changes**
   - Theme structure updates
   - CSS class name changes
   - May affect custom styling

3. **Deprecated Components**
   - Some components may be removed
   - Check for deprecation warnings

4. **New Required Peer Dependencies**
   - PrimeNG may add new requirements
   - Angular CDK version must match

**Components to Test Carefully:**
- Auto-complete (has custom code in kaltura-primeng-ui)
- Data tables (draggable-data-table.component.ts)
- Form controls (inputs, dropdowns, etc.)
- Menu components (menu-close-on-scroll.ts)
- Tooltips (k-tooltip.module.ts)

### Code Migration Examples

#### Removing @angular/http

**Before:**
```typescript
import { Http, Response } from '@angular/http';

constructor(private http: Http) {}

getData(): Observable<any> {
  return this.http.get('/api/data')
    .map((res: Response) => res.json());
}
```

**After:**
```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

getData(): Observable<any> {
  return this.http.get('/api/data');
  // HttpClient automatically parses JSON
}
```

#### RxJS 7 Migration (Phase 2)

**Before:**
```typescript
import { Observable } from 'rxjs';

async loadData(): Promise<any> {
  return this.dataService.getData().toPromise();
}
```

**After:**
```typescript
import { Observable, firstValueFrom } from 'rxjs';

async loadData(): Promise<any> {
  return firstValueFrom(this.dataService.getData());
}
```

#### ViewChild Static Flag

**Before:**
```typescript
@ViewChild('panel') panelEL: ElementRef;
```

**After:**
```typescript
@ViewChild('panel', { static: false }) panelEL: ElementRef;
// Use static: true only if accessed in ngOnInit
// Use static: false if accessed after ngOnInit or in templates
```

---

## 5. Risk Mitigation & Rollback Strategy

### Risk Assessment

#### High Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| **PrimeNG component compatibility** | Components may not render or behave correctly | Test each PrimeNG component used after each phase. Check PrimeNG migration guides. |
| **Build system changes** | Cannot build libraries | Keep working branch for rollback. Test builds incrementally. |
| **TypeScript strict mode issues** | Build errors from type mismatches | Fix types incrementally. Consider temporarily relaxing strictness if needed. |
| **Consuming application compatibility** | Apps can't upgrade or break | Test against 1-2 consuming apps before publishing each phase. |

#### Medium Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| **RxJS 7.x migration** (Phase 2) | Breaking changes in operators | Review all observable chains. Test async operations thoroughly. |
| **Node version changes** | Different Node behavior | Use nvm/volta to manage versions. Test on correct Node version. |
| **Third-party library compatibility** | moment, @ngx-translate, etc. | Check changelogs before updating. Test all features using these libs. |

#### Low Risk Areas

- CSS/styling changes (minimal custom styles expected)
- Routing changes (standard Angular router usage)
- i18n/translation changes (@ngx-translate generally stable)

### Rollback Strategy

#### Per-Phase Rollback

If a phase fails catastrophically:

1. **Revert Branch**
   ```bash
   git reset --hard HEAD~1  # Revert last commit
   # OR
   git checkout master      # Abandon branch entirely
   ```

2. **Restore Dependencies**
   ```bash
   git checkout package-lock.json
   npm ci
   ```

3. **Document Blocker**
   - Create GitHub issue with reproduction steps
   - Document what failed and why
   - Research alternative approaches

4. **Consider Alternative Path**
   - Can we skip the problematic version?
   - Is there a workaround for the blocker?
   - Do we need external help?

#### Checkpoint Strategy

After each successful phase:

1. **Git Tag**
   ```bash
   git tag v-angular-14-checkpoint
   git push origin v-angular-14-checkpoint
   ```

2. **Publish Beta Version**
   ```bash
   # Publish to npm with beta tag for testing
   npm publish --tag beta-angular-14
   ```

3. **Test with Consuming Apps**
   ```bash
   # In consuming app
   npm install @kaltura-ng/kaltura-common@beta-angular-14
   # Test integration
   ```

4. **Document Changes**
   - Update CHANGELOG.md with changes
   - Document breaking changes
   - Provide migration guide for consumers

5. **Merge to Master**
   ```bash
   git checkout master
   git merge feature/upgrade-to-angular-14
   git push origin master
   ```

**If Phase 2 or 3 fails, you have working Angular 14 or 17 versions to fall back on.**

### Testing Gates (Each Phase Must Pass)

Each phase must pass all these gates before proceeding:

#### Gate 1: Build Success ✓
- [ ] All 5 libraries build without errors
- [ ] No TypeScript compilation errors
- [ ] No warnings about deprecated APIs (or documented)
- [ ] Build output size reasonable (check for unexpected bloat)
- [ ] Source maps generated correctly

#### Gate 2: Unit Tests ✓
- [ ] All existing tests pass
- [ ] No skipped/disabled tests
- [ ] Test coverage maintained (check coverage reports)
- [ ] No console errors/warnings during tests

#### Gate 3: Integration Tests ✓
- [ ] Consuming app(s) install libraries successfully
- [ ] Consuming app(s) build without errors
- [ ] Consuming app(s) run without console errors
- [ ] Core user flows work as expected

#### Gate 4: Visual/Manual Testing ✓
- [ ] PrimeNG components render correctly
- [ ] Dropdowns, tables, forms work
- [ ] Interactions (click, hover, keyboard) work
- [ ] Styles and themes intact
- [ ] No visual regressions
- [ ] Responsive behavior maintained

#### Gate 5: Documentation ✓
- [ ] CHANGELOG.md updated
- [ ] Breaking changes documented
- [ ] Migration notes for consumers written
- [ ] README updated if needed

**Only proceed to next phase when ALL gates pass.**

---

## 6. Timeline & Milestones

### Phase 1: Angular 11 → 14 (Week 1)

**Days 1-2: Setup & Initial Updates**
- Create feature branch `feature/upgrade-to-angular-14`
- Update Node.js to v14
- Run `ng update @angular/cli@14 @angular/core@14`
- Update package.json for all libraries
- Install dependencies

**Days 3-4: Code Fixes & Build**
- Remove @angular/http usage
- Remove rxjs-compat
- Fix ViewChild/ContentChild static flags
- Update peerDependencies in library package.json files
- Build all libraries in order
- Fix any TypeScript errors

**Day 5: Testing & Validation**
- Run unit tests, fix failures
- Test with consuming app(s)
- Visual regression testing
- Pass all testing gates

**End of Week 1: Checkpoint**
- Tag: `v-angular-14-checkpoint`
- Publish: `@kaltura-ng/*@beta-angular-14`
- Merge to master if stable

### Phase 2: Angular 14 → 17 (Week 2)

**Days 1-2: Setup & Updates**
- Create feature branch `feature/upgrade-to-angular-17`
- Update Node.js to v18
- Run `ng update @angular/cli@17 @angular/core@17`
- Update RxJS to v7.x
- Update PrimeNG to v17
- Install dependencies

**Days 3-4: RxJS Migration & Fixes**
- Replace `toPromise()` with `firstValueFrom()`/`lastValueFrom()`
- Fix any RxJS operator breaking changes
- Update peerDependencies in library package.json files
- Build all libraries
- Fix TypeScript errors from stricter types

**Day 5: Testing & Validation**
- Run unit tests, fix failures
- Test with consuming app(s)
- Verify PrimeNG components
- Pass all testing gates

**End of Week 2: Checkpoint**
- Tag: `v-angular-17-checkpoint`
- Publish: `@kaltura-ng/*@beta-angular-17`
- Merge to master if stable

### Phase 3: Angular 17 → 21 (Week 3-4)

**Days 1-2: Setup & Updates**
- Create feature branch `feature/upgrade-to-angular-21`
- Update Node.js to v20
- Run `ng update @angular/cli@21 @angular/core@21`
- Update PrimeNG to v21
- Update all other dependencies
- Install dependencies

**Days 3-5: Fixes & Testing**
- Update peerDependencies in library package.json files
- Build all libraries
- Fix any TypeScript errors
- Run unit tests, fix failures
- Extensive testing with consuming app(s)

**Days 6-7: Final Validation & Polish**
- Visual regression testing
- Performance testing
- Pass all testing gates
- Update documentation
- Update CHANGELOG.md
- Write migration guide

**End of Week 3-4: Final Release**
- Tag: `v-angular-21-release`
- Publish: `@kaltura-ng/*@latest` (remove beta tag)
- Merge to master
- Notify consuming app teams

### Buffer Time

- **Week 4 (if needed):** Handle unexpected issues, additional testing, consuming app support

---

## Success Criteria

This upgrade is considered successful when:

1. ✅ All 5 libraries build successfully with Angular 21
2. ✅ All unit tests pass
3. ✅ Consuming applications work with new library versions
4. ✅ No breaking changes in PrimeNG component rendering/behavior
5. ✅ Documentation updated for consumers
6. ✅ Libraries published to npm
7. ✅ Code quality maintained (no major technical debt introduced)

---

## References

- [Angular Update Guide](https://update.angular.io/)
- [PrimeNG GitHub](https://github.com/primefaces/primeng)
- [PrimeNG Changelog](https://github.com/primefaces/primeng/blob/master/CHANGELOG.md)
- [RxJS Migration Guide](https://rxjs.dev/deprecations/to-promise)
- [Node.js Release Schedule](https://nodejs.org/en/about/releases/)

---

## Appendix: Quick Reference Commands

### Version Management
```bash
# Install Node versions
nvm install 14
nvm install 18
nvm install 20

# Switch Node version
nvm use 14
nvm use 18
nvm use 20
```

### Angular Updates
```bash
# Phase 1
ng update @angular/cli@14 @angular/core@14

# Phase 2
ng update @angular/cli@17 @angular/core@17

# Phase 3
ng update @angular/cli@21 @angular/core@21
```

### Build & Test
```bash
# Clean, setup, build
npm run clean
npm run setup
npm run build

# Run tests
npm test

# Build specific library
npm run build -- --library=@kaltura-ng/kaltura-common
```

### Publishing
```bash
# Publish with beta tag
npm publish --tag beta-angular-14

# Publish as latest
npm publish --tag latest
```
