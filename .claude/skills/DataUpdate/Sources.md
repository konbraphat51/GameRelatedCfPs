# Discovery sources

Fixed entry points for finding game-related venues that are not yet listed. Work through them in order and stop a branch once it only returns known or excluded items.

## Listing pages (WebFetch)

| Source                              | URL                                                        |
| ----------------------------------- | ---------------------------------------------------------- |
| WikiCFP "games"                     | http://www.wikicfp.com/cfp/call?conference=games           |
| WikiCFP "serious games"             | http://www.wikicfp.com/cfp/call?conference=serious%20games |
| WikiCFP "gamification"              | http://www.wikicfp.com/cfp/call?conference=gamification    |
| DiGRA news                          | https://digra.org/                                         |
| 日本デジタルゲーム学会              | https://digrajapan.org/                                    |
| 情報処理学会 GI 研究会              | https://www.gi-ipsj.org/                                   |
| 日本シミュレーション&ゲーミング学会 | https://www.jasag.org/                                     |
| ゲーム学会                          | https://www.gameamusementsociety.org/                      |
| SIGCHI conference list              | https://sigchi.org/conferences/                            |
| SBGames                             | https://www.sbgames.org/                                   |
| UPenn CFP list (search "game")      | https://call-for-papers.sas.upenn.edu/                     |
| Frontiers research topics           | https://www.frontiersin.org/research-topics?search=game    |

## Searches (WebSearch)

Publisher sites (MDPI, Taylor & Francis, Springer, Elsevier, SAGE, Wiley) block direct fetching; use search instead.

1. `"call for papers" 2027 games conference`
2. `"special issue" games OR gaming OR "game-based" "call for papers" 2027` (repeat with `site:mdpi.com`, `site:tandfonline.com`, `site:springer.com`, `site:sciencedirect.com`, `site:journals.sagepub.com`)
3. `"game studies" "call for papers" 2027`
4. `ゲーム 研究会 発表募集 2027` / `ゲーム 特集号 論文募集 2027`
5. `gamification OR "serious games" OR esports conference 2027 "call for papers"`
