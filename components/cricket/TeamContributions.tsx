'use client';

interface Batsman {
  id: number;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isStriker: boolean;
  isOut: boolean;
}

interface Bowler {
  id: number;
  name: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
}

interface TeamContributionsProps {
  match: {
    currentTeam: 'A' | 'B';
    teamA: { name: string };
    teamB: { name: string };
    allBatsmenA: Batsman[];
    allBatsmenB: Batsman[];
    allBowlersA: Bowler[];
    allBowlersB: Bowler[];
    runs: number;
    wickets: number;
    currentBatsmenIndices: number[];
  };
}

export default function TeamContributions({ match }: TeamContributionsProps) {
  const getBattingTeamStats = () => {
    if (match.currentTeam === 'A') {
      return {
        teamName: match.teamA.name,
        batsmen: match.allBatsmenA || [],
        totalRuns: match.runs,
        totalWickets: match.wickets
      };
    } else {
      return {
        teamName: match.teamB.name,
        batsmen: match.allBatsmenB || [],
        totalRuns: match.runs,
        totalWickets: match.wickets
      };
    }
  };

  const getBowlingTeamStats = () => {
    if (match.currentTeam === 'A') {
      return {
        teamName: match.teamB.name,
        bowlers: (match.allBowlersB || []).filter(b => b.overs > 0 || b.balls > 0)
      };
    } else {
      return {
        teamName: match.teamA.name,
        bowlers: (match.allBowlersA || []).filter(b => b.overs > 0 || b.balls > 0)
      };
    }
  };

  const battingStats = getBattingTeamStats();
  const bowlingStats = getBowlingTeamStats();

  // Only show batsmen who have batted (faced at least 1 ball or are currently batting)
  const activeBatsmen = battingStats.batsmen.filter((b, idx) => 
    b.balls > 0 || match.currentBatsmenIndices.includes(idx)
  );

  return (
    <div className="space-y-6">
      {/* Batting Contributions */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Batting - {battingStats.teamName}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-primary">Batsman</th>
                <th className="text-center py-3 px-4 text-primary">R</th>
                <th className="text-center py-3 px-4 text-primary">B</th>
                <th className="text-center py-3 px-4 text-primary">4s</th>
                <th className="text-center py-3 px-4 text-primary">6s</th>
                <th className="text-center py-3 px-4 text-primary">SR</th>
              </tr>
            </thead>
            <tbody>
              {activeBatsmen.length > 0 ? (
                activeBatsmen.map((batsman) => {
                  const sr = batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={batsman.id} className="border-b border-border/50 hover:bg-background/50">
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${batsman.isOut ? 'text-destructive line-through' : ''}`}>
                          {batsman.name}
                        </span>
                        {batsman.isStriker && !batsman.isOut && <span className="ml-2 text-primary">*</span>}
                        {batsman.isOut && <span className="ml-2 text-destructive text-xs">(out)</span>}
                      </td>
                      <td className="text-center py-3 px-4 font-bold text-primary">{batsman.runs}</td>
                      <td className="text-center py-3 px-4">{batsman.balls}</td>
                      <td className="text-center py-3 px-4 text-primary">{batsman.fours}</td>
                      <td className="text-center py-3 px-4 text-secondary">{batsman.sixes}</td>
                      <td className="text-center py-3 px-4 text-accent">{sr}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted-foreground">
                    No batting data yet
                  </td>
                </tr>
              )}
              {activeBatsmen.length > 0 && (
                <tr className="bg-background/50 border-t-2 border-primary">
                  <td className="py-3 px-4 font-bold text-primary">Total</td>
                  <td className="text-center py-3 px-4 font-bold text-primary text-lg">{battingStats.totalRuns}</td>
                  <td className="text-center py-3 px-4 font-bold">{activeBatsmen.reduce((sum, b) => sum + b.balls, 0)}</td>
                  <td className="text-center py-3 px-4 font-bold">{activeBatsmen.reduce((sum, b) => sum + b.fours, 0)}</td>
                  <td className="text-center py-3 px-4 font-bold">{activeBatsmen.reduce((sum, b) => sum + b.sixes, 0)}</td>
                  <td className="text-center py-3 px-4 font-bold text-accent">
                    {activeBatsmen.reduce((sum, b) => sum + b.balls, 0) > 0
                      ? ((battingStats.totalRuns / activeBatsmen.reduce((sum, b) => sum + b.balls, 0)) * 100).toFixed(1)
                      : '0.0'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bowling Contributions */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Bowling - {bowlingStats.teamName}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-primary">Bowler</th>
                <th className="text-center py-3 px-4 text-primary">O</th>
                <th className="text-center py-3 px-4 text-primary">R</th>
                <th className="text-center py-3 px-4 text-primary">W</th>
                <th className="text-center py-3 px-4 text-primary">Econ</th>
              </tr>
            </thead>
            <tbody>
              {bowlingStats.bowlers.length > 0 ? (
                bowlingStats.bowlers.map((bowler) => {
                  const totalBalls = bowler.overs * 6 + bowler.balls;
                  const economy = totalBalls > 0 ? ((bowler.runs / totalBalls) * 6).toFixed(2) : '0.00';
                  return (
                    <tr key={bowler.id} className="border-b border-border/50 hover:bg-background/50">
                      <td className="py-3 px-4 font-semibold">{bowler.name}</td>
                      <td className="text-center py-3 px-4 font-bold text-primary">
                        {bowler.overs}.{bowler.balls}
                      </td>
                      <td className="text-center py-3 px-4 text-secondary font-bold">{bowler.runs}</td>
                      <td className="text-center py-3 px-4 text-destructive font-bold">{bowler.wickets}</td>
                      <td className="text-center py-3 px-4 text-accent font-bold">{economy}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted-foreground">
                    No bowling data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
