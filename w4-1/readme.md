# 作业1
![作业1](./homework.png)

# 总结
wagmi全称：We are all gonna make it，wagmi是一个React Hooks的集合，包含与以太坊交互所需的一切。

项目使用 wagmi 的脚手架 [create-wagmi](https://github.com/wagmi-dev/create-wagmi) 进行创建，使用的模板是 next-rainbowkit。

使用 [hardhat-abi-exporter](https://www.npmjs.com/package/hardhat-abi-exporter) 插件，导入到配置中后，运行 `npx hardhat export-abi` 后导出 abi 供前端使用。

使用 [@wagmi/cli](https://wagmi.sh/cli/getting-started) 生成配置文件，可以添加一些扩展插件。