import { StorageItemKey, Unwatch, WatchCallback } from '@wxt-dev/storage';

export default class KVStorageService<T> {
  constructor(private key: StorageItemKey, private fallback: T) {}

  public getValue(): Promise<T> {
    return storage.getItem<T>(this.key, { fallback: this.fallback });
  }

  public setValue(value: T): Promise<void> {
    return storage.setItem<T>(this.key, value);
  }

  public watch(cb: WatchCallback<T | null>): Unwatch {
    return storage.watch<T>(this.key, cb);
  }

  public getKey(): StorageItemKey {
    return this.key;
  }

  public setKey(key: StorageItemKey) {
    this.key = key;
  }

  public getFallback() {
    return this.fallback;
  }
}
