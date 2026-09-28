// Every real-world figure the scan infographics show, with its source. The graphics render ONLY from this
// file; nothing is estimated in the app. All figures re-checked on the source pages on 2026-09-27.
// Angi blocks automated access, so its entries also link the Internet Archive copy that was checked.
// Market: US national averages, USD.

const CHECKED = '27 Sep 2026';

export const SOURCES = {
  angiPipe: {
    short: 'Angi cost guide · Nov 2025',
    publisher: 'Angi', title: 'How Much Do Pipe Leak Repairs Cost?', updated: 'Nov 25, 2025',
    url: 'https://www.angi.com/articles/cost-to-repair-leaking-pipe.htm',
    archive: 'https://web.archive.org/web/20251201140036/https://www.angi.com/articles/cost-to-repair-leaking-pipe.htm',
  },
  angiEmergency: {
    short: 'Angi cost guide · Jul 2026',
    publisher: 'Angi', title: 'How Much Does an Emergency Plumber Cost?', updated: 'Jul 9, 2026',
    url: 'https://www.angi.com/articles/emergency-plumber-cost.htm',
    archive: 'https://web.archive.org/web/20260818021509/https://www.angi.com/articles/emergency-plumber-cost.htm',
  },
  angiWater: {
    short: 'Angi 2026 data · 1,500 projects',
    publisher: 'Angi', title: 'How Much Does Water Damage Restoration Cost? [2026 Data]', updated: 'Sep 11, 2026',
    url: 'https://www.angi.com/articles/how-much-does-it-cost-repair-water-damage.htm',
    archive: 'https://web.archive.org/web/20260917025521/https://www.angi.com/articles/how-much-does-it-cost-repair-water-damage.htm',
  },
  angiMold: {
    short: 'Angi cost guide · Jul 2026',
    publisher: 'Angi', title: 'How Much Does Mold Remediation Cost?', updated: 'Jul 9, 2026',
    url: 'https://www.angi.com/articles/how-much-does-mold-remediation-service-cost.htm',
    archive: 'https://web.archive.org/web/20260816063026/https://www.angi.com/articles/how-much-does-mold-remediation-service-cost.htm',
  },
  angiBlower: {
    short: 'Angi cost guide · Apr 2025',
    publisher: 'Angi', title: 'How Much Does a Blower Motor Replacement Cost?', updated: 'Apr 29, 2025',
    url: 'https://www.angi.com/articles/furnace-blower-motor-cost.htm',
    archive: 'https://web.archive.org/web/20251023045409/https://www.angi.com/articles/furnace-blower-motor-cost.htm',
  },
  angiCompressor: {
    short: 'Angi cost guide · May 2025',
    publisher: 'Angi', title: 'How Much Does an AC Compressor Cost?', updated: 'May 20, 2025',
    url: 'https://www.angi.com/articles/ac-compressor-cost.htm',
    archive: 'https://web.archive.org/web/20251002155359/https://www.angi.com/articles/ac-compressor-cost.htm',
  },
  tripleI: {
    short: 'Triple-I · ISO/Verisk claims 2019–23',
    publisher: 'Insurance Information Institute (Triple-I), data from ISO/Verisk', title: 'Facts + Statistics: Homeowners and renters insurance',
    updated: 'Average homeowners losses, 2019–2023',
    url: 'https://www.iii.org/fact-statistic/facts-statistics-homeowners-and-renters-insurance',
  },
  epaMold: {
    short: 'US EPA',
    publisher: 'US EPA', title: 'A Brief Guide to Mold, Moisture and Your Home',
    url: 'https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home',
  },
  epaLeaks: {
    short: 'US EPA WaterSense',
    publisher: 'US EPA WaterSense', title: 'Fix a Leak Week',
    url: 'https://www.epa.gov/watersense/fix-leak-week',
  },
  pnnlOM: {
    short: 'US DOE / PNNL',
    publisher: 'Pacific Northwest National Laboratory, citing the US DOE FEMP O&M Best Practices Guide',
    title: 'O&M Best Practices: Maintenance Approaches',
    url: 'https://www.pnnl.gov/projects/om-best-practices/maintenance-approaches',
  },
};

export const FIGURES = {
  pipeRepair: { avg: 500, lo: 150, hi: 4700, src: 'angiPipe', quote: 'Pipe leak repairs cost $150 to $4,700, with an average cost of $500.' },
  emergency: { lo: 1.5, hi: 3, src: 'angiEmergency', quote: 'Emergency plumbers cost anywhere from 1.5 to 3 times as much.' },
  drywall: { avg: 550, lo: 300, hi: 850, src: 'angiWater', quote: 'Fixing water-damaged drywall typically costs $300 to $850, with the average coming in at $550.' },
  restoration: { avg: 3868, lo: 450, hi: 16000, src: 'angiWater', quote: 'In 2026, the national average cost for water damage restoration is $3,868 … ranges from $450 to $16,000.' },
  mold: { avg: 2368, lo: 1223, hi: 3757, src: 'angiMold', quote: 'Mold remediation costs an average of $2,368 and typically ranges from $1,223 to $3,757.' },
  claim: { avg: 15400, src: 'tripleI', quote: 'Water damage and freezing: claim severity $15,400 (average homeowners losses, 2019–2023).' },
  moldWindow: { src: 'epaMold', quote: 'It is important to dry water-damaged areas and items within 24-48 hours to prevent mold growth.' },
  leakWaste: { household: 9300, faucet: 3000, src: 'epaLeaks',
    quote: "The average household's leaks can account for more than 9,300 gallons of water wasted every year. A leaky faucet that drips at the rate of one drip per second can waste more than 3,000 gallons per year." },
  blowerMotor: { avg: 560, src: 'angiBlower', quote: 'The average blower motor replacement cost is $560.' },
  compressor: { avg: 1200, lo: 800, hi: 2300, src: 'angiCompressor', quote: 'The average cost for an AC compressor is $1,200, but you might pay between $800 and $2,300.' },
  preventive: { lo: 12, hi: 18, src: 'pnnlOM', quote: 'Preventive maintenance savings (vs reactive) can amount to as much as 12% to 18% on average.' },
  predictive: { lo: 8, hi: 12, src: 'pnnlOM', quote: 'A properly functioning predictive maintenance program can provide a savings of 8% to 12% over a program that utilizes preventive maintenance alone.' },
};

export const CHECKED_ON = CHECKED;
export const usd = (n) => `$${n.toLocaleString('en-US')}`;
