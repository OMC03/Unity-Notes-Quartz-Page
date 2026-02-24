## Getting Started

**Here is a tutorial to get started with setting up Unity and learning the interface, along with my git hub repository on this project and an export if you would like to play it for yourself**

> [!help]- Video > Getting started with Unity
> <iframe width="560" height="315" src="https://www.youtube.com/embed/Ii-scMenaOQ?si=xKUqHmxUaTaxp2QC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> [!important]- Resources > Check out the Assets
>Here is the link to my Git Hub Repository
>[OMC03/2D_Platformer_Game](https://github.com/OMC03/2D_Platformer_Game)

> [!done]- Product > Play the Game!
>Here is a link to download my first export
>https://drive.google.com/file/d/1PvZnZwmh3xsn-uK8Ju4sedGtel3NbsDS/view?usp=drive_link

**Level 4 Gameplay**
![](https://raw.githubusercontent.com/OMC03/2D_Platformer_Game/main/Screenshots/2D_Platformer_Game_lvl4.gif)

## Tile Maps

Creating Tile Maps
https://youtu.be/QkbGr1rAya8?feature=shared

If you are given sprites that you can use for a tile map, you can slice them to turn them into "puzzle pieces". To do this set the pixels per unit value to 16 (this is mainly for pixel art and those types of games, you can set it to fit your needs). Once you do that you must set the sprite mode to multiple which will allow you to slice the image into 16 x 16 pieces. Click on the sprite editor and use the drop down menu on the top left. Set it to "Grid By Cell Size" and set the values of the x and y pixel size variables to 16 to slice the Image. You can do this to all premade sprites that are given to allow you to create the world how you want.

To create the tile map, right click the hierarchy an go to, 2D Object>TileMap>Rectangular. This will create a tile map object. To open it go to Window>2D>Tile Pallet. Once there create a new tile pallet save it to your folders and drag and drop the recently sliced sprites you plan to use as terrain into the tile pallet. The sprites will load into the pallet and be divided based on how you sliced them, you can then use the tools given on the top to draw out your world how you see fit.

This same method can be used to add a background to your game. The only difference will be to create a second tile pallet. Remember to create a sorting layer for your background and terrain. Place the background layer above default and the terrain layer below it. This is so they will be layered correctly.

Lastly in order for our terrain to be used properly we must add a "Tile Map Colider2D". This will give our terrain a hit box which can be configured to your liking . As a way to save memory we can also add a "Composite Collider 2D" which will convert our terrain into one large hit box. We also have to set the Rigid Body of the tile map to static. This lets it float while still allowing physics to act on it.

## Player
### Creating the Player

![[2D_Platformer_Game_lvl1.png]]

In order to create a player for your game you must right click the hierarchy and go to 2D Object>Sprites>Square. This will create a square on your scene view. In the sprite renderer under the inspector tab you can place an image of a character which will act as your player in the sprite tab.

### Player Physics

To add functionality to our player we must add physics. after clicking on the player we add a new component named, "RigidBody2D" (2D games must use the 2D version or it will not work). We can also add a "BoxColider2D" which will give our player a hit box.  There are other functionalities you can to your player, the more you experiment the more you learn.

### Player Movement

Player movement and creation
https://youtu.be/Uv5tfMSKlnU?feature=shared

To allow our player to move we will need to add a new component to our player object in the form of a C# script. To add it right click the project window go to Create>C# Script. After adding it you can name it what you like and then open t to start coding.(As a side note you can create a folder where you can place all your scripts in to make it a little more organized).

If you are using visual studio you can add a tool tips menu when you code. To do this go to Edit>Preferences>External Tools, and set the External script editor to Visual Studio. Once that is done click on "Regenerate Project Files".

Every C# script will have `private void Start` and `private void Update` functions which can be configured or erased based on he purpose of the script. `Play` is only called once, when you hit the Play button, while `Update` is called once per frame. You can also print messages to the console by writing `Debug.Log("Hello, World");` This acts as a print statement and is used to help debug your code.

In order to jump we can use the following lines of code:
```
private void Update()
{
	if(Input.GetButtonDown("Jump"))
	{
		GetComponent<RigidBody2D>.velocity = new Vector3(0, 14, 0);
	}
}
```
This snippet of code will check if you pressed the key that is tied to Unity's input manager. It will then add velocity to the specified RigidBody in the given direction based on the values of the vector. The vector needs three inputs to know how to change the velocity of the RigidBody. These values are the x, y, and z positions. we can also use Vector2 for 2D games as it only requires the x and y values as parameters.

In order to save memory we are able to declare the RigidBody inside a variable in the start function. This makes it so the computer only needs to find the body once instead of every frame. To access the input manager go to Edit>Project Settings, and click on the Input Manager.

```
private RigidBoy2D rb;
```

We can then place the variable in the start function to get a call to our players rigid body
```
private void Start()
{
	rb = GetComponent<RigidBody2D>();
}
```

Now we can use the newly created variable to reference our vector.
```
private void Update()
{
	if(Input.GetButtonDown("Jump"))
	{
		rb.velocity = new Vector3(0, 14f, 0);
	}
}
```

In order to move left and right we will use the input managers built in system similar to how we jump. However, we cant just get a button down as it would be too clunky. Instead we get the axis on the horizontal plane between 1 and -1.

```
	float dirx = Input.GetAxisRaw("Horizontal");
```

We can place this line of code in our update function by our jump code.
```
private void Update()
{
	float dirx = Input.GetAxisRaw("Horizontal");
	rb.velocity = new Vector2(dirx * 7f, rb.velocity.y);

	if(Input.GetButtonDown("Jump"))
	{
		rb.velocity = new Vector3(rb.velocity.x, 14f, 0);
	}
}
```
We also have to replace the 0 in the jump code to the current direction on the x axis and replace the 0 in the movement code to the current direction of the y axis. This is because it will check every frame for our input and if it is set to 0 it will reset our movement. We also have to add "Raw" at the end to make it act more like a 2D game.

Although we have created our movement it is not good practice to hard code values. Instead we can create variables with serialized fields which will allow us to edit these values in the unity inspector.

```
[SerializeField] private float moveSpeed = 7f;
[SerializeField] private float jumpForce = 14f;
```

Now that we have these variables we can replace the hard coded values in our movement code.
```
private void Update()
{
	float dirx = Input.GetAxisRaw("Horizontal");
	rb.velocity = new Vector2(dirx * moveSpeed, rb.velocity.y);

	if(Input.GetButtonDown("Jump"))
	{
		rb.velocity = new Vector2(rb.velocity.x, jumpForce);
	}
}
```

Now when you go back to unity there will be two new values added to the movement script component, where you can change the values much quicker.

You can also get the values to appear in the editor by using public variables instead of private. However this will expose more than we would like for other scripts so it is better to use serialized fields for certain values.

You also have to freeze the rotation on the z-axis for the player object or else it will roll off the side of the platform. To do this go to the players rigid body, click on constraints, and check the box.

### Player Animations

![[2D_Platformer_Game_lvl2.png]]

Player Animations
https://youtu.be/GChUpPnOSkg?feature=shared

Player Animations Continued
https://youtu.be/65E-q0JxYwU?feature=shared

To create the animations of our player we will need to right click the projects window and go to Create>Animation. This will add a new file which we can drag and drop onto the player object. Once we do that we can double click the animation file we created (Be sure to click the player object once the window is open). We can now take our player idle animation file and drag it into the animation window. This will let us use the play button to preview the animation. In order to slow it down we need to change the sample rate which we can access by clicking the three dots on the right and selecting it (Remember to select the animation file and set it to loop time in order to play the animation continuously). we also need to drag and drop each individual picture of our animation in order for it to work.

After that is done we go to the animator window which can be accessed by going to Window>Animation>Animator. In the animator we can set  a boolean with the plus sign on the left and name it running.  Then, make a transition from the running animation to the idle animation and vice-versa in the animator window by right clicking them and clicking make transition. when you click the arrow that goes from idle to running add the parameter you created and set it to true. Then click the other arrow and add the same parameter but set it to false (Remember to uncheck has exit time and set the transition duration to 0).

In our player movement script we can now set it up to transition between our animations properly. We first must get a reference to our animator boolean. 

```
private Animator anim;
```

 We can then place the variable in the start function to get a call to our players animation states.
```
private void Start()
{
	anim = GetCompoonent<Animator>();
}
```

We can now create a function that will hold our animation code to make it more organized.
```
private void UpdateAnimationState
{
	if (dirx > 0f)
	{
		anim.SetBoool("running", true);
	}
	else if (dirx < 0f)
	{
		anim.SetBool("running", true)
	}
	else
	{
		anim.SetBool("running", false);
	}
}
```

Lastly we call it in the update function
```
private RigidBoy2D rb;
private Animator anim;

private float dirx = 0f;

private void Start()
{
	rb = GetComponent<RigidBody2D>();
	anim = GetCompoonent<Animator>();
}

private void Update()
{
	dirx = Input.GetAxisRaw("Horizontal");
	rb.velocity = new Vector2(dirx * 7f, rb.velocity.y);

	if(Input.GetButtonDown("Jump"))
	{
		rb.velocity = new Vector2(rb.velocity.x, 14f);
	}
	
	UpdateAnimationState();
}

private void UpdateAnimationState
{
	if (dirx > 0f)
	{
		anim.SetBoool("running", true);
	}
	else if (dirx < 0f)
	{
		anim.SetBool("running", true)
	}
	else
	{
		anim.SetBool("running", false);
	}
}
```
We have now added the code that will trigger the running animation anytime the players velocity is not zero.  You will notice how our player however, still faces to the right no matter which way we walk. In order to fix this we will need a call to our sprite renderer.

```
private SpriteRenderer sprite;
```

 We can then place the variable in the start function to get a call to our players sprite renderer.
```
private void Start()
{
	sprite = GetComponent<SpriteRenderer>(); 
}
```

Lastly once this is done we must flip the player sprite when we walk backwards.
```
private void UpdateAnimationState
{
	if (dirx > 0f)
	{
		anim.SetBoool("running", true);
		sprite.flipX = false;
	}
	else if (dirx < 0f)
	{
		anim.SetBool("running", true)
		sprite.flipX = true;
	}
	else
	{
		anim.SetBool("running", false);
	}
}
```

Now that we have a proper running and idle animation we will need to incorporate a jumping and falling animation. Once you have created the animations for jumping and falling we go into the animator and create new transition points. We will transition from idle to jumping, idle to falling, jumping to falling, jumping to running, and falling to running. Also remember to loop the falling and jumping animations.

Now you could go into the code and add more boolean parameters to switch between the different animation but, this could get very messy. Instead we will create and `enum` for our animations to fall under. (This is an optional step)

```
private enum MovementState { idle, running, jumping, faling }
```

By using an `enum` we create our own variables that can only be called by what we put it the braces.
Ex:
```
private MovementState state = MovementState.idle
```

One other thing to note is that the values you put inside the enum start from 0 and count up to one less than your last value. Basally since we have 4 variables they are labeled from 0 to 3 starting rom the left and goin to the right. This is similar to a normal array. Due to the enum we created unity will read it as an `int` value instead so we can remove the boolean we created. Instead we will create an `int` and call it state. Now we have to go to our transitions and for each one label the state transition we will make based on the int value the of our enum. As a side note we also have to set the sate to equals to make the animation transitions correct. 

Now that it is all set up we will go back into our code and redesign the animation triggers to fit this new method. Inside our `UpdateAnimationState` function we can add a new variable.

```
MovementState state;
```

This will call our enum and give a variable we can use. Next we can remove our boolean checks and replace them with our state variable and what animation we would like to play. We also don't want to have to call `anim.SetInteger` over and over as this can cause typos to occur. To fix this we will place it at the bottom of our function so it will be called only once.

```
private void UpdateAnimationState
{
	MovementState state;

	if (dirx > 0f)
	{
		state = MovementState.running;
		sprite.flipX = false;
	}
	else if (dirx < 0f)
	{
		state = MovementState.running;
		sprite.flipX = true;
	}
	else
	{
		state = MovementState.idle;
	}
	
	anim.SetInteger("state", (int)state);
}
```

Once that is complete our running and idle animations should be complete. Before we move onto jumping and falling lets look at `SetInteger` again.
```
anim.SetInteger("state", (int)state);
```

The arguments it takes refer to the integer variable we created in the animator, (Hence the " ") and the name of the variable we created in the function. The reason we added `(int)` before the variable name is to cast it into an integer variable that can be read by our enum.

The jumping and falling animations are slightly different. This is because we want our falling and jumping to activate when ever we are moving up or down in the y direction no matter the animation that is playing. We can do this by creating other if statement under our running and idle code.
```
if (rb.velocity.y > .1f)
{
	state = MovementState.jumping;
}
else if (rb.velocity.y < -.1f)
{
	state.MovementState.falling;
}

```

Due to imprecision in unity we need to take the y value transform component and  check if its greater than .1 or less than -.1 to allow fir correct transitions.

### Player Death

Player Collision and Death
https://youtu.be/ynH51MiKutY?feature=shared

In our game you can create a square sprite and add a trap of your choosing. If it came with animations you can incorporate that if you want. In order for our trap to kill us we need to add a box collider to it. After that we will need to set up a death animation for when we collide with it. You can follow the previous steps to create and animation. When you have finished that open the animator and be sure to make a transition from the any state block to the player death animation. Once you make the transition add a new parameter and be sure it is a trigger.  Rig it to the transition of player death.  After the animation is set up you will need to create a new C# script for the player death mechanic.

You can get rid of the `update` function and add an `OnCollisionEnter2D` function. 

```
private void Start()
{
	
}

private void OncollisionEnter2D(Collision2D collision)
{
	
}
```
To distinguish between our traps be sure to create a new tag called traps. This will make it so any game object with a box collider and their tag set to trap will kill you. Inside our collision function we will add an if statement to identify when we hit a trap.

```
private void OncollisionEnter2D(Collision2D collision)
{
	if (collision.gameObject.CompareTag("Trap"))
	{
		Die();
	}
}
```

In order for better organization we will add the death logic into a function that we can call from our collision function.

```
private void Die()
{
	rb.bodyType = RigidBodyType2D.Static;
	anim.SetTrigger("death");
}
```

Going through with what we just added, we have a reference to the body type of the player. When we touch a trap it is set to static to prevent us from moving. we have also triggered the death animation with a reference to the trigger we made in the animator. Recall that we must get a reference to our rigid body and animator in our script.

```
prvate RigidBody2D rb;
private Animator anim;

private void Start
(
	rb = GetComponent<RigidBody2D>();
	anim = GetComponent<Animator>();
)
```

Once this is set up we need one more function to allow the level to restart. In order to do this we need an other namespace.

```
using UnityEngine.SceneManagement
```

This allows us to edit the scenes in our game which will come in handy down the line as well. With the namespace added we can now add a new function to our script to restart the level.

```
private void RestartLevel()
{
	SceneManager.LoadScene(SceneManager.GetActiveScene().name);
}
```

The line of code inside this function will reload the currently active scene and start it from the beginning. For the level to restart there are many ways to call the function but if you would like a delay you can trigger it at the end of the death animation by adding an animation event. Drag the cursor to roughly one second after the death animation and click on the animation event button. Afterwards select the `RestartLevel()` function from the drop down menu. This will allow the level to restart about a second after you die. 

You may also notice how the death animation doesn't finish all they way. This may not always be the case but in the event it is you can fix it. Click on the record button in the animation window and drag the cursor to about 0.2 seconds after the animation finishes. Once that is done un-check the sprite renderer to make the player disappear entirely. Lastly, click the record button again to save your changes. When ever you create a trap remember to make it a prefab to be able to use it again.

### Double Jumping

Creating Player Double Jump
https://youtu.be/RdhgngSUco0?feature=shared

In order to add double jumping to our game we need to add a new boolean to our player movement script. As well as a double jump power variable

```
private bool doubleJump
private float doubleJumpPower
```

Once that is done we need to add an other condition inside our jumping if statement.

```
if (IsGrounded() || doubleJump)
```

This determines whether or not to execute the if statement, if we are grounded OR double jump is true.  If either are true it will activate our jump code allowing us to jump.

```
rb.velocity = new Vector2(rb.velocity.x, doubleJump ? DoubleJumpPower : jumpForce);
```

In this case once we have jumped the last parameter will determine our force of the jump. 

```
doubleJump ? DoubleJumpPower : jumpForce
```

This line of code means that if double jump is true we will use the `doubleJumpPower` variable to jump. If its not true we will instead use our normal jump force. Lastly we need to set the double jump boolean to the opposite of its current state in order to prevent our selves from jumping continuously.

```
doubleJump = !doubleJump;
```

Now we need to specify that double jump will be false when we are grounded and while we are NOT jumping.

```
 if (IsGrounded() && !Input.GetButton("Jump"))
{
    doubleJump = false;
}
```

If you would like to make it easier to change the double jump power you can make the variable a serialized field.

## Camera Controller

To make the camera follow the player you can nest it under the player object. The issue with this is  when you rotate the player the camera will go with it which may cause problems in the future. To work around this we can create our own camera controller script which will use transform components to follow it. We first have to get the transform component of the player.

```
[SerializeField] private Transform player;
```

This will create an empty box  in the camera controller script in the inspector where we can drag and drop the player game object and it will obtain its transform position. All we have to do no is to now is set the position of the camera to the position of the player in each frame so the `Start` function is not needed here.

```
private void Update()
{
	transform.position = new Vector3(player.position.x, player.position.y, transform.postion.z);
}
```

The vector 3 is used to obtain the position of our player on the x and y axis and to retain the cameras position on the z-axis. This is because the camera must be set to -10 or else you wont see the game.
## Is Grounded Check

Creating a ground check
https://youtu.be/LEUhxe9vUOM?feature=shared

Here we will learn how to make it so we can only jump while we are standing on the ground. This will prevent  us from jumping into the stratosphere. In our player movement script we will create a new boolean function. This is so it will return true if we are on the ground and false otherwise.

```
private bool IsGrounded()
```

We will also have to create a new variable which will reference the players box collider.
```
private BoxColider2D coll;
```

Remember to also assign it in the start function to be able to access the players collider.
```
private void Start()
{
	coll = GetComponent<BoxColider2D>();
}
```

Once we have created a variable with a reference to our players box collider we will head back to our `IsGrounded` function and add a line of code which will detect if we are standing on the ground.
```
private bool IsGrounded()
{
	return Physics2D.BoxCast(coll.bounds.center, coll.bounds.size, 0f, Vector2.down, .1f, jumpableGround);
}
```

Going through this line of code piece by piece we first call a `Physics2D.BoxCast()` which is the main argument which will determine whether we are on ground or not. Next, we need the center of our box collider which is given by `coll.bounds.center`, as well as the size of our collider which is `coll.bounds.size` we then pass a rotation for our box that we have created which is set to `0f`, this is so it will be on the same level as our collider. We then have to call a `Vector.down` with a value of `.1f` which will move our box down ever so slightly to allow it to identify when we have touched the ground by overlapping with the terrain. Lastly we call a layer we created in unity called Ground as a way to identify when we are on the ground. To create a new layer go to the terrain game object and select layer and click add new layer. Once you enter that menu use one of the empty layers and call it Ground. After you assign it to the terrain game object we need a serialized reference to our layer.

```
[Serializefield] private LayerMask jumpableGround;
```

This is how we obtain the variable which will be the last parameter of our `IsGrounded` function.  We will now have to call the `IsGrounded` function in the jump velocity code.

```
if(Input.GetButtonDown("Jump") && IsGrounded())
	{
		rb.velocity = new Vector2(rb.velocity.x, jumpForce);
	}
```

In order for this to work the last thing we need to do is to add the ground layer to our player object. When you go to the player movement script in the inspector there is a new variable where we can select the ground layer mask from the drop down menu. If you don't want to stick to the sides of your terrain you will need to add one more component called a Platform Effector 2D to the terrain object. Don't forget to un-check the use one way box and to check the use by effector box in the composite collider 2D.

## Item Collection

Creating Item Collection
https://youtu.be/pXn9icmreXE?feature=shared

In order to add collectable items to your game you will need to add a square sprite with the respectable item you would like to collect. If the collectable has an animation you can add that as well. If you are doing an animation be sure to set it to loop continuously throughout the game. In order to collect our collectable we will need to add a box collider and set it to is trigger. This will allow us to use it like a sensor so we can do stuff with it without a physical collision. In order to distinguish between our item and the rest of our game we can use a tag and apply it  to as many game objects that we would like to collect. To do this we click on the cherry game object go to tag and select add tag. Once there click the plus to add an other tag and name it how you like. We can now add a new C# script for our player. Once you name it and open it up remove the `Start` and `Update` functions. We will now add a trigger collision to detect our item.

```
private void OnTriggerEndter2D(Collider2D collision)
```

This will allow us to run this function once we come into contact with our item. Once that is done we need to determine if what we collided with is our collectable. To do this we will write an if statement in our trigger function.

```
if (collision.gameObject.CompareTag("Orange"))
```

In this example I am using an orange. Regardless of what is it must be the same spelling as the tag you created. Now that we have this if statement we need to destroy the item.

```
if (collision.gameObject.CompareTag("Orange"))
{
	Destroy(collision.gameObject);
}

```

This will remove the orange from the game when ever we come into contact with one. Next we need to add a variable that will keep track of our items, and we will initialize it at 0.
```
private int oranges = 0;
```

In order to increment our variable we will also need to ass `oranges++` to our if statement block.
```
private int oranges = 0;

if (collision.gameObject.CompareTag("Orange"))
{
	Destroy(collision.gameObject);
	oranges++
}
```

With this done you are able to collect your item along with having the variable increment by a factor of 1. To add more of your collectables to the game you can drag any object from the hierarchy into the projects menu and it will create a prefab for you to reuse. Next we will need to display our incremented variable.

Go to the hierarchy and right click then go to UI>TextMeshPro. This is a more advanced and editable text object offered by unity. This will create a canvas object with the TMP file nested below it. Inside the TMP file you can change the text to what you want it to say, in this case I put Oranges: 0. You can also download free fonts of your choosing from google fonts. In order to allow TMP to initiate the font you want you will need to drag and drop in into the project menu and then go to Window>TextMeshPro>Font Asset Creator. Then drag your downloaded font into the source font file box. Lastly click generate font atlas and hit save-as and place it in a fonts folder, at which point a TMP font file will be created, which you can now drag and drop into the Font Asset location. Once you have added your font remember to center it to the top left conner to ensure if you move your panel it will stay where it is.

In order to implement our TMP variable we need to add a new namespace to our item collection script.

```
Using TMPro;
```

This will allow us to find and identify our TMP game object and make changes to it. Now we need to create a serialized field where we can drag and drop our TMP object.

```
[SerializeField] private TMP_Text oranges.
```

Lastly we need to reference our text object in our trigger function.

```
oranges.text = "Oranges: " + oranges
```

This will increment our counter for every item we collect. Remember this all must be under be under the `OnTriggerEnter2D` function.
```
private int oranges = 0;

[SerializeField] private TMP_Text orangesText;

private void OnTriggerEndter2D(Collider2D collision)
{
	if (collision.gameObject.CompareTag("Orange"))
	{
		Destroy(collision.gameObject);
		oranges++
		orangesText.text = "Oranges: " + oranges
	}
}
```

The last thing you must do to get it to work is to drag your TMP object into the items text area in the item collector script.

## Moving Platforms

Creating Moving Platforms
https://youtu.be/UlEE6wjWuCY?feature=shared

To create a moving platform we will need two C# scripts that we will create here. if your moving platform has an animation you can add it if you want. To start off we will need to create a C# script and call it `Waypoint_Follower`, This will use normal empty game objects as waypoints to tell our platform where to go. You can create empty game objects by right clicking the hierarchy and clicking create empty. Once you have your two way points you can give them identifiers which are only visible in the scene view of unity. These are located under the inspector tab in the top left corner. Place the way points where you want in your game for the platform to follow. After this is all set up open your C# script. You can remove the `Start()` function in this script as we will be moving our platforms by setting their position frame for frame.

To start off we will make an  Serialized array of type `GameObject` with the name waypoints.
```
[SerializeField] private void GameObject[] waypoints; 
```

This line of code allows you to add waypoints to your script in the inspector menu. it will act as a drop down that you can use by clicking the plus symbol to add as many as you need. We will next need a variable that keeps track of the current waypoint index, otherwise known as the current waypoint we are heading towards.

```
private int currentWaypointIndex = 0;
```

We will also need a speed at which we would like to move our platform at. It is important to note that a serialized field is ideal as it lets us change the value in unity.

```
[SerializeField] private float speed = 2f;
```

Next we will add an if statement in the `Update(` function to keep track of the distance between the platform and the currently active waypoint.

```
private void Update()
{
	if (Vector2.Disctance(waypoints[currentWayPointIndex].transform.position, 
	transform.position) < .1f)
	{
		currentWaypoitIndex++
	}
}
```

This if statement will take the distance, and if it is less than .1f it will increment the `currentWaypointIndex` by one. We now need an other if statement inside the previous one which will reset the currently active waypoint once we get to the end of the index.

```
if (currentWaypointIndex >= waypoints.Length)
{
	currentWaypointIndex = 0;
}
```

To move our platform towards the next waypoint in the index we need to add one lest line of code outside our if statements.

```
transform.position= = Vector2.MoveTowards(transform.position, waypoints[currentWayPointIndex].transform.position, Time.deltaTime * speed);
```

Dissecting this last line of code we can see that we set the transform position of the moving platform using:

```
Vector2.MoveTowrds()
```

This function takes three arguments to move the platform a certain distance each frame.

```
transform.position
```

We then use this to find the current location of the platform in the game. After that we need to know where to move to. This is where we add:

```
waypoints[currentWayPointIndex].transform.position
```

This is the position of the currently active waypoint. Finally we add

```
Time.deltaTime * speed
```

This last argument determines how far we would like to move int he game. To avoid calculating frame rate `Time.deltaTime` will count the amount of seconds between each frame and multiply it by our speed to determine how far it should move per frame. This allows for seamless movement no matter the frame rate. This is called being frame rate independent. 

Now that we have a platform that moves from one place to an other we will need an other script to stick to the platform whenever we are standing on it. Create a second C# script and call it `Sticky_Platforms`. We will not need the `Start()` or `Update()` functions for this script. First we will need to add the `OnCollisionEnter2D` function. Once that is done we will put an in statement inside the function.

```
private void OnCollisionEnter2D(Collision2D collision)
{
	if (collision.gameObject.name == "Player")
	{
		collision.gameObject.transform.SetParent(transform);
	}
}
```

The if statement checks to see if the platform has collided with a game object named player. If that is the case the platform becomes the parent of the player allowing it to move with the player still attached. When we wanna leave the platform we will have to use a similar function called `OnCollisionExit2D`.

```
private void OnCollisionExit2D(Collision2D collision)
{
	if (collision.gameObject.name == "Player")
	{
		collision.gameObject.transform.SetParent(null);
	}
}
```

Inside this function we check whether we left the platform. If so, pass a null value in the set parent function parameter detaching the player from the platform and allowing us to continue the level. To make the platforms work more efficiently we can add a second box collider to the moving platform and set it as a trigger. We can then change our `OnCollision2D` functions to `OnTrigger2D` functions, this allows us to differentiate between the different box colliders. This will also prevent us for sticking to the side and being dragged off. One last reminder is to set the layer of the moving platform to Ground or else we wont be able to jump off of it, along with making the moving platform a prefab for use later.

## Enemy Rotation

![[2D_Platformer_Game_lvl4.png]]

Enemy Config Tutorial
https://youtu.be/RuvfOl8HhhM?feature=shared
**NOTE: I used the moving platform script to determine the start and end of the enemy, the video has its own**

In the event that we have enemies running around your world we can make it so that when they reach the end of a waypoint they flip around and head in the other direction facing the right way. To prevent bugs you should duplicate your waypoint follower script and rename it something like `Enemy_Folloer` One you have renamed and opened your script all we are going to do is add a flip function called `flip()`.

```
private void flip()
{
	Vector3 flip = transform.localScale;
	flip.x *= -1;
    transform.localScale = flip;
}
```

Breaking this down line by line. 

```
Vector3 flip = transform.localScale;
```

We create a Vector3 and name it flip. We then get the localScale transform component. which I basically a coordinate plane that is independent from the global coordinate plane. Allowing us to modify the game object without interfering with the global coordinate system.

```
flip.x *= -1;
```

Here we multiply the x component of the local scale in order to flip the sprite.

```
transform.localScale = flip;
```

Then we take the negative value of the x component and reassign it to the game object.

```
        if(Vector2.Distance(waypoints[CurrentWaypointIndex].transform.position, transform.position) < .1f)
        {
            if(CurrentWaypointIndex >= waypoints.Length)
            {
                CurrentWaypointIndex = 0;
            }
            CurrentWaypointIndex++;
            flip();
        }
            transform.position = Vector2.MoveTowards(transform.position, waypoints[CurrentWaypointIndex].transform.position, Time.deltaTime * speed);
    }
```

Lasty we need to call the function when ever the waypoint index gets incremented. This is because each incrementation occurs when the game object has reached a way point and is heading to the next one.

## Traps
### Rotating Saws

Creating Rotating Saws
https://youtu.be/XgIv4fLu8zs?feature=shared

Four our rotating saws we can reuse our waypoint follower script from our moving platforms. Remember to make a sprite and add the saw to it. Since we are reusing our way point script create two waypoints that will serve as the points it will move between. Remember to also add a box collider to the Saw (it can be circular or square) and set the tag to trap. We will now create a short C# script which uses the `Update()` function.

We first need a serialized field to determine how many FULL rotations per second will occur.

```
[SerializeField] private float speed = 2f;
```

We then add a transform function that will take arguments on how much we will rotate the image on the x, y, and z direction. We also have to add `Time.deltaTime` to make the rotations smooth and consistent. 

```
transform.Rotate(0, 0, 360 * spped * Time.deltaTime);
```

This is all that is required since we have previously set up the follower code and player death logic. All that is left to do is to make the saw a prefab to make it reusable throughout your game. A cool bonus feature is that if you remove the waypoint follower script the saws will rotate in place.
### Trampolines

Creating Trampolines
https://youtu.be/0e3Ld6-RzIU?feature=shared

Adding trampolines is a fairly easy set up. This will require a C# script added to a game object that you would like to have as a trampoline. Once its open you can remove the `Start()` and `Update()` functions. All we need is serialized variable that will determine our bounce force.

```
[SerializeField] private bounce;
```


This allows us to edit the bounce force in unity directly. Once that is done we will need to use the `OnCollisionEnter2D()` function.

```
private void OnCollisionEnter2D(Collision2D collision)
{
	if (collision.gameObject.CompareTag("Player"))
	{
		collision.gameObject.GetComponent<RigidBody2D>().AddForce(Vector2.up * bounce, ForceMode.Impulse);
	}
}
```

In our collision function we check if the collided game object has a tag of player. If it does it will access the rigid body of the player and add a vertical force to it. This is done by multiplying `Vector2.up` with our bounce force. We also want to apply an instant force, so we set the `ForceMode2D` to impulse. Remember to assign a player tag to our player. If you would like to animate a trampoline we would first create a new script and add a reference to our animation and initialize it in the start function.

```
private Animator anim;

private void Start()
{
	anim = GetComponent<Animator>();
}
```

Now can use the `OnCollision` functions to reference our boolean that we created in the trampoline animator.

```
private void OnTriggerEnter2D(Collision2D collision)
{
	anim.SetBool("Bounce", true);
}

private void OnCollisionExit2D(Collision2D collision)
{
	anim.SetBool("Bounce", false);
}
```

Remember to turn off "Has exit time" to allow for consistent animation transitions.

### Falling Platforms

![[2D_Platformer_Game_lvl5.png]]

Creating Falling Platforms
https://youtu.be/uzbMPEkkSmo?feature=shared

Falling platforms require a few things in the unity editor before we get to coding. We first need to add a rigid body 2D. We don't want the platform to fall right as the game starts so we will set the body type to kinematic. A kinematic body type is used as a way to better control the physics of the object. We as developers are responsible on giving it functionality through code. We now need to set the interpolation value to interpolate this allows unity to transition smoothly between a rigid body's position and rotation in accordance to the physics properties you set. It is also important to freeze the rotation on the x and z axis to prevent it from spinning in place. Now that the rigid body is set up we need to add a Platform Effector 2D. Remember to make sure use one way is checked, this allows the platform to pass through objects from below but still be able to walk on it. Lastly we need to check use by effector in the box collider of the game object. Once that is all set up we need a C# script with a few variables. We will first need a fall delay and a destroy delay, as well as a serialized field for our platforms rigid body.

```
[SerializeField] private float fallDelay;
[SerializeField] private float destroyDelay;

[SerializeField] private RigidBody2D rb;
```

Now we will need to use the `OnTrigger` functions in order to detect when we have touched the platform.

```
private void OnTriggerEnter2D(Collision2D collision)
{
	if (collision.gameObject.CompareTag("Player"))
	{
		StartCoroutine(Fall());
	}
}
```

Inside the player tag if statement we need to activate a coroutine function called `Fall()`. To do this we are going to need an `IEnumerator`. This line of code allows for timed delays in code execution. Using a yield return Unity will pause the execution of the next lines of code until the next frame or a specified variable is inputted. It is a good reminder that `IEnumertors` provide methods for moving to the next element in the collection. The order in which the methods are executed depends on the order they are placed in.

```
private IEnumerator Fall()
{
	yeild return new WaitForSeconds(fallDelay);
	rb.bodyType = RigidbodyType2D.Dynamic;
	Destroy(gameObject, destroyDelay);
}
```

Inside the enumerated function we first pass a yield return which will wait a specified amount of time in seconds based on the input of the `fallDelay` variable. Next, the rigid body of the platform is set to dynamic allowing it to fall trough the map. Lastly the platform will be destroyed after a specified delay in seconds depending on the `destroyDelay` variable. In Unity remember to reference the platforms rigid body in the inspector and that our player has a tag of player.
### Ball and Chain

![[2D_Platformer_Game_lvl3 1.png]]

Creating a Ball and Chain
https://youtu.be/XvS4U5Y0d4g?feature=shared

If you want to create a ball and chain with  physics, you will first need to create a 2D sprite object which will act as the parent object. After we create our sprite and add an image to it we will need to add two components to it. These will be a rigid body 2D set to static and a distance joint 2D. Now we will create an other sprite which will act as the spiked ball hanging from a set of chains. Once that is done we will drag the rigid body of our ball into the empty space of the distance joint 2D component. We will now need to create one more sprite which will act as the chain for our spiked ball. After adding it we will duplicate it as many times as we like to make it the length we want. Now we will add three components to each chain, these being a rigid body 2D, a capsule collider 2D, and a hinge joint 2D. In this example I will have 3 chain game objects. Once all the components are added select the first chain and drag the second one into the empty space labeled connected rigid body. We will then repeat that by dragging  chain 3 into chain 2 and then the spiked ball into chain 3. Lastly we will need to add one more hinge joint 2D to the first chain, this is so we can connect it with the parent game object. So all need need to do now is drag the parent game object into the connected rigid body space on the first chain and we should have a working ball and chain. As a side note you can adjust the anchor point of the hinge joints to give it more realistic properties.

## Game Audio
### Sound Effects

Adding Sound effects and Background Music
https://youtu.be/J77CMuAwVDY?feature=shared
**NOTE: The background music code provided below is of my own creation and is not related to any videos**

To get sound effects for your game go to the unity assets store and you can find free sound effect files. Once you find what you want click on open in unity, download the asset package and click on import. Once the sounds are imported you can add a component called an Audio Source. Drag and drop the sound effect into the audio source component. Make sure its on the correct object. Un-check play on awake so the sound effect only plays when the action is performed. To play our sound effects, a simple method is to reference our sound in our scripts. To play a jump sound effect we first create a new variable.

```
[SerializeField] private Audio Source jumpSoundeEffect;
```

In order to play our sound we place our variable in the statement where we perform the action.

```
if(Input.GetButtonDown("Jump"))
	{
		jumSoundEffect.Play();
		rb.velocity = new Vector2(rb.velocity.x, jumpForce);
	}
```

This will play the sound every time we jump. We can reuse this method to add sounds such as a death sound effect, an item collection sound effect, and a level complete sound effect. As a reminder you must drag the audio source into the serialized field we created.

### Background Music

In order to play background music it is slightly more complicated. We will have a singular game object which will switch the music based one what scene we are on. We will place this game object in the start menu scene. First create and add a C# script to our game object, we will need to use the `UnityEngine.SceneManagement ` namespace again as well. Once in the script we will need to add a variable for every scene we would  like to add background music on.

```
    public AudioClip startMenuMusic; // Assign in the Inspector
    public AudioClip levelSelectMusic; // Assign in the Inspector
    public AudioClip levelOneMusic; // Assign in the Inspector
    public AudioClip levelTwoMusic; // Assign in the Inspector
    public AudioClip levelThreeMusic; // Assign in the Inspector
    public AudioClip levelFourMusic; // Assign in the Inspector
    public AudioClip levelFiveMusic; // Assign in the Inspector
    public AudioClip endMenuMusic; // Assign in the Inspector
    public AudioClip creditsMusic; // Assign in the Inspector
```

Each variable  will take in one audio clip which we can assign in the inspector menu, this is where the music will be gathered from across the game.. We will also need to add a public audio source variable and public static variable which references our script. As well as a private variable to keep track of the current music.

```
public static AudioManager instance;

public AudioSource musicSource;

private AudioClip currentMusicClip;
```

The instance variable is used to ensure only one audio manager game abject exists throughout the game. This prevents overlapping music. Our audio source variable allows use to play the current music track. we will also need a variable that keeps track of the current music to prevent it from being played unnecessarily. Once we have all of our variables we will need an `Awake()` function. Inside we will write an if else statement to make this audio manager game object the only one across the whole game.

```
private void Awake()
{
	if (instance == null)
    {
        instance = this;
         DontDestroyOnLoad(gameObject);
    }
    else
    {
        Destroy(gameObject);
        return;
    }
}
```

The if block means that if the instance variable has nothing in it, this instance becomes the sole one throughout the game. This is done through the `DontDestroyOnLoad(gameObject)` line. Lastly inside the awake function we will need to subscribe to the `activeSceneChanged` event.

```
SceneManager.activeSceneChanged += SceneChanged; // Subscribe to scene change event
```

This will allow the script to call the `SceneChanged` function each time you switch scenes. 

```
private void SceneChanged(Scene current, Scene next)
```

The parameters of the function carry data on the currently active scene before the transition, and the scene that will become active after the transition. Once that's done we can now create a series of if and else if statements to play a certain music track on a given scene.

```
if (next.name == "Start Screen")
{
    PlayMusic(startMenuMusic); // Play Start Menu music
}
    else if (next.name == "Level Select")
{
    PlayMusic(levelSelectMusic); // Play Level Select music
}
```

Inside this if else block we will play the music based on the active scene. This will go through the else if statements until one matches the currently active scene. The last piece of the script we will need to add will be a function that will sop the active music and play the correct one based on the scene that is active.

```
public void PlayMusic(AudioClip musicClip)
    {
        if (currentMusicClip != musicClip)
        {
            currentMusicClip = musicClip;
            musicSource.Stop();
            musicSource.clip = musicClip;
            musicSource.Play();
        }
```

The parameter of the function will take in an audio clip which will represent the music track you wanna play. Inside the if statement it will then check whether the music clip is different from the currently active music clip. This prevents repeat plays or restarting the same track again. If the condition is true the lines inside the if block will execute. First the currently active music clip variable is set to the music clip for the current scene using `currentMusicClip = musicClip`. After that the `musicSource.Stop()` line will stop the currently active music clip to allow the next one to play. Once that is complete `musicSource.clip = musicClip` will assign the new music track to the audio source. Lastly the `musicSource.Play()` line will play the newly assigned track for the given scene. Remember to add as many if else statements to your code for all the scenes you would like to have music for. Any scene not specified for its own music track will carry over the music from the previous scene. Due to the  `DontDestroyOnLoad(gameObject)` line the audio will continue assuming there is no track to switch too.

## Level Config

Creating level selection
https://youtu.be/vpbPd6jNEBs?feature=shared

Creating levels and level transitions
https://youtu.be/dO5BzWYqEdY?feature=shared

We can incorporate level transitions through scene management scripts allowing for a longer game. After you have completed the design of your first level to your liking you can open the scenes folder in the project menu and duplicate it. This create an exact copy of your level that you can redesign to how you see fit. Be warned, you must save your level 1 scene because once you duplicate it  what ever is not saved gets deleted. 

If you want there to be a delay before you transition to the next level you can use an `Invoke` function.

```
Invoke("CompleteLevel", 2f)
```

This line of code will run the function `CompleteLevel()` after a 2 second delay. This can be changed by increasing or decreasing the value of the second parameter. We will also have to use a boolean to prevent the finish line from being activated more than once.

```
private boool levelComplete = false;
```

We will set it to false by default and then when we touch the finish line we will set it to true preventing us from activating the finish line repeatedly. Now we can design the  Game Manager script. Once we have created our game manager script we will start off by initializing an array of buttons called `lvlButton`.

```
public Button[] lvlButton;
```

Once that is done we will drag and drop our buttons from the level selection screen you have created into the order you would like to play them. Once that is done we will need to add a variable which will store the players progress which is initialized in the start function.

```
int levelAt = PlayerPrefs.GetInt("levelAt", 2);
```

Breaking this down we have a variable called `levelAt` which will contain the `PlayerPrefs` function. This will get an integer using the `.GetInt` statement which will retrieve an integer value stored in the function. In this case it is the index at which level 1 is store at. The string in the first parameter is the variable ``"levelAt"``. This means that once you beat the first level, the line of code above will unlock levels after the previous one has been complete. This is done with an if statement nested inside a for loop.

```
for(int i = 0; i < lvlButton.Length; i++) 
{ 
	if(i + 2 > levelAt) 
	{ 
		lvlButton[i].interactable = false; 
	} 
}
```

The for loop iterates through the button array and compares the value of the button index to the value of i. It will then increment it by one and run the for loop again for a total of 5 increments (this is based on how many button levels you added). The if statement is then executed if the current value of i + 2 is greater than the default value of the `levelAt` variable (2). assuming you are playing the game for the first time.

```
levelButton[i].interactable = false;
```

When the value of i is greater than the `levelAt` variable it will set every button in the index starting from the value that set the if statement to true, to false. Effectively disabling the rest of the level buttons. Now that the level selection screen has all levels disabled except for the first one we need to create an other script that will increment the build index allowing us to unlock the next level. We will start with a variables indicating the transition to the next scene.

```
private int nextSceneLoad;
```

Next, we have to initialize the variable in the start menu to allow it to transition to the next scene.

```
private void Start()
{
	nextSceneLoad = SceneManager.GetActiveScene().buidIndex + 1;
}
```

This allows the next scene to be load each time the variable is called. We now need the `OnTrigger` function to detect when we have collided with our end level flag.

```
 if (other.gameObject.tag == "Player" && !levelComplete)
        {
            if (SceneManager.GetActiveScene().buildIndex == 6)
            {
                levelComplete = true;
                Invoke("EndGame", 2f);
            }
            else
            {
                Music.Play();
                levelComplete = true;
                Invoke("CompLevel", 2f);
            }
        }
```

Inside the trigger function we have an if statement that will determine if the build index value is six. If so, we will invoke an end game function after a 2 second delay. If the build index is any other number we will invoke a complete level function after a 2 second delay. Inside the complete level function we will first set it so that when we complete the level we return to the level selection screen.

```
SceneManager.LoadScene("Level Select");
```

After that is done we will add an if statement.

```
if (nextSceneLoad > PlayerPrefs.GetInt("LevelAt"))
{    
    PlayerPrefs.SetInt("levelAt", nextSceneLoad);
}
```

The if statement here will determine if the `nextSceneLoad` variable is greater than the `levelAt` variable. If the statement is true the following code inside the if block will set the value of `nextSceneLoad` to `levelAt` allowing the player to access the next level. Lastly we will incorporate our endgame function to properly complete the game.

```
    private void EndGame()
    {
        SceneManager.LoadScene("End Screen");
    }
```

As stated above this function will only execute if the build index is equal to the scene with the end screen. You may need to change the variable based on how many levels you add.
## Teleporters

Creating Teleporters
https://youtu.be/0JXVT28KCIg?feature=shared

To add teleporters we are going to need two scripts, one for the teleporters themselves, and the other for the player. First we need to create teleporters in our game. you can add a sprite to a game object or create an empty object with a box collider and then place it over a part of your game to make it seem like they are connected. Once you have 2 teleporters you can attach a C# script. We first need a serialized field that returns our destination.

```
[SerializeField] private destination;
```

This is where we will drag the other teleporter game object into. Next we need a function that will return our variable.

```
public Transform GetDestitnation()
{
	return destination;
}
```

This function has a return type of transform giving the location of the object in the serialized field. Now that we have this script drag one teleporter into the empty box of the other and vice-versa. Now we need the script for the teleportation. To do this we need to add a new script to our player. Once that is done we need to initialize a variable that will determine which teleporter we are standing in.

```
private GameObject currentTele;

private void OnTriggerEnter2D(Collider2D collision)
{
	if (collision.CompareTag("Teleporter"))
	{
		currentTele = collision.gameObject;
	}
}
```

If we enter a teleporters trigger we want to set `currentTele` to our collided object. In this case, our player. If once we exit the trigger and our collided object is the same as  `currentTele` we will set current teleporter to null.

```
private void OnTriggerExit2D(Collider2D collision)
{
	if (collision.CompareTag("Teleporter"))
	{
		currentTele = null;
	}
}
```

Now we need check if we have pressed a key down in order to activate the teleporter.

```
void Update()
{
	if (Input.GetButtonDown("Fire3"))
	{
		if (currentTele != null)
		{
			transform.position = currentTele.GetComponent<Teleporter>.GetDestination().position;
		}
	}
}
```

I am using Unity's input manager in order to better customize what key I need to press down. The fire3 key set by default is shift. Once we press shift we check to see if the `currentTele` is not null and if so we execute the following line of code.

```
transform.position = currentTele.GetComponent<Teleporter>.GetDestination().position;
```

Breaking it down we start by taking the current transform position of the player and setting it equal to the current teleporters position. To do this we use `GetComponent` and reference our Teleporter destination script. Once we access that we execute the `GetDestination()` function allowing us to teleport. One last reminder to create a tag called teleporter and assign it to our game objects as well as to set the box colliders to is trigger. It allows us to differentiate whether we are in a teleporter or not.

## Ladders

Creating Ladders
https://youtu.be/yyg0yV2roPk?feature=shared

To add ladders to the game we need to add a C# script to our player called `LadderMovement` . Next, we are gonna need a few variables to start off.

```
private float vertical;
private float speed = 8f;
private bool isLadder;
private bool isClimbing;
```

We are also gonna need a serialized field to access our players rigid body.

```
[SerializeField] private RigidBody2D rb;
```

We will need to use the `OnTrigger` functions to determine when we are in contact with our ladder.

```
OnTriggerEnter2D(Collider2D collision)
{
	if (collision.CompareTag("Ladder"))
	{
		isLadder = true;
	}
}

OnTriggerExit2D(Collider2D collision)
{
	if (collision.CompareTag("Ladder"))
	{
		isLadder = false;
		isClimbing = false;
	}
}
```

If we enter a game object with the tag ladder `isLadder` is set to true. and once we exit the ladder `isLadder` and `isClimbing` is set to false. Next we need to pass the return value of the vertical axis in the `Update` function. This means every frame we get the vertical axis of our player.

```
void Update()
{
	vertical = Input.GetAxis("Vertical");
}
```

We will now have to check  if `isladder` is true and the vertical input is greater than zero. If so `IsClimbing` is set to true.

```
void Update()
{
	vertical = Input.GetAxis("Vertical");
	if (isLadder && Mathf.Abs(vertical) > 0f)
	{
		isClimbing = true;
	}
}
```

Now if `isClimbing` is true we have to disable gravity and multiply our vertical velocity by our speed in order to climb the ladder.  We will place this in the fixed update function, this is because fixed update is used for physics calculations as it is frame rate independent. calling the function at an interval of 0.02 (50 fps) regardless of the frame rate.

```
private void FixedUpdate()
{
	if (isClimbing)
	{
		rb.gravityScale = 0f;
		rb.velocity = new Vector2(rb.velocity.x, vertical * speed);
	}
}
```

Now if `isClimbing` is false we set our gravity scale back to our original value.

```
	if (isClimbing)
	{
		rb.gravityScale = 0f;
		rb.velocity = new Vector2(rb.velocity.x, vertical * speed);
	}
	else
	{
		rb.gravityScale = 4f;
	}
```

Lastly we need to create a tag called ladder and reference our players rigid body in the serialized field.

## UI Config

Creating a Start and End screen
https://youtu.be/OLbWB1R095s?feature=shared

Once you have created the levels you want for your game you will need a start and end screen. To create a new scene right click the project menu and go to Create>Scene.  Inside our new scene go to the hierarchy and right click, then go to UI>Panel. You can change the panel of your game to however you like. you can also add text by right clicking our panel and going to UI>TextMeshPro. This will create a nested TMP object allowing you to add text to your start screen. You can add your preferred font using the TMP asset file you created earlier. To add an image to your panel you can drag and drop an image of a sprite you used onto the screen and then adjust it accordingly. To create a button to use we right click on the panel and go to UI>Button-TextMeshPro. This will come with a TMP asset similar to the item collection game object. In order to start game with the button we need to create a C# script. This script will only have one function which we will call `Game_Start()`. 

```
public void Start_Game()
{
	SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
}
```

The line of code we wrote will go into the build index which can be accessed by going to File>Build Settings. This is where you drag and drop your scenes. The start screen should always go first. Depending on what's next in the build index will determine which scene will be the next to transition to. When we go back to the start button we add the script to it. We then have to drag the game object onto the empty box then select the `Start_Game()` function which is under the name of the script, this will give our button functionality.

We do the same for the End Screen. In this case we create an other C# script. Name it `End_Menu` and drop in onto the button on the End Screen. In the new script we need to create a new function and here we will call it `Quit()`.

```
public void Quit()
{
	Aplication.Quit();
}
```

This function is quite self explanatory. Once you build your project the quit button will close the application. However, this wont work in unity so it is recommended you add a `Debug.Log("Message")` to confirm that the button works.

-7000 to 16 - bit binary using 2's comp and displayed in hex

BCD rep of 396base 10?

Z(1' + Y)

## Alt Movement

Here is a scrapped old movement system that I got off a YouTube video. I used it to teac me how Ground Checks work.

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed;
    public float jumpForce;

    public KeyCode left;
    public KeyCode right;
    public KeyCode jump;
    public KeyCode ball;

    [SerializeField] private LayerMask jumpableGround;
    private Rigidbody2D rb;
    private BoxCollider2D coll;
    private Animator anim;

    // Start is called before the first frame update
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        coll = GetComponent<BoxCollider2D>();
        anim = GetComponent<Animator>();
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKey(left))
        {
            rb.velocity = new Vector2(-moveSpeed, rb.velocity.y);
        }
        else if (Input.GetKey(right))
        {
            rb.velocity = new Vector2(moveSpeed, rb.velocity.y);
        }
        else
        {
            rb.velocity = new Vector2(0, rb.velocity.y);
        }

        if (Input.GetKey(jump) && IsGrounded())
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
        }

        if (rb.velocity.x < 0)
        {
            transform.localScale = new Vector3(-1, 1, 1);
        }
        else if(rb.velocity.x > 0)
        {
            transform.localScale = new Vector3(1, 1, 1);
        }

        anim.SetFloat("Speed", Mathf.Abs(rb.velocity.x));
        anim.SetBool("Grounded", IsGrounded());
    }

    private bool IsGrounded()
    {
        return Physics2D.BoxCast(coll.bounds.center, coll.bounds.size, 0f, Vector2.down, .1f, jumpableGround);
    }
}
```