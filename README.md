# Draft

[![npm version](https://img.shields.io/npm/v/@hecom/draft.svg?style=flat)](https://www.npmjs.com/package/@hecom/draft)

这是新建业务数据时，保存和管理草稿的模块。单个草稿数据作为一条数据存入持久化存储中，这个存储库支持批量查询。

## 安装

```shell
npm install --save @hecom/draft
```

## 使用方法

```javascript
import Draft from '@hecom/draft';
```

## 接口

* `name: string`：模块名称。
* `initGlobal: () => Promise`：全局初始化模块。
* `list: () => array`：获取草稿列表，按时间从大到小排序。
* `get: (itemId) => object`：获取指定`itemId`的草稿项。
* `add: (metaName, content, itemId, others) => string`：新增或者编辑草稿，根据`itemId`判断，如果有则是编辑，否则是新增。返回结果的草稿项Id。
* `remove: (itemId) => void`：从草稿箱中移除指定`itemId`的草稿项。