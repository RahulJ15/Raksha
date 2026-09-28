# Raksha: B2B demo video brief

You are building a **2–2.5 minute B2B demo video** for **Raksha**, a hackathon project. The audience is people
who run buildings: facility managers, property-management companies, maintenance contractors, and the
hackathon judges. The video is a sequence of designed slides mixed with screen recordings of the real app.
Everything below is accurate as of 27 Sep 2026. **Do not add statistics, customer names or claims that are not
in this brief.**

---

## 1. Project overview

**One line:** Raksha listens to, feels and looks at a building's equipment and structure, warns you before
small problems become expensive ones, and tells a non-technical contractor exactly what is wrong and what to do.

**The problem**
- Leaks, worn motors, overheating panels and cracks are usually found **after** they fail, when the repair is
  largest. The average US home water-damage insurance claim is **$15,400** (Triple-I / ISO-Verisk, 2019–2023).
- Mold can start within **24–48 hours** once materials are wet (US EPA).
- Contractors and building staff are not engineers: sensor dashboards full of numbers and jargon do not help them act.

**What Raksha does**
1. **Monitors a building live:** 26 sensors across the roof, the plant room and the grounds (humidity, moisture,
   temperature, vibration, leak noise, pressure, strain, crack width), shown on a floor-plan map.
2. **Tells you what needs a decision:** a home screen with the count of things that need attention, urgency,
   who is assigned, and overdue tickets with automatic escalation (text, then call for critical issues).
3. **Diagnoses with AI from any sensor file:** a single **Scan** box. Drop in a sound recording (as a
   spectrogram), vibration data, a thermal photo, a photo of concrete or a raw machine sensor capture. Raksha
   works out what kind of file it is, runs the right model, and says what is wrong.
4. **Requires two sensors to agree before sending anyone:** results from different sensor types on the same
   machine are combined. Two types agree = **raise a ticket**. Only one sees it = **check on the next visit**.
   This is how Raksha keeps false alarms, and wasted contractor visits, down.
5. **Explains it in plain English:** every result says what it means, what you would notice, usual causes, what
   to check first, how urgent it is and which trade to call, plus an AI-written explanation.
6. **Shows why fixing now is cheaper,** with real cited figures (see section 4).
7. **Walks you to the problem:** turn-by-turn walking directions on the floor plan to the sensor.

**Who it is for:** property managers, facility teams and the contractors they send.

---

## 2. How it works (for one "under the hood" slide)

- **Specialist AI models, one per sensor type:**
  - **Sound:** pipe leaks and machine faults, from 1-second recordings
  - **Sound + vibration together:** motors, fans, pumps (bearing fault, imbalance, misalignment)
  - **Vibration spectrograms:** bearing damage type
  - **Thermal camera:** motor overheating (winding short circuit, cooling-fan failure, stuck rotor)
  - **Concrete photos:** cracks, checked tile by tile across a whole wall
- **Automatic file-type detection** sends each upload to the right model and rejects anything that isn't a
  sensor file.
- **Agreement rule** across sensor types (see above), including live sensors already on the machine.
- **Trained only on real, public research data** from universities in Brazil, Canada, China, Iran and Turkey
  (section 5). The building dashboard in the demo uses simulated readings.

---

## 3. Brand and visual style

