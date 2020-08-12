---
marp: true
---

<!---class: invert --->

# Software Engineering interview questions

**by Raphael D. Pinheiro**

---

# Context

This compilation is made of Q&A of interviews I've made for tech startups in Europe.

I thought that it could be useful for more people, so I decided to write this talk.

Hope you like it! Enjoy 😁

---

# SOLID

Set of principles that make software easy to maintain and extend. These concepts were first brought up by Robert C. Martin, AKA Uncle Bob in 2000.

SOLID is an acronym where every letter signifies a specific concept.

Applicable to multi-paradigms.

---

# S - Single Responsability Principle

> A class should have one and only one reason to change, meaning that a class should have only one job.

No-go:

```typescript
class Square {
  area(side: int): string {
    return `Area is: ${Math.pow(side, 2)}`;
  }
}
```

We are merging both formating and calculation behavior in just one method. If we need to change the message and forget some other detail, we can make the calculation stop to work.

---

# S - Single Responsability Principle

Better:

```typescript
class Square {
  area(side: int): int {
    return Math.pow(side, 2);
  }
}

class AreaFormatter {
  write(area: int): string {
    return `Area is ${area}`;
  }
}

// Instantiation, import, etc...

const area = square(2);
areaFormatter(area);
// "Area is 4"
```

---

# O - Open-closed Principle

> Objects or entities should be open for extension, but closed for modification.

No-go:

```elixir
  #...
  def sum_areas(shapes) do
    Enum.reduce(shapes, 0, fn shape ->
      case shape.type do
        :square -> :math.pow(shape.side, 2)
        :circle -> :math.pi * :math.pow(shape.radius, 2)
      end
    end)
  end
```

Every modification you have to do in one of the geometric types, there is a chance to make the rest of the calculations to stop working.

---

# O - Open-closed Principle

Better

```elixir
  #...
  def calc_area(%{type: :circle, radius: radius} = shape) do
    :math.pi * :math.pow(radius, 2)
  end

  def calc_area(%{type: :square, side: side} = shape) do
    :math.pow(side, 2)
  end

  def sum_areas(shapes) do
    Enum.reduce(shapes, 0, fn shape ->
      calc_area(shape)
    end)
  end
```

You end up **extending** the `calc_area` definitions and left the `sum_areas` untouched, reducing the potential surface of bugs.

---

# L - Liskov Substitution Principle

> Let q(x) be a property provable about objects of x of type T. Then q(y) should be provable for objects y of type S where S is a subtype of T.

🙄 Let's simplify this definition...

> Given a subclass S, its implementation should always adhere to the superclass' interface and swapped without type errors.

---

# L - Liskov Substitution Principle

No-go:

```typescript
class Player {
  public update(pos: Position, delta: number): Position {
    pos.x += pos.x * delta;
    pos.y += pos.y * delta;

    return pos;
  }
}

class Mario extends Player {
  public update(pos: Position, delta: number): Position {
    if (pos.x < 0) {
      throw new Error("Can't move out of bounds");
    }

    pos.x += pos.x * delta;
    pos.y += pos.y * delta;

    return pos;
  }
}
```

---

# L - Liskov Substitution Principle

In the previous example there is a condition in runtime where the subtype couldn't be correctly swapped by its superclass as the contract wouldn't match.

Better:

```typescript
class Player {
  public update(pos: Position, delta: float): Position | never {
    pos.x += x * delta;
    pos.y += x * delta;

    return pos;
  }
}
```

From the type point-of-view, now we can swap `Player` and `Mario` without problems, as both are compatible.

---

# I - Interface Segregation Principle

> A client should never be forced to implement an interface that it doesn't use or clients shouldn't be forced to depend on methods they do not use.

No-go:

```typescript
interface Payment {
  receiveCash(): void;
  sendCash(): void;
}

class Rider implements Payment {
  sendCash(): void {
    // It makes sense for a rider to send money.
  }

  receiveCash(): void {
    // Unused. Now our class depend on a generic implementation. That is bad.
  }
}
```

---

# I - Interface Segregation Principle

