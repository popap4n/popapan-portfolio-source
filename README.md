# Vince Benitez portfolio

## Project purpose

A static portfolio for Vince Benitez, a recent Computer Games Programming graduate seeking graduate or junior games-programming roles. Its project pages are designed to demonstrate personal code contributions, technical decisions, testing and playable or video evidence. The initial case studies are prompts, not claims about completed work. Replace every `[REPLACE: ...]` item before publishing.

## Technology stack

Astro renders semantic HTML at build time, with TypeScript for typed components and a validated content collection for project case studies. The site uses a small CSS design system and no client-side framework or navigation JavaScript. `astro build` writes fully static files to `dist/`. A Node script using `execa` and `dotenv` pushes the source, syncs the build to an existing S3 bucket, and invalidates an existing CloudFront distribution. AWS infrastructure is not created by this project.

## Repository structure

| Path | Purpose |
| --- | --- |
| `src/data/site.ts` | Name, role, email, location, CV path and social links; URL helpers |
| `src/data/assets.ts` | Checks for the real CV at build time |
| `src/content.config.ts` | Project collection loader and frontmatter validation |
| `src/content/projects/*.md` | Editable project details and case-study prose |
| `src/components/` | Reusable navigation, cards, placeholders, links and sections |
| `src/layouts/` | Shared page metadata and project case-study layout |
| `src/pages/` | Home, About, Projects, case-study routes and 404 page |
| `src/styles/` | Colour tokens, responsive layout and focus states |
| `public/cv/` | Place the real CV PDF here |
| `public/images/projects/`, `public/images/profile/`, `public/videos/` | Authorised, optimised media |
| `public/favicon.svg`, `public/social-preview.svg`, `public/robots.txt` | Browser and sharing assets; replace social preview before launch |
| `scripts/deploy.mjs` | Guarded local deployment procedure |
| `.env.example`, `astro.config.mjs` | Production site URL and deployment settings |
| `.github/pull_request_template.md` | Review checklist |

## Requirements

- Node.js 22.12 or newer (Node 22 LTS or 24), npm, and Git.
- For deployment only: AWS CLI v2, an AWS named profile or intentionally supplied standard AWS environment credentials, an existing S3 bucket, an existing CloudFront distribution, and an `origin` Git remote.
- AWS permissions limited to the bucket and distribution described below. Do not use AWS root credentials or an administrator access key.

## Initial setup

```bash
npm install
cp .env.example .env
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env` instead of `cp` if preferred. You can develop without real AWS settings; complete `.env` only before deployment. `.env` is ignored by Git. `PUBLIC_SITE_URL` is the final `https://` domain, without a path; it is used for canonical and social URLs. Until supplied, local builds use `https://example.invalid` so no domain is invented. `AWS_PROFILE` names a CLI profile stored outside this repository; omit it only if you intentionally provide standard AWS environment credentials. `AWS_REGION` is the bucket's region, `S3_BUCKET` is its exact name, `CLOUDFRONT_DISTRIBUTION_ID` identifies the distribution, and `DEPLOY_BRANCH` is the only branch the script will push. The example defaults to `main` and `eu-west-2`; verify these against your infrastructure.

## Local development

```bash
npm run dev      # local development server
npm run check    # Astro and TypeScript diagnostics
npm run build    # checks, then creates dist/
npm run preview  # serve the production build locally
```

The CV controls hide download links until the real PDF exists. Social and project links remain plain, labelled placeholders until a full HTTPS URL is supplied. The site has no client-side JavaScript. Check the page at narrow phone, tablet and desktop widths, and navigate it using Tab, Shift+Tab and Enter.

## Update personal details

Edit `src/data/site.ts` for name, role, email, location, introduction, GitHub and LinkedIn URLs, and the CV path. Use real `https://` profile URLs. Check visible copy in `src/components/Hero.astro`, `AboutSummary.astro`, `ContactLinks.astro`, `src/pages/about.astro` and page descriptions as well; these contain longer prose. The email address in `site.ts` is the one supplied for this project.

## Add the CV

Copy the real PDF to `public/cv/vince-benitez-cv.pdf`. Do not use a dummy file. Run `npm run build` and `npm run preview`, then open `/cv/vince-benitez-cv.pdf` and check that the header, hero and contact links download the correct file. If the file is absent, the controls show a clear placeholder instead of a broken link. Review the CV for private information before committing it.

