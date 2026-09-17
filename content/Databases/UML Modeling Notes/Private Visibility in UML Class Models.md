---
tags:
  - DatabaseNotes
---
## Introduction

- You can set attributes of a UML class to private by denoting a `-` before the denoted attribute name. Examples include:
	- - pizzaName
	- - slicePrice
	- - carModel
	- - studentNumber
- Doing this allows for these attributes to only be accessed by methods within the class itself
- Generally it is best practice to protect the state of a class by making all the associated attributes private values of that class
- With this the only reliable way to change the value of a private attribute is with getters and setters
- Where getters return the value of a given attribute and setters initialize the requested change
## Rationale for Getters and Setters

Object Oriented (OO) languages such as Java and C++ regularly enforce getters and setters due to direct field access creating tight coupling throughout the program where for example if an attribute changes from a stored field to a dynamic calculation, direct field access breaks every client relying on variable access syntax (simply meaning calling the variable from the class), requiring them to update their code to call a function instead. Getters and Setters allow for an abstraction layer between the class variables and the updated values it receives over time. 
- Validation: Setters act as gatekeepers to enforce domain rules and boundary conditions-such as rejecting negative values for age, out-of-range dates, or invalid formatted strings-preventing the object from entering an illegal state
- Computed Properties: Getters and Setters also allow for altering computed values without needing to change the public methods themselves, such as re calculating density behind the scenes
## Alas Python

(Instructors Thoughts on Python)
That having been said, all of the above gets a little fuzzy with Python since Python has no strong encapsulation of any of its attributes or methods.  I'm sure that a "Pythonista" programmer would be able to expound at length on why that's such a great idea, but I just think it's a bit lame.

Be that as it may, we are going to always use the private visibility in our UML models in acceptance of generally accepted good design practice, even though the OO platform that we happen to be using doesn't explicitly support visibility of the attributes and methods.  Sort of lame, I know, but nothing in life is perfect, even in computer science.
