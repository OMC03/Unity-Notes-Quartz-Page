---
tags:
  - DatabaseNotes
---
## Inheritance

When creating classes for a diagram you might notice that some of the attributes don't relate to the entire class but rather are used to determine certain attributes about said class. In this case you would need to create a sub class. The process of checking for sub classes from top to bottom is known as specialization.
- **Top-Down Design (Specialization):** Starts with a general class and discovers that certain attributes or associations apply to only some individuals. Specialized child classes are created to house those specific features.
    
- **Heuristic:** If multiple proposed classes have the exact same set of attributes, you likely have only one class type, not multiple.
- 
- **Example:** we will model the graduate students at a university. Some are employed by the university as teaching associates (TAs); some are employed as research associates (RAs); some are not employed by the university at all. For the TAs, we need to know which course they are assigned to teach; for the RAs, we need to know the grant number of the research project to which they are assigned. A first listing of the student attributes might look like this.

![[Pasted image 20260909195346.png]]

When using this class in practice one of these attributes will always be null, in some cases both will be null. Using sub classes can help removing the null values to ensure we only use them when they are present.

![[Pasted image 20260909195652.png]]

**NOTE:** The open arrow head is the subclass indicator that points to the parent class.

There is also a second process called bottom to top generalization. This can happen when two classes end up sharing many of the same attributes leading to the creation of a shared super class, a class or entity that represents a superset of other class types can also be called a generalization of the child types.
- **Bottom-Up Design (Generalization):** Starts with two or more distinct classes that share common attributes. Those shared attributes are factored out and placed into a single shared parent class (superclass).

- **Example(thanks to Martin Malolepszy):** A student had a summer job with a brush-clearing service. This is a fairly specialized business but an essential one in southern California, where dried plant growth (brush) can present a severe fire hazard if it is not cleared from around houses and other structures. In addition to his exhausting physical work, he built a small database to help the owner manage this business.
- **NOTE:** One important class type was the lot (or property) to be cleared. Some lots were in the city, with a standard street-and-number address. Other lots were not on a city street, but were described by the county surveyor's section and tract number. It seemed as if there were two class types.

![[Pasted image 20260909201305.png]]

Two attributes stand out in both classes, those being the owner and lot. The common attributes should go in a generalization or superclass that is simply called a “lot.” The relation scheme is identical in structure to the previous example.

![[Pasted image 20260909201509.png]]

With the diagrams created, you would notice that we don't have standard multiplicities, instead they use specialization constrains.

| **Dimension**    | **Option A**                                                                                                         | **Option B**                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Completeness** | **Complete:** Every single instance in the superclass must belong to at least one subclass.                          | **Incomplete (Partial):** An instance of the superclass can exist on its own without belonging to any subclass (e.g., a graduate student who is neither a TA nor an RA).    |
| **Exclusivity**  | **Disjoint (Exclusive):** An instance of the superclass may belong to **at most one** subclass (mutually exclusive). | **Overlapping:** An instance of the superclass can belong to **more than one** subclass simultaneously (e.g., a property identified by both city address and county tract). |

Wit inheritance better understood we can look at how this is used for Relational Schema & ERD Implementation
- **Table Structure:** Create a physical table for the parent class and a physical table for each child subclass.
    
- **Primary Key / Foreign Key Rule:**
    
    - The primary key of the superclass serves as both the **Primary Key and Foreign Key** (PK, FK) in the subclass table.
        
    - Because the link is $1 \leftrightarrow 0..1$, no separate surrogate key is used for the child table.
        
- **No Multiple Inheritance:** A subclass can have only **one** superclass in relational design to prevent primary key conflicts.
    
- **Constraint Enforcement:** Relational schema structures cannot natively enforce complete/incomplete or disjoint/overlapping constraints; enforcement is handled through business logic or application-layer validation.
    
- **Querying:** Outer joins (or unions of outer joins) reconstruct complete polymorphic records across the parent and child tables.

Below are the corresponding tables to the two above examples:

**Graduate Student Model**
![[Pasted image 20260909202445.png]]

**Property Lot Model**
![[Pasted image 20260909202526.png]]

