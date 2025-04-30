// utils/indexedDBService.ts

import { DB_NAME, DB_VERSION, STORES } from './indexedDB';

// 데이터베이스 연결 가져오기
export const getDBConnection = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION); // DB 버전 명시 추가

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 버전 불일치 시 자동 업그레이드
      if (db.version < DB_VERSION) {
        console.warn('DB version mismatch. Upgrading...');
        const requestUpgrade = indexedDB.open(DB_NAME, DB_VERSION);

        requestUpgrade.onsuccess = () => {
          resolve(requestUpgrade.result);
        };

        requestUpgrade.onerror = () => {
          reject(requestUpgrade.error);
        };
      } else {
        resolve(db);
      }
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };

    // 추가된 오류 핸들러
    request.onblocked = () => {
      console.warn(
        'DB connection blocked. Please close other tabs using this DB.'
      );
    };
  });
};

// 생성 (Create)
export const add = <T>(storeName: string, data: T): Promise<IDBValidKey> => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const request = store.add(data);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };

        // 트랜잭션 중단 핸들러 추가
        transaction.onabort = () => {
          console.warn('Transaction aborted:', transaction.error);
          db.close();
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 읽기 (Read)
export const get = <T>(
  storeName: string,
  key: IDBValidKey
): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result as T);
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 모두 읽기 (Read All)
export const getAll = <T>(storeName: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result as T[]);
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 인덱스로 읽기 (Read By Index)
export const getByIndex = <T>(
  storeName: string,
  indexName: string,
  value: IDBValidKey
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);

        const request = index.getAll(value);

        request.onsuccess = () => {
          resolve(request.result as T[]);
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 업데이트 (Update)
export const update = <T>(storeName: string, data: T): Promise<IDBValidKey> => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const request = store.put(data);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 삭제 (Delete)
export const remove = (storeName: string, key: IDBValidKey): Promise<void> => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const request = store.delete(key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 쿼리 (Query - Cursor 사용)
export const query = <T>(
  storeName: string,
  indexName: string,
  range?: IDBKeyRange,
  direction?: IDBCursorDirection,
  limit?: number
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = indexName ? store.index(indexName) : store;

        const request = index.openCursor(range, direction);
        const results: T[] = [];
        let count = 0;

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest)
            .result as IDBCursorWithValue;

          if (cursor && (!limit || count < limit)) {
            results.push(cursor.value);
            count++;
            cursor.continue();
          } else {
            resolve(results);
          }
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 모두 지우기 (Clear)
export const clear = (storeName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    getDBConnection()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
};