Better:

```typescript
interface RiderPayment {
  sendCash(): void;
}

class Rider implements Payment {
  sendCash(): void {
    // It makes sense for a rider to send money.
  }
}
```

We end up having more specific contracts that adhere perfectly for the actual class use case, making it simpler to maintain and understand.

---

# D - Dependency Inversion Principle

> Entities must depend on abstractions not on concretions. It states that the high level module must not depend on the low level module, but they should depend on abstractions.

No-go:

```typescript
class Order {
  save(cart: Cart, dbConnection: DBPostgreSQLAdapter): void {
    dbConnection.table('orders').save(cart);
  }
}
```

Suppose we need to change to another database adapter that uses other method signature for saving things on the database, like `dbConnection.insert('orders', cart)`, that require changes in our Order class due to some low level modification.

---

# D - Dependency Inversion Principle

Better:

```typescript
class Order {
  save(cart: Cart, dbConnection: DBAdapter): void {
    dbConnection.table('orders').save(cart);
  }
}
```

Here we can see that we depend on an abstraction, so when we need to include other database adapters we don't have to change the `Order` class as the abstraction takes care of the method contract.

---

# Actor Model

> The Actor Model is a conceptual model to deal with concurrent computation. It defines some general rules for how the system’s components should behave and interact with each other.

    - Brian Storti

So what Actors should have to be considered one?

- Ability to receive and send messages asynchornously using mailboxes
- Internal state that only the owner actor can mutate
- It can create new actors
- Have addresses so they can communicate with each other

Popular implementation of the Actor Model is present on Erlang/Elixir (through Processes) and Akka for the JVM.

---

# Actor Model

## Fault Tolerance

Erlang, for example, introduced "Let it crash" Philosophy. It translates into not spending to much development effort on writing defensive programming but rather simply letting it crash as there will be supervisors (Actors can create Actors, remember?) responsible for restarting it with its initial state or any strategy that may fit best.

## Distribution

Actors can communicate with other ones by sending or receving messages. As long as the Actor is physically reachable, they can do so.

This enable us to distribute Actors across the internet creating a web of working nodes that behave as one, making scaling more sane.

---

# Design Patterns

Design Patterns are suggested solutions to common problems in software development.

They are separate in categories that aim to solve specific issues.

It is heavily influenced by Object-Oriented programming and most of its concepts are focusing on this paradigm.

There are a lot of Design Patterns and they are usually divided into 3 categories:

- Creational Patterns
- Structural Patterns
- Behavioral Patterns

---

# Design Patterns

## Singleton (Creational Patterns)

In OOP programs there is the ability to instantiate objects. Sometimes is common to have just one instance that can be accessed in any other class, like a helper class, utility, etc.

For these cases, a Singleton usage is interesting because you end up having a **single instance** that is accessable anywhere else in your code, avoid having a lot of parameter passing or boilerplate code.

---

# Design Patterns

## Dependency Injection (Creational Patterns)

Instead of:

```typescript
  //...
  public sendRequest(body, url): void {
    let headers = new Headers({contentType: 'json'})
    let http = new HTTP(headers)

    let response = http.sendRequest(body, url)
  }
```

---

# Design Patterns

## Dependency Injection (Creational Patterns)

What about:

```typescript
  //...
  public sendRequest(body: string, url: string, http: iHTTP): void {
    let response = http.sendRequest(body, url)
  }
```

We avoid boilerplate code inside `sendRequest` function making it easier to test and maintain.

---

# Design Patterns

## Proxy (Structural Patterns)

```typescript
class RawWavToMp3Converter implements Converter {
  start(filePath: string): void {
    // Do binary manipulation here in order to convert the file
  }
}
```

From design point-of-view, sometimes it's not a good idea to call this class directly, because other developers can misuse that or it needs to perform additional checks like access control, caching, etc.

---

# Design Patterns

## Proxy (Structural Patterns)

You create a Proxy class that will call the raw class' methods on your behalf adhering to the **same interface.**

