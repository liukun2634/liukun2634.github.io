---
layout: post
title: NS3 教程
categories: study
tag: ns3
subtitle: "你的第一个ns3仿真脚本"
header-img: "../images/ns3/1.jpg"
---


>依据ns3 Tutorial给与的second.cc文件，参考Doxygen API文档，写出第一个以CSMA框架上的数据发送与接收，目的是了解整个测试文件的整体结构以及如何根据文档来使用ns3提供API接口。


## 查询技巧

+ 搜索很有用
+ 关键词查找
+ 看到有help首先点，
+ 类中的说明很重要。

## 总体组成部分

文档总体以下几个组成部分：

1. Node(NodeContainer)：简单产生节点的个数

2. CSMA(CsmaHelper)：包括Channel和NetDevice(NetDeviceContainer)的设置，先设置CSMA Channel的参数，之后将参数安装给对应的节点，并返回产生NetDevice对象以为分配IP地址使用。

3. Internet: 包括Stack和IP address两个部分。首先，配置使用的Stack(InternetStackHelper),并安装给对应的节点(Node)。在已有stack的基础上，在设置IP address(这里使用Ipv4AddressHelper)，并将地址分配给各个NetDevice，返回一个Ipv4InterfaceContainer对象供之后client需要获取地址使用。

4. Application：包括Server和Client两个部分。均需要设置参数和端口(port),然后安装返回一个  ApplicationContainer 对象，通过ApplicationContainer 对象来启动和关闭application。

5. Routing：设定所使用的路由策略，这里使用Ipv4GlobalRoutingHelper。

6. others：包括头文件,LOG,cmd,PCAP和 simultator几个部分。

## 头文件

```
#include "ns3/core-module.h"
#include "ns3/csma-module.h"
#include "ns3/internet-module.h"
#include "ns3/network-module.h"
#include "ns3/applications-module.h"
```

**引入必须头文件的方法**：在Doxygen文档中找到 (右上方搜索关键词) 需要使用类所在的module模块总名称，在头文件中添加#include “ns3/模块名称-module.h”就可以了。

说明：

1. 使用"ns3/" 是因为不在同一个目录下就需要使用"n3/"来引人别的module这在新建module需要注意，不过增加“n3/”肯定是对的。

2. core-module包含Object、Callback、Attribute和Simulator的类，因而一般肯定引入。

3.  csma，internet，network和application正是几个关键部分的module，可在写文档时，需要时候就增加在头文件中。

## 命名空间

```
using namespace ns3;
```

命名空间使用ns3，类似std，之后文档就不需要使用"ns3::"，个别module中会可能引入新的命名空间。

## 主函数

```
int 
main (int argc, char *argv[])
{
}
```

## Node

