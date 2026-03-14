# デプロイ手順

## pokopoke-habitat-guide

**デプロイ先: Netlify (API経由)**
- サイト: https://pokopoke-habitat-guide.netlify.app
- サイトID: `5f2caa7b-7101-4e84-ab90-2949b734e431`
- トークン: `.env` ファイルの `NETLIFY_AUTH_TOKEN` を使用

### デプロイ手順（GitHub Pagesは使わない。必ずNetlify APIを使う）

```bash
cd pokopoke-habitat-guide
npm run build
cd dist && zip -r /tmp/dist.zip .
curl -s -X POST "https://api.netlify.com/api/v1/sites/5f2caa7b-7101-4e84-ab90-2949b734e431/deploys" \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary @/tmp/dist.zip
```

**重要: GitHub Pagesは絶対に使わない。Netlify API一発デプロイのみ。**
