#!/bin/bash

# Program:
#	Program creates  a file, which named by user's input 
#	and date command using for blogpost
# History:
# 2016/12/19	liu	 	First release


echo "Plz input your filename: " | pv -qL 10
read fileuser
echo "Title: " | pv -qL 10
read title
echo "Categories(study/travel): " | pv -qL 10
read categories
echo "Tag: " | pv -qL 10
read tag

#prevent using [Enter] 
filename=${fileuser:-"filename"}  


file=$(date +%Y-%m-%d)-${filename}.md

touch "$file"
echo "---" >>$file
echo "layout: post" >>$file
echo "title: "${title} >>$file
echo "categories: "${categories} >>$file
echo "tag: "${tag} >>$file
echo "---" >>$file