<?php

$src = "./build/svg/";
$emoji = [];

foreach (new DirectoryIterator($src) as $file) {
    if ($file->isFile()) {
        echo $file->getFilename() . "\n";
        
        $name = basename($file->getFilename());
        $name = explode(".", $name);
        $emoji[$name] = $name;
    }
}

echo json_encode($emoji);