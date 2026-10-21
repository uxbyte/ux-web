
type DataInstance<T> = {
    value?: T,
    expiredTime?: number
}

type ItemInstance<T> = {
    key: any,
    type: 'temp' | 'local',
    data?: DataInstance<T>
}

export const uxCached = {
    set<T>(key: string, value: T, expired = 0, session = false) {
        const expiredTime = expired > 0 ? Date.now() + expired * 1000 : 0;
        const data = { data: value, expiredTime } as DataInstance<T>
        if (session) {
            sessionStorage.setItem(key, JSON.stringify(data));
        } else {
            localStorage.setItem(key, JSON.stringify(data));
        }
    },
    get<T>(key: string, session = false): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                const items = session ? sessionStorage.getItem(key) : localStorage.getItem(key);
                if (items == null || items == '') {
                    resolve("" as T)
                    return
                }
                const { data, expiredTime } = JSON.parse(items as string);
                if (expiredTime > 0 && expiredTime < Date.now()) {
                    this.remove(key);
                    resolve("" as T)
                } else {
                    resolve(data as T)
                }
            } catch (e) {
                reject(new Error("cache get error"));
            }
        })
    },
    remove(key: string, session: boolean = false) {
        if (session) {
            sessionStorage.removeItem(key)
        } else {
            localStorage.removeItem(key);
        }
    },
    all(session = false): Promise<ItemInstance<any>[]> {
        return new Promise((resolve) => {
            const list: ItemInstance<any>[] = [];
            const local = window.localStorage as { [key: string]: any };
            for (let i = 0; i < local.length; i++) {
                const key = local.key(i);
                const data = localStorage.getItem(local.key(i))
                try {
                    const value = JSON.parse(data as string) as DataInstance<any>
                    list.push({ type: 'local', key, data: value })
                } catch (e) {
                    list.push({ type: 'local', key, data: { value: data, expiredTime: -1 } })
                }
            }
            if (session) {
                const temp = window.sessionStorage;
                for (let j = 0; j < temp.length; j++) {
                    list.push({ key: temp.key(j), type: 'temp' })
                }
            }
            resolve(list);
        })
    }
}