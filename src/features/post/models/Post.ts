export class PostModel {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly shortDescription: string,
    readonly content: string,
    readonly blogId: string,
    readonly blogName: string,
    readonly createdAt: Date
  ) {}
}
