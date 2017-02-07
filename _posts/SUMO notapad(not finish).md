# SUMO Tutorials

### Hello Sumo

👉 [hello turorial](http://sumo.dlr.de/wiki/Tutorials/Hello_Sumo)

SUMO 包括**nodes** (junctions) 、**edges **(street consist of junctions) 和 **routes** 三个部分组成。

1. 新建hello.nod.xml表示nodes:

   ```python
   <?xml version="1.0" encoding="UTF-8"?>
   <nodes xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://sumo.dlr.de/xsd/nodes_file.xsd">
       <node id="1" x="-250.0" y="0.0" />
       <node id="2" x="+250.0" y="0.0" />
       <node id="3" x="+251.0" y="0.0" />
   </nodes>
   ```

   *第一行是xml version标识。*

2. 新建hello.edg.xml表示edge

   ```python
   <?xml version="1.0" encoding="UTF-8"?>
   <edges xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://sumo.dlr.de/xsd/edges_file.xsd">
       <edge from="1" id="1to2" to="2" />
       <edge from="2" id="out" to="3" />
   </edges>
   ```

3. 产生 hello.net.xml文件

   ```shell
   netconvert --node-files=hello.nod.xml --edge-files=hello.edg.xml --output-file=hello.net.xml
   ```

4. 新建hello.rou.xml表示router

   ```python
   <?xml version="1.0" encoding="UTF-8"?>
   <routes xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://sumo.dlr.de/xsd/routes_file.xsd">
     <vType accel="1.0" decel="5.0" id="Car" length="5.0" minGap="2.0" maxSpeed="50.0" sigma="0" />

     <route id="route0" edges="1to2 out" />

     <vehicle depart="1" id="veh0" route="route0" type="Car" />
   </routes>
   ```

5. 新建 hello.sumo.cfg配置net和router

   ```python
   <?xml version="1.0" encoding="UTF-8"?>

   <configuration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://sumo.dlr.de/xsd/sumoConfiguration.xsd">

       <input>
           <net-file value="hello.net.xml"/>
           <route-files value="hello.rou.xml"/>
       </input>

       <time>
           <begin value="0"/>
           <end value="10000"/>
       </time>

       <gui_only>
           <gui-settings-file value="hello.settings.xml"/>
       </gui_only>

   </configuration>
   ```

6. 运行cfg文件

   ```shell
   sumo -c hello.sumocfg
   ```

   或者使用gui

   ```shell
   sumo-gui -c hello.sumocfg
   ```

7. 修改配置，新建hello.settings.xml文件可提前设定参数

   ```python
   <viewsettings>
       <viewport y="0" x="250" zoom="100"/>
       <delay value="100"/>
   </viewsettings>
   ```

   需要在cf文件中增加gui-setting项，前面已经增加了。









