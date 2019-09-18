#!/bin/sh

filename="logo.png"
dirname="logo"
name_array=("logo-16.png" "logo-28.png" "logo-108.png" "logo-29.png" "logo-58.png" "logo-80.png" "logo-57.png" "logo-114.png" "logo-120.png" "logo-512.png" "logo-1024.png"  )
size_array=("16" "28" "108" "29" "58" "80" "57" "114" "120" "512" "1024")
mkdir $dirname
for ((i=0;i<${#name_array[@]};++i)); do
    m_dir=$dirname/${name_array[i]}
    cp $filename $m_dir
    sips -Z ${size_array[i]} $m_dir
done