- **Name:** Raksha
- **Colours** (the app's "Turtle" theme):
  - background `#E5EFC1`, card `#F5F9E6`, soft fill `#D6EACB`, lines `#CADDB2`
  - text `#15302F`, secondary text `#3E5E66`
  - accent / teal `#39AEA9`, mint `#A2D5AB`
  - status: good `#25774F`, watch `#9C6508`, critical `#BF3F33`
- **Fonts:** headings **Fraunces** (serif; italic for emphasis, e.g. "things need *your call*"); body and
  numbers **Manrope**. Both on Google Fonts.
- **Look:** calm, rounded cards (radius 20–30 px), soft shadows, generous whitespace, simple line icons.
  No stock-photo clutter, no neon, no "AI brain" clichés.
- **Confidence** is shown as **High / Medium / Low**, never as a percentage.
- **Tone of voice:** plain, confident, honest. Short sentences. Say "check it on the next visit", not "anomaly
  detected in subsystem".

---

## 4. Numbers you may use (all real, all cited)

**Costs of waiting on a leak** (US national averages)
- Fix a pipe leak: **$500** on average (range $150–$4,700). *Angi, updated Nov 2025*
- Water-damaged drywall: **$550** on average. *Angi 2026 data*
- Water-damage restoration: **$3,868** on average (2026, from 1,500 verified projects). *Angi*
- Mold remediation: **$2,368** on average. *Angi, Jul 2026*
- Average water-damage insurance claim: **$15,400**. *Triple-I, ISO/Verisk data 2019–2023*
- Mold can start within **24–48 hours** of wetting. *US EPA*
- A tap dripping once a second wastes over **3,000 gallons a year**. *US EPA WaterSense*
- Headline you may use: **"Fix now: ~$500. Wait: up to $15,400."**

**Machines**
- Replacing a worn fan / blower motor: **$560** on average. *Angi*
- Replacing an AC compressor: **$1,200** on average ($800–$2,300). *Angi, May 2025*
- Don't imply a failing fan motor *causes* compressor failure; no cited source says so. Show them as typical bills.
- Planned maintenance saves **12–18%** versus waiting for breakdowns, and sensor-predicted maintenance saves a
  further **8–12%**. *US DOE FEMP guide, via PNNL*

**How a bearing wears out** (real run-to-failure data)
- NASA / University of Cincinnati IMS test 2: a bearing run nonstop for 6.8 days until its outer race failed.
  Vibration stayed at its normal level (~0.077 g) for about 5 days, first rose clearly (staying at least 2×
  normal) at hour 117, then climbed to 6–9× normal before failure at hour 163.5: **about 2 days** between the
  first rise and the break (1.9 days). In the app this reads "Once it starts shaking more, a worn bearing can break in about 2 days".
  The "2× normal" threshold is our rule, applied to the real recordings. *NASA Prognostics Data Repository*

**How accurate Raksha is** (tested on data the models never trained on)
- Sound + vibration model, on a **machine setup it never saw**: **94%** (190 of 202 recordings)
- Sound model, real pipe and motor clips: **88%** (581 of 659)
- Bearing vibration model, on **bearings it never saw**: **79%** (3,813 of 4,800)
- Microphone alone at motor speeds it never heard: **65%**. This is *why* Raksha combines sensors.
- False alarms: a single microphone flagged healthy machines about **1 in 4** times on an unfamiliar setup;
  combining it with vibration brought that to **0 of 12** healthy recordings (a small test).

**Do NOT claim**
- Any field accuracy, "false alarms per week" or customer results. There has been no building pilot yet.
- That Raksha detects electrical fires or arcing, or measures leak drip rate. It doesn't.
- 100% accuracy (some lab tests hit 100%, but those are single lab rigs; don't show them as headline numbers).
- Any costs outside the US figures above.

---

## 5. Data sources (for the end card)

- MaFaulDa machinery fault database: Federal University of Rio de Janeiro, Brazil
- UORED-VAFCLS bearing dataset: University of Ottawa, Canada (Sehri & Dumond), CC BY 4.0
- Water-network leak acoustics: leak test base, Dongguan, China (Zenodo 18631450), CC BY 4.0
- Thermal motor images: Babol Noshirvani University of Technology, Iran (Najafi et al., 2020), CC BY 4.0
- Concrete crack images: Middle East Technical University, Turkey (Özgenel), CC BY 4.0
- Bearing run-to-failure test: NASA Prognostics Data Repository, IMS Center, University of Cincinnati (Qiu, Lee & Lin, 2006)
- Cost and maintenance figures: Angi cost guides, Triple-I (ISO/Verisk), US EPA, US DOE FEMP via PNNL

---

## 6. Storyboard (about 2 min 20 s)

Aspect ratio 16:9, 1920×1080. "SLIDE" = designed slide in the brand style. "SCREEN" = screen recording of
the live app (desktop browser, 1440×900 window). VO = voiceover.

| # | Time | Type | What's on screen | On-screen text | Voiceover |
|---|---|---|---|---|---|
| 1 | 0:00–0:08 | SLIDE | Raksha wordmark on the pale green background; a soft teal pulse ring behind it | **Raksha** · *Your building, listening.* | "Every building is quietly telling you what's about to break." |
| 2 | 0:08–0:22 | SLIDE | Three problem tiles: a drip, a hot motor, a crack. Below them a big number | **$15,400**: the average water-damage insurance claim (Triple-I, 2019–2023) | "Most problems are found after they fail. By then a leak is in the walls, and the average water-damage claim is fifteen thousand four hundred dollars." |
| 3 | 0:22–0:32 | SLIDE | Cluttered sensor graph fading into a clean card that reads "Water is getting into roof vent 6 · Fix now · Roofer" | **Data isn't the problem. Knowing what to do is.** | "And the people fixing it aren't engineers. They need to know what's wrong, how urgent it is and who to call." |
| 4 | 0:32–0:48 | SCREEN | Dashboard: "13 things need your call", the building-health gauge, problem cards | *(callouts)* To-do count · Building health · Most urgent first | "Raksha watches the whole site and turns it into decisions: what needs your call, how urgent, who's on it." |
| 5 | 0:48–1:00 | SCREEN | Map: floor plan with coloured sensor dots; pick Roof vent 5, press Walk there; the route appears and the directions step through on the right | **Walk straight to it** | "Every sensor is on the floor plan, with walking directions to the problem." |
| 6 | 1:00–1:22 | SCREEN | Scan → Try a pair → "Two sensors agree". Show "Detected: sound + vibration capture" and "Detected: thermal image", then the red **Confirmed problem: raise a ticket** card | **One box. Any sensor. Auto-detected.** | "Drop in any sensor file: sound, vibration, a thermal photo, a picture of a crack. Raksha works out what it is and runs the right AI. Here, sound and vibration say bearing fault and the thermal camera sees overheating. Two independent sensors agree, so it raises a ticket." |
| 7 | 1:22–1:34 | SCREEN | Scan → "Only one sensor sees it" → amber **Check on the next visit** | **One sensor? Check it. Two agree? Send someone.** | "If only one sensor sees it, Raksha doesn't send anyone out. It schedules a check. Fewer false alarms, fewer wasted visits." |
| 8 | 1:34–1:52 | SCREEN | Microphone folder → Pipe leak. Scroll: big result, what-to-do chips, then the **What waiting can cost** ladder ($500 → $4,918 → $7,286 → $15,400) with source tags. Hover one source tag. | **Fix now: ~$500 · Wait: up to $15,400** · *US averages, cited* | "Every result is in plain English, with what to check and which trade to call, and it shows what waiting costs, using real published repair prices." |
| 8b | +0:10 (optional) | SCREEN | Sound + vibration folder → Bearing fault → scroll to **What happens if you wait**: flat line for 5 days, "starts wearing", climb to "breaks" | **Once it starts shaking more, it can break in about 2 days** · *NASA test* | "This is a real bearing, run nonstop until it broke. It shook normally for five days, then more and more, then broke. Raksha spots that early rise, so you can plan the repair." |
| 9 | 1:52–2:04 | SLIDE | Three accuracy bars: 94%, 88%, 79%, each with its "tested on…" label; a small line under the 65% microphone figure | **Tested on data it never saw** | "We test only on data the models never trained on: 94% on a machine setup they'd never seen. And because one microphone alone gets 65%, Raksha always combines sensors." |
| 10 | 2:04–2:14 | SLIDE | Two tiles: 12–18% and +8–12%; a flow "Breakdown → Planned → Predicted" | **Catching it early costs less** · US DOE | "The US Department of Energy puts planned maintenance at twelve to eighteen percent cheaper than waiting for breakdowns, and prediction saves more on top." |
| 11 | 2:14–2:22 | SLIDE (end card) | Raksha wordmark, "Built on real research data from" plus the five universities, the project link | **Raksha** · *Fix it before it breaks.* | "Raksha. Fix it before it breaks." |

**Pacing:** cut on actions (a click, a card appearing). Keep each on-screen text to about 8 words. Use the app's
own motion (cards rising, rings pulsing); no heavy transitions.

**Music:** light, warm, mid-tempo, no vocals; duck under the voiceover.

---

## 7. How to capture the screen recordings

- App: the Vercel deployment (demo mode), or run it locally (`web/README.md`). Repo:
  https://github.com/RahulJ15/Raksha
- Browser window **1440×900**, zoom 100%, light theme.
- Add `?start=overview` to the URL to skip the welcome screens. Add `?tour=1` to show the walkthrough.
- **Scene 4:** open the Site tab and wait for the "13" count to animate.
- **Scene 5:** Map → Roof → click "Roof vent 5" in the list → **Walk there**.
- **Scenes 6–7:** Scan → **Try a pair** → "Two sensors agree", then "Only one sensor sees it".
- **Scene 8:** Scan → folder **Microphone** → **Pipe leak** → scroll slowly to the cost ladder; hover a source tag.
- Hide the mouse between actions, or use a smooth cursor highlight.

---

## 8. Checklist before export

- [ ] Every number on screen appears in section 4, with its source available on request
- [ ] "US national averages" is shown wherever dollar figures appear
- [ ] No claim of field results, customers, fire detection or leak-rate measurement
- [ ] The simulated building data is never presented as a real building
- [ ] The product name is **Raksha** everywhere