参看Doxygen文档的[NodeContainer ](https://www.nsnam.org/doxygen/classns3_1_1_node_container.html)

```
NodeContainer nodes;
nodes.Create(2);
```

先新建NodeContainer类的对象，再使用Create (uint32_t n) 方法建立节点。这样建立的节点对象没有任何配置，需要在后面为之配置。

## Channel and Devices（CSMA）

既然要基于CSMA的框架上传送数据，那么在Doxygen上搜索Csma，一般先看有没有helper，helper一般是为了建立对象而准备的。搜索到csmahelper ns3点击，参看[CsmaHelper](https://www.nsnam.org/doxygen/classns3_1_1_csma_helper.html)，它是结果就是产生节点的NetDeviceContainer (写的是a set of CsmaNetDevice，但是install返回是NetDeviceContainer，因而NetDeviceContainer包含一系列的CsmaNetDevice)。

```
CsmaHelper csmaNode;
```
这样建立了一个csmaNode对象，但是这个helper对象没有任何配置。

那么怎么配置对象产生NetDeviceContainer：继续向下有没有返回NetDeiceContainer的方法，找到有多个Install方法就是通过输入节点就能够返回一个NetDeviceContainer的对象。点击输入参数只有节点的[Install](https://www.nsnam.org/doxygen/classns3_1_1_csma_helper.html#af79a91372595230b0817200270ab84e7)方法,可以知道该方法通过设置CsmaChannel的属性后，输入所需配置Node节点，就能为节点配置channel的参数，并返回该节点对应的一个NetDeviceContainer。

那么CsmaChannel有哪些属性：点击[CsmaChannel](https://www.nsnam.org/doxygen/classns3_1_1_csma_channel.html),看到Detailed Description一栏中的Attribute有DataRate和Delay两个属性。

这样就可以根据[CsmaHelper::SetChannelAttribute](https://www.nsnam.org/doxygen/classns3_1_1_csma_helper.html#a886d900b2fe44433e0b81752dea7e7f1)方法来通过csmaNode对象来设置Channel的属性值。

```
csmaNode.SetChannelAttribute("DataRate",StringValue("100Mbps"));
csmaNode.SetChannelAttribute("Delay",StringValue("6560ns"));
```

设置好属性值后，就可以为节点安装(install)配置了，再返回一个NetDeviceContainer对象。

```
NetDeviceContainer csmaNetDevice;
csmaNetDevice=csmaNode.Install(nodes);
```

这里NetDeviceContainer对象csmaNetDevice为后面分配addres作链接
**整个使用连接线：Node->NetDevice（前提配置channel）->AddressInteface(前提配置stack和addres)->ClientHelp**。

## Internet

Internet包括三个部分：Stack、Address和 Interface。

1. 首先需要看Stack，这里使用InternetStack。同理，Doxygen的右上方搜索InternetStack，找有没有helper ns3后缀的，点击[InternetStackHelper](https://www.nsnam.org/doxygen/classns3_1_1_internet_stack_helper.html) 。

如何给节点分配对应的协议栈，向下又找到输入参数是NodeContainer的[install](https://www.nsnam.org/doxygen/classns3_1_1_internet_stack_helper.html#a3575bfbaafc7b35b107d8ac8abad57b5)方法,两步搞定分配协议栈。

```
InternetStackHelper internetStackHelper;
internetStackHelper.Install(nodes);
```

2. 再看Address，这里使用ipv4地址。搜索ipv4address，找到[Ipv4AddressHelper](https://www.nsnam.org/doxygen/classns3_1_1_ipv4_address_helper.html)

**采用类似获取Devices中方法，倒着寻找，先找输出方法再找配置的方法，写的时候先配置后输出方法。**

输出方法我们需要的是返回Ipv4InterfaceContainer对象的方法，即[Ipv4AddressHelper::Assign](https://www.nsnam.org/doxygen/classns3_1_1_ipv4_address_helper.html#af8e7f4a1a7e74c00014a1eac445a27af)方法。查看文档还需要[Ipv4AddressHelper::SetBase](https://www.nsnam.org/doxygen/classns3_1_1_ipv4_address_helper.html#acf7b16dd25bac67e00f5e25f90a9a035)来设置基本的Addres。

```
Ipv4AddressHelper ipv4AddressHelper;
ipv4AddressHelper.SetBase("10.1.1.0","255.255.255.0");
```

之后Ipv4AddressHelper可调用Assign方法来安顺序为NetDeviceCotainer分配地址。

3. 返回的是Ipv4InterfaceContainer对象，所以新建对象接收返回值。

```
Ipv4InterfaceContainer ipv4InterfaceContainer;
ipv4InterfaceContainer=ipv4AddressHelper.Assign(csmaNetDevice);
```

## Application

[Application](https://www.nsnam.org/doxygen/group__applications.html)主要包括server和client两个部分。先设置Application 使用的协议(Udp/TCP等)，这里使用Udp

先为Application设置对应的输出log日志，对应不同Application有不同[LogComponent](https://www.nsnam.org/doxygen/_log_component_list.html)，需要在All LogComponents中对应寻找。
```
LogComponentEnable("UdpClient",LOG_LEVEL_INFO);
LogComponentEnable("UdpServer",LOG_LEVEL_INFO);
```

这里使用Udp作为传输协议，Udp也有两种，一种是正常的一发一收 [Udp](https://www.nsnam.org/doxygen/group__udpclientserver.html),一种是接收并回复 的[UdpEcho](https://www.nsnam.org/doxygen/group__udpecho.html),两种的设置完全相同，只需在写法上增加或取消"Echo"就可以实现两种变换(LogComponent还需要增加"Application")。

**Server**

[UdpServerHelp](https://www.nsnam.org/doxygen/classns3_1_1_udp_server_helper.html)在[初始化](https://www.nsnam.org/doxygen/classns3_1_1_udp_server_helper.html#aaca1535faca2b749f026c5ca6b5025a4)上首先需要端口号,否则报错non-class type ‘ns3::UdpServerHelper()’。建立之后通过[install](https://www.nsnam.org/doxygen/classns3_1_1_udp_server_helper.html#a7a92fc7bb7f29540ede727090de225b1)就可以将对应节点配置为UdpServer，并返回[ApplicationContainer](https://www.nsnam.org/doxygen/classns3_1_1_application_container.html)对象。

```
UdpServerHelper server (9);
ApplicationContainer serverApps = server.Install (nodes.Get (1));
```

ApplicationContainer的[Start](https://www.nsnam.org/doxygen/classns3_1_1_application_container.html#a8eff87926507020bbe3e1390358a54a7)和[Stop](https://www.nsnam.org/doxygen/classns3_1_1_application_container.html#adfc52f9aa4020c8714679b00bbb9ddb3)两个方法控制着Apllication的运行时间。

``` 
serverApps.Start (Seconds (1.0));
serverApps.Stop (Seconds (10.0));
```

**Client**

[UdpClientHelp](https://www.nsnam.org/doxygen/classns3_1_1_udp_client_helper.html)相比Server需要更多的配置。UdpClientHelp的[初始化](https://www.nsnam.org/doxygen/classns3_1_1_udp_client_helper.html#a7f5eaa65b23aecc1985bcfd23404c9b1)还需要通过Interface来获取的Server地址与端口号。

此外，因为是client发送（TOEXPLAIN: 为什么是Client发送？），所以需要[UdpClientHelper::SetAttribute	](https://www.nsnam.org/doxygen/classns3_1_1_udp_client_helper.html#a8bbae16a28f85ab3f3b5aa4642edfeae)配置包的相关属性。（server当然也有属性的设置，但是这里设置client，server使用默认值）具体属性在[UdpClient](https://www.nsnam.org/doxygen/classns3_1_1_udp_client.html)中的Detailed Description中可以查看。

```
UdpClientHelper client (ipv4InterfaceContainer.GetAddress (1), 9);
client.SetAttribute ("MaxPackets", UintegerValue (2));
client.SetAttribute ("Interval", TimeValue (Seconds (1.0)));
client.SetAttribute ("PacketSize", UintegerValue (1024));
```

同样，返回一个ApplicationContainer对象，设置Start与Stop。

```
ApplicationContainer clientApps = client.Install (nodes.Get (0));
clientApps.Start (Seconds (2.0));
clientApps.Stop (Seconds (10.0));
```

## Routing

使用ipv4协议栈的简单路由策略[Ipv4GlobalRoutingHelper](https://www.nsnam.org/doxygen/classns3_1_1_ipv4_global_routing_helper.html)。
```
Ipv4GlobalRoutingHelper::PopulateRoutingTables ();
```
Ipv4GlobalRoutingHelper这里没有新建对象,所以直接用"::"访问方法函数PopulateRoutingTables ()产生一个routing database并初始化路由表。

## Simulator

通过[Simulator](https://www.nsnam.org/doxygen/classns3_1_1_simulator.html)开始与结束仿真。

```
Simulator::Run ();
Simulator::Destroy ();
```
Simulator是core module中的类，这里没有新建对象,所以直接用"::"访问方法函数。

## 运行

拷贝文件到scratch 目录下,进入ns根目录，终端输入

```
$ ./waf
$ ./waf --run scratch/文件名 #不需要.cc后缀名
```

Ta da.. .
就可以显示结果了，接下来通过修改参数查看结果有何变化。
