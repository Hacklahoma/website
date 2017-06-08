<!--
	This script gets the user's data from the information form and puts it in the
	'WANTING_INFORMATION' table in the 'HACKLAHOMA' database.
	
	NOTE: This won't work until we get the site on Create. The connection information
	is for a server I have set up on my local network. Bascially just for testing purposes.
-->
<?php
	// Assign database connection information to variables.
	$db_host = 'localhost';
	$db_username = 'tyler';
	$db_password = ''; // don't want my password here since our git is public. not the db connection info we'll be using anyway
	$db_database = 'HACKLAHOMA';
	$db_port = '2185';
	
	// Get the values of the input fields and assign them to variables.
	$name = $_POST['name'];
	$email = $_POST['email'];
	$phoneNum = $_POST['phoneNum'];
	$heardAboutUs = $_POST['heardAboutUs'];	
	
	// TODO: Change length of phoneNum to 12 in WANTING_INFORMATION table
	
	// Create the connection to the database.
	$mysqli = new mysqli($db_host, $db_username, $db_password, $db_database, $db_port);
	
	// If there is an error connecting to the database, output it to the screen.
	// TODO: Handle this.
	if(mysqli_connect_error()) {
		die('Connect Error ('.mysqli_connect_errno().') '.mysqli_connect_error());
		$mysqli->close();
	}
	
	// The SQL query to run on the database.
	$sql = "INSERT INTO WANTING_INFORMATION (`name`, `emailAddress`, `phoneNum`, `heardAboutUs`) VALUES ('$name', '$email', '$phoneNum', '$heardAboutUs')";
	
	// Run the query and check if there was an error running the query.
	// If the was an error, output it to the screen.
	// TODO: Handle this.
	if($mysqli->query($sql) === TRUE) {
		// do nothing
	} else {
		echo "Error: " . $sql . "<br>" . $mysqli->error;
	}
	
	// Close the connection to the database.
	$mysqli->close();
	
	// The page we want to go back to when this script has completed.
	$redirect = 'index.html?src=submittedInfo';
	
	// Redirect to the homepage.
	header("Location: " . $redirect);
?>