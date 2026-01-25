'use client';

interface ScoreboardProps {
  match: any;
  currentTeam: string;
  currentTeamLogo: string;
}

export default function Scoreboard({ match, currentTeam, currentTeamLogo }: ScoreboardProps) {
  const overs = Math.floor(match.balls / 6);
  const ballsInCurrentOver = match.balls % 6;
  const remainingBalls = match.totalOvers * 6 - match.balls;
  const remainingOvers = Math.floor(remainingBalls / 6);
  const remainingBallsInOver = remainingBalls % 6;
  const crr = match.balls > 0 ? (match.runs / match.balls * 6).toFixed(2) : '0.00';
  const rrr = match.chasingMode && match.balls > 0 ? ((match.target - match.runs) / remainingBalls * 6).toFixed(2) : '0.00';

  return (
    <div className="bg-card rounded-lg p-8 border border-primary/20 shadow-lg">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Team Info */}
        <div className="flex items-center justify-center gap-4">
          {currentTeamLogo && (
            <img src={currentTeamLogo || "/placeholder.svg"} alt={currentTeam} className="w-24 h-24 rounded-lg border-2 border-primary" />
          )}
          <div>
            <p className="text-sm text-muted-foreground">Batting</p>
            <p className="text-2xl font-bold text-primary">{currentTeam}</p>
          </div>
        </div>

        {/* Score Section */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl font-bold text-secondary">{match.runs}</p>
            <p className="text-lg text-primary">/{match.wickets}</p>
            <p className="text-sm text-muted-foreground mt-2">{overs}.{ballsInCurrentOver}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded p-3 border border-border">
            <p className="text-xs text-muted-foreground">Overs</p>
            <p className="text-xl font-bold text-primary">{overs}.{ballsInCurrentOver}</p>
          </div>
          <div className="bg-background rounded p-3 border border-border">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-xl font-bold text-accent">{remainingOvers}.{remainingBallsInOver}</p>
          </div>
          <div className="bg-background rounded p-3 border border-border">
            <p className="text-xs text-muted-foreground">CRR</p>
            <p className="text-xl font-bold text-primary">{crr}</p>
          </div>
          {match.chasingMode && (
            <div className="bg-background rounded p-3 border border-border">
              <p className="text-xs text-muted-foreground">RRR</p>
              <p className="text-xl font-bold text-secondary">{rrr}</p>
            </div>
          )}
        </div>
      </div>

      {/* Match Status Bar */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Target: {match.chasingMode ? match.target : 'N/A'} | Match Type: {match.totalOvers} Overs
          </p>
          <p className={`text-sm font-semibold ${match.isMatchEnded ? 'text-destructive' : 'text-primary'}`}>
            {match.isMatchEnded ? '✓ MATCH ENDED' : '🟢 LIVE'}
          </p>
        </div>
      </div>
    </div>
  );
}
