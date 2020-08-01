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

---

# S - Single Responsability Principle

> A class should have one and only one reason to change, meaning that a class should have only one job.

No-go:

```typescript
  class Square {
      area(side: int): string {
          return `Area is: ${Math.pow(side, 2)}`
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
          return Math.pow(side, 2)
      }
  }

  class AreaFormatter {
      write(area: int): string {
          return `Area is ${area}`
      }
  }

  // Instantiation, import, etc...

  const area = square(2)
  areaFormatter(area)
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
      pos.x += x * delta
      pos.y += x * delta

      return pos
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
    receiveCash(): void
    sendCash(): void
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
    sendCash(): void
  }

  class Rider implements Payment {
    sendCash(): void {
      // It makes sense for a rider to send money.
    }
  }
```

We end up having more specific contracts that adhere perfectly for the actual class use case, making it simpler to maintain and understand.