```typescript
class ProxyWavToMp3Converter implements Converter {
  /// ...
  start(filePath: string): void {
    if (checkAccessControl() && !isCached()) {
      let converter = new RawWavToMp3Converter();
      converter.start();
    }
  }
}
```

That enable us to take advantage of many things like lazy initialization.

---

# Design Patterns

## Strategy (Behavioral Patterns)

Enable one to build a family of algorithms, put them into separated classes and make them interchangeable through their interfaces.

Imagine this scenario:

```typescript
class Currency {
  convert(from: string, to: string) {
    if (from.contains('UGX') && to.contains('USD')) {
      // Do the math...
    }
  }
}
```

Soon this function is going to be bloated and hard to maintain.

---

# Design Patterns

## Strategy (Behavioral Patterns)

```typescript
interface CurrencyCalculator {
  convert(from: string, to: string);
}

class Currency {
  private strategy: CurrencyCalculator;
  setStrategy(strategy: CurrencyCalculator) {
    this.strategy = strategy;
  }

  doConvertion() {
    this.strategy.convert();
  }
}
```

---

# Design Patterns

## Strategy (Behavioral Patterns)

The big benefit of using this pattern is to detach the point of maintanance from one big method into smaller and specific classes sharing the same interface.

---

# Design Patterns

## Template Method (Behavioral Patterns)

Ability to define a skeleton of an algorithm in a superclass so the inherited ones can implement the specific parts.

In most OOP languages this pattern implies the usage of an **abstract class**. Let's check what it is first

---

# Design Patterns

## Template Method (Behavioral Patterns)

### Abstract Classes

- Can't be instantiated directly. Only it's subclasses
- It defines methods contracts
- Unlike Interfaces, it can have methods implementation

---

# Design Patterns

## Template Method (Behavioral Patterns)

```typescript
abstract class Wallet {
  pay(amount: number) {
    if (hasBalance(amount) && is2FA()) {
      // Complete the transaction
    }
  }

  // checks balance
  abstract hasBalance(amount: number): boolean;
  // check if user is authorized by 2FA method
  abstract is2FA(): boolean;
}
```

Depending on wallet's type we can have different ways to check the balance or if the user is authenticated. So in our `pay` method we create a template algorithm that inherited classes will have to fill the blanks (AKA abstract methods)

---

# Design Patterns

## Template Method (Behavioral Patterns)

```typescript
class BitcoinWallet extends Wallet {
  hasBalance(amount: number): boolean {
    // Check on the keychain, blockchain, etc
  }

  is2FA(): boolean {
    // Check if the user is using some sort of 2-factor authentication.
  }
}
```

When we call `pay` method on this class, we will have the proper verification and transaction made without having to specify how to pay as this is already established on the parent abstract class.

---

# Testing

### TDD (Test-Driven Development)

The expectations are first written in the test file. Once this stage is done the test will obviously fail as there is no implementation.

The developer starts implementing the algorithm until all test cases are successful.

From this point on, we are safe to do any refactoring or code style adjustments may fit.

---

# Testing

### TDD (Test-Driven Development)

Pros:

- Upfront code designing, expectations and interface are clear
- Once is done, you don't need to go back to implement any test because they already exist
- Great to use with simple or pure functions

Cons:

- Tests beyond unit testing becomes harder to write
- Paradigm shift: required the team to buy into

---

# Testing

### BDD (Behavior-Driven Development)

Technique that enables one to describe software requirements in human-readable format. Ultimately, these descriptions become a live documentation that generate tests.

---

# Testing

### BDD (Behavior-Driven Development)

An example using the Gherkin syntax

```gherkin
Feature: User login

Scenario: Login basic flow
  Given I am in the /login page
  And Have <credential_type> credentials
  When I type these credentials
  Then I should be redirected to the <redirected_page> page

  Examples:
  | credential_type | redirected_page |
  |      valid      |    dashboard    |
  |     invalid     |      login      |
```

This document is runable! 😄

---

# Testing

## Why do we mock?

