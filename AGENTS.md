# Agents Information - 0 A.D. Mods Website

## Project Overview
- **Project Type**: Static website for 0 A.D. mods
- **Target Audience**: Children up to 12 years old (sons, nephews, and family)
- **Author**: freddyeleazar
- **Technology**: HTML5, CSS3 (Pico.CSS), minimal JavaScript
- **Deployment**: GitHub Pages (automatic via GitHub Actions)
- **Language**: Spanish (100%)

## Project Structure
```
0ad-mods/
├── index.html                    # Main page with mod cards
├── css/
│   ├── styles.css                # Custom styles (0 A.D. theme)
│   └── picocss.min.css          # Pico.CSS framework
├── mods/
│   ├── daynight_cycle/          # Day/Night Cycle mod
│   ├── personal_names/          # Personal Names mod
│   └── skills_mod/              # Experience Skills mod
├── assets/
│   └── images/                  # Images and assets
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
├── AGENTS.md                    # This file
└── README.md                    # Project documentation
```

## Mods Directory Structure
- **Source mods**: `C:\Users\nous\Documents\My Games\0ad\mods`
- **Mods to include**: daynight_cycle, personal_names, skills_mod
- **Exclude**: my_first_mod, lab* prefixed mods (experimental)

## Design Guidelines
- **Theme**: Ancient/medieval (0 A.D. inspired)
- **Colors**: 
  - Primary: Gold (#C9A227) - for headings and accents
  - Secondary: Brown (#5D4E37) - for backgrounds and borders
  - Accent: Dark Green (#2E8B57) - for buttons and highlights
- **Typography**: 
  - Headings: MedievalSharp (Google Fonts)
  - Body: Segoe UI, system-ui, sans-serif
- **Target**: Simple, intuitive, child-friendly interface

## Development Rules
1. **HTML**: Always use semantic HTML5 elements
2. **CSS**: Use Pico.CSS framework with custom variables
3. **JavaScript**: Keep minimal (smooth scroll, fade effects only)
4. **Language**: All content must be in Spanish
5. **Accessibility**: Include alt tags, ARIA labels, proper contrast
6. **Responsive**: Mobile-first design, works on all devices
7. **Performance**: Optimize images, lazy loading, minimal dependencies

## Git Workflow
- Use conventional commits (feat:, fix:, docs:, style:, asset:)
- Never commit directly to main branch
- Create feature branches for new mods or major changes
- One logical change per commit
- Never use `git add .` - always stage specific paths

## Deployment
- **Platform**: GitHub Pages
- **Repository**: 0ad-mods (https://github.com/tu-usuario/0ad-mods)
- **Branch**: main
- **Automation**: GitHub Actions workflow triggers on push to main
- **Testing**: Test locally before pushing to main

## Content Guidelines
- **Descriptions**: Exciting but objective, easy for children to understand
- **Instructions**: Step-by-step, clear and simple language
- **Compatibility**: Always specify 0 A.D. version (0.28.0)
- **Credits**: Always mention freddyeleazar as author
- **Language**: Spanish only, no English content

## Mod Information Template
For each mod, include:
1. **Title**: Clear, descriptive name
2. **Summary**: Brief, exciting description (2-3 sentences)
3. **Detailed description**: What the mod does, how it works
4. **Features**: Bullet points of main features
5. **What to expect**: Benefits for the player
6. **Where to find in game**: How to access the mod features
7. **Compatibility**: Version, platform, language
8. **Installation**: Step-by-step instructions
9. **Credits**: Author, version, license

## Future Expansion
- Maximum 10 mods planned
- Easy to add new mods by following template
- Maintain consistent style across all mod pages
- Keep site simple and focused

## Security Notes
- No sensitive data in repository
- No API keys or credentials
- Use relative paths for all assets
- Validate all user inputs if any dynamic features added

## Contact
- **Author**: freddyeleazar
- **Purpose**: Sharing mods with family and children
- **License**: GPL v2 (same as 0 A.D.)