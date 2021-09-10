export class User {
  private id: string
  private name: string
  private mail: string
  private status: 'ENROLLMENT' | 'RECESS' | 'LEFT'

  public constructor(props: {
    id: string
    name: string
    mail: string
    status?: 'ENROLLMENT' | 'RECESS' | 'LEFT'
  }) {
    const { id, name, mail, status } = props
    this.id = id
    this.name = name
    this.mail = mail
    this.status = status ? status : 'ENROLLMENT'
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      mail: this.mail,
      status: this.status,
    }
  }

  public changeStatus(status: 'ENROLLMENT' | 'RECESS' | 'LEFT') {
    this.status = status
  }
}
