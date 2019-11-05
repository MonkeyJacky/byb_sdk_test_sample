# 币游宝SDK演示工程（需要cocoscreator运行环境）
该项目只用于代码演示，不作任何商业用途。



### 关键目录结构介绍
    android-src目录：包含native源码及sdk库文件，需要使用cocoscreator构建出android项目工程后将该目录下的内容覆盖拷贝到
    build/jsb-link/frameworks/runtime-src/proj.android-studio/app/目录下，再通过androidstudio编译运行即可。
    
    assets目录：包含前端所需资源及源码。
    
    assets/Script/3rd/bybapi.min.js为币游宝JS-SDK，适用于H5游戏，具体的接口使用的示例代码在assets/Script/h5/目录下，
    通过BYBSDK对象访问接口。
    
    assets/Script/app/下为app版游戏逻辑源码，其中需要配合native代码调用。
    
    具体sdk的使用方式不在该示例工程中详述。