```elixir
  def book_flight(flight, user)
    with :ok <- check_availability(flight),
      {:ok, payment_info} <- pay(user),
      :ok <- send_receipt(user.email, flight)
    do
      {:ok, flight, payment_info}
    else
      {:email_error, reason} -> # Passenger booked the flight
      # but for some reason didn't receive the email.
      {_, reason} -> # Passenger didn't book the flight
    end
  end
```

Imagine you have a public function that does several things inside of it, including to have side-effects (HTTP, I/O, etc).

---

# Testing

## Why do we mock?

We don't mock because we want to know if the function is working on production, but rather to know if our expectations still the same and to prevent runtime errors.

---

# Domain-Driven Design (DDD)

Concept that aims to model an application's code using the business language rather than generic nomenclature.

Example, an application that lets investors find companies to invest.

non-DDD:

```elixir
  defmodule MyApp.User do
    def transfer_money(company_id) do
      # ...
    end
  end
```

---

# Domain-Driven Design (DDD)

DDD:

```elixir
  defmodule MyApp.Investor do
    def invest(company_id) do
      # ...
    end
  end
```

---

# Domain-Driven Design (DDD)

Pros:

- Business team and developers speak the same language
- As a consequence, this approach forces the dev team to fully understand the business' rules

Cons:

- If the business pivoted and some entities drastically changes, the code's artefacts may have to be renamed or repurposed.

---

# Object-oriented vs Functional

First of all, there is no silver bullet.

That said, let's see the characteristics of both

---

# Object-oriented vs Functional

## Object-oriented Programming (OOP)

- Behavior built over class inheritance
- Hierarchy-based
- Functions (AKA methods) have access to outer scope
- State mutalibility
- Necessity to instantiate classes
- Reference passing

---

# Object-oriented vs Functional

## Functional Programming (FP)

- Build behavior over function composition
- Functions have no access to outer scope
- Try to follow function purity principle as much as possible
- Therefore, no state mutation
- Ability to have higher-order functions
- No reference passing

---

# Common web vulnerabilities

## SQL Injection

It aims to run an arbitrary SQL query on the database through an exploitation of the software design.

Let's say there is a website that let you log into an account.

We could assume that in some moment the backend code will run a verification query on the database more or less like this:

```postgresql
  select * from public.users where username = '&1' and password = '&2'
```

Where &1 and &2 are values sent from the front-end.

---

# Common web vulnerabilities

## SQL Injection

Instead of passing a password, I can try to pass a malicious query.

So my password is like this: `'; delete table public.users--`

```postgresql
  select * from public.users where username = '&1' and password = ''; delete table public.users--'
```

For databases that enable multiline command, this trick can be done and end up performing two queries.

### How to solve that

- Either by treating every incoming data as untrusted, making proper data sanitation.
- Or having prepared SQL statements

---

# Common web vulnerabilities

## XSS (Cross-site Script)

Exploit that enables one to send data to other users that is supposed to be rendered but ends up being executed.

Say we have an HTML form and a simple webserver that receive this information an display it on the page, pretty much as a chat application.

Instead of sending "Hi! How are you?" in the chat textbox, what about...

```html
<script>
  alert('Hey! How are you?');
</script>
```

---

# Common web vulnerabilities

## XSS (Cross-site Script)

If the dialog appears, the website is exploitable via XSS.

So you can do whatever you want. From a dummy script like this to hijacking the user session and sending it to an external server through HXR.

### How to solve that

- By escaping especial characters like `<`, `>` when receiving data from the server. That will disable the ability to forge a script tag, for example.
- By validating all input the server is going to receive and possibly sanitize that.

---

# Common web vulnerabilities

## CSRF (Cross-site Request Forgery)

Imagine you are logged-in in a bank site. This bank website is built in a way that transfering money through their API is as simple as this:

```http
  GET
  https://bank.com/transfer?accountno=1&amount=1000
  cookie: co01ab016c8bf012cb83
```

If we manage to create a page that makes the user clink in a modified link like this:

```html
<a src="https://bank.com/transfer?accountno=MY_ACCOUNT&amount=1000"></a>
```

