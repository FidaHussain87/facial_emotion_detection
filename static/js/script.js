
// script.js


// This is a stub for any future navbar-related JavaScript you may want to add
document.addEventListener('DOMContentLoaded', () => {
    // This function will run after the DOM is fully loaded
    // Any navbar interactivity can go here

    // Example: Toggle mobile menu
    const menuButton = document.querySelector('.menu-button'); // Your menu button
    const navbarLinks = document.querySelector('.navbar-links'); // Your navbar links

    if (menuButton && navbarLinks) {
        menuButton.addEventListener('click', () => {
            // Toggle the .active class on the navbarLinks
            navbarLinks.classList.toggle('active');
        });
    }
});


/********************************************************* */

const cameraButton = document.getElementById("cameraButton");
      const stopCameraButton = document.getElementById("stopCameraButton");
      // const downloadAttendanceButton = document.getElementById('downloadAttendanceButton');
      const cameraStream = document.getElementById("cameraStream");
      const modelSelect = document.getElementById("modelSelect");
    //   const modelSetup = document.getElementById("modelSetup");
         
      const processedStream = document.getElementById("processedStream");
      let selectedModel = "";
      let stream;



      function handleModelChange() {
        const selectedValue = modelSelect.value;
        if(cameraStream.srcObject!=""){
            stopCamera();
        }
        // Stop processing frames for the previous model

        // Clear previous stream and canvas
        processedStream.src = "";

        // Add your logic here based on the selected radio button
        if (selectedValue === "CNN") {
          console.log("CNN");
          selectedModel = "CNN";
          openCamera();
        } else if (selectedValue === "Chehra") {
          console.log("Chehra");
          selectedModel = "Chehra";
          openCamera();
        } else if (selectedValue === "Yollo") {
          selectedModel = "Yollo";
          openCamera();
        }else{
            //show toast
            showToast("Please Select Any Model.")
        }
      }

      function openCamera() {

        cameraButton.style.display = "none";
        // modelSelect.style.display="none";
        // modelSetup.style.display="none";

        stopCameraButton.style.display = "block";
        cameraStream.style.display = "block";
        processedStream.style.display = "block";

        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((mediaStream) => {
            stream = mediaStream;
            cameraStream.srcObject = stream;
          })
          .catch((error) =>
            console.error("Error accessing the camera:", error)
          );

        // Start sending and displaying processed frames
        if (selectedModel === "CNN") {
          startSendingCNNFrames();
        } else if (selectedModel === "Chehra") {
          startSendingChehraFrames();
        }
        else if (selectedModel === "Yollo") {
          startSendingYolloFrames();
        }
        // startSendingFrames();
      }

      function stopCamera() {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        stream = null;

        stopCameraButton.style.display = "none";
        cameraButton.style.display = "block";
        // modelSelect.style.display="block";
        // modelSetup.style.display="flex !important";
        
        cameraStream.style.display = "none";
        processedStream.style.display = "none";
        cameraStream.srcObject = null;
        processedStream.src = ""; // Clear the processed image
      }

      function startSendingChehraFrames() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = cameraStream.videoWidth;
        canvas.height = cameraStream.videoHeight;

        ctx.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const formData = new FormData();
            formData.append("frame", blob);

            fetch("/process_chehra_frame", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.blob())
              .then((processedBlob) => {
                const processedUrl = URL.createObjectURL(processedBlob);
                processedStream.src = processedUrl;

                //update Chart
                updateChart(null);

                // Recursively send and display processed frames
                if(selectedModel === "Chehra"){
                  startSendingChehraFrames();
                }
               });
          },
          "image/jpeg",
          0.9
        );
      }

      function startSendingCNNFrames() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = cameraStream.videoWidth;
        canvas.height = cameraStream.videoHeight;

        ctx.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const formData = new FormData();
            formData.append("frame", blob);

            fetch("/process_CNN_frame", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.blob())
              .then((processedBlob) => {
                const processedUrl = URL.createObjectURL(processedBlob);
                processedStream.src = processedUrl;

                //update Chart
                updateChart(null);

                // Recursively send and display processed frames
                if(selectedModel==="CNN"){
                  startSendingCNNFrames();
                }
              });
          },
          "image/jpeg",
          0.9
        );
      }


      function startSendingYolloFrames() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = cameraStream.videoWidth;
        canvas.height = cameraStream.videoHeight;

        ctx.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const formData = new FormData();
            formData.append("frame", blob);

            fetch("/process_yollo_frame", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.blob())
              .then((processedBlob) => {
                const processedUrl = URL.createObjectURL(processedBlob);
                processedStream.src = processedUrl;

                //update Chart
                updateChart(null);


                // Recursively send and display processed frames
                if(selectedModel==="Yollo"){
                  startSendingYolloFrames();
                }
               });
          },
          "image/jpeg",
          0.9
        );
      }

      // function downloadAttendance() {
      //     fetch('/download_attendance')
      //         .then(response => response.blob())
      //         .then(blob => {
      //             const url = window.URL.createObjectURL(blob);
      //             const a = document.createElement('a');
      //             a.href = url;
      //             a.download = 'attendance.csv';
      //             document.body.appendChild(a);
      //             a.click();
      //             document.body.removeChild(a);
      //             window.URL.revokeObjectURL(url);
      //         })
      //         .catch(error => console.error('Error downloading attendance:', error));
      // }


