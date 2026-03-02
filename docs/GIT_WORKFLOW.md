# Git Workflow & Commit Guidelines

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification enforced by commitlint.

## Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, whitespace, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or correcting tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (Optional)

The scope should be the name of the affected component or feature:

- `counter`
- `notes`
- `timer`
- `form`
- `desktop`
- `redux`
- `tests`
- etc.

### Subject

- Use imperative, present tense: "add" not "added" or "adds"
- Don't capitalize first letter
- No period (.) at the end
- Maximum 100 characters

### Examples

#### Good Commits ✅

```bash
feat(counter): add increment by 5 button
fix(form): resolve validation error display issue
docs(readme): update installation instructions
test(notes): add E2E tests for note deletion
refactor(desktop): simplify reducer cleanup logic
perf(timer): optimize interval handling
style(form): format code with prettier
build(deps): upgrade react to 18.3.1
```

#### Bad Commits ❌

```bash
# Missing type
Added new feature

# Capitalized subject
feat(counter): Add new button

# Period at end
fix(form): resolve validation issue.

# Past tense
feat(notes): added delete functionality

# Too vague
fix: bug fix
```

## Pre-commit Hooks

Husky runs the following checks before each commit:

### 1. Lint-Staged
- Formats code with Prettier
- Fixes ESLint issues automatically
- Only runs on staged files

### 2. Type Check
```bash
npm run type-check
```
Ensures no TypeScript errors

### 3. Unit Tests
```bash
npm run test:unit
```
Runs all unit tests to ensure nothing is broken

## Commit Message Hook

Commitlint validates your commit message format:

```bash
# This will pass ✅
git commit -m "feat(counter): add reset button"

# This will fail ❌
git commit -m "Added reset button"
```

## Bypassing Hooks (Use with Caution)

If you absolutely need to bypass hooks:

```bash
# Skip pre-commit hooks
git commit --no-verify -m "feat(counter): emergency fix"

# Skip commit-msg hook
HUSKY_SKIP_HOOKS=1 git commit -m "message"
```

⚠️ **Warning**: Only use this for emergencies. Bypassing hooks can introduce bugs.

## Workflow

### 1. Make Changes

```bash
# Create a feature branch
git checkout -b feat/add-new-feature

# Make your changes
# ...

# Stage your changes
git add .
```

### 2. Commit

```bash
# Commit with conventional format
git commit -m "feat(feature): add new functionality"

# Hooks will automatically run:
# ✓ Prettier formatting
# ✓ ESLint fixes
# ✓ Type checking
# ✓ Unit tests
# ✓ Commit message validation
```

### 3. Push

```bash
# Push to remote
git push origin feat/add-new-feature
```

### 4. Create Pull Request

- Use a descriptive title
- Reference related issues
- Provide context in the description
- Request reviews

## Branch Naming

Follow these conventions:

```bash
feat/short-description      # New features
fix/short-description       # Bug fixes
docs/short-description      # Documentation
refactor/short-description  # Refactoring
test/short-description      # Tests
chore/short-description     # Maintenance
```

### Examples

```bash
feat/add-dark-mode
fix/form-validation-error
docs/update-api-guide
refactor/simplify-redux-logic
test/add-e2e-coverage
chore/upgrade-dependencies
```

## Pull Request Guidelines

### Title

Use conventional commit format:

```
feat(counter): add increment by 10 button
```

### Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Troubleshooting

### Hooks Not Running

```bash
# Reinstall Husky
rm -rf .husky
npm run prepare

# Make hooks executable
chmod +x .husky/pre-commit .husky/commit-msg
```

### Commit Message Rejected

```bash
# Check your message format
# Should be: type(scope): subject

# Example fix:
git commit --amend -m "feat(counter): add new feature"
```

### Tests Failing in Hook

```bash
# Run tests manually to see details
npm run test:unit

# Fix the failing tests
# Then commit again
```

### Lint Errors

```bash
# Run lint manually
npm run lint

# Auto-fix issues
npm run lint:fix

# Then commit again
```

## Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Explain the "why", not just the "what"
3. **Test Before Commit**: Ensure tests pass locally
4. **Keep Commits Atomic**: One logical change per commit
5. **Reference Issues**: Link to issue numbers when applicable

## Git Configuration

### Recommended Settings

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Use main as default branch
git config --global init.defaultBranch main

# Colorize output
git config --global color.ui auto

# Set default editor
git config --global core.editor "code --wait"
```

### Useful Aliases

```bash
# Add to ~/.gitconfig

[alias]
  st = status
  co = checkout
  br = branch
  ci = commit
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Husky](https://typicode.github.io/husky/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
