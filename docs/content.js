/*
 * Tallgrass Crisis-in-a-Box: scenario content.
 * Source facts: COMM5009 CrisisInABox Student Packet.docx, pp. 1–2, 6, 8.
 * Tasks and assessment: newer Assignment Description, Facilitator Guide,
 * Briefing Memo Template, and Post-Crisis Evaluation Template.
 * Current instructor directions: write on one paper memo handout per team
 * and hand it directly to the instructor at the end of class.
 * The older packet's worksheets, restrictive role rules, fourteen-minute
 * rounds, and three-minute presentations are deliberately not carried over.
 */
window.CRISIS_CONTENT = {
  title: "Crisis-in-a-Box",
  subtitle: "Tallgrass Student Living · COMM 5009",
  disclaimer: "This is a fictional classroom exercise, not a report of a real incident.",
  company: {
    name: "Tallgrass Student Living",
    property: "The Halden",
    overview: "You are Tallgrass Student Living's crisis communication team. As the situation develops, decide what the company should do and say. Work together and keep a record of what changes your thinking.",
    facts: [
      { label: "Company", value: "Privately held; founded in 2014; 60 employees" },
      { label: "Portfolio", value: "Five apartment buildings within six blocks of UC; about 1,400 beds" },
      { label: "The Halden", value: "Six stories; 240 beds; two blocks from campus; opened August 2024" },
      { label: "Residents", value: "236 students this semester, almost all UC undergraduates" },
      { label: "Chief executive", value: "Dana Whitlock" },
      { label: "Property manager", value: "Marcus Reyes" }
    ],
    backgroundHtml: `<p>Tallgrass Student Living is a privately held company based in Cincinnati. It owns and manages five apartment buildings within six blocks of the University of Cincinnati, about 1,400 beds in all. Founded in 2014, it has 60 employees.</p>
      <h3>Its public promise</h3><p>The company markets its housing as <q>built for how students actually live</q>. Its Resident Promise says every maintenance request gets a response within 24 hours. The promise appears in every lease packet and on the website, but it is a marketing promise, not a term of the lease.</p>
      <h3>The Halden</h3><p>The newest building opened in August 2024. It has six stories and 240 beds, two blocks from campus. This semester 236 students live there, almost all UC undergraduates; a parent guarantees most leases. Kessler-Brandt Construction built the property, and Larkin &amp; Pell Structural Engineers designed its structure.</p>
      <h3>Your team</h3><p>The company's two-person marketing and communications team is working with property manager Marcus Reyes and whoever else the company can bring in this morning. Founder and chief executive Dana Whitlock is driving back from Columbus and expects to arrive around 11:30 a.m. She is reachable by phone.</p><p>The company has no crisis plan.</p>`,
    resourcesHtml: `<h3>Communication channels</h3><ul><li>A resident portal that can text and email every resident at once.</li><li>Every guarantor's phone number and email address.</li><li>The company website and Instagram account, with 6,200 followers.</li><li>The leasing office phone line, which opens at 9:00 a.m.</li></ul>
      <h3>People available</h3><p>Marcus Reyes and two maintenance staff are on site. Three leasing staff arrive at 9:00 a.m. The two communications staff are available, and Dana Whitlock is reachable by phone until she arrives.</p>
      <h3>Lease and spending authority</h3><p>If a unit becomes uninhabitable, rent stops until it is habitable again. The lease does not require the company to provide alternative housing. The Resident Promise is marketing, not a lease provision.</p><p>The company may spend up to <strong>$25,000 today without the chief executive's approval</strong>, and more with her approval.</p>`,
    sources: ["student-packet"]
  },
  roles: [
    { name: "Crisis lead", description: "Keeps the team on time and makes the final call when the team disagrees." },
    { name: "Spokesperson", description: "Drafts the public statements and reads the final statement to the class." },
    { name: "Stakeholder liaison", description: "Speaks for the people affected and drafts the message to them." },
    { name: "Media and digital lead", description: "Reads each update first and tracks the reporter and social media." },
    { name: "Recorder", description: "Writes on the memo handout and records how the team's response changes." }
  ],
  roleNotes: [
    "In a team of four, the stakeholder liaison also serves as recorder.",
    "In a team of three, the crisis lead also takes the media and digital role, and the stakeholder liaison also serves as recorder.",
    "Everyone helps the team think through its decisions. Take responsibility for your role and speak up when you have something to add."
  ],
  submission: {
    title: "Crisis Response Briefing Memo",
    due: "Give one completed paper memo per team to the instructor at the end of class.",
    addressedTo: "Dana Whitlock, Chief Executive",
    sections: [
      { number: 1, title: "Situation summary", prompt: "In 3 to 4 sentences, explain what has happened and how much responsibility the public is likely to assign to the company right now." },
      { number: 2, title: "Holding statement", prompt: "Write 3 to 4 sentences for the reporter and social media while the facts are still developing." },
      { number: 3, title: "Public statement", prompt: "In 5 to 7 sentences, explain what is known, what the company is doing, and what happens next." },
      { number: 4, title: "Message to a priority stakeholder", prompt: "Choose the group that most needs to hear from the company. Name that audience and write a message of 3 to 5 sentences." },
      { number: 5, title: "Immediate actions", prompt: "List three actions the company will take in the next 24 hours." },
      { number: 6, title: "Advice to the chief executive", prompt: "In 2 to 3 sentences, explain what she should say, what she should avoid saying, and why." },
      { number: 7, title: "How our response changed", prompt: "Write one line after each update: what your team decided and what changed your thinking." }
    ],
    individual: {
      title: "Post-Crisis Evaluation",
      due: "Friday, November 20, 2026, at 11:59 p.m. on Canvas",
      description: "Write about two pages on your own. In every section, use course concepts to examine a specific decision your team made. Briefly explain each concept and support your analysis with examples from the simulation.",
      sections: [
        { title: "Crisis diagnosis", prompt: "How did your team understand the crisis at first, and how did that change? How did the responsibility you expected the public to assign to the company shape your response?" },
        { title: "Response strategy", prompt: "What was your first communication approach, why did you choose it, and how did it change?" },
        { title: "Stakeholder priorities", prompt: "Who did your team put first, and why? Did those priorities change?" },
        { title: "Challenges and constraints", prompt: "What constraints and unknowns shaped your decisions? Where was it hard to stay consistent, clear, or fast enough?" },
        { title: "Reassessment", prompt: "What would you change? When did your first approach stop working? What would you have done differently on your own? Identify one addition to your client's crisis communication one-sheet." }
      ]
    },
    notes: [
      "Write your answers on one printed memo handout per team. Give the completed handout directly to your instructor at the end of class.",
      "Include your team name, members, and roles. Take a photo before handing it in if you want a copy for your individual evaluation.",
      "Your final memo should reflect what you know at the end. Use section 7 to keep a record of the decisions you made along the way and why they changed.",
      "Focus on completing the memo and responding to the information you receive. You are not graded on polish. The guiding questions are for discussion; you do not submit separate answers.",
      "The simulation is worth 50 points: participation, 30 points; individual Post-Crisis Evaluation, 20 points."
    ]
  },
  guide: {
    title: "Questions to guide your discussion",
    intro: "Keep these questions handy as you work. Use concepts from your course readings to explain the choices your team makes.",
    concepts: [
      { title: "Crisis responsibility", prompt: "Given what people know now, how much responsibility might they assign to the company? What information could change their view?" },
      { title: "Stakeholder needs", prompt: "What do the people affected need to do and know now? Who needs to hear from the company first?" },
      { title: "Identity and promises", prompt: "What has the company promised people? How does the information you have now relate to those promises?" },
      { title: "Sensemaking and commitment", prompt: "What was your team's first position? What evidence would lead you to change it?" },
      { title: "Accountability and blame", prompt: "What can the company take responsibility for now? What would you need to know before making a claim about the cause?" }
    ],
    html: `<p>Before finalizing a message, ask: What do we know? What remains uncertain? Who needs something from us? What can we commit to doing? When will people hear from us next?</p><p>Use only the background and the released case information. There is no single correct response, but the team should be able to explain its reasoning.</p>`
  },
  stages: [
    {
      id: "setup", eyebrow: "Start here", title: "Get your team ready", scenarioTime: "Before the simulation", duration: 300,
      description: "Choose your roles and get your printed memo handout ready. Your instructor will tell you when to begin.",
      tasks: [
        "Sit with your client team and choose the five roles. Combine roles if your team has fewer than five members.",
        "Get one printed Crisis Response Briefing Memo handout for your team and choose who will write.",
        "Read the company background and resources. You can return to them throughout the exercise.",
        "Use only the background and the updates available to your team. Discuss the prompts together and write your answers on the memo handout."
      ],
      completion: {
        title: "Ready to begin?",
        description: "Check these when your team is ready to work. Your instructor will tell you when to open the first update.",
        checks: [
          { id: "setup-roles", label: "We've chosen our roles." },
          { id: "setup-memo", label: "We have our printed memo handout, and our recorder is ready to write." }
        ]
      },
      artifacts: [
        {
          id: "company-profile", type: "background", label: "Company background", title: "Tallgrass Student Living", source: "Case background", time: "Available before Update 1", summary: "The company, its public promise, and The Halden.",
          body: `<p>Tallgrass Student Living is a privately held Cincinnati company, founded in 2014, with 60 employees. It owns and manages five apartment buildings within six blocks of the University of Cincinnati: about 1,400 beds.</p><h3>A public promise</h3><p>Its housing is marketed as <q>built for how students actually live</q>. Its Resident Promise says every maintenance request receives a response within 24 hours. The promise is printed in every lease packet and on the website, but it is marketing, not a lease term.</p><h3>The Halden</h3><p>The newest building opened in August 2024: six stories, 240 beds, two blocks from campus. It houses 236 students this semester, almost all UC undergraduates. A parent guarantees most leases.</p><p>Kessler-Brandt Construction built The Halden. Larkin &amp; Pell Structural Engineers designed the structure. Marcus Reyes is its property manager. Dana Whitlock is the founder and chief executive.</p><h3>Your position</h3><p>You represent the two-person marketing and communications team, working with Marcus Reyes and other staff the company can bring in. The company has no crisis plan.</p>`
        },
        {
          id: "company-resources", type: "reference", label: "Resources and constraints", title: "What you have to work with", source: "Case background", time: "Available throughout", summary: "Who can help, how to reach people, what the lease says, and what you can spend.",
          body: `<h3>Communication channels</h3><ul><li>The resident portal can text and email every resident at once.</li><li>The company has every guarantor's phone number and email address.</li><li>It has a website and an Instagram account with 6,200 followers.</li><li>The leasing office phone line opens at 9:00 a.m.</li></ul><h3>People</h3><p>Marcus Reyes and two maintenance staff are on site. Three leasing staff arrive at 9:00 a.m. The two communications staff are available. Dana Whitlock is driving back from Columbus, expects to arrive around 11:30 a.m., and is reachable by phone.</p><h3>The lease</h3><p>If a unit becomes uninhabitable, rent stops until it is habitable again. The lease does not require the company to provide other housing. The Resident Promise is marketing, not a lease provision.</p><h3>Money</h3><p>The company can spend up to <strong>$25,000 today without the chief executive's approval</strong>, and more with her approval.</p>`
        }
      ], sources: ["student-packet", "assignment", "facilitator", "memo"]
    },
    {
      id: "update1", eyebrow: "Update 1", title: "Make your first response", scenarioTime: "Monday · 8:05 a.m.", duration: 900,
      description: "Work with the information you have now. Decide what the company should do and say first.",
      tasks: [
        "Take two minutes to read the update. Then talk it through and start writing on your memo handout.",
        "Draft the situation summary and holding statement. Decide who will speak for the company.",
        "Choose the group that most needs to hear from you and draft a message for them. Decide what to do now and what you still need to find out.",
        "In section 7, record your first decision and what led you to it."
      ],
      completion: {
        title: "Before the next update",
        description: "Check that you've written this work on your memo handout. Your answers can change as you learn more.",
        checks: [
          { id: "update1-statement", label: "Our first holding statement is in section 2." },
          { id: "update1-message", label: "We've drafted the situation summary and a message to our priority stakeholder." },
          { id: "update1-decision", label: "We've recorded our first decision and reasoning in section 7." }
        ]
      },
      artifacts: [
        {
          id: "initial-incident", type: "briefing", label: "Incident briefing", title: "Evacuation at The Halden", source: "Case update", time: "Information available at 8:05 a.m.", summary: "Residents have left the building as a precaution. A structural inspector is on the way.",
          body: `<p>At <strong>6:10 a.m.</strong>, a resident on the third floor heard a loud crack and found a new diagonal crack across a hallway wall and into the ceiling near the east stairwell. The overnight security contractor called 911.</p><p>At <strong>6:40 a.m.</strong>, the Cincinnati Fire Department ordered a precautionary evacuation. All 236 residents are out. <strong>Nobody is hurt.</strong></p><p>The city's Department of Buildings and Inspections has a structural inspector arriving at <strong>9:00 a.m.</strong> Nobody may re-enter, for belongings or any other reason, until the inspector permits it.</p><p>Marcus Reyes is on site. Kessler-Brandt Construction and Larkin &amp; Pell Structural Engineers have been called and have not called back. Dana Whitlock has been told by phone and is returning from Columbus.</p>`
        },
        {
          id: "resident-situation", type: "briefing", label: "Resident situation", title: "236 students are displaced", source: "Case update", time: "8:05 a.m.", summary: "Many residents left essentials behind and cannot go back in.",
          body: `<p>It is <strong>38 degrees and raining</strong>. Most residents are in the lobby and parking garage of the building next door, which Tallgrass does not own. Some have gone to friends' apartments.</p><p>Many left without coats, laptops, medications, or car keys. Nobody can return to collect belongings until the inspector permits it.</p><p>A resident's video of the crack, posted at 6:50 a.m., has 40,000 views. The residents' group chat has 190 members and is moving quickly. Final exams begin in three weeks.</p><p>Two parents have already called the leasing office, which opens at 9:00 a.m. The company has said <strong>nothing publicly</strong> so far.</p>`
        },
        {
          id: "reporter-email-0752", type: "email", label: "Reporter email", title: "Request for comment by 9:00 a.m.", source: "Priya Natarajan · Channel 7 News", time: "7:52 a.m.", summary: "The reporter wants a statement for the website and noon news, and invites someone to speak on camera.",
          body: `<dl><dt>From</dt><dd>Priya Natarajan, Channel 7 News</dd><dt>To</dt><dd>leasing@tallgrassstudentliving.com</dd><dt>Subject</dt><dd>Evacuation at The Halden: request for comment by 9:00 a.m.</dd></dl><blockquote><p>Good morning. We are reporting on this morning's evacuation of The Halden and will run the story on our website and at noon. Can you confirm what caused the evacuation, whether anyone was hurt, when residents will be allowed back in, and what the company is doing for the students who are outside right now? We would like a statement by 9:00 a.m. and would welcome someone on camera at 11:00. Thank you.</p></blockquote>`
        }
      ], sources: ["student-packet", "assignment", "facilitator"]
    },
    {
      id: "update2", eyebrow: "Update 2", title: "Review your response", scenarioTime: "Monday · 9:10 a.m.", duration: 900,
      description: "Consider what has changed since your first response. Decide what still stands and what needs to change.",
      tasks: [
        "Take two minutes to read the new information. Return to the earlier update whenever you need it.",
        "Look again at your situation summary and holding statement. What still holds up? What needs to change?",
        "Revisit who needs to hear from you, your message to that group, and your actions for the next 24 hours. Discuss the interview request.",
        "In the Update 2 row of section 7, record what you decided and what changed your thinking."
      ],
      completion: {
        title: "Before the next update",
        description: "Check these once you've discussed the new information and updated your memo handout where needed.",
        checks: [
          { id: "update2-response", label: "We've checked our statements, stakeholder message, and actions against the new information." },
          { id: "update2-decision", label: "The Update 2 row in section 7 records our decision and what shaped it." }
        ]
      },
      artifacts: [
        {
          id: "operational-update-0910", type: "briefing", label: "Situation update", title: "The building remains closed", source: "Case update", time: "9:10 a.m.", summary: "The inspector is inside. Residents may need somewhere else to stay tonight.",
          body: `<p>The inspector is in the building. <strong>Unofficially</strong>, the fire department has told Marcus Reyes that it will remain closed at least through tonight and that someone needs a plan for where 236 students sleep.</p><p>A post is claiming the building has been condemned and that two students are in the hospital. The information available to your team is that <strong>nobody has been hospitalized</strong> and the building has been <strong>evacuated, not condemned</strong>.</p><p>A screenshot from the residents' group chat is circulating on TikTok and X. It shows three maintenance requests about third-floor cracks, each closed within a day as cosmetic from Marcus Reyes's account. The three records are presented separately below.</p>`
        },
        {
          id: "request-4471", type: "record", label: "Maintenance request #4471", title: "Cracks by the east stairs", source: "Screenshot circulating from the residents' group chat", time: "Submitted Oct 28 · Closed Oct 29", summary: "Unit 312 reports new hallway cracks.",
          body: `<dl><dt>Request</dt><dd>#4471</dd><dt>Submitted</dt><dd>October 28 · Unit 312</dd></dl><blockquote><p>Cracks in the hallway wall on 3 by the east stairs, new since last week.</p></blockquote><p><strong>Closed October 29:</strong> Cosmetic. No action required. (M. Reyes)</p>`
        },
        {
          id: "request-4502", type: "record", label: "Maintenance request #4502", title: "A longer crack and a sticking door", source: "Screenshot circulating from the residents' group chat", time: "Submitted Nov 3 · Closed Nov 3", summary: "Unit 318 reports a change in the crack and trouble closing a door.",
          body: `<dl><dt>Request</dt><dd>#4502</dd><dt>Submitted</dt><dd>November 3 · Unit 318</dd></dl><blockquote><p>The crack is longer now and my door won't close unless I slam it.</p></blockquote><p><strong>Closed November 3:</strong> Cosmetic. No action required. (M. Reyes)</p>`
        },
        {
          id: "request-4539", type: "record", label: "Maintenance request #4539", title: "The crack reaches the ceiling", source: "Screenshot circulating from the residents' group chat", time: "Submitted Nov 10 · Closed Nov 11", summary: "Unit 312 asks for another look.",
          body: `<dl><dt>Request</dt><dd>#4539</dd><dt>Submitted</dt><dd>November 10 · Unit 312</dd></dl><blockquote><p>Third time. The crack goes into the ceiling now. Can someone please look at it.</p></blockquote><p><strong>Closed November 11:</strong> Cosmetic. No action required. (M. Reyes)</p>`
        },
        {
          id: "social-post-0841", type: "social", label: "Circulating social post", title: "A post gathers 12,000 shares", source: "Account circulating on X and TikTok", time: "Posted 8:41 a.m.", summary: "The account has 300 followers and no connection to the building that your team can find.",
          body: `<blockquote><p>The Halden on campus has been CONDEMNED and is collapsing. Two students hospitalized. Tallgrass Student Living knew. Share this.</p></blockquote><p><strong>Posted:</strong> 8:41 a.m. <strong>Shares:</strong> 12,000.</p><p>The account has 300 followers and no connection to the building that your team can find.</p><p>This card records what the post claims. Compare it with the situation update and the other available information.</p>`
        },
        {
          id: "parent-calls", type: "briefing", label: "Leasing office update", title: "44 calls from parents", source: "Case update", time: "Calls since 9:00 a.m.", summary: "Parents want to hear from the company and have questions about rent and leases.",
          body: `<p>The leasing office has received <strong>44 calls from parents since 9:00 a.m.</strong> A mother in Dayton has posted on Facebook that she is driving down to get her daughter and <q>nobody from the company will answer.</q></p><p>Several parents are asking about rent refunds and ending the lease. Refer to the lease provisions in the company resources; do not assume terms that the case has not supplied.</p>`
        },
        {
          id: "reporter-followup", type: "email", label: "Reporter follow-up", title: "Will someone go on camera?", source: "Priya Natarajan · Channel 7 News", time: "Received by 9:10 a.m.", summary: "The reporter now has the maintenance screenshots.",
          body: `<p>Priya Natarajan has written again:</p><blockquote><p>We have the maintenance ticket screenshots. Did Tallgrass Student Living ignore warnings about this wall for three weeks? Will someone go on camera at 11:00?</p></blockquote>`
        },
        {
          id: "contractor-callback", type: "briefing", label: "Callback", title: "The contractor responds", source: "Case update · Kessler-Brandt Construction", time: "Received by 9:10 a.m.", summary: "A brief response from the contractor; no response from the engineer yet.",
          body: `<p>Kessler-Brandt Construction has called back and said only that it <q>will be reviewing the matter with counsel.</q></p><p>Larkin &amp; Pell Structural Engineers has not called back.</p>`
        }
      ], sources: ["student-packet", "assignment", "facilitator"]
    },
    {
      id: "update3", eyebrow: "Update 3", title: "Prepare your final response", scenarioTime: "Monday · 11:30 a.m.", duration: 900,
      description: "Use the latest information to finish your response and explain the advice you would give the company.",
      tasks: [
        "Take two minutes to read the new information. Notice who is making each claim and how much is known.",
        "Write your advice to Dana Whitlock about her proposed statement. Then finish the company's public statement.",
        "Finish the situation summary, the message to your priority stakeholder, and three actions for the next 24 hours.",
        "Fill in the Update 3 row of section 7. Check all seven sections and get ready for your two-minute briefing."
      ],
      completion: {
        title: "Ready to share your response?",
        description: "Make sure your memo handout is complete before moving to the team briefings.",
        checks: [
          { id: "update3-memo", label: "We've finished the public statement, advice to the chief executive, and remaining memo sections." },
          { id: "update3-decision", label: "The Update 3 row records our latest decision and what changed our thinking." }
        ]
      },
      artifacts: [
        {
          id: "inspector-preliminary", type: "report", label: "Preliminary inspection finding", title: "A failed steel connection", source: "Inspector's preliminary finding, as reported in the case", time: "11:15 a.m.", summary: "The building is unsafe to occupy. Escorted visits to collect essential belongings will begin Wednesday.",
          body: `<p>The inspector has issued a <strong>preliminary finding</strong>: a failed steel connection at a transfer beam on the third floor.</p><p>The building is unsafe to occupy until temporary shoring is installed and a full structural review is complete, <q>a minimum of ten to fourteen days.</q></p><p>Residents will be permitted to retrieve essential belongings in <strong>escorted fifteen-minute windows starting Wednesday</strong>.</p>`
        },
        {
          id: "contractor-statement", type: "statement", label: "Contractor statement", title: "Kessler-Brandt Construction", source: "Statement issued to Channel 7 News", time: "11:05 a.m.", summary: "The contractor describes its work and the inspections.",
          body: `<blockquote><p>Kessler-Brandt Construction built The Halden to the engineer's drawings and passed every city inspection. We are confident in our work.</p></blockquote>`
        },
        {
          id: "engineer-statement", type: "statement", label: "Engineer statement", title: "Larkin & Pell Structural Engineers", source: "Statement issued to Channel 7 News", time: "11:20 a.m.", summary: "The engineer describes its design and an ongoing review.",
          body: `<blockquote><p>Our design was sound. We are reviewing whether construction matched the design.</p></blockquote>`
        },
        {
          id: "university-statement", type: "statement", label: "University statement", title: "University of Cincinnati", source: "Statement issued to Channel 7 News within the fictional scenario", time: "10:50 a.m.", summary: "The university explains its relationship to The Halden and the help it is offering students.",
          body: `<blockquote><p>The Halden is a privately owned and operated property and is not affiliated with the University. Student Affairs is assisting affected students with information about temporary housing.</p></blockquote>`
        },
        {
          id: "former-technician-account", type: "account", label: "On-camera account", title: "A former technician describes an earlier warning", source: "Tom Delgado, speaking to Priya Natarajan", time: "Reported by 11:30 a.m.", summary: "Delgado left Tallgrass in September and describes an incident in August.",
          body: `<p>Tom Delgado, a maintenance technician who left Tallgrass Student Living in September, has told Priya Natarajan on camera that he flagged <q>door frames out of square on 3</q> in August and was told it was <q>normal settling.</q></p>`
        },
        {
          id: "ceo-request", type: "internal", label: "Internal request", title: "Dana Whitlock wants a statement", source: "Chief executive's request, as reported in the case", time: "11:30 a.m.", summary: "The chief executive has arrived and wants your written advice.",
          body: `<p>Dana Whitlock has arrived. She wants to issue a statement <strong>within the hour</strong> saying that the contractor is at fault and that <q>we were as surprised as anyone.</q></p><p>She wants your recommendation in writing.</p>`
        },
        {
          id: "housing-and-warming", type: "briefing", label: "Assistance update", title: "A hotel offer and a daytime warming space", source: "Case update", time: "Available by 11:30 a.m.", summary: "120 rooms are offered for two weeks; the recreation center is open during the day.",
          body: `<p>A local hotel group has offered <strong>120 rooms at a reduced rate for two weeks</strong>. The case does not specify the nightly rate.</p><p>UC's Campus Recreation Center has opened as a <strong>daytime warming space</strong> for residents.</p><p>The company's existing spending authority and lease provisions remain available in the company resources.</p>`
        },
        {
          id: "resident-protest", type: "briefing", label: "Resident group chat", title: "A protest is being organized", source: "Case update · residents' group chat", time: "Planned for 5:00 p.m.", summary: "Residents are organizing outside the leasing office.",
          body: `<p>The resident group chat is organizing a protest outside the leasing office at <strong>5:00 p.m.</strong></p>`
        }
      ], sources: ["student-packet", "assignment", "facilitator"]
    },
    {
      id: "briefings", eyebrow: "Team briefings", title: "Share your response", scenarioTime: "End of the simulation", duration: 120,
      description: "Each team has two minutes. The spokesperson reads the public statement; the crisis lead explains one decision the team changed.",
      tasks: [
        "Review all seven sections of your memo handout. Keep it for the briefing and class discussion, then hand it to your instructor at the end of class.",
        "Spokesperson: read your final public statement.",
        "Crisis lead: explain one decision that changed and the information that changed it.",
        "Listen to how other teams set their priorities and explain their choices."
      ],
      completion: {
        title: "Before the debrief",
        description: "Check these after your team has finished its paper memo and given its briefing.",
        checks: [
          { id: "briefings-memo-ready", label: "Our paper memo is complete, including all seven sections." },
          { id: "briefings-presented", label: "We've read our public statement and explained one decision we changed." }
        ]
      },
      artifacts: [
        {
          id: "submission-check", type: "checklist", label: "Submission check", title: "One complete memo per team", source: "Assignment description and briefing memo template", time: "By the end of class", summary: "Check all seven sections and team details before handing your paper memo to the instructor.",
          body: `<ol><li>Situation summary: 3 to 4 sentences.</li><li>Holding statement: 3 to 4 sentences.</li><li>Public statement: 5 to 7 sentences.</li><li>Message to a priority stakeholder: 3 to 5 sentences; name the audience.</li><li>Immediate actions: three actions for the next 24 hours.</li><li>Advice to the chief executive: 2 to 3 sentences.</li><li>How our response changed: one line per update, recording the decision and what changed your thinking.</li></ol><p>Include your team name and each member's role. The final memo should reflect the situation at the end and retain the record of your changing decisions.</p><p>Give one completed paper memo per team directly to the instructor at the end of class.</p>`
        }
      ], sources: ["assignment", "facilitator", "memo"]
    },
    {
      id: "debrief", eyebrow: "After the briefings", title: "Look back at your decisions", scenarioTime: "Class discussion", duration: 600,
      description: "Talk through the decisions your team made. Use your statements and decision record to explain what you would keep or change.",
      tasks: [
        "Whose team messaged residents before responding to the reporter? What led you to that choice?",
        "When did your understanding of the company's responsibility change? Did your statement change with it?",
        "Which of Tallgrass's promises mattered in this situation? What did the case reveal about its identity?",
        "What was your team's first position? Did you move away from it? What led you to change your mind?",
        "What did you advise the chief executive about the contractor, and why?"
      ],
      completion: {
        title: "Before you finish",
        description: "Give your completed paper memo to the instructor before you leave. Take a photo first if you want a copy for your individual evaluation.",
        checks: [
          { id: "debrief-memo-handed-in", label: "One teammate has handed our completed paper memo to the instructor." },
          { id: "debrief-evaluation", label: "Each of us knows where to find the evaluation template and when to submit it." }
        ]
      },
      artifacts: [
        {
          id: "debrief-responsibility", type: "debrief", label: "Discuss after the simulation", title: "How responsibility changed", source: "Facilitator guide · design and debrief", time: "After the team briefings", summary: "Compare your interpretations at 8:05, 9:10, and 11:30.",
          body: `<h3>At 8:05 a.m.</h3><p>The cause is unknown. Residents need practical instructions, support, and clear information about what is known and what remains uncertain.</p><h3>At 9:10 a.m.</h3><p>The closed maintenance requests change how stakeholders may judge the company. Its response to warning signs also raises questions about the Resident Promise. Correcting a false social post does not resolve the substantiated concerns.</p><h3>At 11:30 a.m.</h3><p>The preliminary finding and the accounts from several organizations make responsibility contested and potentially shared. The company can act on its responsibilities to residents while the cause and allocation of blame remain under investigation.</p><p>Compare these changes with the decisions you actually recorded. Which evidence changed your response? Which evidence did you overlook or set aside?</p>`
        },
        {
          id: "individual-evaluation", type: "assignment", label: "Individual follow-up", title: "Post-Crisis Evaluation", source: "Assignment description and evaluation template", time: "Due Friday, November 20 · 11:59 p.m.", summary: "About two pages, written individually and submitted on Canvas.",
          body: `<p>Write your own evaluation of your team's response, about two pages, using the template on Canvas. Each member submits a separate evaluation.</p><ol><li><strong>Crisis diagnosis:</strong> explain your changing interpretation of the crisis and likely public responsibility attributions.</li><li><strong>Response strategy:</strong> explain the approach your team chose and how it changed.</li><li><strong>Stakeholder priorities:</strong> explain whom you put first and why.</li><li><strong>Challenges and constraints:</strong> examine the limits, uncertainties, and pressures that shaped your decisions.</li><li><strong>Reassessment:</strong> identify what you would change and one addition your team can make to its client's crisis communication one-sheet.</li></ol><p>Use course concepts in every section. Briefly define each concept, connect it to a specific decision, and give examples. Analysis matters more than a retelling of events.</p><p>The individual evaluation is worth <strong>20 points</strong>: diagnosis and strategy, use of concepts, reassessment, and clear, specific writing, 5 points each.</p>`
        }
      ], sources: ["facilitator", "assignment", "evaluation"]
    }
  ],
  sources: [
    { id: "student-packet", title: "COMM5009 CrisisInABox Student Packet.docx", notes: "Case facts and source artifacts from pages 1–2, 6, and 8. Older worksheets, role restrictions, and pacing are superseded by the newer assignment and facilitator guide." },
    { id: "assignment", title: "COMM5009 CrisisInABox Assignment Description.docx", notes: "Authoritative student tasks, roles, seven-section memo, two-minute team briefings, individual evaluation, and grading." },
    { id: "facilitator", title: "COMM5009 CrisisInABox Facilitator Guide(1).docx", notes: "Three fifteen-minute update periods, flexible classroom facilitation, role combinations, and debrief. Case-specific quantitative wording follows the original packet when the guide abbreviates it." },
    { id: "memo", title: "COMM5009 CrisisInABox Briefing Memo Template.docx", notes: "Seven sections and sentence-length guidance. No additional worksheet submissions are required." },
    { id: "evaluation", title: "COMM5009 CrisisInABox Post-Crisis Evaluation Template.docx", notes: "Five evaluation headings; approximately two pages; individual Canvas submission Friday, November 20, 2026 at 11:59 p.m." }
  ]
};
