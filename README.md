```mermaid
classDiagram
  class User {
    + ID
    + Name
    + Email
    + Password
    + Tasks[]
    + Notifications[]
    + LogIn()
    + Register()
    + AddTask()
    + EditTask()
    + DeleteTask()
  }

  class Task {
    + ID
    + Title
    + Description
    + DueDate
    + Priority
    + Status
    + User
  }

  class Notification {
    + ID
    + Message
    + DateTime
    + Recipient
  }

  User --|> Task
  User --|> Notification
  Task --|> User

```

Print rodando os testes:

![image](https://github.com/pedrohma07/it-task/assets/87721963/7c0cf728-abcd-4f05-b5f9-8e3094b613a1)

Alunos:

* Pedro Henrique Moreira de Albuquerque
* Amabiel Junior
* Alan Mendonça
* Andre Lessa
* Marcos Filipi

