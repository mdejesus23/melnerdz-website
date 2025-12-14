---
title: Build a Snake Game in Python with Turtle (OOP)
pubDate: 2025-12-14
author: Melnard
slug: python-snake-game-turtle-oop
image:
  src: ./python-snake.png
  alt: Python Turtle Snake Game
description: Step-by-step tutorial to create the classic Snake game in Python using the Turtle graphics library, applying clean Object-Oriented design.
technology:
  - python
  - turtle
  - oop
tags:
  - python
  - game-dev
  - beginner
---

## Overview

In this tutorial, you’ll build the classic Snake game using Python’s built-in Turtle graphics library. We’ll apply Object-Oriented Programming (OOP) principles to keep the code modular, testable, and easy to extend.

You’ll learn to:

- Structure a small game with classes (Snake, Food, Scoreboard, Game).
- Handle keyboard input and real-time movement.
- Detect collisions and manage game state.
- Add polished features like speed control and wall-free wrap mode.

Estimated time: 60–90 minutes.

## Prerequisites

- Python 3.10+ installed
- Works on Linux, macOS, and Windows (Turtle uses Tkinter under the hood)
- Basic Python knowledge (functions, classes)

Optional but helpful:

- A virtual environment
- VS Code or any editor

## Project Structure

We’ll keep things simple:

```
snake-game/
  main.py
  snake.py
  food.py
  scoreboard.py
```

- `main.py`: Entry point and game loop.
- `snake.py`: Snake class (segments, movement, growth).
- `food.py`: Food class (random placement).
- `scoreboard.py`: Scoreboard class (scoring, game over).

## Setup

Create a folder and files:

```bash
mkdir -p snake-game && cd snake-game
printf "" > main.py
printf "" > snake.py
printf "" > food.py
printf "" > scoreboard.py
```

Run the game (later after adding code):

```bash
python3 main.py
```

## Core Concepts (tiny contract)

- Inputs: arrow keys for direction
- Outputs: Turtle window, moving snake, food, score updates
- Error modes: invalid reverse turn is ignored; collisions end the game
- Success criteria: snake moves smoothly, eats food, grows, score increases, game ends on wall/self hit (or wraps if enabled)

---

## Step 1: The Snake Class

Responsibilities:

- Manage segments (list of Turtles)
- Move forward in a grid
- Turn with arrow keys (no instant 180°)
- Grow when eating

Create `snake.py`:

```python
from turtle import Turtle

STARTING_POSITIONS = [(0, 0), (-20, 0), (-40, 0)]
MOVE_DISTANCE = 20
UP = 90
DOWN = 270
LEFT = 180
RIGHT = 0

class Snake:
    def __init__(self):
        self.segments = []
        self.create_snake()
        self.head = self.segments[0]

    def create_snake(self):
        for position in STARTING_POSITIONS:
            self.add_segment(position)

    def add_segment(self, position):
        segment = Turtle("square")
        segment.color("white")
        segment.penup()
        segment.goto(position)
        self.segments.append(segment)

    def reset(self):
        for seg in self.segments:
            seg.goto(1000, 1000)  # move off-screen
        self.segments.clear()
        self.create_snake()
        self.head = self.segments[0]

    def extend(self):
        # Add segment at the tail's last position
        self.add_segment(self.segments[-1].position())

    def move(self):
        # Move from tail to head: each segment follows the previous
        for idx in range(len(self.segments) - 1, 0, -1):
            new_x = self.segments[idx - 1].xcor()
            new_y = self.segments[idx - 1].ycor()
            self.segments[idx].goto(new_x, new_y)
        self.head.forward(MOVE_DISTANCE)

    def up(self):
        if self.head.heading() != DOWN:
            self.head.setheading(UP)

    def down(self):
        if self.head.heading() != UP:
            self.head.setheading(DOWN)

    def left(self):
        if self.head.heading() != RIGHT:
            self.head.setheading(LEFT)

    def right(self):
        if self.head.heading() != LEFT:
            self.head.setheading(RIGHT)
```

## Step 2: The Food Class

Responsibilities:

- Draw a small circle
- Randomly reposition within bounds

Create `food.py`:

```python
import random
from turtle import Turtle

class Food(Turtle):
    def __init__(self, width=600, height=600, margin=20):
        super().__init__("circle")
        self.penup()
        self.color("yellow")
        self.shapesize(stretch_wid=0.6, stretch_len=0.6)
        self.speed("fastest")
        self.width = width
        self.height = height
        self.margin = margin
        self.refresh()

    def refresh(self):
        # pick positions aligned to 20px grid
        x = random.randint(-(self.width // 2 - self.margin), (self.width // 2 - self.margin)) // 20 * 20
        y = random.randint(-(self.height // 2 - self.margin), (self.height // 2 - self.margin)) // 20 * 20
        self.goto(x, y)
```

## Step 3: The Scoreboard Class

Responsibilities:

- Display score at top
- Show game over

