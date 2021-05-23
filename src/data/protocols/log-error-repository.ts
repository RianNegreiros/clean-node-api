export interface LogErrorReposiory {
    log (stack: string): Promise<void>
}