**NOTE:** Since a given class can never be a subclass to more than one superclass, it is important to choose the superclass with care. Remember that the subclass is an instance of the superclass. Do not use subclassing as nothing more than a slick way to inherit attributes or associations from the superclass. The subclass should be a special case of the superclass. In Object Oriented programming, any instance of any of the subclasses of a given class should be able to participate in any of the operations that the superclass can. This is the essence of polymorphism.
## Recursion

**Core Concept: What is a Recursive Association?**
- **Definition:** An association that connects a single class to itself, where instances of that same class participate in different roles (e.g., one employee acting as manager, another acting as subordinate).
    
- **The Anti-Pattern:** Creating two separate classes (e.g., `Employee` and `Manager`) or using subtyping when the only differentiating factor is an internal reporting line.
    - Duplicating entities causes synchronization errors and redundant data.
        
    - Subtyping is unnecessary when a role is purely situational and involves no unique standalone attributes.

In short, a **recursive association** connects a single class type (serving in one role) to itself (serving in another role). The below class showcases the incorrect way to showcase a manager and employee class relation
![[Pasted image 20260909205758.png]]

As mentioned above, this is wrong because a manger is also an employee, meaning that this guarantees duplicate data and can cause complications further down the road. Rather than having two classes that can cause duplicates we can have a class reference itself recursively, clearing up the duplicates and simplifying the process as shown in the diagram below.

![[Pasted image 20260909210321.png]]

Note how we have  verbal phrase going in each direction, this is to show how many people a manager can supervise and how many managers an employee can have.

Here is a breakdown of one to many recursion

Used when a subordinate can have **at most one** direct manager, but a manager can supervise many subordinates.

- **Multiplicity Constraints:**
    
    - Manager role (Parent side): **$0..1$** (An employee reports to at most one manager, or zero if they are the CEO/top-level executive).
        
    - Subordinate role (Child side): **$0..\!*$** (An employee may supervise zero subordinates if they are not a manager, or many subordinates).
        
- **Role-Based Verb Phrases:**
    
    - Standard UML associations usually require a verb phrase in only one direction.
        
    - In recursive associations, write **explicit verb phrases in both directions** to clarify the distinct roles (e.g., `"supervises"` from parent to child, `"reports to"` from child to parent).
        
- **Relational Schema / ERD Translation:**
    
    - Represented within a single table using a self-referencing foreign key column (e.g., `reportsTo`).
        
    - **Nullability:** The self-referencing foreign key column **must be nullable** (`NULL`) to accommodate root instances that do not report to anyone (e.g., the CEO).

So far we have looked at One to Many relation ships regarding recursion, however, it is possible to have a team where employees speak to many managers. This can be demonstrated in the diagram below.

![[Pasted image 20260909211417.png]]

Here is a short break down of many to many recursion:

Used when an employee can report to **multiple managers simultaneously** (matrix management) or when tracking a **historical timeline** of managerial assignments.

- **Intermediary Association Class / Entity:**
    
    - Introduce an explicit linking entity (e.g., `Supervision`).
        
    - Both incoming foreign keys originate from the same parent table (`Employees`).
        
- **Role-Naming Foreign Keys:**
    
    - Because both foreign keys reference the same parent table, they must be given distinctive role names in the child table (e.g., `manager_number` and `employee_number`).
        
- **Managing History with a Discriminator:**
    
    - **Without History:** Primary Key is composite: `(employee_number, manager_number)`. An employee can report to a specific manager at most once ever.
        
    - **With History:** Primary Key includes a temporal discriminator: `(employee_number, manager_number, start_date)`. This allows an employee to work for the same manager across multiple distinct time spans.

To summarize further here is a table break down of the two main topics

|**Feature**|**1-to-Many Recursive (Hierarchical)**|**Many-to-Many Recursive (Matrix / History)**|
|---|---|---|
|**Business Rule**|Each employee reports to at most one manager.|An employee reports to multiple managers or over multiple time periods.|
|**Number of Tables**|1 (`Employees`)|2 (`Employees`, `Supervisions`)|
|**FK Placement**|Nullable `reportsTo` column inside `Employees`|`manager_number` and `employee_number` inside `Supervisions`|
|**Primary Key Composition**|Single PK (`employeeNumber`)|Composite PK (`employee_number`, `manager_number`, `startDate`)|
|**Self-Join Structure**|Single `LEFT OUTER JOIN` on aliased table|`LEFT OUTER JOIN` bridging to child table, then `INNER JOIN` back to parent alias|