## Edit the homepage

- Hero text and visual: `src/components/Hero.astro`; profile assets: `public/images/profile/`.
- Skills: the `SkillGroup` arrays in `src/pages/index.astro`.
- Featured projects: set `featured: true` and `order` in the project Markdown frontmatter; `src/pages/index.astro` sorts them.
- About summary: `src/components/AboutSummary.astro`.
- Contact information: `src/data/site.ts`, rendered by `src/components/ContactLinks.astro`.

## Complete a project case study

Edit a file in `src/content/projects/`. Frontmatter must contain `title` (real name), `summary` (one sentence explaining the project and programming focus), `featured` (homepage visibility), `order` (display order), `engine`, `languages`, `tools`, `projectType` (`individual` or `team` once known), `context` (academic or personal setting), `startDate`, `endDate`, `role`, `image` and `imageAlt`. `unspecified` is only a starter value. Add optional full HTTPS URLs in `video`, `repository`, `playableBuild` and `technicalDocumentation`; remove unused fields or leave labelled placeholders. Placeholder URLs are never made clickable. Use `/images/projects/name.webp` for a local image path. Replace `imageAlt` with a literal description of what the image shows. The project page shows a media prompt until the image exists.

In the Markdown body, explain personal contribution in first person and distinguish teammates' work. State the technical problem, why it was difficult, at least two options considered, the selected solution and the observed result. Describe testing method, feedback, changes and performance or usability outcome. Reflect on what you learned, what worked, what you would improve and what you would build next. Where possible, link to a public repository and a 30–90 second demonstration. Explain what a playable build requires and what the reader should try. Add screenshots through the optional `screenshots` frontmatter array, for example `screenshots: [{ image: '/images/projects/movement.webp', alt: 'Player character moving through a test level with the stamina indicator visible' }]`. Do not publish restricted university code or assets.

Bad: “Worked on enemy AI.”

Better example (illustrative only; **not** a claim about Vince): “Implemented a patrol and investigation system using Unreal Engine behaviour trees and perception components. Added visual debugging for detection state and navigation failures.”

Evidence is stronger than broad claims. Mention measurable results only when you have genuine measurements. Include a brief caption or explanation beside each screenshot so the reviewer knows what to inspect.

## Add a new project

1. Copy the closest Markdown file in `src/content/projects/`.
2. Give it a short URL-safe filename such as `puzzle-prototype.md`; this becomes `/projects/puzzle-prototype/`.
3. Complete every required frontmatter field. Set `featured` and a unique `order`; choose `individual` or `team` accurately.
4. Add authorised screenshots to `public/images/projects/` and optional video to `public/videos/`, or use a full external video URL. Update `image` and `imageAlt`.
5. Write the contribution, challenge, testing and reflection sections with specific evidence. Add real links only when public.
6. Run `npm run check` and `npm run build`.
7. Run `npm run preview` and review the index, case study, links and small-screen layout.

Project cards are derived from collection metadata, so future filtering can be added without changing the content model.

## Media guidance

Use original or authorised screenshots. Prefer WebP or AVIF for screenshots, and SVG for diagrams you own. A 1600×1000 pixel cover works well for cards; keep each image ideally below 300 KB, and larger case-study images below about 500 KB when practical. Name files descriptively, for example `project-name-movement-state.webp`. Write alt text that describes the visible feature or state, rather than “game screenshot.” Use 30–90 second demonstrations with a clear opening and a poster image if embedding local video later. An externally hosted video URL is fine; a carefully optimised local video is also possible. Do not include copyrighted music, unlicensed art, confidential code, or restricted university assets. The starter pages deliberately render no empty video element.

## Placeholder checklist

Search remaining placeholders before publication:

```bash
grep -R "\\[REPLACE:" src public README.md
```

Cross-platform PowerShell: `Get-ChildItem src,public -Recurse -File | Select-String -Pattern '\[REPLACE:'`. Review placeholders in `.env.example` separately; those are intentionally retained as a template. The inventory below groups all initial prompts:

