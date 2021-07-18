export class User {
  private id: string
  private name: string
  private mail: string
  public constructor(props: { id: string; name: string; mail: string }) {
    const { id, name, mail } = props
    this.id = id
    this.name = name
    this.mail = mail
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      mail: this.mail,
    }
  }
}
