/* ============================================================
   kunalai.in: ALL SITE CONTENT LIVES HERE
   Edit the text between the "quotes", save, and commit.
   Keep commas between items. See README.md for help.
   ============================================================ */

/* Your links */
var SITE = {
  linkedin: "https://www.linkedin.com/in/kunal--mukherjee/",
  newsletter: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7396425243105329152",   // What the AI!? subscribe link
  x: "https://x.com/mukherjee_kunal",
  email: "kunalai.in@gmail.com"
};

/* Words that rotate in the headline "AI, explained for ___" */
var K_WORDS = ["marketers", "CFOs", "founders", "HR leaders", "managers", "students"];

/* Chapter 01: Perspectives: the camps. pos = position on the line (0 to 100) */
var K_CAMPS = [
  { id: "sceptics", big: "Real, but oversold", act: "Insist on evidence and move at a measured pace.", name: "Not so fast", pos: 6, claim: "Today's AI is impressive but overhyped, and it will spread slowly, like every big technology before it.", argument: "Language models still make confident mistakes and lack real understanding of the world. Businesses take years to change how they work, so the impact will be real but gradual.", voices: ["Yann LeCun", "Gary Marcus", "Arvind Narayanan"], forYou: "Don't panic and don't bet the company on a demo. Insist on evidence, measure results and treat bold claims with healthy suspicion.", take: "They keep the hype honest, and adoption really is slower than the demos suggest. But waiting for perfect AI is a bigger risk than starting with useful AI." },
  { id: "augment", big: "As big as the PC and the internet", act: "Put it in everyone's hands now and learn by doing.", name: "Augment", pos: 40, claim: "AI is a co-worker, not a replacement. The winners will be the people and teams who learn to use it well.", argument: "AI is already good enough to make professionals faster and better at many tasks. The bottleneck isn't the model, it's skills, workflows and management.", voices: ["Ethan Mollick", "Andrew Ng", "Fei-Fei Li"], forYou: "Start using AI in your actual work every day. The skill gap between those who do and those who don't is widening fast.", take: "This is my camp. The winners won't be the companies with the best model. They'll be the ones whose people know how to use it on a Tuesday afternoon." },
  { id: "india", big: "Huge, if it reaches a billion people", act: "Build open, low-cost rails in Indian languages.", name: "Population scale", pos: 54, claim: "India's opportunity is to deploy AI for a billion people, in their own languages, as public infrastructure.", argument: "India built Aadhaar and UPI at a scale no one else had tried. The same playbook can bring AI to farmers, students and small businesses through Indian-language models and open platforms.", voices: ["Nandan Nilekani", "Sarvam AI", "IndiaAI Mission"], forYou: "Look for AI use cases that work in Hindi, Marathi or Tamil, on a basic phone, at Indian price points. That's where the next big Indian companies will come from.", take: "India's edge isn't building the biggest model. It's putting AI in the hands of a billion people, the way we did with payments." },
  { id: "align", big: "Possibly bigger than anything before", act: "Put safety and rules in place first.", name: "Align first", pos: 78, claim: "Very powerful AI may arrive soon, and we need safety and rules in place before it does.", argument: "The people who invented modern AI are among the most worried about it. They argue that systems are improving faster than our ability to understand and control them.", voices: ["Geoffrey Hinton", "Yoshua Bengio", "Dario Amodei"], forYou: "Take governance seriously in your organisation: data privacy, human review of important decisions, and clear accountability for what AI does.", take: "You don't have to be a doomer to want seatbelts. Trust is what turns AI from a demo into a habit." },
  { id: "accel", big: "The biggest shift in history", act: "Build faster. Delay is the real risk.", name: "Accelerate", pos: 94, claim: "AI will create enormous abundance. The biggest risk is moving too slowly.", argument: "Cheaper intelligence will speed up science, medicine and productivity. Countries and companies that build fastest will capture the benefits.", voices: ["Sam Altman", "Jensen Huang", "Demis Hassabis"], forYou: "Expect tools to get much better, much faster. Plan for what your business looks like when AI is ten times more capable than today.", take: "The ambition is right. But speed without skills just widens the gap between those who can use AI and those who can't." }
];