- Personal details: city, GitHub profile URL, LinkedIn profile URL, real CV PDF, hero portrait or programming visual, genuine IDEs and interests.
- About: degree classification if appropriate, technical interests, debugging, problem breakdown, feedback, Git habits, teamwork, preferred roles and specialisation, location/relocation and right-to-work if appropriate.
- Every project: title, one-sentence summary, engine/framework, languages, tools, project type, dates, role, genre/purpose, cover image and alt text, video, repository, optional build and documentation.
- Every case study: personal systems and other contributions, team attribution, problem, difficulty, options, solution, result, testing method, feedback, changes, outcome, lessons, strengths, improvements and next work.
- Media on every case study: a 30–90 second demonstration and two screenshots with useful alternative text. The technical demonstration file also asks Vince to choose a system he actually built; the listed topics are suggestions only.
- Publishing: final social preview design, production domain, bucket name and CloudFront distribution ID.

### Exact placeholder inventory

These are the unique prompt strings currently in `src/` and `public/` (repeated prompts are listed once). The README contains this inventory intentionally, so search `src/` and `public/` when checking whether site content is finished.

+- `[REPLACE: 30 to 90 second gameplay or technical demonstration]`
- `[REPLACE: Add a public repository, playable build, demonstration video or technical documentation URL when available]`
- `[REPLACE: Add CV PDF to enable download]`
- `[REPLACE: Choose a system Vince actually built. Possible subjects include enemy AI, procedural generation, dialogue tools, inventory architecture, save/load, pathfinding, or graphics and shaders. These are suggestions, not claims.]`
- `[REPLACE: City, United Kingdom]`
- `[REPLACE: Compare at least two credible approaches]`
- `[REPLACE: Compare implementation options and tradeoffs]`
- `[REPLACE: Define the technical problem this demonstration addresses]`
- `[REPLACE: Degree classification, if appropriate]`
- `[REPLACE: Demonstrate the observed behaviour and evidence, without invented metrics]`
- `[REPLACE: Describe a limitation and a realistic improvement]`
- `[REPLACE: Describe a next technical experiment]`
- `[REPLACE: Describe a second contribution such as tooling, visual debugging or integration]`
- `[REPLACE: Describe a second personal programming contribution and how it connects to the project objective]`
- `[REPLACE: Describe at least two viable approaches and their tradeoffs]`
- `[REPLACE: Describe bugs, reviewer feedback or profiling observations]`
- `[REPLACE: Describe combat or interaction behaviour only if actually present]`
- `[REPLACE: Describe feedback on feel, clarity or defects]`
- `[REPLACE: Describe input, movement, interaction or state changes made after testing]`
- `[REPLACE: Describe testing, profiling, optimisation or fault diagnosis performed]`
- `[REPLACE: Describe tests, playtests or debugging tools used]`
- `[REPLACE: Describe the final outcome without inventing metrics]`
- `[REPLACE: Describe the focused system Vince personally designed and programmed]`
- `[REPLACE: Describe the main gameplay loop and the player-facing systems Vince programmed]`
- `[REPLACE: Describe the tested result without inventing performance claims]`
- `[REPLACE: Describe the visible system, state or debugging view]`
- `[REPLACE: Describe visible gameplay and relevant interface elements]`
- `[REPLACE: Describe what the final-year project cover image shows]`
- `[REPLACE: Describe your role and communication in a team]`
- `[REPLACE: Describe your source-control habits with Git]`
- `[REPLACE: End month and year]`
- `[REPLACE: Engine or framework used]`
- `[REPLACE: Engine used for the final-year project]`
- `[REPLACE: Engine used for the gameplay project]`
- `[REPLACE: Explain a current limitation]`
- `[REPLACE: Explain a debugging, integration, testing or optimisation contribution]`
- `[REPLACE: Explain a successful choice]`
- `[REPLACE: Explain constraints, edge cases or competing requirements]`
- `[REPLACE: Explain edge cases, scale, state complexity or other real constraints]`
- `[REPLACE: Explain game-state management, debugging or integration work]`
- `[REPLACE: Explain how testing and feedback change your implementation]`
- `[REPLACE: Explain how you break down a difficult technical problem]`
- `[REPLACE: Explain how you investigate and debug unexpected behaviour]`
- `[REPLACE: Explain input and movement implementation, including any state transitions or edge cases]`
- `[REPLACE: Explain playtesting and repeatable checks]`
- `[REPLACE: Explain the chosen code structure and behaviour]`
- `[REPLACE: Explain the implementation and why Vince selected it]`
- `[REPLACE: Explain the implemented structure and why it was chosen]`
- `[REPLACE: Explain the iteration made after testing]`
- `[REPLACE: Explain the most important technical lesson]`
- `[REPLACE: Explain the player-facing consequences and technical constraints]`
- `[REPLACE: Explain the strongest technical lesson]`
- `[REPLACE: Explain what changed as a result]`
- `[REPLACE: Explain what improved and how it was observed]`
- `[REPLACE: Explain what the project is, its genre or technical purpose, and the player or user experience]`
- `[REPLACE: Final social preview design]`
- `[REPLACE: Final-year project cover screenshot or diagram]`
- `[REPLACE: Final-year project title]`
- `[REPLACE: Full demonstration video URL]`
- `[REPLACE: Full gameplay demonstration video URL]`
- `[REPLACE: Full GitHub profile URL]`
- `[REPLACE: Full LinkedIn profile URL]`
- `[REPLACE: Full playable build URL, if available]`
- `[REPLACE: Full public repository URL, if publication is permitted]`
- `[REPLACE: Full technical demonstration video URL]`
- `[REPLACE: Full technical documentation URL, if available]`
- `[REPLACE: Gameplay project title]`
- `[REPLACE: Gameplay screenshot showing the main loop]`
- `[REPLACE: Genre or project type]`
- `[REPLACE: Genuine programming interests, with a sentence about what draws you to each]`
- `[REPLACE: Identify a limitation]`
- `[REPLACE: Identify a successful technical decision]`
- `[REPLACE: Identify the next feature or technical investigation]`
- `[REPLACE: Identify the next gameplay iteration]`
- `[REPLACE: IDEs and other tools genuinely used]`
- `[REPLACE: If this was a team project, separate Vince’s work from teammates’ work]`
- `[REPLACE: Individual or team project]`
- `[REPLACE: Location, relocation preferences and right-to-work information, if appropriate]`
- `[REPLACE: Name an effective design or development decision]`
- `[REPLACE: Name the major system or feature Vince personally designed and programmed; describe the inputs, behaviour and outcome]`
- `[REPLACE: One sentence describing the final-year project objective and Vince’s programming focus]`
- `[REPLACE: One sentence describing the gameplay loop and Vince’s programming contribution]`
- `[REPLACE: One sentence naming the focused system and the technical question it explores]`
- `[REPLACE: Other genuine technical interests]`
- `[REPLACE: Preferred graduate or junior roles and programming specialisation]`
- `[REPLACE: Professional photograph, illustration or appropriate programming visual]`
- `[REPLACE: Programming language used]`
- `[REPLACE: Relevant development or profiling tools]`
- `[REPLACE: Relevant development tools]`
- `[REPLACE: Screenshot of a key feature; add alt text describing what is visible]`
- `[REPLACE: Screenshot or diagram showing the technical system]`
- `[REPLACE: Second screenshot showing a different system or result; add descriptive alt text]`
- `[REPLACE: Start month and year]`
- `[REPLACE: State a gameplay programming lesson]`
- `[REPLACE: State a real gameplay programming problem]`
- `[REPLACE: State how system behaviour was checked]`
- `[REPLACE: State the most substantial technical problem clearly]`
- `[REPLACE: State the observable outcome; use evidence only if available]`
- `[REPLACE: State the observed outcome]`
- `[REPLACE: Summarise specific feedback or defects found]`
- `[REPLACE: Technical demonstration title]`
- `[REPLACE: Vince’s role and responsibilities]`

