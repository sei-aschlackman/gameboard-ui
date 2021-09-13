// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { PlayerRole, TimeWindow } from "./player-models";

export interface Challenge {
  id: string;
  specId: string;
  name: string;
  tag: string;
  startTime: Date;
  endTime: Date;
  lastScoreTime: Date;
  lastSyncTime: Date;
  hasGamespaceDeployed: boolean;
  points: number;
  score: number;
  duration: number;
  result: ChallengeResult;
  state: GameState;
}
export interface ChallengeSummary {
  id: string;
  name: string;
  gameId: string;
  gameName: string;
  playerName: string;
  playerId: string;
  tag: string;
  startTime: Date;
  endTime: Date;
  lastScoreTime: Date;
  lastSyncTime: Date;
  hasGamespaceDeployed: boolean;
  points: number;
  score: number;
  duration: number;
  result: ChallengeResult;
}

export interface NewChallenge {
  specId: string;
  playerId: string;
  variant: number;
}

export interface ChangedChallenge {
  id: string;
}

export interface ChallengeResult {

}

export interface BoardGame {
  id: string;
  name: string;
  key: string;
  competition: string;
  track: string;
  season: string;
  division: string;
  mode: string;
  sponsor: string;
  background: string;
  logo: string;
  allowPreview: boolean;
  allowTeam: boolean;
  specs: BoardSpec[];
  mapUrl: string;
  cardUrl: string;
  modeUrl: string;
  cardText1: string;
  cardText2: string;
  cardText3: string;
}

export interface BoardSpec {
  id: string;
  tag: string;
  name: string;
  description: string;
  disabled: boolean;
  averageDeploySeconds: number;
  points: number;
  x: number;
  y: number;
  r: number;
  c: string;
  instance: Challenge | undefined;
}

export interface BoardPlayer {
  id: string;
  teamId: string;
  userId: string;
  gameId: string;
  approvedName: string;
  name: string;
  sponsor: string;
  role: PlayerRole;
  sessionBegin: Date;
  sessionEnd: Date;
  sessionMinutes: number;
  rank: number;
  score: number;
  time: number;
  correctCount: number;
  partialCount: number;
  isManager: boolean;

  session: TimeWindow;
  game: BoardGame;
  challenges: Challenge[];
}

export interface GameState {
  id: string;
  name: string;
  audience: string;
  managerId: string;
  managerName: string;
  markdown?: string;
  launchpointUrl?: string;
  whenCreated: string;
  startTime: string;
  endTime: string;
  expirationTime: string;
  isActive: boolean;
  // players: Player[];
  vms: VmState[];
  challenge: ChallengeView;
}

export interface ChallengeView {
  text: string;
  maxPoints: number;
  maxAttempts: number;
  attempts: number;
  score: number;
  sectionText: string;
  sectionCount: number;
  sectionIndex: number;
  sectionScore: number;
  questions: QuestionView[];
}

export interface QuestionView {
  text: string;
  hint: string;
  answer: string;
  example: string;
  weight: number;
  penalty: number;
  isCorrect: boolean;
  isGraded: boolean;
}

export interface SectionSubmission {
  id: string;
  sectionIndex: number;
  questions: AnswerSubmission[];
}

export interface AnswerSubmission {
  answer: string;
}

export interface VmState {
  id: string;
  name: string;
  isolationId: string;
  isRunning: boolean;
}

export interface VmOptions {
  iso?: string[];
  net?: string[];
}

export interface VmConsole {
  id: string;
  isolationId: string;
  name: string;
  isRunning: boolean;
  url: string;
}

export interface ConsoleActor {
  userId: string;
  userName: string;
  playerName: string;
  challengeName: string;
  challengeId: string;
  gameId: string;
  vmName: string;
  timestamp: Date;
}