The request will be successful because the browser automatically appends the cookies when doing requests, therefore, I can make you transfer money to my account.

---

# Common web vulnerabilities

## CSRF (Cross-site Request Forgery)

### How to prevent that

- Request an extra layer of authentication/verification when doing sensitive actions, like 2FA, captcha, etc
- Use another authentication medium like Local Storage. But take especial attention because Local Storage can be vulnerable to XSS attacks.
- Use Anti-CSRF

---

# Common services used for development

- PostgreSQL for relational database
- Redis for caching and pub/sub mechanism
- RabbitMQ for message exchange between systems using queues
- Kafka for message exchange with storage abilities
- AWS for managing comprehensive solutions for cloud.
  - S3 for file storage
  - CodeDeploy to listen to changes on repos and trigger some action like a deployment
  - SQS queue solution
  - List goes on...

---

# 2077's JavaScript

## Optional Chain Operator

Before:

```javascript
if (myObj.name && myObj.name.lastName) {
  return myObj.name.lastName;
} else {
  return 'No last name';
}
```

Now:

```javascript
return myObj.name?.lastName || 'No last name';
```

---

# 2077's JavaScript

## Rest Properties

Enable one to specify what properties to get back separately and all the rest into a separate variable.

```javascript
const { response, ...rest } = { response: 1, headers: 2, cache: 3 };
console.log(response); // 1
console.log(rest); // { headers: 2, cache: 3 }
```

Work both for objects and arrays.

---

# 2077's JavaScript

## Spread Properties

Enable one to merge properties of an object into another. This is also a primitive form of pattern matching.

```javascript
const { response, ...rest } = { response: 1, headers: 2, cache: 3 };
const newHeader = { headers: 10 };
const newObj = { response, ...newHeader };
console.log(newObj); // { response: 1, headers: 10 }
```

Work both for objects and arrays.

---

# 2077's JavaScript

## Nullish Coalescing operator

Ability to check if a value is only `undefined` or `null` using `??` operator, being true, it uses the right-hand value.

```javascript
const result = undefined;
console.log(result ?? 'No value');
```

It is different from `||` with checks for falsy values (empty strings, `0`, `false`, `null` and `undefined`)

---

# 2077's JavaScript

## Numeric Separator

It makes easier to separate numbers.

```javascript
console.log(100_000); // 100000
```

---

# 2077's JavaScript

## The future is here

There is a Technical Commitee that organizes, discuss and implement all JavaScript's new features.

It is open-sourced and you can check the next steps here:

https://github.com/tc39/proposals

---

# Algorithms

## Fizz Buzz

Classic code assignment given to candidates. Every number given to a function that is divisible by 3, output `Fizz`. If divisible by 5, output `Buzz`.

An naive implementation looks more or less like this

```javascript
if (number % 3 === 0) {
  return 'Fizz';
} else if (number % 5 === 0) {
  return 'Buzz';
}
```

That works pretty well.

---

# Algorithms

## Fizz Buzz

If a new requirement comes in, like if it has to be divisible by both, output `FizzBuzz`.

```javascript
if (number % 3 === 0 && number && 5 === 0) {
  return 'FizzBuzz';
}
if (number % 3 === 0) {
  return 'Fizz';
} else if (number % 5 === 0) {
  return 'Buzz';
}
```

This seems a bit repetitive, for sure there are better ways to solve this.

---

# Algorithms

## Fizz Buzz

We could use string concatenation to solve that by not having `else if` statements, forcing the program flow to go through all valid cases, concatenating the string to possibly form `FizzBuzz`. But we coudl go beyond that.

Let's use a technique known as hash maps.

---

# Algorithms

## Fizz Buzz

```typescript
const possibleOutcomes = {
  3: type.Fizz,
  5: type.Buzz,
};

export const calc = (n: number): string | number => {
  return (
    Object.keys(possibleOutcomes)
      .map((x) => parseInt(x))
      .reduce((prev, current) => {
        return (
          prev + (n % current === 0 ? possibleOutcomes[current].toString() : '')
        );
      }, '') || n
  );
};
```

---
