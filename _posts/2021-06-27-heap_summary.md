---
layout: post
title: 二叉堆
categories: study
tags: [数据结构, 堆]
subtitle: "一种特殊的完全二叉树"
mathjax: true
comment: true
---

## 堆的定义

**二叉堆** 是一个满足**堆有序**的**完全二叉树**，简称为**堆**。

从定义看，堆就是一种特殊的二叉树，那么什么是“堆有序” 和 “完全二叉树” 呢？

### 完全二叉树

图的基础

- **连通图** 任意两点之间都有路径连接的图

树与森林

- **树** 没有圈的连通图
- **森林** 没有圈的非连通图

二叉树
- **二叉树** 每个节点最多含有两个子树的树称为二叉树

- **完全二叉树** 假设s树深度为d（d>1），除了第d层外，其它各层的节点数目均已达最大值，且第d层所有节点从左向右连续地紧密排列。这样的树被成为完全二叉树

- **满二叉树** 所有叶节点都在最底层的完全二叉树

### 堆有序

- **堆有序** 当一颗二叉树满足下面任意一个条件时候，就被成为堆有序
    - 任意父节点大于等于它的两个儿子节点时
    - 任意父节点小于等于它的两个儿子节点时
 
### 二叉堆

二叉堆按照满足不同的堆有序条件，可以分为**大顶堆**和**小顶堆**。大顶堆就是任意父节点大于等于它的两个儿子节点，小顶堆刚好相反。使用大顶堆还是小顶堆就需要根据不同的场景去合适的选择，不同的选择带来的时间/空间复杂度可能也不同。例如，在求第K大的数时，如果选用小顶堆只保存K个最大的数要比使用大顶堆存入所有的数然后弹出K个数要有更好的空间和时间复杂度。

二叉堆应用： 实现优先队列

概念参考： 
-   Wiki百科
- 《算法》第四版
- 《挑战程序设计竞赛》

下面的讲解只考虑大顶堆情况，小顶堆只是比较时将大于变换成小于，后面的更新会继续增加传入比较符进行堆优化，以及利用堆排序和相关应用算法。

## 堆的性质

从定义来看，二叉堆就是特殊的完全二叉树（堆有序），因而二叉堆也可以使用数组而不需要指针来表示，并且数组（下标从1开始）满足以下性质：
1. 节点位置为 $i$ 的父节点位置为 $\lfloor i \rfloor$
2. 节点位置为 $i$ 的两个子节点位置为 $2 * i$ 和  $2 * i+1$

例如给的一个存有1-9 数字的堆，堆顶数字为9，下标为1，它的两个分别是8和6，下标为2和3，即满足完成二叉树使用数组存储时优秀性质。