Create `scoreboard.py`:

```python
from turtle import Turtle

ALIGNMENT = "center"
FONT = ("Courier", 16, "normal")

class Scoreboard(Turtle):
    def __init__(self):
        super().__init__()
        self.score = 0
        self.high_score = 0
        self.color("white")
        self.penup()
        self.hideturtle()
        self.goto(0, 260)
        self.update_scoreboard()

    def update_scoreboard(self):
        self.clear()
        self.write(f"Score: {self.score}  High Score: {self.high_score}", align=ALIGNMENT, font=FONT)

    def increase(self):
        self.score += 1
        self.update_scoreboard()

    def game_over(self):
        self.goto(0, 0)
        self.write("GAME OVER", align=ALIGNMENT, font=("Courier", 24, "bold"))

    def reset(self):
        if self.score > self.high_score:
            self.high_score = self.score
        self.score = 0
        self.update_scoreboard()
```

## Step 4: The Main Game Loop

Create `main.py`:

```python
import time
from turtle import Screen
from snake import Snake
from food import Food
from scoreboard import Scoreboard

WIDTH = 600
HEIGHT = 600

screen = Screen()
screen.setup(width=WIDTH, height=HEIGHT)
screen.bgcolor("black")
screen.title("Snake Game - Turtle + OOP")
screen.tracer(0)  # manual screen updates for smooth animation

snake = Snake()
food = Food(width=WIDTH, height=HEIGHT)
scoreboard = Scoreboard()

# controls
screen.listen()
screen.onkey(snake.up, "Up")
screen.onkey(snake.down, "Down")
screen.onkey(snake.left, "Left")
screen.onkey(snake.right, "Right")

# Game state
is_running = True
SPEED = 0.1  # seconds per frame (decrease to speed up)
MARGIN = 10

# boundaries
x_min = -(WIDTH // 2) + MARGIN
x_max = (WIDTH // 2) - MARGIN
y_min = -(HEIGHT // 2) + MARGIN
y_max = (HEIGHT // 2) - MARGIN

while is_running:
    screen.update()
    time.sleep(SPEED)
    snake.move()

    # food collision
    if snake.head.distance(food) < 15:
        food.refresh()
        snake.extend()
        scoreboard.increase()
        # Optional: gradually speed up
        SPEED = max(0.05, SPEED - 0.005)

    # wall collision (end game)
    if not (x_min <= snake.head.xcor() <= x_max and y_min <= snake.head.ycor() <= y_max):
        scoreboard.game_over()
        is_running = False

    # self collision
    for seg in snake.segments[1:]:
        if snake.head.distance(seg) < 10:
            scoreboard.game_over()
            is_running = False

screen.exitonclick()
```

Run the game:

```bash
python3 main.py
```

### Edge cases to consider

- Reverse turn (Left -> Right): ignored by direction guards
- Food spawning on snake: rare; can be fixed by resampling if desired
- Ultra fast loop: cap minimum delay to keep it playable
- High DPI screens: Turtle coordinates scale fine; keep grid at 20

---

## Optional: Wrap Mode (no walls)

Replace the wall collision block with wrapping logic in `main.py`:

```python
# wrap around edges instead of game over
if snake.head.xcor() > x_max:
    snake.head.setx(x_min)
elif snake.head.xcor() < x_min:
    snake.head.setx(x_max)
if snake.head.ycor() > y_max:
    snake.head.sety(y_min)
elif snake.head.ycor() < y_min:
    snake.head.sety(y_max)
```

Remove the previous wall-collision game over block.

## Optional: Pause/Restart

Add to `main.py` after controls:

```python
is_paused = False

def toggle_pause():
    global is_paused
    is_paused = not is_paused

screen.onkey(toggle_pause, "space")

# for restart, replace game over logic with reset:
# scoreboard.reset(); snake.reset(); SPEED = 0.1; is_running = True
```

You’ll also need to check `is_paused` inside the loop:

```python
if is_paused:
    screen.update()
    time.sleep(0.05)
    continue
```

## Enhancements to Try Next

- Persistent high score (save to a file)
- Multiple food types (bonus, poison)
- Levels and obstacles
- Fancy theme (gradients, custom sprites via shape registration)
- Sound effects (simple beeps using winsound on Windows or playsound library)

## How to Run (Linux)

```bash
# from your workspace root
cd snake-game
python3 main.py
```

If Turtle window doesn’t appear, make sure you’re not in a headless environment and Tkinter is available (usually included with Python on most distros).

## OOP Design Notes

- Each class owns its state and behavior; `main.py` orchestrates interactions.
- `Snake` encapsulates movement and growth; direction changes are guarded to preserve game rules.
- `Food` uses simple grid alignment to avoid half-cell placements.
- `Scoreboard` manages score and high score rendering, independent of game logic.

## Conclusion

You’ve built a complete Snake game using Python and Turtle with clean OOP structure. From here, customize the rules and appearance to make it your own. Happy coding!
