---
layout: post
title: 动态数组的扩容分析
categories: study
tags: [数据结构, 数组]
subtitle: "就从这个分析开始总结更多技术知识"
mathjax: true
comment: true
---

##  预热问题

问题1： 对于动态数组（C++ Vector 和 Java Array List），数组大小是$n$，这时候从最后插入数据，时间复杂度将会是多少？

直接给出答案：正常插入一个数据，是 $O(1)$, 但最会坏的情况是 $O(n)$ 。
原因是因为当容量超出数组的限制, 那么会新建一个扩容的数组，并且将拷贝所有数据到新扩容的数组之中，所以时间复杂度将会是 $O(n)$。

## 理论分析

问题2： 如果向初始大小为0的数组，从数组末尾连续插入$n$条数据，时间复杂度将怎么分析呢？

假定数组每次扩容系数是$m$，那么插入$n$条数据，总共大约需要扩容 $log_mn$次。

- 第 $1$ 次扩容，拷贝 $m^0 $ 个数据
- 第 $2$ 次扩容，拷贝 $m^1 $ 个数据
- 第 $3$ 次扩容，拷贝 $m^2 $ 个数据
- ...
- 第$log_mn$ 次扩容，拷贝 $m^{log_mn} $ 个数据

总共拷贝次数 $TotalCopyTimes$

{%raw%}
$$\begin{aligned}TotalCopyTimes &= m^0 + m^1 + m^2 + ... + m^{log_mn} \\&= \displaystyle \sum^{log_mn}_{i = 0} m^i = {{m^0 - m^{log_mn}*m} \over {1 - m}} \\&= {{mn - 1} \over {m - 1}} \approx {{mn} \over {m - 1} }\end{aligned}$$
{% endraw %}

均摊到每次一插入拷贝次数 $EachCopyTimes$ 

{%raw%}
$$\begin{aligned}EachCopyTimes \approx {{m} \over {m - 1} }\end{aligned}$$
{% endraw %}

由于$m$ 将是一个固定的常数 （通常 $1 < m <= 2$)，所以总的时间复杂度近似为拷贝次数就是 $O(n)$ ，均摊到每一个插入操作的时间复杂度将是 $O(1)$ 。

## 测试分析

#### C++ Vector

首先让我们来看看，C++ 的vector 是怎么扩容的。我们初始化一个空的vector,然后不断的在最后面插入数据。

```
#include <iostream>
#include <vector>
using namespace std;

void print_array(int push_times, vector<int>& array)
{
    cout << "push times: " << push_times << " size: " << array.size() << " capacity: " << array.capacity() << endl;
}

const int MAX_PUSH_TIMES = 10;
int main()
{
    vector<int> a1;
    print_array(0, a1);

    for (int i = 0; i < MAX_PUSH_TIMES; i++) {
        a1.push_back(1);
        print_array(i + 1, a1);
    }
    return 0;
}
```
**测试结果：**
```
push times: 0 size: 0 capacity: 0
push times: 1 size: 1 capacity: 1
push times: 2 size: 2 capacity: 2
push times: 3 size: 3 capacity: 4
push times: 4 size: 4 capacity: 4
push times: 5 size: 5 capacity: 8
push times: 6 size: 6 capacity: 8
push times: 7 size: 7 capacity: 8
push times: 8 size: 8 capacity: 8
push times: 9 size: 9 capacity: 16
push times: 10 size: 10 capacity: 16
```
**分析：** 可以看到vector最开始的capacity 是0， 后面将会以2倍扩展因子扩容（minGW编译器， 扩容因子的大小是根据编译器来自行确定的)，因而随着vector中的数据的增加，capacity 大小将是 0, 1, 2, 4, 8, 16 ...

**注意：**
- 初始化时候，如果大概知道容量，使用成员函数reserve()设置容量的大小，从而避免多次扩容
- 只有当size超过了capacity才会扩容，等于size 也不会扩容 
- 扩容会导致迭代器失效，因为会新建新的数组，再拷贝数据过去


现在针对问题2，来统计一下vector不断插入数据后真实的时间消耗：

```
#include <iostream>
#include <time.h>
#include <vector>
using namespace std;

int main()
{
    int push_times = 10e4; //初始化push times的大小，如果太小时间将没法统计
    int calculate_times = 4; //控制push times乘10的次数
    clock_t startTime, endTime; 
    for (int t = 0; t < calculate_times; t++) {
        vector<int> a1;
        startTime = clock();
        for (int i = 0; i < push_times; i++) {
            a1.push_back(1);
        }
        endTime = clock();
        cout << "Push " << push_times << " times, Time cost: " << (double)(endTime - startTime) / CLOCKS_PER_SEC << "s" << endl;
        push_times *= 10;
       
    }
    return 0;
}
```

**测试结果：**
```
Push 100000 times, Time cost: 0.001s
Push 1000000 times, Time cost: 0.014s
Push 10000000 times, Time cost: 0.152s
Push 100000000 times, Time cost: 1.463s
```


