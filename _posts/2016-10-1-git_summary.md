---
layout: post
title:  "Git笔记"
date:   2016-9-1 12:31:01 +0800
categories: study
tag: git
---

* content
{:toc}


# Git account Problem

## 如何在同一台电脑使用两个git账户

1. 生成新的ssh-key需要进入.ssh文件目录下，输入新的文件名如id_rsa_second ，而不是默认id_rsa。同时注意路径的选择，默认直接在根目录下,最好写绝对路径，比如ubuntu是/home/liu/.ssh/id_rsa_second，不过生成再拷贝到.ssh路径下也可以。

   ```sh
    $ssh-keygen -t rsa -C "your_email@example.com"
       # Creates a new ssh key, using the provided email as a label
       # Generating public/private rsa key pair.
       # Enter file in which to save the key (/Users/you/.ssh/id_rsa): id_rsa_second
   ```

2. 添加ssh-key到github or gitlab

3. 修改~/.ssh/config文件,注意文件路径用绝对地址。

   ```sh
   #liuk3@niksula.hut.fi
   host git.niksula.hut.fi
       hostname git.niksula.hut.fi
       User liuk3
       IdentityFile /c/Users/Administrator/.ssh/id_rsa
    #996529090@qq.com
    host github.com
       hostname github.com
       User kaka2634
       IdentityFile  /c/Users/Administrator/.ssh/id_rsa_second
   ```

   ​

4. 为每个账号设置对应的email和name

   ```sh
   1.取消global
       git config --global --unset user.name
       git config --global --unset user.email

       2.设置每个项目repo的自己的user.email
       git config  user.email "xxxx@xx.com"
       git config  user.name "xxxx"
   ```

   ​参考：
   [http://tmyam.github.io/blog/2014/05/07/duo-githubzhang-hu-she-zhi/](http://tmyam.github.io/blog/2014/05/07/duo-githubzhang-hu-she-zhi/)

[http://blog.lessfun.com/blog/2014/06/11/two-github-account-in-one-client/](http://blog.lessfun.com/blog/2014/06/11/two-github-account-in-one-client/)

## 如何修改push每次输入密码问题

参考[http://www.jinglingshu.org/?p=10482](http://www.jinglingshu.org/?p=10482)