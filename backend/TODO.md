# TODO

迷子にならないための TODO

## 参加者の一覧取得

- [x] DB
  - [x] schema.prisma
- [x] Controller
  - [x] 実装
    - [x] user.controller.ts
      - [x] ResponseType
      - [x] response
      - [x] usecase
      - [x] qs
  - [x] API tool で確認
- [x] Usecase
  - [x] 実装
    - [x] qs-interface
    - [x] get-all-users-usecase.ts
    - [x] qs
  - [x] UT
    - [x] 正常系
    - [x] 異常系
- [x] query-service
  - [x] IT
    - [x] 正常系
  - [x] 実装

## 参加者の新規追加

- [x] Controller
  - [x] 実装
    - [x] user.controller.ts
      - [x] request
      - [x] usecase
      - [x] repo
  - [x] API tool で確認
- [x] Usecase
  - [x] UT
    - [x] 正常系
    - [x] 異常系
  - [x] 実装
    - [x] repository
    - [x] interface
    - [x] post-user-usecase.ts
- [x] repository
  - [x] IT
    - [x] 正常系
  - [x] 実装

## 参加者の削除

- [x] Controller
  - [x] 実装
    - [x] user.controller.ts
      - [x] request
      - [x] usecase
      - [x] repo
  - [x] API tool で確認
- [x] Usecase
  - [x] UT
    - [x] 正常系
    - [x] 異常系
  - [x] 実装
    - [x] repository
    - [x] interface
    - [x] delete-user-usecase.ts
- [x] repository
  - [x] IT
    - [x] 正常系
  - [x] 実装
- [x] query-service
  - [x] IT
    - [x] 正常系
  - [x] 実装

## 参加者の更新（在籍ステータス）

- [x] DB
  - [x] schema.prisma
- [x] Controller
  - [x] 実装
    - [x] user.controller.ts
      - [x] ResponseType
      - [x] response
      - [x] usecase
      - [x] qs
      - [ ] validation
  - [x] API tool で確認
- [x] Usecase
  - [x] UT
    - [x] 正常系
    - [x] 異常系
  - [x] 実装
    - [x] qs
    - [x] repo
    - [x] usecase
- [x] repository
  - [x] IT
    - [x] 正常系
  - [x] 実装

# memo

- エラーハンドリングが分からん。repository を呼び出す際に都度 try catch するの？
- DB の unique 制約でエラー発生した場合は、どこでエラーハンドリングするの？
  - repository? usecase?
  - ドメインロジックだから domain??
