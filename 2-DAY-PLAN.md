# Raahi: 2 din ka zero-budget validation plan

**Working name:** Raahi (naam final karne se pehle domain/name availability check kar lena.)  
**Goal:** 2 din mein idea ko real travellers aur stay owners ke saamne rakhna, unke jawab likhna, aur ek chhota pilot region choose karne ke liye evidence jama karna.

## Pehle kya validate karna hai

Abhi poora social network, booking system, monthly trips aur shop ek saath banana bahut bada kaam hoga. Sabse chhota useful version ye ho:

1. Ek hi pilot region mein **3–5 verified, solo-friendly stays** aur local adventure options ki manually curated discovery list.
2. Har stay/operator ke liye permission se actual photos, contact/booking method, price range ki last-confirmed date, basic facilities, activity qualifications aur solo traveller ke liye useful details.
3. Travellers ke liye Raahi AI travel guide ka first chat version; ise general planning helper samjho, live web search ya booking agent nahi.
4. Monthly strangers trip ko pehle direct conversations se validate karo; website par waitlist/booking live nahi hai. Exact operator, route, date, cost, inclusions, safety contact aur cancellation terms clear hone tak booking ya payment na lo.

Community profiles, follow/following, public posts, comments, product shop aur affiliate links baad ke phases hain. Inke liye accounts, data handling, moderation, fraud/reporting workflows, inventory ya commercial agreements chahiye. Pehle dekho ki curated stays ko travellers aur hosts dono chahte hain ya nahi.

## Demand ke current signals

