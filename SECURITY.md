# Security Checks for Jenkins Pipeline

## What npm audit checks
`npm audit` analyzes dependencies listed in `package-lock.json` and compares them against the npm vulnerability database. It reports known security issues in direct and transitive packages.

## Vulnerability severity levels
- Low: Minor security impact; usually limited exploitability.
- Moderate: Meaningful risk in common environments; should be addressed in normal sprint cycles.
- High: Serious impact and/or exploitability; prioritize fixing quickly.
- Critical: Severe risk with high exploitability and impact; fix immediately.

## How to fix vulnerabilities
1. Run `npm audit fix` for safe, non-breaking updates.
2. If issues remain, run `npm audit fix --force` only after testing because it may introduce breaking changes.
3. Upgrade affected packages manually in `package.json` when advisories require specific versions.
4. Re-run `npm audit --audit-level=moderate` after each fix cycle.

## Container security scanning with Trivy
Trivy is not installed by this project, but the Docker images are ready to be scanned in CI.

Example Jenkins/CLI commands after image build:
- `trivy image fintech-backend:latest`
- `trivy image fintech-frontend:latest`
- `trivy image --severity HIGH,CRITICAL fintech-backend:latest`
- `trivy image --severity HIGH,CRITICAL fintech-frontend:latest`

## Recommended pipeline security sequence
1. `npm audit --audit-level=moderate` (root)
2. `npm audit --audit-level=moderate` (server)
3. Build Docker images
4. Run Trivy scans on built images
5. Fail pipeline on high/critical vulnerabilities based on policy