## Deployment setup

Create a named profile outside this repository, for example with `aws configure --profile portfolio`, or use your organisation's supported SSO setup. Never put AWS keys in `.env`, source files or Git. The script also accepts standard `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` environment credentials if intentionally supplied through a secure external mechanism. Fill out `.env` with the actual domain, profile if used, region, bucket, distribution and branch. Confirm the Git repository has an `origin` remote and the correct active branch. Verify identity with `aws sts get-caller-identity --profile portfolio`, then run `npm run build` as a dry local build. The script itself performs an identity check before any push or upload. Run `npm run deploy` only when ready to publish.

The deployment identity needs `s3:ListBucket` on the exact bucket; `s3:GetObject`, `s3:PutObject` and `s3:DeleteObject` on its objects; and `cloudfront:CreateInvalidation` on the exact distribution. Example least-privilege policy (replace every obvious placeholder):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::[REPLACE-WITH-BUCKET-NAME]" },
    { "Effect": "Allow", "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"], "Resource": "arn:aws:s3:::[REPLACE-WITH-BUCKET-NAME]/*" },
    { "Effect": "Allow", "Action": "cloudfront:CreateInvalidation", "Resource": "arn:aws:cloudfront::[REPLACE-WITH-AWS-ACCOUNT-ID]:distribution/[REPLACE-WITH-DISTRIBUTION-ID]" }
  ]
}
```

The distribution must already point at the intended bucket. Configure CloudFront's default root object as `index.html`. For direct `/projects/name/` URLs, configure a CloudFront Function or equivalent URI rewrite to append `index.html` to extensionless paths; S3 and CloudFront do not automatically map every directory route to its index file in all origin configurations. Configure a custom 404 response to serve `/404.html` if desired. This repository does not create or alter those settings.

## Deployment process

`npm run deploy` loads `.env` and validates all values. It checks for Git, Node, npm and AWS CLI; confirms the repository root, required branch, and that `.env` is ignored and untracked; then calls AWS STS to display the current identity. It prints the complete short Git status. If anything changed, it asks for an explicit `yes` to commit all listed changes and a meaningful commit message. It runs `npm run build` before staging or pushing. After a successful build it stages the confirmed changes, commits them, pushes `DEPLOY_BRANCH` to `origin`, syncs normal `dist/` files with deletion and `Cache-Control: public,max-age=0,must-revalidate` while excluding `_astro/*`, syncs `dist/_astro/` separately with deletion and a one-year immutable cache, and creates a CloudFront `/*` invalidation. It reports the commit, bucket and invalidation ID. With a clean working tree, it still builds, pushes, syncs and invalidates. Any failed step exits nonzero. Git push, S3 and CloudFront are not one atomic transaction; after fixing a failure, rerun the command to reconcile the target.

## Rollback

Find the last good source commit with `git log --oneline`. Prefer `git revert <bad-commit>` on the deployment branch, review the resulting diff, then run `npm run build` and `npm run deploy`. For a more involved rollback, create a new branch from the previous commit, bring the appropriate files forward as a new reviewed commit, merge it normally, then deploy. Do not use a destructive reset on a shared branch. If S3 versioning was already enabled, object versions can assist recovery, but rebuilding a reviewed source commit keeps Git and the site aligned.

## Troubleshooting

| Problem | Check |
| --- | --- |
| Missing AWS profile | Run `aws configure list-profiles` or refresh SSO; verify `AWS_PROFILE` in `.env`. |
| Access denied | Confirm the identity with STS and the bucket/distribution policy and resource ARNs. |
| Wrong bucket | Stop before deployment and compare `S3_BUCKET` with the CloudFront origin. The sync uses `--delete`. |
| Build failure | Run `npm run check`; fix the reported content field, TypeScript or missing dependency. Nothing is staged if the build fails. |
| Branch mismatch | Check `git branch --show-current` and `DEPLOY_BRANCH`; switch branches deliberately. |
| `.env` accidentally tracked | `git rm --cached .env`, commit the removal and consider rotating exposed credentials. The script refuses to continue. |
| CloudFront invalidation failure | Fix permission/distribution ID and rerun; uploads may already have completed. |
| Updated site not appearing | Check the invalidation status, browser cache, CloudFront origin, and the deployed commit reported by the script. |
| Direct project URL returns 404 | Configure an extensionless-path to `/index.html` rewrite on CloudFront, as described above. |
| Missing CV or media | Add the real file at the documented path, rebuild, and check case-sensitive filenames and alt text. |

## Pre-publication checklist

- [ ] Every visible `[REPLACE: ...]` placeholder has been completed or intentionally removed.
- [ ] All external and internal links work.
- [ ] The real CV downloads correctly.
- [ ] Mobile, tablet and desktop layouts have been checked.
- [ ] Keyboard navigation, skip link and focus states have been checked.
- [ ] All images have meaningful alternative text.
- [ ] Project contributions and team attribution are accurate.
- [ ] No restricted university code or assets are exposed.
- [ ] No credentials or `.env` are tracked.
- [ ] `npm run build` succeeds.
- [ ] Production domain, canonical metadata and social preview are correct.