**分析：** 我们没办法计算时间复杂度是否是跟理论公式完全一致（当然，实际上时间复杂度不仅仅是拷贝次数，还有新建数组的时间，这里后面也会分析到），只能从是否是线性增长的角度去看时间复杂度是否是 $O(n)$。当然，从测试结果来看，完全符合线性增长的趋势。累计插入n条数据的时间复杂度就是 $O(n)$。

**注意：** 但当push times 到达了 $10^7$ 后，会报出std::bad_alloc error。可以继续探究这个capacity的限制是在内存还是vector 的定义中。


这里再回到问题1， 如果只插入一个，达到了capacity， 拷贝的时间会占用多少呢？
```
#include <iostream>
#include <time.h>
#include <vector>
using namespace std;

int main()
{
    vector<int> init_push_times = { 16777215, 134217727 };

    clock_t startTime, endTime;
    for (int t = 0; t < init_push_times.size(); t++) {
        vector<int> a1;
        for (int i = 0; i < init_push_times[t]; i++) {
            a1.push_back(1);
        }
        for (int i = 0; i < 2; i++) {
            cout << "size: " << a1.size() << " capacity: " << a1.capacity() << endl;
            startTime = clock();
            a1.push_back(1);
            endTime = clock();
            cout << "Push 1 time, Time cost: " << (double)(endTime - startTime) / CLOCKS_PER_SEC << "s" << endl;
            cout << "size: " << a1.size() << " capacity: " << a1.capacity() << endl;
            cout << endl;
        }
    }

    return 0;
}
```
**测试结果：** 
```
size: 16777215 capacity: 16777216
Push 1 time, Time cost: 0s
size: 16777216 capacity: 16777216

size: 16777216 capacity: 16777216
Push 1 time, Time cost: 0.024s
size: 16777217 capacity: 33554432

size: 134217727 capacity: 134217728
Push 1 time, Time cost: 0s
size: 134217728 capacity: 134217728

size: 134217728 capacity: 134217728
Push 1 time, Time cost: 0.18s
size: 134217729 capacity: 268435456
```
**分析：** 只插入一次数据，扩容到134,217,728(Time cost: 0.18s), 相比于持续插入100,000,000数据(Time cost: 1.463s)，时间要少了不少，也远没达到理论计算累计拷贝次数会是单次拷贝n个数据的m倍(这里m=2)。这是因为累计插入实际时间除了拷贝次数，还有包括每次new数组的时间，每次判断等语句的执行时间。因而，我们只能仍从增长是否是线性的角度，看单次扩容的时间复杂度。

从测试结果可以看出，如果插入一个数据，此时size大小超过了capacity，时间仍然将会是线性的增加，所以插入一个数据最坏情况时间复杂度将会达到 $O(n)$。 但如果插入一条数据，size没有超过capacity，就没有拷贝的过程，所以时间复杂度是 $O(1)$.

#### Java ArrayList

下面来看看Java的ArrayList是怎么扩容的（使用jdk8）

```
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class CalculateArrayList {
    private static int MAX_PUSH_TIMES = 20;

    public static void main(String[] args) throws Exception {
        List<Integer> list = new ArrayList<>();
        printArray(0, list);
        for (int i = 0; i < MAX_PUSH_TIMES; i++) {
            list.add(1);
            printArray(i + 1, list);
        }
    }

    //Use Reflection to get Capacity
    private static int getCapacity(List<Integer> array) throws Exception {
        Field field = ArrayList.class.getDeclaredField("elementData");
        field.setAccessible(true);
        return ((Object[]) field.get(array)).length;
    }

    private static void printArray(int pushTimes, List<Integer> list) throws Exception {
        System.out.println("push times: " + pushTimes + " size: " + list.size() + " capacity: " + getCapacity(list));
    }
}
```

**测试结果：**

```
push times: 0 size: 0 capacity: 0
push times: 1 size: 1 capacity: 10
push times: 2 size: 2 capacity: 10
push times: 3 size: 3 capacity: 10
push times: 4 size: 4 capacity: 10
push times: 5 size: 5 capacity: 10
push times: 6 size: 6 capacity: 10
push times: 7 size: 7 capacity: 10
push times: 8 size: 8 capacity: 10
push times: 9 size: 9 capacity: 10
push times: 10 size: 10 capacity: 10
push times: 11 size: 11 capacity: 15
push times: 12 size: 12 capacity: 15
push times: 13 size: 13 capacity: 15
push times: 14 size: 14 capacity: 15
push times: 15 size: 15 capacity: 15
push times: 16 size: 16 capacity: 22
push times: 17 size: 17 capacity: 22
push times: 18 size: 18 capacity: 22
push times: 19 size: 19 capacity: 22
push times: 20 size: 20 capacity: 22
```

**分析：** 可以看到ArrayList采取了不同的扩容策略，初始化的容量是0，但一旦压入一个数据后，直接将capacity设置为10，之后如果超出了，就会按照扩容因子为1.5的大小来扩容。

这里就不分析在Java ArrayList 中的时间复杂度了，因为根据扩容实现，理论上同样也会是一样的时间复杂度。后面需要进一步探索一下Java 的 Collection内部实现。