/* Chapter 02: Your job. level = 1 to 5; verdict = Amplified / Reinvented / Squeezed / Split */
var K_ROLES = [
  { name: "Marketing", level: 4, verdict: "Reinvented", absorbs: "First drafts, ad variations, research summaries, social calendars and performance reports.", human: "Brand judgement, taste, consumer insight, and the relationships with partners and creators.", next: "Running AI-assisted campaign workflows and testing ideas at ten times the speed." },
  { name: "Finance", level: 4, verdict: "Reinvented", absorbs: "Reconciliations, variance commentary, first-pass models and routine reporting.", human: "Judgement, controls, the trust of the board, and capital allocation decisions.", next: "Using AI over your spreadsheets, and knowing how to check its numbers." },
  { name: "Sales", level: 3, verdict: "Amplified", absorbs: "Prospect research, follow-up emails, call notes and CRM hygiene.", human: "Trust, negotiation, reading the room and closing.", next: "AI-led account research so every meeting starts better prepared." },
  { name: "Operations", level: 3, verdict: "Reinvented", absorbs: "SOP writing, scheduling, reporting and ticket triage.", human: "Handling exceptions, vendor relationships and on-ground execution.", next: "Mapping processes and spotting which steps AI agents can take over." },
  { name: "HR", level: 3, verdict: "Reinvented", absorbs: "Job descriptions, first-round screening, policy questions and onboarding content.", human: "Culture, conflict, coaching and fair judgement calls about people.", next: "Designing AI-era roles and reskilling paths for your whole company." },
  { name: "Customer support", level: 5, verdict: "Squeezed", absorbs: "Routine queries and first responses, in every language, around the clock.", human: "Escalations, empathy and the complicated cases that build loyalty.", next: "Training, supervising and improving AI support agents." },
  { name: "Software", level: 5, verdict: "Squeezed at entry level", absorbs: "Boilerplate code, tests, documentation and first-pass reviews.", human: "System design, product sense and owning the outcome.", next: "Directing coding agents and reviewing their work with a senior eye." },
  { name: "Content and creative", level: 4, verdict: "Split", absorbs: "Stock visuals, first drafts, edits, transcription and dubbing.", human: "An original voice, taste, IP and live experiences. Generic work gets squeezed, distinctive work gets amplified.", next: "Directing AI tools while building a point of view nobody can copy." },
  { name: "Legal and compliance", level: 4, verdict: "Reinvented", absorbs: "Document review, research and first drafts of contracts.", human: "Advice, accountability and representing clients.", next: "AI-assisted research with rigorous, line-by-line verification." },
  { name: "Founders and leaders", level: 3, verdict: "Amplified", absorbs: "Research, analysis, decks and first drafts of almost everything.", human: "Vision, capital, hiring and the final call.", next: "Redesigning your organisation around AI-native workflows." }
];

