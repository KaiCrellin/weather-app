# Development WorksFlow

## Branch Strategy

= 'main' - (Phase 1,2,3 Complete)
- 'Phase-4-frontend-foundation - current development
- Phase-5-weather-ui-logic' - Future dev
- 'Phase-6-visualisation - Future Dev



##Working on a phase

### Start new phase
```bash
git checkout main
git pull origin main



git checkout -b Phase-x-description



git status



git add .

git commit -m "descriptive message of changes"


git push origin phase-x-description
```


### Complete Phase
```bash

# Ensure all tests pass
npm test

# Final Commit
git add . 
git commit -m "Phase x complete"


-Features


-Tests


## Push to Github
git push origin phase-x-description

#Merge to main (via PR or directly)
git chechout main

git merge phase-x-description

git push origin main
```


### Types
= 'Feat:' - New Feature
= 'Fix:' - Bug Fix
- 'Docs:' - Documentation Only
- 'Refactor:' - Code restructuring
- 'Test' - adding tests
- 'Chore:' - Maintainance Tasks

## Environment files


**NEVER commit '.env' files!**

### Checkout Sensitive Data

```bash
#Search for API keys in commit (should fine none)
git log -S "API_KEY" - all

# Check whats about to be commited
git diff --cached

```


### if accidently commited

```bash

# Remove froms taging 
git reset HEAD .env

# Remote from last commit (if not pushed)
git reset --soft HEAD~1


# if already pushed, be careful when using force push
git filter-branch --force --index-filter \
    "git rm --cached --ignore-unmathced backend/.env" \
    --prune-empty --tag-name-filter cat -- --all
```


## Testing before Commits


### backend tests
```bash


cd backend

# Testing Demo Mode
USE_DEMO_DATA=true node test-parity.js

# Testing Live Mode
USE_DEMO_DATA=fasle node test-parity-js

# Manual Endpoints
curl http://localhost:5000/api/health
curl "http://localhost:5000/api/weather?city=London"
```



### Frontend Tests (Phase 4+)

```bash
cd frontend


npm run lint
npm run test
npm run build
```



## Pull Request Guidelines


when creating PR on github:
1. **Title** use Format: "description'
2. **Descriptions**
    - What was implemented
    - How to Test
    - Any Breaking changes
    - Checklist of items
3. **lables** add appropriate labels (enhancement, documentation, etc.)
4. **reviewers** Can be assigned if working in a team


## useful Git command

### Check Status
```bash
git status # Current Changes
git log --oneline # Commit History
git diff # Unstaged Changes
git diff --cached # Staged Changes
```


### Undo Changes
```bash
git checkout --file file.js #Discard changes in file
git reset head file.js # Unstage file
git reset --soft HEAD~1 # Undo last commit (keep changes)
git reset --hard HEAD~1 # Undo last commit (discard changes)
```

### Branch Management
```bash
git branch # List branches
git branch -d Branch-name # Delete branch
git checkout main # Switch to main
git merge origin branch-name # Merge branch into current
```


### Sync With Remote
``` bash
git fetch origin # Download remote changes
git pull origin main # fethc + merge
git push origin main #Uplad changes
```


## TroubleShooting


### Merge Conflics

```bash
# After Conflict
git status
# Edit Files to resolve Conflicts
git add . 
git commit -m "resolve merge conflict
```



### Reset To Remote

```bash
git fetch origin
git reset --hard origin/main
```



### View Remote URL
```bash
git remove -v
```