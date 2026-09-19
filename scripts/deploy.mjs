import { config as loadDotenv } from 'dotenv';
import { execa } from 'execa';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const run = (command, args, options = {}) => execa(command, args, { stdio: 'inherit', ...options });
const capture = async (command, args, options = {}) => (await execa(command, args, options)).stdout.trim();
const stage = (message) => console.log(`\n→ ${message}`);
const fail = (message) => { throw new Error(message); };
const placeholder = (value) => !value || value.includes('[REPLACE') || value.includes('REPLACE-WITH');

async function main() {
  stage('Loading local deployment configuration');
  if (!existsSync('.env')) fail('Missing .env. Copy .env.example to .env and fill in the real values.');
  const loaded = loadDotenv({ path: '.env', quiet: true });
  if (loaded.error) fail(`Could not load .env: ${loaded.error.message}`);
  const required = ['PUBLIC_SITE_URL', 'AWS_REGION', 'S3_BUCKET', 'CLOUDFRONT_DISTRIBUTION_ID', 'DEPLOY_BRANCH'];
  for (const key of required) if (placeholder(process.env[key])) fail(`${key} is missing or still a placeholder in .env.`);
  if (!/^https:\/\/[^\s/]+\/?$/.test(process.env.PUBLIC_SITE_URL)) fail('PUBLIC_SITE_URL must be an https:// domain URL without a path.');
  if (!process.env.AWS_PROFILE && !(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)) {
    fail('Configure AWS_PROFILE or intentionally provide standard AWS environment credentials outside this repository.');
  }
  if (!existsSync('package.json') || !existsSync('src')) fail('Run this command from the portfolio project root.');

  stage('Checking required tools and Git repository');
  for (const [tool, args] of [['git', ['--version']], ['node', ['--version']], ['npm', ['--version']], ['aws', ['--version']]]) {
    try { console.log(`${tool}: ${await capture(tool, args)}`); }
    catch { fail(`${tool} is unavailable. Install it and ensure it is on PATH.`); }
  }
  const root = await capture('git', ['rev-parse', '--show-toplevel']).catch(() => fail('The working directory is not a Git repository.'));
  if (resolve(root).toLowerCase() !== resolve(process.cwd()).toLowerCase()) fail('Run npm run deploy from the Git repository root.');
  await capture('git', ['remote', 'get-url', 'origin']).catch(() => fail('Git remote "origin" is missing. Configure it before deploying.'));
  const branch = await capture('git', ['branch', '--show-current']);
  if (branch !== process.env.DEPLOY_BRANCH) fail(`Active branch is "${branch || '(detached HEAD)'}"; DEPLOY_BRANCH requires "${process.env.DEPLOY_BRANCH}".`);
  const trackedEnv = await execa('git', ['ls-files', '--error-unmatch', '--', '.env'], { reject: false });
  if (trackedEnv.exitCode === 0) fail('.env is tracked by Git. Remove it from the index with git rm --cached .env, then review the history before deploying.');
  const ignoredEnv = await execa('git', ['check-ignore', '--no-index', '--quiet', '.env'], { reject: false });
  if (ignoredEnv.exitCode !== 0) fail('.env is not ignored by Git. Add it to .gitignore before deploying.');

  stage('Verifying AWS identity (read only)');
  await run('aws', ['sts', 'get-caller-identity']);

  stage('Current Git status');
  const status = await capture('git', ['status', '--short', '--untracked-files=all']);
  console.log(status || 'Clean working tree');
  let commitMessage;
  if (status) {
    const prompt = createInterface({ input: stdin, output: stdout });
    try {
      const answer = (await prompt.question('Commit every change listed above after a successful build? Type yes to continue: ')).trim();
      if (answer !== 'yes') fail('Deployment cancelled; no changes were staged or deployed.');
      commitMessage = (await prompt.question('Meaningful commit message: ')).trim();
      if (commitMessage.length < 8) fail('Commit message must be at least 8 characters.');
    } finally { prompt.close(); }
  }

  stage('Building and validating the static site');
  await run('npm', ['run', 'build']);
  if (!existsSync('dist/index.html') || !existsSync('dist/_astro')) fail('Build output is incomplete: expected dist/index.html and dist/_astro/.');
  const statusAfterBuild = await capture('git', ['status', '--short', '--untracked-files=all']);
  if (statusAfterBuild !== status) fail('Git status changed during the build. Review the new status and rerun so every staged change is confirmed.');

  if (status) {
    stage('Staging and committing confirmed changes');
    await run('git', ['add', '-A']);
    const staged = await capture('git', ['diff', '--cached', '--name-only']);
    if (!staged) fail('No changes remained to commit after staging.');
    await run('git', ['commit', '-m', commitMessage]);
  }

  stage(`Pushing ${process.env.DEPLOY_BRANCH} to origin`);
  await run('git', ['push', 'origin', process.env.DEPLOY_BRANCH]);
  const commit = await capture('git', ['rev-parse', 'HEAD']);
  const bucket = process.env.S3_BUCKET;

  // Push, S3 sync and CloudFront invalidation are not one atomic transaction.
  // Re-running after a partial failure reconciles S3 with the same build and repeats invalidation safely.
  stage('Synchronising HTML and normal assets with revalidation caching');
  await run('aws', ['s3', 'sync', 'dist/', `s3://${bucket}/`, '--delete', '--exclude', '_astro/*', '--cache-control', 'public,max-age=0,must-revalidate']);
  stage('Synchronising hashed Astro assets with immutable caching');
  await run('aws', ['s3', 'sync', 'dist/_astro/', `s3://${bucket}/_astro/`, '--delete', '--cache-control', 'public,max-age=31536000,immutable']);
  stage('Creating CloudFront invalidation');
  const invalidation = await capture('aws', ['cloudfront', 'create-invalidation', '--distribution-id', process.env.CLOUDFRONT_DISTRIBUTION_ID, '--paths', '/*', '--query', 'Invalidation.Id', '--output', 'text']);
  console.log(`\nDeployed commit: ${commit}\nS3 bucket: ${bucket}\nCloudFront invalidation: ${invalidation}`);
}

main().catch((error) => {
  console.error(`\nDeployment stopped: ${error.shortMessage || error.message}`);
  process.exitCode = 1;
});
