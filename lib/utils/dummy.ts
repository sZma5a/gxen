export interface IDummy { }

export class Dummy implements IDummy {
  public static string(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  public static int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static float(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}