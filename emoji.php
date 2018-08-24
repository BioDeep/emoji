<?php

$src = "./build/svg/*.*";
$emoji = [];

foreach(glob($src) as $file) {
    $name = basename($file);
    $name = explode(".", $name);
    $emoji[$name] = $name;
}

echo json_encode($emoji);