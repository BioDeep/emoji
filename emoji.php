<?php

$src = "./build/svg/";
$emoji = [];

foreach (new DirectoryIterator($src) as $file) {
    if ($file->isFile()) {
        $name = explode(".", $file->getFilename());
        $ext  = $name[count($name) - 1];

        if ($ext === "svg") {
            $name = $name[0];
            $emoji[$name] = $name;
        }
    }
}

header("content-type: application/json; charset=utf-8");

echo json_encode($emoji);