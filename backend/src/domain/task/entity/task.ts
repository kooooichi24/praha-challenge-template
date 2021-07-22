export class Task {
  private id: string
  private title: string
  private content: string
  private status: 'TODO' | 'REVIEWING' | 'DONE'

  public constructor(props: {
    id: string
    title: string
    content: string
    status?: 'TODO' | 'REVIEWING' | 'DONE'
  }) {
    const { id, title, content, status } = props
    this.id = id
    this.title = title
    this.content = content
    this.status = status ? status : 'TODO'
  }

  public getAllProperties() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      status: this.status,
    }
  }

  public changeStatus(status: 'TODO' | 'REVIEWING' | 'DONE') {
    if (this.status === 'DONE') {
      throw Error('DONE状態の課題のステータスは変更することができません。')
    }
    this.status = status
  }
}
