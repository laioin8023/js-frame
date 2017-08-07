/**
 * Created by  on 2017/7/26.
 */
/**
 * 导出excel的插件
 *  config =  {"data":{},"eleA":Object,"fileName":"学生成绩","loadDataSuccess":Object}
 *
 * @param data  json数组 [{"id":1,"name":"李四"},{"id":2,"name":"李s"}]
 * @param eleA 导出按钮 a  标签  ID，
 * @param fileName 文件名称 ： 学生成绩
 * @param loadDataSuccess  数据加载成功，表示可以导出excel 文件了
 * @param requestType 请求类型 get ，pose ， 默认post
 * @param requestData 请求参数  {}  json
 * @param requestUrl  请求地址
 * @param responseDataType 返回的数据类型 ， json ，xml 等 , 默认json
 * @param type 类型，local 表示本地数据，load 表示通过url 远程获取数据，table 表示导出html的一个table为excel
 * @param headers ，头部信息  [{"id":"编号"}，{"name":"名称"}]
 * @constructor
 */
//data, eleA, fileName,initSuccess,requestType,requestData,requestUrl,responseDataType
var ExportExcel = function (configs) {
    var flag = "export_excel_laioin"; // 标记
    var _self = this;

    /**
     * 初始化，导出功能
     */
    this.init = function () {
        //local 表示本地数据，load 表示通过url 远程获取数据，table 表示导出html的一个table为excel
        var headerKey = [];
        var tableHeader = [];
        initDefaultConfig();// 初始化，默认参数
        if ("local" === configs["type"]) { // 本地数据导出
            initHeader(tableHeader, headerKey);
            var tableHtml = initTable(tableHeader, headerKey);
            intExport(tableHtml);
        } else if ("load" === configs["type"]) { // 表示通过url 远程获取数据
            initHeader(tableHeader, headerKey);
            loadData(tableHeader, headerKey);  // 执行导出
        } else if ("table" === configs["type"]) { // 表示导出html的一个table为excel
            tableExport();// 执行导出
        }
    }

    // 初始化头
    function initHeader(tableHeader, headerKey) {
        var headers = configs["headers"];
        tableHeader.push("<thead><tr>");
        for (var itemCol in headers) {
            for (var colKey in  headers[itemCol]) {  // 列 key
                headerKey.push(colKey);
                tableHeader.push("<th>");
                tableHeader.push(headers[itemCol][colKey]);
                tableHeader.push("</th>")
            }
        }
        tableHeader.push("<tr></thead>");
    }

    // 初始化，默认参数
    function initDefaultConfig() {
        if (undefined != configs["eleA"]) {  // 获取，下载按钮a标签
            configs["domA"] = document.getElementById(configs["eleA"]);
        } else {
            var exce = new ExportException();
            exce.elea_is_null();
            throw exce; // 抛出异常
        }
        configs["fileName"] = configs["fileName"] == undefined ? flag : configs["fileName"];// 默认名称
        configs["requestType"] = configs["requestType"] == undefined ? "POST" : configs["requestType"]; // 默认请求方式
        // 默认，返回格式
        configs["responseDataType"] = configs["responseDataType"] == undefined ? "JSON" : configs["responseDataType"];
        if (undefined == configs["initSuccess"]) { // 如果初始化成功，回调没传就默认导出文件了
            configs["initSuccess"] = function () {
                _self.onExport(); // 执行导出
            }
        }
        configs["type"] = configs["type"] == undefined ? "load" : configs["type"]; // 默认用 url 获取数据的方式导出文件
    }


    // 页面table 的方式导出
    function tableExport() {
        var domTable;
        if (undefined != configs["tableId"]) {
            domTable = document.getElementById(configs["tableId"]); // 获取table对象
        } else {
            var exce = new ExportException();
            exce.html_table_is_null();
            throw exce; // 抛出异常
        }
        // outerHTML 是带当前标签的html
        var tableHtml = domTable.outerHTML;
        intExport(tableHtml);
    }

    // 初始化body
    function initBody(headerKey) {
        if (undefined != configs["data"]) {
            var tableBody = [];
            tableBody.push("<tbody>");
            for (var itemData in configs["data"]) {
                tableBody.push("<tr>");
                for (var itemKey in headerKey) {  // 列对应的key
                    tableBody.push("<td>");
                    tableBody.push(configs["data"][itemData][headerKey[itemKey]]);  // 值
                    tableBody.push("</td>");
                }
                tableBody.push("</tr>");
            }
            tableBody.push("</tbody>");
            return tableBody;
        } else {
            var exce = new ExportException();
            exce.data_is_null();
            throw exce; // 抛出异常
        }
    }

    // 初始化，table
    function initTable(tableHeader, headerKey) {
        var tableBody = initBody(headerKey); // 初始化，头
        var tableData = [];
        tableData.push('<table border="1">')
        tableData.push('<caption>');
        tableData.push(configs["fileName"]);
        tableData.push('</caption>');
        if (undefined != tableHeader) { // 头
            tableData.push(tableHeader.join(""))
        }
        if (undefined != tableBody) { // 数据
            tableData.push(tableBody.join(""))
        }
        tableData.push('</table>')
        return tableData.join("");
    }

    // 初始化， 导出
    function intExport(tableHtml) {
        //包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
        var html = "<html><head><meta charset='utf-8' /></head><body>" + tableHtml + "</body></html>";
        // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
        var blob = new Blob([html], {type: "application/vnd.ms-excel"});
        // 利用URL.createObjectURL()方法为a元素生成blob URL
        configs["domA"].href = URL.createObjectURL(blob);
        // 设置文件名，目前只有Chrome和FireFox支持此属性
        configs["domA"].download = configs["fileName"] + ".xls";
        var initSuccess = configs["initSuccess"]
        initSuccess();  // 表示加载完成可以导出了
    }

    // 根据url 加载数据
    function loadData(tableHeader, headerKey) {
        if (undefined != configs["requestUrl"]) {
            $.ajax({
                "url": configs["requestUrl"],
                "data": configs["requestData"],
                "dataType": configs["responseDataType"],
                "type": configs["requestType"],
                "success": function (result) {
                    configs["data"] = result; // 返回的json
                    var tableHtml = initTable(tableHeader, headerKey);
                    intExport(tableHtml); //初始化导出
                }
            });
        } else {
            var exce = new ExportException();
            exce.url_is_null();
            throw exce; // 抛出异常
        }
    }

    // 执行 导出
    this.onExport = function () {
        configs["domA"].click();
    }

    // 定义，异常类，消息和code
    function ExportException() {
        this.message = "内部错误";
        this.code = "100000";
        this.elea_is_null = function () {
            this.message = "导出按钮（A标签）为空";
            this.code = "100001";
        }
        this.data_is_null = function () {
            this.message = "数据源为空";
            this.code = "100002";
        }
        this.url_is_null = function () {
            this.message = "请求的url为空";
            this.code = "100003";
        }
        this.html_table_is_null = function () {
            this.message = "table导出时，缺失 el 。";
            this.code = "100004";
        }
    }

}