/* Chapter 03: What to study */
var K_TRACKS = [
  { id: "student", label: "Student", intro: "Don't chase the latest tool. Build deep fundamentals, pick a domain you love, and use AI every day as your tutor and collaborator.", steps: [
    { n: "01", title: "Keep the fundamentals", body: "Maths, statistics and clear writing. They never go out of date and they make AI far more useful to you." },
    { n: "02", title: "Go deep in a domain", body: "AI is most valuable paired with real expertise: biology, design, finance, law, anything." },
    { n: "03", title: "Build something weekly", body: "Ship small projects with AI. A portfolio of things you made beats a list of courses." },
    { n: "04", title: "Understand how it works", body: "You don't need to code models, but know what they are, what they're good at and where they fail." } ],
    courses: [
    { title: "Elements of AI", by: "University of Helsinki · free", url: "https://www.elementsofai.com" },
    { title: "CS50's Introduction to AI with Python", by: "Harvard · free", url: "https://cs50.harvard.edu/ai/" },
    { title: "Neural Networks: Zero to Hero", by: "Andrej Karpathy · free", url: "https://karpathy.ai/zero-to-hero.html" },
    { title: "Practical Deep Learning", by: "fast.ai · free", url: "https://course.fast.ai" } ] },
  { id: "pro", label: "Professional", intro: "You don't need to become technical. You need to become the person on your team who uses AI best in your actual job.", steps: [
    { n: "01", title: "Use it daily for 30 days", body: "Pick three real tasks from your week and do them with AI first. Habits beat courses." },
    { n: "02", title: "Learn to brief", body: "Prompting is delegation. Clear context, a clear goal and good examples get you great work." },
    { n: "03", title: "Get data literate", body: "Read a chart, question a number and know when an AI answer looks too good to be true." },
    { n: "04", title: "Always verify", body: "AI is confident even when it's wrong. Your judgement is the value you add." } ],
    courses: [
    { title: "AI For Everyone", by: "Andrew Ng · Coursera", url: "https://www.coursera.org/learn/ai-for-everyone" },
    { title: "Google AI Essentials", by: "Google", url: "https://grow.google/ai-essentials/" },
    { title: "Short courses", by: "DeepLearning.AI · free", url: "https://www.deeplearning.ai/short-courses/" },
    { title: "FutureSkills Prime", by: "NASSCOM and MeitY", url: "https://futureskillsprime.in" } ] },
  { id: "leader", label: "Leader", intro: "Your job is to redesign how work gets done, not to buy a tool. Start with tasks, run small pilots and reskill before you restructure.", steps: [
    { n: "01", title: "Map tasks, not jobs", body: "Break roles into tasks and ask which ones AI can draft, check or do end to end." },
    { n: "02", title: "Pilot with metrics", body: "Run small experiments with clear before-and-after numbers. Scale what works." },
    { n: "03", title: "Set guardrails", body: "Decide on data privacy, human review and accountability before something goes wrong." },
    { n: "04", title: "Reskill first", body: "Invest in your people's AI skills before you redesign teams around fewer people." } ],
    courses: [
    { title: "One Useful Thing", by: "Ethan Mollick", url: "https://www.oneusefulthing.org" },
    { title: "AI Index Report", by: "Stanford HAI", url: "https://hai.stanford.edu/ai-index" },
    { title: "Anthropic Economic Index", by: "Anthropic", url: "https://www.anthropic.com/economic-index" },
    { title: "Future of Jobs Report", by: "World Economic Forum", url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/" } ] }
];

/* Chapter 04: People. tag = PIONEERS / BUILDERS / TRANSLATORS / SCEPTICS / INDIA */
var K_PEOPLE = [
  { tag: "PIONEERS", name: "Geoffrey Hinton", why: "A founding father of deep learning and a Nobel laureate who now warns loudly about AI's risks.", url: "https://en.wikipedia.org/wiki/Geoffrey_Hinton" },
  { tag: "PIONEERS", name: "Yoshua Bengio", why: "Turing Award winner who leads international scientific work on keeping advanced AI safe.", url: "https://en.wikipedia.org/wiki/Yoshua_Bengio" },
  { tag: "PIONEERS", name: "Fei-Fei Li", why: "Created ImageNet, which kickstarted modern AI, and champions human-centred AI.", url: "https://en.wikipedia.org/wiki/Fei-Fei_Li" },
  { tag: "PIONEERS", name: "Raj Reddy", why: "Indian-born AI pioneer and the first person of Asian origin to win the Turing Award.", url: "https://en.wikipedia.org/wiki/Raj_Reddy" },
  { tag: "BUILDERS", name: "Demis Hassabis", why: "Co-founder of Google DeepMind and Nobel laureate for AlphaFold's protein-structure breakthrough.", url: "https://en.wikipedia.org/wiki/Demis_Hassabis" },
  { tag: "BUILDERS", name: "Dario Amodei", why: "Co-founder of Anthropic. Writes thoughtfully about both the promise and the risks of powerful AI.", url: "https://en.wikipedia.org/wiki/Dario_Amodei" },
  { tag: "BUILDERS", name: "Sam Altman", why: "OpenAI's CEO and the most influential voice for moving fast on AI.", url: "https://en.wikipedia.org/wiki/Sam_Altman" },
  { tag: "BUILDERS", name: "Jensen Huang", why: "NVIDIA's founder, whose chips power almost every major AI model.", url: "https://en.wikipedia.org/wiki/Jensen_Huang" },
  { tag: "BUILDERS", name: "Mustafa Suleyman", why: "DeepMind co-founder and author of The Coming Wave, a sharp book on AI and power.", url: "https://en.wikipedia.org/wiki/Mustafa_Suleyman" },
  { tag: "TRANSLATORS", name: "Andrej Karpathy", why: "The best teacher in AI. Explains how models really work in plain language.", url: "https://karpathy.ai" },
  { tag: "TRANSLATORS", name: "Ethan Mollick", why: "Wharton professor and author of Co-Intelligence. The most practical guide to AI at work.", url: "https://www.oneusefulthing.org" },
  { tag: "TRANSLATORS", name: "Andrew Ng", why: "Has taught millions about AI through Coursera and DeepLearning.AI.", url: "https://www.andrewng.org" },
  { tag: "SCEPTICS", name: "Yann LeCun", why: "Turing Award winner who argues today's language models alone won't reach human-level intelligence.", url: "https://en.wikipedia.org/wiki/Yann_LeCun" },
  { tag: "SCEPTICS", name: "Gary Marcus", why: "Cognitive scientist and AI's most persistent critic of hype.", url: "https://en.wikipedia.org/wiki/Gary_Marcus" },
  { tag: "SCEPTICS", name: "Arvind Narayanan", why: "Princeton professor who argues AI is a normal technology that will spread gradually.", url: "https://en.wikipedia.org/wiki/Arvind_Narayanan" },
  { tag: "INDIA", name: "Nandan Nilekani", why: "Infosys co-founder and Aadhaar architect who makes the case for AI at India's population scale.", url: "https://en.wikipedia.org/wiki/Nandan_Nilekani" },
  { tag: "INDIA", name: "Sarvam AI", why: "Bengaluru startup building foundation models for Indian languages.", url: "https://www.sarvam.ai" }
];

/* Chapter 05: Reading room. tag = START HERE / MANAGERS / BIG PICTURE / DATA / INDIA */
var K_READS = [
  { tag: "START HERE", title: "One Useful Thing", source: "Ethan Mollick", why: "The clearest, most practical writing on using AI at work.", url: "https://www.oneusefulthing.org" },
  { tag: "START HERE", title: "Andrej Karpathy", source: "Talks and videos", why: "How large language models work, explained by one of their builders.", url: "https://karpathy.ai" },
  { tag: "MANAGERS", title: "Simon Willison's Weblog", source: "Simon Willison", why: "Hands-on tests of every new tool. See what AI can really do this week.", url: "https://simonwillison.net" },
  { tag: "MANAGERS", title: "Stratechery", source: "Ben Thompson", why: "Sharp strategy on how AI is reshaping tech and media business models.", url: "https://stratechery.com" },
  { tag: "MANAGERS", title: "Benedict Evans", source: "Essays", why: "Big-picture thinking on what AI means for products and markets.", url: "https://www.ben-evans.com" },
  { tag: "BIG PICTURE", title: "Machines of Loving Grace", source: "Dario Amodei", why: "A concrete, optimistic essay on what powerful AI could do for the world.", url: "https://www.darioamodei.com/essay/machines-of-loving-grace" },
  { tag: "BIG PICTURE", title: "Situational Awareness", source: "Leopold Aschenbrenner", why: "A bold, much-debated forecast. Read it to understand the accelerationist case.", url: "https://situational-awareness.ai" },
  { tag: "BIG PICTURE", title: "Import AI", source: "Jack Clark", why: "A weekly newsletter on the research and policy shaping AI.", url: "https://jack-clark.net" },
  { tag: "DATA", title: "AI Index Report", source: "Stanford HAI", why: "The annual reference for numbers on research, investment and adoption.", url: "https://hai.stanford.edu/ai-index" },
  { tag: "DATA", title: "State of AI Report", source: "Air Street Capital", why: "A yearly snapshot of AI's industry, research and politics.", url: "https://www.stateof.ai" },
  { tag: "INDIA", title: "IndiaAI Mission", source: "Government of India", why: "Where India's national AI policy and programmes are announced.", url: "https://indiaai.gov.in" },
  { tag: "INDIA", title: "Analytics India Magazine", source: "AIM", why: "Daily coverage of India's AI startups, enterprises and talent.", url: "https://analyticsindiamag.com" },
  { tag: "INDIA", title: "What the AI!?", source: "Kunal Mukherjee", why: "My newsletter on LinkedIn: practical AI for non-technical Indian managers.", url: SITE.newsletter }
];
