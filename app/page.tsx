'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/cricket/Header';
import Scoreboard from '@/components/cricket/Scoreboard';
import BatsmenSection from '@/components/cricket/BatsmenSection';
import BowlerSection from '@/components/cricket/BowlerSection';
import ControlPanel from '@/components/cricket/ControlPanel';
import TeamContributions from '@/components/cricket/TeamContributions';
import PlayerManagement from '@/components/cricket/PlayerManagement';
import CrackerAnimation from '@/components/cricket/CrackerAnimation';
import DuckOutAnimation from '@/components/cricket/DuckOutAnimation';
import BowlerSelectionModal from '@/components/cricket/BowlerSelectionModal';
import MatchResults from '@/components/cricket/MatchResults';
import WicketAnimation from '@/components/cricket/WicketAnimation';
import BoundaryAnimation from '@/components/cricket/BoundaryAnimation';
import { Button } from '@/components/ui/button';

interface Player {
  id: number;
  name: string;
  role: string;
}

interface Team {
  name: string;
  players: Player[];
}

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

interface InningData {
  teamName: string;
  score: number;
  wickets: number;
  balls: number;
  batsmen: Batsman[];
  bowlers: Bowler[];
  target?: number;
}

interface MatchState {
  matchStarted: boolean;
  currentInning: number;
  teamA: Team;
  teamB: Team;
  inning1: InningData | null;
  inning2: InningData | null;
  currentTeam: 'A' | 'B';
  runs: number;
  wickets: number;
  balls: number;
  currentBatsmenIndices: number[];
  allBatsmenA: Batsman[];
  allBatsmenB: Batsman[];
  allBowlersA: Bowler[];
  allBowlersB: Bowler[];
  currentBowlerIndex: number;
  target: number;
  isMatchEnded: boolean;
  currentDate: string;
  currentTime: string;
  totalOvers: number;
  showBowlerSelection: boolean;
  showPlayerManagement: boolean;
  crackerTrigger: boolean;
  boundaryType: 'four' | 'six' | null;
  duckOutPlayer: string | null;
  wicketAnimation: boolean;
  winner: string | null;
  manOfMatch: string | null;
}

