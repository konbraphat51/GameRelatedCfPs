// English UI messages (primary locale).
const messages = {
  app: {
    title: "Game-Related CfPs 2027",
    subtitle:
      "Calls for papers of 2027 academic conferences that are about games, or have a dedicated game track — in Japan and worldwide.",
    lastUpdated: "Data last researched: {date}",
    disclaimer:
      'Always confirm dates on the official website. "Unknown" means the 2027 call has not been published yet.',
    source: "Source code & data on GitHub",
    contribute: "Found a mistake or a missing conference? Open an issue or pull request.",
  },
  summary: {
    total: "Conferences",
    open: "Open calls",
    unknown: "Unknown",
    closed: "Closed",
  },
  filter: {
    keyword: "Search",
    keywordPlaceholder: "Name, organizer, location…",
    region: "Region",
    status: "CfP status",
    scope: "Game focus",
    field: "Fields",
    sort: "Sort by",
    reset: "Reset filters",
    showing: "Showing {shown} of {total}",
  },
  sort: {
    deadline: "Next deadline",
    event: "Event date",
    name: "Name",
  },
  region: {
    domestic: "Japan",
    international: "International",
  },
  status: {
    open: "Open",
    unknown: "Unknown",
    closed: "Closed",
  },
  scope: {
    whole: "Whole conference",
    track: "Game track",
  },
  field: {
    hci: "HCI",
    ai: "AI",
    graphics: "Graphics & VR",
    engineering: "Game engineering",
    "game-studies": "Game studies (humanities)",
    "social-science": "Social sciences & psychology",
    education: "Education & learning",
    "serious-games": "Serious games",
    gamification: "Gamification",
    health: "Health & medicine",
    narrative: "Interactive narrative",
    "design-art": "Design & art",
    "music-audio": "Music & audio",
    esports: "Esports",
    "simulation-gaming": "Simulation & gaming",
    analog: "Analog games & play",
  },
  card: {
    event: "Event",
    location: "Location",
    organizer: "Organizer",
    track: "Game track",
    deadlines: "Deadlines",
    cfpUnknown: "Unknown — the 2027 call has not been published yet.",
    pastPattern: "Previous edition",
    website: "Website",
    cfp: "Call for papers",
    sources: "Sources",
    dateTbd: "TBA",
    daysLeft: "today | {n} day left | {n} days left",
    passed: "passed",
    notes: "Notes",
  },
  empty: "No conferences match the current filters.",
  language: "Language",
};

export default messages;

/** Shape every locale must implement. */
export type MessageSchema = typeof messages;
