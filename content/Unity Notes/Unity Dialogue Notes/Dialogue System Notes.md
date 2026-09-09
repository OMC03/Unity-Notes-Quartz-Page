---
tags:
  - indevelopment
---
> [!warning]+ Disclaimer > Before Starting Dialogue System
>**Disclaimer: Before starting with these set of notes it is assumed that you have a basic knowledge of the Unity Engine/C# scripting and a basic understanding of Object Oriented Programming.**
## Dialogue Script

When doing Object Oriented Programming in Unity there are two main components used in its implementation. The `Instruction(Logic)` and the `Information(Data)`. The instructions are used to tell the scripts and unity engine how to behave/act. While the information is used as a foundation for the instructions supplying the needed data to carry out the requested tasks.

This particular Dialogue script is heavily focused on a visual novel type of game. As such, certain features will be implemented so that they can be set in the editor rather through code  allowing for the developer to decide when certain events take place throughout the story.

Given that this is the `data` section of our dialogue system we start this script by removing the `MonoBehaviour` extension and rather include  `[System.Serializable]` above the class declaration.

```
[System.Serializable]
public class Dialogue
{

}
```

`[System.Serializable]` is used as a way to allow a classes public variables to be edited within the inspector. An important note here is the difference between public variables in Unity and a public class in Unity.:
- When variables are public other scripts are able to "look into" the Dialogue script and access the data within those variables
- When a class is set to `[System.Serializable]` rather than just having a script access the public data members, this allows other scripts to rebuild the class itself when needed allowing for unique interactions and possibilities in each instance

| **Feature** | `public` **variable**      | `[System.Serializable]` **class**    |
| ----------- | -------------------------- | ------------------------------------ |
| **Purpose** | Access from other scripts. | Visibility/Saving in the Inspector.  |
| **Scope**   | One single variable.       | An entire blueprint/template.        |
| **Analogy** | A "Public" sign on a door. | A manual on how to rebuild the room. |

Now that the class has been created and is serializable we can start simple by adding a public string variable that will hold the speakers name

```
public string name;
```

##### Dialogue Text

In order to display our character's dialogue, decide when this section of dialogue should end, and be able to easily change it in the future we will create an array of strings called `sentences` and a boolean called `isEndpoint`.

```
public string[] sentences;
public bool isEndPoint; // Only check this for the VERY last dialogue of the scene
```

The current setup will provide the following result.

![[Senetences-array.png]]

To make the text box within each array element resemble a dialogue box we need to add a **Decorator**. In Unity a Decorator can modify how the variable is handled by the inspector without changing its type. Without it, you would only be able to see the first line of dialogue you are typing while the rest moves out of sight.

`[TextArea(3, 10)]` Will expand the string array elements text box to be 3 lines high and have it be able to go up to 10 lines before a scroll bar is created. 

The set up should now look as follows

![[expanded-sentences-array.png]]

##### Dialogue Sprites

Lets now move onto the sprite set up. In the game I am making I have four characters:

```
    [Header("Sprite Setup")]
    public Sprite char1;
    public Sprite char2;
    public Sprite char3;
    public Sprite char4;
```

The sprite values will now appear within the script as shown below. We can then be able to later change the sprite based on which instance of dialogue we are on.

![[sprite-setup.png]]
**Note:** The way this dialogue system is being set up allows for multiple instances of the same script to call each other through a series of triggers. This allows for the sprites to be changed depending on which line of dialogue you are on.

##### Dialogue Scene Swap

Since we are making a dialogue system we need a variable that will hold the name of the scene we would transition to next following the end of the current dialogue.
```
public string nextSceneName;
```

Here it what you should have in the inspector

![[scene-swap.png]]

##### Dialogue Sprite Position

We will also be making our character sprites move across the scenes during certain dialogue lines. Preparing for this, we need a default position that the sprites will be in so as to not need to adjust them for every instance:
```
public float char1X = 232f;
public float char2X = -245f;
public float char3X = 735f;
public float char4X = -739f;
```
**Note:** The values set here are for my specific setup and screen width/height. It is best to change them to align with whatever game you are making.