- Uttarakhand ke Information and Public Relations Department ne February 2026 mein bataya ki 2025 mein **6.03 crore tourist/pilgrim visits** record hui. Is total mein pilgrims bhi shamil hain; ise solo-traveller demand ka seedha measure nahi samajhna chahiye. [Uttarakhand government release](https://uttarainformation.gov.in/%E0%A4%AA%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A4%9F%E0%A4%A8-%E0%A4%95%E0%A5%8B-%E0%A4%AC%E0%A5%9D%E0%A4%BE%E0%A4%B5%E0%A4%BE-%E0%A4%A6%E0%A5%87%E0%A4%A8%E0%A5%87-%E0%A4%95%E0%A5%80-%E0%A4%A6%E0%A4%BF/)
- Himachal Pradesh Economic Survey 2025–26 mein 2025 ke **3.11 crore total tourist arrivals** report hue, jismein **1.67 crore religious visitors** the. Ye destination activity ka signal hai, lekin tumhare exact backpacker niche ka proof nahi. [Himachal Economic Survey 2025–26 (PDF)](https://himachalservices.nic.in/economics/pdf/en-economic_survey_2025-26.pdf)
- Zostel ke platform data ko report karte hue ETTravelWorld ne 2025 mein **92,192 solo-female bookings** bataye; ye ek company ka data hai, poore India ya sirf mountain stays ka census nahi. [ETTravelWorld report](https://travel.economictimes.indiatimes.com/news/research-and-statistics/research/zostel-reports-significant-growth-in-solo-female-travel-surpassing-92000-bookings-in-2025/129227603)

**Nateeja:** travel aur solo travel mein interest ke signals hain. Par “remote mountain stay + trusted solo-friendly information + small community trip” ke liye demand abhi validate karni hai. Isi liye pehla kaam interviews/outreach hai, zyada features likhna nahi.

## Din 1 — 60–90 minute: logon ki problem samjho

### 1. Prototype dekho — 10 min

`index.html` ko computer par double-click karke Chrome ya Edge mein kholo. Ye presentation prototype hai; ismein abhi real stay/activity listings, booking, member accounts, live posts ya shop nahi hai. AI chat ka design aur server-side endpoint hai, lekin local file preview mein AI jawab nahi dega. Live AI ke liye Cloudflare Pages par deploy karke Workers AI binding jodni hogi.

### 2. 5 solo travellers se baat karo — 30–40 min

Friends, travel groups ya known travellers se **permission lekar** 5 short conversations karo. Pehle unki pichhli trip ke baare mein poochho; idea ko pitch karke unke jawab influence mat karo.

Copy karke bhejne ke liye:

> Hey! Main Himachal/Uttarakhand ke solo travellers ke liye ek mountain community idea validate kar raha hoon: solo-friendly stays, outdoor activities, small group trips aur travel planning help. Abhi koi booking ya paid service nahi hai. Kya main tumhari last mountain trip aur travel planning experience par 5 minute ke kuch sawaal pooch sakta hoon?

Sawaal:

- Pichhli mountain trip kahan ki thi, aur stay kaise dhoonda?
- Stay ya adventure activity choose karte waqt kaunsi info milna mushkil tha?
- Solo traveller ke liye stay choose karte waqt sabse zyada kya matter karta hai?
- Kya tumne trekking, rafting, paragliding ya doosri outdoor activity try/plan ki? Uske baare mein kya verify karna pada?
- Travel AI se abhi ek sawaal pooch sakte, to kya poochte? Kya tum ek monthly small-group strangers trip consider karte?

### 3. 5 stay owners ko reach out karo — 20–30 min

Public business contact par ek polite message bhejo. Photo, phone number, rate ya property details publish karne se pehle **clear permission** lo.

> Namaste! Main Himachal/Uttarakhand mein solo travellers ke liye mountain stays aur local outdoor experiences ki ek curated discovery page bana raha hoon. Abhi ye early research hai; bookings ya paid listing nahi le raha. Kya aap 5 minute baat karke bata sakte hain ki solo travellers aapke yahan rukte hain, unke common sawaal kya hote hain, aur kya aap future mein basic stay details permission ke saath list karna chahenge?

In baaton ko note karo:

- Property ka area aur official booking/contact method.
- Solo travellers ko welcome karte hain ya nahi; shared/private room options.
- Wi-Fi, meals, transport/access, mobile network jaise sawaalon ka sahi jawab.
- Rates kaise confirm hote hain aur rate ki date.
- Listing aur photos reuse karne ki permission kis se leni hai.
- Kya owner free pilot listing mein interested hai; paid placement baad mein discuss kar sakte hain.
- Kya property ke through koi outdoor activity offer hoti hai? Agar haan, actual operator/qualification/season details kya hain? Bina verification ke activity ko listing mein promise mat karo.

## Din 2 — 60–90 minute: signal dekho aur pehla region chuno

### 1. Replies ko ek jagah likho — 15 min

Notebook, phone note ya pehle se available spreadsheet mein columns banao: `Traveller/Host`, `Region`, `Problem`, `Requested info`, `Interest`, `Follow-up permission`, `Notes`. Bina consent ke kisi ka personal number ya private story public mat karo.

### 2. Region tabhi chuno jab evidence ho — 15 min

Himachal aur Uttarakhand ke har region ko ek saath cover mat karo. Jis ek region mein:

- travellers ne baar-baar ek jaisi stay ya adventure-information problem batayi ho, **aur**
- kam se kam kuch local hosts permission ke saath details share karne ko taiyaar hon, **aur**
- tumhare paas us jagah ki information verify karne ka practical tareeqa ho,

usi ko pilot ke liye shortlist karo. Sirf photo appeal ya general tourist numbers par region final mat karo.

### 3. Page mein sirf verified cheezein update karo — 20–30 min

Prototype par pilot region ka naam tabhi dikhana jab tum usse support kar sako. Actual partner properties, exact prices, safety claims, review/ratings ya booking availability tab tak add mat karo jab tak source aur owner ki permission na ho. Website signup, listing ya booking details store nahi karti. Chat question AI answer banane ke liye Cloudflare Workers AI ko bheja jayega; hamare code mein conversation database nahi hai.

### 4. Optional: page ko free URL par publish karo — 15–30 min

Cloudflare Pages ke official docs static HTML ko Direct Upload/drag-and-drop se publish karne dete hain. **AI Function ke liye Git-connected Pages project chahiye**; dashboard ka drag-and-drop `functions` folder compile nahi karta. Beginner route: GitHub repository mein `raahi-community` folder ke contents root par upload karo, Cloudflare Pages mein repo connect karo, build command `exit 0` aur output directory `.` set karo; phir deployment ke Settings → Bindings mein Workers AI binding add karo, naam `AI` rakho, aur redeploy karo. Binding ko Cloudflare Pages Function read karega. [Static HTML + Git deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) · [AI binding setup](https://developers.cloudflare.com/pages/functions/bindings/) · [Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/)

Account tum khud create karo aur service ke terms tum khud review/accept karo. Custom domain abhi mat khareedo; `pages.dev` preview kaafi hai.

## Do din baad decision kaise lo

- Agar travellers ki interest strong ho par owners ki participation nahi, pehle destination guides aur stay-verification method par kaam karo.
- Agar owners interested hon par traveller need unclear ho, pehle 5 aur travellers se baat karo; app features mat banao.
- Agar dono taraf se real interest aaye, ek region aur 3–5 permissioned listings ke saath manual pilot shuru karo.
- Agar dono taraf response kam ho, idea ko chhota/pivot karo—jaise sirf solo-friendly stay guide ya sirf monthly group trip interest test.

“Haan, achha idea hai” ko demand mat gino. Zyada strong signal hai: traveller kisi real trip ka zikr karke exact information maange; host listing ke liye data aur permission dene ko taiyaar ho; ya koi vyakti future update ke liye khud opt in kare.

## Free ya near-zero-cost tools

- **Abhi:** local website + direct conversations. Koi paid booking engine, AI-provider API key, app ya custom domain ki zaroorat nahi.
- **Preview URL:** Cloudflare Pages. Static site ka Free plan option hai; AI Function ke liye Git integration aur dashboard binding setup chahiye.
- **AI inference:** Cloudflare Workers AI Free plan par published 10,000 Neurons/day allocation hai. Free limit ke baad requests fail hoti hain; paid plan activate karna zaroori nahi jab tak tum khud decide na karo. Launch se pehle current pricing check karo. [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- **Interest list:** abhi manual notes. Jab zaroorat ho tab simple form/spreadsheet use karo; sirf utna data lo jitna follow-up ke liye chahiye.
- **Later:** real member accounts, posts, comments, follow/following, moderation and messaging ke liye backend aur privacy/safety work chahiye. Isse pehle demand prove karo.

## Earning ka realistic order

1. Pehle reliable audience aur permissioned information.
2. Phir partner ke saath written terms hon to referral/commission; user ko batao ki link paid ho sakta hai.
3. Monthly trips tab jab local operator, actual per-person costing, inclusions, safety plan, emergency contact, cancellation/refund terms aur participant screening clear ho. Pehle pilot mein kisi experienced local operator ke saath kaam karna safer hai.
4. Sponsored stay placements ko sponsored label karo.
5. Shop/affiliate products ko tabhi add karo jab readers/travellers genuinely unki recommendation maangein.

Koi earning guaranteed nahi hai; pehle do din ka outcome sirf evidence aur ek focused next step hona chahiye.

## Prototype ke baare mein

[`index.html`](./index.html) concept page hai—real directory, booking, payment, social feed, member profile ya product store nahi. [`functions/api/ask.js`](./functions/api/ask.js) server-side AI endpoint hai; ye live weather, traffic, road closures, permits, prices ya availability check nahi karta. Photos regional inspiration hain, partner-stay photos nahi; source credits page ke footer mein hain. Published karne se pehle page ke claims, images aur `Raahi` naam ko check kar lena.