![img](https://raw.githubusercontent.com/kaka2634/learn-algorithm/main/heap/img1.png)

用数组实现二叉堆的结构是很严格的，但是它的灵活性已经足够让我们高效的实现优先队列。从而能够达到**对数级别**的**插入元素和删除最大元素**的操作。利用在数组照片那个无需指针的上下移动的便利，算法保证了对数复杂度的性能。


## 堆的实现

### 接口实现

#### 上浮
如果堆中有存在某个节点比它的父节点更大（大顶堆，小顶堆则相反），那么我们就需要交换它和它的父节点来修复堆。如果交换后，仍然存在该节点比它的父节点更大，就需要继续将该节点与其父节点交换，直到整个堆达到有序状态。这个过程就是节点的上浮。

```
void swim(int idx)
{
    //判断该节点是否比其父节点更大
    while (idx / 2 > 0 && arr[idx / 2] < arr[idx]) {
        swap(idx / 2, idx);
        idx = idx / 2;
    }
}
```

#### 下沉
如果堆中存在某个节点比它的某个儿子节点要更小（大顶堆），那么就需要**选择相比较更大**的儿子节点交换来修复堆。同理，如果交换后，仍然存在该节点比它的某个儿子节点小，就需要继续进行交换，直到堆达到有序状态。这个过程就是节点的下沉。

```
void sink(int idx)
{
    //先看是否存在某个儿子节点比该节点更大
    while ((idx * 2 <= max_idx && arr[idx * 2] > arr[idx])
        || (idx * 2 + 1 <= max_idx && arr[idx * 2 + 1] > arr[idx])) {
        //如果存在，找出相比较更大的儿子节点与该节点交换    
        if (arr[idx * 2] > arr[idx * 2 + 1] || idx * 2 + 1 > max_idx) {
            swap(idx * 2, idx);
            idx = idx * 2;
        } else {
            swap(idx * 2 + 1, idx);
            idx = idx * 2 + 1;
        }
    }
}
```

看到上浮和下沉的定义你可能存在疑问了，上浮和下沉一个是儿子节点不满足堆有序，一个是父节点不满足有序，其实值得都是是一种堆不有序的情况，只不过是分别站在儿子节点和父节点不同的角度去看待。所以后面的分析可以看到，对一个不是堆有序的数组，可以分别通过对数组中各个元素只使用上浮操作，或者对数组中各个元素只使用下沉操作，使得整个数组达到堆有序的状态。当然，具体选择什么操作会产生的时间复杂度和最后生成的堆并不是相同的。

#### 插入元素
向堆中插入元素，可以使用先将该元素放到数组的结尾，然后上浮该节点的策略。

```
void push(int val)
{
    arr[++max_idx] = val;
    swim(max_idx);
}
```

构造堆时候，可以考虑不断调用插入元素的方式（其实就是对每个元素使用上浮操作），这样的时间复杂度将会是 $O(nlogn)$。

提前思考下会有 $O(n)$ 的方式去构造堆吗？

#### 删除堆顶元素

删除堆顶元素，可以使用将该堆顶元素和末尾元素交换，再删掉末尾元素，对交换过来打破堆有序的元素使用下沉操作的策略。

```
int pop()
{
    int res = arr[1];
    swap(1, max_idx);
    max_idx--;
    sink(1);
    return res;
}
```

[完整代码链接 heap.cpp](https://github.com/kaka2634/learn-algorithm/blob/main/heap/heap.cpp)

### 提升1：减少交换次数

当使用上浮或者下沉操作时，每次都需要交换父节点和儿子节点值。其实可以记录需要上浮或者下沉的值，等找到合适的位置再去放置，而不需要每次都去交换。该思路类似于插入排序对比于冒泡排序，从而使交换次数要更少，紧紧需要移动赋值操作。

#### 上浮
```
void swim(int idx)
{
    //更新1：先记录上浮的值
    int val = arr[idx];
    //更新2： 这里要改为与val的比较
    while (idx / 2 > 0 && arr[idx / 2] < val) {
        //更新3： 将parent先往下移，给val让位
        arr[idx] = arr[idx / 2];
        idx = idx / 2;
    }
    //更新4： 最后再将val 放入合适位置
    arr[idx] = val;
}
```
#### 下沉
```
void sink(int idx)
{
    //更新1：先记录下沉的值
    int val = arr[idx];
    //更新2：这里要改为与val的比较
    while ((idx * 2 <= max_idx && arr[idx * 2] > val)
        || (idx * 2 + 1 <= max_idx && arr[idx * 2 + 1] > val)) {
        //选择儿子中更大的数与父亲交换，两个儿子也需要比较
        if (arr[idx * 2] > arr[idx * 2 + 1] || idx * 2 + 1 > max_idx) {
            //更新3： 将儿子上移，给val 让位
            arr[idx] = arr[idx * 2];
            idx = idx * 2;
        } else {
            arr[idx] = arr[idx * 2 + 1];
            idx = idx * 2 + 1;
        }
    }
    //更新4：最后再将val 放入合适位置
    arr[idx] = val;
}
```
[完整代码链接 heap_improve_1.cpp](https://github.com/kaka2634/learn-algorithm/blob/main/heap/heap_improve_1.cpp)

### 提升2： 将获取较大的儿子节点的逻辑封装
对于下沉操作，其实我们封装一个函数，直接返回两个儿子中较大的儿子节点。那么返回的情况就是：
- 返回左儿子：左儿子较大 或者 没有右儿子
- 返回右儿子：有右儿子 且 右儿子较大  

这里没有左儿子存在的判断，因而需要对返回值进行是否有左儿子的判断。

#### 返回较大的儿子下标
```
int son(int idx)
{
    return idx * 2 + (idx * 2 + 1 <= max_idx && arr[idx * 2 + 1] > arr[idx * 2]);
}
```
#### 下沉
```
void sink(int idx)
{
    int val = arr[idx];
    //更新：通过son函数找到更大的儿子，parent直接与最大儿子比较
    int son_idx = son(idx);
    //注意： 这里用val 而不是用arr[idx]去和arr[son_idx]比较
    while (son_idx <= max_idx && val < arr[son_idx]) {
        arr[idx] = arr[son_idx];
        idx = son_idx;
        son_idx = son(idx);
    }
    arr[idx] = val;
}
```
[完整代码链接 heap_improve_2.cpp](https://github.com/kaka2634/learn-algorithm/blob/main/heap/heap_improve_2.cpp)

### 提升3： 采用下沉方式构造堆

前面使用插入元素的方式构造堆，时间复杂度是 $O(nlogn)$。插入元素其实就是上浮操作。那么能不能通过对各个元素进行下沉操作，同样达到堆有序的情况。对于下沉操作达到有序性，并不需要对叶子节点进行操作，所以只需要对前n/2个元素遍历。

#### 构造堆
```
void build(int nums[], int n)
{
    max_idx = n;
    //先将数组一一赋值到heap数组中
    for (int i = 0; i < n; i++) {
        arr[i + 1] = nums[i];
    }
    //从n/2的元素开始，向堆顶遍历，逐个下沉到合适位置
    for (int i = max_idx / 2 ; i > 0; --i) {
        sink(i);
    }
}
```
通过下沉生成的堆的顺序是
```
9 8 7 4 5 6 3 2 1
```
而通过插入元素方式生成堆的顺序是
```
9 8 6 7 3 2 5 1 4
```
两个结果均满足堆有序，因而采用上浮和下沉操作生成结果不一定相同，但都满足了二叉堆的性质。

#### 时间复杂度分析

假定元素个数为 $n$, 那么每层元素的下沉次数是
- 倒数第1层，总共 $n - \lfloor n/2 \rfloor$ 个元素, 累计最多下沉 $0$ 次
- 倒数第2层，总共 $\lfloor n/2 \rfloor - \lfloor n/4 \rfloor$ 个元素, 累计最多下沉 $(\lfloor n/2 \rfloor - \lfloor n/4 \rfloor) * 1$ 次
- 倒数第3层，总共 $\lfloor n/4 \rfloor - \lfloor n/8 \rfloor$ 个元素, 累计最多下沉 $(\lfloor n/4 \rfloor - \lfloor n/8 \rfloor) * 2$ 次
...
- 顶层， 总共 $1$ 个元素，累计最多下降 $logn$ 层

那么总的累计下沉次数 $T$ 是
$$\begin{aligned} T &= (\lfloor n/2 \rfloor - \lfloor n/4 \rfloor) * 1 + (\lfloor n/4 \rfloor - \lfloor n/8 \rfloor) * 2 + (\lfloor n/8 \rfloor - \lfloor n/16 \rfloor) * 3 + ...  \\&=  \lfloor n/2 \rfloor + \lfloor n/4 \rfloor + \lfloor n/8 \rfloor + ...  \\&\leqslant n/2 + n/4 + n/8 + ... \\& < n \end{aligned}$$

所以时间复杂度仅为 $O(n)$


[完整代码链接 heap_improve_3.cpp](https://github.com/kaka2634/learn-algorithm/blob/main/heap/heap_improve_3.cpp)

