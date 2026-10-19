// Japanese UI messages (secondary locale).
import type { MessageSchema } from "./En";

const messages: MessageSchema = {
  app: {
    title: "ゲーム関連学会 CfP 2027",
    subtitle:
      "ゲームを主題とする、またはゲームを扱うトラックを持つ国内外の学術会議について、2027年開催回の論文募集 (CfP) をまとめています。",
    lastUpdated: "最終調査日: {date}",
    disclaimer:
      "日程は必ず公式サイトでご確認ください。「Unknown」は 2027 年の募集が未公開であることを示します。",
    source: "ソースコードとデータ (GitHub)",
    contribute: "誤りや掲載漏れはIssueまたはPull Requestでお知らせください。",
  },
  summary: {
    total: "掲載数",
    open: "募集中",
    unknown: "Unknown",
    closed: "締切済",
  },
  filter: {
    keyword: "検索",
    keywordPlaceholder: "名称・主催・開催地…",
    region: "地域",
    status: "CfP 状況",
    scope: "ゲームの扱い",
    field: "分野",
    sort: "並び順",
    reset: "フィルタをリセット",
    showing: "{total} 件中 {shown} 件を表示",
  },
  sort: {
    deadline: "次の締切",
    event: "開催日",
    name: "名称",
  },
  region: {
    domestic: "国内",
    international: "国際",
  },
  status: {
    open: "募集中",
    unknown: "Unknown",
    closed: "締切済",
  },
  scope: {
    whole: "学会全体",
    track: "ゲームトラック",
  },
  field: {
    hci: "HCI",
    ai: "人工知能",
    graphics: "CG・VR",
    engineering: "ゲーム工学・開発技術",
    "game-studies": "ゲーム研究 (人文学)",
    "social-science": "社会科学・心理学",
    education: "教育・学習",
    "serious-games": "シリアスゲーム",
    gamification: "ゲーミフィケーション",
    health: "医療・健康",
    narrative: "インタラクティブ・ナラティブ",
    "design-art": "デザイン・芸術",
    "music-audio": "音楽・サウンド",
    esports: "eスポーツ",
    "simulation-gaming": "シミュレーション&ゲーミング",
    analog: "アナログゲーム・遊び",
  },
  card: {
    event: "開催",
    location: "開催地",
    organizer: "主催",
    track: "ゲームトラック",
    deadlines: "締切",
    cfpUnknown: "Unknown — 2027年の募集は未公開です。",
    pastPattern: "前回の実績",
    website: "公式サイト",
    cfp: "募集要項",
    sources: "情報源",
    dateTbd: "未定",
    daysLeft: "本日締切 | 残り {n} 日 | 残り {n} 日",
    passed: "締切済",
    notes: "備考",
  },
  empty: "条件に一致する学会はありません。",
  language: "言語",
};

export default messages;
