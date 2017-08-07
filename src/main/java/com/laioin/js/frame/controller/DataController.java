package com.laioin.js.frame.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IDEA
 * User qinxiancheng
 * Date on 2017/7/27
 * Time on 11:20
 */
@RequestMapping("/data")
@RestController
public class DataController {

    /**
     * 获取数据，
     *
     * @param size 生成几个数据
     * @return
     */
    @RequestMapping("/get.json")
    public List<Map<String, Object>> loadData(Integer size) {
        List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
        for (int i = 0; i < size; i++) {
            Map<String, Object> item = new HashMap<String, Object>();
            item.put("id", i);
            item.put("no", i);
            item.put("name", "Started Application in 7.004 seconds (JVM running for 7.381)" + 1);
            item.put("sex", "adfasd啊第十三届饭卡是两地分居拉水电费阿斯顿发婕拉送达房男" + 1);
            item.put("age", "12");
            item.put("yw", "撒打发斯蒂芬就撒电缆附件");
            item.put("sx", "92");
            item.put("yy", "啊打发几哈的看法撒旦法哈萨克金凤凰卡收到反馈举案说法说待会饭卡是就打发阿斯顿发哈喀什酒店反函数" + 1);
            data.add(item);
        }
        return data;
    }
}
