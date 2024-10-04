(function($) {
  console.log('haha')

const canvas = new fabric.Canvas('canvas', {
  width: 500,
  height: 500,
  backgroundColor: "#000",
  isDrawingMode: false
});

// Create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20
});

var circle = new fabric.Circle({
  left: 100,         // X position on the canvas
  top: 100,          // Y position on the canvas
  radius: 50,        // Radius of the circle
  fill: 'blue',      // Fill color
  stroke: 'white',   // Stroke color (border)
  strokeWidth: 2     // Width of the stroke
});

// Create an ellipse object
var ellipse = new fabric.Ellipse({
  left: 100,         // X position on the canvas
  top: 200,          // Y position on the canvas
  rx: 50,            // Horizontal radius (X-axis)
  ry: 25,            // Vertical radius (Y-axis)
  fill: 'blue',      // Initial fill color
  stroke: 'white',   // Stroke color (border)
  strokeWidth: 2     // Width of the stroke
});

var text = new fabric.IText('Bridge', {
  fill: "#ffffff"
});

// Add shapes to the canvas
canvas.add(rect);
canvas.add(text);
canvas.add(circle)
canvas.add(ellipse)
canvas.renderAll();

canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);

// Customize the CircleBrush properties
canvas.freeDrawingBrush.color = 'yellow'; // Set the brush color
canvas.freeDrawingBrush.width = 20;        // Set the diameter of the circles


const colorPicker = document.getElementById('colorPicker');
// Update the fill color of the circle when a new color is selected
colorPicker.addEventListener('input', function(event) {
  const selectedColor = event.target.value; // Get the selected color value
 
  const activeObject = canvas.getActiveObject(); // Get the currently selected object

    // If an object is selected, update its fill color
    if (activeObject) {
        activeObject.set('fill', selectedColor); // Update the selected object's fill color
        canvas.renderAll(); // Re-render the canvas to reflect the changes
    }

  canvas.renderAll(); // Re-render the canvas to reflect the changes
});

// Toggle between drawing mode and selecting mode
const toggleButton = document.getElementById('toggleMode');

toggleButton.addEventListener('click', function() {
    canvas.isDrawingMode = !canvas.isDrawingMode; // Toggle drawing mode

    // Update the button text based on the current mode
    if (canvas.isDrawingMode) {
        toggleButton.textContent = 'Switch to Select Mode';
    } else {
        toggleButton.textContent = 'Switch to Draw Mode';
    }
});


// Image upload functionality
const imageUpload = document.getElementById('imageUpload');

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader(); // Create a FileReader to read the file
        reader.onload = function(e) {
            const imgElement = new Image();
            imgElement.src = e.target.result; // Set the image source to the file data
            imgElement.onload = function() {
                const imgInstance = new fabric.Image(imgElement); // Create a Fabric.js image instance
                imgInstance.set({
                    left: 100, // Set the position where you want to place the image
                    top: 100,
                    angle: 0
                });
                canvas.add(imgInstance); // Add the image to the canvas
                canvas.renderAll(); // Re-render the canvas to show the image
                // applyFilters(imgInstance); // Call the applyFilters function
                resetFilters();

            };
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});

// Filter controls
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const grayscaleCheckbox = document.getElementById('grayscale');
const invertCheckbox = document.getElementById('invert');
const removeColorPicker = document.getElementById('removeColor');
const sepiaSlider = document.getElementById('sepia');
const shadowSlider = document.getElementById('shadow');
const hueRotationSlider = document.getElementById('hueRotation');
const noiseSlider = document.getElementById('noise');
const pixelateSlider = document.getElementById('pixelate');
const blendColorPicker = document.getElementById('blendColor');
const blurSlider = document.getElementById('blur');


