#!/bin/bash
set -e
echo "Building..."
cd "$(dirname "$0")/.."
rm -rf .vercel/output
vercel build --prod --yes
echo "Deploying (hiding .git to avoid Vercel/GitHub team conflict)..."
mv .git .git-hidden
vercel deploy --prebuilt --prod --yes
mv .git-hidden .git
echo "Done. Live at https://plumbing-os.vercel.app"
