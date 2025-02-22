#!/usr/bin/env node

import fs from "fs";
import { execSync } from "child_process";

// Helper function to run shell commands
function runCommand(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    process.exit(1);
  }
}

// Read package.json and increment the alpha version
async function getNextAlphaVersion() {
  const packageJsonPath = "./package.json";
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  let currentVersion = packageJson.version;
  const match = currentVersion.match(/^(\d+\.\d+\.\d+)(-alpha\.(\d+))?$/);

  if (!match) {
    console.error("❌ Invalid version format in package.json.");
    process.exit(1);
  }

  let baseVersion = match[1];
  let alphaNumber = match[3] ? parseInt(match[3]) + 1 : 0;
  let newVersion = `${baseVersion}-alpha.${alphaNumber}`;

  // Update package.json with new version
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(`🔹 Updated package.json to version: ${newVersion}`);
  return newVersion;
}

// Main release process
async function releaseAlpha() {
  console.log("🚀 Starting Alpha Release Process...");

  // Ensure the working directory is clean
  runCommand("git status");

  // Get next alpha version
  const newVersion = await getNextAlphaVersion();

  // Commit changes
  runCommand("git add package.json");
  runCommand(`git commit -m "Bump version to ${newVersion}"`);

  // Create a git tag
  runCommand(`git tag -a ${newVersion} -m "Alpha release for ${newVersion}"`);
  runCommand("git push origin --tags");

  // Publish to npm with alpha tag
  runCommand("npm publish --tag alpha");

  console.log(`✅ Alpha release ${newVersion} published successfully!`);
}

// Execute the release function
releaseAlpha();
