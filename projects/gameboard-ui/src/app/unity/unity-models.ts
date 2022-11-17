export interface UnityContext {
    gameId: string;
    teamId: string;
}

export interface UnityDeployContext extends UnityContext {
    sessionExpirationTime: Date;
    playerId: string;
}

export interface UnityActiveGame extends GamebrainActiveGame {
    gameId: string;
    playerId: string;
    teamId: string;
    sessionExpirationTime: Date;
}

export interface GamebrainActiveGame {
    gamespaceId: string;
    headlessUrl: string;
    vms: UnityGameVM[];
    totalPoints: number;
}

export interface UnityGameVM {
    Id: string;
    Url: string;
    Name: string;
}

export interface NewUnityChallenge {
    gameId: string,
    playerId: string,
    teamId: string,
    maxPoints: number,
    gamespaceId: string,
    vms: UnityGameVM[];
}