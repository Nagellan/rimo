# Rimo

I use [Visitor pattern](https://refactoring.guru/design-patterns/visitor) for separating widgets and their render logic. That's why there is a `CanvasRenderer` class responsible for drawing widgets on a canvas, and each widget supports `accept` method for drawing. It allows us to have multiple rendering strategies and change rendering method in a future.

I use [Bridge pattern](https://refactoring.guru/design-patterns/bridge) for separating abstraction and implementation — widgets and their styles. It allows us to extend styles without touching any widgets logic.

I use [Builder pattern](https://refactoring.guru/design-patterns/builder) for building widget styles. It allows us to make rich configuration of styles without frustration.

I use Flux architecture for providing communication between canvas and its user. It allows to send events through a dispatcher which reacts on event and modifies user's state accordingly.
