export class Paginator<T> {
  private items: T[];
  private page: number;
  private limit: number;

  constructor(items: T[], page = 1, limit = 10) {
    this.items = items;
    this.page = Math.max(page, 1);
    this.limit = Math.max(limit, 1);
  }

  get total(): number {
    return this.items.length;
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  get data(): T[] {
    const start = (this.page - 1) * this.limit;
    return this.items.slice(start, start + this.limit);
  }

  toJSON() {
    return {
      total: this.total,
      page: this.page,
      limit: this.limit,
      totalPages: this.totalPages,
      data: this.data,
    };
  }
}
