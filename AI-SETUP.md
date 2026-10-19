# Raahi AI guide ko live kaise karna hai

Is project mein chat screen aur server-side AI route bana hua hai. AI answer tab dega jab website Cloudflare Pages par deploy ho aur us project mein Workers AI binding `AI` naam se add ho. Is setup mein koi provider API key website code mein nahi rakhni padti.

## Tumhe kya chahiye

- Ek GitHub account aur ek Cloudflare account. Free accounts se start kiya ja sakta hai; account create karte waqt service ke current terms aur plan options khud dekho.
- GitHub Desktop, agar terminal commands use nahi karna chahte.
- Project ke dono parts: `index.html` aur `functions/api/ask.js`.

## Beginner setup

1. `Raahi` GitHub repository ko private rakho. Cloudflare ko GitHub account se connect karte waqt us private repository ka access allow karna hoga.
2. Is project ke root ke andar ki files repository ke root mein rakho. `index.html` aur `functions/` same level par hone chahiye; `functions/api/ask.js` repository ke root se yahi path rahe.
3. Files ko `main` branch par commit karke GitHub par push karo.
4. Cloudflare dashboard mein **Workers & Pages → Create application → Pages → Import an existing Git repository** chuno, GitHub authorize karo, aur `Raahi` repository select karo. Agar authorization prompt aaye, GitHub par Cloudflare ko sirf `Raahi` repository tak access do, agar ye choice available ho.
5. Pages settings mein production branch `main`, **Build command** `exit 0`, aur **Build output directory** `.` rakho. Root directory ko default (`/`) hi chhodo. Deploy shuru karo. Git-connected Pages static site ke saath `functions/api/ask.js` ko `/api/ask` route par deploy karega.
6. Pehla deploy successful hone ke baad Pages project mein **Settings → Bindings → Add → Workers AI** chuno. Variable/binding name `AI` rakho, save karo, phir production deployment redeploy karo.
7. `pages.dev` site kholo, Ask Raahi section mein ek chhota travel sawaal bhejo. Agar assistant unavailable kahe, `AI` binding Production environment mein add hui hai ya nahi check karke redeploy karo.

Cloudflare ke mutabik Pages Functions ko Git integration se deploy kiya ja sakta hai; dashboard Direct Upload se `functions` folder compile nahi hota. Isliye sirf folder drag-and-drop karne se AI route live nahi hoga. [Static HTML deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) · [Direct Upload limitation](https://developers.cloudflare.com/pages/get-started/direct-upload/) · [Workers AI binding steps](https://developers.cloudflare.com/pages/functions/bindings/)

## Zero-budget ki limit

Cloudflare Workers AI ki published Free allocation abhi **10,000 Neurons per day** hai. Free plan ki limit poori hone par requests error de sakti hain. Starting prototype mein paid plan enable karne ki zaroorat nahi; limit change ho sakti hai, isliye publish karne ke din official [pricing page](https://developers.cloudflare.com/workers-ai/platform/pricing/) check karo. Model is project mein `@cf/zai-org/glm-4.7-flash` hai; Cloudflare ise multilingual conversational model ke roop mein list karta hai aur July 2026 ke docs mein Free plan par available models mein shamil karta hai. [Model details](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) · [Free model availability](https://developers.cloudflare.com/changelog/post/2026-07-28-models-require-workers-paid/)

## Assistant ki boundaries

Raahi guide route ideas, approximate budgets, packing, activity questions aur trip planning mein madad karta hai. Ye abhi web search, map, live weather, traffic, permit, stay availability ya booking tools use nahi karta. Page par isi liye current conditions verify karne ki reminder hai. Adventure activity ya safety decision ke liye AI answer par akela bharosa mat karo; local qualified operators aur official information confirm karo.
