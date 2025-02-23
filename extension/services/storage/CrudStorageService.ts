import { StorageItemKey, Unwatch, WatchCallback } from '@wxt-dev/storage';

type WithId = { id: number };
type WithoutId<T> = Omit<T, 'id'>;

export default class CrudStorageService<T extends WithId> {
  constructor(private key: StorageItemKey, private fallback: T[]) {}

  public async getAll(): Promise<T[]> {
    return storage.getItem<T[]>(this.key, {
      fallback: this.fallback,
    });
  }

  private async setAll(items: T[]) {
    await storage.setItem<T[]>(this.key, items);
  }

  public async add(newItem: WithoutId<T>): Promise<T> {
    const allItems = await this.getAll();

    // prevent duplicate ids when deleting and adding prompts
    const newId = Math.max(0, ...allItems.map(p => p.id)) + 1;

    const itemWithId: T = {
      ...newItem,
      id: newId,
    } as T;

    await this.setAll(allItems.concat(itemWithId));

    return itemWithId;
  }

  public async get(id: number): Promise<T | undefined> {
    const allItems = await this.getAll();
    return allItems.find(item => item.id === id);
  }

  public async edit(id: number, props: Partial<WithoutId<T>>): Promise<T> {
    const allItems = await this.getAll();

    const item = allItems.find(item => item.id === id);
    if (!item)
      throw new Error(`CrudStorageService edit: item with id ${id} not found`);

    for (const [propName, value] of Object.entries(props)) {
      item[propName as keyof T] = value as T[keyof T];
    }

    await this.setAll(allItems);
    return item;
  }

  public async delete(id: number): Promise<T> {
    const allItems = await this.getAll();

    const itemToDelete = allItems.find(item => item.id === id);
    if (!itemToDelete)
      throw new Error(
        `CrudStorageService delete: item with id ${id} not found`
      );

    await this.setAll(allItems.filter(item => item.id !== id));
    return itemToDelete;
  }

  public watch(cb: WatchCallback<T[] | null>): Unwatch {
    return storage.watch(this.key, cb);
  }

  public getKey() {
    return this.key;
  }

  public setKey(key: StorageItemKey) {
    this.key = key;
  }

  public getFallback() {
    return this.fallback;
  }
}