##### Dialogue Next Trigger

We will also need a trigger where we store the next instance of dialogue. This creates a set of linked components where the dialogue will play in order.

```
public DialogueTrigger nextTrigger;
```

Here is the view in the inspector
![[next-dialogue-trigger.png]]

##### Dialogue Choice Data

We have now completed all the data required for the main dialogue system. Next up is the data for the choices system, starting off we need a list in our `Dialogue` class that will reference the new class below it.

```
public List<ChoiceData> choices; // This creates a list in your Inspector
```

Next we need to create a new class called `ChoiceData`. Remember to also add `[System.Serializable]`. 

The reason for creating a new class is partially for organization. However, if we leave all the features in one class we would be stuck with a linear time line and be unable to create branching storylines. By creating a separate class and creating a list of it in the original we are able to continuously add to it as well as deciding which dialogue options need a choice. It is also worth mentioning that C# doesn't matter the declaration order within the script, rather you choose where to use it within other scripts.

| **If you kept it in one class...**                                | **By using a second class (ChoiceData)...**          |
| ----------------------------------------------------------------- | ---------------------------------------------------- |
| You'd be limited to 1 choice per line.                            | You can have 0, 1, 2, or 20 choices.                 |
| The Inspector would be a messy list of "Choice1", "Choice2", etc. | The Inspector is an organized, expandable List.      |
| Harder to add choice-specific features later.                     | Easy to add "Choice Costs" or "Choice Sounds" later. |

Next we need to have a variable that will determine what the button says and a trigger to play the next dialogue trigger once a specific choice is selected.

```
public string choiceText;// What the button says (e.g., "Argue" or "Agree")
public DialogueTrigger linkedTrigger; // Where it goes
```

Lastly we will need another string that will once again hold the name of the scene we would want to transition to if we so choose.
```
public string nextSceneName; // Leave blank if staying in the same scene
```

Once these are in place and saved it should look like this in the inspector.

![[choice-element.png]]

## Dialogue Trigger Script

Now that we have the data of our dialogue system we need a way to bridge the gap between the Unity Inspector. This is also how we'll pass that data to the manager, so it can construct and run the dialogue system throughout the game.

To start we need to create a new script called `DialogueTrigger` it is also important to have this class extend `MonoBehaviour` so as it can be attached to a game object.

With this new class we will be able to call the Dialogue class as a public variable. 

```
public Dialogue dialogue;
```

This will rebuild the Dialogue script within the trigger script allowing for all the class to be fully editable for each instance.

Next we'll make a single function that starts this dialogue sequence by handing it off to the Dialogue Manager. This is accomplished by first searching the scene for a game object with a Dialogue Manager script on it. Then, call the Start Dialogue function within that script via an external UI component such as a button or on click, remember to also make the function public so that any class can access it. This all works because `Dialogue` is a serializable class, which is what allows it to be embedded as a public variable inside another script — like this one — giving each instance of `DialogueTrigger` its own fully editable copy of the dialogue data.

## Sprite Display Script

Moving onto the sprite display script this one is used to add more customization to the scenes within the game where sprites can move around the scene depending on what dialogue the game is on. This makes them feel more alive since normally all characters stay in their own positions and don't move aside from sprite swapping.

Starting off we first need a new import: `using UnityEngine.UI`. This allows us to use methods that manipulate UI elements in Unity.

We can now set the speed of the sprites sliding by initializing a public variable.

```
public float slideSpeed = 10f;
```

Following this we need to also initialize 4 animators which will hold the fade-in and fade-out animations for the sprites using a boolean in the animation controller called `isVisible`.

```
public Animator animGrace;
public Animator animEve;
public Animator animRory;
public Animator animRonen;
```

Which should look similar to the image below. Note: this image has all properties already filled out you must manually assign each animator and image component for the sprite display to function correctly

![[sprite_display.png.png]]

