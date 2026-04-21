
Stacks in C++ follow the standard template of Last-In First-Out(LIFO)

![[Stack-template 1.png]]

Templates are defined in a `header(.h)` file so they also require the basic `#ifndef, #define, #endif` namespaces to ensure there is only one instance of it at all times.

First we will create a template of `typename T` that will be used within our class.
```
template<typename T>
class Stack 
{
	
}
```

The template T serves as a placeholder for when we identify a certain data type within the `.cpp` file later

Next we need to add public data members that define the functions within the class

```
const T& top() {return stack.front();}   // return the top element of the Stack
```

This line declares a const type T method called top that will return the top element of the stack. 

Next we will look at ho to push elements to the stack
```
void push(const T& pushValue) {stack.push_front(pushValue);}  // push an element onto the Stack
```

This method takes in a parameter of type T and calls it `pushValue`. The method then uses `stack.push_front(pushValue)` in order to push the element onto the stack.

In order to pop an element off the stack we just need to use the member function 
```
void pop() {stack.pop_front(); }  // pop an element from the stack
```

Notice how there is to type T here as all we are doing is removing the current element from the stack.

To prevent our program from crashing we ned to add a boolean that will keep track of the size of the stack and return rue if the stack is empty

```
bool isEmpty() const {return stack.empty(); }  // determine whether Stack is empty
```

The `const` keyword is used to notify the program that this boolean does not modify any existing data. Rather it is purely used as an exit case to break out of a loop.

For our final public data member we will create a method that returns `stack.size`

```
size_t size() const {return stack.size();}  // return size of Stack
```

Two main things to note here is how we reincorporated the type T template identifier as the stack needs to know what data type the stack is in order to determine its size. Secondly, we need to make the size a `const` value so we can be sure the size wont change accidentally as the program sees it as a read-only data type.

Moving on to our private data members we will only require one for this template:

```
std::deque<T> stack; // internal representation/container of the Stack from Standard
```

This line is the most important throughout the whole template. `deque` allows for adding and removing from the stack ensuring that it keeps its O1 time complexity no matter how many elements are on the stack. The reason it is private is to prevent user from messing with the data within the stack. Rather they must go through the process of pushing and popping from the stack in order to reach the desired data.

|**Component**|**Role**|
|---|---|
|**`std::deque`**|The storage "bucket" that handles the memory.|
|**`push/pop`**|The "gatekeepers" that ensure data only enters and leaves from the front.|
|**`size/isEmpty`**|The "sensors" that report on the status of the bucket.|
|**`template<T>`**|The "mold" that allows this bucket to hold any type of data.|