'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchAnalytics from './MatchAnalytics';

interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
}

interface BowlerStats {
  name: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
}

interface MatchResultsProps {
  show: boolean;
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamAWickets: number;
  teamBScore: number;
  teamBWickets: number;
  winner: string;
  winType: string;
  manOfMatch: string;
  target: number;
  batsmenA: BatsmanStats[];
  batsmenB: BatsmanStats[];
  bowlersA: BowlerStats[];
  bowlersB: BowlerStats[];
  onNewMatch: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  inning1Timeline?: any[];
  inning2Timeline?: any[];
}

export default function MatchResults({
  show,
  teamAName,
  teamBName,
  teamAScore,
  teamAWickets,
  teamBScore,
  teamBWickets,
  winner,
  winType,
  manOfMatch,
  target,
  batsmenA,
  batsmenB,
  bowlersA,
  bowlersB,
  onNewMatch,
  isSaved = false,
  onSave,
  inning1Timeline = [],
  inning2Timeline = []
}: MatchResultsProps) {
  if (!show) return null;

  // Filter to only show batsmen who actually batted (faced balls)
  const battedA = batsmenA.filter(b => b.balls > 0 || b.runs > 0);
  const battedB = batsmenB.filter(b => b.balls > 0 || b.runs > 0);

  // Filter to only show bowlers who actually bowled (bowled at least 1 ball)
  const bowledA = bowlersA.filter(b => b.overs > 0 || b.balls > 0);
  const bowledB = bowlersB.filter(b => b.overs > 0 || b.balls > 0);

  // Calculate economy rate
  const getEconomy = (bowler: BowlerStats): string => {
    const totalBalls = bowler.overs * 6 + bowler.balls;
    if (totalBalls === 0) return '0.00';
    const economy = (bowler.runs / totalBalls) * 6;
    return economy.toFixed(2);
  };

  // Format overs display
  const formatOvers = (bowler: BowlerStats): string => {
    if (bowler.balls === 0) return `${bowler.overs}`;
    return `${bowler.overs}.${bowler.balls}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-5xl bg-card border-primary/20 my-8 shadow-2xl shadow-primary/10">
        <div className="p-8 space-y-8">
          {/* Trophy and Result Header */}
          <div className="text-center space-y-4 pb-6 border-b border-border">
            <div className="text-6xl mb-4">🏆</div>
            <div className="text-5xl font-black text-primary tracking-wide">MATCH RESULTS</div>
            <div className="text-xl text-secondary font-bold">{winner} WINS!</div>
          </div>

          {/* Final Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className={`p-6 rounded-xl border-2 text-center transition-all ${winner === teamAName
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
              : 'border-border bg-muted/20'
              }`}>
              <div className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">{teamAName}</div>
              <div className="text-5xl font-black text-foreground">{teamAScore}/{teamAWickets}</div>
              {winner === teamAName && (
                <div className="text-xs text-primary font-bold mt-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  WINNER
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-muted-foreground">VS</div>
              <div className="text-sm text-muted-foreground mt-2">Target: {target}</div>
            </div>

            <div className={`p-6 rounded-xl border-2 text-center transition-all ${winner === teamBName
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
              : 'border-border bg-muted/20'
              }`}>
              <div className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">{teamBName}</div>
              <div className="text-5xl font-black text-foreground">{teamBScore}/{teamBWickets}</div>
              {winner === teamBName && (
                <div className="text-xs text-primary font-bold mt-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  WINNER
                </div>
              )}
            </div>
          </div>

          {/* Win Description */}
          <div className="text-center p-4 bg-secondary/10 rounded-xl border border-secondary/30">
            <div className="text-lg font-bold text-secondary">{winType}</div>
          </div>

          {/* Man of the Match */}
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-xl border border-primary/30">
            <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Man of the Match</div>
            <div className="text-3xl font-black text-primary flex items-center justify-center gap-3">
              <span>⭐</span>
              {manOfMatch}
              <span>⭐</span>
            </div>
          </div>

          {/* Tabbed interface for Stats vs Analytics */}
          <Tabs defaultValue="scorecard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/20 border border-border mb-8">
              <TabsTrigger value="scorecard" className="font-black tracking-widest text-xs uppercase italic py-3">Detailed Scorecard</TabsTrigger>
              <TabsTrigger value="analytics" className="font-black tracking-widest text-xs uppercase italic py-3 text-secondary">Match Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="scorecard" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-8">
                {/* Batting Statistics */}
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <span>🏏</span> Batting Statistics
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Team A Batting */}
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-secondary mb-3 border-b border-border pb-2">
                        {teamAName} - Innings
                      </div>
                      {battedA.length > 0 ? (
                        <div className="space-y-2">
                          {battedA.map((batsman: BatsmanStats, idx: number) => (
                            <div
                              key={idx}
                              className={`flex justify-between items-center p-3 rounded-lg border text-sm transition-all ${batsman.isOut
                                  ? 'bg-destructive/5 border-destructive/20'
                                  : 'bg-primary/5 border-primary/20'
                                }`}
                            >
                              <div>
                                <div className="font-semibold text-foreground">{batsman.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {batsman.runs} ({batsman.balls}) • SR: {batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-secondary">{batsman.fours}×4s, {batsman.sixes}×6s</div>
                                <div className={`text-xs font-semibold ${batsman.isOut ? 'text-destructive' : 'text-primary'}`}>
                                  {batsman.isOut ? 'OUT' : 'NOT OUT'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground p-3">No batting data</div>
                      )}
                    </div>

                    {/* Team B Batting */}
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-secondary mb-3 border-b border-border pb-2">
                        {teamBName} - Innings
                      </div>
                      {battedB.length > 0 ? (
                        <div className="space-y-2">
                          {battedB.map((batsman: BatsmanStats, idx: number) => (
                            <div
                              key={idx}
                              className={`flex justify-between items-center p-3 rounded-lg border text-sm transition-all ${batsman.isOut
                                  ? 'bg-destructive/5 border-destructive/20'
                                  : 'bg-primary/5 border-primary/20'
                                }`}
                            >
                              <div>
                                <div className="font-semibold text-foreground">{batsman.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {batsman.runs} ({batsman.balls}) • SR: {batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-secondary">{batsman.fours}×4s, {batsman.sixes}×6s</div>
                                <div className={`text-xs font-semibold ${batsman.isOut ? 'text-destructive' : 'text-primary'}`}>
                                  {batsman.isOut ? 'OUT' : 'NOT OUT'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground p-3">No batting data</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bowling Statistics */}
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <span>🎯</span> Bowling Statistics
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-secondary mb-3 border-b border-border pb-2">
                        {teamAName} Bowlers
                      </div>
                      {bowledA.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-muted-foreground text-xs border-b border-border">
                                <th className="text-left py-2 px-2">Bowler</th>
                                <th className="text-center py-2 px-2">O</th>
                                <th className="text-center py-2 px-2">R</th>
                                <th className="text-center py-2 px-2">W</th>
                                <th className="text-center py-2 px-2">Econ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bowledA.map((bowler: BowlerStats, idx: number) => (
                                <tr key={idx} className="border-b border-border/50 hover:bg-muted/20">
                                  <td className="py-2 px-2 font-medium">{bowler.name}</td>
                                  <td className="text-center py-2 px-2">{formatOvers(bowler)}</td>
                                  <td className="text-center py-2 px-2">{bowler.runs}</td>
                                  <td className="text-center py-2 px-2 font-bold text-primary">{bowler.wickets}</td>
                                  <td className="text-center py-2 px-2 text-secondary">{getEconomy(bowler)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground p-3">No bowling data</div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-secondary mb-3 border-b border-border pb-2">
                        {teamBName} Bowlers
                      </div>
                      {bowledB.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-muted-foreground text-xs border-b border-border">
                                <th className="text-left py-2 px-2">Bowler</th>
                                <th className="text-center py-2 px-2">O</th>
                                <th className="text-center py-2 px-2">R</th>
                                <th className="text-center py-2 px-2">W</th>
                                <th className="text-center py-2 px-2">Econ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bowledB.map((bowler: BowlerStats, idx: number) => (
                                <tr key={idx} className="border-b border-border/50 hover:bg-muted/20">
                                  <td className="py-2 px-2 font-medium">{bowler.name}</td>
                                  <td className="text-center py-2 px-2">{formatOvers(bowler)}</td>
                                  <td className="text-center py-2 px-2">{bowler.runs}</td>
                                  <td className="text-center py-2 px-2 font-bold text-primary">{bowler.wickets}</td>
                                  <td className="text-center py-2 px-2 text-secondary">{getEconomy(bowler)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground p-3">No bowling data</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="animate-in fade-in slide-in-from-right-4">
              <MatchAnalytics
                inning1Timeline={inning1Timeline}
                inning2Timeline={inning2Timeline}
                teamAName={teamAName}
                teamBName={teamBName}
              />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-border">
            <Button
              onClick={onSave}
              disabled={isSaved}
              className={`flex-1 py-8 text-lg font-black transition-all duration-500 overflow-hidden relative group ${isSaved
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl shadow-secondary/20'
                }`}
            >
              <div className="flex items-center justify-center gap-3">
                {isSaved ? (
                  <>
                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>SAVED TO DATABASE</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>SAVE THIS MATCH</span>
                  </>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform origin-left transition-transform scale-x-0 group-hover:scale-x-100" />
            </Button>

            <Button
              onClick={onNewMatch}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-black text-lg py-8 shadow-xl shadow-primary/20 relative group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                START NEW MATCH
              </span>
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