Now comes the most important piece of this sprite system, that being the coroutine that allows for a smooth transition between dialogues. 

```
public RectTransform leftSlot, centerleftslot, centerrightslot, rightSlot;
```

In summary, a `Coroutine` in Unity is a function that can run across multiple frames instead of finishing instantly. Because sliding a character into place takes _time_, it has to be a coroutine. But if a new dialogue line comes in _before_ the last slide finishes, we need a way to stop the _old_ slide first — otherwise you'd get two competing movements fighting over the same slot. By storing a reference to each ones currently running coroutine we can cancel them on demand.

Now that everything has been initialized we can create a single public function that will act as a bridge that we can call in order for the sprites to move when we want them too.

```
public void UpdateStage(Dialogue dialogue)
```

It is important to note that the parameter we use is the dialogue class we made previously. This is where we hold all of the sprites actual images, and current/future positions.

Within this function we will call a separate private one 4 times which represents each one of our games 4 different characters.

```
HandleActor(leftSlot, dialogue.Grace, dialogue.graceX, animGrace);
HandleActor(centerleftslot, dialogue.Eve, dialogue.eveX, animEve);
HandleActor(centerrightslot, dialogue.Rory, dialogue.roryX, animRory);
HandleActor(rightSlot, dialogue.Ronen, dialogue.ronenX, animRonen);
```

Since these reference parameters pull from the dialogue class we created using `[System.Serializable]` each instance of dialogue has already determined which sprites will be used for that part of the scene meaning all we need to do is move the spite around.

Lets now dive into the `HandleActor` class. Here is where the logic behind each instance of the sprites happen. 

```
private void HandleActor(RectTransform rt, Sprite charSprite, float targetX, Animator anim)
```

This function starts with each of our initialized variables which will update each time the `UpdateStage` function gets called.

To shorten the logic behind sprites being labeled as present or absent we check if a sprite container is null or not allowing to simply fade out a character by removing their sprite in the following dialogue instance.

```
bool shouldShow = charSprite != null;
```

We then get the image component assigned to this script so we can swap the sprite and toggle it on and off

```
Image img = rt.GetComponent<Image>();
```

It is worth noting that the order of the boolean followed by the image component call doesn't matter as the boolean solely checks for if the sprite variable is null or not while the image component is a completely separate game object

Now that the local variables have been initialized we need to link the `isVisible` boolean from the animation controller to the local `shouldShow` boolean

```
if (anim.GetBool("isVisible") != shouldShow)
    anim.SetBool("isVisible", shouldShow);
```

This makes it so that the sprite only updates wen the two Booleans differ. This prevents re activating the fade animation by accident or when it shouldn't be. In other words the `UpdateStage` function can be called multiple times and not have to worry about replaying the animation unless there is an actual change such as being on a different dialogue trigger.

Now we need to make the sprite appear and disappear based on the value of the `shouldShow` boolean.

```
if (shouldShow)
{
    img.sprite = charSprite;
    img.enabled = true;

    StopSlotMovement(rt);

    StartSlotMovement(rt, targetX);
}
else
{
    StopSlotMovement(rt);
    
    StartCoroutine(DisableImageAfterFade(img, anim));
}
```

If the boolean is true we first assign the sprite of the current dialogue trigger to the image component so it reflects in the scene. We then enable the image if it was false (if it is already enabled nothing happens here). Next we need to stop the image components movement which will prevent stutter and allow for the next line to start a new movement action if the positions differ between triggers. Otherwise if the boolean is false the script instead will stop the sprites current movement then start a delay using a coroutine to disable the image after the fade animation have completed.

Now that we have the logic of how the `HandleActor` function works we are going to look at how each helper function within it is made.

```
private void StopSlotMovement(RectTransform rt)
{
	if (rt == leftSlot && leftMove != null) StopCoroutine(leftMove);
	if (rt == centerleftslot && centerLeftMove != null) StopCoroutine(centerLeftMove);
	if (rt == centerrightslot && centerRightMove != null) StopCoroutine(centerRightMove);
	if (rt == rightSlot && rightMove != null) StopCoroutine(rightMove);
}
```

