export interface Hasher {
    encrypt: (plaintext: string) => Promise<string>
  }