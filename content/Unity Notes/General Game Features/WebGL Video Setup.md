---
"title:": WebGL Video Setup
tags:
---
This guide covers how to stream MP4 videos in Unity WebGL games hosted on platforms like itch.io without running into CORS errors, build size bloat, or unsupported `VideoClip` asset restrictions.

---

## 1. Why Standard Unity Video Clips Fail on WebGL

* **No Embedded `VideoClip` Assets:** WebGL builds cannot unpack and stream video clips embedded directly inside Unity's binary data bundles.
* **CORS Restrictions:** Browsers sandbox WebGL canvases. If a video is hosted on a domain that doesn't provide explicit `Access-Control-Allow-Origin: *` headers (such as raw GitHub Release download redirects), the browser halts playback with `ERR_FAILED` or `CORS policy` blocks.
* **Autoplay Policies:** Browsers block unmuted videos from playing automatically without prior direct user interaction on the page.

---

## 2. Video Preparation & Hosting Setup

### Step 1: Compress & Encode the Video
* **Format:** MP4 container.
* **Video Codec:** H.264 (AVC).
* **Audio Codec:** AAC.
* **Resolution:** 720p or 1080p at a low/medium bitrate to minimize load latency for web players.

### Step 2: Upload to a CORS-Enabled Direct Host
Upload the MP4 file to a host that serves direct media links with permissive cross-origin headers:

* **Recommended Free Option:** [Catbox.moe](https://catbox.moe/)
  1. Upload your `.mp4` file.
  2. Copy the resulting direct URL (e.g., `https://files.catbox.moe/xxxxxx.mp4`).
### 3. Unity Scene Configuration

1. In your question/video scene, create an empty GameObject and name it **VideoManager**.
    
2. Add a **Video Player** component (`Add Component > Video > Video Player`).
    
3. Set the following properties on the `VideoPlayer`:
    
    - **Source:** `URL`
        
    - **Play On Awake:** Unchecked (managed via script)
        
    - **Wait For First Frame:** Checked
        
    - **Render Mode:** `Camera Near Plane` (or `Render Texture` / `Material Override` depending on your UI setup)
        

## 4. Script Implementation

Create a script named `VideoSceneManager.cs` and attach it to your **VideoManager** GameObject:
```
using UnityEngine;
using UnityEngine.Video;
using UnityEngine.SceneManagement;

public class VideoSceneManager : MonoBehaviour
{
    [Header("Video Settings")]
    [SerializeField] private VideoPlayer videoPlayer;
    [SerializeField] private string directVideoUrl = "[https://files.catbox.moe/xxxxxx.mp4](https://files.catbox.moe/xxxxxx.mp4)";

    private void Awake()
    {
        if (videoPlayer == null)
        {
            videoPlayer = GetComponent<VideoPlayer>();
        }

        // Configure player to load from external URL
        videoPlayer.source = VideoSource.Url;
        videoPlayer.url = directVideoUrl;
        videoPlayer.isLooping = false;

        // Prepare video asynchronously before attempting playback
        videoPlayer.prepareCompleted += OnVideoPrepared;
        videoPlayer.Prepare();
    }

    private void OnEnable()
    {
        if (videoPlayer != null)
        {
            videoPlayer.loopPointReached += OnVideoFinished;
        }
    }

    private void OnDisable()
    {
        if (videoPlayer != null)
        {
            videoPlayer.prepareCompleted -= OnVideoPrepared;
            videoPlayer.loopPointReached -= OnVideoFinished;
        }
    }

    private void OnVideoPrepared(VideoPlayer source)
    {
        // Begin playback once frames are buffered
        source.Play();
    }

    private void OnVideoFinished(VideoPlayer source)
    {
        // Advance to the next scene in Build Settings
        int nextSceneIndex = SceneManager.GetActiveScene().buildIndex + 1;

        if (nextSceneIndex < SceneManager.sceneCountInBuildSettings)
        {
            SceneManager.LoadScene(nextSceneIndex);
        }
        else
        {
            Debug.LogWarning("VideoSceneManager: No subsequent scene found in Build Settings.");
        }
    }
}
```

### 5. Verification & Deployment

1. **Verify in Unity Editor:**
    
    - Enter Play Mode.
        
    - Confirm the console outputs no errors and the video streams smoothly from the URL.
        
    - Verify that the scene transitions once the video completes.
        
2. **Build for WebGL:**
    
    - Go to **File > Build Profiles** (or **Build Settings**).
        
    - Select **WebGL** and ensure all scenes are added in the correct order.
        
    - Click **Build**.
        
3. **Deploy to itch.io:**
    
    - Zip the build directory contents (`index.html`, `Build/`, etc.).
        
    - Upload to itch.io
        
    - Launch the game, open Developer Tools (**F12 > Console**), and ensure no CORS or `MEDIA_ELEMENT_ERROR` exceptions occur when reaching the video scene. (Only needed if video does not play)