export default class ReportName {
  constructor(public readonly value: string) {}

  toFileName(): string {
    return `${this.value}.json`;
  }
}

