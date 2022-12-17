// 筛选符合路由
export async function mapMenu(userMenu) {
  const routes = [];
  const modules = import.meta.glob("../router/main/*/*.js");
  for (const key in modules) {
    let mod = await modules[key]();
    let file = mod.default;
    const i = userMenu.find((item) => {
      return item.menuURL === file.path;
    });
    if (i) {
      routes.push(file);
    }
  }

  return routes;
}
