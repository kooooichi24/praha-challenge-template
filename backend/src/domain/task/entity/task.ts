export class Task {
  private id: string
  private title: string
  private content: string

  public constructor(props: { id: string; title: string; content: string }) {
    const { id, title, content } = props
    this.id = id
    this.title = title
    this.content = content
  }

  public getAllProperties() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
    }
  }
}
