export class BlogModel {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly websiteUrl: string,
    readonly createdAt: Date,
    readonly isMembership: boolean
  ) {}
}
