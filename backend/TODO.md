# TODO

迷子にならないための TODO

## 参加者

### 参加者の一覧取得

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

### 参加者の新規追加

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

### 参加者の削除

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

### 参加者の更新（在籍ステータス）

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

### 参加者の重複チェック

- [x] domain-service
  - [x] UT
  - [x] 実装
- [x] Usecase
  - [x] UT
  - [x] 実装
- [x] Repository
  - [x] IT
  - [x] 実装

### READ 系修正

- [x] Controller
- [x] UseCase: GetAllUsersUseCase
- [x] Repository: UserQS

## 課題

### DB

- [x] Task: schema.prisma
- [x] User: schema.prisma
- [x] User のスキーマ変更に伴う修正

### CREATE

- [x] Domain
  - [x] Task
  - [x] UserTaskStatus
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
  - [x] IT
    - [x] 正常系
  - [x] 実装

## taskStatus

### READ

#### user ごと

- [x] Controller
  - [x] 実装
    - [x] user.controller.ts
      - [x] request
      - [x] usecase
  - [x] API tool で確認
- [x] Usecase
  - [x] UT
    - [x] 正常系
    - [x] 異常系
  - [x] 実装
- [x] repository
  - [x] IT
    - [x] 正常系
  - [x] 実装
- [x] refactor
  - [x] check exists logic
    - [x] UT
    - [x] 実装

### CREATE

#### 複数集約間（Task が作成されたとき）

- [x] CreateTaskUsecase
- [x] UserRepository.findAll()
- [x] TaskStatusRepository.saveAll()
- [x] API Tool で検証
  - [x] Case1(ユーザが存在していてタスクを作成した場合、UserTaskStatus が作成されていること)
  - [x] Case2(ユーザが存在していないときにタスクを作成した場合、)

#### 複数集約間（User が作成されたとき）

- [x] CreateUserUsecase
- [x] TaskRepository.findAll()
- [x] TaskStatusRepository.saveAll()
- [x] API Tool で検証
  - [x] Case1(タスクが存在していてユーザを作成した場合、UserTaskStatus が作成されていること)
  - [x] Case2(タスクが存在していないときにユーザを作成した場合、UserTaskStatus が作成されていないこと)

### UPDATE

- [x] Controller
  - [x] 実装
  - [x] API tool で確認
- [x] Usecase
  - [x] UT
    - [x] 正常系
    - [x] 異常系
  - [x] 実装
- [x] repository
  - [x] IT
    - [x] 正常系
  - [x] 実装
- [x] Domain
  - [x] UT

### DELETE

#### 複数間集約(User)

- [x] usecase 修正
- [x] repository 修正(Referential actions
      へ)
  - [x] it 修正
  - [x] usecase 戻す
- [x] ApiTool 確認
  - [x] Case1: ユーザと対応する課題が存在しているときにユーザーを削除したら、どちらも削除されていること
  - [x] Case2: ユーザが存在していてと対応する課題が存在していないときにユーザーを削除したら、ユーザのみ削除されていること

#### Controller

- [x] 実装

#### UseCase

- [x] 実装
- [x] UT

#### Reposioty

- [x] 実装
- [x] IT

#### QS

- [x] 実装
- [x] IT

#### 動作確認(ApiTool)

- [x] Case1: 課題と課題ステータスが存在しているときに課題を削除したら、どちらも削除されていること
- [x] Case2: 課題が存在していてと対応する課題が存在していないときに課題を削除したら、課題のみ削除されていること

## 図の作成

### ドメインモデル図

- [x] domain model
- [x] 仕様
- [ ] 詳細な仕様

### DB モデル図

## ペア集約

### DB

- [x] schema.prisma
- [x] migration

### ペアの一覧取得

### ペアの更新(所属参加者の変更)

# memo

- エラーハンドリングが分からん。repository を呼び出す際に都度 try catch するの？
- DB の unique 制約でエラー発生した場合は、どこでエラーハンドリングするの？
  - repository? usecase?
  - ドメインロジックだから domain??
- CQRS を採用する際は、参照系で query-service を利用するけど、更新系の UseCase での存在チェックするときに利用するのは QS?Repository?個人的には存在チェックには Repository に findById を実装して対応したい。なぜなら、存在チェックに必要なデータモデルは Join とかしなくても済むから。
