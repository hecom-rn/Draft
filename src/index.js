import AsyncStorage from '@hecom/storage';
import LoginProcess from '@hecom/loginprocess';
import Foundation from '@hecom/foundation';

const rootNode = {};

const ModuleName = '@hecom/draft';
const storageKey = 'draftitem';

export default {
    name: ModuleName,
    initGlobal: _initGlobal,
    list: _list,
    get: _get,
    add: _add,
    remove: _remove,
};

function _initGlobal() {
    AsyncStorage.registerPart(storageKey, ModuleName);
    LoginProcess.register(_init, _uninit, 1, ModuleName);
}

function _init() {
    return AsyncStorage.getKeys(_key())
        .then((result) => {
            Object.values(result)
                .forEach(item => {
                    if (item) {
                        rootNode[item.id] = item;
                    }
                });
        })
        .finally(() => LoginProcess.mark(ModuleName, true));
}

function _uninit(forceClear) {
    Object.keys(rootNode).forEach(key => delete rootNode[key]);
    if (forceClear) {
        return AsyncStorage.getKeys(_key())
            .then((result) => {
                const promises = Object.values(result)
                    .map(item => AsyncStorage.remove(_key(item.id)));
                return Promise.all(promises);
            });
    }
}

function _list() {
    const items = Object.values(rootNode)
        .sort((a, b) => a.time < b.time ? 1 : -1);
    return Foundation.ObjectUtil.deepJsonCopy(items);
}

function _get(itemId) {
    return Foundation.ObjectUtil.deepJsonCopy(rootNode[itemId]);
}

function _add(metaName, content, itemId = undefined, others = {}) {
    const id = itemId || Foundation.StringUtil.guid();
    rootNode[id] = {
        id: id,
        metaName: metaName,
        content: content,
        time: Date.now(),
        others: others,
    };
    AsyncStorage.set(_key(id), rootNode[id]);
    return id;
}

function _remove(itemId) {
    if (itemId && rootNode[itemId]) {
        delete rootNode[itemId];
        AsyncStorage.remove(_key(itemId));
    }
}

function _key(itemId) {
    return [storageKey, itemId].filter(item => item);
}