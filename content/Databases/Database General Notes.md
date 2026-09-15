---
"title:": Database Notes
tags:
  - indevelopment
---
# Classes

- For naming a class use CamelCase some examples include:
	- CustomerOrder
	- ArtWork
	- SchoolFaculty
	- PhoneSpecifications
- Class names should be a single noun such as Customer, Order, or Vendor
- The first character of a class name must be capitalized
- Definition informs the reader on the meaning rather than what it does
- Generally you start a definition more general and gradually ger more specific the longer it gets
	- i.e. "Department" might be defined as "An organization that offers one or more degree programs within a college, within a university.  For instance, the Computer Engineering Computer Science (CECS) department is part of the College of Engineering within California State University Long Beach."
	- this starts general: organization, and gets more specific: department
	- Not all organizations are departments, but all departments are organizations
- Don't use any pat of the class name in the definition since this could make the definition circular, meaning you need to know what the class name is signifying to understand the definition
	- For instance, the definition of the class ArtWork could be "A work of art put on public display to provide inspiration to all viewers."  The use of "art" and "work" in the definition makes that definition circular.  You have to know what "art" is in order to know what "ArtWork" is.  A better definition for ArtWork would be "A visual display that the creator has constructed to convey an emotion, meaning, or concept to their audience."
- You can give examples instead to give an idea to the reader, in reference to the ArtWork class you could say: "Examples would include: paintings, sculpture, or light shows.". Be sure the examples aren't all inclusive however as there may be other instances of the class that don't fall into the the example categories
- Be sure to define what the class **is**, not what you can do with instances of that class.
- Don't include the uniqueness either as that would be captured in the Entity Relationship Diagram (ERD) if it is implemented in a relational database, or in the Moon Modeler model if it is implemented as a collection

# Attributes

- Attribute names differ slightly, the first letter must be a lowercase such as:
	- dateOFBirth
	- year
	- studentNumber
	- carModel
- When chosing an attribute name it is also important to separate the class name from the attribute name, for example: many of your classes will have a column called “name”.  The name of the attribute must be unique within the class, and nothing more.
- Attributes must be atomic, meaning they can only have one concept
- CECS 323 is not atomic as it contains the abbreviated department name and the course number itself
- Attribute values describe objects within a class, for example the chair attribute of the Department class signifies the faculty member currently serving as the department chair
- if the attribute is a unit of measurement be sure to specify the units
- any constraints the attribute may have also needs to be clearly stated with the best location being the attribute definition
- valid examples of valid attribute values would also help the reader understand the meaning
- similar to classes, attribute names cannot appear in the definition of the attribute as it would be circular
- for the attribute "name" in the Customer class the definition would need to be similar to: "A succession of printable characters that identifies the specific customer."
- don't put the specific data type of the attribute in the definition either as that will be handled in the graphical model
- the graphical model captures the data type while the definition describes the attribute tied to that data type
- placing it in the definition is redundant and also can lead to a data type mismatch if the definition calls for a different datatype than the graphical model

# Associations

## One to Many

- When naming a one to many relationship  it is important that the verb should read like a sentence in that context of the parent and child class
- for example: "Each Customer places zero or more Orders.” the parent is Customer the child is Order and the verb phrase is "places" meaning when you read it you see a singular object (the customer) doing a possible multitude of actions (places) so in this case the customer (one) places (many) zero to one orders. it is also important to make the verb phrase active

## Many to Many

- given how dynamic many to many naming conventions can be thee is no real correct solution, rather, pick a verb phrase that reads well from left to right

# Entity Relationship Diagrams/Physical Database

- Table naming conventions apply to MongoDB collections as well.
- Column naming conventions apply to MongoDB fields as well.
## Chartmanship

- Be sure to put the entities (table names) above, or if not, to the left of the child so as to make it easier to read
- avoid crossing relationship lines where possible as well
## Table and Column Names

- use "snake case"
	- pun and underscore `(_)` between each word
	- convert UML names to all lowercase
- Be sure to keep the names as close to its UML as possible
## Table Names

- Use plural nouns for table names while being in line with the UML class names
- for example if a UML class name is Department the table name in the ERD would be departments
	- the main reason for plural naming is that the table is a set of rows
	- in contrast, a class represents a prototype for objects which are members of said class
## Constraint Names

1. Primary key constraints are named similarly to the table with "`_pk`" on the end
2. Uniqueness constraints (also called candidate keys) are named similarly to the table with "`_uk_XX`" on the end where XX is a two digit number that helps distinguish one candidate key from another within a given table
3. Foreign key constraints are named as follows
	- the name of the child table followed by "`_`"
	- Followed by the name of the parent table, followed by "`_fk_XX`"
	- Where the XX represents a two digit number to allow us to distinguish between several relationships connecting connecting the same parent to the same child
4. Check constraints are named after the table followed by "`_`" followed by a short phrase describing the constraints
	- for example a check constraint that ensures a students grade in a course never exceeds 4 may be named `enrollment_grade_maximum` if the table that stores the grade is called "enrollment"

# Questions to ask

1. Further elaborate on the naming conventions for foreign keys
2. clarify what it means to avoid crossing relationship lines
3. Further explain naming conventions for Many to Many
4. Describe Chartmanship in the context of table location near child nodes
5. give an overall definition to what an Entity Relationship Diagram (ERD) is
6. visually describe what it means to not qualify the attribute name with the class name
7. How will we use getters and setters once we start doing physical relations and database writing
8. explain many to many association classes better
9. Please better explain many to many with History
10. Better explains foreign key roles in recursion
11. Elaborate further on ERD diagrams in terms of recursion