Starting off, the only parameter needed for this method is a `RectangleTransform(rt)` because the script doesn't know which character `HandleActor` is currently handling, so instead we use the position the character is in which we assigned in the inspector using each image components rectangle transform values. Following this we check each slot individually by first confirming that the rt value is equal to one of the four we initialized in this script, then we make sure the the image component isn't currently moving. This prevents potential errors where if the sprite hasn't been activated yet the game would stop a coroutine that never started. once these checks are passed only then does the coroutine stop leaving the sprite to end up at its destination.
**NOTE: when the `StopCoroutine` method is called it doesn't go back to null, rather it is dead, meaning the value is paused. This is ok as the following method `StartSlotMovement` will overwrite it with a new reference**

```
private void StartSlotMovement(RectTransform rt, float targetX)
{
	if (rt == leftSlot) leftMove = StartCoroutine(SlideRoutine(rt, targetX));
    else if (rt == centerleftslot) centerLeftMove = StartCoroutine(SlideRoutine(rt, targetX));
    else if (rt == centerrightslot) centerRightMove = StartCoroutine(SlideRoutine(rt, targetX));
    else if (rt == rightSlot) rightMove = StartCoroutine(SlideRoutine(rt, targetX));
}
```

Similar to the previous function, we first need to check if the rt is correct to the position specified. along with this we need an extra parameter which will be the target position the sprite is going to move too which we set the value for within each instance of a dialogue trigger. Now that the parameters are assigned and the checks have passed, lets see what the main use for this function is.

```
leftMove = StartCoroutine(SlideRoutine(rt, targetX));
```

For the sprite to move when specified we will assign a coroutine to each of the ones we initialized in the beginning of our script. This will start a coroutine based around an `IEnumerator` that will be shown below. It is worth mentioning that within the parenthesis is a paused enumerator. This will only activate since the `StartCoroutine()` method is called which is directly after the parameter is initialized. Starting a coroutine means handing to Unity's scheduler which is what starts it. This also returns a coroutine which is stored in the `leftMove` variable. This allows us to overwrite what ever was previously stored (i.e. `StopSlotMovement`).
**NOTE: the if else sequence in `StartSlotMovement` compared to a series of if statements in `StopSlotMoveent` is irrelevant given the small scale use either series would produce the same result with minimal difference**

```
IEnumerator DisableImageAfterFade(Image img, Animator anim)
{
    yield return new WaitForSeconds(0.5f);

    if (!anim.GetBool("isVisible"))
    {
        img.enabled = false;
    }
}
```

Now lets take a look at the `IEnumertor` that handles the sprite disappearing. We use an enumerator because we need to wait for the fade animation to finishing playing otherwise the sprite will pop out of existence. Once we start the coroutine the scheduler runs into the line `WaitForSeconds` which pauses the code execution within the enumerator for the specified time of 0.5 seconds where within this time span the fade animation can complete. However, one small weakness is since it is a hardcoded number if the animation was lengthened there could be a mismatch during gameplay. Once the delay has completed, we use the image component of the character along with their animator to determine whether disable the image. We first need to check to make the the `isVisible` boolean is false to ensure that the image doesn't fade when its not supposed to, once that is confirmed we can set the image component to false as well effectively nullifies the game object entirely and any scripts it may be running. 

```
IEnumerator SlideRoutine(RectTransform rt, float targetX)
{
    Vector2 targetPos = new Vector2(targetX, rt.anchoredPosition.y);

    while (Vector2.Distance(rt.anchoredPosition, targetPos) > 0.1f)
    {
        rt.anchoredPosition = Vector2.Lerp(rt.anchoredPosition, targetPos, Time.deltaTime * slideSpeed);
        yield return null;
    }

    rt.anchoredPosition = targetPos;
}
```



## Dialogue Manager Script

Input Text Here

## Dialogue Choice Script

Input Text Here (TEST)

## Pop Text Script

Input Text Here