export default function Home() {
  const defaultTeamA: Team = {
    name: 'Team A',
    players: [
      { id: 1, name: 'Virat Kohli', role: 'Batsman' },
      { id: 2, name: 'Rohit Sharma', role: 'Batsman' },
      { id: 3, name: 'Shubman Gill', role: 'Batsman' },
      { id: 4, name: 'Suryakumar Yadav', role: 'All-rounder' },
      { id: 5, name: 'Hardik Pandya', role: 'All-rounder' },
      { id: 6, name: 'Rishabh Pant', role: 'Batsman' },
      { id: 7, name: 'Axar Patel', role: 'All-rounder' },
      { id: 8, name: 'Jasprit Bumrah', role: 'Bowler' },
      { id: 9, name: 'Mohammed Siraj', role: 'Bowler' },
      { id: 10, name: 'Yuzvendra Chahal', role: 'Bowler' },
      { id: 11, name: 'Kuldeep Yadav', role: 'Bowler' }
    ]
  };

  const defaultTeamB: Team = {
    name: 'Team B',
    players: [
      { id: 12, name: 'Kane Williamson', role: 'Batsman' },
      { id: 13, name: 'Babar Azam', role: 'Batsman' },
      { id: 14, name: 'Steve Smith', role: 'Batsman' },
      { id: 15, name: 'Ben Stokes', role: 'All-rounder' },
      { id: 16, name: 'Pat Cummins', role: 'All-rounder' },
      { id: 17, name: 'Jonny Bairstow', role: 'Batsman' },
      { id: 18, name: 'Keshav Maharaj', role: 'All-rounder' },
      { id: 19, name: 'Jofra Archer', role: 'Bowler' },
      { id: 20, name: 'Mark Wood', role: 'Bowler' },
      { id: 21, name: 'Reece Topley', role: 'Bowler' },
      { id: 22, name: 'Tom Hartley', role: 'Bowler' }
    ]
  };

  const [match, setMatch] = useState<MatchState>({
    matchStarted: false,
    currentInning: 1,
    teamA: defaultTeamA,
    teamB: defaultTeamB,
    inning1: null,
    inning2: null,
    currentTeam: 'A',
    runs: 0,
    wickets: 0,
    balls: 0,
    currentBatsmenIndices: [0, 1],
    allBatsmenA: [],
    allBatsmenB: [],
    allBowlersA: [],
    allBowlersB: [],
    currentBowlerIndex: 0,
    target: 0,
    isMatchEnded: false,
    currentDate: '',
    currentTime: '',
    totalOvers: 2,
    showBowlerSelection: false,
    showPlayerManagement: true,
    crackerTrigger: false,
    boundaryType: null,
    duckOutPlayer: null,
    wicketAnimation: false,
    winner: null,
    manOfMatch: null
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setMatch(prev => ({
        ...prev,
        currentDate: now.toLocaleDateString(),
        currentTime: now.toLocaleTimeString()
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartMatch = (teamA: Team, teamB: Team) => {
    // Initialize all batsmen for both teams
    const allBatsmenA = teamA.players.map((p, idx) => ({
      id: p.id,
      name: p.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isStriker: idx === 0,
      isOut: false
    }));

    const allBatsmenB = teamB.players.map((p, idx) => ({
      id: p.id,
      name: p.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isStriker: idx === 0,
      isOut: false
    }));

    // Initialize all bowlers (players who can bowl)
    const bowlersFromA = teamA.players
      .filter(p => p.role === 'Bowler' || p.role === 'All-rounder')
      .map(p => ({
        id: p.id,
        name: p.name,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0
      }));

    const bowlersFromB = teamB.players
      .filter(p => p.role === 'Bowler' || p.role === 'All-rounder')
      .map(p => ({
        id: p.id,
        name: p.name,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0
      }));

    setMatch(prev => ({
      ...prev,
      matchStarted: true,
      showPlayerManagement: false,
      teamA,
      teamB,
      currentTeam: 'A',
      allBatsmenA,
      allBatsmenB,
      allBowlersA: bowlersFromA,
      allBowlersB: bowlersFromB,
      currentBatsmenIndices: [0, 1],
      currentBowlerIndex: 0,
      currentInning: 1,
      runs: 0,
      wickets: 0,
      balls: 0
    }));
  };

  const getCurrentBatsmen = (): Batsman[] => {
    const allBatsmen = match.currentTeam === 'A' ? match.allBatsmenA : match.allBatsmenB;
    return match.currentBatsmenIndices.map(idx => allBatsmen[idx]).filter(Boolean);
  };

  const getCurrentBowler = (): Bowler | null => {
    const bowlers = match.currentTeam === 'A' ? match.allBowlersB : match.allBowlersA;
    return bowlers[match.currentBowlerIndex] || null;
  };

  const handleScoreUpdate = (runsByBall: number, isExtra: boolean = false, isBoundary: boolean = false) => {
    if (match.isMatchEnded || !match.matchStarted) return;

    setMatch(prev => {
      const newMatch = { ...prev };
      const allBatsmen = newMatch.currentTeam === 'A' ? [...newMatch.allBatsmenA] : [...newMatch.allBatsmenB];
      const bowlers = newMatch.currentTeam === 'A' ? [...newMatch.allBowlersB] : [...newMatch.allBowlersA];
      
      const strikerIdx = newMatch.currentBatsmenIndices.find(idx => allBatsmen[idx]?.isStriker);
      const nonStrikerIdx = newMatch.currentBatsmenIndices.find(idx => !allBatsmen[idx]?.isStriker);
      
      if (strikerIdx === undefined) return prev;

      const striker = allBatsmen[strikerIdx];
      const nonStriker = nonStrikerIdx !== undefined ? allBatsmen[nonStrikerIdx] : null;
      const currentBowler = bowlers[newMatch.currentBowlerIndex];

      if (!currentBowler) return prev;

      // For extras (wide/no ball): add run to team, bowler concedes, NO legal ball counted
      if (isExtra) {
        newMatch.runs += 1; // 1 run for wide/no ball
        currentBowler.runs += 1;
        // Ball is NOT legal - batsman doesn't face it, bowler must bowl again
        // No ball count update, no batsman ball count update
      } else {
        // Legal delivery
        striker.runs += runsByBall;
        striker.balls += 1;
        
        if (isBoundary) {
          if (runsByBall === 4) {
            striker.fours += 1;
            newMatch.boundaryType = 'four';
          } else if (runsByBall === 6) {
            striker.sixes += 1;
            newMatch.boundaryType = 'six';
          }
          newMatch.crackerTrigger = true;
        }

        newMatch.runs += runsByBall;
        currentBowler.runs += runsByBall;
        currentBowler.balls += 1;
        newMatch.balls += 1;

        // Change strike on odd runs
        if (runsByBall % 2 === 1 && nonStriker) {
          striker.isStriker = false;
          nonStriker.isStriker = true;
        }

        // Check if over completed (6 legal balls)
        if (currentBowler.balls === 6) {
          currentBowler.overs += 1;
          currentBowler.balls = 0;
          
          // Change strike at end of over
          if (nonStriker) {
            striker.isStriker = false;
            nonStriker.isStriker = true;
          }
          
          // Show bowler selection for next over
          newMatch.showBowlerSelection = true;
        }
      }

      // Update batsmen arrays
      if (newMatch.currentTeam === 'A') {
        newMatch.allBatsmenA = allBatsmen;
        newMatch.allBowlersB = bowlers;
      } else {
        newMatch.allBatsmenB = allBatsmen;
        newMatch.allBowlersA = bowlers;
      }

      // Check end of innings conditions
      const totalBallsInMatch = newMatch.totalOvers * 6;

      if (newMatch.currentInning === 1 && newMatch.balls >= totalBallsInMatch) {
        // First inning ended
        newMatch.inning1 = {
          teamName: newMatch.teamA.name,
          score: newMatch.runs,
          wickets: newMatch.wickets,
          balls: newMatch.balls,
          batsmen: [...newMatch.allBatsmenA],
          bowlers: newMatch.allBowlersB.filter(b => b.overs > 0 || b.balls > 0)
        };

        newMatch.target = newMatch.runs + 1;
        newMatch.currentInning = 2;
        newMatch.currentTeam = 'B';
        newMatch.runs = 0;
        newMatch.wickets = 0;
        newMatch.balls = 0;
        newMatch.currentBatsmenIndices = [0, 1];
        newMatch.currentBowlerIndex = 0;
        newMatch.showBowlerSelection = true;
        
        // Reset second inning batsmen
        newMatch.allBatsmenB = newMatch.allBatsmenB.map((b, idx) => ({
          ...b,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isStriker: idx === 0,
          isOut: false
        }));
        
        // Reset Team A bowlers for second innings
        newMatch.allBowlersA = newMatch.allBowlersA.map(b => ({
          ...b,
          overs: 0,
          balls: 0,
          runs: 0,
          wickets: 0
        }));
      } else if (newMatch.currentInning === 2) {
        // Check if target reached or overs complete
        if (newMatch.runs >= newMatch.target || newMatch.balls >= totalBallsInMatch) {
          newMatch.isMatchEnded = true;
          newMatch.inning2 = {
            teamName: newMatch.teamB.name,
            score: newMatch.runs,
            wickets: newMatch.wickets,
            balls: newMatch.balls,
            batsmen: [...newMatch.allBatsmenB],
            bowlers: newMatch.allBowlersA.filter(b => b.overs > 0 || b.balls > 0)
          };

          if (newMatch.runs >= newMatch.target) {
            newMatch.winner = newMatch.teamB.name;
          } else {
            newMatch.winner = newMatch.teamA.name;
          }
          newMatch.manOfMatch = calculateManOfMatch(newMatch);
        }
      }

      return newMatch;
    });
  };

  const calculateManOfMatch = (matchData: MatchState): string => {
    let maxContribution = -1;
    let topPlayer = '';

    // Check all batsmen contributions
    [...matchData.allBatsmenA, ...matchData.allBatsmenB].forEach(batsman => {
      const contribution = batsman.runs + (batsman.fours * 2) + (batsman.sixes * 4);
      if (contribution > maxContribution) {
        maxContribution = contribution;
        topPlayer = batsman.name;
      }
    });

    // Check bowlers contributions (wickets are valuable)
    [...matchData.allBowlersA, ...matchData.allBowlersB].forEach(bowler => {
      const contribution = (bowler.wickets * 25) - bowler.runs;
      if (contribution > maxContribution) {
        maxContribution = contribution;
        topPlayer = bowler.name;
      }
    });

    return topPlayer;
  };

  const handleWicket = () => {
    if (match.isMatchEnded || !match.matchStarted) return;
    if (match.wickets >= 10) return;

    setMatch(prev => {
      const newMatch = { ...prev };
      const allBatsmen = newMatch.currentTeam === 'A' ? [...newMatch.allBatsmenA] : [...newMatch.allBatsmenB];
      const bowlers = newMatch.currentTeam === 'A' ? [...newMatch.allBowlersB] : [...newMatch.allBowlersA];
      
      const strikerIdx = newMatch.currentBatsmenIndices.find(idx => allBatsmen[idx]?.isStriker);
      
      if (strikerIdx === undefined) return prev;

      const striker = allBatsmen[strikerIdx];
      const currentBowler = bowlers[newMatch.currentBowlerIndex];

      // Check for duck (0 runs)
      if (striker.runs === 0) {
        newMatch.duckOutPlayer = striker.name;
      }

      // Mark batsman as out
      striker.isOut = true;
      striker.isStriker = false;
      newMatch.wickets += 1;
      newMatch.wicketAnimation = true;
      
      if (currentBowler) {
        currentBowler.wickets += 1;
      }

      // Count the ball
      if (currentBowler) {
        currentBowler.balls += 1;
        newMatch.balls += 1;
        striker.balls += 1;

        // Check if over completed
        if (currentBowler.balls === 6) {
          currentBowler.overs += 1;
          currentBowler.balls = 0;
          newMatch.showBowlerSelection = true;
        }
      }

      // Find next batsman who hasn't batted yet
      const nextBatsmanIdx = allBatsmen.findIndex((b, idx) => 
        !b.isOut && !newMatch.currentBatsmenIndices.includes(idx)
      );

      if (nextBatsmanIdx !== -1) {
        // Bring in new batsman as striker
        allBatsmen[nextBatsmanIdx].isStriker = true;
        
        // Replace the out batsman in indices
        const outIdxPosition = newMatch.currentBatsmenIndices.indexOf(strikerIdx);
        newMatch.currentBatsmenIndices[outIdxPosition] = nextBatsmanIdx;
      }

      // Update arrays
      if (newMatch.currentTeam === 'A') {
        newMatch.allBatsmenA = allBatsmen;
        newMatch.allBowlersB = bowlers;
      } else {
        newMatch.allBatsmenB = allBatsmen;
        newMatch.allBowlersA = bowlers;
      }

      // Check if all out (10 wickets)
      if (newMatch.wickets >= 10) {
        if (newMatch.currentInning === 1) {
          newMatch.inning1 = {
            teamName: newMatch.teamA.name,
            score: newMatch.runs,
            wickets: newMatch.wickets,
            balls: newMatch.balls,
            batsmen: [...newMatch.allBatsmenA],
            bowlers: newMatch.allBowlersB.filter(b => b.overs > 0 || b.balls > 0)
          };
          
          newMatch.target = newMatch.runs + 1;
          newMatch.currentInning = 2;
          newMatch.currentTeam = 'B';
          newMatch.runs = 0;
          newMatch.wickets = 0;
          newMatch.balls = 0;
          newMatch.currentBatsmenIndices = [0, 1];
          newMatch.currentBowlerIndex = 0;
          newMatch.showBowlerSelection = true;
          
          newMatch.allBatsmenB = newMatch.allBatsmenB.map((b, idx) => ({
            ...b,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            isStriker: idx === 0,
            isOut: false
          }));
          
          newMatch.allBowlersA = newMatch.allBowlersA.map(b => ({
            ...b,
            overs: 0,
            balls: 0,
            runs: 0,
            wickets: 0
          }));
        } else {
          newMatch.isMatchEnded = true;
          newMatch.inning2 = {
            teamName: newMatch.teamB.name,
            score: newMatch.runs,
            wickets: newMatch.wickets,
            balls: newMatch.balls,
            batsmen: [...newMatch.allBatsmenB],
            bowlers: newMatch.allBowlersA.filter(b => b.overs > 0 || b.balls > 0)
          };
          newMatch.winner = newMatch.teamA.name;
          newMatch.manOfMatch = calculateManOfMatch(newMatch);
        }
      }

      return newMatch;
    });
  };

  const handleBowlerSelect = (bowler: Player) => {
    setMatch(prev => {
      const bowlers = prev.currentTeam === 'A' ? prev.allBowlersB : prev.allBowlersA;
      
      // Find existing bowler or create new entry
      let bowlerIdx = bowlers.findIndex(b => b.id === bowler.id);
      
      if (bowlerIdx === -1) {
        // Add new bowler to the list
        const newBowler: Bowler = {
          id: bowler.id,
          name: bowler.name,
          overs: 0,
          balls: 0,
          runs: 0,
          wickets: 0
        };
        
        if (prev.currentTeam === 'A') {
          return {
            ...prev,
            allBowlersB: [...prev.allBowlersB, newBowler],
            currentBowlerIndex: prev.allBowlersB.length,
            showBowlerSelection: false
          };
        } else {
          return {
            ...prev,
            allBowlersA: [...prev.allBowlersA, newBowler],
            currentBowlerIndex: prev.allBowlersA.length,
            showBowlerSelection: false
          };
        }
      }

      return {
        ...prev,
        currentBowlerIndex: bowlerIdx,
        showBowlerSelection: false
      };
    });
  };

  const handleNewMatch = () => {
    setMatch(prev => ({
      ...prev,
      matchStarted: false,
      currentInning: 1,
      runs: 0,
      wickets: 0,
      balls: 0,
      inning1: null,
      inning2: null,
      isMatchEnded: false,
      showPlayerManagement: true,
      winner: null,
      manOfMatch: null,
      showBowlerSelection: false,
      crackerTrigger: false,
      boundaryType: null,
      duckOutPlayer: null,
      wicketAnimation: false,
      currentBatsmenIndices: [0, 1],
      currentBowlerIndex: 0
    }));
  };

  const handleChangeStrike = () => {
    setMatch(prev => {
      const allBatsmen = prev.currentTeam === 'A' ? [...prev.allBatsmenA] : [...prev.allBatsmenB];
      
      prev.currentBatsmenIndices.forEach(idx => {
        if (allBatsmen[idx]) {
          allBatsmen[idx].isStriker = !allBatsmen[idx].isStriker;
        }
      });

      if (prev.currentTeam === 'A') {
        return { ...prev, allBatsmenA: allBatsmen };
      } else {
        return { ...prev, allBatsmenB: allBatsmen };
      }
    });
  };

  if (!match.matchStarted) {
    return (
      <main className="min-h-screen bg-background text-foreground py-6 px-4">
        {match.showPlayerManagement && (
          <PlayerManagement
            teamA={match.teamA}
            teamB={match.teamB}
            onStart={handleStartMatch}
          />
        )}
      </main>
    );
  }

  const currentBatsmen = getCurrentBatsmen();
  const currentBowler = getCurrentBowler();

  return (
    <main className="min-h-screen bg-background text-foreground py-6 px-4">
      {/* Cracker Animation for boundaries */}
      <CrackerAnimation
        trigger={match.crackerTrigger}
        onComplete={() => setMatch(prev => ({ ...prev, crackerTrigger: false }))}
      />
      
      {/* Boundary Animation */}
      <BoundaryAnimation
        type={match.boundaryType}
        onComplete={() => setMatch(prev => ({ ...prev, boundaryType: null }))}
      />
      
      {/* Duck Out Animation */}
      <DuckOutAnimation
        playerName={match.duckOutPlayer || ''}
        show={!!match.duckOutPlayer}
        onComplete={() => setMatch(prev => ({ ...prev, duckOutPlayer: null }))}
      />
      
      {/* Wicket Animation */}
      <WicketAnimation
        show={match.wicketAnimation}
        onComplete={() => setMatch(prev => ({ ...prev, wicketAnimation: false }))}
      />

      {/* Match Results */}
      {match.isMatchEnded && match.inning1 && match.inning2 && (
        <MatchResults
          show={true}
          teamAName={match.teamA.name}
          teamBName={match.teamB.name}
          teamAScore={match.inning1.score}
          teamAWickets={match.inning1.wickets}
          teamBScore={match.inning2.score}
          teamBWickets={match.inning2.wickets}
          winner={match.winner || ''}
          winType={
            match.winner === match.teamA.name 
              ? `${match.teamA.name} won by ${match.inning1.score - match.inning2.score} runs`
              : `${match.teamB.name} won by ${10 - match.inning2.wickets} wickets`
          }
          manOfMatch={match.manOfMatch || ''}
          target={match.target}
          batsmenA={match.inning1.batsmen}
          batsmenB={match.inning2.batsmen}
          bowlersA={match.inning1.bowlers}
          bowlersB={match.inning2.bowlers}
          onNewMatch={handleNewMatch}
        />
      )}

      {/* Bowler Selection Modal */}
      <BowlerSelectionModal
        show={match.showBowlerSelection}
        team={match.currentTeam === 'A' ? match.teamB.name : match.teamA.name}
        bowlers={match.currentTeam === 'A' ? match.teamB.players : match.teamA.players}
        currentBowler={currentBowler}
        onSelect={handleBowlerSelect}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-muted-foreground">
            Inning {match.currentInning} | {match.currentDate} {match.currentTime}
          </div>
          <div className="text-lg font-bold text-primary">
            {match.currentTeam === 'A' ? match.teamA.name : match.teamB.name} Batting
          </div>
          {match.currentInning === 2 && (
            <div className="text-sm font-semibold text-secondary">
              Target: {match.target} runs
            </div>
          )}
        </div>

        {/* Scoreboard */}
        <Scoreboard
          match={{
            ...match,
            teamAName: match.teamA.name,
            teamBName: match.teamB.name,
            teamALogo: '',
            teamBLogo: '',
            tossWinner: match.teamA.name,
            decision: 'Batting',
            matchType: 'T20',
            chasingMode: match.currentInning === 2
          }}
          currentTeam={match.currentTeam === 'A' ? match.teamA.name : match.teamB.name}
          currentTeamLogo=""
        />

        {/* Batsmen and Bowler Sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          <BatsmenSection
            batsmen={currentBatsmen}
            onBatsmanNameChange={() => {}}
          />

          {currentBowler && (
            <BowlerSection
              bowler={currentBowler}
              onBowlerNameChange={() => {}}
            />
          )}
        </div>

        {/* Control Panel */}
        <ControlPanel
          onScoreUpdate={handleScoreUpdate}
          onWicket={handleWicket}
          onChangeStrike={handleChangeStrike}
          onNewOver={() => setMatch(prev => ({ ...prev, showBowlerSelection: true }))}
          onResetMatch={handleNewMatch}
          isMatchEnded={match.isMatchEnded}
        />

        {/* Team Contributions */}
        <TeamContributions match={{
          ...match,
          teamAName: match.teamA.name,
          teamBName: match.teamB.name,
          teamALogo: '',
          teamBLogo: '',
          tossWinner: match.teamA.name,
          decision: 'Batting',
          matchType: 'T20'
        }} />
      </div>
    </main>
  );
}
