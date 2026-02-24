# DeepracticeX

Deepractice prototypes — roles, skills, and organizations managed as ResourceX resources.

## Structure

```
roles/          # Role prototypes (individual definitions)
skills/         # Skill packages (SKILL.md + resource.json)
organizations/  # Organization prototypes
```

## Usage

Each directory is a ResourceX resource that can be loaded via `rolex.use()` or registered as a prototype.