// Function to apply filters based on slider values
function applyFilters() {
  const activeObject = canvas.getActiveObject(); // Get the currently selected object
  if (activeObject && activeObject.type === 'image') { // Check if it's an image
      const brightnessValue = parseFloat(brightnessSlider.value);
      const contrastValue = parseFloat(contrastSlider.value);


      // Reset filters
      activeObject.filters = [];

      // Add brightness filter
      activeObject.filters.push(new fabric.Image.filters.Brightness({ brightness: brightnessValue }));

      // Add contrast filter
      activeObject.filters.push(new fabric.Image.filters.Contrast({ contrast: contrastValue }));

      // Add grayscale filter if checkbox is checked
      if (grayscaleCheckbox.checked) {
          activeObject.filters.push(new fabric.Image.filters.Grayscale());
      }

      // Apply the filters and re-render the canvas
      activeObject.applyFilters();
      canvas.renderAll();
  }
}

// Event listeners for filter controls
brightnessSlider.addEventListener('input', applyFilters);
contrastSlider.addEventListener('input', applyFilters);
grayscaleCheckbox.addEventListener('change', applyFilters);

// Reset filters function
function resetFilters() {
  brightnessSlider.value = 0;
  contrastSlider.value = 0;
  grayscaleCheckbox.checked = false;

  // Reset filters on the active object
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') {
      activeObject.filters = []; // Clear filters
      activeObject.applyFilters(); // Reapply with no filters
      canvas.renderAll(); // Re-render the canvas
  }
}

// Reset button functionality
const resetButton = document.getElementById('resetFilters');
resetButton.addEventListener('click', resetFilters);

// Delete the selected object on "Delete" key press
document.addEventListener('keydown', function(event) {
  if (event.key === 'Delete' || event.key === 'Backspace') { // Check for Delete or Backspace key
      const activeObject = canvas.getActiveObject(); // Get the currently selected object
      if (activeObject) {
          canvas.remove(activeObject); // Remove the selected object from the canvas
          canvas.discardActiveObject(); // Deselect the object
          canvas.renderAll(); // Re-render the canvas
      }
  }
});


// Color picker functionality for gradient
const colorPickerStart = document.getElementById('colorPickerStart');
const colorPickerEnd = document.getElementById('colorPickerEnd');

// Function to apply gradient color
function applyGradient() {
    const activeObject = canvas.getActiveObject(); // Get the currently selected object
    if (activeObject) {
        const gradient = new fabric.Gradient({
            type: 'linear', // You can also use 'radial' if desired
            coords: {
                x1: 0,
                y1: 0,
                x2: activeObject.width,
                y2: activeObject.height
            },
            colorStops: [
                { offset: 0, color: colorPickerStart.value },
                { offset: 1, color: colorPickerEnd.value }
            ]
        });

        activeObject.set('fill', gradient); // Set the gradient as the fill color
        canvas.renderAll(); // Re-render the canvas to reflect the changes
    }
}

// Update the fill color of the selected object when gradient colors are selected
colorPickerStart.addEventListener('input', applyGradient);
colorPickerEnd.addEventListener('input', applyGradient);

// Function to download the canvas design
function downloadDesign() {
  const dataURL = canvas.toDataURL({
      format: 'png',
      multiplier: 2 // Optional: Use a multiplier to increase image resolution
  });
  console.log(dataURL)
  const link = document.createElement('a'); // Create a link element
  link.href = dataURL; // Set the link's href to the data URL
  link.download = 'design.png'; // Set the default filename for download
  link.click(); // Trigger the download
}

// Download button functionality
const downloadButton = document.getElementById('downloadDesign');
downloadButton.addEventListener('click', downloadDesign);

// Function to send canvas data to the server
function sendCanvasData() {
  const dataURL = canvas.toDataURL({
      format: 'png',
      multiplier: 2 // Optional: Use a multiplier to increase image resolution
  });

  // Send the canvas data to the server via AJAX
  $.ajax({
      url: canvas.ajax_url, // Use the localized ajax_url
      method: 'POST',
      data: {
          action: 'save_canvas_data', // Action name for WordPress
          canvas_data: dataURL, // The canvas data URL
          _ajax_nonce: canvas.nonce // Include the nonce for security
      },
      success: function(response) {
          console.log('Data saved successfully:', response);
      },
      error: function(xhr, status, error) {
          console.error('Error saving data:', error);
      }
  });
}

// Add a button or trigger to call the sendCanvasData function
const saveButton = document.getElementById('saveDesign');
saveButton.addEventListener('click', sendCanvasData);


} ) (jQuery)