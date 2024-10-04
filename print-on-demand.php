<?php
/**
 * Plugin Name:       Print on demand
 */

 // Enqueue scripts and styles
function print_on_demand_enqueue_scripts() {
  // Register and enqueue your custom JavaScript file
  wp_enqueue_script(
      'print-on-demand', // Handle name for the script
      plugins_url('print-on-demand.js', __FILE__), // Path to the script
      array('jquery'), // Dependencies (optional)
      '1.0', // Version number
      true // Load in footer (true) or head (false)
  );

  // Register and enqueue your custom JavaScript file
  wp_enqueue_script(
    'fabric', // Handle name for the script
    plugins_url('/lib/fabric.min.js', __FILE__), // Path to the script
    '1.0', // Version number
    true // Load in footer (true) or head (false)
);

   // Localize script for AJAX URL and nonce
   wp_localize_script('print-on-demand', 'canvas', array(
    'ajax_url' => admin_url('admin-ajax.php'),
  ));

  // // Optionally enqueue a CSS file
  // wp_enqueue_style(
  //     'your-plugin-style', // Handle name for the style
  //     plugins_url('css/your-style.css', __FILE__), // Path to the style
  //     array(), // Dependencies (optional)
  //     '1.0' // Version number
  // );
}
add_action('wp_enqueue_scripts', 'print_on_demand_enqueue_scripts');

function my_custom_shortcode() {
  // Your shortcode output goes here
  return ' <canvas id="canvas">

  </canvas>
  <input type="color" id="colorPicker" value="#0000ff"> <!-- Initial color -->
  <input type="color" id="colorPickerStart" value="#ff0000"> <!-- Start color -->
  <input type="color" id="colorPickerEnd" value="#0000ff"> <!-- End color -->
  <button id="toggleMode">Switch to Select Mode</button> <!-- Button to toggle modes -->
  <input type="file" id="imageUpload" accept="image/*"> <!-- File input for uploading images -->
  <div class="controls">
    <label for="imageUpload">Upload Image:</label>
    <input type="file" id="imageUpload" accept="image/*"><br><br>

    <label for="brightness">Brightness:</label>
    <input type="range" id="brightness" min="-1" max="1" step="0.1" value="0"><br><br>

    <label for="contrast">Contrast:</label>
    <input type="range" id="contrast" min="-1" max="1" step="0.1" value="0"><br><br>

    <label for="grayscale">Grayscale:</label>
    <input type="checkbox" id="grayscale"><br><br>

    <button id="toggleMode">Switch to Select Mode</button>
    <button id="resetFilters">Reset Filters</button>
    <button id="undoButton">Undo</button>
    <button id="redoButton">Redo</button>
    <button id="downloadDesign">Download Design</button>
</div>';
}
add_shortcode('my_shortcode', 'my_custom_shortcode');


// Function to handle saving canvas data
function save_canvas_data() {
  // Check the nonce for security
  check_ajax_referer('my_nonce', '_ajax_nonce');

  // Get the canvas data from the request
  $canvas_data = isset($_POST['canvas_data']) ? sanitize_text_field($_POST['canvas_data']) : '';

  // Here, you can save the canvas data to the database, a file, or process it as needed
  // For example, saving to a file
  if ($canvas_data) {
      // Remove the prefix 'data:image/png;base64,' from the data URL
      $data = explode(',', $canvas_data)[1];
      $data = base64_decode($data);

      // Save the image to a file
      $file_path = plugin_dir_path(__FILE__) . 'design.png'; // Change the path and filename as needed
      file_put_contents($file_path, $data);

      // Respond back to the AJAX request
      wp_send_json_success('Canvas data saved successfully.');
  } else {
      wp_send_json_error('No canvas data received.');
  }

  wp_die(); // Important: terminate script to avoid unwanted output
}
add_action('wp_ajax_save_canvas_data', 'save_canvas_data');
add_action('wp_ajax_nopriv_save_canvas_data', 'save_canvas_data'); // If you want to allow non-logged-in users