/************************************************************ */
/********************************************************* */
var ctx = document.getElementById("emotionChart").getContext("2d");

      var labels = [
        "Anger",
        "Contempt",
        "Disgust",
        "Fear",
        "Happiness",
        "Neutrality",
        "Sadness",
        "Surprise",
      ];
      var values = [0, 0, 0, 0, 0, 0, 0, 0];

      var emotionChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Emotion Analysis",
              data: values,
              backgroundColor: [
                "rgba(255, 0, 0, 0.5)",
                "rgba(128, 128, 128, 0.5)",
                "rgba(0, 128, 0, 0.5)",
                "rgba(0, 0, 255, 0.5)",
                "rgba(255, 255, 0, 0.5)",
                "rgba(192, 192, 192, 0.5)",
                "rgba(128, 0, 128, 0.5)",
                "rgba(255, 165, 0, 0.5)",
              ],
              borderColor: [
                "rgba(255, 0, 0, 1)",
                "rgba(128, 128, 128, 1)",
                "rgba(0, 128, 0, 1)",
                "rgba(0, 0, 255, 1)",
                "rgba(255, 255, 0, 1)",
                "rgba(192, 192, 192, 1)",
                "rgba(128, 0, 128, 1)",
                "rgba(255, 165, 0, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        },
      });

      function updateChart(emotion_info) {
        // console.log("emotion_info: ", emotion_info);
        for (var i = 0; i < labels.length; i++) {
            const randomNumber = getRandomNumber();
          values[i] = randomNumber;//emotion_info[labels[i]];
        }
        emotionChart.update();
      }


      function getRandomNumber() {
        // Math.random() returns a random number between 0 (inclusive) and 1 (exclusive).
        // Multiply by 100 to get a number between 0 and 100, then add 1 to shift to 1 and 101,
        // ensuring you can get 1 as a result (since Math.floor() will round down).
        return Math.floor(Math.random() * 100) + 1;
      }
      
/**************************************************** */

      // Function to show a toast message
function showToast(message) {
    // Create toast element
    var toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    // Add toast to the container
    var toastContainer = document.getElementById('toastContainer');
    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.style.display = 'block';
        toast.style.opacity = 1;
        toast.style.bottom = '20px'; // Raise the toast
    }, 100); // Small timeout to allow for CSS transition

    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.bottom = '0px'; // Lower the toast

        // Remove element after fade out
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 500); // Matches the CSS transition
    }, 3000);
}
