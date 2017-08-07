# frame-export-excel
    js 实现 导出 excel 文件。目前导出的excel 文件只支持 2003。

# 导出分为三种方式
1. 本地静态数据，由js生成json 数据然后导出成excel，具体如下：

        步骤一：页面上初始化一个A标签作为导出媒介。如下：
            <a id="eleAExport" >本地数据导出</a>
        步骤二：定义头部（excel）列名的json描述。如下
            var col = [{"id","编号"},{"name","姓名"}]
        步骤三：生成需要导出的json 数据，如下：
            var data = [{"id"=1,"name":"张三"},{"id"=2,"name":"李四"}]
        步骤四：初始化导出对象：
            var exportE = new ExportExcel({
                "data": data,  //必传  生成的数据
                "eleA": "eleAExport",  // 必传 导出媒介A标签的id
                "type": "local", //必传  以什么方式导出  local 表示本地数据
                "headers": col,  //必传 头信息
                "fileName": "本地数据",// 可空 默认（export_excel_laioin） 导出的文件名称
                "initSuccess": function () {   // 可空 默认（初始化完成后直接导出文件） 初始化完成后的回调
                    console.log("--- load success ---");
                }
            });
         步骤五：进行初始化操作
             exportE.init();
2. 加载后台数据并导出excel。具体如下：

         步骤一：页面上初始化一个A标签作为导出媒介。如下：
            <a id="eleAExportExt" >加载后台数据导出</a>
         步骤二：定义头部（excel）列名的json描述。如下
            var col = [{"id","编号"},{"name","姓名"}]
         步骤三：初始化导出对象：
            // 注意，这里加了jquery 的ajax 请求，所以需要进入，jquery
            var loadExport = new ExportExcel({
                "eleA": "eleAExportExt", // 必传 导出媒介A标签的id
                "fileName": "后台数据", // 可空 默认（export_excel_laioin） 导出的文件名称
                "requestType": "get", // 可空 默认（POST） 数据访问的方式
                "requestData": { // 请求数据
                    "size": 3 // 只生成三行数据
                },
                "headers": col,  //必传 头信息
                "type": "load", //必传  （load）表示通过url 远程获取数据,(默认就是 load)
                "requestUrl": "/data/get.json",  //必传  请求路径
                "responseDataType": "json",  // 可空  默认 （json） 数据返回的格式
                "initSuccess": function () {   // 可空 默认（初始化完成后直接导出文件） 初始化完成后的回调
                    console.log("--- load  后台数据 success ---")
                    // 想要在这里执行导出，就执行 onExport 方法
                    loadExport.onExport(); // 导出
                }
            });
         步骤四：执行初始化：
            loadExport.init(); // 执行加载操作
3. 把页面上的table标签，导出成excel，具体如下：

        步骤一：页面上初始化一个A标签作为导出媒介。如下：
            <a id="tableA_ext" >table标签导出</a>
        步骤二：初始化导出对象：
             var tableExport = new ExportExcel({
                "eleA": "tableA_ext",// 必传 导出媒介A标签的id
                "fileName": "页面table", // 可空 默认（export_excel_laioin） 导出的文件名称
                "type": "table", //必传  table 表示页面上table标签导出
                "tableId": "table-excel"  // 页面的table ID
                //initSuccess // 可空 默认（初始化完成后直接导出文件） 初始化完成后的回调
            });
        步骤三：执行初始化
            tableExport.init(); // 执行加载操作