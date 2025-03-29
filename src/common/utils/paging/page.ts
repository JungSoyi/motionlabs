export class Page<T> {
  total: number;
  page: number;
  count: number;
  data: T[];

  private constructor(total: number, page: number, data: T[]) {
    this.total = total;
    this.page = page;
    this.count = data?.length | 0;
    this.data = data;
  }

  static of<T>(total: number, page: number, data: T[]): Page<T> {
    return new Page(total, page, data);
  }
}
