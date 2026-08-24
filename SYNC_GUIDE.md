# Easy Website Update Workflow

Use this workflow when you want to edit files in this folder and sync the changes to the live website.

## Edit Locally

Common files:

- `index.html`: website text and page structure
- `styles.css`: colors, spacing, layout, mobile style
- `script.js`: mobile menu behavior
- `_headers`: Cloudflare response headers

## Preview Before Publishing

Double-click:

```text
preview.command
```

Then open:

```text
http://localhost:4173
```

## Publish Changes

Double-click:

```text
deploy.command
```

Enter a short update message when prompted.

The script will:

1. Check changed files.
2. Create a Git commit.
3. Push to GitHub.
4. Let Cloudflare deploy automatically.

## Important

Your GitHub remote currently uses HTTPS:

```text
https://github.com/DLo-cloud/honghai-landing-site.git
```

If `deploy.command` asks for GitHub login or fails with an authentication error, use one of these options:

- Open the repository in GitHub Desktop, sign in, then use GitHub Desktop to commit and push.
- Configure GitHub SSH keys, then change the remote to:

```sh
git remote set-url origin git@github.com:DLo-cloud/honghai-landing-site.git
```

Once the push succeeds, Cloudflare should update the live website automatically.
